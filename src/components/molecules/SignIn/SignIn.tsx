import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {BackAction, CustomInput, CustomButton} from 'components/atoms';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {regex} from 'utils';
import {useMutation, gql} from '@apollo/client';
import Toast from 'react-native-simple-toast';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface InitialFormValue {
  email: string;
  password: string;
}

const SIGN_IN_MUTATION = gql`
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
    }
  }
`;

const SignIn: React.FC = ({navigation, backAction, signUpAction}) => {
  const initialValue: InitialFormValue = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .matches(regex.basicEmailRegex, 'Email address must be valid'),
    password: Yup.string()
      .required('Please enter password')
      .matches(regex.password, 'Password is invalid'),
  });
  const [signIn, {data, loading, error}] = useMutation(SIGN_IN_MUTATION);

  const handleBackNavigation = () => {
    backAction();
  };

  const handleLogin = async values => {
    try {
      const res = await signIn({
        variables: {email: values?.email, password: values?.password},
      });
      if (res?.data) {
        await AsyncStorage.setItem('userToken', res?.data?.signIn?.token);
        navigation.navigate('Home');
      }
    } catch (error) {
      console.log('error', error);
      if (error.graphQLErrors) {
        Toast.showWithGravity(
          error.graphQLErrors[0]?.message,
          Toast.LONG,
          Toast.TOP,
          {
            backgroundColor: '#A70D2A',
          },
        );
      }
      if (error.networkError) {
        Toast.showWithGravity(error.networkError, Toast.LONG, Toast.TOP, {
          backgroundColor: '#A70D2A',
        });
      }
    }
  };

  return (
    <View style={styles.backAction}>
      <View style={{marginBottom: 5}}>
        <Text style={{fontWeight: 'bold'}}>Sign In</Text>
      </View>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={values => handleLogin(values)}
        validateOnChange={false}
        validateOnBlur={false}>
        {formik => {
          return (
            <View style={styles.emailInputBox}>
              <View style={styles.emailInput}>
                <CustomInput
                  error={formik?.errors?.email}
                  onChangeText={formik?.handleChange('email')}
                  onBlur={formik?.handleBlur('email')}
                  value={formik?.values?.email}
                  inputMode="text"
                  keyboardType="email-address"
                  placeholder="Enter your email address"
                  icon={<MaterialDesignIcons name="email" size={15} />}
                />
                <View>
                  <CustomInput
                    error={formik?.errors?.password}
                    onChangeText={formik?.handleChange('password')}
                    onBlur={formik?.handleBlur('password')}
                    value={formik?.values?.password}
                    inputMode="text"
                    keyboardType="password"
                    placeholder="Password"
                    icon={
                      <MaterialDesignIcons
                        name="form-textbox-password"
                        size={15}
                      />
                    }
                  />
                </View>
                <CustomButton
                  buttonColor={'white'}
                  onClick={formik?.handleSubmit}
                  text={
                    <Text style={styles.VerifyText}> Verify & Proceed</Text>
                  }
                />
              </View>
            </View>
          );
        }}
      </Formik>
      <BackAction
        backAction={backAction}
        content={'New here? Sign up instead!'}
        handleCustomNavigation={signUpAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  backAction: {
    width: 350,
    paddingBottom: 1,
  },
  signUp: {
    color: 'bule',
  },
  VerifyText: {
    borderWidth: 1,
    marginLeft: -5,
    backgroundColor: 'white',
    width: 350,
    padding: 5,
    borderColor: '#909090',
    textAlign: 'center',
  },
  backText: {
    display: 'flex',
    flexDirection: 'row',
    gap: '5',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default SignIn;
