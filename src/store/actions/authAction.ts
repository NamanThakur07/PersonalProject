import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  VERIFY_OTP_REQUEST,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  LOGOUT
} from './types';
import { loginUser, registerUser, verifyOtp } from '../../api/authAPI';

// Simplified action creators
export const loginRequest = (email: string, password: string) => async (dispatch: any) => {
  try {
    dispatch({ type: LOGIN_REQUEST });
    const { user, token } = await loginUser(email, password);
    dispatch({ type: LOGIN_SUCCESS, payload: { user, token } });
    return { user, token };
  } catch (error:any) {
    dispatch({ type: LOGIN_FAILURE, payload: error.toString() });
    throw error;
  }
};

export const signupRequest = (userData: any) => async (dispatch: any) => {
  try {
    dispatch({ type: SIGNUP_REQUEST });
    const { user } = await registerUser(userData);
    dispatch({ type: SIGNUP_SUCCESS, payload: user });
    return { user };
  } catch (error:any) {
    dispatch({ type: SIGNUP_FAILURE, payload: error.toString() });
    throw error;
  }
};

export const verifyOtpRequest = (otp: string, email: string) => async (dispatch: any) => {
  try {
    dispatch({ type: VERIFY_OTP_REQUEST });
    const { token } = await verifyOtp(otp, email);
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: token });
    return { token };
  } catch (error:any) {
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.toString() });
    throw error;
  }
};

export const logout = () => ({
  type: LOGOUT
});