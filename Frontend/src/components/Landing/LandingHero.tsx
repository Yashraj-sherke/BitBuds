import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import heroIsland from '../../assets/hero-island.jpg';
import { ChapterTag } from './ChapterTag';
import { usePrefersReducedMotion } from '../../lib/landing-utils';

export const LandingHero: React.FC = () => {
  const reduced = usePrefersReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-1, 1], [-14, 14]), { stiffness: 60, damping: 18 });
  const py = useSpring(useTransform(my, [-1, 1], [-10, 10]), { stiffness: 60, damping: 18 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mx, my, reduced]);

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-40 right-[10%] h-[280px] w-[280px] rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute top-24 left-[8%] h-[240px] w-[240px] rounded-full bg-secondary/15 blur-3xl" />
      </div>

      <div ref={ref} className="mx-auto max-w-6xl px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <ChapterTag tone="primary">Chapter 01 — The Awakening</ChapterTag>

          <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl md:text-7xl" style={{ textWrap: 'balance' as any }}>
            Learn coding <br className="hidden sm:block" />
            through{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-br from-primary via-secondary to-secondary bg-clip-text text-transparent">
                adventures.
              </span>
              <svg
                aria-hidden
                viewBox="0 0 300 14"
                className="absolute -bottom-2 left-0 h-3 w-full text-accent/70"
                fill="none"
              >
                <path
                  d="M2 8 C 80 -2, 220 -2, 298 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-7 max-w-[54ch] text-lg text-muted-foreground sm:text-xl" style={{ textWrap: 'pretty' as any }}>
            BitBuds transforms programming into story-driven missions powered by AI —
            children don't memorise syntax, they{' '}
            <span className="font-medium text-foreground">save floating worlds</span>.
          </p>

          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-[0_16px_40px_-16px_rgba(79,70,229,0.7)] transition-transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Start Adventure
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none">
                <path d="M4 10h12m0 0l-4-4m4 4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-card px-6 py-3.5 text-base font-semibold text-foreground shadow-pop ring-1 ring-border transition-colors hover:bg-muted"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-primary" fill="currentColor">
                <path d="M6 4.5v11l9-5.5-9-5.5z" />
              </svg>
              Watch demo
            </a>
          </div>

          <p className="mt-5 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="grid h-4 w-4 place-items-center rounded-full bg-success/15 text-success">✓</span>
            No credit card. First world free. Ages 6–14.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          style={reduced ? undefined : { x: px, y: py }}
          className="relative mx-auto mt-14 w-full max-w-5xl"
        >
          <div className="animate-bit-float shadow-pop relative overflow-hidden rounded-[32px] bg-card ring-1 ring-border">
            <img
              src={heroIsland}
              alt="Bit the mascot standing on a floating island with a glowing crystal tree and drifting clouds"
              width={1600}
              height={912}
              className="block h-auto w-full"
            />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              className="shadow-pop absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-background/90 px-3.5 py-2.5 ring-1 ring-border backdrop-blur-md"
            >
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-success/15 font-accent text-sm font-extrabold text-success">
                +50
              </div>
              <div className="text-left leading-tight">
                <div className="font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
                  First Quest
                </div>
                <div className="text-sm font-semibold">Loop Master unlocked</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="shadow-pop absolute top-5 right-5 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 ring-1 ring-border backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <span className="text-xs font-medium">AI mentor listening</span>
            </motion.div>
          </div>

          <div aria-hidden className="mx-auto mt-3 h-6 max-w-[70%] rounded-[50%] bg-foreground/5 blur-xl" />
        </motion.div>
      </div>
    </section>
  );
};
