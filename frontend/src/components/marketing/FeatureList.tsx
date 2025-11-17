import { ShieldCheck, Sparkles, Zap } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: 'Safety command center',
    copy: 'AES-256 encrypted panic buttons, proactive concierge, and touring check-ins.',
  },
  {
    icon: Sparkles,
    title: 'Story-driven SEO',
    copy: 'Schema.org profiles, ISR city pages, and curated search snippets for NZ traffic.',
  },
  {
    icon: Zap,
    title: 'Payments + compliance',
    copy: 'SegPay + CCBill billing automation, Jumio verification, and exportable audit logs.',
  },
];

export function FeatureList() {
  return (
    <section className="container-lux grid gap-6 py-16 md:grid-cols-3">
      {features.map((feature) => (
        <article key={feature.title} className="card-lux space-y-3 rounded-3xl border border-white/10 p-6">
          <feature.icon className="h-8 w-8 text-gold" />
          <h3 className="text-xl font-display">{feature.title}</h3>
          <p className="text-sm text-white/70">{feature.copy}</p>
        </article>
      ))}
    </section>
  );
}
