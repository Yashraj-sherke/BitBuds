import React from 'react';
import { motion } from 'framer-motion';
import parentImg from '../../assets/parent-dashboard.jpg';
import { ChapterTag } from './ChapterTag';

const BULLETS = [
  { title: 'Weekly report', body: 'One-page brief covering wins, sticking points, and what to celebrate.' },
  { title: 'Focus areas', body: 'See which CS concepts are strengthening, and which need another mission.' },
  { title: 'Screen-time you\'ll allow', body: 'Real learning, real breaks. Set daily caps in seconds.' },
  { title: 'Personalised recommendations', body: 'The AI suggests the next mission based on your child\'s curiosity.' },
];

export const LandingParentDashboard: React.FC = () => {
  return (
    <section id="parents" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <ChapterTag tone="success">Chapter 08 — The Family</ChapterTag>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Peace of mind, delivered every Sunday.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              The Parent Dashboard turns your child's coding journey into a calm, weekly rhythm.
              No spreadsheets. No jargon.
            </p>

            <ul className="mt-8 space-y-5">
              {BULLETS.map((b, i) => (
                <motion.li
                  key={b.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex gap-4"
                >
                  <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-success/15 text-success">
                    ✓
                  </span>
                  <div>
                    <h3 className="text-base font-semibold">{b.title}</h3>
                    <p className="text-sm text-muted-foreground">{b.body}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-primary/15 via-transparent to-accent/20 blur-2xl" />
            <div className="shadow-pop overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <img
                src={parentImg}
                alt="Parent dashboard showing a child's coding progress, weekly learning time, and earned badges"
                loading="lazy"
                width={1408}
                height={912}
                className="block h-auto w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
