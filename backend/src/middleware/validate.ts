import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

/** Validates req.{body,query,params} against a Zod schema, 400s on failure. */
export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({ body: req.body, query: req.query, params: req.params });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const details = err.errors.map((e) => ({
          field: e.path.slice(1).join('.'),
          message: e.message,
        }));
        return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR').withDetails(details));
      }
      next(err);
    }
  };
