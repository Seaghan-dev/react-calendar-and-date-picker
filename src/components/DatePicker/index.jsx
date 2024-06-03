import { useState } from 'react';
import { useMask } from '@react-input/mask';
import {
  useFloating,
  useFocus,
  useDismiss,
  useInteractions,
  autoUpdate,
} from '@floating-ui/react';
import { DateTime } from 'luxon';

import './DatePicker.css';
import Calendar from '../Calendar';

// TODO
// reusability

export default function DatePicker() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const { refs, floatingStyles, context } = useFloating({
    open: showCalendar,
    onOpenChange: setShowCalendar,
    whileElementsMounted: autoUpdate,
  });
  const focus = useFocus(context);
  const dismiss = useDismiss(context, {
    escapeKey: false,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    focus,
    dismiss,
  ]);

  const inputRef = useMask({
    mask: 'YYYY-MM-DD',
    replacement: { Y: /\d/, M: /\d/, D: /\d/ },
    separate: true,
    showMask: true,
    track: ({ inputType, value, data, selectionStart }) => {
      const parsedData = Number(data);
      if (inputType === 'insert' && !isNaN(parsedData)) {
        let leadingNumber;
        switch (selectionStart) {
          case 4:
            // only allow values less than 1 for the month's leading number
            if (parsedData > 1) return null;
            break;
          case 6:
            leadingNumber = value.charAt(selectionStart - 1);
            // only allow values less than 3 if leading number is 1 for the month value
            if (leadingNumber === '1' && parsedData > 2) return null;
            break;
          case 7:
            if (data > 3) return null;
            break;
          case 9:
            // get month
            // 30 days month - April, June, September, November
            // 28 days month - feb (non leap year)
            // 29 days month - feb (leap year)
            leadingNumber = value.charAt(selectionStart - 1);
            // only allow values less than 2 if leading number is 3 for the day value
            if (leadingNumber === '3' && parsedData > 1) return null;
            break;
        }
      }

      return data;
    },
  });

  const handleCalendarSelect = (newDate) => {
    setSelectedDate(newDate);
    setShowCalendar(false);
  };

  const handleDateInput = (e) => {
    const newDate = e.currentTarget.value;
    const isValidDate = DateTime.fromISO(newDate).isValid;

    setSelectedDate(newDate);

    if (isValidDate) {
      setShowCalendar(false);
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <div
        className="date-picker-root"
        ref={refs.setReference}
        {...getReferenceProps()}
      >
        <span className="date-picker-icon">📅</span>
        <input
          ref={inputRef}
          placeholder="YYYY-MM-DD"
          className="date-picker-input"
          value={selectedDate ?? ''}
          onChange={handleDateInput}
        />
      </div>
      {showCalendar && (
        <div
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
        >
          <Calendar
            date={
              DateTime.fromISO(selectedDate).isValid
                ? selectedDate
                : DateTime.local().toISODate()
            }
            onSelect={handleCalendarSelect}
          />
        </div>
      )}
    </>
  );
}