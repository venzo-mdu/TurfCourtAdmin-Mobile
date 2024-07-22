const { StyleSheet } = require("react-native");
const { COLORS } = require("../../../assets/constants/global_colors");
const { WD, mS, hS } = require("../../../utils/metrics");
const { PoppinsMedium, PoppinsSemiBold, PoppinsRegular } = require("../../../assets/constants/global_fonts");
import { Shadow5 } from '../../../utils/helpers'

export const UserLoginScreenStyles = StyleSheet.create({
  safe: {
   // backgroundColor: COLORS.WHITE,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    
  },
  loginContainer:{
    backgroundColor: COLORS.WHITE,
    flex:3,
    borderTopLeftRadius:40,
    borderTopRightRadius:40
  },
  topContainer:{
    flex:1,
    justifyContent: "center",
    alignItems:'center'
   
  },
  scroll: {
    paddingTop: "12.5%",
    paddingTop: "5%",
  },
  headingTxt: {
    // fontSize: mS(20),
    // color: COLORS.DARK,
    // fontFamily: PoppinsSemiBold,
    // textAlign: "center",
    // marginVertical: hS(8),
    fontSize: mS(22),
    color: '#018352',
   // fontFamily: PoppinsSemiBold,
    textAlign: "start",
    marginVertical: hS(8),
    paddingVertical:5,
    marginHorizontal: hS(16),
  },
  phoneCodeText: {
    // fontSize: mS(20),
    // color: COLORS.DARK,
    // fontFamily: PoppinsSemiBold,
    // textAlign: "center",
    // marginVertical: hS(8),
    fontSize: mS(18),
    color: '#000',
   // fontFamily: PoppinsSemiBold,
    textAlign: "start",
    marginVertical: hS(8),
    paddingVertical:5,
    marginHorizontal: hS(16),
  },
  loginSubText:{
    //marginVertical: hS(8),
   // paddingVertical:5,
    marginHorizontal: hS(16),
    fontSize: mS(16),
    color:"#868686",
    paddingBottom:5
  },
  signUpViewText:{
    fontSize:18,
    fontWeight:"500",
    //paddingLeft:20,
    paddingVertical:5,
    color: '#1B1B1B',
    marginHorizontal: hS(16),
},
  phoneBox: {
    backgroundColor: COLORS.WHITE,
    width: WD - (hS(16) * 2),
    height: mS(60),
    alignSelf: "center",
    paddingHorizontal: hS(8),
    marginHorizontal: hS(16),
    borderWidth: mS(2),
    //borderColor: COLORS.DARK,
    borderColor:'#F1F2F7',
    borderRadius: mS(8),
  },
  CheckBoxViews: {
    backgroundColor: 'transparent',
    width: WD - (hS(16) * 2),
    height: mS(100),
    //alignSelf: "center",
    // paddingHorizontal: hS(8),
    // marginHorizontal: hS(16),
    // borderWidth: mS(2),
    // //borderColor: COLORS.DARK,
    // borderColor:'#F1F2F7',
    // borderRadius: mS(8),
  //  justifyContent:'start'
  },
  CheckboxText:{
    fontSize: mS(18), // Adjust font size
    color: "#898989", // Use your preferred color
    fontFamily: 'Outfit', // Use your preferred font
    padding:15,
   // justifyContent:'start',
   paddingHorizontal: hS(8),
  },
  phoneBoxIP: {
    height: mS(56),
    fontSize: mS(18),
   // color: COLORS.DARK,
   color:'#000',
    fontFamily: PoppinsMedium,
    paddingHorizontal: hS(8),
  },
  sendOTPBox: {
    backgroundColor: COLORS.PRIMARY,
    width: hS(150),
    height: hS(50),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
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
    alignItems: "center",
    justifyContent: "center",
  },
  bottomaskTxt1: {
    fontSize: mS(12),
    color: COLORS.DARK,
    fontFamily: PoppinsMedium,
    textAlign: "center",
  },
  bottomaskTxt2: {
    color: COLORS.PRIMARY,
    fontFamily: PoppinsSemiBold,
    textDecorationLine: "underline"
  },

  otpContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  otpBottom: {
    backgroundColor: COLORS.WHITE,
    marginHorizontal: 0,
    marginTop: "auto",
    borderTopLeftRadius: mS(6),
    borderTopRightRadius: mS(6),

    ...Shadow5,
  },
  otpCloseBtn: {
    backgroundColor: "rgba(0,0,0,0.05)",
    width: hS(30),
    height: hS(30),
    alignSelf:"flex-end",
    alignItems:"center",
    justifyContent:"center",
    marginVertical: hS(10),
    marginHorizontal: hS(8),
    borderRadius: hS(30),
  },
  otpHeadingTxt: {
    fontSize: mS(18),
    color: COLORS.BLACK,
    fontFamily: PoppinsMedium,
    textAlign: "center",
  },
  otpResendTxt: {
    fontSize: mS(12),
    color: COLORS.BLACK,
    fontFamily: PoppinsRegular,
    textAlign: "center",
    marginBottom: hS(10),
  },
//   loginBox: {
//     backgroundColor: COLORS.PRIMARY,
//     width: mS(150),
//     height: mS(50),
//     alignSelf: "center",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: hS(20),
//     borderRadius: mS(8),
//   },
//   loginTxt: {
//     fontSize: mS(18),
//     color: COLORS.WHITE,
//     fontFamily: PoppinsMedium,
//   },

  /*New */
    loginBox: {
        backgroundColor: '#192335',
    width: mS(300),
    height: mS(50),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hS(20),
    borderRadius: mS(8),
  },
  loginButtonBox: {
    backgroundColor: '#192335',
width: mS(300),
height: mS(50),
alignSelf: "center",
alignItems: "center",
justifyContent: "center",
marginBottom: hS(20),
borderRadius: mS(8),
paddingTop: 15
},
  loginTxt: {
    fontSize: mS(18),
    color: COLORS.WHITE,
    fontFamily: PoppinsMedium,
  },
  divider: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  phoneNumberContainer: {
    alignItems: 'flex-start',
   // marginBottom: 12,
    paddingLeft:20,
    paddingTop:30,
  },
  phoneInputContainer: {
    width: '100%',
    height: 50,
    marginBottom: 12,
  },
  phoneInputTextContainer: {
    paddingVertical: 0,
  },
  dropdown: {
    width: '100%',
    height: 50,
    borderColor: '#F1F2F7',
    borderWidth: 1,
    borderRadius: 8,
   // paddingHorizontal: 8,
    backgroundColor: '#F9F9F6',
    
  },
  selectedValue: {
    marginTop: 16,
    fontSize: 18,
    paddingLeft:2,
  },

})