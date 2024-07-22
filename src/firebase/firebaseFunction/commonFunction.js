export const currencyFormate = (price) => {
    price = parseInt(price)
    // console.log(isNaN(price),'price')
    // if(isNaN(price)){

    // }
    return '₹ '+price.toLocaleString("en-IN", {
        minimumFractionDigits: 0,
        maximunFractionDigits: 2,
      });
    
}

export const dateFormate = (currentDate) => {
    currentDate = new Date(currentDate);
    const day = currentDate.getDate();
    const month = currentDate.toLocaleString('default', { month: 'long' }); // Use 'long' for full month name
    const year = currentDate.getFullYear();
    const ampm = currentDate.getHours() >= 12 ? 'PM' : 'AM';
    const hours = currentDate.getHours() % 12 || 12; // Adjust hours for 12-hour format
    const minutes = ("0" + currentDate.getMinutes()).slice(-2);

    return `${day} - ${month} - ${year}, ${hours}:${minutes} ${ampm}`;
}