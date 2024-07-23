import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './BookSession.css'; 
import { Divider } from '@mui/material';

const BookSession = ({name}) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState('30 Minutes');
  const [selectedTime, setSelectedTime] = useState(null);
  const timeSlots = ['2:30am', '4:00am', '6:30am'];

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
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
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        inline
        calendarClassName="custom-calendar"
      />

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
