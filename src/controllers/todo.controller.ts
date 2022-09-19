import { Request, Response } from 'express';

import { Controller, Get, Post, Use } from '../decorators';
import { isAuth } from '../middlewares';

@Controller('/api/todos')
class TodoController {
  @Get('/')
  @Use(isAuth)
  getListTodos(req: Request, res: Response): void {
    res.send({ status: 200, message: 'Hello' });
  }

  @Post('/')
  @Use(isAuth)
  createTodo(req: Request, res: Response): void {
    res.send({ status: 200, message: 'Hello' });
  }
}
