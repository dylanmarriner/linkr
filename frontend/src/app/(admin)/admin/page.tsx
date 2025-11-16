import { AdminPaymentsTable } from '@/components/admin/AdminTable';
import { KycQueue } from '@/components/admin/KycQueue';
import { SafetyFeed } from '@/components/admin/SafetyFeed';
import { StatCard } from '@/components/ui/StatCard';
import { fetchAdminOverview } from '@/lib/api';

export default async function AdminOverviewPage() {
  const overview = await fetchAdminOverview();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {overview.stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} trend={stat.trend} />
        ))}
      </div>
      <AdminPaymentsTable payments={overview.payments} />
      <div className="grid gap-6 lg:grid-cols-2">
        <KycQueue requests={overview.kycQueue} />
        <SafetyFeed alerts={overview.safetyAlerts} />
      </div>
    </div>
  );
}
