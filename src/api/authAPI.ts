import axios from 'axios';
import { getItem } from '../utils/storage';
import { API_URL, AUTH_SLUG } from './env';

const api = axios.create({
  baseURL: `${API_URL}/${AUTH_SLUG}/`,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Simplified API calls
export const registerUser = async (userData: {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tosAccept: boolean;
  privacyPolicyAccept: boolean;
}) => {
  const payload = {
    username: userData.username.trim(),
    first_name: userData.firstName.trim(),
    last_name: userData.lastName.trim(),
    email: userData.email.trim().toLowerCase(),
    password: userData.password,
    tos_accept: userData.tosAccept,
    privacy_policy_accept: userData.privacyPolicyAccept
  };

  try {
    const response = await api.post('register', payload);
    if (!response.data.success) {
      throw response.data.message || 'Registration failed';
    }
    return { user: response.data.user };
  } catch (error:any) {
    const message = error.response?.data?.message || 
                   error.response?.data?.error ||
                   error.message || 
                   'Registration failed';
    throw message;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await api.post('login', { email, password });
    if (!response.data.success) {
      throw response.data.message || 'Login failed';
    }
    return {
      user: response.data.user,
      token: response.data.token
    };
  } catch (error:any) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'Login failed';
    throw message;
  }
};

export const verifyOtp = async (otp: string, email: string) => {
  try {
    const response = await api.post('verify-otp', { otp, email });
    if (!response.data.success) {
      throw response.data.message || 'OTP verification failed';
    }
    return { token: response.data.token };
  } catch (error:any) {
    const message = error.response?.data?.message || 
                   error.message || 
                   'OTP verification failed';
    throw message;
  }
};