export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface ApiErrorShape {
  message: string;
  code?: string;
  details?: { field: string; message: string }[];
}
