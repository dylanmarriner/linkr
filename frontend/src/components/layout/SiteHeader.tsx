'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

const publicLinks = [
  { href: '/explore', label: 'Explore' },
  { href: '/profiles/amira-noir', label: 'Featured' },
  { href: '/login', label: 'Login' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-white/5 bg-black/40 backdrop-blur">
      <div className="container-lux flex items-center justify-between py-4">
        <Link href="/" className="font-display text-xl tracking-[0.3em] uppercase">
          Linkr
        </Link>
        <nav className="hidden gap-8 text-sm uppercase md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn('tracking-wide text-white/70 hover:text-gold transition', {
                'text-gold': pathname === link.href,
              })}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/register"
            className="rounded-full border border-gold/60 px-4 py-2 text-sm font-semibold text-gold hover:bg-gold hover:text-black"
          >
            Join as Provider
          </Link>
        </div>
        <button
          className="md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/5 bg-black/90 p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            {publicLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="text-sm uppercase text-white/80">
                {link.label}
              </Link>
            ))}
            <Link href="/register" onClick={() => setOpen(false)} className="text-sm uppercase text-gold">
              Join as Provider
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
