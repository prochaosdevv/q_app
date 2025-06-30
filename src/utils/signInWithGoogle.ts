import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import api from './api';
import { useAuthStore } from '../zustand/store/authStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

    // Save token in AsyncStorage
    await AsyncStorage.setItem('access_token', data.token);
    setToken(data.token);
    setUser(data.user);
    setTimeout(() => {
      navigation.navigate('projects');
    }, 100);
  } catch (error) {
    console.error('❌ Sign in error:', error?.response?.data || error.message);
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
          console.log('Sign in is in progress...');

          break;
        case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
          console.log('Play services not available...');

          break;
        default:
          console.log('Google Sign-In error code:', error.code);
      }
    } else {
      console.log('Google sign-in error:', error);
    }
  }
};

export default signInWithGoogle;
