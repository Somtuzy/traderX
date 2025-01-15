import { Application } from 'express';
import { API_VERSION as apiVersion } from '@configs'
import { serverController } from '@controllers';
import { authRouter, userRouter, serverRouter, investmentRouter, depositRouter, withdrawalRouter } from '.';

export default (app: Application) => {
  app.use(`${apiVersion}/health`, serverController.checkHealth);
  app.use(`${apiVersion}/auth`, authRouter);
  app.use(`${apiVersion}/users`, userRouter);
  app.use(`${apiVersion}/deposits`, depositRouter)
  app.use(`${apiVersion}/withdrawals`, withdrawalRouter)
  app.use(`${apiVersion}/`, investmentRouter);
  app.use(`${apiVersion}`, serverRouter);
  app.use(`/`, serverController.redirectToHome);
};