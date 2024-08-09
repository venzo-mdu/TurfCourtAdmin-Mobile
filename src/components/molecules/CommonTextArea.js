import React from 'react';
import {View, Text, TextInput, StyleSheet, Dimensions} from 'react-native';
import {COLORS} from '../../assets/constants/global_colors';

const CommonTextArea = ({
  label,
  value,
  onChangeText,
  placeholder,
  placeholderTextColor,
  numberOfLines,
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.textArea}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || COLORS.placeHolder}
        numberOfLines={numberOfLines || 4}
        multiline={true}
        textAlignVertical="top" // Ensures the text starts at the top of the TextInput
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 8,
    color: '#1B1B1B',
  },
  textArea: {
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    height: 100,
    borderColor: COLORS.fieldBorderColor,
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    textAlignVertical: 'top',
    backgroundColor: '#ffffff',
  },
});

export default CommonTextArea;
