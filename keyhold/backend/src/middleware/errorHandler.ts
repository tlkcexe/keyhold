import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { isProd } from '../config/env';

/** 404 handler for unmatched routes. */
export const notFoundHandler = (req: Request, _res: Response, next: NextFunction) => {
  next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
};

/**
 * Centralized error handler. Operational (AppError) failures return their
 * own message/status. Unexpected errors are logged server-side but only
 * ever return a generic message to the client — we never leak stack
 * traces, SQL errors, or internal details in production.
 */
export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      code: err.code,
      details: err.details,
    });
  }

  console.error('Unhandled error:', err);

  return res.status(500).json({
    message: isProd ? 'Something went wrong. Please try again later.' : String(err),
  });
};
