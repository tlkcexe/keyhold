/**
 * Operational errors we throw deliberately (bad input, auth failure, etc).
 * The global error handler uses `isOperational` to decide whether it's safe
 * to expose `message` to the client, or whether to hide internals behind a
 * generic 500 response.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;
  public details?: unknown;

  constructor(message: string, statusCode = 400, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }

  /** Attaches extra structured detail (e.g. per-field validation errors). */
  withDetails(details: unknown): this {
    this.details = details;
    return this;
  }

  static badRequest(message: string, code?: string) {
    return new AppError(message, 400, code);
  }
  static unauthorized(message = 'Unauthorized', code?: string) {
    return new AppError(message, 401, code);
  }
  static forbidden(message = 'Forbidden', code?: string) {
    return new AppError(message, 403, code);
  }
  static notFound(message = 'Not found', code?: string) {
    return new AppError(message, 404, code);
  }
  static conflict(message: string, code?: string) {
    return new AppError(message, 409, code);
  }
  static tooMany(message = 'Too many requests', code?: string) {
    return new AppError(message, 429, code);
  }
}
