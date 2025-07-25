import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInputProps,
  Image,
} from 'react-native';

interface CustomTextInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: object;
  showPasswordToggle?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  error,
  containerStyle,
  style,
  secureTextEntry = false,
  showPasswordToggle = true,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [internalValue, setInternalValue] = useState('');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleTextChange = (text: string) => {
    setInternalValue(text);
    props.onChangeText?.(text);
  };

  const displayValue =
    secureTextEntry && !isPasswordVisible
      ? '*'.repeat(internalValue.length)
      : internalValue;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        <TextInput
          {...props}
          value={displayValue}
          onChangeText={handleTextChange}
          autoCapitalize="none"
          style={[
            styles.input,
            style,
            error ? styles.errorInput : null,
          ]}
          secureTextEntry={false} // we mask manually, so don't use native one
        />
        {secureTextEntry && showPasswordToggle && (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={togglePasswordVisibility}
          >
            {isPasswordVisible ? (
              <Image
                source={require('../../assets/images/EyeVector.png')}
                style={{ height: 15, width: 20 }}
              />
            ) : (
              <View style={styles.eyeSlash} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    height: 50,
    marginVertical: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    paddingRight: 40,
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 22,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeSlash: {
    width: 18,
    height: 2,
    backgroundColor: '#666',
    transform: [{ rotate: '-45deg' }],
  },
});

export default CustomTextInput;
