import { StatusCodes } from 'http-status-codes';

export interface IResponse {
  code: StatusCodes;
  message?: string;
  data?: Record<string, any> | Array<Record<string, any>>;
}
