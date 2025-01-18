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
} from 'react-native';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import {useToggle} from '../../Hooks';
import {SignIn, SignUp, GoogleSign} from 'components/molecules';

interface InitialFormValue {
  email: string;
  password: string;
}

const Login: React.FC = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [signInToggle, setSignInToggle] = useToggle(false);
  const [signUpToggle, setSignUpToggle] = useToggle(false);

  const handleSignin = () => {
    setSignInToggle();
  };
  const handleSignup = () => {
    setSignUpToggle();
  };

  const handleBackSignInAction = () => {
    setSignUpToggle();
    !signInToggle && setSignInToggle();
  };

  return (
    <SafeAreaView>
      <View style={styles.loginView}>
        <View>
          <Image
            style={styles.syllabLogo}
            source={require('../../assets/android-chrome-192x192.png')}
          />
        </View>
        <View style={{padding: 10, postion: 'relative', bottom: 5}}>
          <Text style={styles.appName}>Feel Hotel</Text>
          <Text>Book your hotel for good</Text>
        </View>

        <View style={styles.fixedScreen}>
          {!signUpToggle && !signInToggle && (
            <View style={styles.loginSignupButton}>
              <CustomButton
                buttonColor={'white'}
                onClick={handleSignin}
                icon={<FontAwesome6 name="arrow-right" iconStyle="solid" />}
                text={<Text>Sign In</Text>}
              />
            </View>
          )}
          {signInToggle && !signUpToggle && (
            <SignIn
              navigation={navigation}
              backAction={setSignInToggle}
              signUpAction={setSignUpToggle}
            />
          )}

          {!signInToggle && !signUpToggle && (
            <View style={styles.loginSignupButton}>
              <CustomButton
                buttonColor={'white'}
                onClick={handleSignup}
                icon={<FontAwesome6 name="arrow-right" iconStyle="solid" />}
                text={<Text>Sign up</Text>}
              />
            </View>
          )}
          {signUpToggle && (
            <SignUp
              navigation={navigation}
              backAction={setSignUpToggle}
              signInAction={handleBackSignInAction}
            />
          )}
          <GoogleSign />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loginView: {
    width: '100%',
    backgroundColor: '#fff0',
    margin: 'auto',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  fixedScreen: {
    position: 'absolute',
    bottom: 25,
  },
  showEditbox: {
    height: 15,
  },
  syllabLogo: {
    width: 350,
    height: 350,
    borderRadius: 3,
    borderColor: 'white',
    borderWidth: 2,
  },
  appName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
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
  loginSignupButton: {
    marginTop: 1,
    borderColor: '#EFEFEF',
    borderWidth: 2,
    width: 350,
    backgroundColor: 'white',
  },
  CustomButtonLogin: {
    color: 'white',
  },
  input: {
    borderWidth: 1,
    width: '100%',
    padding: 5,
  },
});

export default Login;
