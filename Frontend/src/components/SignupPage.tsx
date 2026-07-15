import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Lock, User, AlertCircle, ArrowRight, Check } from 'lucide-react';
import { playSound } from '../utils/audio';
import { MoboRobot } from './GameAssets';
import { UserProgress, Difficulty } from '../types';
import { ApiError, apiUserToProgress, useAuth } from '../types';

interface SignupPageProps {
  onSignupSuccess: (username: string, progress: UserProgress) => void;
  onNavigateToLogin: () => void;
  onNavigateHome: () => void;
  soundEnabled: boolean;
}

interface SavedAccount {
  username: string;
  passcode: string;
  progress: UserProgress;
}

const AVATARS = ['🐱', '🤖', '🦖', '🦄', '🦊', '🐸'];

const WORLDS = [
  { id: 'robo-logic', name: 'Space Explorer 🚀', desc: 'Variables & logic puzzles with Bit Bot.' },
  { id: 'frontend-magic', name: 'Magic Kingdom 🏰', desc: 'HTML & CSS with Princess Luna.' },
  { id: 'python-safari', name: 'Pirate Island 🏴‍☠️', desc: 'Loops & Safari loops with Captain Loop.' }
];

export default function SignupPage({
  onSignupSuccess,
  onNavigateToLogin,
  onNavigateHome,
  soundEnabled
}: SignupPageProps) {
  const auth = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦖');
  const [selectedKingdom, setSelectedKingdom] = useState('robo-logic');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (soundEnabled) playSound('click');

    const trimmedUser = name.trim();
    if (!trimmedUser || !email.trim() || !password) {
      setError('Please provide your Name, Email, and Password!');
      triggerShake();
      if (soundEnabled) playSound('fail');
      return;
    }

    if (trimmedUser.length < 3) {
      setError('Name must be at least 3 letters long!');
      triggerShake();
      if (soundEnabled) playSound('fail');
      return;
    }

    if (password.length < 8) {
      setError('Your password should be at least 8 characters long for safety!');
      triggerShake();
      if (soundEnabled) playSound('fail');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    void (async () => {
      try {
        const registeredUser = await auth.register({
          email: email.trim(),
          password: password,
          displayName: trimmedUser,
        });

        const updatedUser = await auth.updateProfile({ profilePicture: selectedAvatar }, registeredUser._id);
        const progress = apiUserToProgress(updatedUser, {
          selectedDomain: selectedKingdom,
          selectedDifficulty: 'beginner',
          avatar: selectedAvatar,
          username: updatedUser.fullName || trimmedUser,
        });

        if (soundEnabled) playSound('success');
        onSignupSuccess(updatedUser.fullName || trimmedUser, progress);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Something went wrong creating your account. Please try again!';
        setError(message);
        triggerShake();
        if (soundEnabled) playSound('fail');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Decorative ambient stars */}
      <div className="absolute top-12 left-12 h-2.5 w-2.5 bg-yellow-400 rounded-full animate-ping"></div>
      <div className="absolute top-24 right-24 h-2 w-2 bg-indigo-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-24 left-1/4 h-2.5 w-2.5 bg-pink-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-12 h-2 w-2 bg-yellow-400 rounded-full animate-bounce"></div>

      {/* Floating back home button */}
      <button
        onClick={() => {
          if (soundEnabled) playSound('click');
          onNavigateHome();
        }}
        className="absolute top-6 left-6 inline-flex items-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-4 py-2.5 font-black text-slate-900 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none text-sm uppercase"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </button>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-8">
        
        {/* Left Side: Mascot Welcomer Panel */}
        <div className="md:col-span-4 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Mascot "Bit" animated */}
            <div className="animate-bounce" style={{ animationDuration: '4.5s' }}>
              <MoboRobot expression="happy" className="h-44 w-44 filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.4)]" />
            </div>
            
            {/* Speech bubble */}
            <div className="absolute -top-12 -right-8 bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-2.5 rounded-2xl border-2 border-slate-950 shadow-[3px_3px_0_0_rgba(15,23,42,1)] max-w-37.5 transform rotate-3">
              Let's create your Hero Identity and start! 🛡️✨
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mt-4">
            Become a Code Hero
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed max-w-70">
            Sign up to track your scores, unlock magical coding kingdoms, and customize your hero buddy!
          </p>
        </div>

        {/* Right Side: Interactive Sign Up Form Panel */}
        <div className="md:col-span-8">
          <div 
            className={`rounded-4xl border-4 border-slate-900 bg-slate-950 p-8 shadow-[8px_8px_0_0_rgba(15,23,42,1)] relative overflow-hidden transition-transform duration-300 ${
              shake ? 'animate-shake' : ''
            }`}
          >
            {/* Sparkles Corner decoration */}
            <div className="absolute top-4 right-4 text-cyan-400">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>

            <div className="mb-6">
              <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] inline-block mb-2">
                CREATE NEW CHRONICLE
              </span>
              <h1 className="text-3xl font-black text-white">Sign Up</h1>
              <p className="text-xs text-slate-400 mt-1">
                Customize your companion avatar, pick a name, and save your progress.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Error message bubble */}
              {error && (
                <div className="flex items-center gap-2.5 bg-rose-500/20 border-2 border-rose-500 text-rose-300 p-3.5 rounded-2xl text-xs font-bold leading-relaxed">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="inline-flex text-xs font-black uppercase tracking-wider text-slate-300 items-center gap-1">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  Full Name:
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-4 border-slate-900 bg-slate-900 px-4 py-3.5 rounded-2xl font-black text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                  required
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="inline-flex text-xs font-black uppercase tracking-wider text-slate-300 items-center gap-1">
                  <User className="h-3.5 w-3.5 text-amber-400" />
                  Email ID:
                </label>
                <input
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-4 border-slate-900 bg-slate-900 px-4 py-3.5 rounded-2xl font-black text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                  required
                />
              </div>

              {/* Companion Avatar Selection Grid */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Select Your Hero Companion:
                </label>
                <div className="grid grid-cols-6 gap-2 bg-slate-900/50 p-2 border-2 border-slate-800 rounded-2xl">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        setSelectedAvatar(av);
                      }}
                      className={`flex h-12 w-full items-center justify-center rounded-xl text-2xl transition-all duration-150 ${
                        selectedAvatar === av
                          ? 'border-2 border-amber-400 bg-amber-400/20 scale-110 shadow-[2px_2px_0_0_rgba(15,23,42,1)]'
                          : 'hover:bg-slate-800 hover:scale-105 active:scale-95'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="inline-flex text-xs font-black uppercase tracking-wider text-slate-300 items-center gap-1">
                  <Lock className="h-3.5 w-3.5 text-amber-400" />
                  Password:
                </label>
                <input
                  type="password"
                  placeholder="Create a password (e.g. 1234abcd)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-4 border-slate-900 bg-slate-900 px-4 py-3.5 rounded-2xl font-black text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                  required
                />
              </div>

              {/* Kingdom / Starting Domain Selection */}
              <div className="space-y-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                  Starting Kingdom:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {WORLDS.map((world) => (
                    <button
                      key={world.id}
                      type="button"
                      onClick={() => {
                        if (soundEnabled) playSound('click');
                        setSelectedKingdom(world.id);
                      }}
                      className={`text-left p-3 rounded-2xl border-2 transition-all flex flex-col justify-between h-full ${
                        selectedKingdom === world.id
                          ? 'border-amber-400 bg-amber-400/10 shadow-[2px_2px_0_0_rgba(15,23,42,1)]'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-black text-xs tracking-tight">{world.name}</span>
                        {selectedKingdom === world.id && (
                          <Check className="h-3.5 w-3.5 text-amber-400" />
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight mt-1">
                        {world.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-amber-400 px-6 py-4 font-black text-slate-950 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none text-sm uppercase disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Launching Account...'
                  ) : (
                    <>
                      Create Profile & Play
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Link to Login */}
            <div className="mt-6 border-t border-slate-800 pt-4 text-center">
              <p className="text-xs text-slate-400">
                Already have a Hero Profile?{' '}
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    onNavigateToLogin();
                  }}
                  className="font-black text-amber-400 hover:underline hover:text-amber-300"
                >
                  Log In Here
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Styled custom shake animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>

    </div>
  );
}
