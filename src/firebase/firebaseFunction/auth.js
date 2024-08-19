import {
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from 'firebase/auth';
// import { auth, database } from "../firebase";
import {
  InsertDataWithUID,
  InsertData,
  FetchData,
  FetchDataById,
  UpdateData,
} from './crud';
import DeviceInfo from 'react-native-device-info';
import {auth} from '../firebase';

export const signup = async userData => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(
      userData.phonenumber,
    );

    if (!isAvailable) {
      let phonenumber = '+91' + userData.phonenumber;
      const recaptchaverifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {},
      );
      recaptchaverifier.render();
      const data = await signInWithPhoneNumber(
        auth,
        phonenumber,
        recaptchaverifier,
      );
      userData.isuseractive = true;
      return {data: data, userdata: userData};
    } else {
      return {
        data: null,
        error: 'Phone number is Already registered.',
        msg: 'Phone number is Already registered.',
      };
    }
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect Login Credentials'};
  }
};

export const verifyOtp = async (otp, response) => {
  let valueOTP = otp;

  if (valueOTP === '' || valueOTP === null) {
    return null;
  }
  try {
    const data = await response.data.confirm(valueOTP);
    const user = auth.currentUser;
    const uid = user.uid;
    const userdata = await InsertDataWithUID('user', response?.userdata, uid);
    return {data: userdata, null: null, msg: 'user signup successfully'};
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect OTP'};
  }
};

const checkPhoneNumberAvailability = async phoneNumber => {
  try {
    const usersRef = await FetchData('user');
    const checkAvilable = usersRef.filter(user => {
      return user.phonenumber == phoneNumber;
    });
    const userAvilable = checkAvilable.length == 0 ? false : true;
    return userAvilable;
  } catch (error) {
    // alert('Error checking phone number availability:', error);
    return false; // Return false in case of an error
  }
};

export const login = async (phoneNumber, recaptchaVerifierComp) => {
  try {
    let phonenumber = '+91' + phoneNumber;
    const isAvailable = await checkPhoneNumberAvailability(phoneNumber);
    //recaptchaverifier.render();
    if (isAvailable) {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifierComp.current,
      ); // get the verification id

      // const recaptchaverifier = new RecaptchaVerifier(
      //   auth,
      //   'recaptcha-container',
      //   {},
      // );
      // recaptchaverifier.render();
      // const response = await signInWithPhoneNumber(
      //   auth,
      //   phonenumber,
      //   recaptchaverifier,
      // );
      // return response
      return {verificationId: verificationId, error: null, msg: ''};
    } else {
      return {
        data: null,
        error: 'Phone number is Not registered.',
        msg: 'Phone number is Not registered.',
      };
    }
  } catch (error) {
    return error;
  }
};

export const loginverifyOtp = async (otp, verificationId) => {
  if (valueOTP === '' || valueOTP === null) {
    return null;
  }
  let valueOTP = otp;

  try {
    const credential = PhoneAuthProvider.credential(verificationId, otp); // get the credential
    const response = await signInWithCredential(auth, credential); // verify the credential
    const user = auth.currentUser;
    let uid = user.uid;
    const userData = await FetchDataById('user', uid);
    return {data: userData, error: null, msg: 'User logged in successfully'};

    //   const data = await response.data.confirm(valueOTP);
    //   const user = auth.currentUser;
    //   let uid = user.uid;
    //   const userData = await FetchDataById('user', uid);
    //   return {userData, error: null, msg: 'User logged in successfully'};
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect Login Credentials'};
  }
};

export const adminConfig = async allowadmin => {
  let result = await FetchData('config', 'venzoAdminId');
  try {
    if (result.length) {
      const data = await UpdateData(
        'config',
        {allowadmin: allowadmin},
        'venzoAdminId',
      );
      return data;
    }
  } catch (error) {
    return error;
  }
};

export const getadminconfig = async () => {
  let result = await FetchData('config', 'venzoAdminId');
  return result.length ? result[0] : null;
};

export const signupformobile = async userData => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(
      userData.phonenumber,
    );

    if (!isAvailable) {
      let phoneNumber = '+91' + userData?.phonenumber;

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, true);
      return {data: confirmation, userdata: userData};
    } else {
      return {
        data: null,
        error: 'Phone number is Already registered.',
        msg: 'Phone number is Already registered.',
      };
    }
  } catch (error) {
    console.error(error);
    return {data: null, error: error, msg: 'Incorrect Login Credentials'};
  }
};

export const verfiyotpmobile = async (otp, response) => {
  try {
    await response.data.confirm(otp);
    const user = auth.currentUser;
    const uid = user.uid;
    const userdata = await InsertDataWithUID('user', response?.userdata, uid);
    return {data: userdata, null: null, msg: 'user signup successfully'};
  } catch (error) {
    return {data: null, error: error, msg: 'Incorrect OTP'};
  }
};

const getDeviceInformation = async () => {
  const deviceId = await DeviceInfo.getUniqueId();
  const deviceModel = DeviceInfo.getModel();
  // Add more device information as needed

  return deviceId;
};

