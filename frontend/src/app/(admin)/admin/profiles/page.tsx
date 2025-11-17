import { fetchFeaturedProviders } from '@/lib/api';
import { Badge } from '@/components/ui/Badge';

export default async function AdminProfilesPage() {
  const providers = await fetchFeaturedProviders();
  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Profiles</p>
        <h1 className="text-3xl font-display">Moderation queue</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {providers.map((provider) => (
          <article key={provider.id} className="rounded-3xl border border-white/10 bg-black/40 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl">{provider.displayName}</h2>
                <p className="text-sm text-white/60">{provider.citySlug}</p>
              </div>
              {provider.isVerified && <Badge variant="success">Verified</Badge>}
            </div>
            <p className="mt-4 text-sm text-white/70">{provider.headline}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
