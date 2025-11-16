import { type PaymentRecord } from '@/lib/types';
import { currency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function AdminPaymentsTable({ payments }: { payments: PaymentRecord[] }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <table className="w-full text-left text-sm">
        <thead className="bg-white/5 text-white/60">
          <tr>
            <th className="px-4 py-3">Provider</th>
            <th className="px-4 py-3">Plan</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Captured</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id} className="border-t border-white/5">
              <td className="px-4 py-3">{payment.provider}</td>
              <td className="px-4 py-3">{payment.plan}</td>
              <td className="px-4 py-3">
                <Badge variant={payment.status === 'paid' ? 'success' : payment.status === 'pending' ? 'neutral' : 'danger'}>
                  {payment.status}
                </Badge>
              </td>
              <td className="px-4 py-3">{currency(payment.amount)}</td>
              <td className="px-4 py-3">{formatDate(payment.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
