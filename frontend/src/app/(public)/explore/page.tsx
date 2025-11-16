import type { Metadata } from 'next';

import { fetchCategories, fetchCities, fetchFeaturedProviders } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Explore providers · Linkr',
};

export default async function ExplorePage() {
  const [cities, categories, providers] = await Promise.all([fetchCities(), fetchCategories(), fetchFeaturedProviders()]);
  return (
    <div className="space-y-8 py-12">
      <section className="container-lux space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Discover</p>
        <h1 className="text-4xl font-display">Browse by city</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {cities.map((city) => (
            <article key={city.slug} className="rounded-3xl border border-white/10 bg-black/40 p-5">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{city.region}</p>
              <h2 className="text-2xl font-display">{city.name}</h2>
              <p className="text-sm text-white/70">{city.spotlight}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container-lux space-y-4">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Categories</p>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <article key={category.slug} className="rounded-3xl border border-white/10 bg-black/40 p-5">
              <h3 className="text-xl font-display">{category.label}</h3>
              <p className="text-sm text-white/70">{category.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="container-lux space-y-4 pb-16">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Top profiles</p>
        <div className="grid gap-4 md:grid-cols-3">
          {providers.map((profile) => (
            <article key={profile.id} className="rounded-3xl border border-white/10 bg-black/40 p-5">
              <h3 className="text-xl font-display">{profile.displayName}</h3>
              <p className="text-sm text-white/70">{profile.headline}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
