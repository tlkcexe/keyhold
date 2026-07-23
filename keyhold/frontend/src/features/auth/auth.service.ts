import { api, setAccessToken } from '../../lib/api';
import { AuthResponse, User } from './auth.types';

export const registerRequest = async (name: string, email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  setAccessToken(data.accessToken);
  return data.user;
};

export const loginRequest = async (email: string, password: string) => {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  setAccessToken(data.accessToken);
  return data.user;
};

export const logoutRequest = async () => {
  await api.post('/auth/logout');
  setAccessToken(null);
};

export const fetchCurrentUser = async () => {
  const { data } = await api.get<{ user: User }>('/auth/me');
  return data.user;
};

export const forgotPasswordRequest = async (email: string) => {
  const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return data.message;
};

export const resetPasswordRequest = async (token: string, password: string) => {
  const { data } = await api.post<{ message: string }>('/auth/reset-password', { token, password });
  return data.message;
};

export const changePasswordRequest = async (currentPassword: string, newPassword: string) => {
  const { data } = await api.post<{ message: string }>('/auth/change-password', {
    currentPassword,
    newPassword,
  });
  setAccessToken(null);
  return data.message;
};

export const fetchAllUsers = async () => {
  const { data } = await api.get<{ users: User[] }>('/users');
  return data.users;
};
