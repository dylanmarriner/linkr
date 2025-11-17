import { Router } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticator } from 'otplib';
import { Role, Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../common/prisma';
import { asyncHandler } from '../common/asyncHandler';
import { HttpError } from '../common/httpError';
import { authenticate, RequestWithAuth } from '../../middleware/auth';
import { createSession } from '../common/session';

const router = Router();
const PASSWORD_RESET_TTL_MINUTES = Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES || 15);
const EMAIL_VERIFY_TTL_MINUTES = Number(process.env.EMAIL_VERIFY_TOKEN_TTL_MINUTES || 30);

type UserWithRelations = Prisma.UserGetPayload<{
  include: {
    providerProfile: { include: { media: true } };
    clientProfile: true;
    subscriptions: true;
  };
}>;

type SanitizableUser = { hash?: string | null; twoFactorSecret?: string | null } & Record<string, unknown>;

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).default(Role.CLIENT),
  profile: z
    .object({
      displayName: z.string().min(2).max(120).optional(),
      location: z.string().max(120).optional(),
      bio: z.string().max(2000).optional()
    })
    .optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  twoFactorCode: z.string().length(6).optional()
});

const refreshSchema = z.object({ token: z.string().min(10) });

const passwordResetRequestSchema = z.object({ email: z.string().email() });
const resetPasswordSchema = z.object({ token: z.string().min(10), password: z.string().min(8) });
const twoFactorCodeSchema = z.object({ code: z.string().length(6) });

const updatePreferencesSchema = z.object({
  profile: z
    .object({
      displayName: z.string().min(2).max(120).optional(),
      bio: z.string().max(4000).optional(),
      location: z.string().max(120).optional(),
      rateFrom: z.coerce.number().int().min(0).nullable().optional(),
      rateTo: z.coerce.number().int().min(0).nullable().optional()
    })
    .optional()
});

function sanitizeUser<T extends SanitizableUser>(user: T) {
  const { hash, twoFactorSecret, ...safe } = user;
  return safe;
}

async function createVerificationToken(userId: string, type: string, ttlMinutes: number, meta?: Prisma.InputJsonValue) {
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
  await prisma.verificationToken.create({ data: { userId, type, token, expiresAt, meta } });
  return token;
}

async function consumeVerificationToken(token: string, type: string) {
  const record = await prisma.verificationToken.findUnique({ where: { token } });
  if (!record || record.type !== type) {
    throw new HttpError(400, 'Invalid token');
  }
  if (record.consumedAt) {
    throw new HttpError(400, 'Token already used');
  }
  if (record.expiresAt < new Date()) {
    throw new HttpError(400, 'Token expired');
  }
  await prisma.verificationToken.update({ where: { id: record.id }, data: { consumedAt: new Date() } });
  return record;
}

async function ensureDefaultProfiles(userId: string, role: Role, profileInput?: { displayName?: string; location?: string; bio?: string }) {
  if (role === Role.PROVIDER) {
    await prisma.providerProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: profileInput?.displayName ?? 'New Provider',
        location: profileInput?.location,
        bio: profileInput?.bio
      },
      update: {}
    });
  }
  if (role === Role.CLIENT) {
    await prisma.clientProfile.upsert({
      where: { userId },
      create: { userId, favorites: [] },
      update: {}
    });
  }
}

router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new HttpError(409, 'Email already registered');
    }
    const hash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({ data: { email: data.email, hash, role: data.role } });
    await ensureDefaultProfiles(user.id, data.role, data.profile);
    await prisma.auditLog.create({ data: { userId: user.id, action: 'USER_REGISTERED' } });
    const session = await createSession(user.id);
    res.status(201).json({ token: session.token, user: sanitizeUser(user) });
  })
);

router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !(await bcrypt.compare(data.password, user.hash))) {
      throw new HttpError(401, 'Invalid credentials');
    }
    if (user.twoFactorEnabled) {
      if (!data.twoFactorCode || !user.twoFactorSecret) {
        throw new HttpError(401, 'Two-factor authentication required');
      }
      const validCode = authenticator.verify({ token: data.twoFactorCode, secret: user.twoFactorSecret });
      if (!validCode) {
        throw new HttpError(401, 'Invalid 2FA code');
      }
    }
    const session = await createSession(user.id);
    res.json({ token: session.token, user: sanitizeUser(user) });
  })
);

router.post(
  '/refresh',
  asyncHandler(async (req, res) => {
    const { token } = refreshSchema.parse(req.body);
    const existing = await prisma.session.findUnique({ where: { token } });
    if (!existing || existing.expiresAt < new Date()) {
      throw new HttpError(401, 'Session expired');
    }
    await prisma.session.delete({ where: { id: existing.id } });
    const session = await createSession(existing.userId);
    res.json({ token: session.token });
  })
);

