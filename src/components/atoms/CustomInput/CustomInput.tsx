import React from 'react';
import {TextInput, StyleSheet, View, Text} from 'react-native';

type CustomInput = {
  inputMode: string;
  keyboardType: string;
  placeholder: string;
  height: number;
  value: string;
  icon: string;
  error: string;
  onChangeText: () => void;
  onBlur: () => void;
};

const CustomInput: React.FC<CustomInputProps> = props => {
  const {
    inputMode,
    keyboardType,
    placeholder,
    onChangeText,
    onBlur,
    height,
    value,
    icon,
    error,
  } = props;

  return (
    <>
      <View>
        <Text style={styles.ErrorInput}>{error}</Text>
      </View>
      <View style={styles.TextInput}>
        <TextInput
          style={styles.input}
          value={value}
          height={height}
          onChangeText={onChangeText}
          onBlur={onBlur}
          inputMode={inputMode}
          keyboardType={keyboardType}
          placeholder={placeholder}
        />
        <View style={styles.IconInput}>{icon}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  ErrorInput: {
    fontSize: 10,
    color: '#A70D2A', // carbon red
  },
  TextInput: {
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    padding: 5,
  },
  IconInput: {
    position: 'relative',
    top: 8,
    right: 15,
  },
});

export default CustomInput;
