import { Request, Response } from 'express';

import { BodyValidator, Controller, Get, Patch, Post, Use } from '../decorators';
import { isAuth } from '../middlewares';
import { TodoService } from '../services';
import { ResponseHelper } from '../helpers';
import { ErrorMessage } from '../enums';

@Controller('/api/todos')
class TodoController {
  @Get('/')
  @Use(isAuth)
  getListTodos(req: Request, res: Response): void {
    const todoService = TodoService.getInstance();
    todoService.findByUserId(req.userId).then((result) => {
      return ResponseHelper.handle(res, result);
    });
  }

  @Post('/')
  @Use(isAuth)
  @BodyValidator('content')
  createTodo(req: Request, res: Response) {
    const todoService = TodoService.getInstance();
    const { content } = req.body;
    const trimmedContent = content?.trim() ?? '';
    if (!trimmedContent) {
      return ResponseHelper.badRequest(res, ErrorMessage.INVALID_CONTENT);
    }
    todoService.createTodo(req.userId, req.body.content).then((result) => {
      return ResponseHelper.handle(res, result);
    });
  }

  @Patch('/:todoId/completed')
  @Use(isAuth)
  setCompletedTodo(req: Request, res: Response) {
    const todoService = TodoService.getInstance();
    const { todoId } = req.params;
    todoService.setCompletedTodo(req.userId, Number(todoId)).then((result) => {
      ResponseHelper.handle(res, result);
    });
  }
}
