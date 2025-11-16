import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';
import { HttpError } from '../common/httpError';
import { Role, Prisma } from '@prisma/client';

const router = Router();

const submissionSchema = z.object({
  documentType: z.string(),
  referenceId: z.string(),
  country: z.string().length(2).optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

const callbackSchema = z.object({
  verificationId: z.string(),
  status: z.enum(['APPROVED', 'REJECTED', 'PENDING']),
  reason: z.string().optional()
});

router.get(
  '/',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const verifications = await prisma.verification.findMany({
      where: { userId: req.authUser!.id, method: 'JUMIO' },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ data: verifications });
  })
);

router.post(
  '/request',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = submissionSchema.parse(req.body);
    const evidence: Prisma.InputJsonValue = {
      documentType: payload.documentType,
      country: payload.country ?? null,
      referenceId: payload.referenceId,
      metadata: payload.metadata ?? null
    };
    const verification = await prisma.verification.create({
      data: {
        userId: req.authUser!.id,
        status: 'PENDING',
        method: 'JUMIO',
        evidence
      }
    });
    res.status(201).json({ verification });
  })
);

router.get(
  '/admin/queue',
  authenticate,
  requireRole(Role.ADMIN),
  asyncHandler(async (_req, res) => {
    const queue = await prisma.verification.findMany({ where: { method: 'JUMIO', status: 'PENDING' }, orderBy: { createdAt: 'asc' } });
    res.json({ data: queue });
  })
);

router.post(
  '/callbacks/jumio',
  asyncHandler(async (req, res) => {
    const token = req.headers['x-jumio-token'];
    const expected = process.env.JUMIO_CALLBACK_TOKEN;
    if (expected && token !== expected) {
      throw new HttpError(401, 'Invalid callback token');
    }
    const payload = callbackSchema.parse(req.body);
    const verification = await prisma.verification.update({
      where: { id: payload.verificationId },
      data: { status: payload.status, notes: payload.reason ?? null, decidedAt: new Date(), decidedBy: 'JUMIO' }
    });
    res.json({ verification });
  })
);

export default router;
