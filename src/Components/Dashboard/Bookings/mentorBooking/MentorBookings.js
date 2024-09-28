import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Box, Typography, Tabs, Tab, Divider, List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@mui/material';
import { CalendarServices } from '../../../../Services/CalendarServices.js';
import '../Bookings.css'
import dayjs from 'dayjs';


const MentorBooking = () => {
  // Access route parameter to distinguish user or mentor
  const [tabValue, setTabValue] = useState(0);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rescheduleReason, setRescheduleReason] = useState('');

  const { email: userEmail, user_id, userName } = useSelector((store) => store.auth.loginDetails);


  useEffect(() => {
    const fetchBookings = async () => {
      try {
     
          console.log('mentorId', user_id, userName);
          const { mentorBookings } = await CalendarServices.mentorBookings({mentorId:user_id}); // Fetch user bookings
          console.log('mentor Bookings:', mentorBookings); // Log user bookings data

          const filterByDate = (filterType) => {
            const now = new Date();
            
            return mentorBookings.filter(booking => {
              const bookingDate = new Date(booking.startDateTime);
              
              if (filterType === 'upcoming') {
                return bookingDate > now;
              } else if (filterType === 'completed') {
                return bookingDate <= now;
              }
              return false; // For any invalid filterType
            });
          };
          
          // Example usage:
          const upcomingBookings = filterByDate('upcoming');
          const completedBookings = filterByDate('completed');
          
          console.log('Upcoming Bookings:', upcomingBookings);
          console.log('Completed Bookings:', completedBookings);

          setUpcomingBookings(upcomingBookings);
          setCompletedBookings(completedBookings);
        
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

     // Log the current type
    fetchBookings();
  }, [user_id, userName]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setRescheduleReason('');
  };

  const handleReschedule = async () => {
   
      await CalendarServices.mentorReschedule({ id: selectedBooking._id, rescheduleReason, booleanValue:true }); // Adjust if needed
   
    handleCloseDialog();
  };

  return (
    <Box px={4} py={3}>
      <Box p={8} bgcolor={'white'} borderRadius={3} boxShadow={2}>
        <Typography variant="h5" align="left" style={{ fontFamily: 'Roboto' }}>
          Mentor Bookings
        </Typography>


     

        {/* Tabs for Upcoming and Completed */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          style={{ width: '50%', marginTop: '10px' }}
        >
          <Tab label="Upcoming" />
          <Tab label="Completed" />
        </Tabs>

        <Divider style={{ margin: '20px 0' }} />

        <Box mt={4}>


  {/* Upcoming Bookings */}
  {tabValue === 0 && (
    <>
      
      {upcomingBookings.length > 0 ? (
        <List>
          {upcomingBookings.map((booking) => (

            <Box key={booking._id} mb={3}>

                <Typography variant="h6" align="left" style={{ marginBottom: '10px' }}>
                  {dayjs(booking.startDateTime).format('MMMM D, YYYY')}
                  </Typography>
                  
                <Box display="flex" flexDirection="row" alignItems="center" border="1px solid black" borderRadius={1} p={0}>
                
                {/* 1st Column: Purple Vertical Box */}
                <Box width="1.5%" bgcolor="#4F55C7" height="120px" />

                {/* 2nd Column: Booking Time */}
                <Box width="20%" ml={4}>
                  <Typography variant="body1">
                     {new Date(booking.startDateTime).toLocaleTimeString()}
                  </Typography>
                </Box>


              {/* 3rd Column: User Details */}
                <Box width="20%" ml={4}>
                  <Typography variant="body1">
                    User: {booking.userId ? booking.userId.userName : 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Email: {booking.userId ? booking.userId.email : 'N/A'}
                  </Typography>
                </Box>


                <Box width="20%" ml={15}>
                  <Typography variant="body1">
                    Title: {booking.title ? booking.title : 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Duration: {booking.duration} mins
                  </Typography>
                  <Typography variant="body1">
                    Amount: {booking.amount ? `${booking.amount} Rs` : 'N/A'}
                  </Typography>
                </Box>

               

                {/* 4th Column: Request Reschedule Button */}
                <Box width="20%" ml={5}>
                  <button className='joinCall' onClick={() => handleOpenDialog(booking)}>
                    Request Reschedule
                  </button>
                </Box>
              </Box>
            </Box>
          ))}
        </List>
      ) : (
        <Typography>No upcoming bookings.</Typography>
      )}
    </>
  )}



  {/* Completed Bookings */}
  {tabValue === 1 && (
    <>
      
      {completedBookings.length > 0 ? (
        <List>
          {completedBookings.map((booking) => (
            <Box key={booking._id} mb={3}>
               <Typography variant="h6" align="left" style={{ marginBottom: '10px' }}>
                  {dayjs(booking.startDateTime).format('MMMM D, YYYY')}
                  </Typography>
                  
                <Box display="flex" flexDirection="row" alignItems="center" border="1px solid black" borderRadius={1} p={0}>
                
                {/* 1st Column: Purple Vertical Box */}
                <Box width="1.5%" bgcolor="#4F55C7" height="120px" />

                {/* 2nd Column: Booking Time */}
                <Box width="20%" ml={4}>
                  <Typography variant="body1">
                     {new Date(booking.startDateTime).toLocaleTimeString()}
                  </Typography>
                </Box>


              {/* 3rd Column: User Details */}
                <Box width="20%" ml={4}>
                  <Typography variant="body1">
                    User: {booking.userId ? booking.userId.userName : 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Email: {booking.userId ? booking.userId.email : 'N/A'}
                  </Typography>
                </Box>


                <Box width="20%" ml={15}>
                  <Typography variant="body1">
                    Title: {booking.title ? booking.title : 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    Duration: {booking.duration} mins
                  </Typography>
                  <Typography variant="body1">
                    Amount: {booking.amount ? `${booking.amount} Rs` : 'N/A'}
                  </Typography>
                </Box>

                {/* No 4th Column for completed bookings */}
              </Box>
            </Box>
          ))}
        </List>
      ) : (
        <Typography>No completed bookings.</Typography>
      )}
    </>
  )}
</Box>



        {/* Dialog for Reschedule Request */}
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Request Reschedule</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Reason for Reschedule"
              type="text"
              fullWidth
              value={rescheduleReason}
              onChange={(e) => setRescheduleReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleReschedule} color="primary">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default MentorBooking;
