import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {BackAction, CustomInput, CustomButton} from 'components/atoms';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {regex} from 'utils';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface InitialFormValue {
  email: string;
  password: string;
}

const SignIn: React.FC = ({navigation, backAction, signUpAction}) => {
  const initialValue: InitialFormValue = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .matches(regex.basicEmailRegex, 'Email address must be valid'),
    password: Yup.string().required('Password is required'),
  });

  const handleBackNavigation = () => {
    backAction();
  };

  const handleLogin = values => {
    console.log('values', values);
  };

  return (
    <View style={styles.backAction}>
      <View style={{marginBottom: 5}}>
        <Text>Sign In</Text>
      </View>
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={values => handleLogin(values)}
        // validateOnChange={false}
        // validateOnBlur={false}
      >
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
                <View style={{marginTop: 0}}>
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
    width: 300,
    paddingBottom: 1,
  },
  signUp: {
    color: 'bule',
  },
  VerifyText: {
    borderWidth: 1,
    marginLeft: -5,
    backgroundColor: 'white',
    width: 300,
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
