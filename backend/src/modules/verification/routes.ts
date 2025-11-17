import { Router } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';

const router = Router();

const requestSchema = z.object({
  method: z.string().min(2),
  evidence: z.any().optional()
});

const adminDecisionSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
  notes: z.string().max(2000).optional()
});

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const verifications = await prisma.verification.findMany({ where: { userId: req.authUser!.id }, orderBy: { createdAt: 'desc' } });
    res.json({ verifications });
  })
);

router.post(
  '/',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const data = requestSchema.parse(req.body);
    const verification = await prisma.verification.create({
      data: {
        userId: req.authUser!.id,
        status: 'PENDING',
        method: data.method,
        evidence: data.evidence ?? null
      }
    });
    res.status(201).json({ verification });
  })
);

router.patch(
  '/:id',
  authenticate,
  requireRole(Role.ADMIN),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const data = adminDecisionSchema.parse(req.body);
    const verification = await prisma.verification.update({
      where: { id: req.params.id },
      data: { status: data.status, decidedBy: req.authUser!.id, decidedAt: new Date(), notes: data.notes }
    });
    res.json({ verification });
  })
);

router.post(
  '/jumio/callback',
  asyncHandler(async (req, res) => {
    const payload = req.body as { reference?: string; status?: string; userId?: string };
    if (!payload.userId || !payload.status) {
      throw new HttpError(400, 'Invalid callback payload');
    }
    await prisma.verification.updateMany({
      where: { userId: payload.userId, method: 'JUMIO', status: 'PENDING' },
      data: { status: payload.status?.toUpperCase() === 'APPROVED' ? 'APPROVED' : 'REVIEW', decidedAt: new Date() }
    });
    res.json({ ok: true });
  })
);

export default router;
