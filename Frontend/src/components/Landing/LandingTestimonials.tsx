import React from 'react';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const QUOTES = [
  {
    who: 'Maya, age 9',
    role: 'Explorer, Level 22',
    body: 'I made a bridge with a LOOP and Bit didn\'t fall! I want to do the space one now.',
    color: 'from-primary/15 to-accent/25',
  },
  {
    who: 'Sarah Chen',
    role: 'Parent · Software engineer',
    body: 'My 8-year-old stopped asking for tablet games and started asking for missions. The weekly report is genuinely useful.',
    color: 'from-secondary/15 to-primary/15',
  },
  {
    who: 'Mr. Patel',
    role: '5th grade teacher · Brooklyn',
    body: 'The lesson plans map exactly to what I need to teach. Kids who used to shut down are now the ones raising hands.',
    color: 'from-accent/25 to-success/15',
  },
  {
    who: 'Kai, age 11',
    role: 'Explorer, Level 40',
    body: 'The pirate island was scary at first, then I made a function and everyone clapped in my head.',
    color: 'from-warning/25 to-secondary/15',
  },
];

export const LandingTestimonials: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <ChapterTag tone="primary">Chapter 10 — The Chorus</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Kids, parents, teachers.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            The best reviews come from the people who use BitBuds every week.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {QUOTES.map((q, i) => (
            <motion.figure
              key={q.who}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${q.color} p-1`}
            >
              <div className="rounded-[calc(1.5rem-4px)] bg-background/95 p-7 ring-1 ring-border/60">
                <div className="mb-4 flex gap-0.5 text-warning">
                  {'★★★★★'.split('').map((s, k) => (
                    <span key={k}>{s}</span>
                  ))}
                </div>
                <blockquote className="font-display text-lg font-medium leading-relaxed sm:text-xl">
                  &ldquo;{q.body}&rdquo;
                </blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-accent text-sm font-extrabold text-primary">
                    {q.who.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{q.who}</div>
                    <div className="text-xs text-muted-foreground">{q.role}</div>
                  </div>
                </figcaption>
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
};
