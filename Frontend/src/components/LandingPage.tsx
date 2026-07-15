import React, { useState, useEffect } from 'react';
import { 
  Sparkles, BookOpen, Compass, ArrowRight, Play, CheckCircle2, 
  ArrowLeft, ChevronDown, Award, Shield, GraduationCap, Users, 
  LineChart, Check, HelpCircle, Star, Heart, Lock, Volume2, VolumeX,
  Layers, Smile, Code2, Zap, ArrowUpRight
} from 'lucide-react';
import { playSound } from '../utils/audio';

// Let's import our handcrafted assets from GameAssets
import { 
  MoboRobot, 
  GlimmerWizard, 
  KokoMonkey, 
  PrincessLuna, 
  MagicTreasureChest, 
  VariableBox, 
  LoopWheel, 
  CodingScroll, 
  MagicPortal,
  BitBudsLogo
} from './GameAssets';

interface LandingPageProps {
  onStartAdventure: (domainId: string) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export default function LandingPage({ onStartAdventure, soundEnabled, onToggleSound }: LandingPageProps) {
  // --- Micro interactions states ---
  const [blinkBit, setBlinkBit] = useState(false);
  const [waveLuna, setWaveLuna] = useState(false);
  const [activeChar, setActiveChar] = useState('bit');
  const [storyStep, setStoryStep] = useState(0); // 0: Story, 1: Visual, 2: Interactive, 3: Quiz, 4: Reward
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizSuccess, setQuizSuccess] = useState<boolean | null>(null);

  // Parent Dashboard Interactive Demo
  const [analyticsTab, setAnalyticsTab] = useState<'progress' | 'skills' | 'activity'>('progress');

  // Trigger occasional blinking/waving
  useEffect(() => {
    const bitInterval = setInterval(() => {
      setBlinkBit(true);
      setTimeout(() => setBlinkBit(false), 200);
    }, 4000);

    const lunaInterval = setInterval(() => {
      setWaveLuna(true);
      setTimeout(() => setWaveLuna(false), 800);
    }, 6000);

    return () => {
      clearInterval(bitInterval);
      clearInterval(lunaInterval);
    };
  }, []);

  const handleBtnClick = () => {
    if (soundEnabled) playSound('click');
  };

  const handleCorrectSound = () => {
    if (soundEnabled) playSound('success');
  };

  const handleIncorrectSound = () => {
    if (soundEnabled) playSound('fail');
  };

  // ----------------------------------------------------
  // DATA FOR SECTIONS
  // ----------------------------------------------------

  const WORLDS = [
    {
      id: 'robo-logic',
      name: 'Space Explorer',
      concept: 'Variables',
      color: 'from-blue-600 to-indigo-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-300',
      accentColor: 'text-blue-600',
      description: 'Help Bit solve cosmic coordinates, charge spaceship warp drives, and dodge asteroids with precise code!',
      lessonCount: '10 Interactive Levels',
      rewards: 'Starlight Master Badge, 350 Coins',
      icon: '🚀'
    },
    {
      id: 'frontend-magic',
      name: 'Magic Kingdom',
      concept: 'HTML & CSS',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-300',
      accentColor: 'text-purple-600',
      description: 'Join Princess Luna and Wizard Byte. Design visual headers, layout towers, and change wall colors!',
      lessonCount: '10 Spell Challenges',
      rewards: 'Enchanted Stylist Crown, 400 Coins',
      icon: '🏰'
    },
    {
      id: 'python-safari',
      name: 'Pirate Island',
      concept: 'Loops & Lists',
      color: 'from-amber-500 to-yellow-500',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-300',
      accentColor: 'text-amber-600',
      description: 'Explore gold caches with Captain Loop! Program automatic step loops to navigate dangerous stone pathways.',
      lessonCount: '10 Safari Missions',
      rewards: 'Golden Pirate Compass, 450 Coins',
      icon: '🏴‍☠️'
    }
  ];

  const CHARACTERS = [
    {
      id: 'bit',
      name: 'Bit',
      role: 'Code Bot Guide',
      personality: 'Curious, energetic, and highly analytical.',
      story: 'Crafted from cosmic circuit boards, Bit loves translating lines of computer instructions into amazing mechanical moves.',
      favTopic: 'Sequence Alleys & Logic Gates',
      avatarComponent: <MoboRobot expression={blinkBit ? 'thinking' : 'happy'} className="h-32 w-32 filter drop-shadow-md" />
    },
    {
      id: 'luna',
      name: 'Princess Luna',
      role: 'Kingdom Architect',
      personality: 'Creative, organized, and elegant.',
      story: 'Luna commands structural magic. She uses special document scrolls (HTML tags) to project building templates into reality.',
      favTopic: 'Web Page Dividers & Hex Colors',
      avatarComponent: <PrincessLuna className={`h-32 w-32 filter drop-shadow-md ${waveLuna ? 'animate-bounce' : ''}`} />
    },
    {
      id: 'wizard',
      name: 'Wizard Byte',
      role: 'Spell Developer',
      personality: 'Wise, starry-eyed, and a bit eccentric.',
      story: 'With his glowing binary staff, Byte creates functional magic spells that process calculations in the blink of an eye.',
      favTopic: 'Spell Arrays & Potion Formulas',
      avatarComponent: <GlimmerWizard expression="happy" className="h-32 w-32 filter drop-shadow-md" />
    },
    {
      id: 'captain',
      name: 'Captain Loop',
      role: 'Pirate Explorer',
      personality: 'Adventurous, loud, and repetitive.',
      story: 'Loop sails the Syntax Seas. Why write five commands when you can code a Loop block to do it forever?',
      favTopic: 'Repeat Blocks & Multi-Index Loops',
      avatarComponent: <KokoMonkey expression="happy" className="h-32 w-32 filter drop-shadow-md" />
    }
  ];

  const ROADMAP = [
    { name: 'Magic Kingdom', status: 'Active Now', desc: 'Variables & Selectors', step: '01' },
    { name: 'Pirate Island', status: 'Locked', desc: 'Repeat Loops & Lists', step: '02' },
    { name: 'Robot Factory', status: 'Locked', desc: 'Functions & Badges', step: '03' },
    { name: 'Dino Valley', status: 'Locked', desc: 'Arrays & Index coordinates', step: '04' },
    { name: 'WebDev City', status: 'Locked', desc: 'HTML & Layout styling', step: '05' },
    { name: 'AI Academy', status: 'Locked', desc: 'Neural Networks & Models', step: '06' },
  ];

