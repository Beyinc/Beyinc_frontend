import React from 'react';
import { CalendarServices } from '../../Services/CalendarServices';
import  MyCalendar  from './CalBook';
import BookSession from '../Editprofile/BookSession/BookSession2';
const Calendar = () => {
  const handleAuth = async () => {
    console.log('handleAuth working');
    try {
      // Fetch the URL from the service
      const obj = await CalendarServices.calenderAuth();
      // Open the URL in a new window
      console.log(obj.data.url);
      window.open(obj.data.url);
    } catch (error) {
      console.error('Error fetching the auth URL:', error.message);
    }
  };

  return (
    <>
    <button onClick={handleAuth}>
      Authorize Google Calendar
    </button>

    <div>
    <h1>Book a Time Slot</h1>
    <BookSession />
    </div>

    </>
  );
};

export default Calendar;
