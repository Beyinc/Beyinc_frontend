import React, { useState, useEffect } from 'react';
import {Button,  Tabs,InputLabel, FormControl, Select, MenuItem, Grid, TextField } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import MultiDatePicker from './MultiDateCalendar.js'; // Adjust the import path accordingly
import { CalendarServices } from '../../../Services/CalendarServices.js'; // Adjust the import path as needed
import Week from './week.js';
import { convertToUTCAndShift } from './convertUtc.js';
import Typography from '@mui/material/Typography';
import './ScheduleComponent.css'; // Import the CSS file
import dayjs from 'dayjs';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import { Autocomplete } from '@mui/material';
import timezones from 'timezones-list';              // A popular package to provide timezones list.
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
// import { CalendarServices } from '../../../Services/CalendarServices';
import ServicesTab from './services.js';


dayjs.extend(utc);
dayjs.extend(timezone);



export default function AvailabilityForm() {
  const [selectedDayTimeUtc, setSelectedDayTimeUtc] = useState({});
  const [selectedDuration, setSelectedDuration] = useState('');
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [activeTab, setActiveTab] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [noticePeriod, setNoticePeriod] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [bufferTime, setBufferTime] = useState('');




  const handleAuth = async () => {
    console.log('handleAuth working');
    try {
      // Fetch the OAuth URL from the service
      const obj = await CalendarServices.calenderAuth();
      console.log('OAuth URL fetched:', obj.data.url);
  
      // Open the OAuth URL in a popup window
      const authWindow = window.open(obj.data.url, 'OAuthPopup', 'width=600,height=600');
      console.log('Popup window opened:', authWindow);
  
      const handleMessage = (event) => {
     
        // Check if the event comes from the expected origin
        if (event.origin === 'http://localhost:3000') { // Replace with actual origin
          // Ensure the message data contains the expected content
          if (typeof event.data === 'string' && event.data === 'Authorization successful') {
            // console.log('Authorization successful, closing window...');
            if (authWindow && !authWindow.closed) {
              authWindow.close(); // Close the popup window
              // console.log('Popup window closed');
            } 
      
            // Optionally, reload or update the page after successful authorization
            window.location.reload(); // Reloads the current page
          } else {
            console.warn('Unexpected message data:', event.data);
          }
        } else {
          console.warn('Unexpected origin:', event.origin);
        }
      };
      
      // Add event listener to handle messages from the popup
      window.addEventListener('message', handleMessage, false);
  
   
    } catch (error) {
      console.error('Error fetching the auth URL:', error.message);
    }
  };
  
  
  useEffect(() => {
    // Get the user's current timezone
    const defaultTimezone = dayjs.tz.guess();
    console.log('Guessed default timezone:', defaultTimezone);
  
    // Mapping old timezone names to modern ones
    const timezoneMapping = {
      'Asia/Calcutta': 'Asia/Kolkata',
      // Add more mappings as required
    };
  
    // Map the guessed timezone to the tzCode in your list, if needed
    const mappedTimezone = timezoneMapping[defaultTimezone] || defaultTimezone;
  
    // Ensure the mapped timezone exists in the timezones list
    const matchingTimezone = timezones.find((tz) => tz.tzCode === mappedTimezone);
  
    if (matchingTimezone) {
      setSelectedTimezone(mappedTimezone);
      console.log('Default timezone set:', mappedTimezone);
    } else {
      console.error('Default timezone does not match any tzCode in timezones list:', mappedTimezone);
    }
  }, []);
  

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleTimeChange = (day, type) => (event) => {
    const newSelectedTimes = { ...selectedTimes, [day]: { ...selectedTimes[day], [type]: event.target.value } };
    setSelectedTimes(newSelectedTimes);
  };

  const handleSave = (formattedData) => {
    const timeSlotsUTC = convertToUTCAndShift(formattedData);
    setSelectedDayTimeUtc(timeSlotsUTC);
  };

  useEffect(() => {
    console.log('Updated selectedDayTimeUtc:', selectedDayTimeUtc);
  }, [selectedDayTimeUtc]);



  const handleSaveSchedule = () => {
    console.log('unavailable dates:', unavailableDates);
    console.log('selectedDaytimeUtc:', selectedDayTimeUtc);
    const obj = {
       unavailableDates,
       selectedDayTimeUtc,
    };

    CalendarServices.saveSettingsData(obj)
      .then((response) => {
        console.log('Availability data successfully sent:', response);
      })
      .catch((error) => {
        console.error('Error sending availability data:', error);
      });

  };

  const handleTimezoneChange = (event) => {
    const newTimezone = event.target.value;
    console.log('Selected timezone:', newTimezone);
    setSelectedTimezone(newTimezone);
    console.log('Timezone state updated to:', newTimezone);
  };


  const handleSaveSettings = () => {
    const obj = {
       unavailableDates,
       selectedDayTimeUtc,
       selectedTimezone,
       startDate,
       endDate,
       noticePeriod,
       bufferTime
    };
  
    CalendarServices.saveSettingsData(obj)
    .then((response) => {
      console.log('Availability data successfully sent:', response);
      alert('Availability data saved successfully!');
    })
    .catch((error) => {
      console.error('Error sending availability data:', error);
      alert('Error saving availability data. Please try again.');
    });
  
  };


  
  return (
    <Box px={4} py={3}>
      <Box p={8} bgcolor={'white'} borderRadius={3} boxShadow={2}>
        <Typography variant="h5" align="left" style={{ fontFamily: 'Roboto' }}>
          Availability
        </Typography>

        {/* Tab selection */}
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab
              label="Services"
              className={`available-tab ${activeTab === 0 ? 'available-tab-active' : ''}`}
            />
          <Tab
            label="Settings"
            className={`available-tab ${activeTab === 1 ? 'availabe-tab-active' : ''}`}
          />
          <Tab
            label="Schedule"
            className={`available-tab ${activeTab === 2 ? 'available-tab-active' : ''}`}
          />
        </Tabs>

        {/* Divider Below Tabs */}
        <Box mt={2} mb={3} bgcolor="grey.300" height=".5px" width="100%" marginTop={'0px'} />

        {activeTab === 0  && (
          <ServicesTab>
            selectedTimezone = {selectedTimezone }
        </ServicesTab>)}


        {/* Settings tab */}
        {activeTab === 1 && (
          
          <Box px={4} py={1}>
          <Box p={2} bgcolor={'white'}  >
            
    
            <Box mt={2} mb={2}>
              <Typography variant="h5">Default</Typography>
              <Typography className="default-description" variant="body1" style={{ marginBottom: '16px' }}>
                Sync your personal and work calendar to avoid any clashes with your schedule
              </Typography>
    
              <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleAuth}>
                  Authorize Google Calendar
                </Button>
              </Box>
    
              <Grid mt={2} container spacing={2} alignItems="center">
                {/* Timezone Title */}
                <Grid item xs={5}>
                  <Typography variant="h5">Timezone</Typography>
                  <Typography className="default-description" variant="body2" >
                    Required for timely communications
                  </Typography>
                </Grid>
    
                {/* Timezone Dropdown */}
                <Grid item xs={7}>
                  <TextField
                    select
                    label="Select Timezone"
                    value={selectedTimezone}
                    onChange={handleTimezoneChange}
                    fullWidth
                  >
                    {timezones.map((tz) => (
                      <MenuItem key={tz.tzCode} value={tz.tzCode}>
                        {tz.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
    
              <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                {/* Booking Period */}
                <Grid item xs={5}>
                  <Typography variant="h5">Booking Period</Typography>
                  <Typography className="default-description" variant="body2" >
                    How far in the future can attendees book sessions
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    disablePast
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={3}>
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    disablePast
                    minDate={startDate} // Ensure end date is after or on the start date
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
              </Grid>
    
              <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                {/* Notice Period Section */}
                <Grid item xs={5}>
                  <Typography variant="h5">Notice Period</Typography>
                  <Typography  className="default-description" variant="body2" >
                    Set the minimum amount of notice that is required
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label="Days"
                    type="number"
                    inputProps={{ min: 1 }}
                    fullWidth
                    onChange={(e) => setNoticePeriod(e.target.value)}
                  />
                </Grid>
              </Grid>
    
              <Grid container spacing={2} alignItems="center" style={{ marginTop: '16px' }}>
                {/* Buffer Time Section */}
                <Grid item xs={5}>
                  <Typography variant="h5">Buffer Time</Typography>
                  <Typography className="default-description" variant="body2" >
                    Add time between your events to stay zen
                  </Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label="Minutes"
                    type="number"
                    inputProps={{ min: 1 }}
                    fullWidth
                    onChange={(e) => setBufferTime(e.target.value)}
                  />
                </Grid>
              </Grid>
    
              {/* Save Button */}
              <Box mt={3} textAlign="right">
                <Button variant="contained" color="primary" onClick={handleSaveSettings}>
                  Save Settings
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
        )}

        {/* Schedule tab */}
        {activeTab === 2 && (
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Box className="available-box">
                  <Week
                    selectedDayTimeUtc={selectedDayTimeUtc}
                    setSelectedDayTimeUtc={setSelectedDayTimeUtc}
                    handleSaveSchedule={handleSaveSchedule}

                  />
                </Box>
              </Grid>

              <Grid item xs={8} md={4}>
                <Box className="available-box">
                  <Box px={4} py={3}>
                    <Typography component="legend" style={{ marginBottom: 20, color: 'black', fontFamily: 'Roboto', fontWeight: 'bold' }}>
                      Block Dates
                    </Typography>
                    <Typography component="legend" style={{ marginBottom: 20, color: 'black', paddingTop: 0, fontFamily: 'Roboto' }}>
                      Add dates when you will be unavailable to take calls or take sessions
                    </Typography>
                    <MultiDatePicker
                        unavailableDates={unavailableDates}
                        setUnavailableDates={setUnavailableDates}
                      />

                  </Box>
                </Box>
              </Grid>
         
            </Grid>

        
          </Box>
        )}
      </Box>
    </Box>
  );
}