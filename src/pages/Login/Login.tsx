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
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {useToggle} from '../../Hooks';
import {SignIn, SignUp} from 'components/molecules';

interface InitialFormValue {
  email: string;
  password: string;
}

const Login: React.FC = ({navigation}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [signInToggle, setSignInToggle] = useToggle(false);
  const [signUpToggle, setSignUpToggle] = useToggle(false);
  // const [signUpToggle, setSignUpToggle] = useToggle(false);
  GoogleSignin.configure({
    webClientId:
      '425893378965-il92kcq6pdumpttaq4ab211d6fim29v7.apps.googleusercontent.com',
    // androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId:
      '425893378965-mcod8d1nmp40itj0t99p7rcc1e4p5nl7.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
  });

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      setUserInfo(userInfo);
      Alert.alert('Logged in!', `Hello, ${userInfo.user.name}`);
    } catch (error) {
      console.log('error', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        Alert.alert('Login cancelled');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g., sign-in) is in progress already
        Alert.alert('Login in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        Alert.alert('Play Services not available');
      } else {
        // some other error
        Alert.alert('An error occurred', error.message);
      }
    }
  };

  const handleSignin = () => {
    setSignInToggle();
  };
  const handleSignup = () => {
    setSignUpToggle();
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
        <View>
          <Text style={styles.appName}>Feel Hotel</Text>
        </View>
        {!signUpToggle && (
          <View style={styles.loginSignupButton}>
            <CustomButton
              buttonColor={'white'}
              onClick={handleSignin}
              icon={<FontAwesome6 name="arrow-right" iconStyle="solid" />}
              login={<Text style={styles.SignText}>Sign in</Text>}
            />
          </View>
        )}
        {signInToggle && <SignIn />}

        {!signInToggle && (
          <View style={styles.loginSignupButton}>
            <CustomButton
              buttonColor={'white'}
              onClick={handleSignup}
              icon={<FontAwesome6 name="arrow-right" iconStyle="solid" />}
              login={<Text style={styles.SignText}>Sign up</Text>}
            />
          </View>
        )}
        {signUpToggle && <SignUp />}
        {/* <View style={styles.loginSignupButton}>
          <Button title="Sign in with Google" onPress={handleGoogleLogin} />
        </View> */}
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
  showEditbox: {
    height: 15,
  },
  syllabLogo: {
    width: 300,
    height: 300,
    borderRadius: 3,
    borderColor: 'white',
    borderWidth: 2,
  },
  appName: {
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
  loginSignupButton: {
    marginTop: 1,
    borderColor: '#EFEFEF',
    borderWidth: 2,
    width: 300,
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
