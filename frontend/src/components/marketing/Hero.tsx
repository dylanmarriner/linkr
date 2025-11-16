import { Button } from '@/components/ui/Button';

export function Hero() {
  return (
    <section className="container-lux grid gap-8 py-16 lg:grid-cols-2 lg:items-center">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.4em] text-gold/80">Dark Luxury, Verified</p>
        <h1 className="text-4xl font-display leading-tight md:text-5xl">
          New Zealand’s safest marketplace for verified companions.
        </h1>
        <p className="text-lg text-white/70">
          Seamless onboarding, Jumio-backed verification, encrypted inquiries, and a concierge-led safety center. Built for
          founders, creatives, and touring providers who demand privacy.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button>Claim Your Profile</Button>
          <Button variant="secondary">Browse Cities</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[{ label: 'Cities', value: '8' }, { label: 'Verified Providers', value: '312' }, { label: 'Safety Escalations', value: '0' }].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 p-4 text-center">
              <p className="text-2xl font-display">{item.value}</p>
              <p className="text-xs uppercase tracking-[0.4em] text-white/40">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="card-lux relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-charcoal to-black p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.25),_transparent_60%)]" />
        <div className="relative space-y-4 text-sm">
          <p className="font-display text-xl">Safety Center</p>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-sm text-white/60">Check-in timer</p>
            <p className="text-2xl font-display">45 minutes</p>
          </div>
          <div className="grid gap-3">
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.4em] text-emerald-200">Encrypted</p>
              <p>Black Book sync complete · 22:04</p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3">
              <p className="text-xs uppercase tracking-[0.4em] text-amber-200">On Watch</p>
              <p>Queenstown tour check-in due in 15m</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
