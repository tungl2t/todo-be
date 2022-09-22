import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { AppDataSource } from './data-source';
import { AppRouter } from './app-router';
import './controllers';
import { env } from './environment';

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(cors({ origin: env.CORS_ORIGIN }));
  app.use(bodyParser.json());
  app.use(AppRouter.getInstance());
  app.listen(env.PORT, () => {
    console.log(`Server listen on port ${env.PORT}`);
  });
});
