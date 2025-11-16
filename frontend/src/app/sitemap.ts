import type { MetadataRoute } from 'next';

import { fetchCities, fetchFeaturedProviders } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cities, providers] = await Promise.all([fetchCities(), fetchFeaturedProviders()]);
  const base = 'https://linkr.local';
  const entries: MetadataRoute.Sitemap = [
    { url: base, priority: 1 },
    { url: `${base}/explore`, priority: 0.9 },
  ];
  cities.forEach((city) => entries.push({ url: `${base}/explore?city=${city.slug}`, priority: 0.8 }));
  providers.forEach((provider) => entries.push({ url: `${base}/profiles/${provider.slug}`, priority: 0.7 }));
  return entries;
}
