import React, { useState,useEffect } from 'react';
import { Box, Typography, Divider, Modal, TextField,MenuItem } from '@mui/material';

import DateCalendarServerRequest from './muiCalendar'; // Update the path as needed
import './BookSession.css';

import { CalendarServices } from '../../../Services/CalendarServices.js';
import {convertSlotsToFormat,generateTimeSlots, getAvailableSlots, generateNoticeDates, convertToLocalTimeSlots, mapTimeSlotsToDates} from './helper.js';
import dayjs from 'dayjs';
import { BookButton } from './BookSessionHandler.js';
import timezones from 'timezones-list';              // A popular package to provide timezones list.
import timezone from 'dayjs/plugin/timezone';

import WebinarModal from './webinar.jsx'; // Adjust the import path as needed



const BookSession = ({ name, mentorId }) => {

 
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState('');
  const [selectedTime, setSelectedTime] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [period, setPeriod] = useState(); // Default period
  const [daysOfWeekToHighlight, setDaysOfWeekToHighlight] = useState([]);
  // const [timeSlotsByDay, setTimeSlotsByDay] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [durationList, setDurationList] = useState([]);

  const [selectedTimezone, setSelectedTimezone] = useState('');

  const [ finalAvailableSlots, setFinalAvailableSlots] = useState({})

  const [ mentorData, setMentorData] = useState({})
  const [selectedSession, setSelectedSession] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 

  const [durationId, setDurationId] = useState({ duration: null, id: '' });


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
    console.log('Default timezone set:', selectedTimezone);
  } else {
    console.error('Default timezone does not match any tzCode in timezones list:', mappedTimezone);
  }
}, []);


const handleTimezoneChange = (event) => {
  const newTimezone = event.target.value;
  console.log('Selected timezone:', newTimezone);
  setSelectedTimezone(newTimezone);
  console.log('Timezone state updated to:', newTimezone);
};




  function getFinalAvailableSlots(bookings, availableLocalSlots,Timezone) {
    let finalAvailSlots;
  
    if (bookings === undefined) {
      // If bookings is undefined, use availableLocalSlots directly
      finalAvailSlots = availableLocalSlots;
    } else {
      // If bookings is present, use the provided functions to map and filter slots
      const mapSavedTimeSlots = mapTimeSlotsToDates(bookings, Timezone);
      console.log('Map saved time slots:', JSON.stringify(mapSavedTimeSlots));
  
      finalAvailSlots = getAvailableSlots(availableLocalSlots, mapSavedTimeSlots);
      console.log('Final available slots:', JSON.stringify(finalAvailSlots));
    }
  
    return finalAvailSlots;
  }
  

  // Fetch all necessary data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await CalendarServices.getAvailabilityData({mentorId});
        console.log('Availability data:', JSON.stringify(data.availability));
        const availabilityData = data.availability;
        setMentorData(availabilityData)


        // const durations = Object.values(availabilityData.sessions).map(session => session.duration);

        // console.log('Session duration:', durations)
       

        const durationsWithIds = availabilityData.sessions.map(session => ({
          duration: session.duration,
          id: session._id // Access the _id directly from the session object
        }));
        
        // Log the array to check its structure
        console.log('Session durations with IDs:', durationsWithIds);

        setDurationList(durationsWithIds)

        console.log('durationID', durationList)
                

      
        const availableDayTimeUtc = data.availabilityData.availableDayTimeUtc;


        const timeSlotsLocal = convertToLocalTimeSlots(availableDayTimeUtc, selectedTimezone);
        console.log('Time slots local:', JSON.stringify(timeSlotsLocal), duration);

       
        const startDate = dayjs(availabilityData.startDate);
        const endDate = dayjs(availabilityData.endDate);
        console.log(startDate, endDate);

        const availableLocalSlots = convertSlotsToFormat(timeSlotsLocal, startDate, endDate);
        console.log('Available local slots:', JSON.stringify(availableLocalSlots));

        const {bookings} = await CalendarServices.getBooking();
        console.log('Booking:', bookings)

        const finalAvailSlots = getFinalAvailableSlots(bookings, availableLocalSlots, selectedTimezone);
        console.log('Final Available Slots:', finalAvailSlots);


      

        // const mapSavedTimeSlots = mapTimeSlotsToDates(availabilityData.sessions, timeZone);
        // console.log('Map saved time slots:', JSON.stringify(mapSavedTimeSlots));

        // const finalAvailSlots = getAvailableSlots(availableLocalSlots, mapSavedTimeSlots);
        // console.log('Final available slots:', JSON.stringify(finalAvailSlots));

        // Set final available slots
        setFinalAvailableSlots(finalAvailSlots);

        let blockDates = availabilityData.unavailableDates.map(date => dayjs(date).format('YYYY-MM-DD'));
        console.log('Block dates:', blockDates);

        const noticePeriod = availabilityData.noticePeriod // Example notice period
        const noticeDates = generateNoticeDates(finalAvailSlots, noticePeriod);
        console.log('Notice dates:', noticeDates);

    
        blockDates = [...blockDates, ... noticeDates]
      
        // Set unavailable dates
        setUnavailableDates(blockDates || []);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [selectedTimezone])



  useEffect(() => {
    if (selectedDate && durationId && finalAvailableSlots) {

       console.log(durationId.duration)
        const {bufferTime} = mentorData
        console.log(bufferTime)
        let selDate = dayjs(selectedDate).format('YYYY-MM-DD');
        const timeSlots = generateTimeSlots(finalAvailableSlots, selDate, durationId.duration, bufferTime);
        console.log('timeslots', timeSlots);
        setTimeSlots(timeSlots);
    }
}, [selectedDate, durationId]);



  const handleDateChange = async (date) => {

      setSelectedDate(date); // Continue with other logic if needed
    
  };






  const formatDate = (date) => {


    if (!date) return '';
    return date.format('dddd, MMMM D, YYYY'); // Using dayjs for formatting
  };

  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(/(am|pm)/);
    const [hour, minute] = time.split(':').map(Number);

    let adjustedHour = hour;
    if (period === 'pm' && hour !== 12) {
      adjustedHour += 12;
    } else if (period === 'am' && hour === 12) {
      adjustedHour = 0;
    }

    const rawdate = `1970-01-01T${adjustedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`;
    return new Date(rawdate);
  };


  const calculateEndTime = (startTime, durationID) => {
    const endTime = new Date(startTime.getTime() + durationId.duration * 60000); // 60000 ms = 1 minute
    return endTime;
  };
  

  const handleSelectedTime = (time) => {
  
    setSelectedTime(time);
    
  };

