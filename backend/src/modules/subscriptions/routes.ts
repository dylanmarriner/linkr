import { Router } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';
import { parsePagination } from '../common/pagination';
import { HttpError } from '../common/httpError';

const router = Router();

const subscriptionSchema = z.object({
  planCode: z.string().min(1),
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default('NZD')
});

router.use(authenticate);

router.get(
  '/',
  asyncHandler(async (req: RequestWithAuth, res) => {
    const subscriptions = await prisma.subscription.findMany({
      where: { userId: req.authUser!.id },
      orderBy: { startedAt: 'desc' }
    });
    res.json({ data: subscriptions });
  })
);

router.get(
  '/admin',
  requireRole(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({ skip, take, orderBy: { startedAt: 'desc' } }),
      prisma.subscription.count()
    ]);
    res.json({ data: subscriptions, pagination: { take, skip, total } });
  })
);

router.post(
  '/',
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = subscriptionSchema.parse(req.body);
    const subscription = await prisma.subscription.create({
      data: {
        userId: req.authUser!.id,
        planCode: payload.planCode,
        amountCents: payload.amountCents,
        currency: payload.currency,
        status: 'ACTIVE',
        startedAt: new Date(),
        renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    await prisma.auditLog.create({ data: { userId: req.authUser!.id, action: 'SUBSCRIPTION_CREATED', meta: payload } });
    res.status(201).json({ subscription });
  })
);

router.post(
  '/:id/cancel',
  asyncHandler(async (req: RequestWithAuth, res) => {
    const subscription = await prisma.subscription.findUnique({ where: { id: req.params.id } });
    if (!subscription) {
      throw new HttpError(404, 'Subscription not found');
    }
    if (subscription.userId !== req.authUser!.id && req.authUser!.role !== Role.ADMIN) {
      throw new HttpError(403, 'Forbidden');
    }
    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELED', canceledAt: new Date(), renewsAt: null }
    });
    await prisma.auditLog.create({ data: { userId: subscription.userId, action: 'SUBSCRIPTION_CANCELED' } });
    res.json({ subscription: updated });
  })
);

export default router;
