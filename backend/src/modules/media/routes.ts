import { Router } from 'express';
import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';
import { HttpError } from '../common/httpError';

const router = Router();

const mediaSchema = z.object({
  kind: z.string().min(2),
  path: z.string().min(2),
  isPublic: z.boolean().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

router.get(
  '/me',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const media = await prisma.mediaAsset.findMany({ where: { provider: { userId: req.authUser!.id } } });
    res.json({ media });
  })
);

router.post(
  '/me',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const data = mediaSchema.parse(req.body);
    const profile = await prisma.providerProfile.findUnique({ where: { userId: req.authUser!.id } });
    if (!profile) {
      throw new HttpError(404, 'Provider profile missing');
    }
    const media = await prisma.mediaAsset.create({
      data: {
        providerId: profile.id,
        kind: data.kind,
        path: data.path,
        isPublic: data.isPublic ?? false,
        metadata: (data.metadata ?? undefined) as Prisma.InputJsonValue | undefined
      }
    });
    res.status(201).json({ media });
  })
);

router.delete(
  '/:id',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId: req.authUser!.id } });
    if (!profile) {
      throw new HttpError(404, 'Provider profile missing');
    }
    await prisma.mediaAsset.deleteMany({ where: { id: req.params.id, providerId: profile.id } });
    res.json({ ok: true });
  })
);

export default router;
