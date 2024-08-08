import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import CommonTextInput from '../../../components/molecules/CommonTextInput';
import CommonTextArea from '../../../components/molecules/CommonTextArea';
import Icon from 'react-native-vector-icons/FontAwesome';
import { launchImageLibrary } from 'react-native-image-picker';
// import storage from '@react-native-firebase/storage';
import { storage } from '../../../firebase/firebase';
import { uploadFile } from '../../../firebase/firebaseFunction/groundDetails';
import { USERLOGIN } from '../..';
import { UpdateUserData, userData } from '../../../firebase/firebaseFunction/userDetails';
import { Dropdown } from 'react-native-element-dropdown';
import PhoneInput from 'react-native-phone-number-input';
import { Dimensions } from 'react-native';
const { WD, mS, hS } = require("../../../utils/metrics");
const { COLORS } = require("../../../assets/constants/global_colors");

const ProfileView = () => {
    const route = useRoute();
    const { uid } = route.params;
    const [details, setDetails] = useState();
    const [tempdetails, setTempDetails] = useState({});
    const [valData, setvalData] = useState(true);
    const [userDetail, setuserDetail] = useState({});
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [formattedPhoneNumber, setFormattedPhoneNumber] = useState('');
    const [open, setOpen] = useState(false);
    const [phoneError, setPhoneError] = useState('');

    async function profileDetail() {
        const userProfile = await userData(uid);
        // setDetails(userProfile);
        // setTempDetails(userProfile);
        const strippedPhoneNumber = userProfile.phonenumber.replace(/^\+91/, '');
        setDetails({
            ...userProfile,
            phonenumber: strippedPhoneNumber,
        });
        setTempDetails({
            ...userProfile,
            phonenumber: strippedPhoneNumber,
        });
    }

    useEffect(() => {
        profileDetail();
    }, []);

    const handleChange = (key, value) => {
        setDetails({
            ...details,
            [key]: value,
        });
    };

    const handleFormattedPhoneNumberChange = (text) => {
      const strippedPhoneNumber = text.replace(/^\+91/, '');
      // setFormattedPhoneNumber(strippedPhoneNumber);
      // handleChange('phonenumber', strippedPhoneNumber);
      if (strippedPhoneNumber.length > 10) {
        setPhoneError('Phone number cannot exceed 10 digits');
    } else {
        setPhoneError(''); // Clear error message if valid
        setFormattedPhoneNumber(strippedPhoneNumber);
        handleChange('phonenumber', strippedPhoneNumber);
    }
  };

    const handleSave = async () => {
        if (uid == null) {
            navigation.navigate(USERLOGIN);
            return;
        }
        setLoader(true); // Show the loader
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
        if (details?.profileimg != "") {
            tempval.profileimg = true;
        }
        if (details?.username != "") {
            tempval.username = true;
        }
        if (details?.email != "") {
            tempval.email = true;
        }
        if (details?.phonenumber != "") {
            tempval.phonenumber = true;
        }
        if (details?.info != "") {
            tempval.info = true;
        }
        if (details?.address != "") {
            tempval.address = true;
        }
        if (details?.state != "") {
            tempval.state = true;
        }
        if (details?.city != "") {
            tempval.city = true;
        }
        if (details?.country != "") {
            tempval.country = true;
        }
        if (details?.zipcode != "") {
            tempval.zipcode = true;
        }
        setvalData(Object.values(tempval).every(Boolean));
        if (Object.values(tempval).every(Boolean)) {
          let updateValues = {
            ...details,
            phonenumber: details.phonenumber.startsWith('+91') ? details.phonenumber : `+91${details.phonenumber}`,
        };
            let update;
            update = await UpdateUserData(updateValues, uid);
            //console.log("update", update)
            if (update.status == "success") {
                setuserDetail(update.data);
                ToastAndroid.show('Profile updated successfully!', ToastAndroid.SHORT);
            } else {
                console.log("check ");
            }
            profileDetail();
        }
        setLoader(false); // Hide the loader
    }

    

    const handleImagePick = async () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const fileType = response.assets[0].type;
                if (fileType !== 'image/svg+xml') {
                    const fileUri = response.assets[0].uri;
                    //console.log("fileUri",fileUri)
                    const fileName = "Profile_IMG_" + new Date().getTime();
                    // const profileImgUrl = await uploadFile(uid, fileName, fileUri, 'profileImages');
                    // console.log("profileImgUrl1213", profileImgUrl)
                    const profileImgUrl = await uploadFile(uid, fileName, fileUri, 'profileImages');
                    //console.log("profileImgUrl", profileImgUrl)
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

    const handleDeactivate = () => {
      setDetails({
        ...details,
        isuseractive: false,
      });
      setOpen(false);
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {/* <Text>ProfileView</Text> */}
                {loader && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
                {details && (
                    <>
                        <View style={styles.profileContainer}>
                            <Image
                                source={{ uri: details.profileimg }}
                                style={styles.profileImage}
                            />
                            <View>
                                <TouchableOpacity style={styles.cameraIcon} onPress={handleImagePick}>
                                    <Icon name="camera" size={15} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                            {/* <Text style={styles.nameText}>{details.username}</Text>
                            <Text style={styles.phoneText}>{details.phonenumber}</Text> */}
                        </View>
                        <CommonTextInput
                            label="Name"
                            value={details.username}
                            onChangeText={(text) => handleChange('username', text)}
                        />
                        <CommonTextInput
                            label="Email"
                            value={details.email}
                            onChangeText={(text) => handleChange('email', text)}
                        />
                        {/* <CommonTextInput
                            label="Mobile Number"
                            value={details.phonenumber}
                            onChangeText={(text) => handleChange('phonenumber', text)}
                        /> */}
                        <View>
                        <Text style={styles.signUpViewText}>Mobile Number</Text>
                      <View style={[styles.phoneBox, { flexDirection: "row", marginBottom: hS(8) }]}>
                        <PhoneInput
                          defaultValue={details.phonenumber}
                          defaultCode="IN"
                          layout="first"
                          onChangeFormattedText={(text) => handleFormattedPhoneNumberChange(text)}
                          withShadow
                          autoFocus
                          containerStyle={styles.phoneInputContainer}
                          textContainerStyle={styles.phoneInputTextContainer}
                        />
                      </View>
                      {phoneError ? (
                                <Text style={styles.errorText}>{phoneError}</Text>
                            ) : null}
                      </View>
                        <CommonTextArea
                            label="Information About You"
                            value={details.info}
                            onChangeText={(text) => handleChange('info', text)}
                            placeholder="Information About You"
                            placeholderTextColor="#666"
                            numberOfLines={4}
                        />
                        <CommonTextArea
                            label="Address"
                            value={details.address}
                            onChangeText={(text) => handleChange('address', text)}
                            placeholder="Address"
                            placeholderTextColor="#666"
                            numberOfLines={4}
                        />
                        <CommonTextInput
                            label="State"
                            value={details.state}
                            onChangeText={(text) => handleChange('state', text)}
                        />
                        <CommonTextInput
                            label="City"
                            value={details.city}
                            onChangeText={(text) => handleChange('city', text)}
                        />
                        <CommonTextInput
                            label="Country"
                            value={details.country}
                            onChangeText={(text) => handleChange('country', text)}
                        />
                        <CommonTextInput
                            label="Zip Code"
                            value={details.zipcode}
                            onChangeText={(text) => handleChange('zipcode', text)}
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
              onPress={handleSave}
            >
              <Text style={styles.buttonTextCartData}>Save Changes</Text>
            </TouchableOpacity>
          </View>
                        {/* <TouchableOpacity onPress={handleSave}>
                            <Text style={styles.saveButton}>Save Changes</Text>
                        </TouchableOpacity> */}
                        <View style={{paddingTop:20, paddingBottom:20,width:'100%'}}>
                        <TouchableOpacity
        style={styles.deactivateButtonDeactivateButton}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.buttonTextDeactivateButton}>Deactivate Account</Text>
      </TouchableOpacity>
      </View>
                    </>
                )}

                <Modal
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <View style={styles.modalOverlayDeactivate}>
          <View style={styles.modalContentDeactivate}>
            <View style={styles.modalHeaderDeactivate}>
              <Text style={styles.modalTitleDeactivate}>Are you sure you want to deactivate?</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Text style={styles.closeButtonDeactivate}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalFooterDeactivate}>
              <TouchableOpacity style={styles.yesButtonDeactivate} onPress={handleDeactivate}>
                <Text style={styles.buttonTextDeactivate}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.noButtonDeactivate} onPress={() => setOpen(false)}>
                <Text style={styles.buttonTextDeactivate}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        backgroundColor: '#108257',
        borderRadius: 15,
        padding: 5,
        elevation: 3, // To add shadow on Android
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 }, // For iOS shadow
        shadowOpacity: 0.8, // For iOS shadow
        shadowRadius: 2, // For iOS shadow
        borderColor: '#ffffff',
        borderWidth: 3,
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
    signUpViewText:{
      fontSize:16,
     // fontWeight:"500",
      //paddingLeft:20,
  //    paddingVertical:5,
      color: '#333',
      marginHorizontal: hS(16),
      marginBottom:5
  },
    phoneBox: {
      backgroundColor: COLORS.WHITE,
     // width: WD - (hS(16) * 2),
     width: Dimensions.get('window').width * 0.9,
      //height: mS(60),
      alignSelf: "center",
      paddingHorizontal: hS(8),
      marginHorizontal: hS(16),
      borderWidth: 1,
      //borderColor: COLORS.DARK,
      borderColor:'#ccc',
      // borderRadius: mS(8),
      borderRadius:5
    },
    phoneInputContainer: {
    // width: '100%',
     height: 50,
   //  marginBottom: 12,
  },
  phoneInputTextContainer: {
    paddingVertical: 0,
  },
  buttonTextCartData: {
    color: '#FFFFFF',
    fontSize: 14,
    marginVertical:8,
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
    marginVertical:8,
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 9999,
},
errorText: {
  color: 'red',
  marginTop: 5,
  marginHorizontal: hS(16),
},
});

export default ProfileView;
