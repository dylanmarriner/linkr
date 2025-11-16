import { type SafetyAlert } from '@/lib/types';

export function SafetyFeed({ alerts }: { alerts: SafetyAlert[] }) {
  return (
    <div className="card-lux rounded-3xl border border-white/10 p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">Safety Alerts</p>
      <div className="mt-4 space-y-4 text-sm">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-2xl border border-white/10 p-4">
            <p>{alert.message}</p>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">{new Date(alert.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
