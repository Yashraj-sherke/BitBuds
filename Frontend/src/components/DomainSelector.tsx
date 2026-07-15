import React, { useState } from 'react';
import { Bot, Sparkles, Compass, Trophy, ArrowRight, Star, Lock, UserCheck } from 'lucide-react';
import { DOMAINS, TASKS_BY_DOMAIN } from '../data';
import { Domain, Difficulty, UserProgress } from '../types';
import { playSound } from '../utils/audio';

interface DomainSelectorProps {
  progress: UserProgress;
  onSelectDomainAndDifficulty: (domainId: string, difficulty: Difficulty) => void;
  soundEnabled: boolean;
}

export default function DomainSelector({
  progress,
  onSelectDomainAndDifficulty,
  soundEnabled
}: DomainSelectorProps) {
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  const handleDomainClick = (domainId: string) => {
    if (soundEnabled) playSound('click');
    if (activeDomain === domainId) {
      setActiveDomain(null);
    } else {
      setActiveDomain(domainId);
    }
  };

  const handleDifficultyClick = (domainId: string, difficulty: Difficulty) => {
    if (soundEnabled) playSound('success');
    onSelectDomainAndDifficulty(domainId, difficulty);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Bot':
        return <Bot className="h-10 w-10 text-slate-900" />;
      case 'Sparkles':
        return <Sparkles className="h-10 w-10 text-slate-900" />;
      case 'Compass':
        return <Compass className="h-10 w-10 text-slate-900" />;
      default:
        return <Bot className="h-10 w-10 text-slate-900" />;
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 bg-amber-50/50" id="domains-section">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Heading */}
        <div className="text-center space-y-3 mb-12">
          <p className="text-xs sm:text-sm font-black uppercase tracking-widest text-orange-500">
            Choose Your Quest
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 uppercase">
            🚀 Pick a Coding Kingdom
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-600 max-w-xl mx-auto">
            Each kingdom holds unique stories and puzzles. Click one to choose your difficulty and begin your level path!
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {DOMAINS.map((domain) => {
            const isSelected = activeDomain === domain.id;
            const isCurrentlyCompleted = progress.selectedDomain === domain.id;

            return (
              <div
                key={domain.id}
                className={`relative flex flex-col justify-between rounded-3xl border-4 border-slate-900 bg-white p-6 shadow-[8px_8px_0_0_rgba(15,23,42,1)] transition-all duration-200 ${
                  isSelected 
                    ? 'ring-4 ring-orange-400 scale-102 -translate-y-1' 
                    : 'hover:-translate-y-1 hover:shadow-[10px_10px_0_0_rgba(15,23,42,1)]'
                }`}
                id={`domain-card-${domain.id}`}
              >
                {/* Active Indicator Shield */}
                {isCurrentlyCompleted && (
                  <div className="absolute -top-3.5 -right-2 bg-emerald-400 text-slate-900 border-2 border-slate-900 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-[2px_2px_0_0_rgba(15,23,42,1)]">
                    <UserCheck className="h-3.5 w-3.5" /> Core Quest
                  </div>
                )}

                {/* Domain Card Header */}
                <div className="space-y-4">
                  <div className={`inline-flex items-center justify-center rounded-2xl border-4 border-slate-900 bg-gradient-to-br ${domain.color} p-4 shadow-[3px_3px_0_0_rgba(15,23,42,1)]`}>
                    {getIconComponent(domain.icon)}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-2xl font-black text-slate-900 uppercase">
                      {domain.name}
                    </h3>
                    <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
                      {domain.id === 'robo-logic' ? '10 Levels Interactive Path' : 'Story Sandbox'}
                    </p>
                  </div>

                  <p className="text-sm font-bold text-slate-600 leading-relaxed">
                    {domain.description}
                  </p>
                </div>

                {/* Bottom Action Trigger */}
                <div className="pt-6">
                  <button
                    onClick={() => handleDomainClick(domain.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-amber-400 py-3 font-black text-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                    id={`btn-explore-${domain.id}`}
                  >
                    {isSelected ? 'Close Options' : 'Enter Kingdom'}
                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? 'rotate-90' : 'group-hover:translate-x-1'}`} />
                  </button>
                </div>

                {/* Dropdown Difficulty Selection Sheet */}
                {isSelected && (
                  <div className="mt-5 rounded-2xl border-4 border-slate-900 bg-slate-100 p-4 space-y-3 animate-fadeIn">
                    <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest text-center">
                      Choose Your Training Level
                    </p>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {/* Beginner Card */}
                      <button
                        onClick={() => handleDifficultyClick(domain.id, 'beginner')}
                        className="flex items-center justify-between rounded-xl border-2 border-slate-900 bg-emerald-100 p-2.5 font-bold text-slate-900 hover:bg-emerald-200 active:scale-98 transition-all"
                        id={`btn-diff-beginner-${domain.id}`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-xl">🟢</span>
                          <div>
                            <p className="text-xs font-black">Beginner</p>
                            <p className="text-[9px] text-emerald-800">First time coding</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold bg-emerald-200 border-2 border-slate-900 px-2 py-0.5 rounded-full">
                          100 XP
                        </span>
                      </button>

                      {/* Intermediate Card */}
                      <button
                        onClick={() => handleDifficultyClick(domain.id, 'intermediate')}
                        className={`flex items-center justify-between rounded-xl border-2 border-slate-900 p-2.5 font-bold transition-all ${
                          domain.id === 'robo-logic'
                            ? 'bg-orange-100 text-slate-900 hover:bg-orange-200 active:scale-98'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                        }`}
                        disabled={domain.id !== 'robo-logic'}
                        id={`btn-diff-intermediate-${domain.id}`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-xl">🟠</span>
                          <div>
                            <p className="text-xs font-black">Intermediate</p>
                            <p className="text-[9px] text-orange-800">I know loops!</p>
                          </div>
                        </div>
                        {domain.id === 'robo-logic' ? (
                          <span className="text-xs font-extrabold bg-orange-200 border-2 border-slate-900 px-2 py-0.5 rounded-full text-orange-900">
                            150 XP
                          </span>
                        ) : (
                          <Lock className="h-4 w-4 text-slate-400" />
                        )}
                      </button>

                      {/* Advanced Card */}
                      <button
                        onClick={() => handleDifficultyClick(domain.id, 'advanced')}
                        className={`flex items-center justify-between rounded-xl border-2 border-slate-900 p-2.5 font-bold transition-all ${
                          domain.id === 'robo-logic'
                            ? 'bg-rose-100 text-slate-900 hover:bg-rose-200 active:scale-98'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-75'
                        }`}
                        disabled={domain.id !== 'robo-logic'}
                        id={`btn-diff-advanced-${domain.id}`}
                      >
                        <div className="flex items-center gap-2 text-left">
                          <span className="text-xl">🔴</span>
                          <div>
                            <p className="text-xs font-black">Advanced</p>
                            <p className="text-[9px] text-rose-800">Grand Master coder</p>
                          </div>
                        </div>
                        {domain.id === 'robo-logic' ? (
                          <span className="text-xs font-extrabold bg-rose-200 border-2 border-slate-900 px-2 py-0.5 rounded-full text-rose-900">
                            200 XP
                          </span>
                        ) : (
                          <Lock className="h-4 w-4 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
