import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {
  USERCREATE,
  USERLOGIN,
  USERBOOTOM,
  USERPROFILE,
  ADDARENA,
  ADMINARENA,
  ADMINARENAVIEWS,
  ADMINBOOKING,
  ADMINBOOKINGVIEWS,
  ADMINCOURTVIEWS,
  ADMINREVIEWVIEWS,
  ADMINTOPTABNAVIGATION,
} from '../screens';
import UserCreateScreen from '../screens/Authentication/Create';
import UserLoginScreen from '../screens/Authentication/Login';
import {Button, TouchableOpacity} from 'react-native';
import {IMAGES} from '../assets/constants/global_images';
import {Image} from 'react-native';
import AdminHomeNavigation from './AdminHomeNavigation';
import ProfileView from '../screens/courtAdmin/Profile/ProfileView';
import AddArena from '../screens/courtAdmin/Arena/ArenaDetails/AddArena';
import ReviewScreen from '../screens/courtAdmin/Arena/ArenaDetails/ReviewScreen';
import CourtScreen from '../screens/courtAdmin/Arena/ArenaDetails/CourtScreen';
import BookingScreen from '../screens/courtAdmin/Arena/ArenaDetails/BookingScreen';
import ArenaScreen from '../screens/courtAdmin/Arena/ArenaDetails/ArenaScreen';
import AdminTopTabNavigation from './AdminTopTabNavigation';

const Stack = createNativeStackNavigator();

const AdminStackNav = ({route}) => {
  //console.log("route", route)
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {/* <Stack.Screen name={USERHOME} component={UserHomeScreen} /> */}
      <Stack.Screen name={USERBOOTOM} component={AdminHomeNavigation} />
      <Stack.Screen name={USERCREATE} component={UserCreateScreen} />
      <Stack.Screen name={USERLOGIN} component={UserLoginScreen} />
      <Stack.Screen
        name={ADMINTOPTABNAVIGATION}
        component={AdminTopTabNavigation}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Add Arena',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate(ADMINARENA, {refresh: true})}>
              <Image
                source={IMAGES.LeftBackArrow} // Path to your custom back arrow image if needed
                style={{width: 20, height: 20, marginLeft: 4}}
              />
            </TouchableOpacity>
          ),
        })}
      />

      <Stack.Screen
        name={USERPROFILE}
        component={ProfileView}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Profile',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('profile', {refreshProfiles: true})
              }>
              <Image
                source={IMAGES.LeftBackArrow} // Path to your custom back arrow image if needed
                style={{width: 20, height: 20, marginLeft: 4}}
              />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name={ADDARENA}
        component={AddArena}
        options={({navigation}) => ({
          headerShown: true,
          headerTitle: 'Add Arena',
          headerTitleAlign: 'center',
          headerBackTitleVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.navigate(ADMINARENA)}>
              <Image
                source={IMAGES.LeftBackArrow} // Path to your custom back arrow image if needed
                style={{width: 20, height: 20, marginLeft: 4}}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

export default AdminStackNav;
