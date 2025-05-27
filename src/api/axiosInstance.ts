// src/api/axiosInstance.ts
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { jwtDecode } from "jwt-decode";
import { eraseCookie, getCookie, setCookie } from "@/utils/storageManager";

import type { DecodedToken, User } from "../features/auth/authTypes";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

axiosInstance.interceptors.request.use(
  async (request) => {
    const accessToken = getCookie("shop.rfc7519");
    const refreshToken = getCookie("shop.rfc7519_refresh_token");

    if (request.url?.includes("/auth/refresh")) {
      request.headers.Authorization = `Bearer ${refreshToken}`;
    } else {
      request.headers.Authorization = `Bearer ${accessToken}`;
    }

    return request;
  },
  (error) => Promise.reject(error)
);

const refreshAuthLogic = async (failedRequest: {
  response: { config: { headers: { Authorization: string } } };
}) => {
  const refreshToken = getCookie("shop.rfc7519_refresh_token");

  if (!refreshToken) {
    forceLogout();
    return Promise.resolve();
  }

  try {
    const decoded: DecodedToken = jwtDecode(refreshToken);
    const now = Math.floor(Date.now() / 1000);

    if (decoded.exp > now) {
      const response = await axiosInstance.post("/auth/refresh");
      const data = response.data;

      const minutesLeft = Math.floor((decoded.exp - now) / 60);

      setCookie("shop.rfc7519", data.accessToken, minutesLeft);
      setCookie("shop.rfc7519_refresh_token", refreshToken, minutesLeft);

      const userCookie = getCookie("shop.user");
      const user = userCookie ? (JSON.parse(userCookie) as User) : null;

      if (user) {
        setCookie("shop.user", JSON.stringify(user), minutesLeft);
      }

      failedRequest.response.config.headers.Authorization = `Bearer ${data.accessToken}`;
      return Promise.resolve();
    } else {
      forceLogout();
      return Promise.resolve();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    forceLogout();
    return Promise.resolve();
  }
};

const forceLogout = () => {
  eraseCookie("shop.rfc7519");
  eraseCookie("shop.rfc7519_refresh_token");
  eraseCookie("shop.user");
  window.location.href = "/login"; // 🔄 Redirect and refresh the page
};

createAuthRefreshInterceptor(axiosInstance, refreshAuthLogic);

export default axiosInstance;
