import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
//import RoleScreen from '../screens/Auth/Role/index';
import {  USER } from '../screens';
import AdminStackNavigation from './AdminStackNav'

const Stack = createNativeStackNavigator();

const AuthNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {/* <Stack.Screen name={LAUNCH} component={LaunchScreen} /> */}
      <Stack.Screen name={USER} component={AdminStackNavigation} />
    </Stack.Navigator>
  )
}

export default AuthNavigation