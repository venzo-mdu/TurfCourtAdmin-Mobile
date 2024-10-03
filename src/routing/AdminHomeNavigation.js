import {View, Text, Image, ToastAndroid} from 'react-native';
import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import messaging from '@react-native-firebase/messaging';
import {
  USERCREATE,
  USERLOGIN,
  ADMINHOME,
  ADMINPROFILE,
  ADMINBOOKING,
} from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {enableScreens} from 'react-native-screens';
import {
  UpdateUserData,
  userData,
} from '../firebase/firebaseFunction/userDetails';
import UserLoginScreen from '../screens/Authentication/Login';
import {IMAGES} from '../assets/constants/global_images';
import UserCreateScreen from '../screens/Authentication/Create';
import LaunchScreen from '../screens/Auth/Launch';
import IndexHome from '../screens/courtAdmin/Home/indexHome';
import {COLORS} from '../assets/constants/global_colors';
import BookingScreen from '../screens/courtAdmin/Arena/ArenaDetails/BookingScreen';
import ProfileView from '../screens/courtAdmin/Profile/ProfileView';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';

enableScreens(true);
const Tab = createBottomTabNavigator();

const AdminHomeNavigation = () => {
  const [initialRoute, setInitialRoute] = useState(null);
  const [USERDATA, setUserData] = useState();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getdataFn();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      const {title, body} = remoteMessage.notification;
      displayNotification(title, body);
    });
    return unsubscribe;
  }, []);

  const displayNotification = async (title, body) => {
    await notifee.requestPermission();
    const channelId = await notifee.createChannel({
      id: 'TurfMama',
      name: 'TurfMama Notification Channel',
      vibration: true,
      importance: AndroidImportance.HIGH,
      vibrationPattern: [300, 500],
    });

    await notifee.displayNotification({
      title: title,
      body: body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'TurfMama',
        },
      },
    });
  };

  // const getdataFn = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem('res-data');
  //     if (value) {
  //       const parsedValue = JSON.parse(value);
  //       const user = await userData(parsedValue?.user_id);
  //       if (user) {
  //         if (user?.owner === true) {
  //           setUserData(user?.user_id);
  //           await AsyncStorage.setItem('uid', JSON.stringify(user?.user_id));
  //           const TokenData = user?.fcmToken;
  //           if (!TokenData) {
  //             const token = await getFCMToken();
  //             await AsyncStorage.setItem('fcmToken', token);
  //             const userDetails = await userData(user?.user_id);
  //             if (userDetails) {
  //               userDetails.fcmToken = token;
  //               const updatedata = await UpdateUserData(
  //                 userDetails,
  //                 user?.user_id,
  //               );
  //               if (updatedata?.status === 'success') {
  //                 console.log('update successfully');
  //               } else {
  //                 console.error('update data failed');
  //                 ToastAndroid.showWithGravity(
  //                   'Token update failed. Please Contact TurfMama Admin',
  //                   ToastAndroid.SHORT,
  //                   ToastAndroid.CENTER,
  //                 );
  //               }
  //             }
  //           } else {
  //             await AsyncStorage.setItem(
  //               'fcmToken',
  //               JSON.stringify(user?.fcmToken),
  //             );
  //           }
  //           setLoggedIn(true);
  //           setInitialRoute(ADMINHOME);
  //         } else {
  //           ToastAndroid.show(
  //             'Please Logged in the owner user',
  //             ToastAndroid.SHORT,
  //           );
  //           setInitialRoute(USERLOGIN);
  //         }
  //       } else {
  //         setInitialRoute(USERLOGIN);
  //       }
  //     } else {
  //       setInitialRoute(USERLOGIN);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching user data', error);
  //     setInitialRoute(USERLOGIN);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getdataFn = async () => {
    try {
      const value = await AsyncStorage.getItem('res-data');
      if (value) {
        const parsedValue = JSON.parse(value);
        const user = await userData(parsedValue?.user_id);
        if (user) {
          if (user?.owner === true) {
            setUserData(user?.user_id);
            await AsyncStorage.setItem('uid', JSON.stringify(user?.user_id));

            // Fetch the FCM tokens (assuming an array is stored in `fcmTokens`)
            const TokenData = user?.fcmTokens || []; // Fallback to empty array if no tokens exist
            const currentToken = await AsyncStorage.getItem('fcmToken');

            // Check if current FCM token already exists in fcmTokens
            if (!TokenData.includes(currentToken)) {
              const token = await getFCMToken();
              await AsyncStorage.setItem('fcmToken', token);

              // Update the user's fcmTokens array
              const userDetails = await userData(user?.user_id);
              if (userDetails) {
                userDetails.fcmTokens = [
                  ...(userDetails?.fcmTokens || []),
                  token,
                ]; // Add new token to fcmTokens array

                const updatedata = await UpdateUserData(
                  userDetails,
                  user?.user_id,
                );
                if (updatedata?.status === 'success') {
                  console.log('Token updated successfully');
                } else {
                  console.error('Token update failed');
                  ToastAndroid.showWithGravity(
                    'Token update failed. Please contact TurfMama Admin',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER,
                  );
                }
              }
            } else {
              // Token is already up-to-date, store it locally
              await AsyncStorage.setItem('fcmToken', currentToken);
            }

            setLoggedIn(true);
            setInitialRoute(ADMINHOME);
          } else {
            ToastAndroid.show(
              'Please log in as the owner user',
              ToastAndroid.SHORT,
            );
            setInitialRoute(USERLOGIN);
          }
        } else {
          setInitialRoute(USERLOGIN);
        }
      } else {
        setInitialRoute(USERLOGIN);
      }
    } catch (error) {
      console.error('Error fetching user data', error);
      setInitialRoute(USERLOGIN);
    } finally {
      setLoading(false);
    }
  };

  const getFCMToken = async () => {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
        return fcmToken;
      } else {
        console.log('Failed to get FCM token');
        return null;
      }
    } catch (error) {
      console.log('Error fetching FCM token:', error);
      return null;
    }
  };

  if (loading) {
    return <LaunchScreen />;
  }

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 16,
          paddingVertical: 10,
          color: '#898989',
          paddingTop: 20,
        },
      }}>
      {loggedIn ? (
        <>
          <Tab.Screen
            name={ADMINHOME}
            component={() => <IndexHome />}
            options={{
              tabBarLabel: ({focused}) => (
                <Text
                  style={{
                    fontFamily: focused ? 'Outfit-SemiBold' : 'Outfit-Light',
                    fontSize: 16,
                    color: focused ? '#3a3a3a' : '#898989',
                    lineHeight: 20.16,
                  }}>
                  Home
                </Text>
              ),
              tabBarIcon: ({focused}) => (
                <Image
                  source={focused ? IMAGES.HomeGreen : IMAGES.HomeGray}
                  style={{width: 30, height: 30}}
                />
              ),
              tabBarStyle: {
                height: 80,
                paddingBottom: 10,
                paddingTop: 10,
              },
              headerStyle: {
                backgroundColor: COLORS.bgColor,
              },
              headerTitle: 'Bookings',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                fontSize: 22,
                lineHeight: 27.72,
              },
            }}
          />

          <Tab.Screen
            name={ADMINBOOKING}
            component={() => <BookingScreen />}
            options={{
              tabBarLabel: ({focused}) => (
                <Text
                  style={{
                    fontFamily: focused ? 'Outfit-SemiBold' : 'Outfit-Light',
                    fontSize: 16,
                    color: focused ? '#3a3a3a' : '#898989',
                    lineHeight: 20.16,
                  }}>
                  Bookings
                </Text>
              ),
              tabBarIcon: ({focused}) => (
                <Image
                  source={focused ? IMAGES.BookingGreen : IMAGES.BookingGray}
                  style={{width: 30, height: 30}}
                />
              ),
              tabBarStyle: {
                height: 80,
                paddingBottom: 10,
                paddingTop: 10,
              },
              headerStyle: {
                backgroundColor: COLORS.bgColor,
              },
              headerTitle: 'Bookings',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                fontSize: 22,
                lineHeight: 27.72,
              },
            }}
          />
          <Tab.Screen
            name={ADMINPROFILE}
            component={ProfileView}
            options={{
              headerTitle: 'Profile',
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontFamily: 'Outfit-Medium',
                fontSize: 22,
                lineHeight: 27.72,
              },
              headerStyle: {
                backgroundColor: COLORS.bgColor,
              },
              tabBarLabel: ({focused}) => (
                <Text
                  style={{
                    fontFamily: focused ? 'Outfit-SemiBold' : 'Outfit-Light',
                    fontSize: 16,
                    color: focused ? '#3a3a3a' : '#898989',
                    lineHeight: 20.16,
                  }}>
                  Profile
                </Text>
              ),
              tabBarIcon: ({focused}) => (
                <Image
                  source={focused ? IMAGES.ProfileGreen : IMAGES.ProfileGray}
                  style={{width: 30, height: 30}}
                />
              ),
              tabBarStyle: {
                height: 80,
                paddingBottom: 10,
                paddingTop: 10,
              },
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name={USERLOGIN}
            component={UserLoginScreen}
            options={{
              tabBarStyle: {
                height: 0,
              },
              tabBarLabel: 'Login',
              tabBarButton: () => null,
            }}
          />
          <Tab.Screen
            name={USERCREATE}
            component={UserCreateScreen}
            options={{
              tabBarStyle: {
                height: 0,
              },
              tabBarLabel: 'Login',
              tabBarButton: () => null,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default AdminHomeNavigation;
