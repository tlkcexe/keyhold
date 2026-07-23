import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { catchAsync } from '../../utils/catchAsync';
import * as authService from './auth.service';
import { signAccessToken } from './token.service';
import {
  issueRefreshToken,
  rotateRefreshToken,
  revokeRefreshToken,
} from './refreshToken.service';
import { setAuthCookies, clearAuthCookies, REFRESH_COOKIE } from '../../utils/cookies';
import { AppError } from '../../utils/AppError';
import { prisma } from '../../config/prisma';

const toPublicUser = (user: { id: string; name: string; email: string; role: Role }) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const issueSession = async (
  res: Response,
  user: { id: string; email: string; role: Role },
  meta: { userAgent?: string; ipAddress?: string },
) => {
  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  const { token: refreshToken } = await issueRefreshToken(user.id, meta);
  setAuthCookies(res, accessToken, refreshToken);
  return accessToken;
};

export const register = catchAsync(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const user = await authService.registerUser(name, email, password);

  const accessToken = await issueSession(res, user, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  res.status(201).json({ user: toPublicUser(user), accessToken });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.authenticateUser(email, password);

  const accessToken = await issueSession(res, user, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  res.status(200).json({ user: toPublicUser(user), accessToken });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const presentedToken = req.cookies?.[REFRESH_COOKIE];
  if (!presentedToken) {
    throw AppError.unauthorized('No refresh token provided', 'NO_REFRESH_TOKEN');
  }

  const { newToken, user } = await rotateRefreshToken(presentedToken, {
    userAgent: req.headers['user-agent'],
    ipAddress: req.ip,
  });

  const accessToken = signAccessToken({ sub: user.id, email: user.email, role: user.role });
  setAuthCookies(res, accessToken, newToken);

  res.status(200).json({ accessToken });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const presentedToken = req.cookies?.[REFRESH_COOKIE];
  if (presentedToken) {
    await revokeRefreshToken(presentedToken);
  }
  clearAuthCookies(res);
  res.status(204).send();
});

export const me = catchAsync(async (req: Request, res: Response) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.user!.sub } });
  res.status(200).json({ user: toPublicUser(user) });
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  // Same response regardless of whether the account exists (prevents
  // email enumeration via response differences).
  res.status(200).json({
    message: 'If an account with that email exists, a reset link has been sent.',
  });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(200).json({ message: 'Password has been reset successfully. Please log in.' });
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user!.sub, currentPassword, newPassword);
  clearAuthCookies(res);
  res.status(200).json({ message: 'Password changed. Please log in again.' });
});
