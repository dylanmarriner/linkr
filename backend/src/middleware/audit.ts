import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function auditMiddleware(req, res, next) {
  res.on('finish', async () => {
    await prisma.auditLog.create({
      data: {
        userId: req.user?.id || null,
        actorIp: req.ip,
        action: `${req.method} ${req.originalUrl}`,
        meta: { status: res.statusCode }
      }
    });
  });
  next();
}
