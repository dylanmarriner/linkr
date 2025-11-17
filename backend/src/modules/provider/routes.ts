import { Router } from 'express';
import { Prisma, Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';
import { parsePagination } from '../common/pagination';

const router = Router();

const profileSchema = z.object({
  displayName: z.string().min(2).max(120),
  bio: z.string().max(4000).nullable().optional(),
  location: z.string().max(120).nullable().optional(),
  rateFrom: z.coerce.number().int().min(0).nullable().optional(),
  rateTo: z.coerce.number().int().min(0).nullable().optional()
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const location = typeof req.query.location === 'string' ? req.query.location : undefined;
    const where: Prisma.ProviderProfileWhereInput = {
      ...(q ? { displayName: { contains: q, mode: Prisma.QueryMode.insensitive } } : {}),
      ...(location ? { location: { contains: location, mode: Prisma.QueryMode.insensitive } } : {})
    };
    const [data, total] = await Promise.all([
      prisma.providerProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { media: { where: { isPublic: true } } }
      }),
      prisma.providerProfile.count({ where })
    ]);
    res.json({ data, pagination: { total, take, skip } });
  })
);

router.get(
  '/me',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const profile = await prisma.providerProfile.findUnique({ where: { userId: req.authUser!.id }, include: { media: true } });
    if (!profile) {
      throw new HttpError(404, 'Profile missing');
    }
    res.json({ profile });
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const provider = await prisma.providerProfile.findUnique({
      where: { id: req.params.id },
      include: { media: true, user: { select: { role: true, createdAt: true } } }
    });
    if (!provider) {
      throw new HttpError(404, 'Provider not found');
    }
    res.json({ provider });
  })
);

router.put(
  '/me',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = profileSchema.partial().parse(req.body);
    const profile = await prisma.providerProfile.upsert({
      where: { userId: req.authUser!.id },
      update: payload,
      create: {
        userId: req.authUser!.id,
        displayName: payload.displayName ?? 'New Provider',
        bio: payload.bio ?? undefined,
        location: payload.location ?? undefined,
        rateFrom: payload.rateFrom ?? undefined,
        rateTo: payload.rateTo ?? undefined
      }
    });
    res.json({ profile });
  })
);

router.post(
  '/me/verify',
  authenticate,
  requireRole(Role.PROVIDER),
  asyncHandler(async (req: RequestWithAuth, res) => {
    await prisma.verification.create({
      data: {
        userId: req.authUser!.id,
        status: 'PENDING',
        method: 'MANUAL',
        evidence: req.body?.evidence ?? null
      }
    });
    res.status(202).json({ ok: true });
  })
);

export default router;
