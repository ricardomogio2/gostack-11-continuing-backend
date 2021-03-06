import 'reflect-metadata';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import '@shared/infra/typeorm';
import '@shared/container';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import routes from './routes';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      console.log(err);
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.log(err);
    return response.status(500).json({
      status: 'error',
      message: 'Internal server Error!',
    });
  },
);

app.listen(3333, () => {
  console.log('💽️ Backend rodando na porta 3333...');
});
