import axios from 'axios';
import { API_URL } from '@env';
import { getForgotPasswordAccessToken } from './forgotPasswordTokenSetting';

const forgotPasswordApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});
forgotPasswordApi.interceptors.request.use(
  async config => {
    const token = await getForgotPasswordAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

forgotPasswordApi.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log(
        '🔐 Forgot Password Token Invalid or Expired:',
        error.response.data,
      );
    } else {
      console.log(
        '❌ Forgot Password API Error:',
        error?.response?.status,
        error?.response?.data,
      );
    }
    return Promise.reject(error);
  },
);

export default forgotPasswordApi;
