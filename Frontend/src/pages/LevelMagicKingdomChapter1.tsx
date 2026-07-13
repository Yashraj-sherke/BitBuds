import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "../lib/utils";

type Scene = "story" | "dialogue" | "game" | "reveal" | "quiz" | "reward";
const SCENES: Scene[] = ["story", "dialogue", "game", "reveal", "quiz", "reward"];
const SCENE_LABEL: Record<Scene, string> = {
  story: "Story",
  dialogue: "Meet the heroes",
  game: "Fill the chest",
  reveal: "The secret",
  quiz: "Your turn",
  reward: "Victory",
};

export const LevelMagicKingdomChapter1: React.FC = () => {
  const [scene, setScene] = useState<Scene>("story");
  const reduce = useReducedMotion();
  const idx = SCENES.indexOf(scene);
  const go = (s: Scene) => setScene(s);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[oklch(0.16_0.03_265)] text-white antialiased">
      <SkyBackdrop reduce={!!reduce} />
      <TopBar sceneIdx={idx} total={SCENES.length} sceneLabel={SCENE_LABEL[scene]} />

      <main className="relative z-10 flex h-full w-full items-center justify-center">
        <AnimatePresence mode="wait">
          {scene === "story" && (
            <SceneWrap key="story">
              <StoryIntro onBegin={() => go("dialogue")} onSkip={() => go("game")} reduce={!!reduce} />
            </SceneWrap>
          )}
          {scene === "dialogue" && (
            <SceneWrap key="dialogue">
              <DialogueScene onContinue={() => go("game")} />
            </SceneWrap>
          )}
          {scene === "game" && (
            <SceneWrap key="game">
              <AppleDragGame onDone={() => go("reveal")} />
            </SceneWrap>
          )}
          {scene === "reveal" && (
            <SceneWrap key="reveal">
              <CodeReveal onContinue={() => go("quiz")} />
            </SceneWrap>
          )}
          {scene === "quiz" && (
            <SceneWrap key="quiz">
              <QuizCard onDone={() => go("reward")} />
            </SceneWrap>
          )}
          {scene === "reward" && (
            <SceneWrap key="reward">
              <RewardScreen />
            </SceneWrap>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

function SceneWrap({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.01 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {children}
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Global HUD
// -----------------------------------------------------------------------------
function TopBar({ sceneIdx, total, sceneLabel }: { sceneIdx: number; total: number; sceneLabel: string }) {
  const pct = ((sceneIdx + 1) / total) * 100;
  return (
    <div className="pointer-events-none absolute top-0 left-0 right-0 z-30 flex items-center gap-4 p-4 sm:p-6">
      <Link
        to="/world/magic-kingdom"
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/15 backdrop-blur-md transition hover:bg-white/15"
        aria-label="Back to Magic Kingdom map"
      >
        <span>←</span> Map
      </Link>
      <div className="pointer-events-auto flex-1 rounded-full bg-white/10 p-1 ring-1 ring-white/15 backdrop-blur-md">
        <div className="relative h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg, var(--accent), var(--primary) 55%, var(--secondary))",
            }}
            initial={false}
            animate={{ width: `${pct}%` }}
            transition={{ type: "spring", stiffness: 90, damping: 18 }}
          />
        </div>
      </div>
      <div className="pointer-events-auto hidden rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white/80 ring-1 ring-white/15 backdrop-blur-md sm:block">
        Ch. 1 · {sceneLabel}
      </div>
    </div>
  );
}

function SkyBackdrop({ reduce }: { reduce: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 z-0 overflow-hidden">
      {/* Dawn sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, oklch(0.62 0.16 260) 0%, oklch(0.34 0.12 275) 45%, oklch(0.18 0.06 275) 100%)",
        }}
      />
      {/* Sun / crystal glow */}
      <div
        className="absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--warning), transparent 60%)" }}
      />
      {/* Hills */}
      <svg
        viewBox="0 0 1440 320"
        className="absolute bottom-0 left-0 h-[38%] w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="hillA" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.55 0.14 155)" />
            <stop offset="1" stopColor="oklch(0.32 0.08 160)" />
          </linearGradient>
          <linearGradient id="hillB" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.42 0.11 160)" />
            <stop offset="1" stopColor="oklch(0.22 0.06 170)" />
          </linearGradient>
        </defs>
        <path
          fill="url(#hillA)"
          d="M0,180 C220,90 420,240 720,160 C1020,80 1220,220 1440,150 L1440,320 L0,320 Z"
          opacity="0.9"
        />
        <path
          fill="url(#hillB)"
          d="M0,240 C240,180 460,300 780,220 C1080,150 1260,280 1440,220 L1440,320 L0,320 Z"
        />
      </svg>
      {/* Clouds */}
      {!reduce && <Clouds />}
      {/* Fireflies */}
      {!reduce && <Fireflies count={22} />}
    </div>
  );
}

