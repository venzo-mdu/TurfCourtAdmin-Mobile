import {PhoneAuthProvider, signInWithCredential} from 'firebase/auth';
import {InsertDataWithUID, FetchData, FetchDataById, UpdateData} from './crud';
import {auth} from '../firebase';
import {firebase} from '@react-native-firebase/auth';

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

export const loginmobile = async (phoneNumber, recaptchaVerifierComp) => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(phoneNumber);

    if (isAvailable) {
      let phoneNumber1 = phoneNumber;
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber1,
        recaptchaVerifierComp.current,
      );
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
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    const response = await signInWithCredential(auth, credential);
    const user = auth.currentUser;
    let uid = user.uid;
    const userData = await FetchDataById('user', uid);
    return {data: userData, error: null, msg: 'User logged in successfully'};
  } catch (err) {
    return {data: null, error: err, msg: 'Incorrect Login Credentials'};
  }
};

// export const loginmobile = async phoneNumber => {
//   try {
//     const isAvailable = await checkPhoneNumberAvailability(phoneNumber);

//     if (isAvailable) {
//       // Directly use Firebase's signInWithPhoneNumber method
//       const confirmation = await firebase
//         .auth()
//         .signInWithPhoneNumber(phoneNumber);
//       return {confirmation, error: null, msg: ''};
//     } else {
//       return {
//         data: null,
//         error: 'Phone number is not registered.',
//         msg: 'Phone number is not registered.',
//       };
//     }
//   } catch (error) {
//     return {
//       confirmation: null,
//       error: error.message,
//       msg: 'Error in phone verification',
//     };
//   }
// };

// export const loginverifyOtp = async (otp, confirmation) => {
//   try {
//     const userCredential = await confirmation.confirm(otp);
//     const user = userCredential.user;
//     const userData = await FetchDataById('user', user.uid);
//     return {data: userData, error: null, msg: 'User logged in successfully'};
//   } catch (error) {
//     return {data: null, error: error.message, msg: 'Incorrect OTP'};
//   }
// };

export const mobilesignup = async (userData, recaptchaVerifier) => {
  try {
    const isAvailable = await checkPhoneNumberAvailability(
      userData.phonenumber,
    );

    if (!isAvailable) {
      let phonenumber1 = userData.phonenumber;
      const phoneProvider = new PhoneAuthProvider(auth);
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phonenumber1,
        recaptchaVerifier,
      );
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
