import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';

const CommonTextInput = ({ label, value, onChangeText, widthStyle }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, (widthStyle === true) ? styles.autoWidth : styles.fixedWidth]}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#1B1B1B',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
 //   width: Dimensions.get('window').width * 0.9,
    backgroundColor:'#ffffff'
  },
  fixedWidth: {
    width: Dimensions.get('window').width * 0.9,
  },
  autoWidth: {
    width: 'auto',
  },
});

export default CommonTextInput;
