import express, { NextFunction, Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerDoc from './swagger.json';
import Sentry from './lib/sentry';
import router from './routes';

const app = express();

app.use(Sentry.Handlers.requestHandler());
app.use(express.json());
app.use('/users', router);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use(Sentry.Handlers.errorHandler())
app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
  }
  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : 'Something went wrong, please try again later.';
  res.status(statusCode);
  res.json({ message, success: false });
});

export default app;
