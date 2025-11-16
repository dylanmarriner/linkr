'use client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000';

type JsonRecord = Record<string, unknown>;

async function postJson(path: string, payload: JsonRecord) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error?.message ?? 'Unexpected API error');
  }

  return response.json().catch(() => ({}));
}

export const authClient = {
  login: (payload: { email: string; password: string; token?: string }) =>
    postJson('/auth/login', payload),
  register: (payload: {
    email: string;
    password: string;
    role: 'PROVIDER' | 'CLIENT';
    displayName: string;
  }) => postJson('/auth/register', payload),
  requestPasswordReset: (payload: { email: string }) => postJson('/auth/password/reset', payload),
  resetPassword: (payload: { token: string; password: string }) => postJson('/auth/password/update', payload),
  verifyEmail: (payload: { token: string }) => postJson('/auth/verify', payload),
  confirmTwoFactor: (payload: { token: string }) => postJson('/auth/2fa/verify', payload),
};
