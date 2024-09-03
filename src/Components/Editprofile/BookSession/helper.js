import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
// import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration'; 
dayjs.extend(utc);
// dayjs.extend(timezone);
// Import duration plugin
dayjs.extend(duration); // Extend dayjs with duration plugin

/**
 * Convert time slots from UTC to the specified local timezone.
 * @param {Object} timeSlotsByDay - An object where keys are days of the week (1-7) and values are arrays of time slots.
 * @param {string} localTimezone - The local timezone to which the time slots should be converted (e.g., 'America/New_York').
 * @returns {Object} - An object with converted time slots in the specified local timezone.
 */


export function convertToLocalTimeSlots(data, timeZone) {
  // const timeZone = dayjs.tz.guess(); // Automatically get the local time zone
  const localSlots = {};

  // Logging the initial data and detected time zone
  // console.log("Initial Data:", data);
  // console.log("Detected Time Zone:", timeZone);

  for (const [day, slots] of Object.entries(data)) {
    localSlots[day] = slots.map(slot => {
      const [fromTime, toTime] = slot.split(' - ');

      const fromTimeUtc = dayjs.utc(fromTime, "hh:mm A").tz(timeZone);
      const toTimeUtc = dayjs.utc(toTime, "hh:mm A").tz(timeZone);

      // Handle shifting to the next day if necessary
      const localDay = fromTimeUtc.isAfter(toTimeUtc) ? (parseInt(day) + 1) % 7 || 7 : day;

      const fromTimeLocal = fromTimeUtc.format("hh:mm A");
      const toTimeLocal = toTimeUtc.format("hh:mm A");

      // // Logging the conversion details
      // console.log(`Day: ${day}, From UTC: ${fromTime}, To UTC: ${toTime}`);
      // console.log(`Converted to Local -> Day: ${localDay}, From: ${fromTimeLocal}, To: ${toTimeLocal}`);

      return `${fromTimeLocal} - ${toTimeLocal}`;
    });
  }

  // Logging the final converted local slots
  console.log("Converted Local Time Slots:", localSlots);

  return localSlots
   
}




export function mapTimeSlotsToDates(sessions, timeZone) {
  const mappedSlots = {};

  sessions.forEach(session => {
      // Convert start and end times to the specified timezone
      const startLocal = dayjs(session.startDateTime).tz(timeZone);
      const endLocal = dayjs(session.endDateTime).tz(timeZone);

      // Log the conversion to check if it's correct
      console.log('Original Start Time:', session.startDateTime);
      console.log('Converted Start Time:', startLocal.format('YYYY-MM-DD HH:mm:ss Z'));
      console.log('Original End Time:', session.endDateTime);
      console.log('Converted End Time:', endLocal.format('YYYY-MM-DD HH:mm:ss Z'));

      // Create date key and slot object
      const dateKey = startLocal.format('YYYY-MM-DD');
      const slot = {
          startTime: startLocal.format('HH:mm:ss'),
          endTime: endLocal.format('HH:mm:ss')
      };

      if (!mappedSlots[dateKey]) {
          mappedSlots[dateKey] = [];
      }

      mappedSlots[dateKey].push(slot);
  });

  return mappedSlots;
}



// Function to convert time slots to date-wise format
export function convertSlotsToFormat(availableSlots, startDate, endDate) {
  const result = {};

  for (let date = startDate; date.isBefore(endDate) || date.isSame(endDate); date = date.add(1, 'day')) {
    const dayOfWeek = date.day(); // Get the day of the week (0-6)

    if (availableSlots[dayOfWeek]) {
      availableSlots[dayOfWeek].forEach(slot => {
        const [startTime, endTime] = slot.split(' - ').map(time => dayjs(time, 'hh:mm A').format('HH:mm:ss'));

        const formattedDate = date.format('YYYY-MM-DD');

        if (!result[formattedDate]) {
          result[formattedDate] = [];
        }

        result[formattedDate].push({
          startTime: startTime,
          endTime: endTime
        });
      });
    }
  }

  return result;
}







