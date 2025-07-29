import AsyncStorage from '@react-native-async-storage/async-storage';

export const getForgotPasswordAccessToken = async () => {
  const forgotPasswordAccessToken = await AsyncStorage.getItem(
    'forget_password_access_token',
  );
  return forgotPasswordAccessToken;
};

export const clearForgotPasswordAccessToken = async () => {
  await AsyncStorage.removeItem('forget_password_access_token');
  return true;
};