function Clouds() {
  const clouds = useMemo(
    () => [
      { top: "10%", size: 220, delay: 0, duration: 70 },
      { top: "22%", size: 160, delay: 8, duration: 90 },
      { top: "6%", size: 300, delay: 20, duration: 110 },
      { top: "30%", size: 140, delay: 4, duration: 80 },
    ],
    [],
  );
  return (
    <>
      {clouds.map((c, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white/25 blur-2xl"
          style={{ top: c.top, width: c.size, height: c.size * 0.5 }}
          initial={{ x: "-20vw" }}
          animate={{ x: "120vw" }}
          transition={{ duration: c.duration, delay: c.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </>
  );
}

function Fireflies({ count }: { count: number }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        x: Math.random() * 100,
        y: 40 + Math.random() * 55,
        d: 4 + Math.random() * 6,
        s: 2 + Math.random() * 3,
        k: i,
      })),
    [count],
  );
  return (
    <>
      {flies.map((f) => (
        <motion.span
          key={f.k}
          className="absolute rounded-full bg-[color:var(--warning)]"
          style={{
            left: `${f.x}%`,
            top: `${f.y}%`,
            width: f.s,
            height: f.s,
            boxShadow: "0 0 12px 4px oklch(0.85 0.16 85 / 0.7)",
          }}
          animate={{ y: [0, -20, 0], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: f.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </>
  );
}

// -----------------------------------------------------------------------------
// SVG Characters
// -----------------------------------------------------------------------------
function PrincessLuna({ size = 220 }: { size?: number }) {
  return (
    <motion.svg
      viewBox="0 0 200 260"
      width={size}
      height={(size * 260) / 200}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Princess Luna"
    >
      <defs>
        <linearGradient id="gown" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.78 0.15 320)" />
          <stop offset="1" stopColor="oklch(0.48 0.2 300)" />
        </linearGradient>
        <radialGradient id="halo" cx="50%" cy="30%" r="60%">
          <stop offset="0" stopColor="oklch(0.95 0.14 85 / 0.9)" />
          <stop offset="1" stopColor="oklch(0.95 0.14 85 / 0)" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="70" rx="80" ry="80" fill="url(#halo)" />
      <path d="M60 250 Q100 130 140 250 Z" fill="url(#gown)" />
      <path d="M75 180 Q100 160 125 180 L120 210 Q100 200 80 210 Z" fill="oklch(0.98 0.02 90)" opacity="0.6" />
      <circle cx="100" cy="120" r="18" fill="oklch(0.9 0.05 60)" />
      <circle cx="100" cy="82" r="26" fill="oklch(0.92 0.05 60)" />
      <path d="M74 78 Q78 40 100 42 Q122 40 126 78 Q126 92 118 92 Q110 76 100 76 Q90 76 82 92 Q74 92 74 78 Z" fill="oklch(0.32 0.06 45)" />
      <path d="M84 52 L92 64 L100 50 L108 64 L116 52 L114 66 L86 66 Z" fill="oklch(0.85 0.16 85)" stroke="oklch(0.55 0.14 60)" strokeWidth="1.5" />
      <circle cx="100" cy="58" r="2.5" fill="oklch(0.7 0.2 25)" />
      <circle cx="92" cy="86" r="2.2" fill="#111" />
      <circle cx="108" cy="86" r="2.2" fill="#111" />
      <path d="M94 96 Q100 100 106 96" stroke="oklch(0.4 0.1 20)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <circle cx="88" cy="94" r="3" fill="oklch(0.8 0.14 20 / 0.6)" />
      <circle cx="112" cy="94" r="3" fill="oklch(0.8 0.14 20 / 0.6)" />
    </motion.svg>
  );
}

function BitRobot({ size = 150, mood = "idle" }: { size?: number; mood?: "idle" | "happy" | "think" }) {
  return (
    <motion.svg
      viewBox="0 0 180 200"
      width={size}
      height={(size * 200) / 180}
      animate={mood === "happy" ? { y: [0, -14, 0], rotate: [0, -4, 4, 0] } : { y: [0, -6, 0] }}
      transition={{ duration: mood === "happy" ? 0.9 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Bit the robot"
    >
      <defs>
        <linearGradient id="botBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.82 0.14 240)" />
          <stop offset="1" stopColor="oklch(0.52 0.22 267)" />
        </linearGradient>
        <radialGradient id="eye" cx="30%" cy="30%" r="70%">
          <stop offset="0" stopColor="oklch(0.98 0.08 200)" />
          <stop offset="1" stopColor="oklch(0.6 0.22 240)" />
        </radialGradient>
      </defs>
      <ellipse cx="90" cy="192" rx="46" ry="6" fill="rgba(0,0,0,0.35)" />
      <line x1="90" y1="30" x2="90" y2="14" stroke="oklch(0.7 0.15 240)" strokeWidth="3" strokeLinecap="round" />
      <motion.circle
        cx="90"
        cy="10"
        r="6"
        fill="oklch(0.85 0.16 85)"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <rect x="42" y="28" width="96" height="86" rx="26" fill="url(#botBody)" />
      <rect x="46" y="32" width="88" height="30" rx="20" fill="oklch(0.95 0.02 240 / 0.25)" />
      <circle cx="72" cy="72" r="14" fill="#0b1220" />
      <circle cx="72" cy="72" r="10" fill="url(#eye)" />
      <circle cx="68" cy="68" r="3" fill="white" />
      <circle cx="108" cy="72" r="14" fill="#0b1220" />
      <circle cx="108" cy="72" r="10" fill="url(#eye)" />
      <circle cx="104" cy="68" r="3" fill="white" />
      {mood === "happy" ? (
        <path d="M74 96 Q90 110 106 96" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
      ) : (
        <rect x="80" y="96" width="20" height="4" rx="2" fill="white" />
      )}
      <rect x="56" y="116" width="68" height="60" rx="18" fill="url(#botBody)" />
      <circle cx="90" cy="146" r="10" fill="oklch(0.85 0.16 85)" />
      <rect x="34" y="124" width="18" height="34" rx="9" fill="oklch(0.52 0.22 267)" />
      <rect x="128" y="124" width="18" height="34" rx="9" fill="oklch(0.52 0.22 267)" />
    </motion.svg>
  );
}

function TreasureChest({
  size = 220,
  open = false,
  glow = false,
  filled = 0,
  total = 5,
}: {
  size?: number;
  open?: boolean;
  glow?: boolean;
  filled?: number;
  total?: number;
}) {
  return (
    <div className="relative" style={{ width: size, height: size * 0.9 }}>
      {glow && (
        <motion.div
          className="absolute inset-0 -z-0 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, oklch(0.9 0.18 85 / 0.85), transparent 65%)",
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      )}
      <svg viewBox="0 0 220 200" width={size} height={size * 0.9} className="relative z-10">
        <defs>
          <linearGradient id="wood" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.55 0.09 55)" />
            <stop offset="1" stopColor="oklch(0.32 0.07 40)" />
          </linearGradient>
          <linearGradient id="gold" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.92 0.16 85)" />
            <stop offset="1" stopColor="oklch(0.65 0.16 70)" />
          </linearGradient>
        </defs>
        <rect x="20" y="90" width="180" height="90" rx="14" fill="url(#wood)" />
        <rect x="20" y="90" width="180" height="14" fill="oklch(0.4 0.08 45)" />
        <rect x="20" y="110" width="180" height="6" fill="url(#gold)" />
        <rect x="20" y="160" width="180" height="6" fill="url(#gold)" />
        <motion.g
          initial={false}
          animate={{ rotate: open ? -55 : 0 }}
          style={{ transformOrigin: "20px 90px" }}
          transition={{ type: "spring", stiffness: 120, damping: 12 }}
        >
          <path d="M20 90 Q110 30 200 90 L200 96 L20 96 Z" fill="url(#wood)" />
          <path d="M20 90 Q110 30 200 90" fill="none" stroke="url(#gold)" strokeWidth="5" />
        </motion.g>
        <rect x="98" y="118" width="24" height="30" rx="4" fill="url(#gold)" />
        <circle cx="110" cy="128" r="3.5" fill="oklch(0.25 0.05 40)" />
        {filled >= total && (
          <motion.path
            d="M20 96 L200 96 L200 130 Q110 100 20 130 Z"
            fill="oklch(0.95 0.15 85)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.6, 0.3] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
        )}
      </svg>
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "size-2.5 rounded-full ring-1 ring-white/40",
              i < filled ? "bg-[color:var(--warning)]" : "bg-white/15",
            )}
          />
        ))}
      </div>
    </div>
  );
}

