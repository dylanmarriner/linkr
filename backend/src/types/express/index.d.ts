import 'express';

type AuditUser = string | { id?: string; email?: string; [key: string]: unknown };

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuditUser;
  }
}

export {};
