import React from 'react';
import {TouchableOpacity, Text, Image, StyleSheet, View} from 'react-native';

const CustomButton = ({
  text,
  icon,
  iconPosition,
  iconWidth,
  iconHeight,
  onPress,
  disabled,
  style,
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    return (
      <Image
        source={{uri: icon}}
        style={[
          styles.icon,
          iconPosition === 'nextToText' && {marginRight: 14},
          {width: iconWidth, height: iconHeight},
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, disabled && styles.buttonDisabled, style]}>
      {iconPosition === 'top' && (
        <View style={styles.iconContainer}>
          {renderIcon()}
          <Text style={styles.text}>{text}</Text>
        </View>
      )}
      {iconPosition === 'start' && renderIcon()}
      <Text
        style={[styles.text, iconPosition === 'end' && styles.textWithIcon]}>
        {text}
      </Text>
      {iconPosition === 'end' && renderIcon()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 8,
    backgroundColor: '#097E52',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#A9A9A9',
  },
  icon: {
    tintColor: 'inherit',
  },
  iconContainer: {
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Regular',
    fontSize: 15,
  },
  textWithIcon: {
    marginLeft: 14,
  },
});

export default CustomButton;