  const WHY_US = [
    { title: 'Story-Based Learning', desc: 'Every line of code helps our mascots escape traps, open gates, or build amazing magic castles.', icon: <BookOpen className="h-6 w-6 text-purple-600" /> },
    { title: 'Interactive Tactile Blocks', desc: 'Perfect for ages 6–14. Just drag, drop, and construct algorithms with physical feedback.', icon: <Layers className="h-6 w-6 text-blue-600" /> },
    { title: 'AI Assistant Companion', desc: 'Our playful AI tutor adjusts explanations dynamically without writing answers for kids.', icon: <Sparkles className="h-6 w-6 text-yellow-600" /> },
    { title: 'Visual Reinforcement', desc: 'See your code execute instantly in beautiful 2.5D graphics with custom animations.', icon: <Smile className="h-6 w-6 text-pink-600" /> },
    { title: 'Real Programming Concepts', desc: 'Teaches actual computer science theory: variables, loops, arrays, functions, and layout.', icon: <Code2 className="h-6 w-6 text-emerald-600" /> },
    { title: 'Generous XP & Badges', desc: 'Children collect shimmering crystals, purchase custom outfits, and display golden badges.', icon: <Award className="h-6 w-6 text-orange-600" /> },
    { title: '100% Safe Playground', desc: 'No advertisements, no social media exposure. Fully compliant and private workspace.', icon: <Shield className="h-6 w-6 text-indigo-600" /> },
    { title: 'Intuitive Progress Tracking', desc: 'Detailed weekly email analytics keep parents in the loop on skills conquered.', icon: <LineChart className="h-6 w-6 text-rose-600" /> }
  ];

  const BADGES = [
    { name: 'Variables Flask', desc: 'Unlocked by defining 5 variables', icon: '🧪', color: 'bg-amber-100 border-amber-300 text-amber-600' },
    { name: 'Loop Captain', desc: 'Solved 10 nested repeat sequences', icon: '🎡', color: 'bg-blue-100 border-blue-300 text-blue-600' },
    { name: 'Tag Master', desc: 'Declared pristine HTML layouts', icon: '📜', color: 'bg-purple-100 border-purple-300 text-purple-600' },
    { name: 'Dragon Conqueror', desc: 'Completed the Level 10 main battle', icon: '🐉', color: 'bg-rose-100 border-rose-300 text-rose-600' },
    { name: 'AI Apprentice', desc: 'Trained your first neural net model', icon: '🧠', color: 'bg-emerald-100 border-emerald-300 text-emerald-600' },
    { name: 'Stardust Coder', desc: 'Earned 1,500 total adventure XP', icon: '🌟', color: 'bg-yellow-100 border-yellow-300 text-yellow-600' }
  ];

  const TESTIMONIALS = [
    { quote: "BitBuds is the first coding game my daughter actually begs to play. She thinks she's on a Disney adventure, but she's explaining variable scopes to me!", author: "Sarah M., Parent of Chloe (9)", role: "Parent", rating: 5, avatar: "👩‍👧" },
    { quote: "As a school tech teacher, I find standard scratch coding a bit dry. BitBuds embeds computational theory into premium storybooks that keep students focused.", author: "Marcus T., STEM Educator", role: "School Teacher", rating: 5, avatar: "👨‍🏫" },
    { quote: "I helped Wizard Byte paint his castle walls pink using style codes! My favorite is Captain Loop because his loops help me jump across the rivers fast!", author: "Aiden R., age 11", role: "Junior Ranger", rating: 5, avatar: "👦" }
  ];

  const FAQS = [
    { q: "How does BitBuds teach real programming without keyboards?", a: "Instead of frustrating kids with syntax errors and typing typos, BitBuds uses visual block tokens representing actual code components (like variable values, loop counters, and HTML tags). When they run their logic, they immediately see the mascot execute the steps, preparing them perfectly for text-based languages like Python and JavaScript." },
    { q: "What age range is BitBuds designed for?", a: "BitBuds is fully calibrated for children aged 6 to 14. Younger children (6–8) love the visual stories and basic logic paths, while older students (9–14) can tackle advanced domains, HTML page designs, and neural network models." },
    { q: "Does it require prior coding experience?", a: "None at all! Our adventure starts from absolute zero. Bit walks children through their first electric steps, gently scaling up the complexity as they earn coins and unlock new story kingdoms." },
    { q: "How can parents monitor and track learning?", a: "Each parent account gains access to our professional dashboard. You can review accurate time-spent metrics, success scores on quizzes, and receive weekly email summaries outlining the computer science vocabulary your child mastered." }
  ];

