import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';
import router from './routes';
import { HttpError } from './modules/common/httpError';

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

  app.get('/health', (_req: express.Request, res: express.Response) => res.json({ ok: true }));
  app.use('/api', router);

  app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const httpError = err instanceof HttpError ? err : new HttpError(500, 'Unexpected error');
    if (!(err instanceof HttpError)) {
      console.error(err);
    }
    res.status(httpError.status).json({ error: httpError.message, details: httpError.details });
  });

  return app;
}
