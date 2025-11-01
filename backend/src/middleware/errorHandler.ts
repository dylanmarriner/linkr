import { NextFunction, Request, Response } from 'express';

type HttpError = Error & {
  status?: number;
};

export function errorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('❌', err);
  res.status(err.status ?? 500).json({
    message: err.message || 'Internal Server Error'
  });
}
