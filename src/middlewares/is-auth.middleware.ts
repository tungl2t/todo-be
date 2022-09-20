import { NextFunction, Request, Response } from 'express';

import { env } from '../environment';
import { ResponseHelper, TokenHelper } from '../helpers';

declare global {
  namespace Express {
    interface Request {
      userId: number;
      role: string;
    }
  }
}

export function isAuth(req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;
  if (authorization != null) {
    const token = authorization.split(' ')[1];
    const isVerified = TokenHelper.jwtVerify(token, { secretKey: env.JWT_PRIVATE_KEY });
    if (isVerified) {
      const { userId, role } = TokenHelper.jwtDecrypt(token);
      req.userId = userId;
      req.role = role;
      next();
      return;
    } else {
      ResponseHelper.unauthorized(res);
    }
  } else {
    ResponseHelper.unauthorized(res);
  }
}
