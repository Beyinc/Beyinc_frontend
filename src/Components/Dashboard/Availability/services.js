import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Tabs, Tab, Box, TextField, Button, Grid } from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { CalendarServices } from '../../../Services/CalendarServices.js'; // Adjust the import path as needed
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);


export default function ServicesTab({selectedTimezone}) {
  const [activeSubTab, setActiveSubTab] = useState(0);
  const [data, setData] = useState({
    title: '',
    description: '',
    timeDuration: '',
    amount: '',
    hostingLink: '',
    webinarDate: null,
    startTime: null,
    endTime: null,
    responseTime: '', // For Priority DM
  });

  const {
    email : userEmail,
   user_id: mentorId,
   userName,
   
 } = useSelector((store) => store.auth.loginDetails);

  const handleSubTabChange = (event, newValue) => {
    setActiveSubTab(newValue);
  };

  const handleChange = (field) => (event) => {
    setData({ ...data, [field]: event.target.value });
  };

  const handleDateChange = (field) => (newValue) => {
    setData({ ...data, [field]: newValue });
  };

  const handleSaveOneToOne = () => {
    const formattedData = {
      title: data.title,
      description: data.description,
      timeDuration: Number(data.timeDuration),
      amount: Number(data.amount),
      hostingLink: data.hostingLink,
    };

    console.log('Saving 1:1 Data:', formattedData);

    CalendarServices.saveSingleService(formattedData)
      .then((response) => {
        console.log('1:1 successfully saved:', response);
        alert('1:1 service data saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving 1:1 service data:', error);
        alert('Error saving 1:1 service data. Please try again.');
      });
  };

  const handleCreateWebinar = async() => {
    const localStartTime = dayjs(data.startTime);
    const localEndTime = dayjs(data.endTime);
    const localWebinarDate = dayjs(data.webinarDate);
  
    // Convert local date and time to UTC
    const startDateTimeUtc = localStartTime
      .set('year', localWebinarDate.year())
      .set('month', localWebinarDate.month())
      .set('date', localWebinarDate.date())
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]'); // Format for Google Calendar API

    const endDateTimeUtc = localEndTime
      .set('year', localWebinarDate.year())
      .set('month', localWebinarDate.month())
      .set('date', localWebinarDate.date())
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss[Z]'); // Format for Google Calendar API


    const eventDetails = {
      summary: data.title,
      description: data.description,
      startTime: startDateTimeUtc,// Ensure this is in ISO date-time format
      endTime: endDateTimeUtc,    // Ensure this is in ISO date-time format
      timeZone:'UTC',
      attendees: [],
    };
    try {
      const { data: bookingResponse } = await CalendarServices.bookSession({ eventDetails, mentorId });
  
      console.log('Booking Response:', bookingResponse); // Log the full response for debugging
  
      const bookingId = bookingResponse.id;
      if (bookingId) {
        alert('Event created successfully!');
      } else {
        alert('Event created successfully, but no session ID found.');
      }
  
      const webinarData = {
        title: data.title,
        description: data.description,
        amount: Number(data.amount),
        hostingLink: data.hostingLink,
        startDateTime: data.startTime, // Adjusted field names
        endDateTime: data.endTime, // Adjusted field names
        eventId:bookingId, //
      };
  
      console.log('Saving Webinar Data:', webinarData);
  
      // Send request to backend to save webinar
      await CalendarServices.saveWebinarService({webinarData})
      alert('Webinar service data saved successfully!');
    } catch (error) {
      console.error('Error creating session or saving webinar service data:', error);
      alert('Error creating event or saving webinar service data. Please try again.');
    }
  };


  const handleCreateDM = () => {
    const formattedData = {
      title: data.title,
      description: data.description,
      amount: Number(data.amount),
      responseTime: Number(data.responseTime),
    };

    console.log('Saving Priority DM Data:', formattedData);

    CalendarServices.createDm(formattedData)
      .then((response) => {
        console.log('Priority DM successfully saved:', response);
        alert('Priority DM service data saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving Priority DM service data:', error);
        alert('Error saving Priority DM service data. Please try again.');
      });
  };

  const handleCancel = () => {
    // Reset form fields
    setData({
      title: '',
      description: '',
      timeDuration: '',
      amount: '',
      hostingLink: '',
      webinarDate: null,
      startTime: null,
      endTime: null,
      responseTime: '',
    });
  };

  const renderSaveButton = () => {
    switch (activeSubTab) {
      case 0:
        return (
          <Button variant="contained" color="primary" onClick={handleSaveOneToOne}>
            Save 1:1
          </Button>
        );
      case 1:
        return (
          <Button variant="contained" color="primary" onClick={handleCreateWebinar}>
            Save Webinar
          </Button>
        );
      case 2:
        return (
          <Button variant="contained" color="primary" onClick={handleCreateDM}>
            Save Priority DM
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Box>
      <Tabs value={activeSubTab} onChange={handleSubTabChange}>
        <Tab label="1:1" />
        <Tab label="Webinar" />
        <Tab label="Priority DM" />
      </Tabs>

      <Box mt={2} mb={3} bgcolor="grey.300" height=".5px" width="100%" />

      <Box mt={2}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={data.title}
              onChange={handleChange('title')}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={data.description}
              onChange={handleChange('description')}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
          </Grid>
          {(activeSubTab === 0 || activeSubTab === 1) && (
            <Grid item xs={12}>
              <TextField
                label="Hosting Link"
                value={data.hostingLink}
                onChange={handleChange('hostingLink')}
                fullWidth
                margin="normal"
              />
            </Grid>
          )}
          {activeSubTab === 1 && (
            <>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  label="Webinar Date"
                  value={data.webinarDate}
                  onChange={handleDateChange('webinarDate')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TimePicker
                  label="Start Time"
                  value={data.startTime}
                  onChange={handleDateChange('startTime')}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TimePicker
                  label="End Time"
                  value={data.endTime}
                  onChange={handleDateChange('endTime')}
                  fullWidth
                />
              </Grid>
            </>
          )}
          {activeSubTab === 0 && (
            <Grid item xs={6}>
              <TextField
                label="Time Duration (in minutes)"
                value={data.timeDuration}
                onChange={handleChange('timeDuration')}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
          )}
          {activeSubTab === 2 && (
            <Grid item xs={6}>
              <TextField
                label="Response Time (in days)"
                value={data.responseTime}
                onChange={handleChange('responseTime')}
                type="number"
                fullWidth
                margin="normal"
              />
            </Grid>
          )}
          <Grid item xs={6}>
            <TextField
              label="Amount"
              value={data.amount}
              onChange={handleChange('amount')}
              type="number"
              fullWidth
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="secondary" onClick={handleCancel} style={{ marginRight: '10px' }}>
            Cancel
          </Button>
          {renderSaveButton()}
        </Box>
      </Box>
    </Box>
  );
}
