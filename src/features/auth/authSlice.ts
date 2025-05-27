import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCookie } from "@/utils/storageManager";
import type {
  AuthState,
  User,
  LoginPayload,
  RegisterPayload,
} from "./authTypes";

const userCookie = getCookie("shop.user");
const token = getCookie("shop.rfc7519") || null;
const refreshToken = getCookie("shop.rfc7519_refresh_token") || null;
const user = userCookie ? (JSON.parse(userCookie) as User) : null;

const initialState: AuthState = {
  token,
  refreshToken,
  user,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loginRequest(state, _action: PayloadAction<LoginPayload>) {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    loginSuccess(
      state,
      action: PayloadAction<{ token: string; user: User; refreshToken: string }>
    ) {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    loginFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.successMessage = null;
    },
    logout(state) {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      state.successMessage = null;
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    registerRequest(state, _action: PayloadAction<RegisterPayload>) {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    },
    registerSuccess(
      state,
      action: PayloadAction<{ message: string; user: User }>
    ) {
      state.loading = false;
      state.user = action.payload.user;
      state.successMessage = action.payload.message || 'Registration successful!';
      state.error = null; // clear error on success
    },
    registerFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
      state.successMessage = null; // clear success message on failure
      state.user = null; // clear user on failure just in case
    },
    clearError(state) {
      state.error = null;
      // Also clear success message when clearing errors (optional)
      state.successMessage = null;
    },
    clearSuccessMessage(state) {
      state.successMessage = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  logout,
  registerRequest,
  registerSuccess,
  registerFailure,
  clearError,
  clearSuccessMessage,
} = authSlice.actions;

export default authSlice.reducer;
