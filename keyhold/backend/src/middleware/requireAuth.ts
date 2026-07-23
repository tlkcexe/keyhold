import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { verifyAccessToken } from '../modules/auth/token.service';
import { AppError } from '../utils/AppError';
import { ACCESS_COOKIE } from '../utils/cookies';

const extractToken = (req: Request): string | null => {
  if (req.cookies?.[ACCESS_COOKIE]) return req.cookies[ACCESS_COOKIE];

  const header = req.headers.authorization;
  if (header?.startsWith('Bearer ')) return header.slice(7);

  return null;
};

/** Verifies the access token and attaches the decoded payload to req.user. */
export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const token = extractToken(req);

  if (!token) {
    return next(AppError.unauthorized('Authentication required', 'NO_TOKEN'));
  }

  try {
    req.user = verifyAccessToken(token);
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(AppError.unauthorized('Access token expired', 'TOKEN_EXPIRED'));
    }
    next(AppError.unauthorized('Invalid access token', 'TOKEN_INVALID'));
  }
};
