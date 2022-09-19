import { Request, Response } from 'express';

import { BodyValidator, Controller, Get, Post, Use } from '../decorators';
import { isAuth } from '../middlewares';
import { UserService } from '../services';

@Controller('/api/auth')
class AuthController {

  @Post('/login')
  @BodyValidator('email', 'password')
  login(req: Request, res: Response): void {
    const userService = UserService.getInstance();
    userService.login(req.body)
      .then(result => {
        return res.status(result.code).send(result);
      });
  }
}
