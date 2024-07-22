import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { Image, ImageBackground, Modal, SafeAreaView, Text, TextInput, ToastAndroid, TouchableOpacity, View } from 'react-native';
import {  ROLE, USERCREATE, USERBOOTOM, USERLOGIN } from '../..';
import { COLORS } from '../../../assets/constants/global_colors';
import { PoppinsMedium, PoppinsRegular, PoppinsSemiBold } from '../../../assets/constants/global_fonts';
import { IMAGES } from '../../../assets/constants/global_images';
import { StatusBarCommon } from '../../../components';
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha';
import OTPTextInput from 'react-native-otp-textinput';
import { firebaseConfig } from '../../../firebase/firebase';
import { getadminconfig, loginmobile, loginverifyOtp } from '../../../firebase/firebaseFunction/auth';
import { FetchDataById } from '../../../firebase/firebaseFunction/crud';
import { hS, mS } from '../../../utils/metrics';
//import { UserLoginScreenStyles } from '../../User/Create/styles';
import { UserLoginScreenStyles } from '../Create/styles';
import PhoneInput from 'react-native-phone-number-input';
//import AuthNavigation from '../../../navigation/AuthNavigation';

const UserLoginScreen = () => {
  const navigation = useNavigation();


  const [userPhone, setUserPhone] = useState('');

  const recaptchaVerifier = useRef(null);

  const [verificationId, setVerificationID] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enterOTP, setEnterOTP] = useState(false);

  const OTPref = useRef(null);

  const CloseEnterOTPFn = () => {
    setEnterOTP(false);
    setVerificationCode("");
  };

  const SendOTPFn = async () => {

    if(userPhone?.length == 13) {
      console.log("HI1")
      if(verificationId != "") {
        console.log("HI12")
        console.log("verificationId", verificationId)
        setEnterOTP(true);
      } else {
        console.log("userPhone", userPhone)
        console.log("HI123")
        const res = await loginmobile(userPhone, recaptchaVerifier);
        console.log("res", res)
        setVerificationID(res.verificationId);
        setEnterOTP(true);
        setSeconds(30);
      }

    } else {
      ToastAndroid.show("Enter valid phone number", ToastAndroid.SHORT);
    }
  };

  const LoginFn = async () => {

    if(verificationCode?.length == 6) {
        const response = await loginverifyOtp(verificationCode, verificationId);

        //ToastAndroid.show(response?.msg, ToastAndroid.SHORT);

        if (!response.error) {
          if (response?.data?.user_id != '' && response?.data != null) {
            // const userdata = await FetchDataById('user', response.data.user_id);

            const res = response?.data;
            console.log("res Vies", res);
            if (res?.usertype != '') {
              setUserPhone('');
              setVerificationCode('');

              const jsonValue = JSON.stringify(res);
console.log("jsonValue", jsonValue)
              await AsyncStorage.setItem('res-data', jsonValue);

              if (res?.owner === true) {
                navigation.replace(USERBOOTOM);
                ToastAndroid.show("User Logged In Successfully", ToastAndroid.SHORT);
              // } else if (res?.usertype == 'venzoadmin') {
              //   navigation.replace(USERBOOTOM);
              } else {
                navigation.replace(USERBOOTOM);
                ToastAndroid.show("You are not the owner", ToastAndroid.SHORT);
                
                // navigation.navigate(USERHOME);
              }
            }
          }
        } else {
          // setVerificationCode('');
          OTPref.current = null;
        }
    } else {
      ToastAndroid.show("Enter valid OTP", ToastAndroid.SHORT);
    }
  };

  let otpInput = useRef(null);

  const clearText = () => {
    otpInput.current.clear();
  };

  const setText = () => {
    otpInput.current.setValue("123456");
  };

  const [seconds, setSeconds] = useState(0);

  const clearVerificationId = () => {
    setVerificationID('');
  };

  useEffect(() => {
    if (seconds > 0) {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const signupFn = async () => {
    const config = await getadminconfig();

    if(config?.allowadmin) {
      navigation.navigate(ROLE);
    } else {
      const role = "user";
      navigation.navigate(USERCREATE, {role});
    }
  };

  return (
    <View>
    <ImageBackground source={IMAGES.LoginBgImage}>
      <StatusBarCommon color={COLORS.PRIMARY} />

      <SafeAreaView style={UserLoginScreenStyles.safe}>
        {/* recaptchaVerifier */}
        <FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={firebaseConfig}
        />
<View style={UserLoginScreenStyles.topContainer}>
<Image source={IMAGES.logoImage} />
</View>
<View style={UserLoginScreenStyles.loginContainer}>
        {/* <Text style={UserLoginScreenStyles.headingTxt}>Welcome</Text> */}
        <Text style={[UserLoginScreenStyles.headingTxt, {paddingTop:40}]}>Login</Text>
          <Text style={UserLoginScreenStyles.loginSubText}>Login to Your Account</Text>
{
  !enterOTP ? (
    <>
    <View style={[UserLoginScreenStyles.phoneBox, {flexDirection: 'row', paddingTop:4}]}>
          {/* <TextInput
            value={'+91'}
            style={UserLoginScreenStyles.phoneBoxIP}
            editable={false}
          />

          <TextInput
            value={userPhone}
            onChangeText={val => setUserPhone(val.replace(/[^0-9]/g, ''))}
            style={[ UserLoginScreenStyles.phoneBoxIP, { flex: 1, fontSize: userPhone ? mS(18) : mS(16), fontFamily: userPhone ? PoppinsMedium : PoppinsRegular } ]}
            keyboardType={'numeric'}
            placeholder={'Enter your phone number'}
            placeholderTextColor={COLORS.PLACEHOLDERGREY}
            maxLength={10}
          /> */}
           <PhoneInput
        defaultValue={userPhone}
        defaultCode="IN"
        layout="first"
        //onChangeFormattedText={(val) => setUserPhone(val)}
        onChangeFormattedText={(val) => {
            // Limit the input to 13 characters (including the country code, e.g., +91xxxxxxxxxx)
            if (val.replace(/\D/g, '').length <= 12) {
              setUserPhone(val);
            } else {
              ToastAndroid.show("Phone number should not exceed 10 digits", ToastAndroid.SHORT);
            }
          }}
        withShadow
        autoFocus
        containerStyle={UserLoginScreenStyles.phoneInputContainer}
        textContainerStyle={UserLoginScreenStyles.phoneInputTextContainer}
      />
        </View>
        <View style={{paddingTop:40}}>
        <TouchableOpacity activeOpacity={0.75} onPress={SendOTPFn} style={UserLoginScreenStyles.loginBox}>
          <Text style={UserLoginScreenStyles.loginTxt}>{verificationId == "" ? "Send OTP" : "Enter OTP"}</Text>
        </TouchableOpacity>
        </View>
        </>
  ) : (
    <View style={UserLoginScreenStyles.otpBottom}>
            <TouchableOpacity activeOpacity={0.75} onPress={CloseEnterOTPFn} style={UserLoginScreenStyles.otpCloseBtn}>
              <Image source={IMAGES.CloseB} style={{width: hS(10), height: hS(10)}} resizeMode="contain" />
            </TouchableOpacity>

            {/* <Text style={UserLoginScreenStyles.otpHeadingTxt}>Enter login OTP</Text> */}

            <View>
            <View style={UserLoginScreenStyles.welcomeContainer}>
                <Text style={UserLoginScreenStyles.headingTxt}>6-digit Code</Text>
                <Text style={UserLoginScreenStyles.loginSubText}>
                  Please enter the code we’ve sent to \n <Text style={UserLoginScreenStyles.phoneCodeText}>{userPhone}</Text>
                </Text>
              </View>
              <OTPTextInput
                ref={OTPref} 
                containerStyle={{ marginHorizontal: hS(16), marginVertical: hS(16)}} 
                autoFocus={true}
                // handleCellTextChange={e => console.log("first",e)}
                handleTextChange={e => setVerificationCode(e)}
                // inputCellLength={100}
                inputCount={6}
                offTintColor={COLORS.LIGHTGREY}
                tintColor={COLORS.PRIMARY}
                textInputStyle={{backgroundColor: COLORS.LIGHTGREY, width: 48, height: 48, margin:0, borderRadius: 8, borderBottomWidth: 4}}
              />
            </View>

            <Text style={UserLoginScreenStyles.otpResendTxt}>Resend OTP? 
            
            <Text style={{fontFamily: PoppinsSemiBold, textDecorationLine: "underline", fontWeight:"300"}} onPress={seconds === 0 ? SendOTPFn : null}>
           
            {seconds ? formatTime(seconds) : "Resend"}
         
            </Text>
            
            </Text>
          
            <TouchableOpacity activeOpacity={0.75} onPress={LoginFn} style={UserLoginScreenStyles.loginBox}>
              <Text style={UserLoginScreenStyles.loginTxt}>Login</Text>
            </TouchableOpacity>
          </View>
  )
}
        

        <View style={UserLoginScreenStyles.divider}>
            <Text>OR</Text>
          </View>
        <Text style={UserLoginScreenStyles.bottomaskTxt1}>Don't have an account?{' '}<Text onPress={signupFn} style={UserLoginScreenStyles.bottomaskTxt2}>Sign up</Text></Text>
        </View>
      </SafeAreaView>

      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={enterOTP}
        onRequestClose={CloseEnterOTPFn}
      >
        <SafeAreaView style={UserLoginScreenStyles.otpContainer}>
          <View style={UserLoginScreenStyles.otpBottom}>
            <TouchableOpacity activeOpacity={0.75} onPress={CloseEnterOTPFn} style={UserLoginScreenStyles.otpCloseBtn}>
              <Image source={IMAGES.CloseB} style={{width: hS(10), height: hS(10)}} resizeMode="contain" />
            </TouchableOpacity>

            <Text style={UserLoginScreenStyles.otpHeadingTxt}>Enter login OTP</Text>

            <View>
              <OTPTextInput
                ref={OTPref} 
                containerStyle={{ marginHorizontal: hS(16), marginVertical: hS(16)}} 
                autoFocus={true}
                // handleCellTextChange={e => console.log("first",e)}
                handleTextChange={e => setVerificationCode(e)}
                // inputCellLength={100}
                inputCount={6}
                offTintColor={COLORS.LIGHTGREY}
                tintColor={COLORS.PRIMARY}
                textInputStyle={{backgroundColor: COLORS.LIGHTGREY, width: 48, height: 48, margin:0, borderRadius: 8, borderBottomWidth: 4}}
              />
            </View>

            <Text style={UserLoginScreenStyles.otpResendTxt}>Resend OTP? <Text style={{fontFamily: PoppinsSemiBold, textDecorationLine: "underline"}}>{seconds ? formatTime(seconds) : "Resend"}</Text></Text>
          
            <TouchableOpacity activeOpacity={0.75} onPress={LoginFn} style={UserLoginScreenStyles.loginBox}>
              <Text style={UserLoginScreenStyles.loginTxt}>Login</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal> */}
      </ImageBackground>
    </View>
  );
};

export default UserLoginScreen;
