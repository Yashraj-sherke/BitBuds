import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    per: 'forever',
    body: 'The first world, always free. Meet Bit, master variables, taste the adventure.',
    features: ['Magic Kingdom world', 'Basic AI hints', '1 character slot', 'Family-safe by default'],
    cta: 'Start free',
    highlight: false,
  },
  {
    name: 'Explorer',
    price: '$12',
    per: 'per month',
    body: 'The full BitBuds journey — every world, every mission, every reward.',
    features: [
      'All 5 worlds & new drops',
      'Full AI mentor + hint engine',
      'Unlimited missions & pets',
      'Parent dashboard + weekly report',
    ],
    cta: 'Start 7-day trial',
    highlight: true,
  },
  {
    name: 'Schools',
    price: 'Custom',
    per: 'per classroom',
    body: 'For teachers and districts. Full curriculum, roster sync, and priority support.',
    features: ['Teacher dashboard', 'Curriculum & standards mapping', 'SSO + rostering', 'Dedicated success partner'],
    cta: 'Book a demo',
    highlight: false,
  },
];

export const Pricing: React.FC = () => {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <ChapterTag tone="primary">Chapter 11 — The Choice</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Simple pricing. Real value. Cancel anytime.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every plan is built to feel generous. Because coding shouldn't come with a paywall on chapter two.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex flex-col rounded-3xl p-7 ring-1 ${
                p.highlight
                  ? 'bg-foreground text-background ring-foreground shadow-[0_30px_60px_-20px_rgba(15,15,40,0.4)]'
                  : 'bg-card text-foreground ring-border shadow-pop'
              }`}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground">
                  Most loved
                </div>
              )}
              <div className="font-accent text-xs font-extrabold uppercase tracking-[0.14em] opacity-70">
                {p.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-semibold">{p.price}</span>
                <span className="text-sm opacity-60">/ {p.per}</span>
              </div>
              <p className="mt-3 text-sm opacity-75">{p.body}</p>
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={`mt-1 grid h-4 w-4 shrink-0 place-items-center rounded-full ${p.highlight ? 'bg-accent text-foreground' : 'bg-primary/15 text-primary'}`}>
                      ✓
                    </span>
                    <span className="opacity-90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/auth"
                className={`mt-8 inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition-transform active:scale-95 ${
                  p.highlight
                    ? 'bg-background text-foreground hover:brightness-110'
                    : 'bg-primary text-white shadow-[0_10px_24px_-10px_rgba(79,70,229,0.7)] hover:brightness-110'
                }`}
              >
                {p.cta}
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
