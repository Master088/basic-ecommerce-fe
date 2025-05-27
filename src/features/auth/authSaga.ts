import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
} from './authSlice';
import {
  loginAPI,
  logoutAPI,
  registerAPI,
} from './authAPI';
import { jwtDecode } from 'jwt-decode';
import {
  setCookie,
  eraseCookie,
} from '@/utils/storageManager';
import axiosInstance from '@/api/axiosInstance';
import type {
  User,
  LoginPayload,
  RegisterPayload,
  DecodedToken,
} from './authTypes';

function* handleLogin(action: { payload: LoginPayload }) {
  try {
    const response: {
      accessToken: string;
      refreshToken: string;
      user: User;
    } = yield call(loginAPI, action.payload);

    const decoded: DecodedToken = jwtDecode(response.refreshToken);
    const nowInSeconds = Math.floor(Date.now() / 1000);
    const minutesLeft = Math.floor((decoded.exp - nowInSeconds) / 60);

    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      address: response.user.address ?? '',
      role: response.user.role ?? '',
    };
 
    setCookie('shop.rfc7519', response.accessToken, minutesLeft);
    setCookie('shop.rfc7519_refresh_token', response.refreshToken, minutesLeft);
    setCookie('shop.user', JSON.stringify(user), minutesLeft);

    axiosInstance.defaults.headers['Authorization'] = 'Bearer ' + response.accessToken;

    yield put(loginSuccess({
      token: response.accessToken,
      refreshToken: response.refreshToken,
      user,
    }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error: unknown) {
    yield put(loginFailure('Invalid email or password. Please try again.'));
  }
}


function* handleRegister(action: { payload: RegisterPayload }) {
  try {
    const response: {
      message: string;
      user: {
        id: number;
        name: string;
        email: string;
      };
    } = yield call(registerAPI, action.payload);

    // Provide fallback values for optional fields
    const user: User = {
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      address: '',
      role: '',
    };

yield put(registerSuccess({ message: 'Registration successful!', user }));
  } catch (error: unknown) {
    let errorMessage = 'Registration failed. Please check your details and try again.';

    if (axios.isAxiosError(error) && error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    yield put(registerFailure(errorMessage));
  }
}
function* handleLogout() {
  try {
    yield call(logoutAPI);
  } catch (error) {
    console.error('Logout API failed:', error);
  } finally {
    eraseCookie('shop.rfc7519');
    eraseCookie('shop.rfc7519_refresh_token');
    eraseCookie('shop.user');
  }
}

export default function* authSaga() {
  yield takeLatest(loginRequest, handleLogin);
  yield takeLatest(registerRequest, handleRegister);
  yield takeLatest(logout, handleLogout);
}
