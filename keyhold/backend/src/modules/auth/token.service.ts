import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { Role } from '@prisma/client';

export interface AccessTokenPayload {
  sub: string; // user id
  email: string;
  role: Role;
}

/** Short-lived JWT sent as a Bearer token / access cookie. Stateless — never hits the DB to verify. */
export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN as any });

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
