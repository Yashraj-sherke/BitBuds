import React from 'react';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const REWARDS = [
  { label: 'XP', desc: 'Points that never expire', tone: 'bg-primary/15 text-primary' },
  { label: 'Levels', desc: 'New badges, gear, and titles', tone: 'bg-secondary/15 text-secondary' },
  { label: 'Coins', desc: 'Spend in the Shop of Sparks', tone: 'bg-warning/20 text-warning' },
  { label: 'Badges', desc: 'Rare drops for tough missions', tone: 'bg-success/15 text-success' },
  { label: 'Pets', desc: 'Loyal creatures who evolve', tone: 'bg-accent/25 text-accent-foreground' },
  { label: 'Mystery Boxes', desc: 'Weekly surprise unlocks', tone: 'bg-primary/10 text-primary' },
];

export const Gamification: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-foreground py-24 text-background sm:py-32">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -top-32 left-1/4 h-[400px] w-[400px] rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-secondary/20 blur-3xl" />
      </div>
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <ChapterTag tone="warning" className="!bg-warning/20 !text-warning">
              Chapter 07 — The Rewards
            </ChapterTag>
            <h2 className="mt-4 max-w-[16ch] font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Learning that feels like winning.
            </h2>
            <p className="mt-5 max-w-md text-lg text-background/70">
              Every mission, every hint, every completed line of code becomes a moment worth celebrating.
            </p>

            <motion.div
              whileInView={{ rotate: [0, -6, 6, -3, 3, 0] }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="mt-10 inline-flex items-center gap-4 rounded-3xl bg-background/10 p-4 ring-1 ring-background/15 backdrop-blur"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-warning to-warning/60 text-3xl shadow-[0_18px_30px_-10px_rgba(251,191,36,0.6)]">
                🎁
              </div>
              <div>
                <div className="font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] text-background/60">
                  Mystery box opened
                </div>
                <div className="font-display text-lg font-semibold">Legendary Pet: Ember Fox</div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {REWARDS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, scale: 0.9, y: 12 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: i * 0.06, type: 'spring', stiffness: 160, damping: 16 }}
                className="rounded-2xl bg-background/5 p-5 ring-1 ring-background/10 backdrop-blur transition-colors hover:bg-background/10"
              >
                <div className={`mb-3 inline-flex rounded-lg px-2 py-1 font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] ${r.tone}`}>
                  {r.label}
                </div>
                <div className="text-sm text-background/80">{r.desc}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
