import { FeatureList } from '@/components/marketing/FeatureList';
import { Hero } from '@/components/marketing/Hero';
import { CityGrid } from '@/components/marketing/CityGrid';
import { ProfileSpotlight } from '@/components/profiles/ProfileSpotlight';
import { fetchCities, fetchFeaturedProviders, fetchPlans } from '@/lib/api';
import { currency } from '@/lib/utils';

export default async function LandingPage() {
  const [cities, profiles, plans] = await Promise.all([fetchCities(), fetchFeaturedProviders(), fetchPlans()]);
  return (
    <div className="space-y-10">
      <Hero />
      <CityGrid cities={cities} />
      <ProfileSpotlight profiles={profiles} />
      <FeatureList />
      <section className="container-lux space-y-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-gold/70">Plans</p>
            <h2 className="text-3xl font-display">Subscriptions</h2>
          </div>
          <p className="text-sm text-white/60">SegPay + CCBill ready.</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.code} className="card-lux space-y-4 rounded-3xl border border-white/10 p-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{plan.cadence}</p>
              <h3 className="font-display text-2xl">{plan.name}</h3>
              <p className="text-3xl font-display">{currency(plan.price)}</p>
              <ul className="space-y-2 text-sm text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature}>• {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
