import { Router } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { parsePagination } from '../common/pagination';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';

const router = Router();

const updateStatusSchema = z.object({
  isActive: z.boolean().optional(),
  deleteAfter: z.string().datetime().nullable().optional(),
  emailVerifiedAt: z.string().datetime().nullable().optional()
});

const updateRoleSchema = z.object({
  role: z.nativeEnum(Role)
});

const sanitizeUser = <T extends { hash?: string | null; twoFactorSecret?: string | null }>(user: T) => {
  const { hash, twoFactorSecret, ...rest } = user;
  return rest;
};

router.use(authenticate);

router.get(
  '/',
  requireRole(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const search = typeof req.query.q === 'string' ? req.query.q : undefined;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        where: search
          ? {
              OR: [
                { email: { contains: search, mode: 'insensitive' } },
                { providerProfile: { displayName: { contains: search, mode: 'insensitive' } } }
              ]
            }
          : undefined,
        orderBy: { createdAt: 'desc' },
        include: { providerProfile: true, clientProfile: true, subscriptions: true }
      }),
      prisma.user.count()
    ]);
    res.json({ data: users.map((user) => sanitizeUser(user)), pagination: { total, take, skip } });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req: RequestWithAuth, res) => {
    if (req.authUser!.id !== req.params.id && req.authUser!.role !== Role.ADMIN) {
      throw new HttpError(403, 'Forbidden');
    }
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { providerProfile: true, clientProfile: true, subscriptions: true }
    });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.json({ user: sanitizeUser(user) });
  })
);

router.patch(
  '/:id/status',
  requireRole(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const payload = updateStatusSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data: payload });
    await prisma.auditLog.create({ data: { userId: req.params.id, action: 'STATUS_UPDATE', meta: payload } });
    res.json({ user: sanitizeUser(user) });
  })
);

router.patch(
  '/:id/role',
  requireRole(Role.ADMIN),
  asyncHandler(async (req: RequestWithAuth, res) => {
    if (req.authUser!.id === req.params.id) {
      throw new HttpError(400, 'Cannot change your own role');
    }
    const payload = updateRoleSchema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data: payload });
    await prisma.auditLog.create({ data: { userId: req.params.id, action: 'ROLE_UPDATE', meta: payload } });
    res.json({ user: sanitizeUser(user) });
  })
);

export default router;
