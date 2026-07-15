import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { playSound } from '../utils/audio';
import { MoboRobot } from './GameAssets';
import { UserProgress } from '../types';
import { ApiError, apiUserToProgress, useAuth } from '../types';

interface LoginPageProps {
  onLoginSuccess: (username: string, progress: UserProgress) => void;
  onNavigateToSignup: () => void;
  onNavigateHome: () => void;
  soundEnabled: boolean;
}

interface SavedAccount {
  username: string;
  passcode: string;
  progress: UserProgress;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateToSignup,
  onNavigateHome,
  soundEnabled
}: LoginPageProps) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Please fill in both your Email ID and Password!');
      triggerShake();
      if (soundEnabled) playSound('fail');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    void (async () => {
      try {
        const user = await auth.login({
          email: trimmedEmail,
          password: password,
        });

        if (soundEnabled) playSound('success');
        onLoginSuccess(user.fullName || user.firstName, apiUserToProgress(user, { username: user.fullName || user.firstName }));
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Something went wrong loading your account. Please try again!';
        setError(message);
        triggerShake();
        if (soundEnabled) playSound('fail');
      } finally {
        setIsSubmitting(false);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      
      {/* Decorative ambient stars */}
      <div className="absolute top-12 left-12 h-2 w-2 bg-yellow-400 rounded-full animate-pulse"></div>
      <div className="absolute top-24 right-24 h-3 w-3 bg-cyan-400 rounded-full animate-ping"></div>
      <div className="absolute bottom-24 left-1/4 h-1.5 w-1.5 bg-pink-400 rounded-full animate-pulse"></div>
      <div className="absolute bottom-16 right-12 h-2 w-2 bg-amber-400 rounded-full animate-bounce"></div>

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
        <div className="md:col-span-5 flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Mascot "Bit" animated */}
            <div className="animate-bounce" style={{ animationDuration: '4s' }}>
              <MoboRobot expression="happy" className="h-44 w-44 filter drop-shadow-[0_10px_20px_rgba(59,130,246,0.4)]" />
            </div>
            
            {/* Speech bubble */}
            <div className="absolute -top-12 -right-8 bg-cyan-400 text-slate-950 font-black text-xs px-3 py-2 rounded-2xl border-2 border-slate-950 shadow-[3px_3px_0_0_rgba(15,23,42,1)] max-w-37.5 transform rotate-3">
              Welcome back, coder! Let's load your quest! 🚀
            </div>
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white mt-4">
            BitBuds Quest Portal
          </h2>
          <p className="text-xs text-indigo-200 leading-relaxed max-w-70">
            Log in to retrieve your collected stars, custom avatar, and code kingdoms progress.
          </p>
        </div>

        {/* Right Side: Interactive Login Form Panel */}
        <div className="md:col-span-7">
          <div 
            className={`rounded-4xl border-4 border-slate-900 bg-slate-950 p-8 shadow-[8px_8px_0_0_rgba(15,23,42,1)] relative overflow-hidden transition-transform duration-300 ${
              shake ? 'animate-shake' : ''
            }`}
          >
            {/* Sparkles Corner decoration */}
            <div className="absolute top-4 right-4 text-amber-400">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>

            <div className="mb-6">
              <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full border-2 border-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] inline-block mb-2">
                RE-ENTER CHRONICLES
              </span>
              <h1 className="text-3xl font-black text-white">Log In</h1>
              <p className="text-xs text-slate-400 mt-1">
                Enter your Email ID and password to load your game.
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

              {/* Email Input */}
              <div className="space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5 text-blue-400" />
                    Email ID:
                  </span>
                </div>
                <input
                  type="email"
                  placeholder="e.g. user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-4 border-slate-900 bg-slate-900 px-4 py-3.5 rounded-2xl font-black text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="text-xs font-black uppercase tracking-wider text-slate-300">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3.5 w-3.5 text-blue-400" />
                    Password:
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-4 border-slate-900 bg-slate-900 px-4 py-3.5 rounded-2xl font-black text-white placeholder:text-slate-500 text-base focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                  required
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-amber-400 px-6 py-4 font-black text-slate-950 shadow-[4px_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[2px_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none text-sm uppercase disabled:opacity-50"
                >
                  {isSubmitting ? (
                    'Loading Chronology...'
                  ) : (
                    <>
                      Enter the Game
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Link to Sign up */}
            <div className="mt-6 border-t border-slate-800 pt-4 text-center">
              <p className="text-xs text-slate-400">
                Don't have a hero account yet?{' '}
                <button
                  onClick={() => {
                    if (soundEnabled) playSound('click');
                    onNavigateToSignup();
                  }}
                  className="font-black text-amber-400 hover:underline hover:text-amber-300"
                >
                  Create a Hero Profile
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
