import { type KycRequest } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';

export function KycQueue({ requests }: { requests: KycRequest[] }) {
  return (
    <div className="card-lux rounded-3xl border border-white/10 p-6">
      <p className="text-xs uppercase tracking-[0.4em] text-white/40">KYC</p>
      <h3 className="font-display text-2xl">Jumio queue</h3>
      <div className="mt-4 space-y-4">
        {requests.map((request) => (
          <div key={request.id} className="rounded-2xl border border-white/10 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-display text-lg">{request.provider}</p>
                <p className="text-sm text-white/60">Ref: {request.referenceId}</p>
              </div>
              <Badge
                variant={request.status === 'approved' ? 'success' : request.status === 'rejected' ? 'danger' : 'neutral'}
              >
                {request.status}
              </Badge>
            </div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Submitted {formatDate(request.submittedAt)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
