import crypto from 'crypto';
import { prisma } from './prisma';

const SESSION_TTL_MS = Number(process.env.SESSION_TTL_HOURS || 24) * 60 * 60 * 1000;

export async function createSession(userId: string) {
  const token = crypto.randomBytes(48).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
  return prisma.session.create({ data: { userId, token, expiresAt } });
}
