import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { cn } from "../lib/utils";
import statsService from "../services/statsService";

import mascotAsset from "../assets/bit-mascot.png";
import heroIsland from "../assets/hero-island.jpg";
import worldMagic from "../assets/worlds/magic-kingdom.jpg";
import worldSpace from "../assets/worlds/space-mission.jpg";
import worldRobot from "../assets/worlds/robot-factory.jpg";
import worldPirate from "../assets/worlds/pirate-island.jpg";
import worldDino from "../assets/worlds/dinosaur-valley.jpg";

const WORLDS = [
  { id: "magic", name: "Magic Kingdom", tag: "Variables", img: worldMagic, unlocked: true, progress: 70, emoji: "🏰" },
  { id: "space", name: "Space Explorer", tag: "Loops", img: worldSpace, unlocked: false, progress: 0, emoji: "🚀" },
  { id: "robot", name: "Robot Factory", tag: "Functions", img: worldRobot, unlocked: false, progress: 0, emoji: "🤖" },
  { id: "pirate", name: "Pirate Island", tag: "Arrays", img: worldPirate, unlocked: false, progress: 0, emoji: "🏴‍☠️" },
  { id: "dino", name: "Dino Valley", tag: "Conditionals", img: worldDino, unlocked: false, progress: 0, emoji: "🦖" },
  { id: "web", name: "WebDev City", tag: "HTML & CSS", img: worldSpace, unlocked: false, progress: 0, emoji: "🌐" },
  { id: "ai", name: "AI Academy", tag: "Neural nets", img: worldRobot, unlocked: false, progress: 0, emoji: "🧠" },
];

const BADGES = [
  { name: "Treasure Hunter", emoji: "🏆", tone: "warning" as const },
  { name: "Variable Master", emoji: "✨", tone: "primary" as const },
  { name: "Loop Explorer", emoji: "🔁", tone: "accent" as const },
  { name: "Magic Hero", emoji: "🪄", tone: "secondary" as const },
];

const TIMELINE = [
  { when: "Yesterday", title: "Saved the Castle", emoji: "🏰", done: true },
  { when: "Today", title: "Learning Variables", emoji: "✨", current: true },
  { when: "Tomorrow", title: "Dragon Battle", emoji: "🐉", locked: true },
];

