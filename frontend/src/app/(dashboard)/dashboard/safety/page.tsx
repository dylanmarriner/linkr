import { SafetyStatus } from '@/components/dashboard/SafetyStatus';
import { fetchSafetyAlerts } from '@/lib/api';

export default async function DashboardSafetyPage() {
  const alerts = await fetchSafetyAlerts();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Safety</p>
        <h1 className="text-3xl font-display">Check-ins & alerts</h1>
      </div>
      <SafetyStatus alerts={alerts} />
      <div className="rounded-3xl border border-white/10 bg-black/30 p-6">
        <p className="text-sm text-white/70">Configure touring timers and panic codes in the mobile app.</p>
      </div>
    </div>
  );
}
