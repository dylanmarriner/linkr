import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { json } from 'body-parser';

export function createServer() {
  const app = express();
  app.use(helmet());
  app.use(cors());
  app.use(json());
  app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

  app.get('/health', (_req, res) => res.json({ ok: true }));
  return app;
}
