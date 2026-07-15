import React from 'react';

// Highly polished, professional, human-designed vector assets (SVGs with rich gradients, shadows, and subtle animations)
// These replace placeholder emojis with modern design elements suitable for a top-tier product portfolio.

interface MascotProps {
  expression: 'happy' | 'thinking' | 'sad' | 'victory';
  className?: string;
}

export function MoboRobot({ expression, className = "h-24 w-24" }: MascotProps) {
  // Adaptation of "Bit" - Royal Blue (Hex #2E4EDB), round head, horizontal side muffs, sky-blue face screen, and circular belly plate with </>.
  return (
    <svg className={`${className} animate-pulse`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Color Palette from Style Sheet */}
        <linearGradient id="bitBodyGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#2E4EDB" /> {/* Royal Blue */}
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <linearGradient id="bitFaceGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#7FC7F5" /> {/* Sky Blue */}
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="badgeGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#1e3a8a" />
        </linearGradient>
        <filter id="bitGlow">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Head Antenna */}
      <rect x="47" y="6" width="6" height="12" fill="#2E4EDB" rx="3" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="50" cy="6" r="4.5" fill="#7FC7F5" stroke="#0f172a" strokeWidth="2.5" />

      {/* Side Horizontal Ear Muffs (Bit's ears) */}
      <rect x="6" y="38" width="12" height="20" fill="#1e3a8a" rx="5" stroke="#0f172a" strokeWidth="2.5" />
      <rect x="82" y="38" width="12" height="20" fill="#1e3a8a" rx="5" stroke="#0f172a" strokeWidth="2.5" />

      {/* Round Main Body & Limbs */}
      <circle cx="50" cy="54" r="38" fill="url(#bitBodyGrad)" stroke="#0f172a" strokeWidth="4" />

      {/* Tummy Plate Badge with </ > Symbol (Signature feature of Bit on reference sheet) */}
      <circle cx="50" cy="74" r="14" fill="url(#badgeGrad)" stroke="#0f172a" strokeWidth="2.5" />
      <text x="50" y="79" fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle" fontFamily="monospace" filter="url(#bitGlow)">&lt;/&gt;</text>

      {/* Sky Blue Face Screen */}
      <rect x="22" y="24" width="56" height="34" fill="url(#bitFaceGrad)" rx="14" stroke="#0f172a" strokeWidth="3" />

      {/* Dynamic Expressions */}
      {expression === 'thinking' && (
        <>
          {/* Thinking eyes (closed arcs or questioning) */}
          <path d="M34 40 Q40 44 42 40" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          <circle cx="62" cy="38" r="4" fill="#0f172a" />
          <path d="M44 48 Q50 44 56 48" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
          {/* Floating thought sparkles */}
          <circle cx="74" cy="18" r="2.5" fill="#F5C24C" />
          <circle cx="80" cy="13" r="1.5" fill="#F5C24C" />
        </>
      )}

      {expression === 'happy' && (
        <>
          {/* Big happy eyes */}
          <circle cx="38" cy="38" r="5" fill="#0f172a" />
          <circle cx="62" cy="38" r="5" fill="#0f172a" />
          {/* Friendly happy smile */}
          <path d="M44 46 Q50 52 56 46" stroke="#0f172a" strokeWidth="3.5" strokeLinecap="round" fill="none" />
        </>
      )}

      {expression === 'sad' && (
        <>
          {/* Downward curves for sad face */}
          <path d="M32 40 Q38 34 42 40" stroke="#0f172a" strokeWidth="3" fill="none" />
          <path d="M58 40 Q64 34 68 40" stroke="#0f172a" strokeWidth="3" fill="none" />
          {/* Sad loop mouth */}
          <path d="M46 48 Q50 45 54 48" stroke="#0f172a" strokeWidth="3" fill="none" />
          {/* Small repair band-aid */}
          <rect x="24" y="46" width="10" height="5" fill="#F5A9CD" rx="1.5" stroke="#0f172a" strokeWidth="1" transform="rotate(15 24 46)" />
        </>
      )}

      {expression === 'victory' && (
        <>
          {/* Twinkle Eyes for Victory */}
          <path d="M32 38 L38 38 M35 35 L35 41" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 38 L66 38 M63 35 L63 41" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
          {/* Huge laughter mouth */}
          <path d="M42 44 Q50 54 58 44 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2.5" />
        </>
      )}
    </svg>
  );
}

