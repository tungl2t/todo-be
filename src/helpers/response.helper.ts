import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { ResponseInterface } from '../interfaces';
import { ErrorMessage } from '../enums';

export class ResponseHelper {
  public static handle(res: Response, result: ResponseInterface) {
    return res.status(result.code).json(result);
  }

  public static unauthorized(res: Response, message = ErrorMessage.UNAUTHORIZED) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.UNAUTHORIZED,
      message,
    });
  }

  public static forbidden(res: Response, message = ErrorMessage.FORBIDDEN) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      code: StatusCodes.FORBIDDEN,
      message,
    });
  }

  public static badRequest(res: Response, message = ErrorMessage.BAD_REQUEST) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: StatusCodes.BAD_REQUEST,
      message,
    });
  }
}
