import {useState} from 'react';
import {CustomInput, CustomButton} from 'components/atoms';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  Button,
  Alert,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {useMutation, gql} from '@apollo/client';
import {Formik} from 'formik';
import * as Yup from 'yup';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {regex} from 'utils';
import {BackAction} from 'components/atoms';
import Toast from 'react-native-simple-toast';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';

interface InitialFormValue {
  email: string;
  password: string;
  confirm_password: string;
}

const SIGNUP_MUTATION = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
    }
  }
`;

const SignUp: React.FC = ({navigation, backAction, signInAction}) => {
  const [showedit, setShowEdit] = useState(false);
  const [username, setUsername] = useState('');
  const [signUp, {data, loading, error}] = useMutation(SIGNUP_MUTATION);

  const handleSignUp = async (email, password) => {
    try {
      const res = await signUp({variables: {email, password}});
    } catch (error) {
      console.log('error', error);
    }
  };

  const initialValue: InitialFormValue = {
    email: '',
    password: '',
    confirm_password: '',
  };

  const emailValidationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .matches(regex.basicEmailRegex, 'Email address must be valid'),
  });

  const validationSchema = Yup.object({
    email: Yup.string()
      .required('Email is required')
      .matches(regex.basicEmailRegex, 'Email address must be valid'),
    password: Yup.string()
      .required('Please enter password')
      .matches(
        /^.*(?=.{10,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 10 characters, one uppercase, one number and one special case character',
      ),
    confirm_password: Yup.string(),
  });

  const handleSignup = async values => {
    try {
      await validationSchema.validate(values);
      const {password, confirm_password} = values;
      if (password === confirm_password) {
        // navigation.navigate('Home');
        handleSignUp(values?.email, values?.password);
      } else {
        Toast.showWithGravity('Passwords must match', Toast.LONG, Toast.TOP, {
          backgroundColor: '#A70D2A',
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleEdit = formik => {
    formik.setFieldValue('password', '');
    setShowEdit(false);
  };

  const handleValidEmail = async formik => {
    try {
      await emailValidationSchema.validate({email: formik?.values?.email});
      setShowEdit(true);
    } catch (error) {
      formik.setErrors({email: formik?.errors?.email || 'Email is required'});
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView>
      <View style={{marginBottom: 3, fontWeight: 'bold'}}>
        <Text style={{fontWeight: 'bold'}}>Sign up</Text>
      </View>
      <View style={styles.loginView}>
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={values => handleSignup(values)}
          // validateOnChange={false}
          // validateOnBlur={false}
        >
          {formik => {
            return (
              <View style={styles.emailInputBox}>
                <View style={styles.emailInput}>
                  <View style={styles.showEditbox}>
                    {showedit && (
                      <TouchableOpacity
                        onPress={() => handleEdit(formik)}
                        style={styles.editEmail}>
                        <Text style={styles.editEmailText}>
                          {formik?.values?.email}
                        </Text>
                        <FontAwesome6
                          name="pen"
                          color="black"
                          iconStyle="solid"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {!showedit && (
                    <CustomInput
                      error={formik?.errors?.email}
                      style={styles.input}
                      onChangeText={formik?.handleChange('email')}
                      onBlur={formik?.handleBlur('email')}
                      value={formik?.values?.email}
                      inputMode="text"
                      keyboardType="email-address"
                      placeholder="Enter email address"
                      icon={<MaterialDesignIcons name="email" size={15} />}
                    />
                  )}
                  {showedit && (
                    <CustomInput
                      error={formik?.errors?.password}
                      style={styles.input}
                      onChangeText={formik?.handleChange('password')}
                      onBlur={formik?.handleBlur('password')}
                      value={formik?.values?.password}
                      inputMode="text"
                      keyboardType="text"
                      placeholder="Password"
                    />
                  )}
                  {showedit && (
                    <CustomInput
                      error={formik?.errors?.confirm_password}
                      style={styles.input}
                      onChangeText={formik?.handleChange('confirm_password')}
                      onBlur={formik?.handleBlur('confirm_password')}
                      value={formik?.values?.confirm_password}
                      inputMode="text"
                      keyboardType="text"
                      placeholder="Confirm password"
                      icon={
                        <MaterialDesignIcons
                          name="form-textbox-password"
                          size={15}
                        />
                      }
                    />
                  )}
                </View>
                <View style={styles.loginButton}>
                  <CustomButton
                    buttonColor={'white'}
                    onClick={
                      showedit
                        ? formik?.handleSubmit
                        : () => handleValidEmail(formik)
                    }
                    icon={
                      <FontAwesome6
                        name="arrow-right"
                        color="white"
                        iconStyle="solid"
                      />
                    }
                    text={
                      <Text style={styles.LoginText}>
                        {!showedit ? 'Enter' : 'Sign up'}
                      </Text>
                    }
                  />
                </View>
              </View>
            );
          }}
        </Formik>
        <View>
          <BackAction
            backAction={backAction}
            content={'Already have an account?'}
            handleCustomNavigation={signInAction}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginView: {
    width: 350,
    margin: 'auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  syllabLogo: {
    width: 350,
    height: 350,
    borderRadius: 3,
  },
  loginText: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 20,
    paddingBottom: 20,
  },
  emailInputBox: {
    width: '100%',
    justifyContent: 'space-between',
  },
  emailInput: {
    width: '100%',
  },
  editEmail: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
  },
  editEmailText: {
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginTop: 5,
    width: '100%',
    backgroundColor: 'black',
  },
  CustomButtonLogin: {
    color: 'white',
  },
  LoginText: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    padding: 5,
  },
});

export default SignUp;