export function GlimmerWizard({ expression, className = "h-24 w-24" }: MascotProps) {
  // Adaptation of "Wizard Byte" - Purple robe and hat (Hex #8A5FD6), starry wizard elements, and silver stardust beard.
  return (
    <svg className={`${className} animate-bounceSlow`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wizHatGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#8A5FD6" /> {/* Theme Purple */}
          <stop offset="100%" stopColor="#5b21b6" />
        </linearGradient>
        <linearGradient id="wizBeardGrad" x1="0" y1="0" x2="0" y2="100">
          <stop offset="0%" stopColor="#FDFBF3" /> {/* Soft White */}
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
      </defs>

      {/* Pointy Wizard Hat */}
      <path d="M15 40 L50 2 L85 40 Z" fill="url(#wizHatGrad)" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
      {/* Hat brim */}
      <ellipse cx="50" cy="40" rx="42" ry="6" fill="#8A5FD6" stroke="#0f172a" strokeWidth="3.5" />

      {/* Golden stars on Hat */}
      <path d="M50 14 L52 18 L56 18 L53 20 L54 24 L50 22 L46 24 L47 20 L44 18 L48 18 Z" fill="#F5C24C" />
      <path d="M34 26 L35 28 L38 28 L36 30 L37 33 L34 31 L31 33 L32 30 L30 28 L33 28 Z" fill="#F5C24C" />

      {/* Thick fluffy Wizard Beard */}
      <path d="M22 52 Q50 98 78 52 Q65 78 50 78 Q35 78 22 52 Z" fill="url(#wizBeardGrad)" stroke="#0f172a" strokeWidth="3.5" />

      {/* Face Skin */}
      <circle cx="50" cy="48" r="16" fill="#fed7aa" stroke="#0f172a" strokeWidth="3.5" />

      {/* Cute glasses (Wizard Byte's signature look on reference sheet) */}
      <circle cx="43" cy="46" r="6" stroke="#F5C24C" strokeWidth="2.5" fill="none" />
      <circle cx="57" cy="46" r="6" stroke="#F5C24C" strokeWidth="2.5" fill="none" />
      <line x1="49" y1="46" x2="51" y2="46" stroke="#F5C24C" strokeWidth="3" />

      {/* Eyes based on state */}
      {expression === 'happy' || expression === 'victory' ? (
        <>
          <path d="M40 46 Q43 42 46 46" stroke="#0f172a" strokeWidth="3" fill="none" />
          <path d="M54 46 Q57 42 60 46" stroke="#0f172a" strokeWidth="3" fill="none" />
          <circle cx="50" cy="54" r="3.5" fill="#ef4444" />
        </>
      ) : (
        <>
          <circle cx="43" cy="46" r="2.5" fill="#0f172a" />
          <circle cx="57" cy="46" r="2.5" fill="#0f172a" />
          <line x1="46" y1="53" x2="54" y2="53" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

export function KokoMonkey({ expression, className = "h-24 w-24" }: MascotProps) {
  // Adaptation of "Captain Loop" - Pirate Captain, custom pirate hat (black with gold lining), mustache, and blue/red elements.
  return (
    <svg className={`${className} animate-pulse`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pirateHatGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* Cute Brown Hair */}
      <circle cx="50" cy="50" r="32" fill="#78350f" stroke="#0f172a" strokeWidth="3" />

      {/* Face Skin */}
      <circle cx="50" cy="52" r="24" fill="#fed7aa" stroke="#0f172a" strokeWidth="3" />

      {/* Red/White Striped Bandana */}
      <path d="M26 38 C32 32, 68 32, 74 38 L72 32 C66 28, 34 28, 28 32 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="2" />

      {/* Pirate Tricorne Hat (Captain Loop's Hat from sheet) */}
      <path d="M12 28 C30 14, 70 14, 88 28 C74 24, 26 24, 12 28 Z" fill="url(#pirateHatGrad)" stroke="#0f172a" strokeWidth="3.5" />
      <path d="M12 28 C20 10, 80 10, 88 28 Q50 -4, 12 28 Z" fill="url(#pirateHatGrad)" stroke="#0f172a" strokeWidth="3.5" />
      {/* Golden Hat Trim */}
      <path d="M12 28 C26 24, 74 24, 88 28" stroke="#F5C24C" strokeWidth="3.5" fill="none" />
      {/* Skull and Crossbones symbol on Hat */}
      <circle cx="50" cy="18" r="4" fill="#ffffff" />
      <line x1="45" y1="14" x2="55" y2="22" stroke="#ffffff" strokeWidth="1.5" />
      <line x1="55" y1="14" x2="45" y2="22" stroke="#ffffff" strokeWidth="1.5" />

      {/* Moustache (Captain Loop's pirate moustache) */}
      <path d="M36 60 Q50 56 64 60 Q50 64 36 60 Z" fill="#451a03" stroke="#0f172a" strokeWidth="2" />

      {/* Eyes & Pirate details */}
      {expression === 'happy' || expression === 'victory' ? (
        <>
          <path d="M38 48 Q44 44 46 48" stroke="#0f172a" strokeWidth="3" fill="none" />
          <path d="M54 48 Q56 44 62 48" stroke="#0f172a" strokeWidth="3" fill="none" />
          {/* Happy smile under moustache */}
          <path d="M45 66 Q50 72 55 66" stroke="#0f172a" strokeWidth="2.5" fill="none" />
        </>
      ) : (
        <>
          {/* Left Eye: Normal */}
          <circle cx="40" cy="48" r="3.5" fill="#0f172a" />
          {/* Right Eye: Eye Patch! (Captain Loop style) */}
          <circle cx="60" cy="48" r="6" fill="#0f172a" />
          <line x1="48" y1="36" x2="72" y2="60" stroke="#0f172a" strokeWidth="3" />
        </>
      )}

      {/* Cute cheeks */}
      <circle cx="34" cy="54" r="3" fill="#f472b6" opacity="0.5" />
      <circle cx="66" cy="54" r="3" fill="#f472b6" opacity="0.5" />
    </svg>
  );
}

// Gorgeous glowing crystal
export function GlowingCrystal({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={`${className} animate-bounce`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="crystalGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="40%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <filter id="glowLight">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Ambient background glow ring */}
      <circle cx="50" cy="50" r="38" fill="#22d3ee" opacity="0.15" filter="url(#glowLight)" />

      {/* Crystal Diamond vector geometry */}
      <path d="M50 8 L85 42 L50 92 L15 42 Z" fill="url(#crystalGrad)" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
      
      {/* Front facets for extreme realistic depth */}
      <path d="M50 8 L50 92" stroke="#ffffff" strokeWidth="3.5" opacity="0.6" />
      <path d="M15 42 L85 42" stroke="#0e7490" strokeWidth="3" opacity="0.4" />
      <path d="M50 8 L32 42 L50 92" fill="#e0f7fa" opacity="0.25" />
      <path d="M50 8 L68 42 L50 92" fill="#ffffff" opacity="0.15" />
      
      {/* Twinkle Star sparkles */}
      <path d="M72 18 L74 24 L80 24 L75 27 L77 33 L72 30 L67 33 L69 27 L64 24 L70 24 Z" fill="#fef08a" />
    </svg>
  );
}

// High-quality Volcanic Stone Obstacle block
export function StoneObstacle({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="stoneGrad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
      </defs>

      {/* Solid jagged rock shape */}
      <path d="M20 80 L10 45 L35 15 L70 10 L90 40 L80 82 Z" fill="url(#stoneGrad)" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
      
      {/* Rocks cracks and depth facets */}
      <path d="M35 15 L50 48 L20 80" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 10 L50 48 L80 82" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 45 L50 48 M90 40 L50 48" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Little green cartoon moss tufts on top */}
      <path d="M38 14 Q45 6 52 14 Q60 8 68 12" stroke="#0f172a" strokeWidth="3" fill="#22c55e" strokeLinejoin="round" />
    </svg>
  );
}

// Decorative floating cloud
export function VectorCloud({ className = "h-16 w-32" }: { className?: string }) {
  return (
    <svg className={`${className} opacity-25 animate-pulse`} viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '6s' }}>
      <path d="M20 50 C20 50 10 45 10 35 C10 25 22 20 30 25 C35 15 50 10 65 18 C75 10 95 12 100 25 C110 25 115 35 110 45 C105 52 95 50 95 50 Z" fill="#ffffff" />
    </svg>
  );
}

// Decorative forest pine tree
export function PineTree({ className = "h-20 w-16" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Trunk */}
      <rect x="36" y="70" width="8" height="22" fill="#713f12" stroke="#0f172a" strokeWidth="3" />
      
      {/* Leaves Tiers */}
      <path d="M40 10 L15 50 L65 50 Z" fill="#15803d" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M40 30 L10 75 L70 75 Z" fill="#166534" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

// Landmark: Winding Bridge SVG
export function BridgeLandmark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="45" width="80" height="20" fill="#fbbf24" stroke="#0f172a" strokeWidth="4.5" rx="4" />
      <path d="M15 45 C35 15, 65 15, 85 45" stroke="#f59e0b" strokeWidth="6" fill="none" />
      <line x1="30" y1="28" x2="30" y2="45" stroke="#0f172a" strokeWidth="3" />
      <line x1="50" y1="22" x2="50" y2="45" stroke="#0f172a" strokeWidth="3" />
      <line x1="70" y1="28" x2="70" y2="45" stroke="#0f172a" strokeWidth="3" />
    </svg>
  );
}

// Landmark: Volcanic Mountain SVG
export function VolcanoLandmark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 85 L38 25 L62 25 L90 85 Z" fill="#475569" stroke="#0f172a" strokeWidth="4.5" strokeLinejoin="round" />
      {/* Lava flow crown */}
      <path d="M38 25 L44 42 L50 32 L56 42 L62 25 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
      {/* Smoke */}
      <circle cx="50" cy="14" r="8" fill="#94a3b8" opacity="0.8" />
    </svg>
  );
}

