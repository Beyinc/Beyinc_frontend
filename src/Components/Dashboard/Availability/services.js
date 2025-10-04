import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControlLabel,
  Switch,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CalendarServices } from '../../../Services/CalendarServices.js'; // Adjust the import path as needed
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import './services.css'
 import EditIcon from '@mui/icons-material/Edit'; // Ensure you have this icon
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Ensure you have this icon


dayjs.extend(utc);
dayjs.extend(timezone);

export default function ServicesTab({ selectedTimezone }) {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [isFreeSession, setIsFreeSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [data, setData] = useState({
    title: '',
    description: '',
    duration: '',
    amount: '',
    hostingLink: '',
    webinarDate: null,
    startTime: null,
    endTime: null,
    responseTime: '',
  });
  const [showForm, setShowForm] = useState(false); // New state to control form visibility

  const { user_id: mentorId } = useSelector((store) => store.auth.loginDetails);



  // useEffect(() => {
  //   const fetchSessions = async () => {
  //     try {
  //       const fetchedSessions = await CalendarServices.getAvailabilityData({mentorId});
  //       setSessions(fetchedSessions.data.availability.sessions);
  //     } catch (error) {
  //       console.error('Error fetching sessions:', error);
  //     }
  //   };
  //   fetchSessions();
  // }, [mentorId,handleSaveOneToOne, handleDeleteClick]);


  const handleSubTabChange = (index) => {
    setActiveSubTab(index);
    resetForm(); // Reset form fields when switching tabs
  };

  const handleToggleChange = () => {
    
    setIsFreeSession(!isFreeSession);
    setData((prevData) => ({
      ...prevData,
      amount: isFreeSession ? '' : '0',
      title: activeSubTab === 0 ? (isFreeSession ? '' : 'Demo Session') : (isFreeSession ? '' : 'Webinar'),
    }));
  };

  const handleChange = (field) => (event) => {
    console.log(' change',data)
    setData({ ...data, [field]: event.target.value });
    console.log(' change',data)
  };

  const handleDateChange = (field) => (newValue) => {
    setData({ ...data, [field]: newValue });
  };


  const fetchSessions = useCallback(async () => {
    try {
      const fetchedSessions = await CalendarServices.getAvailabilityData({ mentorId });
      setSessions(fetchedSessions.data.availability.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  }, [mentorId]);



  const handleSaveOneToOne = useCallback(async () => {
  
      console.log('data', data);
          CalendarServices.saveSingleService(data)
            .then(() => {
              alert('1:1 service data saved successfully!');
              resetForm();
              fetchSessions();
            })
            .catch(() => {
              alert('Error saving 1:1 service data. Please try again.');
            });

    }, [fetchSessions, handleChange]);

    const handleDeleteClick = useCallback(async () => {
      console.log('Updated selectedSessionId:', selectedSessionId);
      try {
        const response = await CalendarServices.deleteOneToOne({ sessionId: selectedSessionId });
        console.log(response); // Log the response object to inspect its structure
    
        // Check if the deletion was successful
        if (response && response.message) {
          alert('Session deleted successfully!'); // Display alert
          await fetchSessions(); //
          // Optionally, refresh the list or update the state here
        } else {
          alert('Failed to delete session. Please try again.'); // Error handling
        }
      } catch (error) {
        console.error(error);
        alert('An error occurred while deleting the session.'); // Alert on error
      }
    }, [fetchSessions,selectedSessionId]);
  
    useEffect(() => {
      fetchSessions();
    }, [fetchSessions]);
  
  
  




  const handleCreateWebinar = async () => {
    // Webinar handling logic
  };

  const handleCreateDM = () => {
    // DM handling logic
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setData({
      title: '',
      description: '',
      duration: '',
      amount: '',
      hostingLink: '',
      webinarDate: null,
      startTime: null,
      endTime: null,
      responseTime: '',
    });
    setIsFreeSession(false);
    setShowForm(false); // Hide form when resetting
  };

  const renderSaveButton = () => {
    switch (activeSubTab) {
      case 0:
        return (
          <button className='save'  onClick={handleSaveOneToOne}>
            Save 1:1
          </button>
        );
      case 1:
        return (
          <button className='save'  onClick={handleCreateWebinar}>
            Save Webinar
          </button>
        );
      case 2:
        return (
          <Button className='save'  onClick={handleCreateDM}>
            Save Priority DM
          </Button>
        );
      default:
        return null;
    }
  };



  const renderForm = () => (
    <Box mt={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} >
       
        <label>Title</label>
        <input
         value={data.title}
         onChange={handleChange('title')}
          type="text"
          label={data.title}
          class="form"
         
        />
        </Grid>
        <Grid item xs={12}>
         
        <label>Description</label>
        <textarea
          value={data.description}
          onChange={handleChange('description')}
          rows={4}
          className="form"
         label={data.description}
          style={{width: '50%'}}
          
        />
        </Grid>
        {(activeSubTab === 0 || activeSubTab === 1) && (
          <Grid item xs={12}>
             <label>Hosting Link</label>
            <input
            value={data.hostingLink}
            onChange={handleChange('hostingLink')}
            type="text"
            className="form"
           
          />
          </Grid>
        )}
        {activeSubTab === 0 && (
          <>
            <Grid item xs={12} >
            <label>Time Duration </label>
            <input
              value={data.duration}
              onChange={handleChange('duration')}
              type="number"
              className="form"
             
            />
            </Grid>
            {!isFreeSession && (
              <Grid item xs={6}>
                <label>Amount</label>
              <input
                value={data.amount}
                onChange={handleChange('amount')}
                type="number"
                className="form"
                style={{width: '100%'}}
              />
              </Grid>
            )}
          </>
        )}
        {activeSubTab === 1 && (
          <>
            <Grid item xs={12}>
            <label>Webinar Date</label>
            <input
              value={data.webinarDate}
              onChange={handleChange('webinarDate')}
              type="date"
              className="form"
            />
             
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="Start Time"
                value={data.startTime}
                onChange={handleDateChange('startTime')}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TimePicker
                label="End Time"
                value={data.endTime}
                onChange={handleDateChange('endTime')}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
              />
            </Grid>
            {!isFreeSession && (
              <Grid item xs={12}>
                <TextField
                  label="Amount"
                  value={data.amount}
                  onChange={handleChange('amount')}
                  type="number"
                  fullWidth
                  margin="normal"
                />
              </Grid>
            )}
          </>
        )}
        {activeSubTab === 2 && (
          <Grid item xs={12}>
            <TextField
              label="Response Time (in hours)"
              value={data.responseTime}
              onChange={handleChange('responseTime')}
              type="number"
              fullWidth
              margin="normal"
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <FormControlLabel
            control={<Switch checked={isFreeSession} onChange={handleToggleChange} />}
            label="Free Session"
          />
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="flex-start" mt={0} ml={0}>
        <button className='cancel' onClick={handleCancel}>
          Cancel
        </button>
        {renderSaveButton()}
      </Box>
    </Box>
  );

  useEffect(() => {
    if (selectedSessionId) {
      console.log('Updated selectedSessionId:', selectedSessionId);
    }
  }, [selectedSessionId]);  // This will trigger when selectedSessionId changes
  

  const handleMenuClick = (event, sessionId) => {
    setSelectedSessionId(sessionId);
    setAnchorEl(event.target);
    // Store session ID when menu is opened
  
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedSessionId(null); // Clear session ID when menu is closed
  };

 


const renderServiceList = () => (
  <Box mt={6}>
    {sessions.length > 0 ? (
      sessions.map((session, index) => (
        <Grid
          container
          key={index}
          alignItems="center"
          sx={{
            border: { xs: "1px solid black", sm: "2px solid black" },
            borderRadius: { xs: "3px", sm: "5px" },
            background: "white",
            mt: { xs: 1, sm: 3 },
            mb: { xs: 2, sm: 4 },
          }}
        >
          {/* Column 1: Title and Duration/Amount */}
          <Grid
            item
            xs={12}
            sm={4}
            sx={{
              pl: { xs: "10px", sm: "35px" },
              height: { xs: "100px", sm: "130px" },
            }}
          >
            <Typography
              mt={{ xs: 2, sm: 4 }}
              variant="h6"
              sx={{
                mb: { xs: 1, sm: 1 },
                fontSize: { xs: "0.9rem", sm: "1.25rem" },
              }}
            >
              {session.title}
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.75rem", sm: "0.9rem" } }}
            >
              {session.duration} min | ₹{session.amount}
            </Typography>
          </Grid>

          {/* Column 2: Views */}
          <Grid item xs={6} sm={2}>
            <Typography
              mb={{ xs: 0.5, sm: 1 }}
              variant="h6"
              sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
            >
              5
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.85rem" } }}
            >
              Views
            </Typography>
          </Grid>

          {/* Column 3: Bookings */}
          <Grid item xs={6} sm={2}>
            <Typography
              mb={{ xs: 0.5, sm: 1 }}
              variant="h6"
              sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
            >
              4
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.85rem" } }}
            >
              Bookings
            </Typography>
          </Grid>

          {/* Column 4: Earnings */}
          <Grid item xs={6} sm={1.5}>
            <Typography
              mb={{ xs: 0.5, sm: 1 }}
              variant="h6"
              sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }}
            >
              ₹ 1200
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontSize: { xs: "0.7rem", sm: "0.85rem" } }}
            >
              Earnings
            </Typography>
          </Grid>

          {/* Vertical Divider */}
          <Grid
            item
            xs={0}
            sm={0.5}
            sx={{
              borderLeft: "1px solid lightgrey",
              height: { xs: "60px", sm: "80px" },
              mx: { xs: 0.5, sm: 1 },
            }}
          />

          {/* Column 5: Edit Icon */}
          <Grid item xs={6} sm={1}>
            <IconButton onClick={() => handleEditService(session)}>
              <EditIcon sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }} />
            </IconButton>
          </Grid>

          <Grid item xs={6} sm={0.8}>
            <IconButton
              onClick={(event) => handleMenuClick(event, session._id)}
            >
              <MoreVertIcon sx={{ fontSize: { xs: "0.8rem", sm: "1rem" } }} />
            </IconButton>
          </Grid>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
          </Menu>
        </Grid>
      ))
    ) : (
      <Typography>No services available at the moment</Typography>
    )}
  </Box>
);


  const handleEditService = (service) => {
    setData({
      title: service.title,
      description: service.description,
      duration: service.duration,
      amount: service.amount,
      hostingLink: service.hostingLink,
      webinarDate: service.webinarDate ? dayjs(service.webinarDate) : null,
      startTime: service.startTime ? dayjs(service.startTime) : null,
      endTime: service.endTime ? dayjs(service.endTime) : null,
      responseTime: service.responseTime,
    });
    setIsFreeSession(service.amount === 0);
    setShowForm(true);
  };




 

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="left"
        sx={{
          borderBottom: 'none',
          borderRadius: '12px',
          marginBottom: '10px',
          width: '100%', // Set a lesser width for the container
          mx: 'auto', // Center the container
        }}
      >
        <Box className="flex flex-col gap-5 sm:flex-row  items-center">
        {/* <Box display="flex" alignItems="center"> */}
          <div
            className={`tab-box ${activeSubTab === 0 ? 'active' : ''}`}
            onClick={() => handleSubTabChange(0)}
          >
            1:1 Services
          </div>
          <div
            className={`tab-box ${activeSubTab === 1 ? 'active' : ''}`}
            onClick={() => handleSubTabChange(1)}
          >
            Webinar
          </div>
          <div
            className={`tab-box ${activeSubTab === 2 ? 'active' : ''}`}
            onClick={() => handleSubTabChange(2)}
          >
            Priority DM
          </div>
        </Box>
  
        <Button
          variant="contained"
          style={{backgroundColor: '#4F55C7', borderRadius:'8px'}}
          onClick={() => {
            setShowForm((prevShowForm) => !prevShowForm); // Toggle the form visibility
            if (showForm) {
              resetForm(); // Reset the form when hiding it
            }
          }}
          sx={{ marginLeft: 2 }} // Add spacing to the left
        >
          {showForm ? 'Show Services' : 'Add New Service'} 
        </Button>
      </Box>
  
      {showForm && renderForm()}
      {!showForm && renderServiceList()}
    </Box>
  );
  
}
