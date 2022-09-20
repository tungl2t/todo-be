import Redis from 'ioredis';
import { env } from '../environment';

export class RedisService {
  private static instance: Redis;

  static getInstance(): Redis {
    if (!RedisService.instance) {
      RedisService.instance = new Redis({
        host: env.REDIS_HOST,
        port: env.REDIS_PORT,
      });
    }
    return RedisService.instance;
  }

  /**
   *
   * @param key
   * @param value
   * @param ttl seconds
   */
  static set(key: string, value: string, ttl: number) {
    const redis = RedisService.getInstance();
    redis.set(key, value);
  }

  static get(key: string) {
    const redis = RedisService.getInstance();
    return redis.get(key);
  }

  static expire(key: string) {
    const redis = RedisService.getInstance();
    redis.expire(key, 0);
  }
}
