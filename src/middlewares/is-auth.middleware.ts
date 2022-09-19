import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt from 'jsonwebtoken';

import { JWT_ALGORITHM, JWT_PRIVATE_KEY } from '../constants';

declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}


export function isAuth(req: Request, res: Response, next: NextFunction): void {
  const { authorization } = req.headers;
  if (authorization != null) {
    const token = authorization.split(' ')[1];
    try {
      const { userId, role } = jwt.verify(token, JWT_PRIVATE_KEY, { algorithms: [JWT_ALGORITHM] }) as any;
      req.userId = userId;
      req.role = role;
      next();
      return;
    } catch (e) {
      res.status(StatusCodes.UNAUTHORIZED).send({ code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' });
    }
  }
  res.status(StatusCodes.UNAUTHORIZED).send({ code: StatusCodes.UNAUTHORIZED, message: 'Unauthorized' });
}
