import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AuthNavigation from './src/routing/AuthNavigation';
import TestScreenView from './src/screens/testScreen';

const App = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
      {/* <TestScreenView /> */}
    </NavigationContainer>
  );
};

export default App;
