/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '425893378965-il92kcq6pdumpttaq4ab211d6fim29v7.apps.googleusercontent.com',
  // androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  iosClientId: '425893378965-mcod8d1nmp40itj0t99p7rcc1e4p5nl7.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});