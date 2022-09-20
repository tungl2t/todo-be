import { AppDataSource } from '../data-source';
import { Todo } from '../entities';
import { BaseService } from './base.service';
import { StatusCodes } from 'http-status-codes';
import { ErrorMessage } from '../enums';
import { UserService } from './user.service';

export class TodoService extends BaseService<Todo> {
  private static instance: TodoService;
  private todoRepository = AppDataSource.getRepository(Todo);

  constructor() {
    super();
    this.repository = this.todoRepository;
  }

  static getInstance(): TodoService {
    if (!TodoService.instance) {
      TodoService.instance = new TodoService();
    }
    return TodoService.instance;
  }

  async findByUserId(userId: number) {
    try {
      const result = await this.repository.find({
        relations: ['user'],
        where: {
          user: {
            id: userId,
          },
        },
      });
      return {
        code: StatusCodes.OK,
        data: result.map((item) => {
          const { id, content, completed } = item;
          return { id, content, completed };
        }),
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async createTodo(userId: number, content: string) {
    try {
      const userService = UserService.getInstance();
      const existedUser = await userService.findOneBy({ id: userId });
      if (!existedUser) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: ErrorMessage.NOT_FOUND_USER,
        };
      }
      const newTodo = new Todo();
      newTodo.content = content;
      newTodo.user = existedUser;
      const { id, completed } = await this.repository.save(newTodo);
      return {
        code: StatusCodes.CREATED,
        data: { id, content, completed },
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async setCompletedTodo(userId: number, todoId: number) {
    try {
      const userService = UserService.getInstance();
      const existedUser = await userService.findOneBy({ id: userId });
      if (!existedUser) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: ErrorMessage.NOT_FOUND_USER,
        };
      }
      const existedTodo = await this.repository.findOneBy({ id: todoId });
      if (!existedTodo) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: ErrorMessage.NOT_FOUND_TODO,
        };
      }
      existedTodo.completed = true;
      await this.save(existedTodo);
      return {
        code: StatusCodes.OK,
        data: { id: todoId, completed: true },
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
