import { Request, Response, NextFunction } from 'express';

type AuditedRequest = Request & { user?: unknown };

export function audit(req: AuditedRequest, _res: Response, next: NextFunction) {
  const userInfo = req.user;
  let userLabel = 'anonymous';

  if (typeof userInfo === 'string' && userInfo.trim()) {
    userLabel = userInfo;
  } else if (userInfo && typeof userInfo === 'object') {
    const candidate =
      ('id' in userInfo && userInfo.id) ||
      ('email' in userInfo && userInfo.email) ||
      ('username' in userInfo && (userInfo as Record<string, unknown>).username);
    if (candidate && typeof candidate === 'string' && candidate.trim()) {
      userLabel = candidate;
    }
  }

  const path = req.originalUrl;
  console.log(`[AUDIT] ${new Date().toISOString()} | ${userLabel} | ${path}`);
  next();
}
