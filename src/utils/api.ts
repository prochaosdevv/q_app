import axios from 'axios';
import { API_URL } from '@env';
import { getAccessToken } from './tokenSetting';
console.log('Api', API_URL);

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async config => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
