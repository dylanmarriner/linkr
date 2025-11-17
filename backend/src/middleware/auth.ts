import type { NextFunction, Request, Response } from 'express';
import { Role } from '@prisma/client';
import { prisma } from '../modules/common/prisma';
import { HttpError } from '../modules/common/httpError';

export interface RequestWithAuth<TBody = any, TParams = Record<string, string>> extends Request<TParams, any, TBody> {
  authUser?: {
    id: string;
    email: string;
    role: Role;
  };
  sessionId?: string;
}

const SESSION_TTL_HOURS = Number(process.env.SESSION_TTL_HOURS || 24);

async function resolveSession(token: string) {
  const session = await prisma.session.findUnique({ where: { token }, include: { user: true } });
  if (!session || session.expiresAt < new Date()) {
    throw new HttpError(401, 'Session expired');
  }
  return session;
}

export async function authenticate(req: RequestWithAuth, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header) {
      throw new HttpError(401, 'Missing Authorization header');
    }
    const [, token] = header.split(' ');
    if (!token) {
      throw new HttpError(401, 'Invalid Authorization header');
    }
    const session = await resolveSession(token);
    req.authUser = { id: session.user.id, email: session.user.email, role: session.user.role };
    req.sessionId = session.id;
    const nextExpiry = new Date(Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000);
    await prisma.session.update({ where: { id: session.id }, data: { expiresAt: nextExpiry } });
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRole(...roles: Role[]) {
  return (req: RequestWithAuth, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      return next(new HttpError(401, 'Not authenticated'));
    }
    if (roles.length && !roles.includes(req.authUser.role)) {
      return next(new HttpError(403, 'Forbidden'));
    }
    return next();
  };
}
