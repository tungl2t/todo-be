import { compare, genSalt, hash } from 'bcryptjs';
import { StatusCodes } from 'http-status-codes';

import { AppDataSource } from '../data-source';
import { User } from '../entities';
import { BaseService } from './base.service';
import { CreateUserDto, RefreshTokenDto } from '../dtos';
import { env } from '../environment';
import { TokenHelper } from '../helpers';
import { ErrorMessage } from '../enums';
import { RedisService } from './redis.service';
import { PREFIX_REFRESH_TOKEN_KEY } from '../constants';

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
          message: ErrorMessage.EXISTED_EMAIL,
        };
      }
      const newUser = new User();
      newUser.email = email;
      const salt = await genSalt(10);
      newUser.password = await hash(password, salt);
      const { id, updatedAt, createdAt } = await this.repository.save(newUser);
      return {
        code: StatusCodes.CREATED,
        data: { id, email, updatedAt, createdAt },
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
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
          message: ErrorMessage.NOT_FOUND_USER,
        };
      }
      const { id, role } = existedUser;
      const isMatch = await compare(password, existedUser.password);
      if (!isMatch) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: ErrorMessage.INVALID_CREDENTIAL,
        };
      }
      const payload = {
        userId: id,
        email,
        role,
      };

      const accessToken = TokenHelper.jwtEncrypt(payload, {
        secretKey: env.JWT_PRIVATE_KEY,
        expiredIn: env.JWT_EXPIRED_TIME,
      });

      const refreshToken = TokenHelper.jwtEncrypt(
        { email },
        {
          secretKey: env.JWT_REFRESH_TOKEN_SECRET_KEY,
          expiredIn: env.JWT_REFRESH_TOKEN_EXPIRED_TIME,
        },
      );

      const redisKey = `${PREFIX_REFRESH_TOKEN_KEY}${id}:refreshToken:${refreshToken}`;
      RedisService.set(redisKey, refreshToken, env.JWT_REFRESH_TOKEN_EXPIRED_TIME);

      return {
        code: StatusCodes.OK,
        accessToken,
        refreshToken,
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async refreshToken(dto: RefreshTokenDto) {
    try {
      const { email, refreshToken } = dto;
      const existedUser = await this.repository.findOneBy({ email });
      if (!existedUser) {
        return {
          code: StatusCodes.NOT_FOUND,
          message: ErrorMessage.NOT_FOUND_USER,
        };
      }
      const { id, role } = existedUser;
      const redisKey = `${PREFIX_REFRESH_TOKEN_KEY}${id}:refreshToken:${refreshToken}`;
      const existedRefreshToken = await RedisService.get(redisKey);

      if (existedRefreshToken !== refreshToken) {
        return {
          code: StatusCodes.BAD_REQUEST,
          message: ErrorMessage.INVALID_REFRESH_TOKEN,
        };
      }

      const payload = {
        userId: id,
        email,
        role,
      };
      const accessToken = TokenHelper.jwtEncrypt(payload, {
        secretKey: env.JWT_PRIVATE_KEY,
        expiredIn: env.JWT_EXPIRED_TIME,
      });
      const newRefreshToken = TokenHelper.jwtEncrypt(
        { email },
        {
          secretKey: env.JWT_REFRESH_TOKEN_SECRET_KEY,
          expiredIn: env.JWT_REFRESH_TOKEN_EXPIRED_TIME,
        },
      );
      const newRedisKey = `${PREFIX_REFRESH_TOKEN_KEY}${id}:refreshToken:${newRefreshToken}`;
      RedisService.set(newRedisKey, newRefreshToken, env.JWT_REFRESH_TOKEN_EXPIRED_TIME);
      RedisService.expire(redisKey);
      return {
        code: StatusCodes.OK,
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (e) {
      return {
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: ErrorMessage.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
