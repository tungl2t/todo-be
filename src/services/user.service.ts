import { compare, genSalt, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

import { AppDataSource } from '../data-source';
import { User } from '../entities';
import { BaseService } from './base.service';
import { CreateUserDto } from '../dtos';
import { JWT_ALGORITHM, JWT_EXPIRED_TIME, JWT_PRIVATE_KEY } from '../constants';

export class UserService extends BaseService<User> {
  private static instance: UserService;
  private userRepository = AppDataSource.getRepository(User);

  constructor() {
    super();
    this.repository = this.userRepository;
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const { email, password } = createUserDto;
      const existedEmail = await this.repository.findOneBy({ email });
      if (existedEmail) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: 'Email is existed!'
        };
      }
      const newUser = new User();
      newUser.email = email;
      const salt = await genSalt(10);
      newUser.password = await hash(password, salt);
      const { id, updatedAt, createdAt } = await this.repository.save(newUser);
      return {
        code: StatusCodes.CREATED,
        data: { id, email, updatedAt, createdAt }
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!'
      };
    }
  }

  async login(loginDto: CreateUserDto) {
    try {
      const { email, password } = loginDto;
      const existedUser = await this.repository.findOneBy({ email });
      if (!existedUser) {
        return {
          code: StatusCodes.NOT_FOUND,
          message: 'Not found user!',
        };
      }
      const { id, role } = existedUser;
      const isMatch = await compare(password, existedUser.password);
      if (!isMatch) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: 'Invalid credential!',
        };
      }
      const payload = {
        userId: id,
        email,
        role
      };
      const token = jwt.sign(payload, JWT_PRIVATE_KEY, {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_EXPIRED_TIME
      });
      return {
        code: StatusCodes.OK,
        token
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!'
      };
    }
  }
}
