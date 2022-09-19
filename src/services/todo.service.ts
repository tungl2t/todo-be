import { AppDataSource } from '../data-source';
import { Todo } from '../entities';
import { BaseService } from './base.service';

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
}
