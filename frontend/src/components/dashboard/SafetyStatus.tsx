import { AlertTriangle, Shield } from 'lucide-react';

import { type SafetyAlert } from '@/lib/types';

export function SafetyStatus({ alerts }: { alerts: SafetyAlert[] }) {
  return (
    <div className="card-lux rounded-3xl border border-white/5 p-6">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-gold" />
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Safety center</p>
          <h3 className="font-display text-2xl">Live signals</h3>
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 rounded-2xl border border-white/10 p-4">
            <AlertTriangle className={alert.level === 'critical' ? 'text-red-400' : alert.level === 'warning' ? 'text-amber-400' : 'text-emerald-400'} />
            <div>
              <p className="text-sm">{alert.message}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{new Date(alert.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
