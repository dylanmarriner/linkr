import { AdminPaymentsTable } from '@/components/admin/AdminTable';
import { fetchPayments } from '@/lib/api';

export default async function AdminPaymentsPage() {
  const payments = await fetchPayments();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Payments</p>
        <h1 className="text-3xl font-display">SegPay + CCBill logs</h1>
      </div>
      <AdminPaymentsTable payments={payments} />
    </div>
  );
}