// Landmark: Space Rocket Launchpad SVG
export function RocketLandmark({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={`${className} animate-bounce`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '3s' }}>
      {/* Rocket Fins */}
      <path d="M30 75 L20 85 L35 85 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="3" />
      <path d="M70 75 L80 85 L65 85 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="3" />
      
      {/* Body */}
      <rect x="35" y="25" width="30" height="55" fill="#f8fafc" rx="15" stroke="#0f172a" strokeWidth="4.5" />
      {/* Nose cone */}
      <path d="M35 35 Q50 10 65 35 Z" fill="#ef4444" stroke="#0f172a" strokeWidth="4" />
      
      {/* Round Window */}
      <circle cx="50" cy="50" r="7" fill="#38bdf8" stroke="#0f172a" strokeWidth="3.5" />
      
      {/* Engine fire */}
      <path d="M42 80 L50 98 L58 80 Z" fill="#f59e0b" stroke="#0f172a" strokeWidth="2" />
    </svg>
  );
}

// Landmark / Character: Princess Luna (from characters list on sheet, in pink princess dress)
export function PrincessLuna({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={`${className} animate-bounceSlow`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="princessDress" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#F5A9CD" /> {/* Theme Pastel Pink */}
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Dress */}
      <path d="M25 85 L50 45 L75 85 Z" fill="url(#princessDress)" stroke="#0f172a" strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="50" cy="85" rx="25" ry="6" fill="#ec4899" stroke="#0f172a" strokeWidth="2" />

      {/* Lovely pink/brown hair */}
      <circle cx="50" cy="38" r="18" fill="#ec4899" stroke="#0f172a" strokeWidth="3" />
      <circle cx="36" cy="44" r="8" fill="#FDFBF3" />
      <circle cx="64" cy="44" r="8" fill="#FDFBF3" />

      {/* Face Skin */}
      <circle cx="50" cy="38" r="14" fill="#fed7aa" stroke="#0f172a" strokeWidth="3" />

      {/* Golden Crown */}
      <path d="M40 26 L44 32 L50 24 L56 32 L60 26 L56 34 L44 34 Z" fill="#F5C24C" stroke="#0f172a" strokeWidth="2" />

      {/* Eyes & smile */}
      <circle cx="45" cy="38" r="2" fill="#0f172a" />
      <circle cx="55" cy="38" r="2" fill="#0f172a" />
      <path d="M47 44 Q50 47 53 44" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Object: Magic Treasure Chest
export function MagicTreasureChest({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Wood Base */}
      <rect x="15" y="45" width="70" height="40" fill="#78350f" rx="6" stroke="#0f172a" strokeWidth="4" />
      
      {/* Curved Lid */}
      <path d="M15 45 C15 20, 85 20, 85 45 Z" fill="#92400e" stroke="#0f172a" strokeWidth="4" />
      
      {/* Golden Bands */}
      <rect x="30" y="22" width="8" height="63" fill="#F5C24C" stroke="#0f172a" strokeWidth="2.5" />
      <rect x="62" y="22" width="8" height="63" fill="#F5C24C" stroke="#0f172a" strokeWidth="2.5" />
      
      {/* Lock Plate */}
      <rect x="44" y="40" width="12" height="15" fill="#e2e8f0" rx="3" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="50" cy="45" r="2" fill="#0f172a" />
      <line x1="50" y1="47" x2="50" y2="52" stroke="#0f172a" strokeWidth="2" />
    </svg>
  );
}

// Object: Variable Box
export function VariableBox({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Box base */}
      <rect x="15" y="25" width="70" height="60" fill="#f59e0b" rx="8" stroke="#0f172a" strokeWidth="4.5" />
      
      {/* Box Inner Cover */}
      <rect x="25" y="35" width="50" height="40" fill="#d97706" rx="4" stroke="#0f172a" strokeWidth="3" />
      
      {/* "X" label for Variable */}
      <text x="50" y="64" fill="#ffffff" fontSize="30" fontWeight="900" textAnchor="middle" fontFamily="sans-serif">X</text>
    </svg>
  );
}

