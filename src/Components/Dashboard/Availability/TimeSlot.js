// TimeSlotDropdowns.js
import React from 'react';
import { FormControl, Select, MenuItem, InputLabel, Box, Typography, Button } from '@mui/material';
import dayjs from 'dayjs';

const generateTimeSlots = () => {
    const slots = [];
    let start = dayjs().startOf('day'); // Start at 12:00 AM
    const end = dayjs().endOf('day'); // End at 11:59 PM

    while (start.isBefore(end)) {
        slots.push(start.format('hh:mm A'));
        start = start.add(15, 'minute'); // Increment by 15 minutes
    }

    return slots;
};

const daysOfWeek = [
    { name: 'Monday', value: 1 },
    { name: 'Tuesday', value: 2 },
    { name: 'Wednesday', value: 3 },
    { name: 'Thursday', value: 4 },
    { name: 'Friday', value: 5 },
    { name: 'Saturday', value: 6 },
    { name: 'Sunday', value: 7 },
];

const TimeSlotDropdowns = ({ selectedTimes, handleTimeChange, onSave }) => {
    const timeSlots = generateTimeSlots();

    const handleSave = () => {
        // Format the data in the required structure
        const formattedData = {};
        daysOfWeek.forEach(day => {
            const fromSlot = selectedTimes[day.name]?.from;
            const toSlot = selectedTimes[day.name]?.to;
            if (fromSlot && toSlot) {
                // Create time slot range string
                formattedData[day.value] = [`${fromSlot} - ${toSlot}`];
            }
        });
        onSave(formattedData);
    };

    return (
        <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between" gap={2}>
            {daysOfWeek.map((day) => (
                <Box key={day.value} flex={1} minWidth={200}>
                    <Typography variant="h6">{day.name}</Typography>
                    <FormControl fullWidth variant="outlined" style={{ marginBottom: 10 }}>
                        <InputLabel>From Slot</InputLabel>
                        <Select
                            value={selectedTimes[day.name]?.from || ''}
                            onChange={handleTimeChange(day.name, 'from')}
                            label="From Slot"
                        >
                            {timeSlots.map((slot, index) => (
                                <MenuItem key={index} value={slot}>
                                    {slot}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>To Slot</InputLabel>
                        <Select
                            value={selectedTimes[day.name]?.to || ''}
                            onChange={handleTimeChange(day.name, 'to')}
                            label="To Slot"
                        >
                            {timeSlots.map((slot, index) => (
                                <MenuItem key={index} value={slot}>
                                    {slot}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            ))}

            <Button variant="contained" color="primary" onClick={handleSave} style={{ marginTop: 20 }}>
                Save
            </Button>
        </Box>
    );
};

export default TimeSlotDropdowns;
