import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Modal, Button, TextField, Alert, Divider, Grid } from '@mui/material';
import { CalendarServices } from '../../../Services/CalendarServices.js';
import { handlePayment } from '../../Razorpay/Payment.js';
import { ApiServices } from '../../../Services/ApiServices.js';
import { convertToLocalTimeZone } from './helper.js';
import dayjs from 'dayjs';


export const BookButton = ({ selectedDate, selectedTime, durationId, mentorData, selectedTimezone, mentorId }) => {
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

  const { duration } = durationId;
  const { email: userEmail, user_id, userName } = useSelector((store) => store.auth.loginDetails);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (durationId && mentorData.sessions) {
      const { id } = durationId;
      if (id && mentorData.sessions) {
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
  }, [durationId, mentorData, selectedDate, selectedTime, selectedTimezone]);

  const updateSessionTimeDetails = (session) => {
    if (selectedDate && selectedTime) {
      const { localStartDateTime, localEndDateTime } = convertToLocalTimeZone(selectedDate, selectedTime, selectedTimezone, duration);
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
    if (!selectedSession || selectedSession.amount === null) {
      setError("Amount information is missing. Unable to proceed.");
      return;
    }

    if (selectedSession.amount === 0) {
      // Directly save booking without payment if amount is 0
      saveBookingDataCallback();
    } else {
      // Proceed to payment if amount is not zero
      // Payment logic removed as per request
     
    

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
      const bookingResponse = await CalendarServices.bookSession({ eventDetails, mentorId });
      console.log('Booking successful:', bookingResponse);

      const saveResponse = await CalendarServices.saveBookData({ bookingData });
      console.log('Saved booking data:', saveResponse);

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
    <Button variant="contained" color="primary" onClick={handleOpenModal}>
      Book Session Now
    </Button>
  
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
          width: 800,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container spacing={2}>
          {/* Left Section with Session Details */}
          <Grid item xs={8}>
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
                <Typography variant="body1">
                  <strong>Title:</strong> {selectedSession.title}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedSession.description}
                </Typography>
                <Typography variant="body1">
                  <strong>Duration:</strong> {selectedSession.duration} minutes
                </Typography>
                {selectedSession.amount !== null && (
                  <>
                    <Typography variant="body1">
                      <strong>Original Amount:</strong> Rs {selectedSession.amount}
                    </Typography>
                    {discountedAmount !== null && (
                      <>
                        <Typography variant="body1">
                          <strong>Discount:</strong> {discountPercent}% (Rs {discountedAmount})
                        </Typography>
                        <Typography variant="body1">
                          <strong>Final Amount:</strong> Rs {finalAmount}
                        </Typography>
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <Typography variant="body1">No session selected.</Typography>
            )}
          </Grid>
  
          {/* Right Section with Coupons */}
          <Grid item xs={4} sx={{ borderLeft: '1px solid #ddd', pl: 2 }}>
            {selectedSession && selectedSession.amount > 0 && (
              <>
                <Typography variant="h6" component="h3" gutterBottom>
                  Available Coupons
                </Typography>
                {coupons.map(coupon => (
                  <Box key={coupon._id} sx={{ mb: 2 }}>
                    <Typography variant="body1">
                      <strong>Code:</strong> {coupon.code}
                    </Typography>
                    <Typography variant="body1">
                      <strong>Discount:</strong> {coupon.discount}%
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                  </Box>
                ))}
  
                <TextField
                  label="Enter coupon code"
                  variant="outlined"
                  fullWidth
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  disabled={discountedAmount !== null}
                  sx={{ mb: 2 }}
                />
  
                <Grid container justifyContent="space-between" spacing={2}>
                  <Grid item>
                    <Button
                      variant="contained"
                      color="primary"
                      disabled={discountedAmount !== null}
                      onClick={applyCoupon}
                    >
                      Apply Coupon
                    </Button>
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={discountedAmount === null}
                      onClick={handleClearCoupon}
                    >
                      Clear Coupon
                    </Button>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
  
        {/* Bottom Section for Confirm and Cancel Buttons */}
        <Grid container justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleConfirmBooking} sx={{ mx: 2 }}>
              Confirm Booking
            </Button>
          </Grid>
          <Grid item>
            <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ mx: 2 }}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  </div>
  
  );
};
