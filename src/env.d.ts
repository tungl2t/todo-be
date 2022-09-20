declare global {
  namespace NodeJS {
    interface ProcessEnv {
      HOST: string;
      PORT: string;
      DATABASE_HOST: string;
      DATABASE_NAME: string;
      DATABASE_USERNAME: string;
      DATABASE_PASSWORD: string;
      JWT_PRIVATE_KEY: string;
      JWT_EXPIRED_TIME: string;
      JWT_REFRESH_TOKEN_SECRET_KEY: string;
      JWT_REFRESH_TOKEN_EXPIRED_TIME: string;
      REDIS_HOST: string;
      REDIS_PORT: string;
      CORS_ORIGIN: string;
    }
  }
}

export {}