// Object: Loop Wheel
export function LoopWheel({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={`${className} animate-spin`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animationDuration: '8s' }}>
      {/* Circular wheel frame */}
      <circle cx="50" cy="50" r="38" fill="none" stroke="#2E4EDB" strokeWidth="7.5" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="28" fill="none" stroke="#7FC7F5" strokeWidth="5" />

      {/* Spokes */}
      <line x1="50" y1="12" x2="50" y2="88" stroke="#0f172a" strokeWidth="4.5" />
      <line x1="12" y1="50" x2="88" y2="50" stroke="#0f172a" strokeWidth="4.5" />
      <line x1="23" y1="23" x2="77" y2="77" stroke="#0f172a" strokeWidth="4.5" />
      <line x1="77" y1="23" x2="23" y2="77" stroke="#0f172a" strokeWidth="4.5" />

      {/* Center cap */}
      <circle cx="50" cy="50" r="10" fill="#F5C24C" stroke="#0f172a" strokeWidth="3" />
    </svg>
  );
}

// Object: Coding Scroll
export function CodingScroll({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rolled paper scroll style */}
      <rect x="25" y="15" width="50" height="70" fill="#FDFBF3" rx="4" stroke="#0f172a" strokeWidth="4" />
      
      {/* Top and Bottom wooden roller ends */}
      <rect x="18" y="10" width="64" height="8" fill="#b45309" rx="2" stroke="#0f172a" strokeWidth="3" />
      <rect x="18" y="82" width="64" height="8" fill="#b45309" rx="2" stroke="#0f172a" strokeWidth="3" />
      
      {/* Scroll text markings */}
      <path d="M35 30 L65 30" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 44 L55 44" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 58 L60 58" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 70 L48 70" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

      {/* Decorative Gold code tags */}
      <text x="50" y="55" fill="#2E4EDB" fontSize="18" fontWeight="900" textAnchor="middle" fontFamily="monospace">&lt;/&gt;</text>
    </svg>
  );
}

