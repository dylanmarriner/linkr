import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth } from '../../middleware/auth';
import { decryptPayload, encryptPayload } from '../common/crypto';

const router = Router();

const alertSchema = z.object({
  level: z.enum(['INFO', 'WARN', 'CRITICAL']).default('INFO'),
  message: z.string().min(5).max(500),
  payload: z.record(z.string(), z.unknown()).optional()
});

router.post(
  '/alerts',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const data = alertSchema.parse(req.body);
    const alert = await prisma.safetyAlert.create({
      data: {
        userId: req.authUser!.id,
        level: data.level,
        message: data.message,
        encryptedPayload: data.payload ? encryptPayload(data.payload) : null
      }
    });
    res.status(201).json({ alertId: alert.id });
  })
);

router.get(
  '/alerts',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const alerts = await prisma.safetyAlert.findMany({ where: { userId: req.authUser!.id }, orderBy: { createdAt: 'desc' } });
    res.json({
      alerts: alerts.map((alert) => ({
        ...alert,
        payload: decryptPayload(alert.encryptedPayload)
      }))
    });
  })
);

router.post(
  '/alerts/:id/ack',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const alert = await prisma.safetyAlert.findUnique({ where: { id: req.params.id } });
    if (!alert || alert.userId !== req.authUser!.id) {
      throw new HttpError(404, 'Alert not found');
    }
    await prisma.safetyAlert.update({ where: { id: alert.id }, data: { acknowledgedAt: new Date() } });
    res.json({ ok: true });
  })
);

export default router;
