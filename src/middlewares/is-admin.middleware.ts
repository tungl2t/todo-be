import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export function isAdmin(req: Request, res: Response, next: NextFunction): void {
  if (req.session) {
    next();
    return;
  }

  res.status(StatusCodes.FORBIDDEN);
  res.send('Forbidden');
}
