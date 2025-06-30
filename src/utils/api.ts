import axios from 'axios';
import { API_URL } from '@env';
import { getAccessToken } from './tokenSetting';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    console.log('Access Token :', token);
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
