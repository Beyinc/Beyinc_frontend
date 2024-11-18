import React, { useRef, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import Badge from '@mui/material/Badge';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import { styled } from '@mui/material/styles';

// Initial value for the calendar
const initialValue = dayjs();

// Styled Badge for availability
const StyledBadge = styled(Badge)(({ theme, isAvailable, isSelected }) => ({
  '& .MuiPickersDay-root': {
    backgroundColor: isSelected
      ? '#4f55c7 !important' // Purple for selected days
      : isAvailable
      ? 'lightgrey !important' // Grey for available days
      : 'transparent', // Transparent for other days
    color: isSelected ? 'white !important' : 'inherit', // White text for selected days
  },
}));

// Styled PickersDay for selected date
const StyledPickersDay = styled(PickersDay)(({ theme, isSelected, disabled }) => ({
  '&.Mui-selected': {
    backgroundColor: '#4f55c7 !important', // Purple background for selected date
    color: 'white !important', // White text color for selected date
  },
  '&:hover': {
    backgroundColor: isSelected ? '#4f55c7 !important' : 'transparent', // Maintain purple background on hover if selected
    color: isSelected ? 'white !important' : 'inherit', // Maintain white text color on hover if selected
  },
  '&.Mui-disabled': {
    backgroundColor: 'transparent !important', // Transparent background for disabled dates
    color: 'grey !important', // Inherit text color for disabled dates
  },
}));

// Day component for displaying availability
function AvailabilityDay(props) {
  const { availableDays, unavailableDates, day, outsideCurrentMonth, selectedDate, period, startDate, ...other } = props;
  const isAvailable = !outsideCurrentMonth && availableDays.includes(day.format('YYYY-MM-DD'));
  const isUnavailable = unavailableDates.includes(day.format('YYYY-MM-DD'));
  const isSelected = selectedDate && day.isSame(selectedDate, 'day');
  const isDisabled = !isAvailable || isUnavailable;

  return (
    <StyledBadge
      key={day.toString()}
      overlap="circular"
      badgeContent={isAvailable ? '' : undefined}
      isAvailable={isAvailable && !isUnavailable}
      isSelected={isSelected}
    >
      <StyledPickersDay
        {...other}
        outsideCurrentMonth={outsideCurrentMonth}
        day={day}
        isSelected={isSelected}
        disabled={isDisabled}
      >
        {day.date()}
      </StyledPickersDay>
    </StyledBadge>
  );
}

export default function DateCalendarServerRequest({selectedDate, onDateChange, period, daysOfWeekToHighlight, unavailableDates, finalAvailableSlots}) {
  const requestAbortController = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [availableDays, setAvailableDays] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);
  const [startDate] = useState(initialValue);


  console.log(unavailableDates)
  const fetchAvailableDays = () => {
    const daysToHighlight = Object.keys(finalAvailableSlots);
    setAvailableDays(daysToHighlight);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAvailableDays();
    return () => requestAbortController.current?.abort();
  }, [period, daysOfWeekToHighlight, finalAvailableSlots]);

  const handleMonthChange = (date) => {
    setIsLoading(true);
    fetchAvailableDays();
  };


  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        defaultValue={initialValue}
        loading={isLoading}
        onMonthChange={handleMonthChange}
        renderLoading={() => <DayCalendarSkeleton />}
        slots={{
          day: AvailabilityDay,
        }}
        slotProps={{
          day: {
            availableDays,
            unavailableDates: unavailableDates.map(date => dayjs(date).format('YYYY-MM-DD')),
            selectedDate,
            period,
            startDate: dayjs(),
          },
        }}
        onChange={onDateChange}
        sx={{ border: '1px solid lightgrey', borderRadius: '10px' }}
      />
    </LocalizationProvider>
  );
}