import Image from 'next/image';

import { type ProviderProfile } from '@/lib/types';
import { currency } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export function ProfileDetails({ profile }: { profile: ProviderProfile }) {
  return (
    <section className="container-lux grid gap-10 py-16 lg:grid-cols-[2fr_1fr]">
      <article className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">{profile.citySlug}</p>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-display">{profile.displayName}</h1>
            {profile.isVerified && <Badge variant="success">Linkr Verified</Badge>}
          </div>
          <p className="text-lg text-white/70">{profile.headline}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {profile.availability.map((slot) => (
            <div key={`${slot.day}-${slot.from}`} className="rounded-2xl border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{slot.day}</p>
              <p className="font-display text-xl">
                {slot.from} — {slot.to}
              </p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
          <h2 className="font-display text-2xl">Biography</h2>
          <p className="mt-3 text-white/70">{profile.bio}</p>
          <p className="mt-4 text-sm uppercase tracking-[0.4em] text-white/40">Languages</p>
          <p>{profile.languages.join(', ')}</p>
        </div>
      </article>
      <aside className="space-y-6">
        <div className="card-lux rounded-3xl border border-white/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Investment</p>
          <p className="font-display text-3xl">{currency(profile.rateFrom)}+</p>
          <p className="text-sm text-white/60">Rates depend on experience length, wardrobe, and travel.</p>
        </div>
        <div className="space-y-4">
          {profile.gallery.map((image, index) => (
            <div key={image} className="relative h-48 overflow-hidden rounded-3xl">
              <Image
                src={image}
                alt={`${profile.displayName} gallery ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-rose-300/40 bg-rose-500/10 p-6">
          <p className="text-xs uppercase tracking-[0.4em] text-rose-200">Safety notes</p>
          <p className="text-sm">{profile.safetyNotes}</p>
        </div>
      </aside>
    </section>
  );
}