const TIPS = [
  "A variable is like a treasure chest that holds one thing at a time.",
  "Use small steps — every hero started with one line of code!",
  "Loops let you repeat magic without saying the spell over and over.",
];

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await statsService.getDashboard();
        setDashboardData(response.data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTipIndex((i) => (i + 1) % TIPS.length), 7000);
    return () => clearInterval(t);
  }, []);

  const stats = useMemo(() => dashboardData?.stats || {}, [dashboardData]);
  const inProgressMissions = useMemo(() => dashboardData?.inProgressMissions || [], [dashboardData]);

  const playerStats = useMemo(() => {
    const level = stats.level || user?.level || 1;
    const totalXP = stats.totalXP || user?.xp || 0;
    const streak = stats.currentStreak || 0;
    const coins = Math.floor(totalXP * 0.3); // calculated dynamic coins
    const completion = Math.min(100, (stats.missionsCompleted || 0) * 10);
    const xpToNext = level * 1000;

    return {
      level,
      xp: totalXP,
      xpToNext,
      coins,
      streak,
      completion,
    };
  }, [stats, user]);

  const currentMission = inProgressMissions[0] || null;
  const questData = useMemo(() => {
    if (currentMission) {
      return {
        title: currentMission.mission?.title || "Help Robo count the Magic Apples",
        chapter: currentMission.mission?.description || "Variables · Chapter 3",
        difficulty: currentMission.mission?.difficulty || "Easy",
        minutes: currentMission.mission?.duration || 5,
        rewards: { xp: currentMission.mission?.xpReward || 50, coins: 20, badge: "Magic Badge" },
      };
    }
    return {
      title: "Help Robo count the Magic Apples",
      chapter: "Variables · Chapter 3",
      difficulty: "Easy",
      minutes: 5,
      rewards: { xp: 50, coins: 20, badge: "Magic Badge" },
    };
  }, [currentMission]);

  function handleSignOut() {
    logout();
    navigate("/");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-semibold">Loading your adventure dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[radial-gradient(1200px_600px_at_50%_-10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent),radial-gradient(900px_500px_at_90%_10%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent),radial-gradient(700px_400px_at_5%_20%,color-mix(in_oklab,var(--secondary)_18%,transparent),transparent),var(--background)]">
      <Particles />
      
      {/* Immersive TopBar */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/40 bg-white/60 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={mascotAsset} alt="BitBuds Mascot" className="h-8 w-auto" />
            <span className="hidden font-display text-lg font-bold tracking-tight sm:block">BitBuds</span>
          </Link>

          <div className="ml-2 hidden items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary md:flex">
            <span>🏰</span> Magic Kingdom
          </div>

          <div className="ml-auto flex items-center gap-2">
            <Stat icon="⚡" value={playerStats.xp} label="XP" tone="primary" />
            <Stat icon="🪙" value={playerStats.coins} label="Coins" tone="warning" />
            <button
              aria-label="Notifications"
              className="relative grid size-10 place-items-center rounded-full border border-border bg-card text-lg transition hover:-translate-y-0.5"
            >
              🔔
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive ring-2 ring-white" />
            </button>
            <button
              onClick={handleSignOut}
              className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary text-lg text-primary-foreground shadow-lg transition hover:scale-105"
              aria-label="Sign out"
              title="Sign out"
            >
              👤
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <main className="mx-auto max-w-7xl px-4 pb-32 pt-24 sm:px-6 md:pt-28 md:pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <HeroAdventure name={user?.firstName || "Explorer"} playerStats={playerStats} />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <TodayQuest questData={questData} hasMission={!!currentMission} />
              <ProgressJourney playerStats={playerStats} />
            </div>
            <WorldMap />
          </div>

          <aside className="space-y-6">
            <PlayerCard name={user?.firstName || "Explorer"} playerStats={playerStats} />
            <BitCompanion name={user?.firstName || "Explorer"} tip={TIPS[tipIndex]} />
            <DailyChallenge />
            <TreasureChest open={chestOpen} setOpen={setChestOpen} />
            <Achievements />
            <AdventureTimeline />
          </aside>
        </div>

        <UnlockMoreWorlds />
      </main>

      <MobileNav />
    </div>
  );
};

