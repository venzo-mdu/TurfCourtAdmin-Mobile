import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {USERLOGIN, USERBOOTOM} from '../..';
import {COLORS} from '../../../assets/constants/global_colors';
import {
  PoppinsMedium,
  PoppinsRegular,
  PoppinsSemiBold,
} from '../../../assets/constants/global_fonts';
import {IMAGES} from '../../../assets/constants/global_images';
import {StatusBarCommon} from '../../../components';
import {signin} from '../../../function/auth';
import {hS, mS} from '../../../utils/metrics';
import {UserLoginScreenStyles} from './styles';
import {
  mobilesignup,
  signinverifyotp,
  signupformobile,
} from '../../../firebase/firebaseFunction/auth';
import OTPTextInput from 'react-native-otp-textinput';
import {FirebaseRecaptchaVerifierModal} from 'expo-firebase-recaptcha';
import {firebaseConfig} from '../../../firebase/firebase';
import PhoneInput from 'react-native-phone-number-input';
import {Dropdown} from 'react-native-element-dropdown';
import {CheckBox} from 'react-native-elements';

const UserCreateScreen = props => {
  const navigation = useNavigation();

  const recaptchaVerifier = useRef(null);

  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPwd, setUserPwd] = useState('');
  const [userRePwd, setUserRePwd] = useState('');
  const [pwdVisible, setPwdVisible] = useState(true);
  const [rePwdVisible, setRePwdVisible] = useState(true);

  const [verificationId, setVerificationID] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [enterOTP, setEnterOTP] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  // console.log("userPhone?.length", userPhone);
  const OTPref = useRef(null);

  const data = [
    {label: 'Yes', value: true},
    {label: 'No', value: false},
  ];

  const CloseEnterOTPFn = () => {
    setEnterOTP(false);
    setVerificationCode('');
  };

  const CreateFn = async () => {
    //console.log("userPhone?.length", userPhone?.length);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!isChecked) {
      ToastAndroid.show(
        'Please choose the Terms and Condition',
        ToastAndroid.SHORT,
      ); // Show error if checkbox is not checked
    } else if (userName?.length < 2) {
      ToastAndroid.show('Enter valid name', ToastAndroid.SHORT);
    } else if (!emailRegex.test(userEmail)) {
      ToastAndroid.show('Enter valid email address', ToastAndroid.SHORT);
    } else if (userPhone?.length != 13) {
      ToastAndroid.show('Enter valid phone number', ToastAndroid.SHORT);
      // } else if(userPwd?.length < 5) {
      //     ToastAndroid.show('Enter minimum 5 letters valid password', ToastAndroid.SHORT);
      // } else if(userRePwd?.length < 5) {
      //     ToastAndroid.show('Re-enter minimum 5 letters valid password', ToastAndroid.SHORT);
      // } else if(userPwd != userRePwd) {
      //     ToastAndroid.show('Password mismatched', ToastAndroid.SHORT);
    } else {
      if (verificationId != '') {
        setEnterOTP(true);
      } else {
        const data = {
          avatar: null,
          email: userEmail,
          isuseractive: true,
          phonenumber: userPhone,
          username: userName,
          owner: selectedValue,
        };
        console.log('data', data);
        console.log('recaptchaVerifier', recaptchaVerifier);
        const res = await mobilesignup(data, recaptchaVerifier.current);
        console.log('res', res);
        setVerificationID(res);
        setEnterOTP(true);
        setSeconds(30);
      }
    }
  };

  const VerifyFn = async () => {
    if (verificationCode?.length == 6) {
      const response = await signinverifyotp(verificationCode, verificationId);

      ToastAndroid.show(response?.msg, ToastAndroid.SHORT);

      if (!response.error) {
        if (response?.data?.user_id != '' && response?.data != null) {
          // const userdata = await FetchDataById('user', response.data.user_id);

          const res = response?.data;

          if (res?.owner != '') {
            setUserPhone('');
            setVerificationCode('');

            const jsonValue = JSON.stringify(res);

            await AsyncStorage.setItem('res-data', jsonValue);

            if (res?.owner == 'admin') {
              navigation.replace(USERBOOTOM);
            } else if (res?.owner == 'venzoadmin') {
              navigation.replace(USERBOOTOM);
            } else {
              // navigation.goBack();
              navigation.replace(USERBOOTOM);
            }
          }
        }
        // } else {
        //   // setVerificationCode('');
        //   OTPref.current = null;
      }
    } else {
      ToastAndroid.show('Enter valid OTP', ToastAndroid.SHORT);
    }
  };

  const [seconds, setSeconds] = useState(0);

  const clearVerificationId = () => {
    setVerificationID('');
  };

  useEffect(() => {
    if (seconds > 0) {
      const interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds === 1) {
            clearInterval(interval); // Stop the countdown when it reaches 0
            clearVerificationId(); // You can perform additional actions here when the countdown reaches 0
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
          <View style={UserLoginScreenStyles.logoContainer}>
            <Image source={IMAGES.logoImage} />
          </View>

          <View style={UserLoginScreenStyles.loginContainer}>
            <ScrollView>
              {/* <ScrollView style={UserLoginScreenStyles.scroll}> */}
              <Text
                style={[UserLoginScreenStyles.headingTxt, {paddingTop: 50}]}>
                SignUp
              </Text>
              <Text style={UserLoginScreenStyles.loginSubText}>
                SignUp to Your Account
              </Text>
              {!enterOTP ? (
                <>
                  <View style={{marginBottom: hS(8)}}>
                    <Text style={UserLoginScreenStyles.signUpViewText}>
                      User Name
                    </Text>
                    <View
                      style={[
                        UserLoginScreenStyles.phoneBox,
                        {marginBottom: hS(8)},
                      ]}>
                      <TextInput
                        value={userName}
                        onChangeText={setUserName}
                        style={[
                          UserLoginScreenStyles.phoneBoxIP,
                          {
                            flex: 1,
                            fontSize: userName ? mS(18) : mS(16),
                            fontFamily: userName
                              ? PoppinsMedium
                              : PoppinsRegular,
                          },
                        ]}
                        keyboardType={'name-phone-pad'}
                        placeholder={'Enter your name'}
                        // placeholderTextColor={COLORS.PLACEHOLDERGREY}
                      />
                    </View>
                    <Text style={UserLoginScreenStyles.signUpViewText}>
                      Email
                    </Text>
                    <View
                      style={[
                        UserLoginScreenStyles.phoneBox,
                        {marginBottom: hS(8)},
                      ]}>
                      <TextInput
                        value={userEmail}
                        onChangeText={setUserEmail}
                        style={[
                          UserLoginScreenStyles.phoneBoxIP,
                          {
                            flex: 1,
                            fontSize: userEmail ? mS(18) : mS(16),
                            fontFamily: userEmail
                              ? PoppinsMedium
                              : PoppinsRegular,
                            textTransform: 'lowercase',
                          },
                        ]}
                        keyboardType={'email-address'}
                        placeholder={'Enter your email address'}
                        //  placeholderTextColor={COLORS.PLACEHOLDERGREY}
                        autoCapitalize="none"
                      />
                    </View>
                    <Text style={UserLoginScreenStyles.signUpViewText}>
                      Mobile Number
                    </Text>
                    <View
                      style={[
                        UserLoginScreenStyles.phoneBox,
                        {flexDirection: 'row', marginBottom: hS(8)},
                      ]}>
                      {/* <TextInput
                      value={"+91"}
                      style={UserLoginScreenStyles.phoneBoxIP}
                      editable={false}
                  />

                  <TextInput
                      value={userPhone}
                      onChangeText={val => setUserPhone(val.replace(/[^0-9]/g, ''))}
                      style={[UserLoginScreenStyles.phoneBoxIP, {flex: 1,fontSize: userPhone ? mS(18) : mS(16),fontFamily: userPhone ? PoppinsMedium : PoppinsRegular}]}
                      keyboardType={"numeric"}
                      placeholder={"Enter your phone number"}
                      placeholderTextColor={COLORS.PLACEHOLDERGREY}
                      maxLength={10}
                  /> */}
                      <PhoneInput
                        defaultValue={userPhone}
                        defaultCode="IN"
                        layout="first"
                        //onChangeFormattedText={(val) => setUserPhone(val)}
                        onChangeFormattedText={val => {
                          // Limit the input to 13 characters (including the country code, e.g., +91xxxxxxxxxx)
                          if (val.replace(/\D/g, '').length <= 12) {
                            setUserPhone(val);
                          } else {
                            ToastAndroid.show(
                              'Phone number should not exceed 10 digits',
                              ToastAndroid.SHORT,
                            );
                          }
                        }}
                        withShadow
                        autoFocus
                        containerStyle={
                          UserLoginScreenStyles.phoneInputContainer
                        }
                        textContainerStyle={
                          UserLoginScreenStyles.phoneInputTextContainer
                        }
                      />
                    </View>
                    <View>
                      <Text style={UserLoginScreenStyles.signUpViewText}>
                        Are You Court Owner
                      </Text>
                      <View
                        style={[
                          UserLoginScreenStyles.phoneBox,
                          {flexDirection: 'row', marginBottom: hS(8)},
                        ]}>
                        <Dropdown
                          style={UserLoginScreenStyles.dropdown}
                          data={data}
                          labelField="label"
                          valueField="value"
                          placeholder="Are You Court Owner"
                          value={selectedValue}
                          onChange={item => {
                            setSelectedValue(item.value);
                          }}
                        />
                      </View>
                      <View
                        style={[
                          UserLoginScreenStyles.CheckBoxViews,
                          {flexDirection: 'row', marginBottom: hS(10)},
                        ]}>
                        <CheckBox
                          // title="By continuing you indicate that you read and agreen to the Terms of Use"
                          checked={isChecked}
                          onPress={() => setIsChecked(!isChecked)}
                          containerStyle={{
                            paddingVertical: hS(10),
                            height: hS(60),
                            width: 20,
                          }}
                          //   textStyle={UserLoginScreenStyles.CheckboxText}
                        />
                        <Text style={UserLoginScreenStyles.CheckboxText}>
                          By continuing you indicate that you read and agreen to
                          the Terms of Use
                        </Text>
                      </View>
                    </View>

                    {/* <View style={[UserLoginScreenStyles.phoneBox, {flexDirection: "row", marginBottom: hS(8)}]}>
                  <TextInput
                      value={userPwd}
                      onChangeText={setUserPwd}
                      style={[UserLoginScreenStyles.phoneBoxIP, {flex: 1,fontSize: userPwd ? mS(18) : mS(16),fontFamily: userPwd ? PoppinsMedium : PoppinsRegular, textTransform: "none"}]}
                      keyboardType={"name-phone-pad"}
                      placeholder={"Enter your password"}
                      placeholderTextColor={COLORS.PLACEHOLDERGREY}
                      secureTextEntry={pwdVisible ? true: false}
                      maxLength={15}
                      autoCapitalize="none"
                  />

                  <TouchableOpacity activeOpacity={0.75} onPress={() => {setPwdVisible(!pwdVisible)}} style={UserLoginScreenStyles.pwdBox}>
                      <Image source={pwdVisible? IMAGES.HidePwd : IMAGES.ShowPwd} style={{width: mS(24), height: mS(24)}} />
                  </TouchableOpacity>
              </View>

              <View style={[UserLoginScreenStyles.phoneBox, {flexDirection: "row", marginBottom: hS(8)}]}>
                  <TextInput
                      value={userRePwd}
                      onChangeText={setUserRePwd}
                      style={[UserLoginScreenStyles.phoneBoxIP, {flex: 1,fontSize: userRePwd ? mS(18) : mS(16),fontFamily: userRePwd ? PoppinsMedium : PoppinsRegular, textTransform: "none"}]}
                      keyboardType={"name-phone-pad"}
                      placeholder={"Re-enter your password"}
                      placeholderTextColor={COLORS.PLACEHOLDERGREY}
                      secureTextEntry={rePwdVisible ? true: false}
                      maxLength={15}
                      autoCapitalize="none"
                  />

                  <TouchableOpacity activeOpacity={0.75} onPress={() => {setRePwdVisible(!rePwdVisible)}} style={UserLoginScreenStyles.pwdBox}>
                      <Image source={rePwdVisible? IMAGES.HidePwd : IMAGES.ShowPwd} style={{width: mS(24), height: mS(24)}} />
                  </TouchableOpacity>
              </View> */}
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={CreateFn}
                    style={UserLoginScreenStyles.loginBox}>
                    <Text style={UserLoginScreenStyles.loginTxt}>Sign up</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={UserLoginScreenStyles.otpBottom}>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={CloseEnterOTPFn}
                    style={UserLoginScreenStyles.otpCloseBtn}>
                    <Image
                      source={IMAGES.CloseB}
                      style={{width: hS(10), height: hS(10)}}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>

                  {/* <Text style={UserLoginScreenStyles.otpHeadingTxt}>Verify signup OTP</Text> */}

                  <View>
                    <View style={UserLoginScreenStyles.welcomeContainer}>
                      <Text style={UserLoginScreenStyles.headingTxt}>
                        6-digit Code
                      </Text>
                      <Text style={UserLoginScreenStyles.loginSubText}>
                        Please enter the code we’ve sent to \n{' '}
                        <Text style={UserLoginScreenStyles.phoneCodeText}>
                          {userPhone}
                        </Text>
                      </Text>
                    </View>
                    <OTPTextInput
                      ref={OTPref}
                      containerStyle={{
                        marginHorizontal: hS(16),
                        marginVertical: hS(16),
                      }}
                      autoFocus={true}
                      // handleCellTextChange={e => console.log("first",e)}
                      handleTextChange={e => setVerificationCode(e)}
                      // inputCellLength={100}
                      inputCount={6}
                      offTintColor={COLORS.LIGHTGREY}
                      tintColor={COLORS.PRIMARY}
                      textInputStyle={{
                        backgroundColor: COLORS.LIGHTGREY,
                        width: 48,
                        height: 48,
                        margin: 0,
                        borderRadius: 8,
                        borderBottomWidth: 4,
                      }}
                    />
                  </View>

                  {/* <Text style={UserLoginScreenStyles.otpResendTxt}>Resend OTP? <Text style={{ fontFamily: PoppinsSemiBold, textDecorationLine: "underline" }}>{seconds ? formatTime(seconds) : "Resend"}</Text></Text> */}
                  <Text style={UserLoginScreenStyles.otpResendTxt}>
                    Resend OTP?
                    <Text
                      style={{
                        fontFamily: PoppinsSemiBold,
                        textDecorationLine: 'underline',
                        fontWeight: '300',
                      }}
                      onPress={seconds === 0 ? CreateFn : null}>
                      {seconds ? formatTime(seconds) : 'Resend'}
                    </Text>
                  </Text>
                  <TouchableOpacity
                    activeOpacity={0.75}
                    onPress={VerifyFn}
                    style={UserLoginScreenStyles.loginBox}>
                    <Text style={UserLoginScreenStyles.loginTxt}>Verify</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={UserLoginScreenStyles.divider}>
                <Text>OR</Text>
              </View>
              <Text
                style={[
                  UserLoginScreenStyles.bottomaskTxt1,
                  {paddingBottom: 30},
                ]}>
                Don't have an account?{' '}
                <Text
                  onPress={() => navigation.navigate(USERLOGIN)}
                  style={UserLoginScreenStyles.bottomaskTxt2}>
                  login
                </Text>
              </Text>
              {/* </ScrollView> */}
            </ScrollView>
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

            <Text style={UserLoginScreenStyles.otpHeadingTxt}>Verify signup OTP</Text>

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
          
            <TouchableOpacity activeOpacity={0.75} onPress={VerifyFn} style={UserLoginScreenStyles.loginBox}>
              <Text style={UserLoginScreenStyles.loginTxt}>Verify</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal> */}
      </ImageBackground>
    </View>
  );
};

export default UserCreateScreen;
