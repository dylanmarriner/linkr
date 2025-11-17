"use client";

import type { ReactNode } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const dashboardLinks = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/subscription', label: 'Subscription' },
  { href: '/dashboard/safety', label: 'Safety' },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row">
        <aside className="card-lux h-fit w-full rounded-2xl border border-white/5 bg-black/60 p-6 lg:w-64">
          <p className="text-sm uppercase tracking-[0.3em] text-white/50">Provider</p>
          <h2 className="mt-2 font-display text-2xl">Command Suite</h2>
          <nav className="mt-6 flex flex-col gap-3 text-sm">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn('rounded-full px-3 py-2 text-white/70 hover:text-gold', {
                  'bg-white/5 text-white': pathname === link.href,
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
