import { useState } from 'react';
import { Info, DateTime } from 'luxon';

import './Calendar.css';

function getYearRange(currentYear) {
  const currentYearString = currentYear.toString();
  const startYear = parseInt(
    currentYearString.substring(0, currentYearString.length - 1) + '0'
  );

  const yearRange = Array.from(new Array(10), (_, index) => startYear + index);

  return yearRange;
}

const totalDaysCell = 42;
const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const months = Info.months('short');
const dateToday = DateTime.local();

export default function Calendar({ date = null, onSelect }) {
  const currentDate = DateTime.fromJSDate(new Date(date)).startOf('day');

  const [calendarView, setCalendarView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(currentDate);

  const previousMonthDate = selectedDate.minus({ months: 1 });
  const nextMonthDate = selectedDate.plus({ months: 1 });

  const monthDays = Array.from(
    new Array(selectedDate.daysInMonth),
    (_, index) => ++index
  );

  const yearRange = getYearRange(selectedDate.year);
  const lastPreviousYear = yearRange[0] - 1;
  const firstFollowingYear = yearRange[yearRange.length - 1] + 1;

  const previousMonthDays = Array.from(
    new Array(selectedDate.startOf('month').weekday),
    (_, index) => previousMonthDate.daysInMonth - index
  ).reverse();

  const nextMonthDays = Array.from(
    new Array(totalDaysCell - (monthDays.length + previousMonthDays.length)),
    (_, index) => ++index
  );

  const handlePreviousNavigation = () => {
    if (calendarView === 'day') {
      const newDate = selectedDate.minus({ months: 1 });
      setSelectedDate(newDate);
    } else if (calendarView === 'month') {
      const newDate = selectedDate.minus({ year: 1 });
      setSelectedDate(newDate);
    } else if (calendarView === 'year') {
      const newDate = selectedDate.set({ year: lastPreviousYear });
      setSelectedDate(newDate);
    }
  };
  const handleNextNavigation = () => {
    if (calendarView === 'day') {
      const newDate = selectedDate.plus({ months: 1 });
      setSelectedDate(newDate);
    } else if (calendarView === 'month') {
      const newDate = selectedDate.plus({ year: 1 });
      setSelectedDate(newDate);
    } else if (calendarView === 'year') {
      const newDate = selectedDate.set({ year: firstFollowingYear });
      setSelectedDate(newDate);
    }
  };

  const handleCalendarView = () => {
    switch (calendarView) {
      case 'day':
        setCalendarView('month');
        break;
      case 'month':
        setCalendarView('year');
        break;
    }
  };

  const handleSelectDay = (value) => {
    const newDate = DateTime.fromObject({
      year: selectedDate.year,
      month: selectedDate.month,
      day: value,
    });
    setSelectedDate(newDate);
    onSelect?.(newDate.toISODate());
  };
  const handleSelectPreviousMonthDay = (value) => {
    const newDate = DateTime.fromObject({
      year: selectedDate.year,
      month: selectedDate.month - 1,
      day: value,
    });
    setSelectedDate(newDate);
    onSelect?.(newDate.toISODate());
  };
  const handleSelectNextMonthDay = (value) => {
    const newDate = DateTime.fromObject({
      year: selectedDate.year,
      month: selectedDate.month + 1,
      day: value,
    });
    setSelectedDate(newDate);
    onSelect?.(newDate.toISODate());
  };

  const handleSelectMonth = (value) => {
    const newDate = DateTime.fromObject({
      year: selectedDate.year,
      month: value,
      day: selectedDate.day,
    });
    setSelectedDate(newDate);
    setCalendarView('day');
  };

  const handleSelectYear = (value) => {
    const newDate = DateTime.fromObject({
      year: value,
      month: selectedDate.month,
      day: selectedDate.day,
    });
    setSelectedDate(newDate);
    setCalendarView('month');
  };

  let calendarTitle;
  switch (calendarView) {
    case 'day':
      calendarTitle = `${selectedDate.monthLong} ${selectedDate.year}`;
      break;
    case 'month':
      calendarTitle = selectedDate.year;
      break;
    case 'year':
      calendarTitle = `${yearRange[0]}-${yearRange[yearRange.length - 1]}`;
      break;
  }

  return (
    <div className="calendar-root">
      <div className="calendar-header">
        <button
          className="calendar-header-nav"
          onClick={handlePreviousNavigation}
        >
          {'<'}
        </button>
        <button className="calendar-header-title" onClick={handleCalendarView}>
          {calendarTitle}
        </button>
        <button className="calendar-header-nav" onClick={handleNextNavigation}>
          {'>'}
        </button>
      </div>
      {calendarView === 'day' && (
        <div className="calendar-days-view">
          {weekdays.map((item) => (
            <span key={item} className="calendar-days-view-item">
              {item}
            </span>
          ))}
          {previousMonthDays.map((item) => (
            <button
              key={`${previousMonthDate.month}_${item}`}
              className="calendar-days-view-item not-in-current-view"
              data-is-date-today={
                previousMonthDate.month === dateToday.month &&
                item === dateToday.day
              }
              onClick={() => handleSelectPreviousMonthDay(item)}
            >
              {item}
            </button>
          ))}
          {monthDays.map((item) => (
            <button
              key={`${selectedDate.month}_${item}`}
              className="calendar-days-view-item"
              data-selected={
                selectedDate.month === currentDate.month &&
                currentDate.day === item &&
                selectedDate.year === currentDate.year
              }
              // data-selected={selectedDate.day === item}
              data-is-date-today={
                selectedDate.month === dateToday.month && item === dateToday.day
              }
              onClick={() => {
                handleSelectDay(item);
              }}
            >
              {item}
            </button>
          ))}
          {nextMonthDays.map((item) => (
            <button
              key={`${nextMonthDate.month}_${item}`}
              className="calendar-days-view-item not-in-current-view"
              data-is-date-today={
                nextMonthDate.month === dateToday.month &&
                item === dateToday.day
              }
              onClick={() => handleSelectNextMonthDay(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {calendarView === 'month' && (
        <div className="calendar-months-view">
          {months.map((item, index) => (
            <button
              kay={item}
              className="calendar-months-view-item"
              data-selected={selectedDate.monthShort === item}
              onClick={() => handleSelectMonth(++index)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
      {calendarView === 'year' && (
        <div className="calendar-years-view">
          <button
            className="calendar-years-view-item not-in-current-view"
            onClick={() => handleSelectYear(lastPreviousYear)}
          >
            {lastPreviousYear}
          </button>
          {yearRange.map((item) => (
            <button
              key={item}
              className="calendar-years-view-item"
              data-selected={selectedDate.year === item}
              onClick={() => handleSelectYear(item)}
            >
              {item}
            </button>
          ))}
          <button
            className="calendar-years-view-item not-in-current-view"
            onClick={() => handleSelectYear(firstFollowingYear)}
          >
            {firstFollowingYear}
          </button>
        </div>
      )}
    </div>
  );
}
