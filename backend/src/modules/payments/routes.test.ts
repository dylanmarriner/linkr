import express from 'express';
import request from 'supertest';
import router from './routes';
import { Role } from '@prisma/client';
import { prisma } from '../common/prisma';

jest.mock('../common/prisma', () => ({
  prisma: {
    paymentTransaction: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn()
    },
    payoutAccount: {
      upsert: jest.fn()
    }
  }
}));

jest.mock('../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: () => void) => {
    req.authUser = { id: 'user-1', email: 'test@example.com', role: Role.ADMIN };
    next();
  },
  requireRole: () => (_req: any, _res: any, next: () => void) => next()
}));

const mockPrisma = prisma as unknown as {
  paymentTransaction: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
  };
  payoutAccount: {
    upsert: jest.Mock;
  };
};

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('creates manual payment intents for authenticated users', async () => {
  mockPrisma.paymentTransaction.create.mockResolvedValue({
    id: 'tx_1',
    status: 'PENDING'
  });

  const response = await request(buildApp())
    .post('/intent')
    .send({ amountCents: 2500, currency: 'NZD', gateway: 'manual' })
    .expect(201);

  expect(response.body.transaction.id).toBe('tx_1');
  expect(mockPrisma.paymentTransaction.create).toHaveBeenCalledWith({
    data: expect.objectContaining({ userId: 'user-1', amountCents: 2500, status: 'PENDING' })
  });
});

it('records SegPay webhooks when the signature matches', async () => {
  process.env.PAYMENT_WEBHOOK_SECRET = 'test-secret';
  mockPrisma.paymentTransaction.create.mockResolvedValue({ id: 'tx_2' });

  await request(buildApp())
    .post('/webhooks/segpay')
    .set('x-webhook-signature', 'test-secret')
    .send({
      userId: 'user-99',
      providerId: 'user-1',
      status: 'COMPLETED',
      amountCents: 10000,
      currency: 'NZD',
      externalId: 'segpay_evt'
    })
    .expect(200);

  expect(mockPrisma.paymentTransaction.create).toHaveBeenCalledWith({
    data: expect.objectContaining({ userId: 'user-99', gateway: 'SEGPAY', status: 'COMPLETED' })
  });
  expect(mockPrisma.payoutAccount.upsert).toHaveBeenCalledWith({
    where: { userId: 'user-1' },
    update: { totalPaidCents: { increment: 10000 } },
    create: expect.objectContaining({ userId: 'user-1', totalPaidCents: 10000 })
  });
});
