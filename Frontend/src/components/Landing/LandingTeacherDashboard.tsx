import React from 'react';
import { motion } from 'framer-motion';
import teacherImg from '../../assets/teacher-dashboard.jpg';
import { ChapterTag } from './ChapterTag';

const TILES = [
  { k: 'Class analytics', v: 'Track mastery across every concept, per student.' },
  { k: 'Assignments', v: 'Send a whole world as this week\'s homework.' },
  { k: 'Leaderboard', v: 'Friendly, opt-in — celebrates progress over rank.' },
  { k: 'Curriculum map', v: 'Aligns with CSTA K-12 and national standards.' },
];

export const LandingTeacherDashboard: React.FC = () => {
  return (
    <section id="teachers" className="relative bg-card/40 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="relative order-2 lg:order-1"
          >
            <div aria-hidden className="absolute -inset-6 -z-10 rounded-[40px] bg-gradient-to-br from-secondary/15 via-transparent to-primary/15 blur-2xl" />
            <div className="shadow-pop overflow-hidden rounded-3xl bg-card ring-1 ring-border">
              <img
                src={teacherImg}
                alt="Teacher dashboard showing class progress, assignments, and a friendly leaderboard"
                loading="lazy"
                width={1408}
                height={912}
                className="block h-auto w-full"
              />
            </div>
          </motion.div>

          <div className="order-1 lg:order-2">
            <ChapterTag tone="secondary">Chapter 09 — The Classroom</ChapterTag>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Built for teachers who love their weekends.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              Zero grading. Auto-generated lesson plans. Every child on their own mission — you conducting the orchestra.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {TILES.map((t, i) => (
                <motion.div
                  key={t.k}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="rounded-2xl bg-background p-4 ring-1 ring-border"
                >
                  <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.14em] text-secondary">
                    {t.k}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{t.v}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
