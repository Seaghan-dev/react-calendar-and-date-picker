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
  const [selectedDate, setSelectedDate] = useState(date ? currentDate : date);
  const [viewingDate, setViewingDate] = useState(currentDate)

  const previousMonthDate = viewingDate.minus({ months: 1 });
  const nextMonthDate = viewingDate.plus({ months: 1 });

  const monthDays = Array.from(
    new Array(viewingDate.daysInMonth),
    (_, index) => ++index
  );

  const previousMonthDays = Array.from(
    new Array(viewingDate.startOf('month').weekday),
    (_, index) => previousMonthDate.daysInMonth - index
  ).reverse();

  const nextMonthDays = Array.from(
    new Array(totalDaysCell - (monthDays.length + previousMonthDays.length)),
    (_, index) => ++index
  );

  const yearRange = getYearRange(viewingDate.year);
  const lastPreviousYear = yearRange[0] - 1;
  const firstFollowingYear = yearRange[yearRange.length - 1] + 1;

  const handlePreviousNavigation = () => {
    if (calendarView === 'day') {
      const newDate = viewingDate.minus({ months: 1 });
      setViewingDate(newDate);
    } else if (calendarView === 'month') {
      const newDate = viewingDate.minus({ year: 1 });
      setViewingDate(newDate);
    } else if (calendarView === 'year') {
      const newDate = viewingDate.set({ year: lastPreviousYear });
      setViewingDate(newDate);
    }
  };
  const handleNextNavigation = () => {
    if (calendarView === 'day') {
      const newDate = viewingDate.plus({ months: 1 });
      setViewingDate(newDate);
    } else if (calendarView === 'month') {
      const newDate = viewingDate.plus({ year: 1 });
      setViewingDate(newDate);
    } else if (calendarView === 'year') {
      const newDate = viewingDate.set({ year: firstFollowingYear });
      setViewingDate(newDate);
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
      year: viewingDate.year,
      month: viewingDate.month,
      day: value,
    });
    setSelectedDate(newDate);
    setViewingDate(newDate)
    onSelect?.(newDate.toISODate());
  };
  const handleSelectPreviousMonthDay = (value) => {
    const newDate = DateTime.fromObject({
      year: viewingDate.year,
      month: viewingDate.month - 1,
      day: value,
    });
    setSelectedDate(newDate);
    setViewingDate(newDate)
    onSelect?.(newDate.toISODate());
  };
  const handleSelectNextMonthDay = (value) => {
    const newDate = DateTime.fromObject({
      year: viewingDate.year,
      month: viewingDate.month + 1,
      day: value,
    });
    setSelectedDate(newDate);
    setViewingDate(newDate)
    onSelect?.(newDate.toISODate());
  };

  const handleSelectMonth = (value) => {
    const newDate = DateTime.fromObject({
      year: viewingDate.year,
      month: value,
      day: viewingDate.day,
    });
    setViewingDate(newDate);
    setCalendarView('day');
  };

  const handleSelectYear = (value) => {
    const newDate = DateTime.fromObject({
      year: value,
      month: viewingDate.month,
      day: viewingDate.day,
    });
    setViewingDate(newDate);
    setCalendarView('month');
  };

  let calendarTitle;
  switch (calendarView) {
    case 'day':
      calendarTitle = `${viewingDate.monthLong} ${viewingDate.year}`;
      break;
    case 'month':
      calendarTitle = viewingDate.year;
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
              key={`${viewingDate.month}_${item}`}
              className="calendar-days-view-item"
              data-selected={
                selectedDate?.month === viewingDate.month &&
                viewingDate.day === item &&
                selectedDate?.year === viewingDate.year
              }
              data-is-date-today={
                viewingDate.month === dateToday.month && item === dateToday.day
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
              key={item}
              className="calendar-months-view-item"
              data-selected={selectedDate?.monthShort === item && selectedDate?.year === viewingDate.year}
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
              data-selected={selectedDate?.year === item}
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
