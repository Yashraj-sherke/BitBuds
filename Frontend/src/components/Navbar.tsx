import React from 'react';
import { Trophy, Volume2, VolumeX, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { UserProgress } from '../types';
import { playSound } from '../utils/audio';
import { BitBudsLogo } from './GameAssets';
import { useAuth } from '../types';

interface NavbarProps {
  progress: UserProgress & { username?: string };
  onNavigateHome: () => void;
  onNavigateBack: (() => void) | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onAvatarChange: (avatar: string) => void;
  currentView?: string;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogout?: () => void;
}

const AVATARS = ['🐱', '🤖', '🦖', '🦄', '🦊', '🐸'];

export default function Navbar({
  progress,
  onNavigateHome,
  onNavigateBack,
  soundEnabled,
  onToggleSound,
  onAvatarChange,
  currentView = 'home',
  onLoginClick,
  onSignupClick,
  onLogout
}: NavbarProps) {
  const auth = useAuth();
  const handleNavClick = (callback: () => void) => {
    if (soundEnabled) playSound('click');
    callback();
  };

  const heroName = auth.user?.fullName?.trim() || progress.username || 'Hero';
  const heroAvatar = auth.user?.profilePicture || progress.avatar;

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-slate-900 bg-white px-4 py-3 shadow-[0_4px_0_0_rgba(15,23,42,1)] sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Navigation / Back Button / Logo */}
        <div className="flex items-center gap-3">
          {onNavigateBack ? (
            <button
              onClick={() => handleNavClick(onNavigateBack)}
              className="group flex items-center justify-center rounded-2xl border-4 border-slate-900 bg-amber-400 p-2.5 font-bold text-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
              title="Go back"
              id="nav-back-button"
            >
              <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            </button>
          ) : (
            currentView !== 'home' && (
              <button
                onClick={() => handleNavClick(onNavigateHome)}
                className="flex items-center justify-center rounded-2xl border-4 border-slate-900 bg-amber-400 p-2.5 font-bold text-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                title="Home"
                id="nav-home-button"
              >
                <Home className="h-5 w-5" />
              </button>
            )
          )}

          {/* Official BitBuds Logo with waving mascot Bit and Wordmark */}
          <button
            onClick={() => handleNavClick(onNavigateHome)}
            className="flex items-center text-left active:scale-95 transition-transform"
            id="nav-logo-button"
          >
            <BitBudsLogo className="h-10" />
          </button>
        </div>

        {/* User Status / Sound / Avatars */}
        <div className="flex items-center gap-3 sm:gap-6">
          
          {!progress.username && !auth.user ? (
            <div className="flex items-center gap-2">
              {(currentView === 'home' || currentView === 'signup') && onLoginClick && (
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    onLoginClick();
                  }}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-white px-3.5 py-1.5 text-xs font-black uppercase text-slate-950 shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                >
                  Log In
                </button>
              )}
              {(currentView === 'home' || currentView === 'login') && onSignupClick && (
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    onSignupClick();
                  }}
                  className="inline-flex items-center justify-center rounded-xl border-2 border-slate-900 bg-blue-600 px-3.5 py-1.5 text-xs font-black uppercase text-white shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[1px_1px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                >
                  Sign Up
                </button>
              )}
            </div>
          ) : (
            <>
              {/* Dynamic Welcome Tag for Coder */}
              <div className="hidden md:flex items-center gap-1.5 rounded-2xl border-4 border-slate-900 bg-orange-100 px-3 py-1.5 text-slate-900 font-black text-xs shadow-[0_4px_0_0_rgba(15,23,42,1)]">
                <span>👋</span>
                <span className="uppercase text-[10px] text-orange-800 tracking-wider">Hero:</span>
                <span>{heroName}</span>
              </div>

              {/* Avatar Selector */}
              <div className="flex items-center gap-1.5 rounded-2xl border-4 border-slate-900 bg-slate-100 p-1 shadow-[0_4px_0_0_rgba(15,23,42,1)]">
                <div className="flex gap-1">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        onAvatarChange(av);
                      }}
                      className={`flex h-9 w-9 items-center justify-center rounded-xl text-xl transition-all duration-150 ${
                        heroAvatar === av
                          ? 'border-2 border-slate-900 bg-orange-400 scale-110 shadow-[2px_2px_0_0_rgba(15,23,42,1)]'
                          : 'hover:bg-slate-200 hover:scale-105 active:scale-95'
                      }`}
                      id={`avatar-${av}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Scoreboard Counter with high premium impact */}
              <div className="flex items-center gap-2 rounded-2xl border-4 border-slate-900 bg-emerald-400 px-4 py-2 font-black text-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,1)]">
                <Trophy className="h-5 w-5 animate-bounce text-yellow-100" />
                <div className="flex flex-col leading-none">
                  <span className="text-[10px] uppercase text-emerald-800 tracking-wider">Points</span>
                  <span className="text-lg font-black">{progress.points} XP</span>
                </div>
              </div>

              {/* Log Out Button */}
              {onLogout && (
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    onLogout();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border-4 border-slate-900 bg-rose-500 px-3.5 font-black text-white shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none text-xs uppercase"
                  title="Log Out Hero"
                >
                  Logout
                </button>
              )}
            </>
          )}

          {/* Sound Toggle Button */}
          <button
            onClick={() => {
              const nextVal = !soundEnabled;
              onToggleSound();
              if (nextVal) setTimeout(() => playSound('success'), 50);
            }}
            className={`flex items-center justify-center rounded-2xl border-4 border-slate-900 p-2.5 font-bold shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none ${
              soundEnabled ? 'bg-amber-400 text-slate-900' : 'bg-slate-300 text-slate-600'
            }`}
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
            id="sound-toggle-button"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </header>
  );
}
