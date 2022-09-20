import { Request, Response } from 'express';

import { BodyValidator, Controller, Post } from '../decorators';
import { UserService } from '../services';
import { ResponseHelper } from '../helpers';

@Controller('/api/auth')
class AuthController {
  @Post('/login')
  @BodyValidator('email', 'password')
  login(req: Request, res: Response): void {
    const userService = UserService.getInstance();
    userService.login(req.body).then((result) => {
      return ResponseHelper.handle(res, result);
    });
  }

  @Post('/refresh-token')
  @BodyValidator('email', 'refreshToken')
  refresh(req: Request, res: Response): void {
    const userService = UserService.getInstance();
    userService.refreshToken(req.body).then((result) => {
      return ResponseHelper.handle(res, result);
    });
  }
}
