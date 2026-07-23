import { CookieOptions, Response } from 'express';
import { env, isProd } from '../config/env';
import ms from './ms';

const baseOptions: CookieOptions = {
  httpOnly: true, // inaccessible to JS -> mitigates XSS token theft
  secure: isProd, // HTTPS only in production
  sameSite: env.COOKIE_SAME_SITE,
  path: '/',
};

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';

export const setAuthCookies = (res: Response, accessToken: string, refreshToken: string) => {
  res.cookie(ACCESS_COOKIE, accessToken, {
    ...baseOptions,
    maxAge: ms(env.JWT_ACCESS_EXPIRES_IN),
  });
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseOptions,
    maxAge: ms(env.JWT_REFRESH_EXPIRES_IN),
    path: '/api/auth', // only sent to auth endpoints (refresh, logout) — not the whole API
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(ACCESS_COOKIE, baseOptions);
  res.clearCookie(REFRESH_COOKIE, { ...baseOptions, path: '/api/auth' });
};
