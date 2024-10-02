export function formatSlotTime(timeString) {
  let date;

  // Check if the time is in ISO format or just time (HH:mm)
  if (timeString.includes('T')) {
    // If it's an ISO string, create a new Date object
    date = new Date(timeString);
  } else {
    // If it's just time, create a new Date object with today's date
    const today = new Date();
    const [hours, minutes] = timeString.split(':');
    date = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes,
    );
  }

  // Extract the hours and minutes
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine AM/PM
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 24-hour format to 12-hour format

  // Format minutes to always be two digits
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Construct the final formatted time string
  const formattedTime = `${hours}:${formattedMinutes} ${ampm}`;

  return formattedTime;
}