// -----------------------------------------------------------------------------
// TopBar elements
// -----------------------------------------------------------------------------
function Stat({ icon, value, label, tone }: { icon: string; value: number; label: string; tone: "primary" | "warning" }) {
  const toneCls = tone === "primary" ? "from-primary/15 to-primary/5 text-primary" : "from-warning/25 to-warning/10 text-[color-mix(in_oklab,var(--warning)_40%,var(--foreground))]";
  return (
    <div className={cn("flex items-center gap-1.5 rounded-full bg-gradient-to-r px-3 py-1.5 text-sm font-extrabold", toneCls)}>
      <span className="text-base">{icon}</span>
      <AnimatedNumber value={value} />
      <span className="hidden text-[10px] font-bold uppercase tracking-widest opacity-70 sm:inline">{label}</span>
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const from = display;
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setDisplay(Math.round(from + (value - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span>{display.toLocaleString()}</span>;
}

// -----------------------------------------------------------------------------
// Parallax Hero Section
// -----------------------------------------------------------------------------
function HeroAdventure({ name, playerStats }: { name: string; playerStats: any }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const px = useSpring(useTransform(mx, [-1, 1], [-20, 20]), { stiffness: 60, damping: 18 });
  const py = useSpring(useTransform(my, [-1, 1], [-14, 14]), { stiffness: 60, damping: 18 });
  const px2 = useSpring(useTransform(mx, [-1, 1], [-40, 40]), { stiffness: 50, damping: 20 });
  const py2 = useSpring(useTransform(my, [-1, 1], [-24, 24]), { stiffness: 50, damping: 20 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
      my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[36px] border border-white/60 bg-gradient-to-br from-primary/95 via-secondary/90 to-primary text-white shadow-[0_30px_80px_-30px_rgba(31,41,120,0.6)]"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(1px_1px_at_20%_30%,#fff,transparent),radial-gradient(1px_1px_at_70%_20%,#fff,transparent),radial-gradient(1.5px_1.5px_at_45%_70%,#fff,transparent),radial-gradient(1px_1px_at_85%_60%,#fff,transparent)]" />

      <motion.div
        aria-hidden
        style={{ x: px, y: py }}
        className="pointer-events-none absolute -top-6 left-10 text-6xl opacity-80 drop-shadow-xl"
      >☁️</motion.div>
      <motion.div
        aria-hidden
        style={{ x: px2, y: py2 }}
        className="pointer-events-none absolute top-10 right-16 text-5xl opacity-80 drop-shadow-xl"
      >☁️</motion.div>

      <div className="relative grid gap-6 p-6 md:grid-cols-[1.1fr_1fr] md:p-10">
        <div className="relative z-10 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3 py-1 font-accent text-[11px] font-extrabold uppercase tracking-[0.18em] backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-accent" />
            Chapter 03 · Today's Mission
          </motion.div>
          <h1 className="mt-4 font-display text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl md:text-5xl">
            <span className="mr-2">🏰</span>Magic Kingdom
          </h1>
          <p className="mt-3 max-w-md text-balance text-base text-white/85 sm:text-lg">
            Princess Luna has lost the Magic Crystal.
            <br className="hidden sm:block" />
            Only <span className="font-semibold text-white">{name}</span> and Bit can save the kingdom.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/world/magic-kingdom"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-2xl bg-white px-5 py-3.5 font-display text-base font-bold text-primary shadow-[0_16px_40px_-16px_rgba(0,0,0,0.5)] transition hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-accent/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              <span className="relative">Continue Mission</span>
              <span className="relative">→</span>
            </Link>
          </div>
        </div>

        <div className="relative min-h-[220px] md:min-h-[280px]">
          <motion.img
            src={heroIsland}
            alt=""
            aria-hidden
            style={{ x: px, y: py }}
            className="absolute inset-0 h-full w-full rounded-[28px] object-cover shadow-2xl"
          />
          <motion.div
            aria-hidden
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute right-6 top-6 grid size-14 place-items-center rounded-2xl bg-white/95 text-3xl shadow-xl ring-1 ring-white"
          >💎</motion.div>
          <motion.img
            src={mascotAsset}
            alt="Bit companion"
            style={{ x: px2, y: py2 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-2 left-2 size-28 drop-shadow-[0_20px_30px_rgba(0,0,0,0.4)] sm:size-36 object-contain"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring" }}
            className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary shadow-lg"
          >
            <span className="text-base">👑</span> Princess Luna needs you
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

// -----------------------------------------------------------------------------
// Player summary card
// -----------------------------------------------------------------------------
function PlayerCard({ name, playerStats }: { name: string; playerStats: any }) {
  const pct = Math.min(100, Math.round((playerStats.xp / playerStats.xpToNext) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div aria-hidden className="absolute -right-8 -top-8 size-32 rounded-full bg-primary/15 blur-2xl" />
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-3xl shadow-lg">
            <span className="drop-shadow">🚀</span>
          </div>
          <div className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-warning text-[11px] font-black text-white ring-2 ring-white">
            {playerStats.level}
          </div>
        </div>
        <div className="min-w-0">
          <div className="truncate font-display text-lg font-bold">{name}</div>
          <div className="text-xs font-semibold text-muted-foreground">Level {playerStats.level} · Apprentice Coder</div>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>XP</span>
          <span>{playerStats.xp} / {playerStats.xpToNext}</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className="relative h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
          >
            <span className="absolute inset-0 animate-[shimmer_2.4s_linear_infinite] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.5),transparent)] bg-[length:200%_100%]" />
          </motion.div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <MiniStat icon="🔥" value={`${playerStats.streak}d`} label="Streak" />
        <MiniStat icon="🪙" value={playerStats.coins} label="Coins" />
        <MiniStat icon="🌍" value={`${playerStats.completion}%`} label="World" />
      </div>
    </motion.div>
  );
}

function MiniStat({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 px-2 py-2.5">
      <div className="text-lg">{icon}</div>
      <div className="font-display text-sm font-bold">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Quest Section
// -----------------------------------------------------------------------------
function TodayQuest({ questData, hasMission }: { questData: any; hasMission: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      whileHover={{ y: -3 }}
      className="group relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-accent/20 via-card to-card p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div aria-hidden className="absolute -right-6 -top-6 text-6xl opacity-20 blur-[1px]">🍎</div>
      <div className="flex items-center gap-2 font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
        <span className="size-1.5 rounded-full bg-primary" /> Today's Quest
      </div>
      <h3 className="mt-2 font-display text-xl font-bold leading-tight">{questData.title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{questData.chapter}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Chip icon="🌱" label={questData.difficulty} tone="success" />
        <Chip icon="⏱" label={`${questData.minutes} min`} tone="muted" />
        <Chip icon="⚡" label={`+${questData.rewards.xp} XP`} tone="primary" />
        <Chip icon="🪙" label={`+${questData.rewards.coins}`} tone="warning" />
      </div>

      <Link
        to={hasMission ? "/missions" : "/world/magic-kingdom"}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-5 py-3.5 font-display font-bold text-white shadow-[0_10px_30px_-10px_rgba(91,95,239,0.8)] transition hover:brightness-110 active:scale-[0.98]"
      >
        Start Mission <span className="transition group-hover:translate-x-1">→</span>
      </Link>
    </motion.div>
  );
}

function Chip({ icon, label, tone }: { icon: string; label: string; tone: "success" | "primary" | "warning" | "secondary" | "muted" }) {
  const map: Record<string, string> = {
    success: "bg-success/15 text-success",
    primary: "bg-primary/10 text-primary",
    warning: "bg-warning/25 text-[color-mix(in_oklab,var(--warning)_40%,var(--foreground))]",
    secondary: "bg-secondary/15 text-secondary",
    muted: "bg-muted text-foreground/70",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold", map[tone])}>
      <span>{icon}</span> {label}
    </span>
  );
}

// -----------------------------------------------------------------------------
// Progress Circle
// -----------------------------------------------------------------------------
function ProgressJourney({ playerStats }: { playerStats: any }) {
  const pct = playerStats.completion || 0;
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-card p-6 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-2 font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-secondary">
        <span className="size-1.5 rounded-full bg-secondary" /> Current Journey
      </div>
      <h3 className="mt-2 font-display text-xl font-bold">Variables</h3>
      <p className="text-sm text-muted-foreground">Next unlock · Loops</p>

      <div className="mt-4 flex items-center gap-5">
        <div className="relative grid size-[110px] place-items-center">
          <svg viewBox="0 0 100 100" className="size-full -rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="var(--muted)" strokeWidth="10" />
            <motion.circle
              cx="50" cy="50" r={r} fill="none"
              stroke="url(#g1)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={c}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: c - (c * pct) / 100 }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            />
            <defs>
              <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--primary)" />
                <stop offset="100%" stopColor="var(--secondary)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="font-display text-2xl font-bold">{pct}%</div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mastered</div>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          {[
            { k: "Declare", done: true },
            { k: "Assign", done: true },
            { k: "Update", done: pct >= 50 },
            { k: "Reuse", done: pct >= 80 },
          ].map((s) => (
            <div key={s.k} className="flex items-center gap-2 text-sm">
              <span className={cn("grid size-5 place-items-center rounded-full text-[10px] font-black", s.done ? "bg-success text-white" : "bg-muted text-muted-foreground")}>
                {s.done ? "✓" : "•"}
              </span>
              <span className={cn(s.done ? "text-foreground" : "text-muted-foreground")}>{s.k}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// World map selection
// -----------------------------------------------------------------------------
function WorldMap() {
  return (
    <section>
      <div className="mb-3 flex items-end justify-between px-1">
        <div>
          <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.18em] text-primary">Choose your realm</div>
          <h2 className="mt-1 font-display text-2xl font-bold">World Map</h2>
        </div>
      </div>
      <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
        {WORLDS.map((w, i) => (
          <WorldCard key={w.id} world={w} index={i} />
        ))}
      </div>
    </section>
  );
}

function WorldCard({ world, index }: { world: typeof WORLDS[number]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index }}
      whileHover={{ y: -6, rotate: -0.5 }}
      className={cn(
        "group relative w-[220px] shrink-0 snap-start overflow-hidden rounded-[26px] border border-white/60 bg-card shadow-[0_18px_40px_-18px_rgba(0,0,0,0.28)] transition",
        !world.unlocked && "grayscale-[45%]",
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={world.img} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
        {!world.unlocked && (
          <div className="absolute inset-0 grid place-items-center bg-black/30 backdrop-blur-[2px]">
            <motion.div
              animate={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
              className="grid size-14 place-items-center rounded-2xl bg-white/95 text-2xl shadow-xl"
            >🔒</motion.div>
          </div>
        )}

        <div className="absolute inset-x-3 bottom-3 text-white">
          <div className="text-2xl">{world.emoji}</div>
          <div className="mt-0.5 font-display text-base font-bold leading-tight">{world.name}</div>
          <div className="text-[11px] font-semibold opacity-80">{world.tag}</div>
        </div>
      </div>
      <div className="flex items-center justify-between p-3">
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-wider", world.unlocked ? "bg-success/15 text-success" : "bg-muted text-muted-foreground")}>
          {world.unlocked ? "Unlocked" : "Locked"}
        </span>
        {world.unlocked && world.id === "magic" ? (
          <Link
            to="/world/magic-kingdom"
            className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white transition hover:brightness-110"
          >
            Enter →
          </Link>
        ) : (
          <button
            disabled={!world.unlocked}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-bold transition",
              world.unlocked ? "bg-primary text-white hover:brightness-110" : "bg-muted text-muted-foreground",
            )}
          >
            {world.unlocked ? "Enter →" : "Coming soon"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Interactive Companion
// -----------------------------------------------------------------------------
function BitCompanion({ name, tip }: { name: string; tip: string }) {
  const [companionTip, setCompanionTip] = useState(tip);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    setCompanionTip(tip);
  }, [tip]);

  const questions = [
    "A variable is a named storage location that holds a value.",
    "Think of variables like storage drawers with name tags on them!",
    "If you type let x = 5, you have placed a 5 inside a drawer labeled x.",
    "Coding is just telling a story to a machine step-by-step!"
  ];

  function handleInteraction(option: string) {
    if (option === "Explain Variables") {
      setCompanionTip(questions[clickCount % questions.length]);
      setClickCount(c => c + 1);
    } else if (option === "Give Hint") {
      setCompanionTip("Try dragging the apples to the treasure chest to declare your variables!");
    } else if (option === "Tell Story") {
      setCompanionTip("Once upon a time, Princess Luna had a kingdom where all numbers were stored in crystal jars...");
    } else {
      setCompanionTip("Let's keep coding! We have magic variables to conquer!");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-secondary/15 via-card to-primary/10 p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-start gap-3">
        <motion.img
          src={mascotAsset}
          alt="Bit"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="h-16 w-auto shrink-0 drop-shadow-lg object-contain"
        />
        <div className="min-w-0">
          <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-secondary">Bit AI</div>
          <div className="font-display text-base font-bold">Hi {name} 👋</div>
          <AnimatePresence mode="wait">
            <motion.p
              key={companionTip}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="mt-1 text-sm text-muted-foreground"
            >
              {companionTip}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        {["Explain Variables", "Practice", "Tell Story", "Give Hint"].map((b) => (
          <button
            key={b}
            onClick={() => handleInteraction(b)}
            className="rounded-2xl border border-border/70 bg-white/70 px-3 py-2 text-xs font-bold text-foreground transition hover:-translate-y-0.5 hover:border-secondary hover:text-secondary"
          >
            {b}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Daily challenge details
// -----------------------------------------------------------------------------
function DailyChallenge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-warning/20 via-card to-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-2 font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-[color-mix(in_oklab,var(--warning)_40%,var(--foreground))]">
        <span className="size-1.5 rounded-full bg-warning" /> Daily Challenge
      </div>
      <h3 className="mt-2 font-display text-lg font-bold">Catch 3 falling coins ⚡</h3>
      <p className="mt-1 text-sm text-muted-foreground">Finish in under 3 minutes for a bonus streak.</p>
      <div className="mt-3 flex items-center gap-2">
        <Chip icon="⚡" label="+30 XP" tone="primary" />
        <Chip icon="🪙" label="+15" tone="warning" />
      </div>
      <Link to="/world/magic-kingdom" className="mt-4 block w-full text-center rounded-2xl bg-foreground text-white py-3 font-display text-sm font-bold transition hover:brightness-110">
        Play now
      </Link>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Daily treasure reward chest
// -----------------------------------------------------------------------------
function TreasureChest({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-[28px] border border-white/60 bg-gradient-to-br from-accent/20 to-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center gap-2 font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">
        <span className="size-1.5 rounded-full bg-primary" /> Daily Reward
      </div>
      <div className="mt-2 flex items-center gap-4">
        <button
          onClick={() => setOpen(!open)}
          className="relative grid size-20 place-items-center rounded-2xl bg-gradient-to-b from-warning/40 to-warning/10 text-5xl transition hover:scale-105"
          aria-label="Open treasure chest"
        >
          <motion.span
            animate={open ? { rotate: [0, -12, 0] } : { y: [0, -3, 0] }}
            transition={{ duration: open ? 0.6 : 2.4, repeat: open ? 0 : Infinity, ease: "easeInOut" }}
          >
            {open ? "💰" : "🎁"}
          </motion.span>
          {!open && (
            <span aria-hidden className="absolute inset-0 -z-10 rounded-2xl bg-warning/50 blur-2xl" />
          )}
        </button>
        <div className="min-w-0">
          <div className="font-display text-base font-bold">Mystery Treasure</div>
          <p className="text-xs text-muted-foreground">Tap to reveal today's loot.</p>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-2 flex flex-wrap gap-1"
              >
                <Chip icon="🪙" label="+50" tone="warning" />
                <Chip icon="🎩" label="Wizard hat" tone="secondary" />
                <Chip icon="🐾" label="Pet egg" tone="primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Recent achievements
// -----------------------------------------------------------------------------
function Achievements() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-[28px] border border-white/60 bg-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-primary">Achievements</div>
          <h3 className="mt-1 font-display text-base font-bold">Recent badges</h3>
        </div>
        <Link to="/badges" className="text-xs font-bold text-primary">All →</Link>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {BADGES.map((b, i) => (
          <motion.div
            key={b.name}
            whileHover={{ y: -4, rotate: -3 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.05, type: "spring" }}
            className="group flex flex-col items-center gap-1"
          >
            <div className={cn(
              "grid size-14 place-items-center rounded-2xl text-2xl shadow-inner",
              b.tone === "primary" && "bg-primary/15",
              b.tone === "secondary" && "bg-secondary/15",
              b.tone === "accent" && "bg-accent/25",
              b.tone === "warning" && "bg-warning/30",
            )}>
              {b.emoji}
            </div>
            <div className="text-center text-[10px] font-bold leading-tight text-muted-foreground group-hover:text-foreground">
              {b.name}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Timeline summary logs
// -----------------------------------------------------------------------------
function AdventureTimeline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-[28px] border border-white/60 bg-card p-5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.12)]"
    >
      <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.16em] text-secondary">Adventure Log</div>
      <h3 className="mt-1 font-display text-base font-bold">Your journey</h3>
      <ol className="mt-3 space-y-3">
        {TIMELINE.map((t) => (
          <li key={t.title} className="flex items-center gap-3">
            <div className={cn(
              "grid size-10 place-items-center rounded-2xl text-lg",
              t.done && "bg-success/15",
              t.current && "bg-primary/15 ring-2 ring-primary/30",
              t.locked && "bg-muted opacity-70",
            )}>
              {t.emoji}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">{t.when}</div>
              <div className="truncate text-sm font-bold">{t.title}</div>
            </div>
            {t.current && <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-black uppercase text-primary">Now</span>}
          </li>
        ))}
      </ol>
    </motion.div>
  );
}

// -----------------------------------------------------------------------------
// Bottom "Unlock more worlds"
// -----------------------------------------------------------------------------
function UnlockMoreWorlds() {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <div className="font-accent text-[11px] font-extrabold uppercase tracking-[0.18em] text-secondary">More adventures</div>
          <h2 className="mt-1 font-display text-2xl font-bold">Unlock more worlds</h2>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {WORLDS.slice(0, 6).map((w, i) => (
          <motion.button
            key={w.id}
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
            className="group relative overflow-hidden rounded-2xl border border-white/60 bg-card text-left shadow-[0_16px_36px_-16px_rgba(0,0,0,0.2)]"
          >
            <div className="relative aspect-square overflow-hidden">
              <img src={w.img} alt="" className={cn("h-full w-full object-cover transition duration-500 group-hover:scale-110", !w.unlocked && "grayscale")} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-x-2 bottom-2 text-white">
                <div className="text-xl">{w.emoji}</div>
                <div className="text-xs font-bold leading-tight">{w.name}</div>
              </div>
              {!w.unlocked && (
                <div className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white/95 text-xs">🔒</div>
              )}
            </div>
            <div className="p-2.5">
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${w.progress}%` }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <span>{w.tag}</span>
                <span>{w.progress}%</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </section>
  );
}

// -----------------------------------------------------------------------------
// Bottom nav (mobile)
// -----------------------------------------------------------------------------
function MobileNav() {
  const items = [
    { icon: "🏰", label: "Home", active: true },
    { icon: "🗺", label: "Worlds", to: "/world/magic-kingdom" as const },
    { icon: "🎯", label: "Quest", to: "/missions" as const },
    { icon: "🎁", label: "Rewards", to: "/badges" as const },
    { icon: "👤", label: "Settings", to: "/settings" as const },
  ];
  return (
    <nav className="fixed inset-x-3 bottom-3 z-40 rounded-3xl border border-white/60 bg-white/90 p-1.5 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl md:hidden">
      <ul className="grid grid-cols-5">
        {items.map((it) => (
          <li key={it.label}>
            {it.to ? (
              <Link to={it.to} className="flex flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-bold text-muted-foreground">
                <span className="text-lg">{it.icon}</span>{it.label}
              </Link>
            ) : (
              <button className={cn(
                "flex w-full flex-col items-center gap-0.5 rounded-2xl px-2 py-2 text-[10px] font-bold",
                it.active ? "bg-primary/10 text-primary" : "text-muted-foreground",
              )}>
                <span className="text-lg">{it.icon}</span>{it.label}
              </button>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

// -----------------------------------------------------------------------------
// Floating particles background
// -----------------------------------------------------------------------------
function Particles() {
  const dots = useMemo(
    () => Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      dur: 8 + Math.random() * 8,
      size: 4 + Math.random() * 8,
      hue: ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--warning)"][i % 4],
    })),
    [],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
      {dots.map((d) => (
        <motion.span
          key={d.id}
          initial={{ y: "110vh", opacity: 0 }}
          animate={{ y: "-10vh", opacity: [0, 0.7, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "linear" }}
          style={{ left: `${d.left}%`, width: d.size, height: d.size, background: d.hue }}
          className="absolute rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
}

export default Dashboard;