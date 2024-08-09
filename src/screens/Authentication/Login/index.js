import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
  View,
  ActivityIndicator,
} from 'react-native';
import {ROLE, USERCREATE, USERBOOTOM, USERLOGIN} from '../..';
import {COLORS} from '../../../assets/constants/global_colors';
import {
  Outfit,
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
} from '../../../assets/constants/global_fonts';
import {IMAGES} from '../../../assets/constants/global_images';
import {StatusBarCommon} from '../../../components';
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import OTPTextInput from 'react-native-otp-textinput';
import {firebaseConfig} from '../../../firebase/firebase';
import {
  getadminconfig,
  loginmobile,
  loginverifyOtp,
} from '../../../firebase/firebaseFunction/auth';
import {FetchDataById} from '../../../firebase/firebaseFunction/crud';
import {hS, mS} from '../../../utils/metrics';
//import { UserLoginScreenStyles } from '../../User/Create/styles';
import {UserLoginScreenStyles, UserOtpScreenStyles} from '../Create/styles';
import PhoneInput from 'react-native-phone-number-input';
import Icon from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';

//import AuthNavigation from '../../../navigation/AuthNavigation';

const UserLoginScreen = () => {
  const navigation = useNavigation();

  const [userPhone, setUserPhone] = useState('');
  const [loader, setLoader] = useState(false);
  const recaptchaVerifier = useRef(null);

  const [verificationId, setVerificationID] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enterOTP, setEnterOTP] = useState(false);

  const OTPref = useRef(null);

  const CloseEnterOTPFn = () => {
    setEnterOTP(false);
    setVerificationCode('');
  };

  const SendOTPFn = async () => {
    if (userPhone?.length == 13) {
      if (verificationId != '') {
        setEnterOTP(true);
      } else {
        const res = await loginmobile(userPhone, recaptchaVerifier);
        setVerificationID(res.verificationId);
        setEnterOTP(true);
        setSeconds(30);
      }
    } else {
      ToastAndroid.show('Enter valid phone number', ToastAndroid.SHORT);
    }
  };

  const LoginFn = async () => {
    if (verificationCode?.length == 6) {
      const response = await loginverifyOtp(verificationCode, verificationId);
      console.log('response---', response, verificationCode, verificationId);

      // ToastAndroid.show(response?.msg, ToastAndroid.SHORT);

      if (!response.error) {
        if (response?.data?.user_id != '' && response?.data != null) {
          // const userdata = await FetchDataById('user', response.data.user_id);

          const res = response?.data;
          console.log('res Vies', res);
          if (res?.usertype != '') {
            setUserPhone('');
            setVerificationCode('');

            const jsonValue = JSON.stringify(res);
            console.log('jsonValue', jsonValue);
            await AsyncStorage.setItem('res-data', jsonValue);

            if (res?.owner === true) {
              navigation.replace(USERBOOTOM);
              ToastAndroid.show(
                'User Logged In Successfully',
                ToastAndroid.SHORT,
              );
              // } else if (res?.usertype == 'venzoadmin') {
              //   navigation.replace(USERBOOTOM);
            } else {
              navigation.replace(USERBOOTOM);
              ToastAndroid.show('You are not the owner', ToastAndroid.SHORT);

              // navigation.navigate(USERHOME);
            }
          }
        }
      } else {
        // setVerificationCode('');
        OTPref.current = null;
      }
    } else {
      ToastAndroid.show('Enter valid OTP', ToastAndroid.SHORT);
    }
  };

  let otpInput = useRef(null);

  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue('123456');
  };

  const [seconds, setSeconds] = useState(0);

  const clearVerificationId = () => {
    setVerificationID('');
  };
  const handleBackButtonPress = () => {
    if (!enterOTP) {
      navigation.goBack();
    } else {
      CloseEnterOTPFn();
    }
  };

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 1) {
            clearInterval(interval); // Stop the countdown when it reaches 0
            clearVerificationId(); // You can perform additional actions here when the countdown reaches 0
            //console.log("Trigger Clear")
          }
          return prevSeconds - 1;
        });
      }, 1000);

      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [seconds]); // Empty dependency array ensures the effect runs only once on mount

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  const signupFn = async () => {
    const config = await getadminconfig();

    if (config?.allowadmin) {
      navigation.navigate(ROLE);
    } else {
      const role = 'user';
      navigation.navigate(USERCREATE, {role});
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView>
        <ImageBackground
          style={{width: '100%', height: '100%'}}
          source={IMAGES.LoginBgImage}
          resizeMode="cover">
          <StatusBarCommon color={COLORS.PRIMARY} />
          <SafeAreaView style={UserLoginScreenStyles.safe}>
            {/* recaptchaVerifier */}
            <FirebaseRecaptchaVerifierModal
              ref={recaptchaVerifier}
              firebaseConfig={firebaseConfig}
            />
            <View style={UserLoginScreenStyles.logoContainer}>
              <Image source={IMAGES.logoImage} resizeMode="contain" />
            </View>
            <View style={UserLoginScreenStyles.loginContainer}>
              {!enterOTP ? (
                <>
                  <Text
                    style={[
                      UserLoginScreenStyles.headingTxt,
                      {paddingTop: 65},
                    ]}>
                    Login
                  </Text>
                  <Text style={[UserLoginScreenStyles.loginSubText]}>
                    Login to your account
                  </Text>
                  <View style={{paddingBottom: '15%'}}>
                    <Text
                      style={{
                        paddingTop: '20%',
                        paddingBottom: 10,
                        fontFamily: 'Outfit-Regular',
                        fontSize: hS(16),
                        lineHeight: 20.16,
                        color: '#1b1b1b',
                      }}>
                      Mobile Number
                    </Text>
                    <PhoneInput
                      placeholder="Mobile Number"
                      placeholderColor="red"
                      textInputProps={{
                        keyboardType: 'numeric',
                        maxLength: 10,
                      }}
                      defaultValue={!enterOTP ? '' : userPhone}
                      defaultCode="IN"
                      layout="first"
                      onChangeFormattedText={val => {
                        if (val.replace(/\D/g, '').length <= 12) {
                          // console.log('val',val);
                          setUserPhone(val);
                        } else {
                          ToastAndroid.show(
                            'Phone number should not exceed 10 digits',
                            ToastAndroid.SHORT,
                          );
                        }
                      }}
                      containerStyle={UserLoginScreenStyles.phoneInputContainer}
                      textContainerStyle={
                        UserLoginScreenStyles.phoneInputTextContainer
                      }
                      textInputStyle={{
                        paddingBottom: 8,
                        color: COLORS.BLACK,
                        fontSize: hS(16),
                        fontFamily: 'Outfit-Regular',
                      }}
                    />
                  </View>
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.75}
                      onPress={SendOTPFn}
                      style={UserLoginScreenStyles.loginBox}>
                      <Text style={UserLoginScreenStyles.loginTxt}>
                        {verificationId == '' ? 'Get OTP' : 'Login'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={UserLoginScreenStyles.otpBottom}>
                  <View>
                    <View style={UserOtpScreenStyles.title}>
                      <Text style={UserOtpScreenStyles.headingTxt}>
                        6-digit Code
                      </Text>
                    </View>
                    <Text style={UserLoginScreenStyles.loginSubText}>
                      Please enter the code we’ve sent to{'\n'}
                      <View style={{flexDirection: 'row', gap: 5}}>
                        <View style={{paddingTop: 10}}>
                          <Text style={UserLoginScreenStyles.phoneCodeText}>
                            {userPhone}
                          </Text>
                        </View>
                        <View style={{paddingTop: 10}}>
                          <TouchableOpacity onPress={handleBackButtonPress}>
                            <Entypo name="edit" size={20} color="#018352" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Text>
                    <OTPTextInput
                      ref={OTPref}
                      containerStyle={{
                        marginVertical: hS(16),
                      }}
                      autoFocus={true}
                      handleTextChange={e => setVerificationCode(e)}
                      inputCount={6}
                      textInputStyle={{
                        fontSize: 20,
                        backgroundColor: '#F9F9F6',
                        borderColor: 'F1F2F7',
                        borderWidth: 1.5,
                        borderRadius: 14,
                        width: 48,
                        height: 48,
                        margin: 0,
                        paddingTop: 10,
                        borderBottomWidth: 1.5,
                      }}
                    />
                  </View>

                  <Text style={UserLoginScreenStyles.otpResendTxt}>
                    Resend Code in {}
                    <Text
                      style={{
                        fontFamily: 'Outfit-Medium',
                        color: '#000',
                      }}
                      onPress={seconds === 0 ? SendOTPFn : null}>
                      {seconds ? formatTime(seconds) : ' Resend'}
                    </Text>
                  </Text>

                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={LoginFn}
                    style={UserLoginScreenStyles.loginBox}>
                    <Text style={UserLoginScreenStyles.loginTxt}>Login</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={UserLoginScreenStyles.lineContainer}>
                <View style={UserLoginScreenStyles.line} />
                <Text style={UserLoginScreenStyles.lineText}>OR</Text>
                <View style={UserLoginScreenStyles.line} />
              </View>
              <Text style={UserLoginScreenStyles.bottomaskTxt1}>
                Don't have an Account ?{' '}
                <Text
                  onPress={signupFn}
                  style={UserLoginScreenStyles.bottomaskTxt2}>
                  Sign up
                </Text>
              </Text>
            </View>
          </SafeAreaView>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UserLoginScreen;
