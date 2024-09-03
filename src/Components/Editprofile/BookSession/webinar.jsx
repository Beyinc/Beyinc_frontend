import React, { useState } from 'react';
import { Button, Modal, Box, Typography, Divider, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { handlePayment } from '../../Razorpay/Payment.js';
import { CalendarServices } from '../../../Services/CalendarServices.js';

const WebinarModal = ({ mentorId, mentorData }) => {
  const [open, setOpen] = useState(false);
  const [selectedWebinar, setSelectedWebinar] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const webinarDetails = mentorData?.webinars || []; // Safe fallback to an empty array if webinars are undefined or null

  const handleWebinarSelect = (event) => {
    const selectedId = event.target.value;
    const webinar = webinarDetails.find(w => w._id === selectedId);
    setSelectedWebinar(webinar);
  };

  const handleWebinar = async () => {
    if (!selectedWebinar) return;

    const { eventId, amount, title } = selectedWebinar;

    // Mock user data - replace with actual user info
    const userName = 'Jane Smith';
    const userEmail = 'jane.smith@example.com';
    const userContact = '9876543211';
    const user_id = '654321';

    const saveWebinarData = async (paymentId, paymentResponse) => {
      await CalendarServices.addWebinarUser({ mentorId, eventId });
      console.log('Webinar data save successful');
    };

    const onPaymentSuccessCallbacks = [saveWebinarData];
    await handlePayment(amount, 'INR', userName, userEmail, userContact, user_id, onPaymentSuccessCallbacks);
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleOpen}>
        Select Webinar
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="webinar-modal-title"
        aria-describedby="webinar-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="webinar-modal-title" variant="h6" component="h2">
            Select a Webinar
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          <RadioGroup
            aria-label="webinar"
            name="webinar-group"
            value={selectedWebinar ? selectedWebinar._id : ''}
            onChange={handleWebinarSelect}
          >
            {webinarDetails.length > 0 ? (
              webinarDetails.map(webinar => (
                <FormControlLabel
                  key={webinar._id}
                  value={webinar._id}
                  control={<Radio />}
                  label={`${webinar.title} - ${new Date(webinar.startDateTime).toLocaleDateString()} - ₹${webinar.amount}`}
                />
              ))
            ) : (
              <Typography>No webinars available</Typography>
            )}
          </RadioGroup>

          {selectedWebinar && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography id="webinar-modal-description" sx={{ mb: 2 }}>
                <strong>Title:</strong> {selectedWebinar.title} <br />
                <strong>Date:</strong> {new Date(selectedWebinar.startDateTime).toLocaleDateString()} <br />
                <strong>Time:</strong> {new Date(selectedWebinar.startDateTime).toLocaleTimeString()} - {new Date(selectedWebinar.endDateTime).toLocaleTimeString()} (UTC) <br />
                <strong>Price:</strong> ₹{selectedWebinar.amount}
              </Typography>
            </>
          )}
          
          <Button variant="contained" color="success" onClick={handleWebinar} disabled={!selectedWebinar}>
            Confirm Pay
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export default WebinarModal;
