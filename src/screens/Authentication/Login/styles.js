const {StyleSheet} = require('react-native');
const {COLORS} = require('../../../assets/constants/global_colors');
const {WD, mS, hS} = require('../../../utils/metrics');
const {
  PoppinsMedium,
  PoppinsSemiBold,
  PoppinsRegular,
} = require('../../../assets/constants/global_fonts');
import {Shadow5} from '../../../utils/helpers';

export const UserLoginScreenStyles = StyleSheet.create({
  safe: {
    backgroundColor: COLORS.WHITE,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  scroll: {
    paddingTop: '12.5%',
    paddingTop: '5%',
  },
  headingTxt: {
    fontSize: mS(20),
    color: COLORS.DARK,
    fontFamily: 'Outfit-Medium',
    textAlign: 'center',
    marginVertical: hS(8),
  },
  phoneBox: {
    backgroundColor: COLORS.LIGHT,
    width: WD - hS(16) * 2,
    height: mS(60),
    alignSelf: 'center',
    paddingHorizontal: hS(8),
    marginHorizontal: hS(16),
    borderWidth: mS(2),
    borderColor: COLORS.DARK,
    borderRadius: mS(8),
  },
  phoneBoxIP: {
    height: mS(56),
    fontSize: mS(18),
    color: COLORS.DARK,
    fontFamily: PoppinsMedium,
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
    fontFamily: PoppinsMedium,
  },
  pwdBox: {
    width: mS(54),
    height: mS(54),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomaskTxt1: {
    fontSize: mS(12),
    color: COLORS.DARK,
    fontFamily: PoppinsMedium,
    textAlign: 'center',
  },
  bottomaskTxt2: {
    color: COLORS.PRIMARY,
    fontFamily: PoppinsSemiBold,
    textDecorationLine: 'underline',
  },

  otpContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  otpBottom: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 0,
    marginTop: 'auto',
    borderTopLeftRadius: mS(6),
    borderTopRightRadius: mS(6),

    ...Shadow5,
  },
  otpCloseBtn: {
    backgroundColor: 'rgba(0,0,0,0.05)',
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
    fontFamily: PoppinsMedium,
    textAlign: 'center',
  },
  otpResendTxt: {
    fontSize: mS(12),
    color: COLORS.BLACK,
    fontFamily: PoppinsRegular,
    textAlign: 'center',
    marginBottom: hS(10),
  },
  loginBox: {
    backgroundColor: COLORS.PRIMARY,
    width: mS(150),
    height: mS(50),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hS(20),
    borderRadius: mS(8),
  },
  loginTxt: {
    fontSize: mS(18),
    color: COLORS.WHITE,
    fontFamily: PoppinsMedium,
  },
});
