import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomeButton = ({ title, onPress, disabled, style, textStyle }:any) => {
  return (
    <TouchableOpacity
      style={[
        styles.CustomeButton,
        disabled && styles.disabled,
        style, // custom style passed here
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CustomeButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabled: {
    backgroundColor: '#9ec2ff',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});

export default CustomeButton;