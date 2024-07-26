import React from 'react';
import {StatusBar} from 'react-native';

const StatusBarCommon = props => {
  return (
    <StatusBar
      animated={true}
      // backgroundColor={props.color}
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
      showHideTransition="fade"
    />
  );
};

export default StatusBarCommon;
