import { SafetyFeed } from '@/components/admin/SafetyFeed';
import { fetchSafetyAlerts } from '@/lib/api';

export default async function AdminSafetyPage() {
  const alerts = await fetchSafetyAlerts();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Safety</p>
        <h1 className="text-3xl font-display">Live alerts</h1>
      </div>
      <SafetyFeed alerts={alerts} />
    </div>
  );
}
