import { fetchFeaturedProviders } from '@/lib/api';

export default async function DashboardProfilePage() {
  const [profile] = await fetchFeaturedProviders();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Profile</p>
        <h1 className="text-3xl font-display">Update brand story</h1>
        <p className="text-sm text-white/70">Changes sync to landing + API instantly.</p>
      </div>
      <form className="space-y-4">
        <label className="block text-sm">
          <span>Display name</span>
          <input defaultValue={profile?.displayName} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" />
        </label>
        <label className="block text-sm">
          <span>Headline</span>
          <textarea defaultValue={profile?.headline} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" rows={3} />
        </label>
        <label className="block text-sm">
          <span>Biography</span>
          <textarea defaultValue={profile?.bio} className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3" rows={6} />
        </label>
        <button type="submit" className="rounded-full bg-gold px-6 py-3 font-semibold text-black">
          Save profile
        </button>
      </form>
    </div>
  );
}
