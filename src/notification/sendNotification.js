import axios from 'axios';

const sendNotification = async (fcmToken, title, body) => {
  // Fetch the access token from your server
  const tokenResponse = await axios.get(
    'https://sea-turtle-app-96vw6.ondigitalocean.app/getAccessToken',
  );
  const accessToken = tokenResponse.data.accessToken;
  console.log('accessToken: ', accessToken);
  // Notification payload
  const payload = {
    message: {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
    },
  };

  // Config for the request, including the authorization header with the access token
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  };
  try {
    // Send the notification to the Firebase FCM API
    const response = await axios.post(
      'https://fcm.googleapis.com/v1/projects/turfmama-5f88b/messages:send',
      payload,
      config,
    );

    console.log('Notification sent successfully:', response.data);
  } catch (error) {
    console.error('Error sending notification:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Error request data:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
  }
};

export {sendNotification};
