import axios from 'axios';
import { API_URL } from '@env';
import { getAccessToken } from './tokenSetting';
import { useAuthStore } from '../zustand/store/authStore';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log(
        '🚫 Unauthorized - Token may be expired or invalid',
        error.response.data,
      );
      const logout = useAuthStore.getState().logout;
      try {
        logout();

        try {
          GoogleSignin.signOut();
          console.log('✅ Google sign-out successful...!!');
        } catch (googleError) {
          console.warn('⚠️ Google Sign-Out failed:', googleError);
        }
      } catch (logoutError) {
        console.error('❌ Logout process failed:', logoutError);
      }
    } else {
      console.log(
        '❌ API Error:',
        error?.response?.status,
        error?.response?.data,
      );
    }
    return Promise.reject(error);
  },
);

export default api;
