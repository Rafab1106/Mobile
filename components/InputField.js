import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const InputField = ({ placeholder, secureTextEntry, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#888"
      secureTextEntry={secureTextEntry}
      value={value}
      onChangeText={onChangeText}
      keyboardAppearance="dark"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: '#00ffcc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default InputField;