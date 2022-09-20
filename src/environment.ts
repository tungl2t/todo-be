import 'reflect-metadata';

const dotenv = require('dotenv');
dotenv.config();

export const env = {
  HOST: process.env.HOST,
  PORT: process.env?.PORT ? parseInt(process.env.PORT) : 3000,
  JWT_PRIVATE_KEY: process.env?.JWT_PRIVATE_KEY ?? 'Sup3rS3cr3tK3y!!!',
  JWT_EXPIRED_TIME: process.env?.JWT_EXPIRED_TIME ? parseInt(process.env?.JWT_EXPIRED_TIME) : 604800, // 7 days
  JWT_REFRESH_TOKEN_SECRET_KEY: process.env?.JWT_REFRESH_TOKEN_SECRET_KEY ?? 'Sup3rS3cr3tK3yR3fr3shTok3n!!!',
  JWT_REFRESH_TOKEN_EXPIRED_TIME: process.env?.JWT_REFRESH_TOKEN_EXPIRED_TIME
    ? parseInt(process.env?.JWT_REFRESH_TOKEN_EXPIRED_TIME)
    : 2592000, // 30 days
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_HOST,
  DATABASE_USERNAME: process.env.DATABASE_USERNAME,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env?.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
};
