import express from 'express';
import bodyParser from 'body-parser';

import { AppDataSource } from './data-source';
import { AppRouter } from './app-router';
import './controllers';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

AppDataSource.initialize().then(async () => {
  const app = express();
  app.use(bodyParser.json());
  app.use(AppRouter.getInstance());
  app.listen(PORT, () => {
    console.log(`Server listen on port ${PORT}`);
  })
});

