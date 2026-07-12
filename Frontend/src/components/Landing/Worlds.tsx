import React from 'react';
import { motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';
import { TiltCard } from './TiltCard';
import magicKingdom from '../../assets/worlds/magic-kingdom.jpg';
import robotFactory from '../../assets/worlds/robot-factory.jpg';
import spaceMission from '../../assets/worlds/space-mission.jpg';
import pirateIsland from '../../assets/worlds/pirate-island.jpg';
import dinosaurValley from '../../assets/worlds/dinosaur-valley.jpg';

const WORLDS = [
  { img: magicKingdom, name: 'Magic Kingdom', concept: 'Variables', tag: 'Level 1–10', tone: 'text-secondary' },
  { img: robotFactory, name: 'Robot Factory', concept: 'Functions', tag: 'Level 11–25', tone: 'text-primary' },
  { img: spaceMission, name: 'Space Mission', concept: 'Loops', tag: 'Level 26–40', tone: 'text-accent-foreground' },
  { img: pirateIsland, name: 'Pirate Island', concept: 'Arrays', tag: 'Level 41–60', tone: 'text-warning' },
  { img: dinosaurValley, name: 'Dinosaur Valley', concept: 'Objects', tag: 'Level 61+', tone: 'text-success' },
];

export const Worlds: React.FC = () => {
  return (
    <section id="worlds" className="relative bg-card/40 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <ChapterTag tone="secondary">Chapter 05 — The Map</ChapterTag>
            <h2 className="mt-4 max-w-[20ch] font-display text-3xl font-semibold tracking-tight sm:text-5xl">
              Five worlds. One growing hero.
            </h2>
          </div>
          <p className="max-w-sm text-muted-foreground">
            Each world teaches a core CS pillar through characters, quests, and treasure — never worksheets.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((w, i) => (
            <motion.div
              key={w.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className={i === 4 ? 'sm:col-span-2 lg:col-span-1' : ''}
            >
              <TiltCard className="group">
                <article className="shadow-pop overflow-hidden rounded-3xl bg-background ring-1 ring-border transition-shadow hover:shadow-[0_30px_60px_-25px_rgba(15,15,40,0.25)]">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                      src={w.img}
                      alt={w.name}
                      loading="lazy"
                      width={800}
                      height={1000}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
                    <div className="absolute top-4 left-4 rounded-full bg-background/80 px-3 py-1 font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] text-foreground/80 backdrop-blur">
                      {w.tag}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 px-5 py-5">
                    <div className="min-w-0">
                      <h3 className="truncate font-display text-lg font-semibold">{w.name}</h3>
                      <p className={`truncate font-accent text-xs font-extrabold uppercase tracking-[0.14em] ${w.tone}`}>
                        {w.concept}
                      </p>
                    </div>
                    <span className="shrink-0 grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </article>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