// If you want to log the updated `selectedTime` after the state has been set:
useEffect(() => {
  // console.log('Updated selectedTime:', selectedTime);
}, [selectedTime]);




  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
};


const handleDurationChange = (selectedId) => {
  const selectedItem = durationList.find(item => item.id === selectedId);

  if (selectedItem) {
      setDurationId({
          duration: selectedItem.duration,
          id: selectedItem.id
      });

      console.log('Selected Duration:', selectedItem.duration);
      console.log('Selected Session ID:', selectedItem.id);
      console.log('set durationId:', durationId);
  }
};




  return (
    <div className="BookSession-Container">
      <h2 className="title">Book a session with {name}</h2>

      <select
            className="select"
            value={selectedTimezone}
            onChange={handleTimezoneChange}
          >
            <option value="" disabled>Select Timezone</option>
            {timezones.map((tz) => (
              <option key={tz.tzCode} value={tz.tzCode}>
                {tz.label}
              </option>
            ))}
          </select>

      <label className="label">Duration</label>


                  <select
                        className="select"
                        value={durationId.id}
                        onChange={(e) => handleDurationChange(e.target.value)}
                    >
                        <option value="" disabled>Select Duration</option>
                        {durationList.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.duration} Minutes
                            </option>
                        ))}
                  </select>



      <label className="label">Availability</label>
      
      <DateCalendarServerRequest 
        onDateChange={handleDateChange}
        period={period} // Use the fetched period
        daysOfWeekToHighlight={daysOfWeekToHighlight} // Use the fetched days of the week to highlight
        unavailableDates={unavailableDates}
        finalAvailableSlots = {finalAvailableSlots}
      />


          {selectedDate && (
                          <Box sx={{ marginTop: 2 }}>
                              <Typography variant="body1" className="label">
                                  {formatDate(selectedDate)}
                              </Typography>
                              <Box
                                  className="time-slot-container"
                                  sx={{
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      gap: 1,
                                      marginTop: 2
                                  }}
                              >
                                  {timeSlots.map(time => (
                                      <button
                                          key={time}
                                          className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                                          onClick={() => handleSelectedTime(time)}
                                      >
                                          {time}
                                      </button>
                                  ))}
                              </Box>
                          </Box>
                      )}
      <Divider style={{ borderColor: 'lightgray' }} /> 

      

      <BookButton
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              durationId={durationId}
              mentorData={mentorData}
             selectedTimezone={selectedTimezone}
             mentorId={mentorId}
            />

        <WebinarModal
        
        mentorData={mentorData}
        mentorId={mentorId}
        
        />

  
    </div>
  );
};

export default BookSession;