function MagicCrystal({ size = 90, pulse = true }: { size?: number; pulse?: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 100 140"
      width={size}
      height={(size * 140) / 100}
      animate={pulse ? { y: [0, -8, 0] } : undefined}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      aria-label="Magic crystal"
    >
      <defs>
        <linearGradient id="cryst" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="oklch(0.9 0.18 200)" />
          <stop offset="1" stopColor="oklch(0.55 0.22 280)" />
        </linearGradient>
      </defs>
      <motion.g
        animate={pulse ? { scale: [1, 1.05, 1] } : undefined}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 70px" }}
      >
        <polygon points="50,10 82,50 62,120 38,120 18,50" fill="url(#cryst)" />
        <polygon points="50,10 62,120 82,50" fill="oklch(0.98 0.05 220 / 0.4)" />
        <polygon points="50,10 38,120 18,50" fill="oklch(0.2 0.1 280 / 0.35)" />
      </motion.g>
    </motion.svg>
  );
}

// -----------------------------------------------------------------------------
// Scene 1: Story
// -----------------------------------------------------------------------------
function StoryIntro({ onBegin, onSkip, reduce }: { onBegin: () => void; onSkip: () => void; reduce: boolean }) {
  const [step, setStep] = useState<0 | 1>(0);
  return (
    <div className="relative flex h-full w-full items-end justify-center pb-16 sm:pb-24">
      {/* Castle vector */}
      <svg
        viewBox="0 0 800 300"
        className="pointer-events-none absolute bottom-[26%] left-1/2 h-[36%] w-[min(1100px,100%)] -translate-x-1/2 opacity-90"
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <linearGradient id="castle" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="oklch(0.78 0.05 260)" />
            <stop offset="1" stopColor="oklch(0.35 0.08 275)" />
          </linearGradient>
        </defs>
        <g fill="url(#castle)">
          <rect x="340" y="120" width="120" height="180" />
          <polygon points="340,120 400,60 460,120" />
          <rect x="260" y="170" width="70" height="130" />
          <polygon points="260,170 295,120 330,170" />
          <rect x="470" y="170" width="70" height="130" />
          <polygon points="470,170 505,120 540,170" />
          <rect x="200" y="220" width="60" height="80" />
          <rect x="540" y="220" width="60" height="80" />
        </g>
        <rect x="386" y="200" width="28" height="60" rx="14" fill="oklch(0.25 0.08 275)" />
        <circle cx="400" cy="90" r="6" fill="oklch(0.85 0.16 85)" />
      </svg>

      <div className="relative z-10 flex w-full max-w-6xl items-end justify-around px-6">
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative"
        >
          <PrincessLuna size={240} />
        </motion.div>

        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="relative flex flex-col items-center gap-4"
        >
          <MagicCrystal size={110} pulse={!reduce} />
          <TreasureChest size={200} open={false} glow={false} filled={0} total={5} />
        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
        >
          <BitRobot size={180} />
        </motion.div>
      </div>

      <motion.div
        key={step}
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="absolute bottom-6 left-1/2 z-20 w-[min(720px,92%)] -translate-x-1/2 rounded-3xl bg-white/95 p-6 text-[oklch(0.2_0.03_265)] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/40 backdrop-blur"
      >
        <div className="flex items-start gap-4">
          <div className="grid size-12 place-items-center rounded-2xl bg-[color:var(--secondary)] text-lg font-black text-white">
            {step === 0 ? "👑" : "🤖"}
          </div>
          <div className="flex-1">
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--secondary)]">
              {step === 0 ? "Princess Luna" : "Bit"}
            </div>
            <p className="mt-1 font-display text-xl leading-snug sm:text-2xl">
              {step === 0
                ? "Oh no… our treasure chest is empty. Without the treasure, the kingdom will lose its magic."
                : "Don't worry! Let's fill it together."}
            </p>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full px-4 py-2 text-sm font-semibold text-[oklch(0.4_0.03_265)] hover:bg-black/5"
          >
            Skip story
          </button>
          {step === 0 ? (
            <PrimaryButton onClick={() => setStep(1)}>Continue →</PrimaryButton>
          ) : (
            <PrimaryButton onClick={onBegin}>Begin adventure ✨</PrimaryButton>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Scene 2: Dialogue
// -----------------------------------------------------------------------------
function DialogueScene({ onContinue }: { onContinue: () => void }) {
  const [i, setI] = useState(0);
  const lines = [
    { who: "Princess Luna", tone: "primary", text: "We need five magical apples." },
    { who: "Bit", tone: "accent", text: "But first… we need somewhere to store them." },
  ];
  const line = lines[i];
  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6 }}
        className="flex items-end gap-8 sm:gap-16"
      >
        <div className="relative">
          <PrincessLuna size={220} />
          {i === 0 && <SpeechBubble side="right">{lines[0].text}</SpeechBubble>}
        </div>
        <div className="relative">
          <BitRobot size={170} mood="think" />
          {i === 1 && <SpeechBubble side="left">{lines[1].text}</SpeechBubble>}
        </div>
      </motion.div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
        <PrimaryButton onClick={() => (i === 0 ? setI(1) : onContinue())}>
          {i === 0 ? "Continue →" : "Let's build a chest 🧰"}
        </PrimaryButton>
      </div>
      <div className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
        {line.who}
      </div>
    </div>
  );
}

