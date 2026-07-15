import React from 'react';
import { Star, Award, ChevronRight, Home, Map, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';
import { MoboRobot } from './GameAssets';

interface FeedbackModalProps {
  isOpen: boolean;
  pointsEarned: number;
  levelCompleted: number;
  onNextLevel: () => void;
  onCloseToMap: () => void;
  soundEnabled: boolean;
}

export default function FeedbackModal({
  isOpen,
  pointsEarned,
  levelCompleted,
  onNextLevel,
  onCloseToMap,
  soundEnabled
}: FeedbackModalProps) {
  if (!isOpen) return null;

  const handleAction = (callback: () => void) => {
    if (soundEnabled) playSound('success');
    callback();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn" id="celebration-overlay">
      <div className="relative w-full max-w-md rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[10px_10px_0_0_rgba(15,23,42,1)] overflow-hidden text-center space-y-6">
        
        {/* Colorful confetti decoration */}
        <div className="absolute top-4 left-4 animate-bounce text-3xl select-none">🎉</div>
        <div className="absolute top-6 right-6 animate-pulse text-4xl select-none" style={{ animationDelay: '0.5s' }}>🌟</div>
        <div className="absolute bottom-8 left-6 animate-bounce text-2xl select-none" style={{ animationDelay: '1s' }}>✨</div>
        <div className="absolute bottom-12 right-6 animate-pulse text-3xl select-none" style={{ animationDelay: '1.5s' }}>🔥</div>

        {/* Celebration Title */}
        <div className="space-y-2">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-slate-900 bg-yellow-400 shadow-[3px_3px_0_0_rgba(15,23,42,1)] relative overflow-hidden p-1.5">
            <MoboRobot expression="victory" className="h-16 w-16" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Level {levelCompleted} Cleared!
          </h2>
          <p className="text-xs font-black uppercase tracking-wider text-orange-500 flex items-center justify-center gap-1">
            <Sparkles className="h-4 w-4 text-orange-500 fill-orange-400" />
            Absolutely Spectacular!
            <Sparkles className="h-4 w-4 text-orange-500 fill-orange-400" />
          </p>
        </div>

        {/* Big Score Box */}
        <div className="rounded-2xl border-4 border-slate-900 bg-emerald-50 p-5 space-y-2 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
          <div className="flex justify-center gap-1 text-yellow-400">
            <Star className="h-8 w-8 fill-yellow-400 stroke-slate-900 stroke-2" />
            <Star className="h-8 w-8 fill-yellow-400 stroke-slate-900 stroke-2 scale-115" />
            <Star className="h-8 w-8 fill-yellow-400 stroke-slate-900 stroke-2" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-slate-400">Points Gained</p>
            <p className="text-3xl font-black text-emerald-600">+{pointsEarned} XP</p>
          </div>
        </div>

        {/* Story Progress Summary */}
        <p className="text-sm font-bold text-slate-600 leading-relaxed px-2">
          Bit's electrical engine is glowing bright! Your flawless code sequence successfully guided Bit straight to the primary core battery coordinate. Let's head down the path to unlock the next region!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2.5">
          {levelCompleted < 10 ? (
            <button
              onClick={() => handleAction(onNextLevel)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-amber-400 py-4 font-black text-slate-900 shadow-[0_5px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_3px_0_0_rgba(15,23,42,1)] active:translate-y-1.5 active:shadow-none"
              id="celebrate-next-btn"
            >
              Unlock Next Level
              <ChevronRight className="h-5 w-5 animate-pulse" />
            </button>
          ) : (
            <div className="rounded-2xl border-2 border-slate-900 bg-yellow-100 p-3 text-xs font-black text-yellow-800 uppercase">
              🏆 You completed the entire coding path! Outstanding!
            </div>
          )}

          <button
            onClick={() => handleAction(onCloseToMap)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-white py-3.5 font-black text-slate-700 shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
            id="celebrate-map-btn"
          >
            <Map className="h-4 w-4" /> Keep Exploring Map
          </button>
        </div>

      </div>
    </div>
  );
}
