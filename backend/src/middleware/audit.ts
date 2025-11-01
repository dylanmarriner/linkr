import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

const prisma = new PrismaClient();

type RequestWithUser = Request & {
  user?: {
    id?: string | null;
  };
};

export async function auditMiddleware(
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) {
  res.on('finish', async () => {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id ?? null,
        actorIp: req.ip,
        action: `${req.method} ${req.originalUrl}`,
        meta: { status: res.statusCode }
      }
    });
  });
  next();
}
