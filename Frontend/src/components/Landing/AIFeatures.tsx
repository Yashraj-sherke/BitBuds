import React from 'react';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const FEATURES = [
  { icon: '📖', title: 'AI Story Generator', body: 'Every mission is a fresh story shaped around your child\'s interests.' },
  { icon: '🧠', title: 'Adaptive Quizzes', body: 'Difficulty tunes itself in real time — never too easy, never crushing.' },
  { icon: '🤝', title: 'AI Coding Mentor', body: 'A patient buddy that hints without spoiling the answer.' },
  { icon: '🎯', title: 'Personalised Path', body: 'Learning routes adjust based on strengths, gaps, and curiosity.' },
  { icon: '💡', title: 'Smart Hint Engine', body: 'One nudge at a time, escalating only when a child is truly stuck.' },
  { icon: '📊', title: 'Weekly Progress Report', body: 'A one-page brief in plain language, ready for the fridge or the classroom.' },
];

export const AIFeatures: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <ChapterTag tone="accent">Chapter 06 — The Mentor</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            AI that teaches with kindness.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            BitBuds' AI is designed for children — safe, encouraging, and honest about when to ask a grown-up.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: i * 0.05 }}
              className="group relative overflow-hidden rounded-3xl bg-card p-6 ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-pop"
            >
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/25 text-2xl">
                {f.icon}
              </div>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};
