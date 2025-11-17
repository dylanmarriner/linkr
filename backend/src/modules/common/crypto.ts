import crypto from 'crypto';
import { HttpError } from './httpError';

const keyEnv = process.env.SAFETY_ENCRYPTION_KEY;
const keyBuffer = keyEnv ? Buffer.from(keyEnv, 'base64') : undefined;

export function ensureEncryptionKey() {
  if (!keyBuffer || keyBuffer.length !== 32) {
    throw new HttpError(500, 'Safety encryption key must be a 32 byte base64 string');
  }
  return keyBuffer;
}

export function encryptPayload(payload: unknown) {
  const key = ensureEncryptionKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.from(JSON.stringify(payload), 'utf8');
  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('base64'), authTag.toString('base64'), encrypted.toString('base64')].join('.');
}

export function decryptPayload(payload: string | null) {
  if (!payload) {
    return null;
  }
  const key = ensureEncryptionKey();
  const [ivB64, tagB64, dataB64] = payload.split('.');
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(dataB64, 'base64')), decipher.final()]);
  return JSON.parse(decrypted.toString('utf8'));
}
