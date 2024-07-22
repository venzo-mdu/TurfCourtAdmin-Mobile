import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';

const CommonTextArea = ({ label, value, onChangeText, placeholder, placeholderTextColor, numberOfLines }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={styles.textArea}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor || "#666"}
        numberOfLines={numberOfLines || 4}
        multiline={true}
        textAlignVertical="top" // Ensures the text starts at the top of the TextInput
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    color:'#1B1B1B'
  },
  textArea: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: 'top', // Aligns text at the top of the TextInput
    backgroundColor:'#ffffff',
    width: Dimensions.get('window').width * 0.8,

  },
});

export default CommonTextArea;
