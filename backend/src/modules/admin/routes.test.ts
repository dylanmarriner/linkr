import express from 'express';
import request from 'supertest';
import router from './routes';
import { Role } from '@prisma/client';
import { prisma } from '../common/prisma';
import { createSession } from '../common/session';

jest.mock('../common/prisma', () => ({
  prisma: {
    user: { count: jest.fn(), findUnique: jest.fn() },
    providerProfile: { count: jest.fn() },
    subscription: { count: jest.fn() },
    safetyAlert: { count: jest.fn() },
    paymentTransaction: { aggregate: jest.fn() },
    auditLog: { findMany: jest.fn(), count: jest.fn(), create: jest.fn() }
  }
}));

const mockPrisma = prisma as unknown as {
  user: { count: jest.Mock; findUnique: jest.Mock };
  providerProfile: { count: jest.Mock };
  subscription: { count: jest.Mock };
  safetyAlert: { count: jest.Mock };
  paymentTransaction: { aggregate: jest.Mock };
  auditLog: { findMany: jest.Mock; count: jest.Mock; create: jest.Mock };
};

jest.mock('../common/session', () => ({ createSession: jest.fn() }));

const createSessionMock = createSession as jest.Mock;

jest.mock('../../middleware/auth', () => ({
  authenticate: (req: any, _res: any, next: () => void) => {
    req.authUser = { id: 'admin-1', email: 'admin@example.com', role: Role.ADMIN };
    next();
  },
  requireRole: () => (_req: any, _res: any, next: () => void) => next()
}));

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use(router);
  return app;
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('summarises platform metrics for the overview route', async () => {
  (mockPrisma.user.count as jest.Mock).mockResolvedValue(42);
  (mockPrisma.providerProfile.count as jest.Mock).mockResolvedValue(10);
  (mockPrisma.subscription.count as jest.Mock).mockResolvedValue(7);
  (mockPrisma.safetyAlert.count as jest.Mock).mockResolvedValue(3);
  (mockPrisma.paymentTransaction.aggregate as jest.Mock).mockResolvedValue({ _sum: { amountCents: 123_456 } });

  const response = await request(buildApp()).get('/overview').expect(200);

  expect(response.body.overview).toEqual(
    expect.objectContaining({
      userCount: 42,
      providerCount: 10,
      subscriptionCount: 7,
      openAlerts: 3,
      revenueCents: 123456
    })
  );
});

it('allows admins to create impersonation sessions', async () => {
  const expiresAt = new Date();
  (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'user-5' });
  createSessionMock.mockResolvedValue({ token: 'session-token', expiresAt });

  await request(buildApp()).post('/impersonations/user-5').expect(201);

  expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-5' } });
  expect(createSessionMock).toHaveBeenCalledWith('user-5');
  expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
    data: { userId: 'user-5', action: 'ADMIN_IMPERSONATION' }
  });
});
