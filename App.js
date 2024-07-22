import { NavigationContainer } from '@react-navigation/native'
import React from 'react'
import AuthNavigation from './src/routing/AuthNavigation'


const App = () => {
  return (
    <NavigationContainer>
      <AuthNavigation />
    </NavigationContainer>
  )
}

export default App
