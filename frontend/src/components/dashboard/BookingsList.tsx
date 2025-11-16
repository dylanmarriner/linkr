import { type DashboardSummary } from '@/lib/types';

export function BookingsList({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="card-lux rounded-3xl border border-white/5 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Upcoming</p>
          <h3 className="font-display text-2xl">Bookings</h3>
        </div>
        <p className="text-sm text-white/60">Synced from CRM</p>
      </div>
      <div className="mt-4 space-y-4">
        {summary.upcomingBookings.map((booking) => (
          <div key={`${booking.client}-${booking.date}`} className="flex items-center justify-between rounded-2xl border border-white/5 p-4">
            <div>
              <p className="font-display text-lg">{booking.client}</p>
              <p className="text-sm text-white/60">{booking.service}</p>
            </div>
            <p className="text-sm uppercase tracking-[0.4em] text-white/40">{booking.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
