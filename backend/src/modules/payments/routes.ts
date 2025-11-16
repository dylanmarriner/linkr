import { Router } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { authenticate, RequestWithAuth, requireRole } from '../../middleware/auth';
import { HttpError } from '../common/httpError';
import { parsePagination } from '../common/pagination';

const router = Router();

const intentSchema = z.object({
  amountCents: z.number().int().positive(),
  currency: z.string().length(3).default('NZD'),
  gateway: z.enum(['manual', 'segpay', 'ccbill']).default('manual'),
  providerId: z.string().optional()
});

const webhookSchema = z.object({
  userId: z.string(),
  providerId: z.string().optional(),
  status: z.string(),
  amountCents: z.number().int(),
  currency: z.string().length(3).default('NZD'),
  externalId: z.string().optional(),
  meta: z.record(z.string(), z.any()).optional()
});

router.post(
  '/intent',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const payload = intentSchema.parse(req.body);
    const transaction = await prisma.paymentTransaction.create({
      data: {
        userId: req.authUser!.id,
        providerId: payload.providerId,
        gateway: payload.gateway.toUpperCase(),
        amountCents: payload.amountCents,
        currency: payload.currency,
        status: 'PENDING'
      }
    });
    res.status(201).json({ transaction });
  })
);

router.get(
  '/transactions',
  authenticate,
  requireRole(Role.ADMIN),
  asyncHandler(async (req, res) => {
    const { take, skip } = parsePagination(req.query);
    const [transactions, total] = await Promise.all([
      prisma.paymentTransaction.findMany({ skip, take, orderBy: { createdAt: 'desc' } }),
      prisma.paymentTransaction.count()
    ]);
    res.json({ data: transactions, pagination: { take, skip, total } });
  })
);

function assertWebhookSecret(secretHeader?: string | string[]) {
  const expected = process.env.PAYMENT_WEBHOOK_SECRET;
  if (!expected) {
    return;
  }
  if (!secretHeader || secretHeader !== expected) {
    throw new HttpError(401, 'Invalid webhook signature');
  }
}

router.post(
  '/webhooks/:processor',
  asyncHandler(async (req, res) => {
    assertWebhookSecret(req.headers['x-webhook-signature']);
    const processor = req.params.processor.toUpperCase();
    if (!['SEGPAY', 'CCBILL'].includes(processor)) {
      throw new HttpError(404, 'Processor not supported');
    }
    const payload = webhookSchema.parse(req.body);
    await prisma.paymentTransaction.create({
      data: {
        userId: payload.userId,
        providerId: payload.providerId,
        gateway: processor,
        amountCents: payload.amountCents,
        currency: payload.currency,
        status: payload.status,
        externalId: payload.externalId,
        meta: payload.meta
      }
    });
    if (payload.status === 'COMPLETED' && payload.providerId) {
      await prisma.payoutAccount.upsert({
        where: { userId: payload.providerId },
        update: { totalPaidCents: { increment: payload.amountCents } },
        create: {
          userId: payload.providerId,
          accountName: 'Auto-generated',
          accountNumber: 'PENDING',
          totalPaidCents: payload.amountCents
        }
      });
    }
    res.json({ received: true });
  })
);

export default router;
