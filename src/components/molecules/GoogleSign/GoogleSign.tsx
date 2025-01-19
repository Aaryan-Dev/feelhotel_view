import {useState} from 'react';
import {View, Pressable, Text, StyleSheet} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {CustomButton} from 'components/atoms';
import {useNavigation} from '@react-navigation/native';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

GoogleSignin.configure({
  webClientId:
    '425893378965-il92kcq6pdumpttaq4ab211d6fim29v7.apps.googleusercontent.com',
  // androidClientId:
    // '425893378965-h1361b2oe8v0nef1muu8cj6e69c7tfha.apps.googleusercontent.com',
  iosClientId:
    '425893378965-mcod8d1nmp40itj0t99p7rcc1e4p5nl7.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

export default function GoogleSign() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const response = await GoogleLogin();
      // const {idToken, scopes} = response?.data;
      setUserInfo(response?.data);
      await AsyncStorage.setItem('userEmail', response?.data?.user?.email);
      navigation.navigate('Home');
      // if (idToken) {
      //   const resp = await authAPI.validateToken({
      //     token: idToken,
      //     email: user.email,
      //   });
      //   await handlePostLoginData(resp.data);
      // }
    } catch (apiError) {
      console.log('apiError', apiError);
      setError(
        apiError?.response?.data?.error?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable style={styles.googleButoon} onPress={handleGoogleLogin}>
      <Text> Continue with Google </Text>
      <MaterialDesignIcons name="google" size={15} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  googleButoon: {
    display: 'flex',
    backgroundColor: 'white',
    borderColor: '#B9B9B9',
    width: 350,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    padding: 5,
    marginTop: 2,
  },
});
