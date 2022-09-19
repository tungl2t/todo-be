import 'reflect-metadata';
import { RequestHandler } from 'express';

import { MetadataKeys, Methods } from '../enums';

interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

function routeBinder(method: string) {
  return function (path: string) {
    return function (target: any, key: string, desc: RouteHandlerDescriptor) {
      Reflect.defineMetadata(MetadataKeys.path, path, target, key);
      Reflect.defineMetadata(MetadataKeys.method, method, target, key);
    };
  };
}

export const Get = routeBinder(Methods.get);
export const Put = routeBinder(Methods.put);
export const Post = routeBinder(Methods.post);
export const Del = routeBinder(Methods.del);
export const Patch = routeBinder(Methods.patch);
