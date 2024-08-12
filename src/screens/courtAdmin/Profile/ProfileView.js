import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import CommonTextInput from '../../../components/molecules/CommonTextInput';
import CommonTextArea from '../../../components/molecules/CommonTextArea';
import Icon from 'react-native-vector-icons/FontAwesome';
import {launchImageLibrary} from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';
import {uploadFile} from '../../../firebase/firebaseFunction/groundDetails';
import {USERLOGIN} from '../..';
import {
  UpdateUserData,
  userData,
} from '../../../firebase/firebaseFunction/userDetails';
import PhoneInput from 'react-native-phone-number-input';
import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {hS} = require('../../../utils/metrics');
const {COLORS} = require('../../../assets/constants/global_colors');

const ProfileView = () => {
  const route = useRoute();
  // const {uid} = route.params;
  const [uid, setUid] = useState('');
  const [details, setDetails] = useState();
  const [tempdetails, setTempDetails] = useState({});
  const [valData, setvalData] = useState(true);
  const [userDetail, setuserDetail] = useState({});
  const navigation = useNavigation();
  const [loader, setLoader] = useState(false);
  const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const value = await AsyncStorage.getItem('uid');
        if (value) {
          setUid(JSON.parse(value));
        }
      } catch (error) {
        console.error('Error retrieving user data', error);
      }
    };

    getUserData();
  }, []);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      try {
        setLoader(true);
        if (uid) {
          const userProfile = await userData(uid);
          console.log('Profile:', userProfile);
          const strippedPhoneNumber = userProfile.phonenumber.replace(
            /^\+91/,
            '',
          );
          setDetails({
            ...userProfile,
            phonenumber: strippedPhoneNumber,
          });
          setTempDetails({
            ...userProfile,
            phonenumber: strippedPhoneNumber,
          });
        }
      } catch (error) {
        console.error('Error fetching profile details:', error);
      } finally {
        setLoader(false); // Stop loader when data fetch is done
      }
    };

    fetchProfileDetails();
  }, [uid]);

  const handleChange = (key, value) => {
    setDetails({
      ...details,
      [key]: value,
    });
  };

  const handleFormattedPhoneNumberChange = text => {
    const strippedPhoneNumber = text.replace(/^\+91/, '');
    if (strippedPhoneNumber.length > 10) {
      setPhoneError('Phone number cannot exceed 10 digits');
    } else {
      setPhoneError('');
      setFormattedPhoneNumber(strippedPhoneNumber);
      handleChange('phonenumber', strippedPhoneNumber);
    }
  };

  const handleSave = async () => {
    if (uid == null) {
      navigation.navigate(USERLOGIN);
      return;
    }
    setLoader(true);
    let tempval = {
      username: false,
      email: false,
      phonenumber: false,
      info: false,
      address: false,
      state: false,
      city: false,
      country: false,
      zipcode: false,
      owner: true,
    };
    if (details?.profileimg != '') {
      tempval.profileimg = true;
    }
    if (details?.username != '') {
      tempval.username = true;
    }
    if (details?.email != '') {
      tempval.email = true;
    }
    if (details?.phonenumber != '') {
      tempval.phonenumber = true;
    }
    if (details?.info != '') {
      tempval.info = true;
    }
    if (details?.address != '') {
      tempval.address = true;
    }
    if (details?.state != '') {
      tempval.state = true;
    }
    if (details?.city != '') {
      tempval.city = true;
    }
    if (details?.country != '') {
      tempval.country = true;
    }
    if (details?.zipcode != '') {
      tempval.zipcode = true;
    }
    setvalData(Object.values(tempval).every(Boolean));
    if (Object.values(tempval).every(Boolean)) {
      let updateValues = {
        ...details,
        phonenumber: details.phonenumber.startsWith('+91')
          ? details.phonenumber
          : `+91${details.phonenumber}`,
      };
      let update;
      update = await UpdateUserData(updateValues, uid);
      if (update.status == 'success') {
        setuserDetail(update.data);
        ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
      } else {
        console.log('check ');
      }
      profileDetail();
    }
    setLoader(false); // Hide the loader
  };

  const handleImagePick = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const fileType = response.assets[0].type;
        if (fileType !== 'image/svg+xml') {
          const fileUri = response.assets[0].uri;
          const fileName = 'Profile_IMG_' + new Date().getTime();
          const profileImgUrl = await uploadFile(
            uid,
            fileName,
            fileUri,
            'profileImages',
          );
          setDetails({
            ...details,
            profileimg: profileImgUrl,
          });
        } else {
          alert('SVG files are not allowed.');
        }
      }
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {loader ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator
              size={50}
              color={COLORS.PrimaryColor}
              animating={loader}
            />
            <Text>Loading...</Text>
          </View>
        ) : null}
        {details ? (
          <>
            <View style={styles.profileContainer}>
              <Image
                source={{uri: details.profileimg}}
                style={styles.profileImage}
              />
              <View>
                <TouchableOpacity
                  style={styles.cameraIcon}
                  onPress={handleImagePick}>
                  <Icon name="camera" size={15} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
            <CommonTextInput
              label="Name"
              value={details.username}
              onChangeText={text => handleChange('username', text)}
            />
            <CommonTextInput
              label="Email"
              value={details.email}
              onChangeText={text => handleChange('email', text)}
            />
            <View>
              <Text style={styles.signUpViewText}>Mobile Number</Text>
              <View
                style={[
                  styles.phoneBox,
                  {flexDirection: 'row', marginBottom: 20},
                ]}>
                <PhoneInput
                  defaultValue={details.phonenumber}
                  defaultCode="IN"
                  layout="first"
                  onChangeFormattedText={text =>
                    handleFormattedPhoneNumberChange(text)
                  }
                  containerStyle={styles.phoneInputContainer}
                  textContainerStyle={styles.phoneInputTextContainer}
                  textInputStyle={{
                    fontSize: 18,
                    paddingBottom: 8,
                    color: COLORS.BLACK,
                    fontFamily: 'Outfit-Regular',
                  }}
                />
              </View>
              {phoneError ? (
                <Text style={styles.errorText}>{phoneError}</Text>
              ) : null}
            </View>
            <CommonTextArea
              label="Information About You"
              value={details.info}
              onChangeText={text => handleChange('info', text)}
              placeholder="Information About You"
              placeholderTextColor="#666"
              numberOfLines={4}
            />
            <CommonTextArea
              label="Address"
              value={details.address}
              onChangeText={text => handleChange('address', text)}
              placeholder="Address"
              placeholderTextColor="#666"
              numberOfLines={4}
            />
            <CommonTextInput
              label="State"
              value={details.state}
              onChangeText={text => handleChange('state', text)}
            />
            <CommonTextInput
              label="City"
              value={details.city}
              onChangeText={text => handleChange('city', text)}
            />
            <CommonTextInput
              label="Country"
              value={details.country}
              onChangeText={text => handleChange('country', text)}
            />
            <CommonTextInput
              label="Zip Code"
              value={details.zipcode}
              onChangeText={text => handleChange('zipcode', text)}
            />
            <View style={styles.footerButtonsCartData}>
              {/* <TouchableOpacity
              style={styles.resetButtonCartData}
              onPress={() => setDetails(tempdetails)}
            >
              <Text style={styles.buttonTextCartData}>Reset</Text>
            </TouchableOpacity> */}
              <TouchableOpacity
                style={styles.paymentButtonCartData}
                onPress={handleSave}>
                <Text style={styles.buttonTextCartData}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 25,
    left: 20,
    backgroundColor: COLORS.PrimaryColor,
    borderRadius: 30,
    padding: 7,
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  phoneText: {
    fontSize: 16,
    color: '#555',
  },

  /* Phone Input */
  signUpViewText: {
    fontSize: 16,
    color: '#1B1B1B',
    fontFamily: 'Outfit-Regular',
    lineHeight: 20.16,
    marginBottom: 8,
  },
  phoneBox: {
    backgroundColor: COLORS.fieldColor,
    width: Dimensions.get('window').width * 0.9,
    alignSelf: 'center',
  },
  phoneInputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: COLORS.fieldBorderColor,
    borderRadius: 8,
  },
  phoneInputTextContainer: {
    backgroundColor: '#fff',
    fontFamily: 'Outfit-Medium',
    paddingVertical: 0,
    borderRadius: 8,
  },
  buttonTextCartData: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical: 8,
  },
  footerButtonsCartData: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  resetButtonCartData: {
    backgroundColor: '#097E52',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '38%',
    alignItems: 'center',
  },
  paymentButtonCartData: {
    backgroundColor: '#192335',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: '100%',
    alignItems: 'center',
  },
  deactivateButtonDeactivateButton: {
    backgroundColor: '#E50000',
    padding: 10,
    borderRadius: 8,
  },
  buttonTextDeactivateButton: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 8,
  },

  /* Modal View Of Deactivate Account */
  deactivateButtonDeactivate: {
    backgroundColor: '#E50000',
    padding: 10,
    borderRadius: 8,
  },
  buttonTextDeactivate: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlayDeactivate: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContentDeactivate: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
    width: Dimensions.get('window').width * 0.8,
  },
  modalHeaderDeactivate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitleDeactivate: {
    color: '#192335',
    fontSize: 18,
    fontWeight: '500',
  },
  closeButtonDeactivate: {
    color: 'red',
    fontSize: 18,
  },
  modalFooterDeactivate: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  yesButtonDeactivate: {
    backgroundColor: '#E50000',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  noButtonDeactivate: {
    backgroundColor: '#097E52',
    padding: 10,
    //  borderRadius: 8,
    borderRadius: 8,
  },

  /* Load Container*/
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  // loaderContainer: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  //   zIndex: 9999,
  // },
  errorText: {
    color: 'red',
    marginTop: 5,
    marginHorizontal: hS(16),
  },
});

export default ProfileView;
