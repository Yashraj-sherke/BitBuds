import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChapterTag } from './ChapterTag';

type Step = 'variables' | 'loop' | 'condition';

const STEP_META: Record<Step, { title: string; code: string; hint: string; color: string }> = {
  variables: {
    title: 'Variables',
    code: 'let steps = 5;\nbit.move(steps);',
    hint: 'Store a value, then tell Bit to walk that many steps.',
    color: 'var(--primary)',
  },
  loop: {
    title: 'Loop',
    code: 'repeat(4) {\n  bridge.addPlank();\n}',
    hint: 'Repeat an action to build the bridge, one plank at a time.',
    color: 'var(--secondary)',
  },
  condition: {
    title: 'Condition',
    code: 'if (bit.hasKey()) {\n  chest.open();\n}',
    hint: 'Ask a question, then decide. If Bit has the key, the chest opens.',
    color: 'var(--accent)',
  },
};

export const InteractiveDemo: React.FC = () => {
  const [step, setStep] = useState<Step>('variables');
  const [runs, setRuns] = useState(0);

  const meta = STEP_META[step];

  const scene = useMemo(() => {
    if (step === 'variables') return <VariablesScene runs={runs} />;
    if (step === 'loop') return <LoopScene runs={runs} />;
    return <ConditionScene runs={runs} />;
  }, [step, runs]);

  function run() {
    setRuns((r) => r + 1);
  }

  return (
    <section id="demo" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <ChapterTag tone="accent">Chapter 03 — The Puzzle</ChapterTag>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-5xl">
            Try a real code block. Watch the world react.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Click a concept below. Bit responds to every line of logic — no signup required.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Concept picker + editor */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(STEP_META) as Step[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStep(s)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition-all ${
                    step === s
                      ? 'bg-foreground text-background ring-foreground'
                      : 'bg-card text-foreground ring-border hover:bg-muted'
                  }`}
                >
                  {STEP_META[s].title}
                </button>
              ))}
            </div>

            <div className="shadow-pop overflow-hidden rounded-3xl bg-[#0F1220] text-white ring-1 ring-black/10">
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.03] px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-warning" />
                <span className="h-2.5 w-2.5 rounded-full bg-success" />
                <span className="ml-3 font-mono text-xs text-white/50">bit-mission.js</span>
              </div>
              <pre className="px-6 py-6 font-mono text-sm leading-relaxed text-white/90">
                <code>
                  {meta.code.split('\n').map((line, i) => (
                    <div key={i} className="flex gap-4">
                      <span className="w-4 select-none text-right text-white/30">{i + 1}</span>
                      <span>{tokenize(line)}</span>
                    </div>
                  ))}
                </code>
              </pre>
              <div className="flex items-center justify-between gap-3 border-t border-white/5 bg-white/[0.03] px-4 py-3">
                <p className="text-xs text-white/60">{meta.hint}</p>
                <button
                  type="button"
                  onClick={run}
                  className="inline-flex items-center gap-2 rounded-full bg-success px-4 py-2 text-xs font-bold text-white shadow-[0_8px_24px_-8px_rgba(34,197,94,0.6)] active:scale-95"
                >
                  ▶ Run
                </button>
              </div>
            </div>
          </div>

          {/* Scene */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-accent/10 p-8 ring-1 ring-border shadow-pop min-h-[380px]">
            <div className="absolute inset-0 -z-10 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)', backgroundSize: '22px 22px' }} />
            <AnimatePresence mode="wait">
              <motion.div
                key={step + runs}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex h-full items-end justify-center"
              >
                {scene}
              </motion.div>
            </AnimatePresence>

            <div
              key={'badge' + runs}
              className="absolute top-4 right-4 rounded-full bg-background/80 px-3 py-1 font-accent text-[10px] font-extrabold uppercase tracking-[0.14em] text-primary ring-1 ring-primary/20 backdrop-blur"
            >
              Run #{runs}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

function tokenize(line: string) {
  const re = /(\/\/[^\n]*|\b(?:let|const|if|repeat|function|return)\b|\b(?:bit|bridge|chest)\b|\b\d+\b|[{}();])/g;
  const out: Array<{ t: string; c?: string }> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > last) out.push({ t: line.slice(last, m.index) });
    const tok = m[0];
    let color: string | undefined;
    if (tok.startsWith('//')) color = '#7A7F9A';
    else if (/^(?:let|const|if|repeat|function|return)$/.test(tok)) color = '#B195FF';
    else if (/^(?:bit|bridge|chest)$/.test(tok)) color = '#00D4FF';
    else if (/^\d+$/.test(tok)) color = '#FBBF24';
    else color = '#8A8FE8';
    out.push({ t: tok, c: color });
    last = re.lastIndex;
  }
  if (last < line.length) out.push({ t: line.slice(last) });
  return out.map((n, i) => (
    <span key={i} style={n.c ? { color: n.c } : undefined}>
      {n.t}
    </span>
  ));
}

function BitAvatar({ walk = 0 }: { walk?: number }) {
  return (
    <motion.div
      animate={{ x: walk * 34 }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
      className="relative"
    >
      <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-[0_18px_30px_-12px_rgba(79,70,229,0.6)]">
        <div className="flex gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        </div>
      </div>
      <div className="mx-auto mt-1 h-1.5 w-10 rounded-full bg-foreground/10 blur-[2px]" />
    </motion.div>
  );
}

function VariablesScene({ runs }: { runs: number }) {
  const steps = Math.min(5, runs);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="flex w-full items-end justify-between">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-8 w-6 rounded-md ${
              i < steps ? 'bg-primary' : 'bg-foreground/10'
            }`}
          />
        ))}
      </div>
      <BitAvatar walk={steps} />
      <div className="w-full text-center font-accent text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        steps = {steps}
      </div>
    </div>
  );
}

function LoopScene({ runs }: { runs: number }) {
  const planks = Math.min(4, runs);
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <BitAvatar />
      <div className="grid w-full grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: i < planks ? 1 : 0, opacity: i < planks ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 16, delay: i * 0.1 }}
            className="h-4 origin-bottom rounded-md bg-secondary"
          />
        ))}
      </div>
      <div className="text-center font-accent text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        planks placed: {planks}
      </div>
    </div>
  );
}

function ConditionScene({ runs }: { runs: number }) {
  const open = runs > 0 && runs % 2 === 1;
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <BitAvatar />
      <motion.div
        animate={open ? { y: -6, scale: 1.02 } : { y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 14 }}
        className="relative grid h-28 w-28 place-items-center rounded-2xl bg-gradient-to-br from-warning/70 to-warning text-foreground shadow-[0_20px_30px_-14px_rgba(251,191,36,0.6)]"
      >
        <motion.div
          animate={open ? { rotateX: -60 } : { rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          style={{ transformOrigin: 'top center' }}
          className="absolute -top-1 left-0 h-6 w-full rounded-t-2xl bg-warning ring-1 ring-warning/40"
        />
        {open && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: -14 }}
            className="absolute text-2xl"
          >
            💎
          </motion.span>
        )}
      </motion.div>
      <div className="text-center font-accent text-xs font-extrabold uppercase tracking-[0.14em] text-muted-foreground">
        chest.isOpen = {String(open)}
      </div>
    </div>
  );
}
