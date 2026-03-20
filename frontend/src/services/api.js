import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:3000/api/auth';

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

const pickAccessToken = (data) => data?.accessToken || data?.user?.acesstoken || null;

export const registerUser = async (payload) => {
  const { data } = await api.post('/register', payload);
  const token = pickAccessToken(data);
  if (token) setAccessToken(token);
  return data;
};

export const loginUser = async (payload) => {
  const { data } = await api.post('/login', payload);
  const token = pickAccessToken(data);
  if (token) setAccessToken(token);
  return data;
};

export const verifyEmailOtp = async (payload) => {
  const { data } = await api.post('/verify-email', payload);
  return data;
};

export const resendOtp = async (payload) => {
  const { data } = await api.post('/resend-otp', payload);
  return data;
};


export const refreshAccessToken = async () => {
  const { data } = await api.get('/refresh-token');
  const token = pickAccessToken(data);
  if (token) setAccessToken(token);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/profile');
  return data;
};

export const logout = async () => {
  const { data } = await api.get('/logout');
  clearAccessToken();
  return data;
};

export default api;
