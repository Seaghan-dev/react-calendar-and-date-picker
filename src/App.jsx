import { useState } from 'react';
import { DateTime } from 'luxon';

import './App.css';
import Calendar from './components/Calendar';
import DatePicker from './components/DatePicker';

function App() {
  const [date, setDate] = useState(DateTime.local().toISODate());
  return (
    <div className="app-root">
      <div>
        <Calendar date={date} onSelect={setDate} />
      </div>
      <DatePicker />
    </div>
  );
}

export default App;
