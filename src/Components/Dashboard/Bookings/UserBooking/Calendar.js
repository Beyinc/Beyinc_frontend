import React, { useState, useEffect } from 'react';
import { CalendarServices } from '../../../../Services/CalendarServices';

import BookSession from '../../../Editprofile/BookSession/BookSession2.jsx';

const RescheduleCalendar = ({ rescheduleBooking, onClose }) => {
  const [bookings, setBookings] = useState([]);
  // const [rescheduleBooking, setRescheduleBooking] = useState(null); // Renamed from selectedBooking
  const [reschedule, setReschedule] = useState(true); // Initialize reschedule state
  const userId = '66a734542ef18cf3c5425a27'; 
  const eventId = "m3lombl4or4fh9uk78nr5m974c";

  console.log('rescheduleBooking', rescheduleBooking)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { bookings } = await CalendarServices.getBooking();
        console.log('All bookings:', bookings);
        const filteredBookings = bookings.filter(booking => booking.userId === userId);
        console.log('Filtered bookings:', filteredBookings);

        // Search for the booking with the specified eventId
        const booking = filteredBookings.find(booking => booking.eventId === eventId);
        console.log('Reschedule booking:', booking); // Updated console log

        // // Set the reschedule booking state
        // setRescheduleBooking(booking); // Renamed from setSelectedBooking

        // Optionally, set the bookings state as well
        setBookings(filteredBookings);

      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, [userId, eventId]); // Dependency array includes userId and eventId to refetch if they change

  return (
    <>
      <div>
        <h1>Reschedule</h1>
        <BookSession 
          rescheduleBooking={rescheduleBooking} // Updated prop name
          mentorId={rescheduleBooking ? rescheduleBooking.mentorId : null} 
          reschedule={reschedule} // Pass the reschedule state
        />
      </div>
    </>
  );
};

export default RescheduleCalendar;
