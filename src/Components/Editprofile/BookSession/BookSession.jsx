import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookSession.css'; 
import { Divider } from '@mui/material';

const BookSession = ({ name }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState('30 Minutes');
  const [selectedTime, setSelectedTime] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const timeSlots = ['2:30am', '4:00am', '6:30am'];

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  };

  const changeMonth = (offset) => {
    let newMonth = currentMonth + offset;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  return (
    <div className="BookSession-Container">
      <h2 className="title">Book a session with {name}</h2>
      <label className="label">Duration</label>
      <select className="select" value={duration} onChange={(e) => setDuration(e.target.value)}>
        <option value="30 Minutes">30 Minutes</option>
        <option value="1 Hour">1 Hour</option>
      </select>
      <label className="label">Availability</label>
      <div className="date-navigation">
        {/* <button className="nav-button" onClick={() => changeMonth(-1)}>Previous Month</button> */}
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          inline
          calendarClassName="custom-calendar"
          renderCustomHeader={({
            date,
            changeYear,
            changeMonth,
            decreaseMonth,
            increaseMonth,
            prevMonthButtonDisabled,
            nextMonthButtonDisabled
          }) => (
            <div className="datepicker-header">
              
              <select
              className='select-year'
                value={date.getFullYear()}
                onChange={({ target: { value } }) => changeYear(value)}
              >
                {Array(10).fill(0).map((_, i) => (
                  <option key={i} value={currentYear + i}>
                    {currentYear + i}
                  </option>
                ))}
              </select>

              <select
                            className='select-year'

                value={date.getMonth()}
                onChange={({ target: { value } }) => changeMonth(value)}
              >
                {Array(12).fill(0).map((_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString('default', { month: 'long' })}
                  </option>
                ))}
              </select>
              {/* <span onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                {'<'}
              </span>
              <span onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                {'>'}
              </span> */}
            </div>
          )}
        />
        {/* <button className="nav-button" onClick={() => changeMonth(1)}>Next Month</button> */}
      </div>

      {selectedDate && (
        <>
          <label className="label">{`${formatDate(selectedDate)}`}</label>
          <div className="time-slot-container">
            {timeSlots.map(time => (
              <button
                key={time}
                className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}
      <Divider style={{ borderColor: 'lightgray' }} />

      <div className="book-button-container">
        <button className="book-button">Book Session Now</button>
      </div>
    </div>
  );
};

export default BookSession;
