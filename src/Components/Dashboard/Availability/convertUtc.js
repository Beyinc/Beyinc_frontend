import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export function convertToUTCAndShift(timeSlotsLocal) {
  const timeSlotsUTC = {};
  const timezoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(timezone);  // e.g., 'Asia/Kolkata'


  Object.entries(timeSlotsLocal).forEach(([day, slots]) => {
    timeSlotsUTC[day] = [];

    slots.forEach(slot => {
      const [startTime, endTime] = slot.split(' - ');

      const startUTC = dayjs.tz(`2024-01-01 ${startTime}`, 'YYYY-MM-DD h:mma', timezoneName).utc();
      const endUTC = dayjs.tz(`2024-01-01 ${endTime}`, 'YYYY-MM-DD h:mma', timezoneName).utc();

      let formattedStartUTC = startUTC.format('h:mma');
      let formattedEndUTC = endUTC.format('h:mma');

      if (startUTC.day() !== endUTC.day()) {
        // If end time shifts to the next day
        const nextDay = (parseInt(day) % 7) + 1;
        timeSlotsUTC[day].push(`${formattedStartUTC} - 11:59pm`);
        timeSlotsUTC[nextDay] = timeSlotsUTC[nextDay] || [];
        timeSlotsUTC[nextDay].push(`12:00am - ${formattedEndUTC}`);
      } else {
        timeSlotsUTC[day].push(`${formattedStartUTC} - ${formattedEndUTC}`);
      }
    });
  });

  return timeSlotsUTC;
}

const timeSlotsLocal = {
  1: ['12:30 AM - 01:15 AM'], // Monday
  2: ['12:15 AM - 01:45 AM'], // Tuesday
  6: ['12:00 AM - 03:00 PM'], // Saturday
  // Add more days as needed
};

// const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
// console.log(timezone);  // e.g., 'Asia/Kolkata'

// const timeSlotsUTC = convertToUTCAndShift(timeSlotsLocal, timezone);
// console.log(timeSlotsUTC);
