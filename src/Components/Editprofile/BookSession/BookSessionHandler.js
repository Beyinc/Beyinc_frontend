import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Modal, Button, TextField, Alert, Divider, Grid } from '@mui/material';
import { CalendarServices } from '../../../Services/CalendarServices.js';
import { handlePayment } from '../../Razorpay/Payment.js';
import { ApiServices } from '../../../Services/ApiServices.js';
import { convertToLocalTimeZone } from './helper.js';
import dayjs from 'dayjs';
import './BookSession.css'; 

export const BookButton = ({ selectedDate, selectedTime, durationId, mentorData, selectedTimezone, mentorId, reschedule, rescheduleBooking }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [readableStartDateTime, setReadableStartDateTime] = useState('');
  const [readableEndDateTime, setReadableEndDateTime] = useState('');
  const [localStartDateTime, setLocalStartDateTime] = useState('');
  const [localEndDateTime, setLocalEndDateTime] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discountedAmount, setDiscountedAmount] = useState(null);
  const [finalAmount, setFinalAmount] = useState(null);
  const [discountPercent, setDiscountPercent] = useState(null);
  const [error, setError] = useState('');
  const [coupon, setCoupon] = useState('');
  const navigate = useNavigate();
  const { duration } = durationId;
  const { email: userEmail, user_id, userName } = useSelector((store) => store.auth.loginDetails);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  console.log('reshedule', reschedule)
   console.log(' reschedule booking', rescheduleBooking, selectedDate,selectedTime)






  useEffect(() => {
    if (reschedule) {
      setSelectedSession(rescheduleBooking);
      updateSessionTimeDetails();
    } else {
      if (durationId && mentorData.sessions) {
        const { id } = durationId;
        const curSession = mentorData.sessions.find(session => session._id === id);
          if (curSession) {
            setSelectedSession(curSession);
            updateSessionTimeDetails(curSession);
          }
      }
    }
    





    // Fetch coupons
    ApiServices.getCoupons()
      .then(couponData => setCoupons(couponData.data))
      .catch(error => console.error('Error fetching coupons:', error));
  }, [durationId, mentorData, selectedDate, selectedTime, selectedTimezone,reschedule]);


  const updateSessionTimeDetails = () => {
    
    if (selectedDate && selectedTime) {
      const durationTime = reschedule ? rescheduleBooking.duration : duration;
      const { localStartDateTime, localEndDateTime } = convertToLocalTimeZone(selectedDate, selectedTime, selectedTimezone, durationTime);
      setLocalStartDateTime(localStartDateTime);
      setLocalEndDateTime(localEndDateTime);
      setReadableStartDateTime(dayjs(localStartDateTime).format('h:mm A, D MMMM YYYY'));
      setReadableEndDateTime(dayjs(localEndDateTime).format('h:mm A, D MMMM YYYY'));
    }
  };



  const applyCoupon = () => {
    if (!selectedSession || selectedSession.amount === null) {
      setError("Amount information is missing. Please try again.");
      return;
    }

    const selectedCoupon = coupons.find(coupon => coupon.code === couponCode);
    
    console.log(selectedCoupon);
    if (selectedCoupon) {
      const discount = (selectedSession.amount * selectedCoupon.discount) / 100;
      setCoupon(selectedCoupon)
      setDiscountedAmount(discount);
      setFinalAmount(selectedSession.amount - discount);
      setDiscountPercent(selectedCoupon.discount);
      setError('');
    } else {
      setError('Invalid coupon code');
    }
  };

  const handleClearCoupon = () => {
    setCouponCode('');
    setDiscountedAmount(null);
    setFinalAmount(null);
    setDiscountPercent(null);
    setError('');
  };


  const handleConfirmBooking = async () => {
    if (reschedule) {
      // Directly save booking if it's a rescheduled booking
      saveBookingDataCallback();
      return;
    }
    if (!selectedSession || selectedSession.amount === null) {
      setError("Amount information is missing. Unable to proceed.");
      return;
    }

    if (selectedSession.amount === 0) {
      // Directly save booking without payment if amount is 0
      console.log('normal booking is also being called')
      saveBookingDataCallback();
    } else {
     

      const currency= 'INR';
      const contact = 7522966416

      handlePayment(
        finalAmount || selectedSession.amount, // amount
        currency, // currency
        userName, // name
        userEmail, // email
        contact, // contact
        [saveBookingDataCallback] // payment success callbacks
          );
    }
  };

  const saveBookingDataCallback = async () => {
    if (!selectedSession || selectedSession.amount === null) {
      setError("Amount information is missing. Unable to proceed.");
      return;
    }

    const { amount, title, description } = selectedSession;
    const currency = 'INR';
    const userContact = "1234567890"; // Dummy contact

    const startDateTimeUTC = dayjs(localStartDateTime).utc().format();
    const endDateTimeUTC = dayjs(localEndDateTime).utc().format();

    const bookingData = {
      mentorId,
      user_id,
      mentorTimezone: mentorData.mentorTimezone,
      amount, 
      finalAmount,
      discountPercent,
      currency,
      startDateTimeUTC,
      endDateTimeUTC,
      selectedTimezone,
      duration,
      title,
      description,
    };

    const eventDetails= { 
        title,
        description,
        startDateTimeUTC,
        endDateTimeUTC,
        attendees: [userEmail],
    };





    try {

      if (!reschedule) {
        const bookingResponse = await CalendarServices.bookSession({ eventDetails, mentorId, bookingData });
        console.log('Booking successful:', bookingResponse);
        // navigate('/dashboard/userBookings');
window.location.href = '/dashboard/userBookings';
      } else {
        const rescheduleResponse = await CalendarServices.reschedule({ eventDetails, mentorId, bookingData, rescheduleBooking });
        console.log('Rescheduling response:', rescheduleResponse);
      }
     // Update coupon status if a coupon is selected
     console.log('coupon found:', coupon)
      if (coupon) {
        const couponResponse = await ApiServices.updateCoupon({ coupon });
        console.log('Coupon updated:', couponResponse);
        
      }

      handleCloseModal();
    } catch (error) {
      console.error('Error saving booking:', error);
      setError('An error occurred while saving the booking. Please try again.');
    }
  };

  return (
    <div className="book-button-container">
    <button className="book-button"  onClick={handleOpenModal}>
      Book Session Now
    </button>
  
    <Modal open={isModalOpen} onClose={handleCloseModal}>
  <Box
    sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 700,
      bgcolor: '#fff',
      borderRadius: 3,
      boxShadow: 24,
      overflow: 'hidden',
    }}
  >
    {/* Header */}
    <Box
      sx={{
        px: 3,
        py: 2,
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" fontWeight={600}>
        Booking Confirmation
      </Typography>

      <Button onClick={handleCloseModal} sx={{ minWidth: 'auto' }}>
        ✕
      </Button>
    </Box>

    {/* Content */}
    <Box sx={{ p: 3 }}>
      {selectedSession ? (
        <>
          <Typography><b>Start:</b> {readableStartDateTime}</Typography>
          <Typography><b>End:</b> {readableEndDateTime}</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography><b>Title:</b> {selectedSession.title}</Typography>
          <Typography><b>Description:</b> {selectedSession.description}</Typography>
          <Typography><b>Duration:</b> {selectedSession.duration} minutes</Typography>

          <Divider sx={{ my: 2 }} />

          <Typography fontSize={18}>
            <b>Amount:</b> ₹{selectedSession.amount}
          </Typography>
        </>
      ) : (
        <Typography>No session selected.</Typography>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>

    {/* Footer */}
    <Box
      sx={{
        px: 3,
        py: 2,
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <Button variant="contained" onClick={handleConfirmBooking}>
        Confirm Booking
      </Button>
      <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
        Cancel
      </Button>
    </Box>
  </Box>
</Modal>

  </div>
  
  );
};
