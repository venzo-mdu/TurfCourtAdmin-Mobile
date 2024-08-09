import {StyleSheet} from 'react-native';
import {COLORS} from '../assets/constants/global_colors';
import {hS} from './metrics';

export const colorCode = {
  hexCode:
    Math.floor(Math.random() * 16777215).toString(16) != '000000' &&
    Math.floor(Math.random() * 16777215)
      .toString(16)
      .toLocaleLowerCase() != 'ffffff'
      ? Math.floor(Math.random() * 16777215).toString(16)
      : '880808',
};

export const Shadow5 = StyleSheet.create({
  shadowColor: COLORS.BLACK,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,

  elevation: 5,
});

export const hitSlop10 = StyleSheet.create({
  left: 10,
  right: 10,
  top: 10,
  bottom: 10,
});

export const hitSlop20 = StyleSheet.create({
  left: 20,
  right: 20,
  top: 20,
  bottom: 20,
});

export const backBtnBox = StyleSheet.create({
  backgroundColor: COLORS.LIGHTGREY,
  width: hS(48),
  height: hS(48),
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: hS(50),
});

export const findElementsWithSameProp = arr => {
  const prop1Map = new Map();

  arr.forEach(element => {
    const prop1Value = element.BookId;
    if (prop1Map.has(prop1Value)) {
      prop1Map.get(prop1Value).push(element);
    } else {
      prop1Map.set(prop1Value, [element]);
    }
  });

  const result = Array.from(prop1Map.values());

  return result;
};

{
  /* build/index.js 378 line  (hour === 0) */
}
