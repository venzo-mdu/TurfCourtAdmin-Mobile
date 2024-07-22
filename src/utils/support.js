import moment from "moment";

export const UnixFn = (convertdate) => {
    const date = moment.unix(convertdate);

    const formattedDate = moment(date).toDate();

    return formattedDate;
};

export const convertTo12HourFormat = (time24) => {
    // Split the input time into hours and minutes
    var [hours, minutes] = time24?.split(':');
  
    // Convert the hours to a number
    hours = parseInt(hours, 10);
  
    // Determine whether it's AM or PM
    var ampm = hours >= 12 ? 'pm' : 'am';
  
    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // If hours is 0, set it to 12
    hours = hours < 10 ? '0' + hours : hours;
  
    // Add leading zero to minutes if needed
    minutes = minutes.length === 1 ? '0' + minutes : minutes;
  
    // Construct the 12-hour formatted time string
    var time12 = hours + ':' + minutes + ampm;
  
    return time12;
};
  
export const getCurrentLocationCity = async (latitude, longitude) => {
    await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,)
        .then(response => response.json())
        .then(data => {
            var city = data?.address?.city;
            
            // Extract city and country information from the response
            // const city =
            //   data.address.city ||
            //   data.address.town ||
            //   data.address.village ||
            //   data.address.hamlet;
            // const country = data.address.country;

            return city;
        })
    
        .catch(error => {
            // Handle errors
            console.error('Error:', error);
        });

}