import React from 'react';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const STEPS = [
  { n: '01', title: 'Choose your character', body: 'Pick a BitBud and personalise their spark colour.' },
  { n: '02', title: 'Pick a world', body: 'Magic Kingdom, Space Mission, Pirate Island — the choice is yours.' },
  { n: '03', title: 'Solve missions', body: 'Snap logic blocks, or type real Python and JavaScript.' },
  { n: '04', title: 'Earn XP', body: 'Level up, collect pets, unlock the next chapter of the story.' },
  { n: '05', title: 'Unlock new worlds', body: 'Each concept opens a whole new island with fresh characters.' },
  { n: '06', title: 'Become a coding hero', body: 'Ship your own tiny games and share them with family.' },
];

export const LandingHowItWorks: React.FC = () => {
  return (
    <section id="how" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <ChapterTag tone="primary">Chapter 04 — The Path</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            A journey designed by teachers, tuned by kids.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Six chapters. Every mission builds on the last, from first variable to first published game.
          </p>
        </div>

        <div className="relative grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-14 hidden h-4 text-primary/30 lg:block"
            viewBox="0 0 1000 16"
            preserveAspectRatio="none"
          >
            <path
              d="M0 8 C 200 -6, 400 22, 500 8 S 800 -6, 1000 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="6 8"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
          {STEPS.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="shadow-pop group relative rounded-3xl bg-card p-6 ring-1 ring-border transition-transform hover:-translate-y-1"
            >
              <div className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 font-accent text-sm font-extrabold text-primary">
                {s.n}
              </div>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
