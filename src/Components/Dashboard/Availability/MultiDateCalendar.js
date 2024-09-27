import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Button, IconButton, Grid, Box } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import DeleteIcon from '@mui/icons-material/Delete';
import './FormControlStyles.css';
// Styled Badge for selected dates
const StyledBadge = styled(Badge)(({ isSelected }) => ({
  '& .MuiPickersDay-root': {
    backgroundColor: isSelected ? '#EAEAEA !important' : 'transparent',
    color: isSelected ? 'black !important' : 'inherit',
  },
}));

// Styled PickersDay for selected date
const StyledPickersDay = styled(PickersDay)(({ isSelected }) => ({
  '&.Mui-selected': {
    backgroundColor: isSelected ? '#EAEAEA !important' : 'white !important',
    color: 'black !important',
  },
  '&:hover': {
    backgroundColor: isSelected ? '#EAEAEA !important' : 'transparent',
    color: isSelected ? 'black !important' : 'inherit',
  },
}));

// Day component for rendering dates
function AvailabilityDay(props) {
  const { day, outsideCurrentMonth, selectedDates, ...other } = props;
  const isSelected = selectedDates.some(date => date.isSame(day, 'day'));

  return (
    <StyledBadge
      key={day.toString()}
      overlap="circular"
      isSelected={isSelected}
    >
      <StyledPickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        isSelected={isSelected}
      >
        {day.date()}
      </StyledPickersDay>
    </StyledBadge>
  );
}

export default function MultiDatePicker({ onDateChange, unavailableDates, setUnavailableDates }) {
  const [selectedDates, setSelectedDates] = useState([]);
  const [datesVisible, setDatesVisible] = useState(false);

  // Handler for date selection
  const handleDateChange = (date) => {
    if (date) {
      setSelectedDates(prevDates => {
        const isSelected = prevDates.some(d => d.isSame(date, 'day'));
        if (isSelected) {
          return prevDates.filter(d => !d.isSame(date, 'day'));
        } else {
          return [...prevDates, date];
        }
      });
      if (onDateChange) {
        onDateChange(date);
      }
    }
  };

  // Handler for showing or hiding selected dates
  const toggleDatesVisibility = () => {
    setDatesVisible(!datesVisible);
  };

  // Handler for blocking selected dates
  const handleBlockDates = () => {
    setUnavailableDates(selectedDates);
    setDatesVisible(true); // Show dates after blocking
  };

  // Handler for canceling selection
  const handleCancel = () => {
    setSelectedDates([]);
    setDatesVisible(false);
  };

  // Handler for deleting a date from the selected dates
  const handleDeleteDate = (dateToDelete) => {
    setSelectedDates(prevDates => prevDates.filter(date => !date.isSame(dateToDelete, 'day')));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={dayjs()}
        slots={{
          day: (props) => <AvailabilityDay {...props} selectedDates={selectedDates} />,
        }}
        slotProps={{
          day: {
            selectedDates,
          },
        }}
        onChange={handleDateChange}
        sx={{
          border: '1px solid lightgrey',
          borderRadius: '10px',
          width: '100%', // Responsive width
          maxWidth: '400px', // Maximum width for larger screens
          height: 'auto', // Responsive height
          '@media (max-width: 600px)': {
            maxWidth: '100%', // Full width on small screens
          },
        }}
      />

      <Box display="flex" justifyContent="center" alignItems="center" gap={2} mt={2}>
      
        <Button
          variant="contained"
          sx={{
          
            textTransform: 'none',
          
          }}

          className='cancelSave'
          onClick={handleCancel}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{
          
            textTransform: 'none',
          
          }}
            className='cancelSave'
          onClick={handleBlockDates}
        >
          Block Dates
        </Button>
      </Box>

      {datesVisible && (
        <Grid container spacing={1} sx={{ mt: 2 }}>
          {selectedDates.map((date, index) => (
            <React.Fragment key={date.toString()}>
              <Grid item xs={12} container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {date.format('MMMM D, YYYY')}
                </Grid>
                <Grid item>
                  <IconButton
                    onClick={() => handleDeleteDate(date)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
              {index < selectedDates.length - 1 && (
                <Grid item xs={12}>
                  <Box sx={{ height: '1px', backgroundColor: 'lightgrey', my: 2 }} />
                </Grid>
              )}
            </React.Fragment>
          ))}
        </Grid>
      )}
    </LocalizationProvider>
  );
}
