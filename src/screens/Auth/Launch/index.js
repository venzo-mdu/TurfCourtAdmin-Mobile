import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLORS} from '../../../assets/constants/global_colors';
import {IMAGES} from '../../../assets/constants/global_images';
import {StatusBarCommon} from '../../../components';
import {ADMINDRAWER, USERDRAWER, VENZOADMINDRAWER} from '../..';
import {Image} from 'react-native';

const LaunchScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const flash_timer = setTimeout(() => {
      getUsersFn();
    }, 1500);

    return () => {
      clearTimeout(flash_timer);
    };
  }, []);

  const getUsersFn = async () => {
    // var res = {
    //   avatar: null,
    //   email: "san@turf.com",
    //   isuseractive: true,
    //   phonenumber: "6382918880",
    //   username: "F.Santhiya",
    //   usertype: "admin",
    //   user_id: "CUPHGCMRL0WBDIJwLKNuWgZUNL53"
    // };

    // var res = {
    //   avatar: null,
    //   email: "nash@user.com",
    //   isuseractive: true,
    //   phonenumber: "9789515946",
    //   username: "Nash user",
    //   usertype: "user",
    //   user_id: "FcgYgigJTmOp8DEvRo4GJoqmC2P2"
    // };

    var value = await AsyncStorage.getItem('res-data');
    value = JSON.parse(value);

    // var value = (res);

    // const jsonValue = JSON.stringify(res);

    // await AsyncStorage.setItem('res-data', jsonValue);

    if (value != null) {
      if (value?.usertype == 'admin') {
        navigation.navigate(ADMINDRAWER);
      } else if (value?.usertype == 'venzoadmin') {
        navigation.navigate(VENZOADMINDRAWER);
      } else {
        navigation.navigate(USERLOGIN);
      }
    } else {
      navigation.navigate(USERLOGIN);
    }
  };

  return (
    <View onTouchEnd={getUsersFn} style={LaunchScreenStyles.container}>
      <StatusBarCommon color={COLORS.PRIMARY} />
      <View style={LaunchScreenStyles.centeredView}>
        <Image source={IMAGES.LogoSplashOne} style={LaunchScreenStyles.logo} />
      </View>
    </View>
  );
};

export default LaunchScreen;

const LaunchScreenStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  centeredView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
});
