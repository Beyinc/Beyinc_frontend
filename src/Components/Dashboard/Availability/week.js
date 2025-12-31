import React, { useState,useEffect } from 'react';
import { Button, Box, Grid, Typography, Dialog,IconButton, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import TimeSlotDropdowns from './TimeSlotDropdown';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import CloseIcon from '@mui/icons-material/Close';
import './FormControlStyles.css';

import { CalendarServices } from '../../../Services/CalendarServices';
import { useSelector } from 'react-redux';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrAfter);

const Week = ({ selectedDayTimeUtc, setSelectedDayTimeUtc, handleSaveSchedule }) => {
    const [open, setOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null); // Initialize with null
    const [selectedTimes, setSelectedTimes] = useState({});
    const [timeSlotsPerDay, setTimeSlotsPerDay] = useState({});

    const { user_id: mentorId } = useSelector(
    (store) => store.auth.loginDetails
);


    useEffect(() => {
    const fetchAvailability = async () => {
        if (!mentorId) return;

        try {
            const { data } = await CalendarServices.getAvailabilityData({ mentorId });

            const availableUtc =
                data?.availabilityData?.availableDayTimeUtc || {};

            // normalize keys to numbers & ensure arrays
            const normalized = {};
            Object.entries(availableUtc).forEach(([day, slots]) => {
                normalized[Number(day)] = Array.isArray(slots) ? slots : [];
            });

            // ✅ show slots on load
            setTimeSlotsPerDay(normalized);

            // ✅ keep existing save flow working
            setSelectedDayTimeUtc(normalized);

        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    fetchAvailability();
}, [mentorId]);

 

    const handleOpen = (value) => {
        console.log('clicked create timeslot', value);
        setSelectedDay(value);
        console.log('set selected day to', value);
        setOpen(true);
    };

    const handleClose = () => {
        resetSlots(selectedDay); // Reset slots on cancel
        setOpen(false);
        setSelectedDay(null);
        setSelectedTimes({});
    };

    const handleTimeChange = (dayName, slotType, value) => {
        setSelectedTimes((prev) => ({
            ...prev,
            [dayName]: {
                ...prev[dayName],
                [slotType]: value,
            },
        }));
    };

    const convertToUTC = (timeSlots) => {
        const utcTimeSlots = {};
        Object.keys(timeSlots).forEach(day => {
            utcTimeSlots[day] = timeSlots[day].map(slot => {
                const [startTime, endTime] = slot.split(' - ');
                const startUTC = dayjs.tz(startTime, "hh:mm A", "Asia/Kolkata").utc().format('hh:mm A');
                const endUTC = dayjs.tz(endTime, "hh:mm A", "Asia/Kolkata").utc().format('hh:mm A');
                return `${startUTC} - ${endUTC}`;
            });
        });
        return utcTimeSlots;
    };

    const handleSave = (formattedData) => {
        const isOverlapping = (existingSlots, newSlot) => {
            const [newStart, newEnd] = newSlot.split(' - ').map(time => dayjs(time, "hh:mm A"));
            return existingSlots.some(slot => {
                const [existingStart, existingEnd] = slot.split(' - ').map(time => dayjs(time, "hh:mm A"));
                return (newStart.isBefore(existingEnd) && newEnd.isAfter(existingStart));
            });
        };

        for (const [day, slots] of Object.entries(formattedData)) {
            for (const slot of slots) {
                const [startTime, endTime] = slot.split(' - ');
                if (dayjs(startTime, "hh:mm A").isSameOrAfter(dayjs(endTime, "hh:mm A"))) {
                    alert("The 'To' time must be greater than the 'From' time.");
                    return;
                }

                const existingSlots = timeSlotsPerDay[day] || [];
                if (isOverlapping(existingSlots, slot)) {
                    alert("The new time slot overlaps with an existing slot.");
                    return;
                }
            }
        }

        const updatedTimeSlotsPerDay = { ...timeSlotsPerDay };
        for (const [day, slots] of Object.entries(formattedData)) {
            const dayNumber = parseInt(day, 10);
            if (!updatedTimeSlotsPerDay[dayNumber]) {
                updatedTimeSlotsPerDay[dayNumber] = [];
            }
            updatedTimeSlotsPerDay[dayNumber] = [...updatedTimeSlotsPerDay[dayNumber], ...slots];
        }

        setTimeSlotsPerDay(updatedTimeSlotsPerDay);
        const utcTimeSlots = convertToUTC(updatedTimeSlotsPerDay);
        setSelectedDayTimeUtc(utcTimeSlots);
        handleClose();
    };

    const handleDeleteSlot = (day, slotIndex) => {
        setTimeSlotsPerDay((prev) => {
            const updatedSlots = { ...prev };
            updatedSlots[day] = updatedSlots[day].filter((_, index) => index !== slotIndex);
            return updatedSlots;
        });

        const updatedTimeSlotsPerDay = { ...timeSlotsPerDay };
        updatedTimeSlotsPerDay[day] = updatedTimeSlotsPerDay[day].filter((_, index) => index !== slotIndex);
        const utcTimeSlots = convertToUTC(updatedTimeSlotsPerDay);
        setSelectedDayTimeUtc(utcTimeSlots);
    };

    const resetSlots = (dayName) => {
        setSelectedTimes((prev) => ({
            ...prev,
            [dayName]: { from: '', to: '' },
        }));
    };

    return (
        <div>
            <Grid py={5} px={3} container spacing={2}>
            <Grid  px={3} container spacing={3} justifyContent="flex-end">
                <Box textAlign="right">
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSaveSchedule(selectedDayTimeUtc)}
                    className='cancelSave'
                    style={{ textTransform: 'none' }}
                    >
                    Save Schedule
                    </Button>
                </Box>
                </Grid>
                {daysOfWeek.map((day, index) => (
                    <Grid container item key={day.value} spacing={2} alignItems="center">
                        <Grid item xs={2}>
                            <Typography variant="body1" style={{ fontWeight: '500' }}>
                                {day.name}
                            </Typography>
                        </Grid>
                        <Grid item xs={30}>
                            <Button
                                variant="contained"
                                onClick={() => handleOpen(day.value)}
                                style={{
                                    width: '75%',
                                    backgroundColor: 'white',
                                    color: 'black',
                                    borderRadius: '3px',
                                    border: '1px solid black',
                                    textTransform: 'none',
                                    boxShadow: 'none',
                                    padding: '3px',
                                    fontWeight: 'bold',
                                }}
                            >
                                Create Timeslot
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Box className="time-slot-container">
                                {timeSlotsPerDay[day.value] && timeSlotsPerDay[day.value].length > 0 ? (
                                    timeSlotsPerDay[day.value].map((slot, index) => (
                                        <Grid 
                                            container 
                                            key={index} 
                                            spacing={0.5} 
                                            sx={{
                                                width: '40%',
                                                padding: '0.5rem',
                                                backgroundColor: '#F2F2F2',
                                                borderRadius: '5px',
                                                marginTop: '1rem',
                                                position: 'relative',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <Grid item xs={12} sx={{ position: 'absolute', top: '-15px', right: '-5px' }}>
                                                <Button
                                                    onClick={() => handleDeleteSlot(day.value, index)}
                                                    className="delete-slot"
                                                    sx={{
                                                        minWidth: 'auto',
                                                        height: '15px',
                                                        padding: '0',
                                                        fontSize: '1.25rem',
                                                        backgroundColor: 'black',
                                                        color: 'white',
                                                        borderRadius: '50%',
                                                        lineHeight: '1',
                                                        border: '1px solid black',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    &times;
                                                </Button>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box sx={{ textAlign: 'center', fontSize: '12px' }}>
                                                    {slot}
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    ))
                                ) : (
                                    <Box sx={{ height: '24px' }} />
                                )}
                            </Box>
                        </Grid>
                        {index < daysOfWeek.length - 1 && (
                            <Grid item xs={12}>
                                <Box sx={{ height: '1px', backgroundColor: 'lightgrey', my: 2 }} />
                            </Grid>
                        )}
                    </Grid>
                ))}
            </Grid>

            <Dialog PaperProps={{ style: { width: '450px', borderRadius:'10px' }}} open={open} onClose={handleClose}>
                <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                <DialogContent>
                    {selectedDay !== null && ( // Ensure 0 is valid
                        <TimeSlotDropdowns
                            selectedDay={selectedDay}
                            selectedTimes={selectedTimes}
                            handleTimeChange={handleTimeChange}
                            onSave={handleSave}
                            resetSlots={resetSlots}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};


const daysOfWeek = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 0 },
];

export default Week;
