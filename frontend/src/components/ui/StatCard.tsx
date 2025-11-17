import { cn } from '@/lib/utils';

type StatCardProps = {
  label: string;
  value: string;
  trend?: number;
  accent?: 'gold' | 'rose';
};

export function StatCard({ label, value, trend, accent = 'gold' }: StatCardProps) {
  return (
    <div className={cn('card-lux flex flex-col gap-2 rounded-2xl p-5', accent === 'rose' && 'border-rosegold/60')}>
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">{label}</p>
      <p className="text-3xl font-display">{value}</p>
      {typeof trend === 'number' && (
        <p className={cn('text-sm', trend >= 0 ? 'text-emerald-400' : 'text-red-400')}>
          {trend >= 0 ? '+' : ''}
          {trend}% vs last week
        </p>
      )}
    </div>
  );
}
