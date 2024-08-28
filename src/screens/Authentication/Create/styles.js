const {StyleSheet} = require('react-native');
const {COLORS} = require('../../../assets/constants/global_colors');
const {WD, mS, hS} = require('../../../utils/metrics');
const {
  PoppinsMedium,
  PoppinsSemiBold,
  PoppinsRegular,
  Outfit,
  Urbanist,
  UrbanistMedium,
  OutfitRegular,
  OutfitLight,
} = require('../../../assets/constants/global_fonts');
import {Shadow5} from '../../../utils/helpers';

export const UserLoginScreenStyles = StyleSheet.create({
  safe: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  loginContainer: {
    paddingHorizontal: 30,
    backgroundColor: COLORS.WHITE,
    flex: 3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  logoContainer: {
    height: 200,
    paddingVertical: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    paddingTop: '12.5%',
    paddingTop: '5%',
  },
  headingTxt: {
    lineHeight: 27.72,
    fontSize: hS(24),
    marginBottom: 20,
    color: COLORS.PrimaryColor,
    fontFamily: 'Outfit-Regular',
  },
  phoneCodeText: {
    fontSize: mS(16),
    fontFamily: 'Outfit-Medium',
    color: '#000',
  },
  loginSubText: {
    fontFamily: 'Outfit-Regular',
    fontSize: hS(16),
    color: COLORS.SecondaryFontColor,
    marginVertical:20
  },

  signUpViewText: {
    fontSize: mS(16),
    color: COLORS.fontColor,
    fontFamily: 'Outfit-Regular',
    lineHeight: 20.16,
    marginBottom: hS(10),
  },
  phoneBox: {
    backgroundColor: COLORS.fieldColor,
    width: '100%',
    height: 60,
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1.5,
    borderRadius: 8,
    paddingLeft: 10,
  },
  CheckBoxViews: {
    width: '90%',
  },
  CheckboxText: {
    fontSize: mS(18),
    color: '#898989',
    fontFamily: 'Outfit-Light',
  },
  phoneBoxIP: {
    fontFamily: 'Outfit-Light',
    height: mS(56),
    fontSize: mS(16),
    color: '#000',
    paddingHorizontal: hS(8),
  },
  sendOTPBox: {
    backgroundColor: COLORS.PRIMARY,
    width: hS(150),
    height: hS(50),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hS(16),
    marginBottom: hS(16),
    borderRadius: mS(8),
  },
  sendOTPBoxTxt: {
    fontSize: mS(18),
    color: COLORS.WHITE,
    fontFamily: 'Outfit-Medium',
  },
  pwdBox: {
    width: mS(54),
    height: mS(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomaskTxt1: {
    fontSize: mS(18),
    color: '#898989',
    fontFamily: 'Outfit-Light',
    textAlign: 'center',
  },
  bottomaskTxt2: {
    color: '#097E52',
    fontFamily: 'Outfit-Medium',
    fontSize: mS(18),
    lineHeight: 22.68,
  },

  otpContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  otpBottom: {
    backgroundColor: '#fff',
    marginHorizontal: 0,
    marginTop: 0,
    borderTopLeftRadius: mS(6),
    borderTopRightRadius: mS(6),
  },
  otpCloseBtn: {
    backgroundColor: 'red',
    width: hS(30),
    height: hS(30),
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hS(10),
    marginHorizontal: hS(8),
    borderRadius: hS(30),
  },
  otpHeadingTxt: {
    fontSize: mS(18),
    color: COLORS.BLACK,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
  },
  otpResendTxt: {
    fontSize: mS(18),
    color: COLORS.BLACK,
    fontFamily: 'Outfit-Light',
    textAlign: 'left',
    marginBottom: hS(10),
    paddingBottom: 100,
  },
  loginBox: {
    backgroundColor: COLORS.buttonColor,
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  loginButtonBox: {
    backgroundColor: COLORS.buttonColor,
    width: mS(300),
    height: mS(50),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hS(20),
    borderRadius: mS(8),
    paddingTop: 15,
  },
  loginTxt: {
    fontSize: mS(16),
    color: COLORS.WHITE,
    fontFamily: UrbanistMedium,
    lineHeight: 19.2,
  },

  lineContainer: {
    marginTop: '8%',
    marginBottom: '8%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
    width: '100%',
  },
  line: {
    height: 1,
    backgroundColor: '#D7D7D7',
    width: '10%',
  },
  lineText: {
    color: '#898989',
    fontFamily: 'Outfit-Light',
    fontSize: mS(18),
    lineHeight: 22.68,
  },
  phoneNumberContainer: {
    alignItems: 'flex-start',
    // marginBottom: 12,
    paddingLeft: 20,
    paddingTop: 30,
  },
  phoneInputContainer: {
    width: '100%',
    height: 60,
    backgroundColor: COLORS.fieldColor,
    borderWidth: 1.5,
    borderColor: COLORS.fieldBorderColor,
    borderRadius: 14,
  },
  phoneInputTextContainer: {
    fontFamily: 'Outfit-Medium',
    paddingVertical: 0,
    borderRadius: 14,
  },
  dropdown: {
    width: '100%',
    height: 50,
    borderColor: '#F1F2F7',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F6',
  },
  selectedValue: {
    marginTop: 16,
    fontSize: 18,
    paddingLeft: 2,
  },
  termsText: {
    fontSize: mS(18),
    color: '#097E52',
    fontFamily: 'Outfit-Medium',
  },
});
export const UserOtpScreenStyles = StyleSheet.create({
  title: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  headingTxt: {
    lineHeight: 27.72,
    fontSize: hS(24),
    marginVertical: 5,
    color: COLORS.PrimaryColor,
    fontFamily: 'Outfit-Regular',
  },
});
