'use client';

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const adminLinks = [
  { href: '/admin', label: 'Overview' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/profiles', label: 'Profiles' },
  { href: '/admin/payments', label: 'Payments' },
  { href: '/admin/kyc', label: 'KYC' },
  { href: '/admin/safety', label: 'Safety' },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 lg:flex-row">
        <aside className="card-lux h-fit rounded-2xl border border-white/5 bg-charcoal/80 p-6 lg:w-72">
          <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Admin</p>
          <h2 className="mt-2 font-display text-2xl">Safety & Trust</h2>
          <nav className="mt-6 flex flex-col gap-2 text-sm">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('rounded-xl px-3 py-2 text-white/70 transition hover:text-gold', {
                  'bg-white/10 text-white': pathname === link.href,
                })}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="flex-1 space-y-6">{children}</section>
      </div>
    </div>
  );
}
