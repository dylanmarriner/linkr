import { type ProviderProfile } from './types';

export function buildProfileSchema(profile: ProviderProfile) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.displayName,
    description: profile.bio,
    image: profile.heroImage,
    jobTitle: 'Independent Companion',
    url: `${process.env.APP_URL ?? 'https://linkr.co.nz'}/profiles/${profile.slug}`,
    knowsLanguage: profile.languages,
    areaServed: profile.citySlug,
    offers: {
      '@type': 'Offer',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        priceCurrency: 'NZD',
        price: profile.rateFrom,
      },
    },
  };
}