// Object: Magic Portal
export function MagicPortal({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <svg className={`${className} animate-pulse`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="portalGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#a855f7" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
      </defs>
      {/* Outer portal ring */}
      <ellipse cx="50" cy="50" rx="45" ry="45" fill="url(#portalGrad)" stroke="#8A5FD6" strokeWidth="4" className="animate-spin" style={{ animationDuration: '4s' }} />
      <ellipse cx="50" cy="50" rx="32" ry="32" fill="#0f172a" opacity="0.8" />
      {/* Floating sparkles */}
      <circle cx="30" cy="30" r="2" fill="#ffffff" />
      <circle cx="70" cy="70" r="3" fill="#ffffff" />
      <circle cx="70" cy="25" r="2" fill="#ffffff" />
    </svg>
  );
}

// BitBuds Official Logo Component (incorporating waving mascot Bit & Wordmark + tagline exactly from the uploaded reference image)
export function BitBudsLogo({ className = "h-12" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Handcrafted Mascot "Bit" matching reference image */}
      <svg className="h-full aspect-square" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Gradients matching mascot in reference image */}
          <linearGradient id="logoBitBody" x1="20" y1="20" x2="100" y2="100">
            <stop offset="0%" stopColor="#2563EB" /> {/* Bright Royal Blue */}
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="logoBitBelly" x1="45" y1="65" x2="75" y2="95">
            <stop offset="0%" stopColor="#F97316" /> {/* Vibrant Orange */}
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="logoBitFace" x1="35" y1="35" x2="85" y2="70">
            <stop offset="0%" stopColor="#1E3A8A" /> {/* Deep Dark Blue Screen */}
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <filter id="glowEyes">
            <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Ambient binary watermark decorations behind mascot */}
        <text x="10" y="32" fill="#3B82F6" fontSize="8" fontWeight="bold" opacity="0.15" fontFamily="monospace">011</text>
        <text x="5" y="44" fill="#3B82F6" fontSize="8" fontWeight="bold" opacity="0.15" fontFamily="monospace">11</text>
        <text x="12" y="98" fill="#3B82F6" fontSize="8" fontWeight="bold" opacity="0.15" fontFamily="monospace">010</text>
        <text x="102" y="70" fill="#3B82F6" fontSize="8" fontWeight="bold" opacity="0.15" fontFamily="monospace">110</text>
        <text x="104" y="80" fill="#3B82F6" fontSize="8" fontWeight="bold" opacity="0.15" fontFamily="monospace">01</text>

        {/* Shimmering stars behind mascot */}
        <path d="M102 42 L104 45 L107 45 L105 47 L106 50 L102 48 L98 50 L99 47 L97 45 L100 45 Z" fill="#93C5FD" opacity="0.6" />
        <path d="M14 48 L15 50 L17 50 L15 51 L16 53 L14 52 L12 53 L13 51 L11 50 L13 50 Z" fill="#93C5FD" opacity="0.6" />

        {/* Antennae on Head with Orange glowing tips */}
        <g stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
          {/* Left Antenna */}
          <line x1="42" y1="32" x2="35" y2="20" />
          {/* Right Antenna */}
          <line x1="78" y1="32" x2="85" y2="20" />
        </g>
        {/* Antenna orange knobs */}
        <circle cx="35" cy="20" r="5" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" />
        <circle cx="85" cy="20" r="5" fill="#F97316" stroke="#0F172A" strokeWidth="2.5" />

        {/* Left Arm (Resting) */}
        <path d="M22 65 C12 65 14 85 24 82 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />

        {/* Right Arm waving upward (exactly like the reference image!) */}
        <path d="M96 64 C104 54 115 62 108 72 Z" fill="#2563EB" stroke="#0F172A" strokeWidth="3" strokeLinejoin="round" />

        {/* Two cute rounded Blue Feet */}
        <rect x="42" y="94" width="12" height="12" rx="6" fill="#1D4ED8" stroke="#0F172A" strokeWidth="3" />
        <rect x="66" y="94" width="12" height="12" rx="6" fill="#1D4ED8" stroke="#0F172A" strokeWidth="3" />

        {/* Main Body (Royal Blue Capsule shape) */}
        <rect x="25" y="30" width="70" height="68" rx="34" fill="url(#logoBitBody)" stroke="#0F172A" strokeWidth="3.5" />

        {/* Sky-Blue / Dark Blue Face Screen */}
        <rect x="34" y="38" width="52" height="34" rx="17" fill="url(#logoBitFace)" stroke="#0F172A" strokeWidth="3" />

        {/* Big cute glowing sky-blue oval eyes */}
        <ellipse cx="48" cy="52" rx="4.5" ry="6" fill="#93C5FD" filter="url(#glowEyes)" />
        <ellipse cx="72" cy="52" rx="4.5" ry="6" fill="#93C5FD" filter="url(#glowEyes)" />

        {/* Cute happy curved smile */}
        <path d="M55 58 Q60 63 65 58" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Bright orange tummy plate with code symbol </ > */}
        <rect x="40" y="74" width="40" height="20" rx="6" fill="url(#logoBitBelly)" stroke="#0F172A" strokeWidth="2.5" />
        <text x="60" y="88" fill="#FFFFFF" fontSize="13" fontWeight="900" textAnchor="middle" fontFamily="monospace">&lt;/&gt;</text>
      </svg>

      {/* Typographic brand wordmark matching the reference font style */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center text-3xl font-black tracking-tight leading-none">
          <span className="text-[#F97316]">Bit</span>
          <span className="text-[#2563EB]">Buds</span>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-[#2563EB]/90 uppercase tracking-wide mt-0.5 whitespace-nowrap">
          Gamified Coding for Kids
        </span>
      </div>
    </div>
  );
}
