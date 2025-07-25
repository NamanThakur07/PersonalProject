import { call, put, takeLatest } from 'redux-saga/effects';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  verifyOtpRequest,
  verifyOtpSuccess,
  verifyOtpFailure
} from '../actions/types';
import { loginUser, registerUser, verifyOtp } from '../../api/authAPI';
import { setItem } from '../../utils/storage';

function* loginSaga(action: ReturnType<typeof loginRequest>) {
  try {
    const { email, password } = action.payload;
    const response = yield call(loginUser, email, password);
    
    if (response.token) {
      yield call(setItem, 'authToken', response.token);
    }
    
    yield put(loginSuccess(response.user, response.token));
  } catch (error: any) {
    yield put(loginFailure(error.message));
  }
}

function* signupSaga(action: ReturnType<typeof signupRequest>) {
  try {
    const userData = action.payload;
    console.log("Registration payload:", userData);
    
    const response: { user: any } = yield call(registerUser, userData);
    
    if (response.user) {
      yield put(signupSuccess(response.user));
    } else {
      yield put(signupFailure('Registration completed but no user data returned'));
    }
  } catch (error: any) {
    console.error("Registration error:", error);
    yield put(signupFailure(error.message || 'Registration failed'));
  }
}

function* verifyOtpSaga(action: ReturnType<typeof verifyOtpRequest>) {
  try {
    const { otp, email } = action.payload;
    const response = yield call(verifyOtp, otp, email);
    
    if (response.token) {
      yield call(setItem, 'authToken', response.token);
    }
    
    yield put(verifyOtpSuccess(response.token));
  } catch (error: any) {
    yield put(verifyOtpFailure(error.message));
  }
}

export function* watchAuth() {
  yield takeLatest('LOGIN_REQUEST', loginSaga);
  yield takeLatest('SIGNUP_REQUEST', signupSaga);
  yield takeLatest('VERIFY_OTP_REQUEST', verifyOtpSaga);
}