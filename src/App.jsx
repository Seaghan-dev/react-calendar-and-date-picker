import { useState } from 'react';

import './App.css';
import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';

function App() {
  const [calendarDate, setCalendarDate] = useState(null);

  return (
    <div className="app-root">
      <div>
        <Calendar date={calendarDate} onSelect={setCalendarDate} />
      </div>
      <div>
        <DatePicker />
      </div>
    </div>
  );
}

export default App;
