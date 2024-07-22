import { View, Text, Image, ToastAndroid } from 'react-native'
import React, { useState, useEffect} from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//import homeScreen from '../screens/User/Home/homeScreen';
import { USERCREATE, USERHOME, USERLOGIN, ADMINARENA, ADMINHOME, ADMINPROFILE,ADMINBOOKING } from '../screens';
// import Profile from '../screens/User/Home/Profile';
// import Booking from '../screens/User/Home/Booking';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { enableScreens } from 'react-native-screens';
import { userData } from '../firebase/firebaseFunction/userDetails';
import UserLoginScreen from '../screens/Authentication/Login';
import { IMAGES } from '../assets/constants/global_images';
import UserCreateScreen from '../screens/Authentication/Create';
//import Booking from '../screens/User/Booking';
//import Profile from '../screens/User/Profile';
import LaunchScreen from '../screens/Auth/Launch';
import indexArena from '../screens/courtAdmin/Arena/indexArena';
import indexBooking from '../screens/courtAdmin/Booking/indexBooking';
//import indexSlotDetails from '../screens/courtAdmin/Home/indexHome';
//import indexReviews from '../screens/courtAdmin/Profile/indexProfile';
import indexHome from '../screens/courtAdmin/Home/indexHome';
import indexProfile from '../screens/courtAdmin/Profile/indexProfile';
enableScreens(true);
const Tab = createBottomTabNavigator();

const AdminHomeNavigation = () => {

//     const [initialRoute, setInitialRoute] = useState('');
//     const [userValue, setUserValue] = useState('Login');
//     console.log("initialRoute", initialRoute)
// console.log("userValue", userValue)
//     useEffect(() => {
//       const checkAuth = async () => {
//         const uid = await AsyncStorage.getItem('res-data');
//         console.log("uid", uid);
//         setUserValue(uid?.user_id);
//         setInitialRoute(userValue);
//       };
//       checkAuth();
//     }, []);
const [initialRoute, setInitialRoute] = useState(null);
const [USERDATA, setUserData] = useState();
const [loggedIn, setLoggedIn] = useState(false);
const [loading, setLoading] = useState(true); // Loading state
console.log("USERDATA",USERDATA);

useEffect(() => {
    getdataFn();
  }, []);

  // const getdataFn = async () => {
  //   var value = await AsyncStorage.getItem('res-data');
  //   if(value != null) {
  //       value = JSON.parse(value);
  //       const user = await userData(value?.user_id);
  //       console.log("user", user)
  //       setUserData(user?.user_id);
  //       setLoggedIn(true);
  //       setInitialRoute(USERHOME);
  //   }
  // };
  const getdataFn = async () => {
    try {
      const value = await AsyncStorage.getItem('res-data');
      if (value) {
        const parsedValue = JSON.parse(value);
        const user = await userData(parsedValue?.user_id);
        console.log("user", user)
        if (user) {
          // setUserData(user?.user_id);
          // await AsyncStorage.setItem('uid', JSON.stringify(user?.user_id));
          // setLoggedIn(true);
          // setInitialRoute(ADMINHOME); // Set initial route to home if user is logged in
          if (user?.owner === true) {
            setUserData(user?.user_id);
            await AsyncStorage.setItem('uid', JSON.stringify(user?.user_id));
            setLoggedIn(true);
            setInitialRoute(ADMINHOME); // Set initial route to home if user is an owner
          } else {
            ToastAndroid.show("Please Logged in the owner user", ToastAndroid.SHORT);
            setInitialRoute(USERLOGIN); // Set initial route to login if user is not an owner
          }
        } else {
          setInitialRoute(USERLOGIN); // Set initial route to login if user is not found
        }
      } else {
        setInitialRoute(USERLOGIN); // Set initial route to login if no user data
      }
    } catch (error) {
      console.error("Error fetching user data", error);
      setInitialRoute(USERLOGIN); // Set initial route to login on error
    } finally {
      setLoading(false); // End loading state
    }
  };

  if (loading) {
    return <LaunchScreen />; // Show loading indicator while fetching data
  }
 
  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        headerShown: false,
        tabBarLabelStyle: {
        fontSize: 16,
        paddingVertical:10,
        color:'#898989',
        paddingTop:20,
      },
      }}
      
    >
    {
      loggedIn ? (
        <>
        <Tab.Screen
        name={ADMINHOME}
        component={indexHome}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused  }) => (
            <Image source={focused ? IMAGES.HomeGreen : IMAGES.HomeGray } style={{width:30, height:30}} />
          ),
        }}
      />
        
      <Tab.Screen
        name={ADMINARENA}
        component={indexArena}
        options={{
          tabBarLabel: 'Arena',
          tabBarIcon: ({ focused  }) => (
            <Image source={focused ? IMAGES.BookingGreen : IMAGES.BookingGray} style={{width:30, height:30}} />
          ),
       //   tabBarBadge: 3,
       headerShown: true,
                headerTitle: 'My Arena',
                headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen
        name={ADMINBOOKING}
        component={indexBooking}
        options={{
          tabBarLabel: 'booking',
          tabBarIcon: ({ focused  }) => (
           <Image source={focused ? IMAGES.ProfileGreen : IMAGES.ProfileGray} style={{width:30, height:30}} />
          ),
        }}
      />
      <Tab.Screen
        name={ADMINPROFILE}
        component={indexProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ focused  }) => (
           <Image source={focused ? IMAGES.ProfileGreen : IMAGES.ProfileGray} style={{width:30, height:30}} />
          ),
        }}
      />
     
      </>
      ) : (
        <>
        <Tab.Screen
          name={USERLOGIN}
          component={UserLoginScreen} // Make sure you import or define LoginScreen
          options={{
            tabBarLabel: 'Login',
            tabBarButton: () => null
          }}
        />
        <Tab.Screen
          name={USERCREATE}
          component={UserCreateScreen} // Make sure you import or define LoginScreen
          options={{
            tabBarLabel: 'Login',
            tabBarButton: () => null
          }}
        />
        </>
      )
    }
    
    </Tab.Navigator>
  )
}

export default AdminHomeNavigation