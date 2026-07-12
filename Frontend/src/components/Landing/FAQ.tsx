import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

const ITEMS = [
  {
    q: 'What ages is BitBuds for?',
    a: 'BitBuds is designed for children 6–14. The early worlds use block-based coding with narration; older kids can switch on real Python or JavaScript.',
  },
  {
    q: 'Do children need a device of their own?',
    a: 'BitBuds runs in any modern browser — iPad, Chromebook, laptop, or desktop. No install, no accounts required to try the first world.',
  },
  {
    q: 'Is it safe? What about the AI?',
    a: 'Yes. BitBuds is COPPA-aligned, ad-free, and the AI mentor is scoped to teach, hint, and encourage — never to chat freely. You can review every AI response in the parent dashboard.',
  },
  {
    q: 'Do you teach real programming?',
    a: 'Yes. Kids move from visual blocks into real Python and JavaScript by around Level 20. Every concept in our curriculum maps to CSTA K-12 standards.',
  },
  {
    q: 'Can I cancel anytime?',
    a: 'Any time. No lock-in, no hoops. Progress and pets stay on your account if you come back.',
  },
];

export const FAQ: React.FC = () => {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="relative bg-card/40 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="mb-12 text-center">
          <ChapterTag tone="secondary">Chapter 12 — Questions</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Everything a curious grown-up asks.
          </h2>
        </div>

        <ul className="space-y-3">
          {ITEMS.map((it, i) => {
            const isOpen = open === i;
            return (
              <li key={it.q} className="overflow-hidden rounded-2xl bg-background ring-1 ring-border">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-display text-base font-semibold">{it.q}</span>
                  <span
                    className={`grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary transition-transform ${
                      isOpen ? 'rotate-45' : ''
                    }`}
                    aria-hidden
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{it.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
