// Calendar.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
// import 'react-calendar/dist/Calendar.css';

// Import your Calendar services or auth functions if needed
// import { CalenderServices } from '../../Services/CalenderServices';

const MyCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setSelectedDate(newDate);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleBookSlot = async () => {
    try {
      // Here you can use CalenderServices to handle booking logic
      console.log('Booking slot for:', selectedDate);
      // For example: await CalenderServices.bookSlot(selectedDate);
    } catch (error) {
      console.error('Error booking slot:', error.message);
    }
    handleClose();
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Confirm Booking</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to book a slot on {selectedDate?.toDateString()}?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleBookSlot} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyCalendar;
