import { Alert } from 'react-native';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import api from './api';
import { useAuthStore } from '../zustand/store/authStore';
// Configure Google Sign-In
GoogleSignin.configure({
  webClientId:
    '105925782119-92iqqd2s9h2061tp1v87g2pbf8c4vphj.apps.googleusercontent.com',
});

// API call function

const sendUserDataToServer = async ({ email, name, id, photo, navigation }) => {
  try {
    const { setUser, setToken } = useAuthStore.getState();
    const response = await api.post('/user/auth/social', {
      email,
      provider: 'google',
      providerId: id,
      fullname: name,
      image: photo,
    });
    const data = response.data;

    setToken(data.token);
    setUser(data.user);

    if (data.success) {
      Alert.alert('Success', 'Login successful...!!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('projects'),
        },
      ]);
    } else {
      Alert.alert('Error', 'Invalid email or password...!!');
    }
  } catch (error) {
    console.error('❌ Sign in error:', error?.response?.data || error.message);
    Alert.alert('Error', 'Sign in failed. Please try again.');
  }
};

// Google Sign-In
const signInWithGoogle = async ({ navigation }) => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const userData = userInfo.data?.user;

    if (userData) {
      const { email, name, id, photo } = userData;

      await sendUserDataToServer({
        email,
        name,
        id,
        photo,
        navigation,
      });
    } else {
      console.log('❌ Sign in failed or was cancelled.');
    }
  } catch (error) {
    if (isErrorWithCode(error)) {
      switch (error.code) {
        case statusCodes.IN_PROGRESS:
          Alert.alert('Message', 'Sign in is in progress...');
          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          Alert.alert('Message', 'Play services not available...');
          break;
        default:
          console.log('Google Sign-In error code:', error.code);
      }
    } else {
      console.log('Google sign-in error:', error);
      Alert.alert('Error', 'Google sign-in failed.');
    }
  }
};

export default signInWithGoogle;
