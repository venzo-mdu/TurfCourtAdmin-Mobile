export function getTimeFormatted(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const dayIndex = date.getDay();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; 
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];  // Array of day names

    let cdate = date?.getDate()
    const month = months[date.getMonth()]; 
    let year = date?.getFullYear()
    const day = days[dayIndex];

    const formatedDate = `${cdate} ${month} ${year}`
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    const formatedaytime = `${day}, ${month} ${cdate}`
    return {Time:formattedTime, Date:formatedDate, formatedate: formatedaytime};
}
