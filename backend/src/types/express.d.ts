import { AccessTokenPayload } from '../modules/auth/token.service';

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
