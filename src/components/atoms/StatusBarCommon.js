import React from 'react'
import { StatusBar } from 'react-native'

const StatusBarCommon = (props) => {
  return (
    <StatusBar
        animated={true}
        backgroundColor={props.color}
        barStyle="light-content"
        showHideTransition="fade"
    />
  )
}

export default StatusBarCommon