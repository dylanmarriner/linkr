import { fetchPlans } from '@/lib/api';
import { currency } from '@/lib/utils';

export default async function SubscriptionPage() {
  const plans = await fetchPlans();
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-xs uppercase tracking-[0.4em] text-white/40">Billing</p>
        <h1 className="text-3xl font-display">Choose your visibility</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <article key={plan.code} className="rounded-3xl border border-white/10 bg-black/30 p-6">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">{plan.cadence}</p>
            <h2 className="font-display text-2xl">{plan.name}</h2>
            <p className="text-3xl font-display">{currency(plan.price)}</p>
            <ul className="mt-4 space-y-2 text-sm text-white/70">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <button className="mt-4 rounded-full border border-gold px-4 py-2 text-sm text-gold">Activate</button>
          </article>
        ))}
      </div>
    </div>
  );
}
