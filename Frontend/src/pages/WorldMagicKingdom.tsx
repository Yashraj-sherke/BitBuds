import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import mapBg from "../assets/worlds/magic-kingdom-map.jpg";
import mascotAsset from "../assets/bit-mascot.png";
import { cn } from "../lib/utils";

type LevelState = "completed" | "unlocked" | "locked" | "soon";
type Level = {
  n: number;
  name: string;
  reward: string;
  x: number;
  y: number;
  state: LevelState;
  stars?: 0 | 1 | 2 | 3;
};

const LEVELS: Level[] = [
  { n: 1, name: "The Empty Treasure", reward: "🎁", x: 50, y: 95, state: "completed", stars: 3 },
  { n: 2, name: "Magic Box", reward: "📦", x: 28, y: 87, state: "completed", stars: 3 },
  { n: 3, name: "Count the Stars", reward: "⭐", x: 60, y: 79, state: "completed", stars: 2 },
  { n: 4, name: "Wizard's Potion", reward: "🧪", x: 74, y: 70, state: "completed", stars: 3 },
  { n: 5, name: "Crystal Cave", reward: "💎", x: 45, y: 61, state: "completed", stars: 2 },
  { n: 6, name: "Magic Backpack", reward: "🎒", x: 22, y: 52, state: "completed", stars: 3 },
  { n: 7, name: "The Unicorn", reward: "🦄", x: 55, y: 44, state: "unlocked", stars: 0 },
  { n: 8, name: "Ancient Spell", reward: "📜", x: 76, y: 35, state: "locked" },
  { n: 9, name: "Bridge of Logic", reward: "🌉", x: 38, y: 26, state: "locked" },
  { n: 10, name: "Dragon Castle", reward: "🏰", x: 55, y: 12, state: "soon" },
];

const PLAYER = { xp: 1260, coins: 428, progress: 70, name: "Explorer" };
const CRYSTAL = { collected: 7, total: 10, next: "Magic Crown" };

