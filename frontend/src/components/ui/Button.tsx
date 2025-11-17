import type { ButtonHTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  const styles = {
    primary: 'bg-gold text-black hover:bg-white text-sm font-semibold',
    secondary: 'border border-white/40 text-white hover:border-gold text-sm',
    ghost: 'text-white/70 hover:text-white',
  } satisfies Record<NonNullable<ButtonProps['variant']>, string>;

  return <button className={cn('rounded-full px-5 py-2 transition', styles[variant], className)} {...props} />;
}
