'use client';

import { type FormEvent, useState } from 'react';

import { authClient } from '@/lib/client-api';
import { cn } from '@/lib/utils';

type AuthVariant = 'login' | 'register' | 'forgot' | 'reset' | 'verify' | 'twofactor';

const variantConfig: Record<
  AuthVariant,
  { title: string; description: string; action: (form: FormData) => Promise<unknown>; fields: Array<{ name: string; label: string; type?: string; placeholder?: string }> }
> = {
  login: {
    title: 'Welcome back',
    description: 'Encrypted sessions + 2FA by default.',
    action: (form) => authClient.login({ email: form.get('email') as string, password: form.get('password') as string }),
    fields: [
      { name: 'email', label: 'Email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
  },
  register: {
    title: 'Create a provider account',
    description: 'We’ll verify documents after onboarding.',
    action: (form) =>
      authClient.register({
        email: form.get('email') as string,
        password: form.get('password') as string,
        role: 'PROVIDER',
        displayName: form.get('displayName') as string,
      }),
    fields: [
      { name: 'displayName', label: 'Stage Name' },
      { name: 'email', label: 'Email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
  },
  forgot: {
    title: 'Reset access',
    description: 'We’ll send a zero-knowledge reset link.',
    action: (form) => authClient.requestPasswordReset({ email: form.get('email') as string }),
    fields: [{ name: 'email', label: 'Email' }],
  },
  reset: {
    title: 'Choose a new password',
    description: 'Tokens expire after 30 minutes.',
    action: (form) => authClient.resetPassword({ token: form.get('token') as string, password: form.get('password') as string }),
    fields: [
      { name: 'token', label: 'Reset token' },
      { name: 'password', label: 'New password', type: 'password' },
    ],
  },
  verify: {
    title: 'Verify your email',
    description: 'Paste the secure token we sent.',
    action: (form) => authClient.verifyEmail({ token: form.get('token') as string }),
    fields: [{ name: 'token', label: 'Verification token' }],
  },
  twofactor: {
    title: 'Enter 2FA token',
    description: 'Time-based one-time password from your device.',
    action: (form) => authClient.confirmTwoFactor({ token: form.get('token') as string }),
    fields: [{ name: 'token', label: 'Authenticator code' }],
  },
};

export function AuthCard({ variant }: { variant: AuthVariant }) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const config = variantConfig[variant];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');
    try {
      await config.action(new FormData(event.currentTarget));
      setStatus('success');
      setMessage('Done. Check your inbox for confirmations.');
      event.currentTarget.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unexpected error');
    }
  }

  return (
    <div className="card-lux w-full max-w-md rounded-[32px] border border-white/10 bg-black/60 p-8">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Secure</p>
      <h1 className="text-3xl font-display">{config.title}</h1>
      <p className="text-sm text-white/60">{config.description}</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {config.fields.map((field) => (
          <label key={field.name} className="block text-sm">
            <span className="text-white/70">{field.label}</span>
            <input
              name={field.name}
              type={field.type ?? 'text'}
              placeholder={field.placeholder}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white focus:border-gold focus:outline-none"
              required
            />
          </label>
        ))}
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={cn('w-full rounded-full bg-gold py-3 font-semibold text-black', status === 'submitting' && 'opacity-70')}
        >
          {status === 'submitting' ? 'Working...' : 'Submit'}
        </button>
        {message && (
          <p className={cn('text-sm', status === 'error' ? 'text-red-300' : 'text-emerald-300')}>{message}</p>
        )}
      </form>
    </div>
  );
}
