import { BookingsList } from '@/components/dashboard/BookingsList';
import { MetricGrid } from '@/components/dashboard/MetricGrid';
import { SafetyStatus } from '@/components/dashboard/SafetyStatus';
import { TaskList } from '@/components/dashboard/TaskList';
import { fetchDashboard, fetchSafetyAlerts } from '@/lib/api';

export default async function DashboardHome() {
  const [summary, alerts] = await Promise.all([fetchDashboard(), fetchSafetyAlerts()]);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Pulse</p>
        <h1 className="text-4xl font-display">{summary.headline}</h1>
        <p className="text-sm text-white/70">{summary.cta}</p>
      </div>
      <MetricGrid summary={summary} />
      <div className="grid gap-6 lg:grid-cols-2">
        <BookingsList summary={summary} />
        <TaskList summary={summary} />
      </div>
      <SafetyStatus alerts={alerts} />
    </div>
  );
}
