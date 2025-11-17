import Image from 'next/image';
import Link from 'next/link';

import { type ProviderProfile } from '@/lib/types';
import { currency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function ProfileSpotlight({ profiles }: { profiles: ProviderProfile[] }) {
  return (
    <section className="container-lux space-y-8 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Spotlight</p>
          <h2 className="text-3xl font-display">Verified providers</h2>
        </div>
        <Link href="/register" className="text-sm text-gold">
          Become verified →
        </Link>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {profiles.map((profile) => (
          <article key={profile.id} className="card-lux grid gap-6 rounded-[32px] border border-white/10 p-6 lg:grid-cols-[240px_1fr]">
            <div className="relative h-64 w-full overflow-hidden rounded-2xl">
              <Image
                src={profile.heroImage}
                alt={profile.displayName}
                fill
                sizes="(min-width: 1024px) 240px, 100vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-display">{profile.displayName}</h3>
                {profile.isVerified && <Badge variant="success">Verified</Badge>}
              </div>
              <p className="text-white/70">{profile.headline}</p>
              <p className="text-sm text-white/60">{profile.bio}</p>
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.4em] text-white/40">
                <span>{profile.citySlug}</span>
                <span>{profile.languages.join(' · ')}</span>
              </div>
              <p className="font-display text-xl">{currency(profile.rateFrom)} — {currency(profile.rateTo)}</p>
              <Link href={`/profiles/${profile.slug}`} className="text-sm text-gold">
                View profile
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
