import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Modal, Button } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { CalendarServices } from '../../../Services/CalendarServices.js';
import { handlePayment }from "../../Razorpay/Payment.js";

// Extend dayjs with required plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export const BookButton = ({ selectedDate, selectedTime, durationId, mentorData, selectedTimezone , mentorId  }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [readableStartDateTime, setReadableStartDateTime] = useState('');
  const [readableEndDateTime, setReadableEndDateTime] = useState('');
  const [localStartDateTime, setLocalStartDateTime] = useState('');
  const [localEndDateTime, setLocalEndDateTime] = useState('');

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const {duration} = durationId;
  const {
     email : userEmail,
    user_id,
    userName,
    
  } = useSelector((store) => store.auth.loginDetails);



  useEffect(() => {
    if (durationId && mentorData.sessions) {
      const { id } = durationId;


      if (id && mentorData.sessions) {
        const curSession = mentorData.sessions.find(session => session._id === id);
        
        if (curSession) {
          // Log the current session to the console
          console.log('Current Session:', curSession);
          
          // Set the selected session
          setSelectedSession(curSession);
        }

        if (selectedDate && selectedTime) {
          const { localStartDateTime, localEndDateTime } = convertToLocalTimeZone(selectedDate, selectedTime, selectedTimezone, duration);
          setLocalStartDateTime(localStartDateTime);
          setLocalEndDateTime(localEndDateTime);
          setReadableStartDateTime(dayjs(localStartDateTime).format('h:mm A, D MMMM YYYY'));
          setReadableEndDateTime(dayjs(localEndDateTime).format('h:mm A, D MMMM YYYY'));
        }
      } else {
        console.log('Session not found.');
      }
    }
  }, [durationId, mentorData, selectedDate, selectedTime, selectedTimezone]);

  const convertToLocalTimeZone = (dateObject, selectedTime, timeZone, durationInMinutes) => {
    const localDate = dayjs(dateObject.$d);
    const [time, period] = selectedTime.split(/(am|pm)/i);
    const [hour, minute] = time.split(':').map(Number);

    let adjustedHour = hour;
    if (period.toLowerCase() === 'pm' && hour !== 12) {
      adjustedHour += 12;
    } else if (period.toLowerCase() === 'am' && hour === 12) {
      adjustedHour = 0;
    }

    const localDateTime = localDate
      .set('hour', adjustedHour)
      .set('minute', minute)
      .set('second', 0)
      .tz(timeZone);

    const endDateTime = localDateTime.add(durationInMinutes, 'minute');

    return {
      localStartDateTime: localDateTime.format(), // Return the local date-time in ISO 8601 format
      localEndDateTime: endDateTime.format()      // Return the end date-time in ISO 8601 format
    };
  };

  const handleBookSession = () => {
    handleOpenModal();
    console.log(userEmail)
    console.log('session', selectedSession)

    if (selectedDate && selectedTime && durationId && selectedSession) {
      const { localStartDateTime, localEndDateTime } = convertToLocalTimeZone(selectedDate, selectedTime, selectedTimezone, durationId.duration);
      setLocalStartDateTime(localStartDateTime);
      setLocalEndDateTime(localEndDateTime);

      setReadableStartDateTime(dayjs(localStartDateTime).format('h:mm A, D MMMM YYYY'));
      setReadableEndDateTime(dayjs(localEndDateTime).format('h:mm A, D MMMM YYYY'));
    } else {
      console.log('Please select both a date and a time.');
    }
  };

  const handleConfirmBooking = async () => {


  const {amount,title,description } = selectedSession;
  const currency = 'INR';
  const userContact = "1234567890"; 
  const {mentorTimezone } = mentorData;
  
  console.log('amount', amount)

  function convertToUTC(localDateTime) {
    return dayjs(localDateTime).utc().format();
}

const startDateTimeUTC = dayjs(localStartDateTime).utc().format();
const endDateTimeUTC = dayjs(localEndDateTime).utc().format();

  console.log('Local Start Time:', localStartDateTime);
  console.log('Converted Start Time to UTC:', startDateTimeUTC);



  const bookingData = {
    mentorId, user_id ,mentorTimezone,amount, currency, startDateTimeUTC, endDateTimeUTC, selectedTimezone, duration, title, description
  }



    const eventDetails = {
      summary: title,
      description: description,
      startTime: localStartDateTime,
      endTime: localEndDateTime,
      timeZone: selectedTimezone,
      attendees: [userEmail],
    };

 

    const saveBookingDataCallback = async (paymentId, paymentResponse) => {

     
      try {
        // Call the function to book the session
        const bookingResponse = await CalendarServices.bookSession({ eventDetails, mentorId });
        console.log('Booking successful:', bookingResponse);
  
       const saveResponse =  await CalendarServices.saveBookData({bookingData});
       console.log('saved bookData successful:', saveResponse);
  
  
      } catch (bookingError) {
        console.error('Error booking session:', bookingError);
        // Handle booking error
      } finally {
        handleCloseModal();
      }
    };
  
    const onPaymentSuccessCallbacks = [saveBookingDataCallback]

    await handlePayment(
      amount,
      currency,
      userName,
      userEmail,
      userContact,
      user_id,
      onPaymentSuccessCallbacks
    );
  };

 

  return (
    <div className="book-button-container">
      <button className="book-button" onClick={handleBookSession}>
        Book Session Now
      </button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2" id="modal-title">
            Booking Confirmation
          </Typography>

          {selectedSession ? (
            <>
              <Typography variant="body1">
                <strong>Start DateTime:</strong> {readableStartDateTime}
              </Typography>
              <Typography variant="body1">
                <strong>End DateTime:</strong> {readableEndDateTime}
              </Typography>
              <Typography variant="body1" id="modal-description">
                <strong>Title:</strong> {selectedSession.title}
              </Typography>
              <Typography variant="body1">
                <strong>Description:</strong> {selectedSession.description}
              </Typography>
              <Typography variant="body1">
                <strong>Duration:</strong> {selectedSession.duration} minutes
              </Typography>
              <Typography variant="body1">
                <strong>Amount:</strong> ${selectedSession.amount}
              </Typography>

              <Button variant="contained" color="primary" onClick={handleConfirmBooking}>
                Confirm Booking
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </>
          ) : (
            <Typography variant="body2">Session data not found.</Typography>
          )}
        </Box>
      </Modal>
    </div>
  );
};
