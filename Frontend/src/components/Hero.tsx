import React from 'react';
import { ArrowDown, Code2, ShieldAlert, Sparkles, Wand2, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { playSound } from '../utils/audio';
import { MoboRobot, VectorCloud } from './GameAssets';

interface HeroProps {
  onScrollToDomains: () => void;
  soundEnabled: boolean;
  avatar: string;
}

export default function Hero({ onScrollToDomains, soundEnabled, avatar }: HeroProps) {
  const handleClick = () => {
    if (soundEnabled) playSound('click');
    onScrollToDomains();
  };

  return (
    <section className="relative overflow-hidden bg-sky-100 py-12 md:py-20 px-4 sm:px-6 border-b-4 border-slate-900">
      {/* Premium Decorative Clouds */}
      <div className="absolute top-6 left-12">
        <VectorCloud className="h-16 w-32 text-white" />
      </div>
      <div className="absolute top-1/3 right-16">
        <VectorCloud className="h-20 w-40 text-white" />
      </div>
      
      {/* Decorative Floating Sparkles */}
      <div className="absolute top-10 left-10 animate-bounce text-amber-500 text-3xl select-none">✨</div>
      <div className="absolute bottom-10 right-10 animate-pulse text-purple-500 text-4xl select-none">🔮</div>
      <div className="absolute bottom-1/4 left-12 animate-pulse text-pink-400 text-3xl select-none" style={{ animationDelay: '1.5s' }}>⭐</div>

      <div className="mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Hero Description Block */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-amber-400 px-4 py-1.5 text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
              <Sparkles className="h-4 w-4 text-white animate-spin" style={{ animationDuration: '3s' }} />
              Interactive Story Coding Quest!
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 uppercase leading-[1.1] [text-shadow:4px_4px_0_rgba(255,255,255,1)]">
              Where <span className="text-orange-500">Stories</span> Come to Life with <span className="text-blue-500 underline decoration-wavy decoration-orange-400">Code!</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl font-bold text-slate-700 max-w-2xl leading-relaxed">
              Join friendly space robots, mystical wizards, and brave jungle animals on an epic coding journey! Unravel mysteries, solve puzzles, and build powerful programs—all step by step!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleClick}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 rounded-2xl border-4 border-slate-900 bg-orange-400 px-8 py-4.5 text-lg font-black text-slate-900 shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1.5 active:shadow-none"
                id="hero-cta-button"
              >
                Start Your Journey!
                <ArrowDown className="h-5 w-5 animate-bounce group-hover:translate-y-1 transition-transform" />
              </button>

              <div className="flex items-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-5 py-3 shadow-[0_4px_0_0_rgba(15,23,42,1)]">
                <span className="text-2xl animate-spin">{avatar}</span>
                <div className="text-left leading-tight">
                  <p className="text-[10px] font-black uppercase text-slate-400">Current Hero</p>
                  <p className="text-sm font-black text-slate-800">You are Ready!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Playful Character Showcase Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-yellow-400 border-b-4 border-l-4 border-slate-900 rounded-bl-3xl flex items-center justify-center font-black text-2xl">
                🌟
              </div>
              
              {/* Core Mascot Box */}
              <div className="flex flex-col items-center py-6 text-center space-y-4">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl border-4 border-slate-900 bg-amber-100 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                  <MoboRobot expression="happy" className="h-24 w-24" />
                  <div className="absolute -bottom-2 -right-2 rounded-full border-2 border-slate-900 bg-emerald-400 p-1.5 px-3 font-bold text-xs uppercase text-slate-900 shadow-[2px_2px_0_rgba(0,0,0,1)]">
                    ACTIVE
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Meet Bit</h3>
                  <p className="text-xs font-bold uppercase text-blue-600 tracking-widest bg-blue-50 px-3 py-1 rounded-full border-2 border-slate-900 inline-block">
                    Your Code-Bot Guide
                  </p>
                </div>

                <div className="rounded-2xl border-4 border-slate-900 bg-sky-50 p-4 text-xs font-bold text-slate-700 leading-relaxed shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                  "BEEP BOOP! I need a smart commander to code me through the dangerous asteroid mazes. Let's stack code blocks together!"
                </div>

                <div className="flex gap-2 w-full pt-2">
                  <div className="flex-1 rounded-xl border-2 border-slate-900 bg-orange-100 p-2 text-center">
                    <p className="text-[10px] font-black uppercase text-orange-700">Ages</p>
                    <p className="text-sm font-black text-slate-800">5 - 12</p>
                  </div>
                  <div className="flex-1 rounded-xl border-2 border-slate-900 bg-purple-100 p-2 text-center">
                    <p className="text-[10px] font-black uppercase text-purple-700">Style</p>
                    <p className="text-sm font-black text-slate-800">Gamified</p>
                  </div>
                  <div className="flex-1 rounded-xl border-2 border-slate-900 bg-emerald-100 p-2 text-center">
                    <p className="text-[10px] font-black uppercase text-emerald-700">Goal</p>
                    <p className="text-sm font-black text-slate-800">Unlock Map</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
