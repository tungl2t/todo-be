import { Request, Response } from 'express';

import { BodyValidator, Controller, Post } from '../decorators';
import { UserService } from '../services';

@Controller('/api/users')
class UserController {

  @Post('/')
  @BodyValidator('email', 'password')
  async register(req: Request, res: Response) {
    const userService = UserService.getInstance();
    userService.register(req.body)
      .then(result => {
        return res.status(result.code).send(result);
      });

  }
}
