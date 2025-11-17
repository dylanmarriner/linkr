import { fetchAdminOverview } from '@/lib/api';
import { formatDate } from '@/lib/utils';

export default async function AdminUsersPage() {
  const overview = await fetchAdminOverview();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Users</p>
        <h1 className="text-3xl font-display">Latest signups</h1>
      </div>
      <div className="overflow-hidden rounded-3xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/60">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Joined</th>
            </tr>
          </thead>
          <tbody>
            {overview.latestUsers.map((user) => (
              <tr key={user.id} className="border-t border-white/5">
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3 uppercase tracking-[0.4em] text-white/60">{user.role}</td>
                <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
