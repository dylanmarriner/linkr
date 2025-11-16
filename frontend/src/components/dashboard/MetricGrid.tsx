import { type DashboardSummary } from '@/lib/types';
import { StatCard } from '@/components/ui/StatCard';

export function MetricGrid({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {summary.metrics.map((metric, index) => (
        <StatCard key={metric.label} label={metric.label} value={metric.value} trend={metric.trend} accent={index === 1 ? 'rose' : 'gold'} />
      ))}
    </div>
  );
}
