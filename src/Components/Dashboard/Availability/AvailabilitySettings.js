// AvailabilitySettings.js
import React from 'react';
import { FormControl, InputLabel, Select, MenuItem, Typography, Box } from '@mui/material';

export default function AvailabilitySettings({ selectedDuration, handleDurationChange }) {
    return (
        <Box mt={2}>
            <Typography>Settings Content</Typography>
            <InputLabel id="available-duration-label">Available Duration</InputLabel>
            <FormControl fullWidth style={{ marginBottom: 20 }}>
                <Select
                    labelId="available-duration-label"
                    value={selectedDuration}
                    onChange={handleDurationChange}
                    label="Available Duration"
                >
                    {['1 week', '2 weeks', '3 weeks', '4 weeks', '2 months', '3 months'].map(duration => (
                        <MenuItem key={duration} value={duration}>
                            {duration}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}
