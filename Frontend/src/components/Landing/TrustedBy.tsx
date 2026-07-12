import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from './Counter';
import { ChapterTag } from './ChapterTag';

const STATS: Array<{
  value: number;
  suffix: string;
  label: string;
  color: string;
}> = [
  { value: 10, suffix: 'K+', label: 'Young coders', color: 'var(--primary)' },
  { value: 150, suffix: '+', label: 'Partner schools', color: 'var(--secondary)' },
  { value: 95, suffix: '%', label: 'Completion rate', color: 'var(--accent)' },
  { value: 49, suffix: '/50', label: 'Parent rating', color: 'var(--success)' },
];

const PARTNERS = ['Kodu Academy', 'STEAM Labs', 'TechnoKids', 'BrightMind', 'CyberBase'];

export const TrustedBy: React.FC = () => {
  return (
    <section className="border-y border-border bg-card/50 py-14">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <ChapterTag tone="secondary">Chapter 02 — The Guild</ChapterTag>
            <h2 className="mt-3 max-w-[24ch] font-display text-2xl font-semibold sm:text-3xl">
              Trusted by families, teachers, and schools worldwide.
            </h2>
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Real progress, measured weekly. The numbers count up as your journey begins.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="shadow-pop rounded-2xl bg-background p-5 ring-1 ring-border"
            >
              <div className="font-display text-3xl font-semibold sm:text-4xl" style={{ color: s.color }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-1 font-accent text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-70">
          {PARTNERS.map((p) => (
            <span key={p} className="font-accent text-sm font-extrabold uppercase tracking-[0.18em] text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