export function generateNoticeDates(finalAvailableSlots, noticePeriod) {
  // Get today's date
  const today = dayjs().startOf('day');
  // Calculate the cutoff date based on the notice period
  const noticeCutoffDate = today.add(noticePeriod, 'day').endOf('day');

  console.log('Today:', today.format('YYYY-MM-DD'));
  console.log('Notice cutoff date:', noticeCutoffDate.format('YYYY-MM-DD'));

  let invalidDates = [];
console.log('Invalid dates:', invalidDates)
  // Iterate over the available slots to find invalid dates
  Object.keys(finalAvailableSlots).forEach((date) => {
    const availableDate = dayjs(date).startOf('day');

    // console.log('Checking available date:', availableDate.format('YYYY-MM-DD'));

    // Check if the available date is before today or on or before the cutoff date
    if (
      (noticePeriod === 0 && availableDate.isBefore(today, 'day')) || 
      (noticePeriod > 0 && availableDate.isBefore(noticeCutoffDate, 'day') || availableDate.isSame(noticeCutoffDate, 'day'))
    ) {
      // console.log('Invalid notice date:', availableDate.format('YYYY-MM-DD'));
      invalidDates.push(availableDate.format('YYYY-MM-DD'));
    }
  });

  // Remove duplicates and sort the invalid dates
  invalidDates = [...new Set(invalidDates)].sort();

  // console.log('Invalid dates:', invalidDates);
  return invalidDates;
}




// Function to split slots if there are partial overlaps with booked slots
function splitSlots(slot, bookedSlot) {
  const availableSlots = [];

  // If the booked slot starts after the available slot or ends before, the available slot remains intact
  if (bookedSlot.startTime >= slot.endTime || bookedSlot.endTime <= slot.startTime) {
    availableSlots.push(slot);
  } else {
    // If the start of the available slot is before the booked slot, split the available slot
    if (slot.startTime < bookedSlot.startTime) {
      availableSlots.push({
        startTime: slot.startTime,
        endTime: bookedSlot.startTime
      });
    }

    // If the end of the available slot is after the booked slot, split the available slot
    if (slot.endTime > bookedSlot.endTime) {
      availableSlots.push({
        startTime: bookedSlot.endTime,
        endTime: slot.endTime
      });
    }
  }

  return availableSlots;
}


export function getAvailableSlots(formattedSlots, bookedSlots) {
  const availableSlots = {};

  // Iterate over each date in formattedSlots
  for (const date in formattedSlots) {
    // console.log(`Processing date: ${date}`);
    availableSlots[date] = [];

    // Iterate over each available slot for the date
    formattedSlots[date].forEach(slot => {
      // console.log(`  Original slot:`, slot);
      let remainingSlots = [slot]; // Initialize with the original slot

      // If there are booked slots for the same date, process them
      if (bookedSlots[date]) {
        // console.log(`  Booked slots for ${date}:`, bookedSlots[date]);
        bookedSlots[date].forEach(bookedSlot => {
          let tempSlots = [];
          // console.log(`    Processing booked slot:`, bookedSlot);
          remainingSlots.forEach(remainingSlot => {
            // console.log(`      Remaining slot before split:`, remainingSlot);
            // Split the remaining slots based on the booked slot
            const splitResult = splitSlots(remainingSlot, bookedSlot);
            // console.log(`      Split result:`, splitResult);
            tempSlots = tempSlots.concat(splitResult);
          });
          remainingSlots = tempSlots; // Update remaining slots
          // console.log(`    Remaining slots after processing booked slot:`, remainingSlots);
        });
      }

      // Add remaining slots that are still available
      availableSlots[date] = availableSlots[date].concat(remainingSlots);
      // console.log(`  Available slots after processing:`, availableSlots[date]);
    });

    // If no slots are left after filtering, remove the date
    if (availableSlots[date].length === 0) {
      // console.log(`  No available slots left for ${date}, removing the date.`);
      delete availableSlots[date];
    }
  }

  // console.log('Final available slots:', availableSlots);
  return availableSlots;
}


export function generateTimeSlots(availableSlots, selectedDate, durationInMinutes, bufferTimeInMinutes) {
  // Convert the duration and buffer time to milliseconds
  const durationMs = durationInMinutes * 60 * 1000;
  const bufferTimeMs = bufferTimeInMinutes * 60 * 1000 || 0;
  
  // Get the available slots for the selected date
  const slotsForDate = availableSlots[selectedDate] || [];
  
  // Helper function to convert time string to dayjs object
  function timeStringToDayjs(dateStr, timeStr) {
      return dayjs.utc(`${dateStr}T${timeStr}`);
  }

  // Helper function to format dayjs object as 12-hour time string
  function formatTime12Hour(dayjsObj) {
      return dayjsObj.format('h:mm A');
  }

  const result = [];
  
  // Process each available slot
  for (const slot of slotsForDate) {
      let start = timeStringToDayjs(selectedDate, slot.startTime);
      const end = timeStringToDayjs(selectedDate, slot.endTime);
      
      while (start.add(durationMs, 'millisecond').isBefore(end) || start.add(durationMs, 'millisecond').isSame(end)) {
          const slotStartTime = formatTime12Hour(start);
          result.push(slotStartTime);
          start = start.add(durationMs + bufferTimeMs, 'millisecond'); // Move to the next slot with buffer time
      }
  }
  
  return result;
}
