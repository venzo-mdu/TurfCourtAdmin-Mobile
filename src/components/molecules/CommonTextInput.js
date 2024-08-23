import React from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../assets/constants/global_colors';

const CommonTextInput = ({label, value, onChangeText, keyboardType}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input]}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    width: '100%',
  },
  label: {
    fontSize: 16,
    color: '#1B1B1B',
    fontFamily: 'Outfit-Regular',
    lineHeight: 20.16,
    margin: 8,
  },
  input: {
    height: 60,
    borderRadius: 12,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 10,
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
  },
});

export default CommonTextInput;
