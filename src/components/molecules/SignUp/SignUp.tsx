import React from 'react';
import {View, Text} from 'react-native';
import {BackAction} from 'components/atoms';

const SignUp: React.FC = ({navigation, backAction}) => {
  return (
    <View>
      <BackAction backAction={backAction} />
      <Text>Sign up</Text>
    </View>
  );
};

export default SignUp;