export const loginmobile = async (phoneNumber, recaptchaVerifierComp) => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(phoneNumber);

    if (isAvailable) {
      let phoneNumber1 = phoneNumber;
      console.log('phoneNumber1', phoneNumber1);
      const phoneProvider = new PhoneAuthProvider(auth);
      console.log('phoneNumber1', phoneNumber1);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber1,
        recaptchaVerifierComp.current,
      ); // get the verification id

      // const recaptchaverifier = new RecaptchaVerifier(
      //   auth,
      //   'recaptcha-container',
      //   {},
      // );
      // recaptchaverifier.render();
      // const response = await signInWithPhoneNumber(
      //   auth,
      //   phonenumber,
      //   recaptchaverifier,
      // );
      // return response
      return {verificationId: verificationId, error: null, msg: ''};
      // getDeviceInformation();

      // // const recaptchaverifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      // //   size: "invisible"
      // // });
      // // // recaptchaverifier.render();

      // const confirmation = await signInWithPhoneNumber(
      //   auth,
      //   phoneNumber1,
      //   getDeviceInformation(),
      // );

      // return { data: confirmation, error: null, msg: '' };
    } else {
      return {
        data: null,
        error: 'Phone number is Not registered.',
        msg: 'Phone number is Not registered.',
      };
    }
  } catch (error) {
    return error;
  }
};

export const loginmobile1 = async phoneNumber => {
  // try {
  //   const isAvailable = await checkPhoneNumberAvailability(phoneNumber);
  //   if (isAvailable) {
  //     let phoneNumber = '+91' + phoneNumber
  //     const confirmation = await signInWithPhoneNumber(
  //       auth,
  //       phoneNumber,
  //       true
  //     );
  //     return { data: confirmation, error: null, msg: '' };
  //   } else {
  //     return { data: null, error: 'Phone number is Not registered.', msg: 'Phone number is Not registered.' };
  //   }
  // } catch (error) {
  //   return error
  // }
};

// export const loginmobile = async (phoneNumber) => {

//   try {
//     const isAvailable = await checkPhoneNumberAvailability(phoneNumber);

//     const recaptchaverifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
//       size: "invisible"
//     });

//     // if (isAvailable) {
//     //   let phoneNumber = '+91' + phoneNumber

//     //   const confirmation = await signInWithPhoneNumber(
//     //     auth,
//     //     phoneNumber,
//     //     true
//     //   );
//     //   return { data: confirmation, error: null, msg: '' };
//     // } else {
//     //   return { data: null, error: 'Phone number is Not registered.', msg: 'Phone number is Not registered.' };
//     // }

//   } catch (error) {

//     return error
//   }
// };

export const loginverifyOtpmobile = async (otp, response) => {
  let valueOTP = otp;

  if (valueOTP === '' || valueOTP === null) {
    return null;
  }

  try {
    await response.data.confirm(otp);
    const user = auth.currentUser;
    const uid = user.uid;
    const userData = await FetchDataById('user', uid);
    return {userData, error: null, msg: 'User logged in successfully'};
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect Login Credentials'};
  }
};

export const loginMobile11 = async (phoneNumber, recaptchaVerifier) => {
  try {
    let phonenumber = '+91' + phoneNumber;
    const isAvailable = await checkPhoneNumberAvailability(phoneNumber);
    if (isAvailable) {
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonenumber,
        recaptchaVerifier,
      );
      return {data: verificationId, error: null, msg: ''};
    } else {
      return {
        data: null,
        error: 'Phone number is Not registered.',
        msg: 'Phone number is Not registered.',
      };
    }
  } catch (error) {
    return error;
  }
};

export const verifyOtpmobile11 = async (verificationCode, verificationId) => {
  try {
    const credential = PhoneAuthProvider.credential(
      verificationId,
      verificationCode,
    );

    const data = await signInWithCredential(auth, credential);

    return {data, error: null, msg: 'User logged in successfully'};
  } catch (error) {
    return {data: null, error: error, msg: 'Incorrect Login Credentials'};
  }
};

export const mobilesignup = async (userData, recaptchaVerifier) => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(
      userData.phonenumber,
    );

    if (!isAvailable) {
      // let phonenumber1 = '+91' + userData.phonenumber
      let phonenumber1 = userData.phonenumber;
      console.log('phonenumber1', phonenumber1);
      const phoneProvider = new PhoneAuthProvider(auth);
      console.log('phoneProvider', phoneProvider);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonenumber1,
        recaptchaVerifier,
      );
      console.log('verificationId', verificationId);
      // const verificationId = await phoneProvider.providerId(phonenumber1)

      return {data: verificationId, userdata: userData, error: null, msg: ''};
    } else {
      return {
        data: null,
        error: 'Phone number is Already registered.',
        msg: 'Phone number is Already registered.',
      };
    }
  } catch (error) {
    return error;
  }
};

export const signinverifyotp = async (verificationCode, response) => {
  if (verificationCode === '' || verificationCode === null) {
    return {data: null, error: ' Please type your OTP'};
  }

  try {
    const credential = PhoneAuthProvider.credential(
      response?.data,
      verificationCode,
    );

    const data = await signInWithCredential(auth, credential);

    const userdata = await InsertDataWithUID(
      'user',
      response?.userdata,
      data?.user?.uid,
    );
    userdata.user_id = data?.user?.uid;

    return {data: userdata, null: null, msg: 'user signup successfully'};
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect Login Credentials'};
  }
};
