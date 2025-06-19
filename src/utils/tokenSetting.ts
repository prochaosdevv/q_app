import AsyncStorage from '@react-native-async-storage/async-storage';
export const getAccessToken = async () => {
  const accessToken = await AsyncStorage.getItem('access_token');
  return accessToken;
};

export const clearAccessToken = async () => {
  await AsyncStorage.removeItem('access_token');
  return true;
};
