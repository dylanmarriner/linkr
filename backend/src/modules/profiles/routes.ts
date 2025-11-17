import { Router } from 'express';
import { Role, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { parsePagination } from '../common/pagination';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';

const router = Router();

const providerUpdateSchema = z.object({
  displayName: z.string().min(2).max(120).optional(),
  bio: z.string().max(4000).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  rateFrom: z.coerce.number().int().min(0).nullable().optional(),
  rateTo: z.coerce.number().int().min(0).nullable().optional(),
  isVerified: z.boolean().optional()
});

const clientPrefsSchema = z.object({
  favorites: z.array(z.string()).optional(),
  preferences: z.record(z.string(), z.any()).optional()
});

router.get(
  '/providers',
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const verified = req.query.verified === 'true' ? true : req.query.verified === 'false' ? false : undefined;
    const city = typeof req.query.city === 'string' ? req.query.city : undefined;
    const where: Prisma.ProviderProfileWhereInput = {
      ...(verified !== undefined ? { isVerified: verified } : {}),
      ...(city
        ? {
            location: {
              contains: city,
              mode: Prisma.QueryMode.insensitive
            }
          }
        : {})
    };
    const providers = await prisma.providerProfile.findMany({
      skip,
      take,
      where,
      include: { media: { where: { isPublic: true } } },
      orderBy: { createdAt: 'desc' }
    });
    const total = await prisma.providerProfile.count({ where });
    res.json({ data: providers, pagination: { total, take, skip } });
  })
);

router.patch(
  '/providers/:id',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = providerUpdateSchema.parse(req.body);
    const provider = await prisma.providerProfile.findUnique({ where: { id: req.params.id } });
    if (!provider) {
      throw new HttpError(404, 'Provider not found');
    }
    if (req.authUser!.role !== Role.ADMIN && provider.userId !== req.authUser!.id) {
      throw new HttpError(403, 'Forbidden');
    }
    const data = {
      ...payload,
      isVerified: payload.isVerified !== undefined ? payload.isVerified : provider.isVerified
    };
    const updated = await prisma.providerProfile.update({ where: { id: provider.id }, data });
    res.json({ provider: updated });
  })
);

router.get(
  '/clients/:id',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    if (req.authUser!.role !== Role.ADMIN && req.authUser!.id !== req.params.id) {
      throw new HttpError(403, 'Forbidden');
    }
    const client = await prisma.clientProfile.findUnique({ where: { userId: req.params.id } });
    if (!client) {
      throw new HttpError(404, 'Client profile missing');
    }
    res.json({ client });
  })
);

router.put(
  '/clients/me/preferences',
  authenticate,
  requireRole(Role.CLIENT),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = clientPrefsSchema.parse(req.body);
    const client = await prisma.clientProfile.upsert({
      where: { userId: req.authUser!.id },
      update: {
        ...(payload.favorites ? { favorites: payload.favorites } : {}),
        ...(payload.preferences ? { preferences: payload.preferences as Prisma.InputJsonValue } : {})
      },
      create: {
        userId: req.authUser!.id,
        favorites: payload.favorites ?? [],
        preferences: (payload.preferences ?? null) as Prisma.InputJsonValue
      }
    });
    res.json({ client });
  })
);

export default router;
