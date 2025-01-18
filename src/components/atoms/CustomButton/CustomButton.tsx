import React from 'react'
import {
  Button,
  View,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';

type CustomButtonProps = {
  onClick: () => void;
  buttonColor: string;
  icon: string;
};

const CustomButton: React.FC<CustomButtonProps> = props => {
  const {onClick, buttonColor, icon, text} = props;

  return (
    <TouchableOpacity style={styles.CustomButton} onPress={onClick}>
      {text}
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  CustomButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5
  }
});

export default CustomButton