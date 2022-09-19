import { Column, Entity, OneToMany } from 'typeorm';

import { BaseEntity } from './base.entity';
import { Todo } from './todo.entity';
import { UserRole } from '../enums';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ enum: UserRole, default: UserRole.USER })
  role: string;

  @OneToMany(() => Todo, todo => todo.user, {
    cascade: ['insert', 'update', 'remove'],
  })
  todos: Todo[];
}
