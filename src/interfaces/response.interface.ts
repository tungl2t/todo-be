import { StatusCodes } from 'http-status-codes';

export interface ResponseInterface {
  code: StatusCodes;
  message?: string;
  data?: Record<string, any> | Array<Record<string, any>>;
}