function SpeechBubble({ children, side }: { children: React.ReactNode; side: "left" | "right" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className={cn(
        "absolute -top-4 max-w-[240px] rounded-3xl bg-white p-4 text-sm font-semibold leading-snug text-[oklch(0.2_0.03_265)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] sm:text-base",
        side === "right" ? "left-full ml-4" : "right-full mr-4",
      )}
    >
      {children}
      <span
        className={cn(
          "absolute bottom-4 size-4 rotate-45 bg-white",
          side === "right" ? "-left-1.5" : "-right-1.5",
        )}
      />
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Scene 3: Apple drag mini-game
// -----------------------------------------------------------------------------
type Apple = { id: number; x: number; y: number; placed: boolean };

function AppleDragGame({ onDone }: { onDone: () => void }) {
  const initial: Apple[] = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        x: 8 + i * 14,
        y: 62 + (i % 2 === 0 ? 0 : 8),
        placed: false,
      })),
    [],
  );
  const [apples, setApples] = useState(initial);
  const [dragging, setDragging] = useState<number | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const stageRef = useRef<HTMLDivElement>(null);
  const chestRef = useRef<HTMLDivElement>(null);
  const [sparks, setSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  const placed = apples.filter((a) => a.placed).length;
  const done = placed === apples.length;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(onDone, 1900);
    return () => clearTimeout(t);
  }, [done, onDone]);

  function onPointerDown(e: React.PointerEvent, id: number) {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setDragging(id);
    const rect = stageRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }
  function onPointerMove(e: React.PointerEvent) {
    if (dragging == null) return;
    const rect = stageRef.current!.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }
  function onPointerUp(e: React.PointerEvent) {
    if (dragging == null) return;
    const chest = chestRef.current?.getBoundingClientRect();
    const hit =
      chest &&
      e.clientX >= chest.left &&
      e.clientX <= chest.right &&
      e.clientY >= chest.top &&
      e.clientY <= chest.bottom;
    if (hit) {
      setApples((a) => a.map((x) => (x.id === dragging ? { ...x, placed: true } : x)));
      const rect = stageRef.current!.getBoundingClientRect();
      const sx = ((chest!.left + chest!.width / 2 - rect.left) / rect.width) * 100;
      const sy = ((chest!.top + chest!.height / 2 - rect.top) / rect.height) * 100;
      const id = Date.now();
      setSparks((s) => [...s, { id, x: sx, y: sy }]);
      setTimeout(() => setSparks((s) => s.filter((x) => x.id !== id)), 900);
    }
    setDragging(null);
  }

  return (
    <div
      ref={stageRef}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className="relative h-full w-full select-none"
    >
      <div className="absolute top-20 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-white/95 px-5 py-2 text-[oklch(0.2_0.03_265)] shadow-lg">
        <span className="text-xl">🤖</span>
        <p className="font-display text-sm sm:text-base">
          Drag <b>{5 - placed}</b> apple{5 - placed === 1 ? "" : "s"} into the chest!
        </p>
      </div>

      <div
        ref={chestRef}
        className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      >
        <TreasureChest size={280} open={done} glow={placed > 0} filled={placed} total={5} />
      </div>

      <div className="pointer-events-none absolute right-[6%] top-[20%]">
        <MagicCrystal size={done ? 130 : 90} pulse={done} />
      </div>
      <div className="pointer-events-none absolute left-[6%] bottom-[12%]">
        <BitRobot size={140} mood={done ? "happy" : "idle"} />
      </div>

      {apples.map((a) => {
        const isDrag = dragging === a.id;
        if (a.placed) return null;
        return (
          <button
            key={a.id}
            type="button"
            onPointerDown={(e) => onPointerDown(e, a.id)}
            className="absolute z-20 grid size-16 cursor-grab place-items-center rounded-full active:cursor-grabbing touch-none outline-none"
            style={{
              left: isDrag ? pos.x - 32 : `calc(${a.x}% )`,
              top: isDrag ? pos.y - 32 : `${a.y}%`,
              transition: isDrag ? "none" : "left 0.4s, top 0.4s",
            }}
            aria-label={`Magic apple ${a.id + 1}`}
          >
            <Apple3D />
          </button>
        );
      })}

      <AnimatePresence>
        {sparks.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0.4 }}
            animate={{ opacity: 0, scale: 1.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="pointer-events-none absolute text-3xl"
            style={{ left: `${s.x}%`, top: `${s.y}%`, transform: "translate(-50%,-50%)" }}
          >
            ✨
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {done && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-24 flex flex-col items-center gap-3"
          >
            <div className="rounded-full bg-[color:var(--success)] px-6 py-2 font-display text-xl text-white shadow-lg">
              The chest is full! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Apple3D() {
  return (
    <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden>
      <defs>
        <radialGradient id="ap" cx="35%" cy="30%" r="70%">
          <stop offset="0" stopColor="oklch(0.9 0.15 25)" />
          <stop offset="1" stopColor="oklch(0.5 0.22 25)" />
        </radialGradient>
      </defs>
      <ellipse cx="32" cy="38" rx="22" ry="20" fill="url(#ap)" />
      <path d="M32 18 Q34 8 42 8" stroke="oklch(0.35 0.09 130)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="42" cy="14" rx="6" ry="3" fill="oklch(0.55 0.18 145)" />
      <ellipse cx="24" cy="28" rx="4" ry="6" fill="white" opacity="0.6" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Scene 4: Code typing reveal
// -----------------------------------------------------------------------------
function CodeReveal({ onContinue }: { onContinue: () => void }) {
  const full = "let apples = 5;";
  const [typed, setTyped] = useState("");
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTyped(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 90);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-full w-full items-center justify-center px-6">
      <div className="grid w-full max-w-6xl gap-8 md:grid-cols-2">
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center gap-4 rounded-3xl bg-white/5 p-8 ring-1 ring-white/10 backdrop-blur"
        >
          <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-white/60">
            Label
          </div>
          <div className="rounded-full bg-[color:var(--warning)] px-5 py-2 font-display text-2xl text-[oklch(0.25_0.06_60)] shadow-lg">
            apples
          </div>
          <TreasureChest size={240} open glow filled={5} total={5} />
          <div className="mt-2 flex gap-1 text-3xl">🍎🍎🍎🍎🍎</div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-white/50">
            Contains 5
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-col gap-5"
        >
          <div className="overflow-hidden rounded-3xl bg-[#0F1220] ring-1 ring-white/10 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.04] px-4 py-3">
              <span className="size-2.5 rounded-full bg-[oklch(0.7_0.2_25)]" />
              <span className="size-2.5 rounded-full bg-[color:var(--warning)]" />
              <span className="size-2.5 rounded-full bg-[color:var(--success)]" />
              <span className="ml-3 font-mono text-xs text-white/50">spellbook.js</span>
            </div>
            <pre className="px-6 py-8 font-mono text-2xl leading-relaxed">
              <code>
                <span style={{ color: "#B195FF" }}>let </span>
                <span style={{ color: "#00D4FF" }}>apples </span>
                <span style={{ color: "#8A8FE8" }}>= </span>
                <span style={{ color: "#FBBF24" }}>
                  {typed.includes("5") ? "5" : ""}
                </span>
                <span style={{ color: "#8A8FE8" }}>{typed.endsWith(";") ? ";" : ""}</span>
                <motion.span
                  className="ml-0.5 inline-block w-2 bg-white/70"
                  style={{ height: "1.5em", verticalAlign: "middle" }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </code>
            </pre>
          </div>

          <div className="flex items-start gap-3 rounded-3xl bg-white/95 p-5 text-[oklch(0.2_0.03_265)] shadow-lg">
            <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[color:var(--primary)] text-xl">
              🤖
            </div>
            <p className="text-sm leading-snug sm:text-base">
              A <b>variable</b> is just like a treasure chest. The name{" "}
              <span className="rounded bg-[oklch(0.9_0.05_220)] px-1.5 font-mono text-[color:var(--primary)]">
                apples
              </span>{" "}
              tells us what's inside. The number{" "}
              <span className="rounded bg-[oklch(0.95_0.14_85)] px-1.5 font-mono text-[oklch(0.35_0.1_60)]">
                5
              </span>{" "}
              is what we stored.
            </p>
          </div>

          <div className="flex justify-end">
            <PrimaryButton onClick={onContinue}>I got it! →</PrimaryButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Scene 5: Quiz Card
// -----------------------------------------------------------------------------
function QuizCard({ onDone }: { onDone: () => void }) {
  const options = [4, 5, 6, 7];
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);

  function choose(n: number) {
    setPicked(n);
    if (n === 5) {
      setCorrect(true);
      setTimeout(onDone, 1600);
    }
  }

  return (
    <div className="relative flex h-full w-full items-center justify-center px-6">
      <div className="w-full max-w-3xl rounded-[36px] bg-white/95 p-8 text-[oklch(0.2_0.03_265)] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)] sm:p-10">
        <div className="flex items-start gap-4">
          <div className="grid size-14 place-items-center rounded-2xl bg-[color:var(--primary)] text-2xl">
            🤖
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-[0.16em] text-[color:var(--primary)]">
              Bit asks
            </div>
            <h2 className="mt-1 font-display text-2xl sm:text-3xl">
              Can you help me store the apples?
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-3xl bg-[oklch(0.97_0.01_260)] p-6 text-center ring-1 ring-black/5">
          <pre className="font-mono text-2xl sm:text-3xl">
            <span style={{ color: "oklch(0.5 0.22 275)" }}>let </span>
            <span style={{ color: "oklch(0.55 0.2 240)" }}>apples </span>
            <span>= </span>
            <span className="inline-block min-w-[1.6em] rounded-lg border-2 border-dashed border-[color:var(--primary)]/40 px-2 text-primary">
              {picked ?? "?"}
            </span>
            <span>;</span>
          </pre>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {options.map((n) => {
            const isPicked = picked === n;
            const isRight = correct && n === 5;
            const isWrong = isPicked && n !== 5;
            return (
              <motion.button
                key={n}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => choose(n)}
                disabled={correct}
                animate={isWrong ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
                className={cn(
                  "rounded-2xl px-4 py-5 text-3xl font-black shadow-md ring-1 transition outline-none",
                  isRight && "bg-[color:var(--success)] text-white ring-[color:var(--success)]",
                  isWrong && "bg-[oklch(0.95_0.06_25)] text-[oklch(0.4_0.15_25)] ring-[oklch(0.85_0.14_25)]",
                  !isPicked &&
                    "bg-white text-[oklch(0.2_0.03_265)] ring-black/10 hover:bg-[oklch(0.98_0.02_260)]",
                )}
              >
                {n}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {picked !== null && (
            <motion.div
              key={correct ? "y" : `n-${picked}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                "mt-6 rounded-2xl p-4 text-center font-display text-lg",
                correct
                  ? "bg-[color:var(--success)]/10 text-[color:var(--success)]"
                  : "bg-[oklch(0.95_0.06_25)] text-[oklch(0.4_0.15_25)]",
              )}
            >
              {correct
                ? "You did it! The treasure glows. ✨"
                : "Great try! Let's count the apples together — there were 5 🍎"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Scene 6: Reward victory screen
// -----------------------------------------------------------------------------
function RewardScreen() {
  const navigate = useNavigate();
  const rewards = [
    { icon: "⭐", label: "+50 XP" },
    { icon: "🪙", label: "+20 Coins" },
    { icon: "🏆", label: "Treasure Keeper Badge" },
    { icon: "🎁", label: "New Story Page Unlocked" },
  ];
  return (
    <div className="relative flex h-full w-full items-center justify-center px-6">
      <Confetti />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="relative z-10 w-full max-w-2xl rounded-[40px] bg-white/95 p-8 text-center text-[oklch(0.2_0.03_265)] shadow-[0_50px_100px_-30px_rgba(0,0,0,0.7)] sm:p-12"
      >
        <div className="mx-auto flex w-fit items-center gap-4">
          <TreasureChest size={140} open glow filled={5} total={5} />
          <MagicCrystal size={90} />
        </div>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl"
        >
          ✨ Level Complete!
        </motion.h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--secondary)]">
          Crystal fragment restored
        </p>

        <ul className="mx-auto mt-6 grid max-w-xl grid-cols-2 gap-3">
          {rewards.map((r, i) => (
            <motion.li
              key={r.label}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35 + i * 0.1 }}
              className="flex items-center gap-3 rounded-2xl bg-[oklch(0.97_0.01_260)] p-3 text-left ring-1 ring-black/5"
            >
              <span className="grid size-10 place-items-center rounded-xl bg-[color:var(--warning)]/20 text-2xl">
                {r.icon}
              </span>
              <span className="font-display text-sm sm:text-base">{r.label}</span>
            </motion.li>
          ))}
        </ul>

        <div className="mt-8">
          <PrimaryButton onClick={() => navigate("/world/magic-kingdom")}>
            Continue journey →
          </PrimaryButton>
        </div>
      </motion.div>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        d: 2 + Math.random() * 3,
        r: Math.random() * 360,
        c: [
          "oklch(0.85 0.16 85)",
          "oklch(0.7 0.2 25)",
          "oklch(0.72 0.18 145)",
          "oklch(0.7 0.2 275)",
          "oklch(0.72 0.16 240)",
        ][i % 5],
      })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute top-[-10%] block h-3 w-2 rounded-sm"
          style={{ left: `${b.x}%`, background: b.c, rotate: b.r }}
          animate={{ y: ["-10vh", "110vh"], rotate: b.r + 360 }}
          transition={{ duration: b.d, repeat: Infinity, ease: "linear", delay: b.d * 0.1 }}
        />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Primary CTA button style
// -----------------------------------------------------------------------------
function PrimaryButton({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      className="relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3 font-display text-base font-bold text-white shadow-[0_12px_30px_-10px_rgba(79,70,229,0.7)] ring-1 ring-white/20 outline-none"
      style={{
        background:
          "linear-gradient(135deg, var(--primary), var(--secondary))",
      }}
    >
      <span className="relative z-10">{children}</span>
      <motion.span
        aria-hidden
        className="absolute inset-0 bg-white/25"
        initial={{ x: "-120%" }}
        animate={{ x: "120%" }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
        style={{ mixBlendMode: "overlay" }}
      />
    </motion.button>
  );
}
