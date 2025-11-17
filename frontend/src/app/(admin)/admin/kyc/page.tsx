import { KycQueue } from '@/components/admin/KycQueue';
import { fetchKycQueue } from '@/lib/api';

export default async function AdminKycPage() {
  const queue = await fetchKycQueue();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">KYC</p>
        <h1 className="text-3xl font-display">Jumio callbacks</h1>
      </div>
      <KycQueue requests={queue} />
    </div>
  );
}
