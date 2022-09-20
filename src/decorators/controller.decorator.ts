import 'reflect-metadata';
import { NextFunction, Request, RequestHandler, Response } from 'express';

import { AppRouter } from '../app-router';
import { ErrorMessage, MetadataKeys, Methods } from '../enums';
import { StatusCodes } from 'http-status-codes';
import { ResponseHelper } from '../helpers';

function bodyValidators(keys: string): RequestHandler {
  return function (req: Request, res: Response, next: NextFunction) {
    if (!req.body) {
      const result = { code: StatusCodes.UNPROCESSABLE_ENTITY, message: ErrorMessage.INVALID_REQUEST };
      ResponseHelper.handle(res, result);
      return;
    }

    for (let key of keys) {
      if (!req.body[key]) {
        const result = { code: StatusCodes.UNPROCESSABLE_ENTITY, message: `${ErrorMessage.MISSING_PROPERTY} ${key}` };
        ResponseHelper.handle(res, result);
        return;
      }
    }

    next();
  };
}

export function Controller(routePrefix: string) {
  return function (target: Function) {
    const router = AppRouter.getInstance();
    for (let key in target.prototype) {
      const routeHandler = target.prototype[key];
      const path = Reflect.getMetadata(MetadataKeys.path, target.prototype, key);
      const method: Methods = Reflect.getMetadata(MetadataKeys.method, target.prototype, key);
      const middlewares = Reflect.getMetadata(MetadataKeys.middleware, target.prototype, key) || [];
      const requiredBodyProps = Reflect.getMetadata(MetadataKeys.validator, target.prototype, key) || [];

      const validator = bodyValidators(requiredBodyProps);

      if (path) {
        router[method](`${routePrefix}${path}`, ...middlewares, validator, routeHandler);
      }
    }
  };
}
