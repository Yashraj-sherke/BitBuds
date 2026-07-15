import React from 'react';
import { Star, Lock, Play, ArrowLeft, Trophy, MapPin, Award, CheckCircle2 } from 'lucide-react';
import { Task, UserProgress } from '../types';
import { playSound } from '../utils/audio';
import { BridgeLandmark, VolcanoLandmark, RocketLandmark, VectorCloud, PineTree } from './GameAssets';

interface AdventureMapProps {
  progress: UserProgress;
  tasks: Task[];
  onSelectTask: (taskId: number) => void;
  onGoBack: () => void;
  soundEnabled: boolean;
}

// Decorative landmarks corresponding to level positions with custom SVG render functions
const LANDMARKS: Record<number, { title: string; render: () => React.JSX.Element; offset: string }> = {
  3: { title: 'Loop Lagoon Bridge', render: () => <BridgeLandmark className="h-8 w-8" />, offset: 'left-4 sm:left-12' },
  6: { title: 'Variable Volcano', render: () => <VolcanoLandmark className="h-8 w-8" />, offset: 'right-4 sm:right-12' },
  9: { title: 'Rocket Launchpad', render: () => <RocketLandmark className="h-10 w-10" />, offset: 'left-6 sm:left-20' },
};

export default function AdventureMap({
  progress,
  tasks,
  onSelectTask,
  onGoBack,
  soundEnabled
}: AdventureMapProps) {
  const handleNodeClick = (taskId: number, isLocked: boolean) => {
    if (isLocked) {
      if (soundEnabled) playSound('fail');
      return;
    }
    if (soundEnabled) playSound('click');
    onSelectTask(taskId);
  };

  // Helper to calculate zigzag indentation of nodes for Candy Crush feel
  const getNodeOffsetClass = (index: number) => {
    const pattern = [
      'col-start-3', // center
      'col-start-4', // right-ish
      'col-start-5', // far right
      'col-start-4', // right-ish
      'col-start-3', // center
      'col-start-2', // left-ish
      'col-start-1', // far left
      'col-start-2', // left-ish
      'col-start-3', // center
      'col-start-3', // center
    ];
    return pattern[index % pattern.length];
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-400 via-indigo-400 to-indigo-600 pb-20 pt-8 px-4" id="adventure-map-page">
      {/* Cartoon Background Elements with elite vector rendering */}
      <div className="absolute top-10 left-6 pointer-events-none">
        <VectorCloud className="h-16 w-32" />
      </div>
      <div className="absolute top-1/3 right-10 pointer-events-none">
        <VectorCloud className="h-20 w-40" />
      </div>
      <div className="absolute bottom-1/3 left-6 pointer-events-none opacity-40">
        <PineTree className="h-24 w-20" />
      </div>
      <div className="absolute bottom-12 right-6 pointer-events-none opacity-40">
        <PineTree className="h-28 w-24" />
      </div>

      <div className="mx-auto max-w-xl">
        {/* Header Block */}
        <div className="mb-10 text-center space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (soundEnabled) playSound('click');
                onGoBack();
              }}
              className="group flex items-center gap-1.5 rounded-xl border-2 border-slate-900 bg-white px-3.5 py-2 text-xs font-black text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)] hover:translate-y-0.5 active:translate-y-1"
              id="map-back-btn"
            >
              <ArrowLeft className="h-4 w-4" /> Kingdom List
            </button>
            <div className="rounded-xl border-2 border-slate-900 bg-yellow-300 px-3 py-1 text-xs font-black text-slate-900 shadow-[3px_3px_0_0_rgba(15,23,42,1)]">
              👑 {progress.selectedDifficulty.toUpperCase()} QUEST
            </div>
          </div>

          <div className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_0_rgba(15,23,42,1)]">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase">
              🗺️ Level Road Map
            </h2>
            <p className="text-xs sm:text-sm font-bold text-slate-500 mt-1">
              Complete each star-node to repair Bit's circuit core and advance down the path!
            </p>
            <div className="mt-3 flex items-center justify-center gap-4 text-xs font-black uppercase text-slate-600 bg-slate-100 py-2 rounded-xl border-2 border-slate-900">
              <span>Unlocked: <b className="text-indigo-600 text-sm">{progress.unlockedLevel}/10</b></span>
              <span className="text-slate-300">|</span>
              <span>XP: <b className="text-emerald-500 text-sm">{progress.points}</b></span>
            </div>
          </div>
        </div>

        {/* Winding Board / Roadmap Path */}
        <div className="relative flex flex-col items-center py-6">
          
          {/* Vertical Winding Connector Line */}
          <div className="absolute top-12 bottom-12 w-3.5 bg-yellow-300 border-x-4 border-slate-900 rounded-full shadow-[inset_0_4px_0_0_rgba(0,0,0,0.1)]"></div>

          {/* Map Node List */}
          <div className="w-full space-y-12 relative">
            {tasks.map((task, index) => {
              const isCompleted = progress.unlockedLevel > task.id;
              const isActive = progress.currentLevel === task.id;
              const isLocked = task.id > progress.unlockedLevel;

              // Alternating layout horizontal indentations for winding path (S-curve)
              // We'll calculate a style offset based on index
              const getWindingOffset = (idx: number) => {
                const step = idx % 4;
                if (step === 0) return 'translate-x-0';
                if (step === 1) return 'translate-x-12 sm:translate-x-20';
                if (step === 2) return 'translate-x-0';
                return '-translate-x-12 sm:-translate-x-20';
              };

              return (
                <div
                  key={task.id}
                  className={`flex flex-col items-center transition-all ${getWindingOffset(index)}`}
                  id={`map-node-row-${task.id}`}
                >
                  
                  {/* Decorative Landmark attached to specific levels */}
                  {LANDMARKS[task.id] && (
                    <div className={`absolute -top-12 ${LANDMARKS[task.id].offset} bg-white/95 border-2 border-slate-900 rounded-xl px-2.5 py-1.5 flex items-center gap-2 shadow-[3px_3px_0_0_rgba(15,23,42,1)] z-10 animate-pulse`}>
                      {LANDMARKS[task.id].render()}
                      <span className="text-[10px] font-black text-slate-800 uppercase tracking-wide">
                        {LANDMARKS[task.id].title}
                      </span>
                    </div>
                  )}

                  {/* Level Path Node Card Button */}
                  <div className="relative group">
                    {/* Glowing active node aura */}
                    {isActive && (
                      <span className="absolute -inset-4 rounded-full bg-yellow-400 opacity-50 blur-md animate-ping"></span>
                    )}

                    <button
                      onClick={() => handleNodeClick(task.id, isLocked)}
                      className={`relative flex h-18 w-18 sm:h-20 sm:w-20 items-center justify-center rounded-full border-4 border-slate-900 font-black text-xl shadow-[0_6px_0_0_rgba(15,23,42,1)] transition-all ${
                        isLocked
                          ? 'bg-slate-400 text-slate-600 shadow-[0_4px_0_0_rgba(15,23,42,1)] opacity-95 cursor-not-allowed'
                          : isCompleted
                          ? 'bg-emerald-400 text-slate-900 hover:bg-emerald-300 hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1.5 active:shadow-none'
                          : isActive
                          ? 'bg-orange-400 text-slate-900 scale-110 hover:bg-orange-300 hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1.5 active:shadow-none animate-pulse'
                          : 'bg-amber-400 text-slate-900 hover:bg-amber-300 hover:translate-y-0.5 hover:shadow-[0_4px_0_0_rgba(15,23,42,1)] active:translate-y-1.5 active:shadow-none'
                      }`}
                      id={`btn-node-${task.id}`}
                    >
                      {isLocked ? (
                        <Lock className="h-6 w-6 text-slate-700" />
                      ) : isCompleted ? (
                        <CheckCircle2 className="h-8 w-8 text-slate-900 animate-pulse" />
                      ) : (
                        <span className="text-2xl font-black">{task.id}</span>
                      )}

                      {/* Completed Star Badge */}
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 border-2 border-slate-900 rounded-full p-0.5 shadow-[1px_1px_0_0_rgba(15,23,42,1)]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        </div>
                      )}
                    </button>

                    {/* Level Title Tag Tooltip */}
                    <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] sm:text-xs font-black tracking-wide uppercase px-3 py-1 rounded-lg border-2 border-slate-900 whitespace-nowrap shadow-[2px_2px_0_0_rgba(15,23,42,1)] group-hover:scale-105 transition-transform pointer-events-none">
                      {isLocked ? 'Locked Zone' : task.title}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
}
