import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type BadgeProps = {
  children: ReactNode;
  variant?: 'neutral' | 'success' | 'danger';
};

const palette: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'border-white/20 text-white/80',
  success: 'border-green-500/40 text-green-300',
  danger: 'border-red-500/40 text-red-300',
};

export function Badge({ children, variant = 'neutral' }: BadgeProps) {
  return <span className={cn('rounded-full border px-3 py-1 text-xs uppercase tracking-wide', palette[variant])}>{children}</span>;
}
