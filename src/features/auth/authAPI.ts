// src/features/auth/authAPI.ts

import axiosInstance from '../../api/axiosInstance';
import type { LoginPayload, RegisterPayload } from './authTypes';

export const loginAPI = async ({ email, password }: LoginPayload) => {
  const response = await axiosInstance.post(`/auth/login`, { email, password });
  return response.data;
};

export const registerAPI = async ({ name, email, password, address }: RegisterPayload) => {
  const response = await axiosInstance.post(`/auth/register`, {
    name,
    email,
    password,
    address,
  });
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post(`/auth/logout`);
  return response.data;
};
