import Image from 'next/image';

import { type CitySummary } from '@/lib/types';
import { cn } from '@/lib/utils';

export function CityGrid({ cities }: { cities: CitySummary[] }) {
  return (
    <section className="container-lux space-y-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Destinations</p>
          <h2 className="text-3xl font-display">Hand-audited cities</h2>
        </div>
        <p className="text-sm text-white/60">Updated nightly with safety telemetry.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cities.map((city) => (
          <article key={city.slug} className="card-lux overflow-hidden rounded-3xl">
            <div className="relative h-48">
              <Image src={city.heroImage} alt={city.name} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
              <div className="absolute bottom-4 left-4">
                <p className="text-sm uppercase tracking-[0.4em] text-white/60">{city.region}</p>
                <h3 className="text-2xl font-display">{city.name}</h3>
              </div>
            </div>
            <div className="space-y-3 p-6 text-sm text-white/70">
              <p>{city.tagline}</p>
              <div className="flex gap-4 text-xs uppercase tracking-[0.4em]">
                <span>{city.activeProfiles} profiles</span>
                <span className={cn(city.averageRating > 4.9 && 'text-gold')}>{city.averageRating.toFixed(2)} rating</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
