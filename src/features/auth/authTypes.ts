export interface User {
  id: number;
  name: string;
  email: string;
  address?: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
address?: string;
}

export interface DecodedToken {
  email: string;
  role: string;
  exp: number;
  iat: number;
  id: number;
}