export const WorldMagicKingdom: React.FC = () => {
  const reduce = useReducedMotion();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [openLevel, setOpenLevel] = useState<Level | null>(null);

  const currentIdx = LEVELS.findIndex((l) => l.state === "unlocked");
  const currentLevel = LEVELS[currentIdx];

  // Auto-scroll camera to the current level on mount
  useEffect(() => {
    const el = scrollerRef.current;
    const map = mapRef.current;
    if (!el || !map || !currentLevel) return;
    const target = (currentLevel.y / 100) * map.offsetHeight - el.clientHeight * 0.55;
    el.scrollTo({ top: Math.max(0, target), behavior: reduce ? "auto" : "smooth" });
  }, [currentLevel, reduce]);

  return (
    <div className="fixed inset-0 overflow-hidden bg-[oklch(0.22_0.06_275)] text-white">
      {/* Scrollable camera */}
      <div
        ref={scrollerRef}
        className="scrollbar-none absolute inset-0 overflow-y-auto overflow-x-hidden"
      >
        <div
          ref={mapRef}
          className="relative w-full"
          style={{ height: "min(4200px, 520vh)" }}
        >
          {/* Background illustration */}
          <img
            src={mapBg}
            alt="Magic Kingdom"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
            width={768}
            height={1920}
          />
          {/* Side gradient so wide viewports blend into the dark frame */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[oklch(0.22_0.06_275)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[oklch(0.22_0.06_275)] to-transparent" />
          {/* Subtle vignette to blend */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

          <AmbientLayer />
          <WindingPath />
          <LevelNodes onOpen={setOpenLevel} />
          <BitCompanion level={currentLevel} />
        </div>
      </div>

      <TopBar />
      <BottomBar />

      <AnimatePresence>
        {openLevel && (
          <LevelPortal level={openLevel} onClose={() => setOpenLevel(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// -----------------------------------------------------------------------------
// Top / bottom HUD
// -----------------------------------------------------------------------------
function TopBar() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-[720px] items-center gap-2 rounded-2xl bg-white/10 p-2 pl-2 pr-3 backdrop-blur-xl ring-1 ring-white/20">
        <Link
          to="/dashboard"
          aria-label="Back to adventure home"
          className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-lg transition hover:bg-white/25 text-white"
        >
          ←
        </Link>
        <div className="min-w-0 flex-1">
          <div className="font-accent text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
            World 1
          </div>
          <div className="truncate font-display text-sm font-bold leading-tight">
            🏰 Magic Kingdom
          </div>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <div className="h-2 w-28 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${PLAYER.progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-accent to-secondary"
            />
          </div>
          <span className="text-xs font-bold">{PLAYER.progress}%</span>
        </div>
        <HudChip icon="✨" label={PLAYER.xp.toLocaleString()} />
        <HudChip icon="🪙" label={PLAYER.coins.toString()} />
        <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-black shadow-lg ring-2 ring-white/40">
          E
        </div>
      </div>
    </div>
  );
}

function HudChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-xs font-black">
      <span className="text-sm leading-none">{icon}</span>
      <span>{label}</span>
    </div>
  );
}

function BottomBar() {
  const pct = (CRYSTAL.collected / CRYSTAL.total) * 100;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 p-3 sm:p-4">
      <div className="pointer-events-auto mx-auto flex max-w-[720px] items-center gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-xl ring-1 ring-white/20">
        <motion.div
          animate={{ rotate: [0, -6, 6, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/40 to-secondary/40 text-xl shadow-inner"
        >
          💎
        </motion.div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <div className="font-accent text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">
              Crystal Fragments
            </div>
            <div className="text-xs font-black">
              {CRYSTAL.collected}<span className="text-white/60"> / {CRYSTAL.total}</span>
            </div>
          </div>
          <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/15">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-warning via-accent to-secondary"
            />
          </div>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-xl bg-white/10 px-3 py-2 sm:flex">
          <span className="text-lg">👑</span>
          <div className="text-left">
            <div className="font-accent text-[9px] font-extrabold uppercase tracking-[0.18em] text-white/70">
              Next reward
            </div>
            <div className="text-xs font-bold leading-tight">{CRYSTAL.next}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Winding path — SVG path connectors
// -----------------------------------------------------------------------------
function WindingPath() {
  const d = useMemo(() => buildPath(LEVELS), []);
  const completedIdx = LEVELS.reduce((acc, l, i) => (l.state === "completed" ? i : acc), -1);
  const completedFrac = (completedIdx + 1) / LEVELS.length;

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={d}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="1.4 1.4"
        vectorEffect="non-scaling-stroke"
        style={{ filter: "drop-shadow(0 0.4px 0 rgba(0,0,0,0.35))" }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="url(#pathGold)"
        strokeWidth="1.4"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        initial={{ strokeDashoffset: 1, strokeDasharray: 1 }}
        animate={{ strokeDashoffset: 1 - completedFrac }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />
      <defs>
        <linearGradient id="pathGold" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#FFD86B" />
          <stop offset="60%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function buildPath(levels: Level[]) {
  const pts = [...levels].sort((a, b) => b.y - a.y).map((l) => ({ x: l.x, y: l.y }));
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p2.x} ${p2.y}`;
  }
  return d;
}

// -----------------------------------------------------------------------------
// Level nodes
// -----------------------------------------------------------------------------
function LevelNodes({ onOpen }: { onOpen: (l: Level) => void }) {
  return (
    <>
      {LEVELS.map((l, i) => (
        <LevelNode key={l.n} level={l} index={i} onOpen={onOpen} />
      ))}
    </>
  );
}

function LevelNode({
  level,
  index,
  onOpen,
}: {
  level: Level;
  index: number;
  onOpen: (l: Level) => void;
}) {
  const isFinal = level.n === 10;
  const size = isFinal ? 148 : 92;
  const disabled = level.state === "locked" || level.state === "soon";

  const tone =
    level.state === "completed"
      ? "from-[#FDE68A] via-[#FBBF24] to-[#B45309]"
      : level.state === "unlocked"
        ? "from-[#A5F3FC] via-[#7C4DFF] to-[#5B5FEF]"
        : "from-slate-400 via-slate-500 to-slate-700";

  return (
    <motion.button
      type="button"
      aria-label={`Level ${level.n}: ${level.name}`}
      disabled={disabled}
      onClick={() => !disabled && onOpen(level)}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 220, damping: 18 }}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.94 }}
      className={cn(
        "group absolute -translate-x-1/2 -translate-y-1/2 outline-none",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
      )}
      style={{ left: `${level.x}%`, top: `${level.y}%`, width: size, height: size }}
    >
      {/* Halo / glow */}
      {level.state === "unlocked" && (
        <motion.div
          aria-hidden
          className="absolute inset-[-30%] rounded-full bg-[radial-gradient(circle,rgba(124,77,255,0.55),transparent_65%)]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {level.state === "completed" && (
        <div
          aria-hidden
          className="absolute inset-[-20%] rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.5),transparent_65%)]"
        />
      )}

      {/* platform shadow */}
      <div className="absolute inset-x-3 bottom-[-6%] h-4 rounded-[50%] bg-black/40 blur-md" />

      {/* Button surface */}
      <motion.div
        animate={
          level.state === "unlocked"
            ? { y: [0, -4, 0] }
            : level.state === "completed"
              ? { y: [0, -2, 0] }
              : undefined
        }
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className={cn(
          "relative grid h-full w-full place-items-center rounded-full bg-gradient-to-br p-[6px] shadow-[0_18px_35px_-10px_rgba(0,0,0,0.55)]",
          tone,
        )}
      >
        <div
          className={cn(
            "grid h-full w-full place-items-center rounded-full ring-2 ring-white/70",
            disabled ? "bg-slate-800/80" : "bg-white/95 text-slate-900",
          )}
        >
          {level.state === "locked" && <span className="text-2xl">🔒</span>}
          {level.state === "soon" && (
            <div className="text-center">
              <div className="text-2xl">☁️</div>
              <div className="mt-1 font-accent text-[9px] font-black uppercase tracking-widest text-white/80">
                Soon
              </div>
            </div>
          )}
          {(level.state === "unlocked" || level.state === "completed") && (
            <div className="flex flex-col items-center leading-none">
              <div
                className={cn(
                  "font-display font-black",
                  isFinal ? "text-4xl" : "text-2xl",
                )}
              >
                {level.n}
              </div>
              <div className={cn("mt-1", isFinal ? "text-3xl" : "text-lg")}>{level.reward}</div>
            </div>
          )}
        </div>

        {/* Stars */}
        {level.state === "completed" && (
          <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 gap-0.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] shadow">
            {[0, 1, 2].map((s) => (
              <span key={s} className={s < (level.stars ?? 0) ? "text-warning" : "text-white/30"}>★</span>
            ))}
          </div>
        )}

        {level.state === "completed" && !isFinal && (
          <motion.span
            aria-hidden
            className="absolute -right-1 -top-1 text-lg"
            animate={{ rotate: [0, 20, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
          >
            ✨
          </motion.span>
        )}

        {isFinal && (
          <motion.span
            aria-hidden
            className="absolute -top-6 -right-8 text-3xl"
            animate={{ x: [0, 20, 0, -20, 0], y: [0, -8, 0, -6, 0], rotate: [0, 8, 0, -8, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          >
            🐉
          </motion.span>
        )}
      </motion.div>

      {/* Label */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider shadow",
          isFinal ? "-bottom-8" : "-bottom-6",
          level.state === "completed"
            ? "bg-warning/90 text-slate-900"
            : level.state === "unlocked"
              ? "bg-white text-slate-900"
              : "bg-black/60 text-white/80",
        )}
      >
        {level.name}
      </div>
    </motion.button>
  );
}

// -----------------------------------------------------------------------------
// Bit companion
// -----------------------------------------------------------------------------
function BitCompanion({ level }: { level?: Level }) {
  if (!level) return null;
  return (
    <div
      className="absolute z-20 -translate-x-1/2 pointer-events-none"
      style={{ left: `${level.x - 14}%`, top: `${level.y + 3}%` }}
    >
      <div className="relative">
        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-2, 2, -2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <img
            src={mascotAsset}
            alt="Bit"
            width={72}
            height={72}
            className="h-16 w-16 drop-shadow-[0_10px_18px_rgba(0,0,0,0.55)] sm:h-20 sm:w-20 object-contain"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute -top-3 left-16 whitespace-nowrap rounded-2xl rounded-bl-none bg-white px-3 py-1.5 text-xs font-bold text-slate-900 shadow-xl"
        >
          Let&apos;s save the kingdom! 🪄
          <span className="absolute -bottom-1 left-2 h-2 w-2 rotate-45 bg-white" />
        </motion.div>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Ambient layer
// -----------------------------------------------------------------------------
function AmbientLayer() {
  const clouds = useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: 6 + i * 14 + Math.random() * 4,
      size: 60 + Math.random() * 70,
      dur: 30 + Math.random() * 20,
      delay: -Math.random() * 20,
    })),
    [],
  );
  const fireflies = useMemo(
    () => Array.from({ length: 22 }, () => ({
      x: Math.random() * 100,
      y: 10 + Math.random() * 88,
      dur: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    })),
    [],
  );
  const butterflies = useMemo(
    () => Array.from({ length: 4 }, (_, i) => ({
      id: i,
      x: 10 + i * 22 + Math.random() * 10,
      y: 20 + i * 15,
      dur: 10 + Math.random() * 6,
    })),
    [],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {clouds.map((c) => (
        <motion.div
          key={c.id}
          className="absolute"
          style={{ top: `${c.top}%`, left: `-20%`, width: c.size, height: c.size * 0.55 }}
          animate={{ x: ["0%", "700%"] }}
          transition={{ duration: c.dur, delay: c.delay, repeat: Infinity, ease: "linear" }}
        >
          <div className="h-full w-full rounded-full bg-white/70 blur-md" />
        </motion.div>
      ))}

      {fireflies.map((f, i) => (
        <motion.span
          key={i}
          className="absolute size-1.5 rounded-full bg-warning shadow-[0_0_10px_4px_rgba(251,191,36,0.55)]"
          style={{ left: `${f.x}%`, top: `${f.y}%` }}
          animate={{ opacity: [0.1, 1, 0.1], y: [0, -14, 0] }}
          transition={{ duration: f.dur, delay: f.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {butterflies.map((b) => (
        <motion.div
          key={b.id}
          className="absolute text-xl"
          style={{ left: `${b.x}%`, top: `${b.y}%` }}
          animate={{ x: [0, 40, 10, -20, 0], y: [0, -20, 10, -14, 0], rotate: [0, 10, -6, 8, 0] }}
          transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
        >
          🦋
        </motion.div>
      ))}

      <motion.div
        className="absolute top-[8%] text-lg"
        animate={{ x: ["-10%", "110%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        🐦
      </motion.div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Portal Overlay
// -----------------------------------------------------------------------------
function LevelPortal({ level, onClose }: { level: Level; onClose: () => void }) {
  const navigate = useNavigate();
  const canEnter = level.state === "unlocked" || level.state === "completed";
  const enter = () => {
    if (level.n === 1) navigate("/level/magic-kingdom/chapter-1");
  };
  return (
    <motion.div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="absolute size-[520px] rounded-full bg-[conic-gradient(from_0deg,#7C4DFF,#00D4FF,#5B5FEF,#FBBF24,#7C4DFF)] opacity-70 blur-2xl"
        animate={{ rotate: 360, scale: [0.9, 1.05, 0.95, 1] }}
        transition={{ rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity } }}
      />
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-[min(92vw,420px)] overflow-hidden rounded-[32px] bg-white p-6 text-slate-900 shadow-2xl"
      >
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/20 to-transparent" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-2xl text-white shadow-lg">
            {level.reward}
          </div>
          <div className="min-w-0">
            <div className="font-accent text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-500">
              Level {level.n} · Variables
            </div>
            <div className="truncate font-display text-lg font-bold">{level.name}</div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-600">
          Step into the portal and help Bit solve this magical mystery. Collect a crystal
          fragment when you win!
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Reward icon="✨" label="+50 XP" />
          <Reward icon="🪙" label="+20" />
          <Reward icon="💎" label="Fragment" />
        </div>
        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-slate-100 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200"
          >
            Later
          </button>
          <button
            onClick={enter}
            disabled={!canEnter}
            className="flex-[2] rounded-xl bg-gradient-to-r from-primary to-secondary py-3 text-sm font-black text-white shadow-lg hover:brightness-110 disabled:opacity-50"
          >
            Enter portal →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Reward({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2">
      <div className="text-xl">{icon}</div>
      <div className="mt-0.5 text-[11px] font-bold text-slate-600">{label}</div>
    </div>
  );
}

export default WorldMagicKingdom;