  return (
    <div className="relative overflow-x-hidden bg-[#FAF9F5] text-slate-900 selection:bg-blue-200">
      
      {/* ----------------------------------------------------
          SECTION 1: HERO (IMMERSIVE, MAGIC KINGDOM LANDSCAPE)
          ---------------------------------------------------- */}
      <section className="relative min-h-[92vh] flex flex-col justify-between border-b-4 border-slate-900 bg-gradient-to-b from-[#7FC7F5]/20 via-[#FAF9F5] to-[#FAF9F5] pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Animated Background Landscape Elements */}
        <div className="absolute inset-0 pointer-events-none z-0">
          
          {/* Glowing Sun/Moon Ambient */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-radial from-amber-200/50 to-transparent blur-3xl opacity-60"></div>
          
          {/* Slowly Floating Cartoon Clouds */}
          <div className="absolute top-12 left-[10%] animate-pulse duration-[6000ms] opacity-70">
            <div className="w-28 h-8 bg-white rounded-full filter blur-[1px]"></div>
          </div>
          <div className="absolute top-24 right-[15%] animate-pulse duration-[8000ms] opacity-65">
            <div className="w-36 h-10 bg-white rounded-full filter blur-[1px]"></div>
          </div>

          {/* SVG Trees, Islands, Bridge Decorative Accents */}
          <svg className="absolute bottom-0 left-0 right-0 w-full h-[25%] max-h-[300px]" viewBox="0 0 1440 300" fill="none" preserveAspectRatio="none">
            {/* Soft rolling hills */}
            <path d="M0 250 C360 180, 720 220, 1080 180 C1260 160, 1380 210, 1440 230 L1440 300 L0 300 Z" fill="#4CAF7D" fillOpacity="0.25" />
            <path d="M0 270 C300 220, 600 250, 900 210 C1200 170, 1350 240, 1440 260 L1440 300 L0 300 Z" fill="#4CAF7D" fillOpacity="0.4" />
            
            {/* The Magic Kingdom Stone Bridge */}
            <path d="M450 250 C500 210, 650 210, 700 250 L690 280 L460 280 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="4" />
            <circle cx="575" cy="255" r="15" fill="#FAF9F5" stroke="#0f172a" strokeWidth="3" />
          </svg>

          {/* Fluttering Butterflies or Sparks floating */}
          <div className="absolute top-[40%] left-[25%] h-3 w-3 bg-[#8A5FD6] rounded-full animate-ping opacity-60"></div>
          <div className="absolute top-[50%] right-[30%] h-4 w-4 bg-[#F5C24C] rounded-full animate-ping opacity-50"></div>
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto w-full">
          
          {/* Left Text column */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-4 py-1.5 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black uppercase text-slate-800 tracking-widest">
                ✨ A Magic Coding Universe
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight uppercase">
                Where Stories <br className="hidden sm:inline" />
                Become <span className="text-blue-600 underline decoration-indigo-300 decoration-wavy">Code</span>.
              </h1>
              <p className="text-lg sm:text-xl font-bold text-slate-600 max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Join <span className="text-blue-600 font-extrabold">Bit</span> on magical adventures where every puzzle teaches real computer programming. Discover worlds, help characters, and earn shimmering starlight keys!
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => {
                  handleBtnClick();
                  onStartAdventure('robo-logic');
                }}
                className="group flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-blue-600 px-8 py-5 text-lg font-black text-white shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                id="hero-primary-cta"
              >
                <span>Start Your Adventure</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => {
                  handleBtnClick();
                  // Scroll to Example
                  document.getElementById('interactive-example')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-8 py-5 text-lg font-black text-slate-900 shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                id="hero-secondary-cta"
              >
                <Play className="h-5 w-5 text-pink-500 fill-pink-500" />
                <span>Watch Story Demo</span>
              </button>
            </div>

            {/* Quick Proof counters */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-xl mx-auto lg:mx-0">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-slate-900/10 text-center">
                <span className="block text-xl font-black text-indigo-600">40,000+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Completed</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-slate-900/10 text-center">
                <span className="block text-xl font-black text-purple-600">150+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Story Quests</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-slate-900/10 text-center">
                <span className="block text-xl font-black text-emerald-600">50+</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Lessons</span>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 border-2 border-slate-900/10 text-center">
                <span className="block text-xl font-black text-amber-600">AI Powered</span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Smart Tutor</span>
              </div>
            </div>
          </div>

          {/* Right Visual Column: Handcrafted 2.5D Storybook-Style Hero Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            <div 
              className="relative w-full max-w-[400px] aspect-[3/4] rounded-[32px] border-4 border-slate-900 bg-gradient-to-b from-[#1E1B4B] via-[#2E1A47] to-[#312E81] p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-[12px_12px_0_0_rgba(15,23,42,1)]"
              style={{
                boxShadow: "8px 8px 0px 0px #0F172A, inset 0 0 40px rgba(0,0,0,0.6)"
              }}
            >
              {/* Warm light source / sun glow in the background */}
              <div className="absolute top-[20%] left-[30%] w-[180px] h-[180px] bg-amber-500/20 rounded-full blur-[50px] pointer-events-none"></div>
              
              {/* Deep 2.5D Ambient Castle Backdrop (Silhouette with soft blur) */}
              <div className="absolute inset-0 z-0 opacity-40 pointer-events-none select-none">
                {/* Floating Islands in the sky */}
                <div className="absolute top-12 left-6 w-16 h-8 bg-indigo-950 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '8s' }}>
                  <div className="absolute bottom-[-10px] left-4 w-8 h-4 bg-indigo-900/60 clip-path-triangle"></div>
                </div>
                <div className="absolute top-20 right-8 w-24 h-10 bg-indigo-950 rounded-full blur-[1px] animate-bounce" style={{ animationDuration: '11s' }}>
                  <div className="absolute bottom-[-12px] left-8 w-10 h-6 bg-indigo-900/60 clip-path-triangle"></div>
                </div>

                {/* Distant magical castle outline */}
                <svg className="absolute bottom-16 left-0 right-0 h-40 w-full text-indigo-950 filter blur-[1.5px]" viewBox="0 0 400 200" fill="currentColor">
                  {/* Castle Spires */}
                  <rect x="120" y="80" width="12" height="120" />
                  <polygon points="120,80 126,60 132,80" />
                  <rect x="268" y="80" width="12" height="120" />
                  <polygon points="268,80 274,60 280,80" />
                  {/* Central Palace Tower */}
                  <rect x="160" y="50" width="80" height="150" />
                  <polygon points="160,50 200,10 240,50" />
                  <rect x="195" y="100" width="10" height="20" fill="#FBBF24" opacity="0.8" />
                </svg>
              </div>

              {/* Trailing path of glowing golden stars / keys */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* Sparkles / Fireflies */}
                <div className="absolute top-[35%] left-[20%] h-1.5 w-1.5 bg-yellow-300 rounded-full animate-ping"></div>
                <div className="absolute top-[45%] right-[25%] h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div className="absolute top-[55%] left-[45%] h-1 w-1 bg-white rounded-full animate-pulse"></div>
                <div className="absolute top-[25%] right-[40%] h-2 w-2 bg-yellow-300 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>

                {/* Glowing path stars leading into the background */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
                  {/* Glowing line representing path of coding journey */}
                  <path d="M70 330 Q 150 260 200 190 T 200 90" stroke="#FBBF24" strokeWidth="3" strokeDasharray="6 4" opacity="0.5" />
                  {/* Floating star keys along the path */}
                  <g fill="#FBBF24" className="animate-pulse">
                    <circle cx="95" cy="310" r="4" className="shadow-lg" />
                    <circle cx="140" cy="275" r="3" />
                    <circle cx="178" cy="235" r="5" />
                    <circle cx="195" cy="180" r="3" />
                  </g>
                </svg>
              </div>

              {/* Floating Holographic Coding Puzzle Screen (Interactive center piece) */}
              <div className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[85%] z-20 animate-bounce duration-[4000ms]">
                <div className="rounded-2xl border-2 border-cyan-400/80 bg-cyan-950/95 p-3.5 shadow-[0_0_20px_rgba(34,211,238,0.4)] backdrop-blur-md text-white font-mono space-y-2 text-left transform -rotate-2 relative">
                  
                  {/* Holographic light projector rays */}
                  <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 w-32 h-16 bg-gradient-to-t from-transparent to-cyan-500/20 blur-md clip-path-triangle pointer-events-none"></div>

                  <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                      ACTIVE PUZZLE: VARIABLE
                    </span>
                    <span>LEVEL 3</span>
                  </div>

                  {/* Sample glowing draggable blocks */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-1 bg-blue-900/40 border border-blue-500/40 rounded px-2 py-1 text-blue-300">
                      <span className="text-[10px] text-blue-400">VAR</span>
                      <span className="font-bold">stars</span>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-950/40 border border-yellow-500/40 rounded px-2 py-1 text-yellow-300">
                      <span>=</span>
                      <span className="font-bold text-yellow-400">100</span>
                    </div>
                  </div>

                  {/* Level Achievement Shield badge resting nearby */}
                  <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[9px] px-2 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] flex items-center gap-0.5 transform rotate-6 animate-pulse">
                    <span>🛡️</span>
                    <span>Level 3</span>
                  </div>
                </div>
              </div>

              {/* Foreground glowing stone pathway */}
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-[#1B294B] border-t-4 border-slate-950 z-10 pointer-events-none">
                <svg className="w-full h-full opacity-60" viewBox="0 0 400 112" fill="none">
                  {/* Glowing 2.5D stone tile lines */}
                  <path d="M0 0 L400 0 M50 0 L10 112 M150 0 L100 112 M250 0 L280 112 M350 0 L390 112" stroke="#4F46E5" strokeWidth="2" />
                  <path d="M0 40 L400 40 M0 80 L400 80" stroke="#4F46E5" strokeWidth="1" />
                </svg>
              </div>

              {/* Characters actively doing something together on path */}
              <div className="relative z-25 flex items-end justify-between w-full h-full pb-4 px-2 pointer-events-none">
                
                {/* Princess Luna pointing at screen */}
                <div className="flex flex-col items-center translate-y-3">
                  <PrincessLuna className="h-32 w-32 filter drop-shadow-[0_4px_12px_rgba(236,72,153,0.3)] transform scale-x-[-1]" />
                </div>

                {/* Bit Bot reaching up and waving toward the code block */}
                <div className="flex flex-col items-center translate-y-3">
                  <MoboRobot expression="happy" className="h-32 w-32 filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)]" />
                </div>

              </div>

              {/* Ambient lighting warm lantern overlay at bottom */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-40 h-8 bg-amber-400/20 blur-xl rounded-full z-20 pointer-events-none"></div>

            </div>

            {/* Elegant subtext description */}
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 mt-4 text-center">
              "Learning programming has never felt this magical"
            </span>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mx-auto text-center z-10 pt-8">
          <button
            onClick={() => {
              handleBtnClick();
              document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-slate-400 hover:text-slate-900 transition-colors duration-150 animate-bounce flex flex-col items-center"
            title="Scroll Down"
          >
            <span className="text-xs font-black uppercase tracking-widest">Discover More</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

      </section>


      {/* ----------------------------------------------------
          SECTION 2: HOW BITBUDS WORKS (DISNEY-STYLE FLOW)
          ---------------------------------------------------- */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border-2 border-indigo-200 inline-block">
              THE METHOD
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Learn Coding Like a Hero
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500 max-w-2xl mx-auto leading-relaxed">
              We weave actual computer science logic into beautiful visual fairy tales. Your kids aren't writing dry code; they're curing sleeping spells and launching rocket ships!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="group rounded-[24px] border-4 border-slate-900 bg-[#FAF9F5] p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,1)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-slate-900 bg-purple-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)] text-2xl">
                📖
              </div>
              <span className="block text-xs font-black text-slate-400 mt-6 uppercase tracking-wider">Step 01</span>
              <h3 className="text-2xl font-black text-slate-900 uppercase mt-1">Discover Story</h3>
              <p className="text-sm font-semibold text-slate-600 mt-3 leading-relaxed">
                Meet animated companions. Explore magical castles, pirate bays, and crystal-studded islands. Solve mysteries built directly into the fabric of the narrative.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black text-purple-600 uppercase">
                <span>Explore worlds</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="group rounded-[24px] border-4 border-slate-900 bg-[#FAF9F5] p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,1)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-slate-900 bg-blue-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)] text-2xl">
                🔮
              </div>
              <span className="block text-xs font-black text-slate-400 mt-6 uppercase tracking-wider">Step 02</span>
              <h3 className="text-2xl font-black text-slate-900 uppercase mt-1">Learn Visually</h3>
              <p className="text-sm font-semibold text-slate-600 mt-3 leading-relaxed">
                Watch magical animations where complex concepts like Variables (boxes) and Loops (wheels) explain themselves naturally. No frustrating text syntax required.
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black text-blue-600 uppercase">
                <span>Conceptual clarity</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="group rounded-[24px] border-4 border-slate-900 bg-[#FAF9F5] p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,1)]">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-slate-900 bg-emerald-100 shadow-[2px_2px_0_0_rgba(15,23,42,1)] text-2xl">
                🏆
              </div>
              <span className="block text-xs font-black text-slate-400 mt-6 uppercase tracking-wider">Step 03</span>
              <h3 className="text-2xl font-black text-slate-900 uppercase mt-1">Complete Challenges</h3>
              <p className="text-sm font-semibold text-slate-600 mt-3 leading-relaxed">
                Solve game puzzles, navigate tricky mazes with block instructions, and conquer quizzes. Earn XP points, shiny gold coins, and rare customizable badges!
              </p>
              <div className="mt-6 flex items-center gap-2 text-xs font-black text-emerald-600 uppercase">
                <span>Gather badges</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 3: CHOOSE YOUR ADVENTURE (WORLD BENTO SECTOR)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border-2 border-amber-200 inline-block">
              CAMPAIGNS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Choose Your Adventure
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Each themed world introduces essential engineering logic via deep immersive stories. Click on a world to instantly begin playing!
            </p>
          </div>

          {/* Horizontal World Cards Grid */}
          <div className="space-y-8">
            {WORLDS.map((w, index) => (
              <div 
                key={w.id} 
                className={`group rounded-[28px] border-4 border-slate-900 bg-white p-6 sm:p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,1)] flex flex-col md:flex-row items-center justify-between gap-8`}
              >
                {/* World Illustration Area */}
                <div className="w-full md:w-[280px] shrink-0 aspect-[4/3] rounded-2xl border-4 border-slate-900 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-inner">
                  {/* Styled background representation */}
                  <div className="absolute inset-0 bg-slate-100 opacity-50"></div>
                  {index === 0 && <span className="text-6xl animate-pulse">🚀</span>}
                  {index === 1 && <span className="text-6xl animate-bounceSlow">🏰</span>}
                  {index === 2 && <span className="text-6xl animate-spin" style={{ animationDuration: '10s' }}>🏴‍☠️</span>}
                  
                  {/* Subtle watermarks */}
                  <span className="absolute bottom-2 right-2 text-xs font-black text-slate-300 uppercase tracking-widest">
                    WORLD {index + 1}
                  </span>
                </div>

                {/* World Text Information */}
                <div className="grow space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full border-2 border-slate-900 bg-white shadow-[1px_1px_0_0_rgba(15,23,42,1)] flex items-center gap-1">
                      <span>{w.icon}</span>
                      <span>{w.name}</span>
                    </span>
                    <span className="text-xs font-black uppercase px-3 py-1 rounded-full border-2 border-slate-900 bg-yellow-400 shadow-[1px_1px_0_0_rgba(15,23,42,1)]">
                      Concept: {w.concept}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-slate-900 uppercase">
                    The Quest for {w.concept}
                  </h3>
                  
                  <p className="text-sm font-semibold text-slate-500 leading-relaxed max-w-2xl">
                    {w.description} Engage in story challenges, write loops to bypass stone barriers, and command functions.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-black uppercase text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4 text-indigo-500" />
                      {w.lessonCount}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-emerald-500" />
                      Rewards: {w.rewards}
                    </span>
                  </div>
                </div>

                {/* Play Action Button */}
                <div className="w-full md:w-auto shrink-0 self-stretch md:self-center flex">
                  <button
                    onClick={() => {
                      handleBtnClick();
                      onStartAdventure(w.id);
                    }}
                    className="w-full md:w-auto flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-yellow-400 px-6 py-4 font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                    id={`world-play-btn-${w.id}`}
                  >
                    <span>Play Chapter</span>
                    <Play className="h-4 w-4 fill-slate-900" />
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 4: MEET THE CHARACTERS (NINTENDO-STYLE PROFILE)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full border-2 border-pink-200 inline-block">
              CAST
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Meet The Characters
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Each buddy holds unique personality codes and magic powers that help children comprehend advanced engineering.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Interactive Portrait Selector Tabs (Left Col) */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col flex-wrap gap-3 justify-center">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  onClick={() => {
                    handleBtnClick();
                    setActiveChar(char.id);
                  }}
                  className={`flex-1 lg:flex-initial flex items-center gap-3 rounded-2xl border-4 border-slate-900 px-4 py-3 text-left font-black text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] transition-all active:translate-y-0.5 ${
                    activeChar === char.id 
                      ? 'bg-blue-100 border-blue-600 -translate-y-0.5 shadow-[5px_5px_0_0_rgba(37,99,235,1)]' 
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  id={`char-tab-${char.id}`}
                >
                  <span className="text-2xl">
                    {char.id === 'bit' ? '🤖' : char.id === 'luna' ? '👩‍👑' : char.id === 'wizard' ? '🧙‍♂️' : '🏴‍☠️'}
                  </span>
                  <div>
                    <div className="text-sm font-black leading-tight">{char.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{char.role}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Display Active Profile Details Panel (Right Col) */}
            <div className="lg:col-span-8">
              {CHARACTERS.map((char) => {
                if (char.id !== activeChar) return null;
                return (
                  <div 
                    key={char.id}
                    className="animate-fadeIn rounded-[32px] border-4 border-slate-900 bg-[#FAF9F5] p-8 shadow-[8px_8px_0_0_rgba(15,23,42,1)] grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
                  >
                    {/* SVG Portrait stage */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center bg-white border-4 border-slate-900 rounded-[24px] p-6 shadow-inner relative overflow-hidden aspect-square">
                      <div className="absolute inset-0 bg-slate-50/50 z-0"></div>
                      <div className="relative z-10">
                        {char.avatarComponent}
                      </div>
                    </div>

                    {/* Profile text descriptors */}
                    <div className="md:col-span-7 space-y-4">
                      <div>
                        <span className="text-xs font-black uppercase text-indigo-600 tracking-wider">
                          CHARACTER FILE
                        </span>
                        <h3 className="text-3xl font-black text-slate-900 uppercase">
                          {char.name}
                        </h3>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                          {char.role}
                        </p>
                      </div>

                      <p className="text-sm font-semibold text-slate-600 leading-relaxed">
                        {char.story}
                      </p>

                      <div className="space-y-2 border-t-2 border-slate-900/10 pt-4 text-xs font-bold">
                        <div>
                          <span className="text-slate-400 uppercase tracking-wider block">Personality:</span>
                          <span className="text-slate-800">{char.personality}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 uppercase tracking-wider block">Favorite Coding Concept:</span>
                          <span className="text-indigo-600 font-extrabold">{char.favTopic}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 5: INTERACTIVE STORY EXAMPLE (SIMULATOR)
          ---------------------------------------------------- */}
      <section id="interactive-example" className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border-2 border-emerald-200 inline-block">
              PLAYABLE PREVIEW
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Interactive Story Example
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Curious how we turn stories into lessons? Step through the gameplay simulation below!
            </p>
          </div>

          <div className="rounded-[32px] border-4 border-slate-900 bg-white p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(15,23,42,1)] space-y-8">
            
            {/* Cinematic step progression bar */}
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 right-0 h-1 bg-slate-200 z-0"></div>
              {['The Story', 'The Concept', 'The Puzzle', 'The Quiz', 'The Reward'].map((label, index) => {
                const isActive = index <= storyStep;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      handleBtnClick();
                      setStoryStep(index);
                      setQuizAnswer(null);
                      setQuizSuccess(null);
                    }}
                    className="relative z-10 flex flex-col items-center gap-1 group"
                    id={`story-step-btn-${index}`}
                  >
                    <div className={`h-8 w-8 rounded-full border-2 border-slate-900 flex items-center justify-center font-black text-xs transition-all duration-150 ${
                      isActive ? 'bg-blue-500 text-white scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                    }`}>
                      {index + 1}
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:inline ${
                      isActive ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Display panel based on step */}
            <div className="border-4 border-slate-900 rounded-[24px] p-6 bg-slate-50 min-h-[300px] flex flex-col justify-between">
              
              {/* STEP 1: STORY INTRO */}
              {storyStep === 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-pink-600 bg-pink-100 px-3 py-1 rounded-full border-2 border-slate-900">
                      Chapter 1 Scene
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-900">
                    Princess Luna’s Lost Crystal
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed max-w-2xl">
                    "Oh dear! Our royal kingdom power grid has vanished! Bit, we must coordinate our magical treasure chests immediately to restore power before the Shadow Dragon arrives!"
                  </p>
                  
                  {/* Comic Strip Mock Visual */}
                  <div className="border-2 border-slate-900 rounded-xl bg-white p-4 flex items-center justify-center gap-8 shadow-sm">
                    <PrincessLuna className="h-20 w-20" />
                    <span className="text-3xl animate-bounce">➡️ 🔮 ➡️</span>
                    <MagicTreasureChest className="h-16 w-16" />
                  </div>
                </div>
              )}

              {/* STEP 2: CONCEPTUAL EXPLANATION */}
              {storyStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-blue-600 bg-blue-100 px-3 py-1 rounded-full border-2 border-slate-900">
                      Visual Lesson
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-900">
                    What is a Variable?
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed max-w-2xl">
                    Think of a variable as a labeled treasure box! You can put gold, spell potions, or crystals inside. The name on the box stays the same, but the magic content inside can change!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border-2 border-slate-900 rounded-xl bg-amber-50 p-3 flex items-center gap-3">
                      <VariableBox className="h-12 w-12" />
                      <div>
                        <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-slate-900 text-amber-600">x = 10</span>
                        <span className="block text-[10px] text-slate-500 font-bold mt-1">Box labeled 'x' contains value 10</span>
                      </div>
                    </div>
                    <div className="border-2 border-slate-900 rounded-xl bg-indigo-50 p-3 flex items-center gap-3">
                      <VariableBox className="h-12 w-12" />
                      <div>
                        <span className="font-mono text-xs font-black bg-white px-2 py-0.5 rounded border border-slate-900 text-indigo-600">x = 20</span>
                        <span className="block text-[10px] text-slate-500 font-bold mt-1">Now we replaced it with value 20!</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PLAYABLE INTERACTIVE CODE BLOCKS PUZZLE */}
              {storyStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-amber-600 bg-amber-100 px-3 py-1 rounded-full border-2 border-slate-900">
                      Code Puzzle
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-900">
                    Define the crystal variable
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Assemble the tokens to make <span className="font-mono bg-white px-1 py-0.5 border border-slate-200 text-amber-600 font-extrabold">crystal = "magic"</span>
                  </p>

                  <div className="flex flex-wrap gap-2 p-3 bg-white border-2 border-slate-900/10 rounded-xl">
                    <span className="font-mono font-black text-xs bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg text-amber-800">
                      crystal
                    </span>
                    <span className="font-mono font-black text-xs bg-slate-100 border border-slate-300 px-3 py-1.5 rounded-lg text-slate-800">
                      =
                    </span>
                    <span className="font-mono font-black text-xs bg-indigo-100 border border-indigo-300 px-3 py-1.5 rounded-lg text-indigo-800">
                      "magic"
                    </span>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" /> Perfect block alignment! Let’s trigger the compiler!
                  </span>
                </div>
              )}

              {/* STEP 4: INTERACTIVE MINI-QUIZ */}
              {storyStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase text-purple-600 bg-purple-100 px-3 py-1 rounded-full border-2 border-slate-900">
                      Story Checkpoint
                    </span>
                  </div>
                  <h3 className="text-2xl font-black uppercase text-slate-900">
                    Which code block stores the number 5 inside a variable called stars?
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { code: 'stars = 5', correct: true },
                      { code: '5 = stars', correct: false },
                      { code: 'stars == "5"', correct: false },
                    ].map((opt) => (
                      <button
                        key={opt.code}
                        onClick={() => {
                          handleBtnClick();
                          setQuizAnswer(opt.code);
                          setQuizSuccess(opt.correct);
                          if (opt.correct) handleCorrectSound();
                          else handleIncorrectSound();
                        }}
                        className={`font-mono text-sm font-black p-4 rounded-xl border-2 text-center transition-all ${
                          quizAnswer === opt.code
                            ? opt.correct
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                              : 'bg-rose-100 border-rose-500 text-rose-800'
                            : 'bg-white border-slate-900/10 hover:border-slate-900'
                        }`}
                        id={`quiz-opt-${opt.code}`}
                      >
                        {opt.code}
                      </button>
                    ))}
                  </div>

                  {quizSuccess === true && (
                    <div className="text-xs font-black text-emerald-600 animate-pulse">
                      🎉 Correct! Variable names always sit on the left!
                    </div>
                  )}
                  {quizSuccess === false && (
                    <div className="text-xs font-black text-rose-600 animate-shake">
                      ❌ Try again! We put the label name on the left and value on the right.
                    </div>
                  )}
                </div>
              )}

              {/* STEP 5: COLLECT REWARD */}
              {storyStep === 4 && (
                <div className="space-y-4 text-center">
                  <div className="text-5xl animate-bounce">🎁</div>
                  <h3 className="text-2xl font-black uppercase text-slate-900">
                    Adventure Complete!
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    Princess Luna’s magical crystal sparkles bright once more. Bit levels up!
                  </p>

                  <div className="flex justify-center gap-4">
                    <div className="bg-amber-100 border-2 border-amber-400 rounded-xl px-4 py-2 font-black text-amber-800 flex items-center gap-1 text-xs">
                      <span>💎</span>
                      <span>+100 Magic Crystals</span>
                    </div>
                    <div className="bg-indigo-100 border-2 border-indigo-400 rounded-xl px-4 py-2 font-black text-indigo-800 flex items-center gap-1 text-xs">
                      <span>⭐</span>
                      <span>+50 XP</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step navigations inside the simulation */}
              <div className="flex justify-between border-t-2 border-slate-900/5 pt-4 mt-4">
                <button
                  onClick={() => {
                    handleBtnClick();
                    setStoryStep((p) => Math.max(0, p - 1));
                    setQuizAnswer(null);
                    setQuizSuccess(null);
                  }}
                  disabled={storyStep === 0}
                  className={`text-xs font-black uppercase px-4 py-2 rounded-xl border-2 border-slate-900 bg-white shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none`}
                  id="prev-sim-btn"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    handleBtnClick();
                    setStoryStep((p) => Math.min(4, p + 1));
                    setQuizAnswer(null);
                    setQuizSuccess(null);
                  }}
                  disabled={storyStep === 4}
                  className={`text-xs font-black uppercase px-4 py-2 rounded-xl border-2 border-slate-900 bg-yellow-400 shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-0.5 disabled:opacity-40 disabled:pointer-events-none`}
                  id="next-sim-btn"
                >
                  Next Step
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 6: LEARNING JOURNEY (ADVENTURE ROADMAP)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border-2 border-indigo-200 inline-block">
              CURRICULUM ROAD
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Learning Journey Map
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Each island unlocks once the previous story chapters are successfully completed. Follow the starlight path!
            </p>
          </div>

          {/* Timeline visualization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative">
            {ROADMAP.map((node, index) => (
              <div 
                key={node.name} 
                className={`relative rounded-[20px] border-4 border-slate-900 p-5 shadow-[4px_4px_0_0_rgba(15,23,42,1)] flex flex-col justify-between ${
                  index === 0 ? 'bg-amber-100' : 'bg-white'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-slate-400 uppercase">
                    STEP {node.step}
                  </span>
                  {index > 0 ? (
                    <Lock className="h-4 w-4 text-slate-400" />
                  ) : (
                    <span className="animate-pulse flex h-2 w-2 rounded-full bg-emerald-500"></span>
                  )}
                </div>

                <div className="mt-4">
                  <h4 className="text-lg font-black text-slate-900 uppercase leading-tight">
                    {node.name}
                  </h4>
                  <p className="text-xs font-bold text-slate-500 mt-1">
                    {node.desc}
                  </p>
                </div>

                <span className={`block text-xs font-black uppercase mt-4 ${
                  index === 0 ? 'text-amber-600' : 'text-slate-400'
                }`}>
                  {node.status}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 7: WHY KIDS LOVE BITBUDS (BENEFITS GRID)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-pink-600 bg-pink-50 px-4 py-1.5 rounded-full border-2 border-pink-200 inline-block">
              FEATURES
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Why Kids Love BitBuds
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              We design every single module to promote long-term memory encoding, tactile fun, and safe play.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item) => (
              <div 
                key={item.title} 
                className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-slate-900 bg-slate-100 shadow-[1px_1px_0_0_rgba(15,23,42,1)]">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-black text-slate-900 uppercase mt-4 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold text-slate-500 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 8: PARENTS & TEACHERS (PROFESSIONAL PREVIEW)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Analytics Dashboard Info (Left) */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full border-2 border-blue-200 inline-block">
                FOR ADULTS
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
                Parents & Teachers
              </h2>
              <p className="text-md sm:text-lg font-bold text-slate-500 leading-relaxed">
                BitBuds is built with total transparency. While kids play, our background engine compiles accurate progress indexes and skill matrices.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-600">
                    Weekly email newsletters containing newly unlocked vocabularies.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-600">
                    Curriculum fully aligned with national computer science requirements.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-sm font-semibold text-slate-600">
                    Time controls to automatically freeze active play after set hours.
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Live Analytics Dashboard Panel (Right) */}
            <div className="lg:col-span-7 rounded-[28px] border-4 border-slate-900 bg-[#FAF9F5] p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] space-y-6">
              
              {/* Dashboard Header */}
              <div className="flex justify-between items-center border-b-2 border-slate-900/10 pb-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900 uppercase">
                    Parents Analytics Portal
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Student Profile: Chloe (Age 9)
                  </span>
                </div>
                
                {/* Sub tabs inside the parent preview */}
                <div className="flex gap-1 bg-white p-1 rounded-xl border-2 border-slate-900 text-xs font-black">
                  {['progress', 'skills', 'activity'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        handleBtnClick();
                        setAnalyticsTab(tab as any);
                      }}
                      className={`px-3 py-1.5 rounded-lg capitalize ${
                        analyticsTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-slate-100 text-slate-600'
                      }`}
                      id={`parents-tab-${tab}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Tab panel visualizer */}
              {analyticsTab === 'progress' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white border-2 border-slate-900/10 rounded-xl p-3 text-center">
                      <span className="block text-2xl font-black text-blue-600">12</span>
                      <span className="text-[9px] text-slate-400 uppercase font-black">Levels Conquered</span>
                    </div>
                    <div className="bg-white border-2 border-slate-900/10 rounded-xl p-3 text-center">
                      <span className="block text-2xl font-black text-purple-600">1,450</span>
                      <span className="text-[9px] text-slate-400 uppercase font-black">XP Gathered</span>
                    </div>
                    <div className="bg-white border-2 border-slate-900/10 rounded-xl p-3 text-center">
                      <span className="block text-2xl font-black text-emerald-600">94%</span>
                      <span className="text-[9px] text-slate-400 uppercase font-black">Quiz Success Rate</span>
                    </div>
                  </div>

                  {/* Mock Chart displaying weekly progress */}
                  <div className="bg-white rounded-xl border-2 border-slate-900/10 p-4 space-y-2">
                    <span className="text-xs font-black text-slate-400 uppercase">Coding Minutes / Day</span>
                    <div className="h-20 flex items-end gap-2 pt-4 justify-between border-b border-slate-200">
                      {[
                        { day: 'Mon', h: 'h-6', min: '12m' },
                        { day: 'Tue', h: 'h-12', min: '25m' },
                        { day: 'Wed', h: 'h-8', min: '15m' },
                        { day: 'Thu', h: 'h-16', min: '35m' },
                        { day: 'Fri', h: 'h-4', min: '10m' },
                        { day: 'Sat', h: 'h-20', min: '45m' },
                        { day: 'Sun', h: 'h-10', min: '20m' },
                      ].map((item) => (
                        <div key={item.day} className="flex-1 flex flex-col items-center gap-1 group relative">
                          <span className="absolute -top-6 text-[9px] font-black bg-slate-900 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {item.min}
                          </span>
                          <div className={`w-full ${item.h} bg-blue-500 rounded-t-lg transition-all group-hover:bg-blue-600`}></div>
                          <span className="text-[9px] font-black text-slate-400 uppercase">{item.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Skills Tab panel visualizer */}
              {analyticsTab === 'skills' && (
                <div className="space-y-4 animate-fadeIn">
                  <span className="text-xs font-black text-slate-400 uppercase">Conquered Concepts breakdown</span>
                  <div className="space-y-3 bg-white rounded-xl border-2 border-slate-900/10 p-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Variables & Declarations</span>
                        <span>100% Mastered</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Repeat Loop sequences</span>
                        <span>75% Completed</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>Logic Checks (If-Else)</span>
                        <span>40% Progress</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2.5 rounded-full mt-1 overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Activity tab visualizer */}
              {analyticsTab === 'activity' && (
                <div className="space-y-3 animate-fadeIn bg-white rounded-xl border-2 border-slate-900/10 p-4">
                  <span className="text-xs font-black text-slate-400 uppercase">Live Activity feed</span>
                  <div className="space-y-2 text-xs font-bold text-slate-600">
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span>🎉 Unlocked the Variables Flask badge</span>
                      <span className="text-slate-400">10m ago</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 pb-1.5">
                      <span>✅ Answered "Variables left/right orientation" Quiz successfully</span>
                      <span className="text-slate-400">18m ago</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🚀 Launched Space Explorer level 3</span>
                      <span className="text-slate-400">25m ago</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 9: ACHIEVEMENTS (BADGES GRID)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-[#FAF9F5]">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-50 px-4 py-1.5 rounded-full border-2 border-purple-200 inline-block">
              REWARDS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Beautiful Collectibles
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Kids show off custom-designed virtual badges, collect golden coins, and customize their robot companions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {BADGES.map((badge) => (
              <div 
                key={badge.name} 
                className="rounded-2xl border-4 border-slate-900 bg-white p-5 shadow-[4px_4px_0_0_rgba(15,23,42,1)] flex flex-col items-center text-center transition-all hover:scale-105"
              >
                <div className={`h-16 w-16 rounded-full border-4 border-slate-900 ${badge.color} flex items-center justify-center text-3xl shadow-[2px_2px_0_0_rgba(15,23,42,1)]`}>
                  {badge.icon}
                </div>
                <h4 className="text-md font-black text-slate-900 uppercase mt-4 leading-tight">
                  {badge.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-500 mt-1 leading-normal">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 10: TESTIMONIALS (MASONRY QUOTE BLOCKS)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <span className="text-xs font-black uppercase tracking-widest text-amber-600 bg-amber-50 px-4 py-1.5 rounded-full border-2 border-amber-200 inline-block">
              REVIEWS
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Loved by Children & Parents
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Read real feedback from our tiny master programmers and active coding households.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((test) => (
              <div 
                key={test.author} 
                className="rounded-[24px] border-4 border-slate-900 bg-[#FAF9F5] p-6 sm:p-8 shadow-[6px_6px_0_0_rgba(15,23,42,1)] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Rating Stars */}
                  <div className="flex gap-1">
                    {[...Array(test.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  
                  <p className="text-sm font-semibold text-slate-600 leading-relaxed italic">
                    "{test.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 border-t-2 border-slate-900/5 pt-4 mt-6">
                  <div className="h-10 w-10 rounded-full border-2 border-slate-900 bg-white flex items-center justify-center text-xl shadow-[1px_1px_0_0_rgba(15,23,42,1)]">
                    {test.avatar}
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-900 uppercase leading-none">
                      {test.author}
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                      {test.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 11: FREQUENTLY ASKED QUESTIONS (ACCORDION)
          ---------------------------------------------------- */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-slate-900 bg-[#FAF9F5]">
        <div className="mx-auto max-w-4xl space-y-16">
          
          <div className="text-center space-y-4">
            <span className="text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border-2 border-indigo-200 inline-block">
              INFO BOX
            </span>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 uppercase leading-none">
              Frequently Asked Questions
            </h2>
            <p className="text-md sm:text-lg font-bold text-slate-500">
              Have questions? We hold the secret spell formulas.
            </p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = selectedFaq === index;
              return (
                <div 
                  key={faq.q} 
                  className="rounded-2xl border-4 border-slate-900 bg-white overflow-hidden shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                >
                  <button
                    onClick={() => {
                      handleBtnClick();
                      setSelectedFaq(isOpen ? null : index);
                    }}
                    className="w-full flex justify-between items-center px-6 py-5 text-left font-black text-slate-900 uppercase hover:bg-slate-50 transition-colors duration-100"
                    id={`faq-btn-${index}`}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-5 w-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t-2 border-slate-900/10 text-sm font-semibold text-slate-600 leading-relaxed animate-fadeIn">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          SECTION 12: FINAL CALL TO ACTION (CINEMATIC SCENE)
          ---------------------------------------------------- */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-blue-900 via-indigo-950 to-slate-950 text-white border-b-4 border-slate-900 overflow-hidden text-center">
        
        {/* Floating star particles in outer space landscape */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-10 left-[20%] h-1.5 w-1.5 bg-white rounded-full animate-ping"></div>
          <div className="absolute bottom-20 right-[15%] h-2 w-2 bg-white rounded-full animate-pulse"></div>
        </div>

        <div className="relative z-10 mx-auto max-w-4xl space-y-8">
          
          <div className="flex justify-center">
            <MoboRobot expression="victory" className="h-28 w-28 filter drop-shadow-lg" />
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl sm:text-6xl font-black uppercase tracking-tight leading-none">
              Ready for Your First Adventure?
            </h2>
            <p className="text-md sm:text-lg font-bold text-blue-200 max-w-2xl mx-auto leading-relaxed">
              No credit card required. Give your child the magical superpower of engineering in minutes!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                handleBtnClick();
                onStartAdventure('robo-logic');
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-yellow-400 px-8 py-5 text-lg font-black text-slate-900 shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
              id="final-cta-btn"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => {
                handleBtnClick();
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-8 py-5 text-lg font-black text-slate-900 shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
              id="final-cta-demo-btn"
            >
              <span>Watch Demo</span>
            </button>
          </div>

        </div>
      </section>


      {/* ----------------------------------------------------
          FOOTER (Disney / Nintendo / Stripe Quality Footer)
          ---------------------------------------------------- */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <BitBudsLogo className="h-12" />
            <p className="text-xs font-semibold leading-relaxed text-slate-500">
              Making programming magical for every child on the planet. We weave actual computational logic into narrative storybook maps.
            </p>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4">Adventures</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><button onClick={() => { handleBtnClick(); onStartAdventure('robo-logic'); }} className="hover:text-white transition-colors">Space Explorer</button></li>
              <li><button onClick={() => { handleBtnClick(); onStartAdventure('frontend-magic'); }} className="hover:text-white transition-colors">Magic Kingdom</button></li>
              <li><button onClick={() => { handleBtnClick(); onStartAdventure('python-safari'); }} className="hover:text-white transition-colors">Pirate Island</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4">Company</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">STEM Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers (We’re hiring!)</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Spellcasters</a></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-black text-white uppercase tracking-widest mb-4">Safety & Mission</h5>
            <ul className="space-y-2 text-xs font-semibold">
              <li><a href="#" className="hover:text-white transition-colors">COPPA Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Magic Service</a></li>
            </ul>
          </div>

        </div>

        <div className="mx-auto max-w-7xl border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 BitBuds Inc. Handcrafted for future engineers with rounded pixels.</p>
          <div className="flex gap-4">
            <span className="text-[10px] font-black text-emerald-500 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
              ● COPPASAFE ENVIRONMENT
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