router.post(
  '/logout',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    if (req.sessionId) {
      await prisma.session.delete({ where: { id: req.sessionId } }).catch(() => undefined);
    }
    res.json({ ok: true });
  })
);

router.get(
  '/me',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const user = await prisma.user.findUnique({
      where: { id: req.authUser!.id },
      include: {
        providerProfile: { include: { media: true } },
        clientProfile: true,
        subscriptions: true
      }
    });
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.json({ user: sanitizeUser(user) });
  })
);

router.post(
  '/request-password-reset',
  asyncHandler(async (req, res) => {
    const { email } = passwordResetRequestSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = await createVerificationToken(user.id, 'PASSWORD_RESET', PASSWORD_RESET_TTL_MINUTES);
      return res.json({ token });
    }
    res.json({ token: null });
  })
);

router.post(
  '/reset-password',
  asyncHandler(async (req, res) => {
    const data = resetPasswordSchema.parse(req.body);
    const verification = await consumeVerificationToken(data.token, 'PASSWORD_RESET');
    const hash = await bcrypt.hash(data.password, 12);
    await prisma.user.update({ where: { id: verification.userId }, data: { hash } });
    res.json({ ok: true });
  })
);

router.post(
  '/request-email-verification',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const token = await createVerificationToken(req.authUser!.id, 'EMAIL_VERIFY', EMAIL_VERIFY_TTL_MINUTES);
    res.json({ token });
  })
);

router.post(
  '/verify-email',
  asyncHandler(async (req, res) => {
    const { token } = refreshSchema.parse(req.body);
    const verification = await consumeVerificationToken(token, 'EMAIL_VERIFY');
    await prisma.user.update({ where: { id: verification.userId }, data: { emailVerifiedAt: new Date() } });
    res.json({ ok: true });
  })
);

router.post(
  '/2fa/setup',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const secret = authenticator.generateSecret();
    const otpauth = authenticator.keyuri(req.authUser!.email, 'Linkr', secret);
    await prisma.user.update({ where: { id: req.authUser!.id }, data: { twoFactorSecret: secret } });
    res.json({ secret, otpauth });
  })
);

router.post(
  '/2fa/enable',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const { code } = twoFactorCodeSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
    if (!user?.twoFactorSecret) {
      throw new HttpError(400, '2FA not initialized');
    }
    if (!authenticator.verify({ token: code, secret: user.twoFactorSecret })) {
      throw new HttpError(400, 'Invalid 2FA code');
    }
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } });
    res.json({ ok: true });
  })
);

router.post(
  '/2fa/disable',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const { code } = twoFactorCodeSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
    if (!user?.twoFactorSecret) {
      throw new HttpError(400, '2FA not initialized');
    }
    if (!authenticator.verify({ token: code, secret: user.twoFactorSecret })) {
      throw new HttpError(400, 'Invalid 2FA code');
    }
    await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: false, twoFactorSecret: null } });
    res.json({ ok: true });
  })
);

router.put(
  '/me',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const data = updatePreferencesSchema.parse(req.body);
    if (!data.profile) {
      return res.json({ ok: true });
    }
    const user = await prisma.user.findUnique({ where: { id: req.authUser!.id }, include: { providerProfile: true } });
    if (!user?.providerProfile) {
      throw new HttpError(400, 'No provider profile to update');
    }
    const updated = await prisma.providerProfile.update({
      where: { id: user.providerProfile.id },
      data: data.profile
    });
    res.json({ profile: updated });
  })
);

router.delete(
  '/me',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const { password } = z.object({ password: z.string().min(8) }).parse(req.body);
    const user = await prisma.user.findUnique({ where: { id: req.authUser!.id } });
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      throw new HttpError(401, 'Invalid credentials');
    }
    await prisma.user.update({
      where: { id: user.id },
      data: { isActive: false, deleteAfter: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    });
    await prisma.session.deleteMany({ where: { userId: user.id } });
    res.json({ ok: true });
  })
);

router.get(
  '/export',
  authenticate,
  asyncHandler(async (req: RequestWithAuth, res) => {
    const [user, payments, alerts] = await Promise.all([
      prisma.user.findUnique({
        where: { id: req.authUser!.id },
        include: {
          providerProfile: { include: { media: true, reviews: true } },
          clientProfile: true,
          subscriptions: true,
          verifications: true,
          paymentLogs: true
        }
      }),
      prisma.paymentTransaction.findMany({ where: { userId: req.authUser!.id } }),
      prisma.safetyAlert.findMany({ where: { userId: req.authUser!.id } })
    ]);
    if (!user) {
      throw new HttpError(404, 'User not found');
    }
    res.json({ user: sanitizeUser(user as UserWithRelations), payments, alerts });
  })
);

export default router;
