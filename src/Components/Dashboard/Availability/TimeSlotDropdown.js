import React from 'react';
import { FormControl, Select, MenuItem, InputLabel, Box, Button, Grid, Typography } from '@mui/material';
import dayjs from 'dayjs';
import './FormControlStyles.css';
const generateTimeSlots = () => {
    const slots = [];
    let start = dayjs().startOf('day');
    const end = dayjs().endOf('day');

    while (start.isBefore(end)) {
        slots.push(start.format('hh:mm A'));
        start = start.add(15, 'minute');
    }

    return slots;
};

const TimeSlotDropdowns = ({ selectedDay, selectedTimes, handleTimeChange, onSave, resetSlots }) => {
    const timeSlots = generateTimeSlots();
    console.log(selectedDay, selectedTimes);
    
    const handleSave = () => {
        const newSlot = `${selectedTimes[selectedDay]?.from} - ${selectedTimes[selectedDay]?.to}`;

        const formattedData = {
            ...selectedTimes,
            [selectedDay]: selectedTimes[selectedDay]?.slots
                ? [...selectedTimes[selectedDay].slots, newSlot]
                : [newSlot],
        };

        const validFormattedData = Object.keys(formattedData).reduce((acc, day) => {
            if (formattedData[day]?.length && formattedData[day][0] !== ' - ') {
                acc[day] = formattedData[day];
            }
            return acc;
        }, {});

        onSave(validFormattedData);
        resetSlots(selectedDay);
    };

    const handleCancel = () => {
        resetSlots(selectedDay);
    };

    const isSaveDisabled = !selectedTimes[selectedDay]?.from || !selectedTimes[selectedDay]?.to;

    return (
        <Box p={1}>
               <Typography paddingLeft={2} marginBottom={4} variant="h6" component="div">
                    Create Timeslot
                    </Typography>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FormControl className="customFormControl" fullWidth variant="outlined">
                  
                        <InputLabel style={{paddingLeft:'15px'}} >From Slot</InputLabel>
                        <Select
                            value={selectedTimes[selectedDay]?.from || ''}
                            onChange={(event) => handleTimeChange(selectedDay, 'from', event.target.value)}
                            label="From Slot"
                        >
                            {timeSlots.map((slot, index) => (
                                <MenuItem key={index} value={slot}>
                                    {slot}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={6}>
                    <FormControl className="customFormControl"  fullWidth variant="outlined">
                        <InputLabel  style={{paddingLeft:'15px'}} >To Slot</InputLabel>
                        <Select
                            value={selectedTimes[selectedDay]?.to || ''}
                            onChange={(event) => handleTimeChange(selectedDay, 'to', event.target.value)}
                            label="To Slot"
                        >
                            {timeSlots.map((slot, index) => (
                                <MenuItem key={index} value={slot}>
                                    {slot}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Grid marginBottom={1} px={2} container spacing={1} justifyContent="space-between" style={{ marginTop: 20 }}>
                <Grid item>
                    <Button  style={{marginRight:'20px'}} className="cancelSave" variant="contained" color="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item>
                    <Button className="cancelSave" disabled={isSaveDisabled} variant="contained" color="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TimeSlotDropdowns;
