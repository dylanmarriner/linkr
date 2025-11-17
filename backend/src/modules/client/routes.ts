import { Router } from 'express';
import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';

const router = Router();

const preferencesSchema = z.object({
  preferences: z.record(z.string(), z.unknown()).optional()
});

const favoriteSchema = z.object({ providerId: z.string().min(1) });

router.get(
  '/me',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const profile = await prisma.clientProfile.findUnique({ where: { userId: req.authUser!.id } });
    if (!profile) {
      throw new HttpError(404, 'Profile missing');
    }
    res.json({ profile });
  })
);

router.put(
  '/me',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = preferencesSchema.parse(req.body);
    const profile = await prisma.clientProfile.upsert({
      where: { userId: req.authUser!.id },
      update: { preferences: (payload.preferences ?? undefined) as Prisma.InputJsonValue | undefined },
      create: {
        userId: req.authUser!.id,
        favorites: [],
        preferences: (payload.preferences ?? undefined) as Prisma.InputJsonValue | undefined
      }
    });
    res.json({ profile });
  })
);

router.post(
  '/favorites',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const { providerId } = favoriteSchema.parse(req.body);
    const provider = await prisma.providerProfile.findUnique({ where: { id: providerId } });
    if (!provider) {
      throw new HttpError(404, 'Provider not found');
    }
    const profile = await prisma.clientProfile.upsert({
      where: { userId: req.authUser!.id },
      update: {},
      create: { userId: req.authUser!.id, favorites: [] }
    });
    const favorites = profile.favorites.includes(providerId)
      ? profile.favorites
      : [...profile.favorites, providerId];
    const updated = await prisma.clientProfile.update({ where: { id: profile.id }, data: { favorites } });
    res.json({ favorites: updated.favorites });
  })
);

router.delete(
  '/favorites/:providerId',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const providerId = req.params.providerId;
    const profile = await prisma.clientProfile.findUnique({ where: { userId: req.authUser!.id } });
    if (!profile) {
      throw new HttpError(404, 'Profile missing');
    }
    const favorites = profile.favorites.filter((fav) => fav !== providerId);
    await prisma.clientProfile.update({ where: { id: profile.id }, data: { favorites } });
    res.json({ favorites });
  })
);

router.get(
  '/favorites',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const profile = await prisma.clientProfile.findUnique({ where: { userId: req.authUser!.id } });
    if (!profile) {
      throw new HttpError(404, 'Profile missing');
    }
    const providers = await prisma.providerProfile.findMany({ where: { id: { in: profile.favorites } }, include: { media: true } });
    res.json({ favorites: providers });
  })
);

export default router;
