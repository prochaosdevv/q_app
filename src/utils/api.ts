import axios from 'axios';
import { getAccessToken } from './tokenSetting';
import dotenv from 'dotenv';
dotenv.config();

const api = axios.create({
  baseURL: process.env.API_URL,
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
