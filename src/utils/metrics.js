import { Dimensions, StatusBar } from 'react-native';

var { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const horizontalScale = (size) => (width / guidelineBaseWidth) * size;
const verticalScale = (size) => (height / guidelineBaseHeight) * size;
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor;

const statusbarHeight = StatusBar.currentHeight;

export { width as WD, height as HT, horizontalScale as hS, verticalScale as vS, moderateScale as mS, statusbarHeight };