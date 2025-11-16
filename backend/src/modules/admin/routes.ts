import { Router } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { parsePagination } from '../common/pagination';
import { authenticate, requireRole } from '../../middleware/auth';
import { createSession } from '../common/session';
import { HttpError } from '../common/httpError';

const router = Router();

router.use(authenticate);
router.use(requireRole(Role.ADMIN));

router.get(
  '/overview',
  asyncHandler(async (_req, res) => {
    const [userCount, providerCount, subscriptionCount, openAlerts] = await Promise.all([
      prisma.user.count(),
      prisma.providerProfile.count({ where: { isVerified: true } }),
      prisma.subscription.count({ where: { status: 'ACTIVE' } }),
      prisma.safetyAlert.count({ where: { acknowledgedAt: null } })
    ]);
    const revenue = await prisma.paymentTransaction.aggregate({ _sum: { amountCents: true }, where: { status: 'COMPLETED' } });
    res.json({
      overview: {
        userCount,
        providerCount,
        subscriptionCount,
        openAlerts,
        revenueCents: revenue._sum.amountCents ?? 0
      }
    });
  })
);

router.get(
  '/audit-logs',
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.auditLog.count()
    ]);
    res.json({ data: logs, pagination: { take, skip, total } });
  })
);

router.post(
  '/impersonations/:userId',
  asyncHandler(async (req, res) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.userId } });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    const session = await createSession(user.id);
    await prisma.auditLog.create({ data: { userId: req.params.userId, action: 'ADMIN_IMPERSONATION' } });
    res.status(201).json({ token: session.token, expiresAt: session.expiresAt });
  })
);

export default router;
