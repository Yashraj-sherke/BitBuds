import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, ArrowLeft, HelpCircle, Sparkles, Bot, Trash2, Milestone, Star } from 'lucide-react';
import { Task, UserProgress } from '../types';
import { MASCOTS } from '../data';
import { playSound } from '../utils/audio';
import { MoboRobot, GlimmerWizard, KokoMonkey, GlowingCrystal, StoneObstacle } from './GameAssets';

interface WorkspaceProps {
  task: Task;
  progress: UserProgress;
  onGoBack: () => void;
  onSuccess: (pointsEarned: number) => void;
  soundEnabled: boolean;
}

type Direction = 'up' | 'right' | 'down' | 'left';

export default function Workspace({
  task,
  progress,
  onGoBack,
  onSuccess,
  soundEnabled
}: WorkspaceProps) {
  // Mascot configuration dynamically based on the selected domain
  const mascotInfo =
    progress.selectedDomain === 'frontend-magic'
      ? MASCOTS.wizard
      : progress.selectedDomain === 'python-safari'
      ? MASCOTS.explorer
      : MASCOTS.robo;

  const renderMascot = (expression: 'happy' | 'thinking' | 'sad' | 'victory', className = "h-20 w-20") => {
    if (progress.selectedDomain === 'frontend-magic') {
      return <GlimmerWizard expression={expression} className={className} />;
    }
    if (progress.selectedDomain === 'python-safari') {
      return <KokoMonkey expression={expression} className={className} />;
    }
    return <MoboRobot expression={expression} className={className} />;
  };

  // Code building states
  const [selectedSequence, setSelectedSequence] = useState<string[]>([]);
  
  // Grid execution states
  const [robotPos, setRobotPos] = useState({ x: task.startPos.x, y: task.startPos.y });
  const [robotDir, setRobotDir] = useState<Direction>('right');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execIndex, setExecIndex] = useState(-1);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('BEEP BOOP! Ready to code!');
  const [mascotStatus, setMascotStatus] = useState<'happy' | 'thinking' | 'sad' | 'victory'>('thinking');

  // Sync state with task change
  useEffect(() => {
    resetLevel();
  }, [task]);

  const resetLevel = () => {
    setSelectedSequence([]);
    setRobotPos({ x: task.startPos.x, y: task.startPos.y });
    setRobotDir('right');
    setIsExecuting(false);
    setExecIndex(-1);
    setFeedbackMsg('Codey is waiting for commands!');
    setMascotStatus(task.mascotExpr);
  };

  const handleAddBlock = (block: string) => {
    if (isExecuting) return;
    if (soundEnabled) playSound('laser');
    setSelectedSequence((prev) => [...prev, block]);
  };

  const handleRemoveBlock = (index: number) => {
    if (isExecuting) return;
    if (soundEnabled) playSound('click');
    setSelectedSequence((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (isExecuting) return;
    if (soundEnabled) playSound('click');
    setSelectedSequence([]);
    resetLevel();
  };

  // Run the sequence of commands step by step!
  const handleRunProgram = async () => {
    if (isExecuting) return;
    if (selectedSequence.length === 0) {
      if (soundEnabled) playSound('fail');
      setFeedbackMsg('Add some colorful code blocks first!');
      setMascotStatus('thinking');
      return;
    }

    setIsExecuting(true);
    setFeedbackMsg(`Executing sequence... watch ${mascotInfo.name} go!`);
    setMascotStatus('happy');
    
    // We expand repeat loops if any exist (e.g. "Repeat 4x" followed by "Move Forward" replaces or duplicates)
    // To make this super friendly and simple to analyze, we process the sequence:
    const commands: string[] = [];
    let repeatCount = 1;

    for (let i = 0; i < selectedSequence.length; i++) {
      const cmd = selectedSequence[i];
      if (cmd.startsWith('Repeat')) {
        // Extract count, e.g. "Repeat 4x" -> 4, "Repeat 3x" -> 3
        const match = cmd.match(/\d+/);
        repeatCount = match ? parseInt(match[0], 10) : 2;
        // The loop applies to the next block in sequence!
        const nextCmd = selectedSequence[i + 1];
        if (nextCmd) {
          for (let r = 0; r < repeatCount; r++) {
            commands.push(nextCmd);
          }
          i++; // Skip the next command as we consumed it in the repeat
        }
      } else {
        commands.push(cmd);
      }
    }

    if (commands.length === 0) {
      setIsExecuting(false);
      setFeedbackMsg('Your loop repeat block is empty!');
      setMascotStatus('sad');
      return;
    }

    // Step by step runner
    let step = 0;
    let currentX = task.startPos.x;
    let currentY = task.startPos.y;
    let currentDir: Direction = 'right';

    // Reset position to start before running
    setRobotPos({ x: currentX, y: currentY });
    setRobotDir('right');

    const interval = setInterval(() => {
      if (step >= commands.length) {
        clearInterval(interval);
        evaluateResult(currentX, currentY);
        return;
      }

      setExecIndex(step);
      const cmd = commands[step];

      if (soundEnabled) playSound('move');

      if (cmd === 'Move Forward') {
        if (currentDir === 'right') currentX += 1;
        else if (currentDir === 'left') currentX -= 1;
        else if (currentDir === 'up') currentY -= 1;
        else if (currentDir === 'down') currentY += 1;
      } else if (cmd === 'Turn Right') {
        const dirs: Direction[] = ['up', 'right', 'down', 'left'];
        const nextIdx = (dirs.indexOf(currentDir) + 1) % 4;
        currentDir = dirs[nextIdx];
      } else if (cmd === 'Turn Left') {
        const dirs: Direction[] = ['up', 'right', 'down', 'left'];
        const nextIdx = (dirs.indexOf(currentDir) + 3) % 4;
        currentDir = dirs[nextIdx];
      }

      // Check if robot hit boundaries or obstacles
      const hitWall =
        currentX < 0 ||
        currentX >= task.gridSize.cols ||
        currentY < 0 ||
        currentY >= task.gridSize.rows;

      const hitObstacle = task.obstacles.some((obs) => obs.x === currentX && obs.y === currentY);

      if (hitWall || hitObstacle) {
        clearInterval(interval);
        if (soundEnabled) playSound('fail');
        setRobotPos({ x: currentX, y: currentY });
        setMascotStatus('sad');
        setFeedbackMsg(`Oh no! ${mascotInfo.name} hit an obstacle. Let’s adjust our code blocks and try again! 🌟`);
        setIsExecuting(false);
        setExecIndex(-1);
        return;
      }

      // Update actual rendering position
      setRobotPos({ x: currentX, y: currentY });
      setRobotDir(currentDir);
      step++;
    }, 550);
  };

  const evaluateResult = (finalX: number, finalY: number) => {
    setIsExecuting(false);
    setExecIndex(-1);

    if (finalX === task.targetPos.x && finalY === task.targetPos.y) {
      if (soundEnabled) playSound('success');
      setMascotStatus('victory');
      setFeedbackMsg('SUCCESS! Power crystal collected! Points unlocked!');
      setTimeout(() => {
        onSuccess(task.points);
      }, 1000);
    } else {
      if (soundEnabled) playSound('fail');
      setMascotStatus('sad');
      setFeedbackMsg(`Finished running but ${mascotInfo.name} didn’t reach the target! Use more blocks to go further.`);
    }
  };

  // Helper to get angle based on robot dir
  const getDirAngle = (dir: Direction) => {
    switch (dir) {
      case 'up':
        return '-rotate-90';
      case 'down':
        return 'rotate-90';
      case 'left':
        return 'rotate-180';
      case 'right':
      default:
        return 'rotate-0';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8" id="coding-workspace-panel">
      {/* Level Header Info */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <button
            onClick={() => {
              if (soundEnabled) playSound('click');
              onGoBack();
            }}
            className="group inline-flex items-center gap-1.5 text-xs font-black uppercase text-slate-500 hover:text-slate-900 transition-colors"
            id="workspace-back-btn"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Adventure Map
          </button>
          <div className="flex items-center gap-2">
            <span className="rounded-xl border-2 border-slate-900 bg-amber-400 p-1 px-3 text-xs font-black text-slate-900">
              Level {task.id}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase">
              {task.title}
            </h1>
          </div>
        </div>

        {/* Goal Indicator Capsule */}
        <div className="flex items-center gap-2 rounded-2xl border-4 border-slate-900 bg-white px-4 py-2.5 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
          <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 animate-spin" />
          <div className="text-left leading-tight">
            <span className="text-[10px] uppercase font-black text-slate-400">Reward</span>
            <p className="text-sm font-black text-emerald-600">+{task.points} XP Coins</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left (Story/Mascot) | Middle (Editor) | Right (Grid Board) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Comic-Book Mascot Story Area */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border-4 border-slate-900 bg-white p-5 shadow-[6px_6px_0_0_rgba(15,23,42,1)] overflow-hidden">
            
            {/* Mascot Avatar and Speech Bubble */}
            <div className="flex flex-col items-center text-center space-y-4">
              
              {/* Mascot Bubble */}
              <div className="relative w-full rounded-2xl border-4 border-slate-900 bg-amber-100 p-4 shadow-[4px_4px_0_0_rgba(15,23,42,1)]">
                {/* Wavy pointing tail to represent comic speech */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-t-8 border-t-slate-900 border-x-8 border-x-transparent"></div>
                <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-0 h-0 border-t-6 border-t-amber-100 border-x-6 border-x-transparent z-10"></div>
                
                <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                  "{task.story}"
                </p>
              </div>

              {/* Big Mascot Vector representation */}
              <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-slate-900 bg-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] p-2">
                {renderMascot(mascotStatus, "h-20 w-20")}
                <span className="absolute -bottom-2 rounded-full border-2 border-slate-900 bg-amber-400 px-2 py-0.5 text-[9px] font-black text-slate-900 uppercase">
                  {mascotInfo.name}
                </span>
              </div>
            </div>

            {/* Objective Instructions Card */}
            <div className="mt-6 space-y-2 border-t-4 border-dashed border-slate-200 pt-5">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">
                🎯 Quest Objective
              </h4>
              <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed bg-orange-50/60 rounded-xl border-2 border-orange-200 p-3">
                {task.objective}
              </p>
            </div>
          </div>

          {/* Quick Help Guide */}
          <div className="rounded-3xl border-4 border-slate-900 bg-slate-100 p-5 shadow-[4px_4px_0_0_rgba(15,23,42,1)] flex gap-3">
            <HelpCircle className="h-6 w-6 text-sky-500 shrink-0" />
            <div className="space-y-1">
              <h5 className="text-xs font-black text-slate-900 uppercase">Kid Coder Pro-Tip</h5>
              <p className="text-[11px] font-bold text-slate-600 leading-relaxed">
                Click colorful blocks in the middle palette to add commands. If you want to delete a block, just click it inside your program sequence!
              </p>
            </div>
          </div>
        </div>

        {/* Middle Side: Dynamic Coding Sequence Builder */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border-4 border-slate-900 bg-white shadow-[6px_6px_0_0_rgba(15,23,42,1)] overflow-hidden">
            
            {/* Panel Tab Title */}
            <div className="border-b-4 border-slate-900 bg-orange-400 px-4 py-3 text-slate-900 flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-wider">
                🎒 Magic Block Bag
              </span>
              <span className="rounded-full bg-slate-900 text-amber-300 text-[10px] font-black px-2.5 py-0.5">
                PALETTE
              </span>
            </div>

            {/* Clickable Tool Tokens */}
            <div className="p-5 space-y-3 bg-orange-50/30">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Click a block to insert:
              </p>
              
              <div className="flex flex-wrap gap-2">
                {task.defaultBlocks.map((block) => {
                  let colorClass = 'bg-blue-400 hover:bg-blue-300 text-slate-900';
                  if (block.startsWith('Turn')) {
                    colorClass = 'bg-yellow-400 hover:bg-yellow-300 text-slate-900';
                  } else if (block.startsWith('Repeat')) {
                    colorClass = 'bg-purple-400 hover:bg-purple-300 text-slate-900';
                  }

                  return (
                    <button
                      key={block}
                      onClick={() => handleAddBlock(block)}
                      className={`rounded-xl border-2 border-slate-900 px-3.5 py-2.5 font-black text-xs shadow-[2px_2px_0_0_rgba(15,23,42,1)] transition-transform active:scale-95 flex items-center gap-1.5 ${colorClass}`}
                      id={`block-palette-${block.replace(/\s+/g, '-')}`}
                    >
                      {block.startsWith('Repeat') ? '🔁 ' : '⚙️ '}
                      {block}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visual Assembler Container */}
            <div className="border-t-4 border-slate-900 p-5 min-h-[220px] flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                    📝 My Program Code:
                  </span>
                  {selectedSequence.length > 0 && (
                    <button
                      onClick={handleClear}
                      className="text-xs font-black text-red-500 hover:text-red-700 flex items-center gap-1"
                      id="clear-all-blocks-btn"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Reset
                    </button>
                  )}
                </div>

                {selectedSequence.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 border-4 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400">
                    <span className="text-3xl animate-pulse">📦</span>
                    <p className="text-xs font-bold mt-2">Workspace is empty!</p>
                    <p className="text-[10px] text-slate-400 text-center px-4 mt-1">
                      Choose actions from the bag above to assemble your launch script.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                    {selectedSequence.map((block, index) => {
                      const isActiveStep = execIndex === index;
                      let colorClass = 'bg-blue-400';
                      if (block.startsWith('Turn')) {
                        colorClass = 'bg-yellow-400';
                      } else if (block.startsWith('Repeat')) {
                        colorClass = 'bg-purple-400';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleRemoveBlock(index)}
                          className={`w-full flex items-center justify-between rounded-xl border-2 border-slate-900 p-2.5 font-bold text-xs text-slate-900 shadow-[2px_2px_0_0_rgba(15,23,42,1)] hover:border-red-500 hover:bg-red-50 hover:text-red-900 group transition-all ${
                            isActiveStep ? 'ring-4 ring-orange-500 scale-102 bg-amber-300' : colorClass
                          }`}
                          title="Click to remove from workspace"
                          id={`sequence-block-item-${index}`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900/10 text-[10px] font-black">
                              {index + 1}
                            </span>
                            {block}
                          </span>
                          <span className="text-[9px] font-black opacity-50 group-hover:opacity-100 group-hover:text-red-500">
                            Remove ❌
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sequence Trigger Center */}
              <div className="pt-5 border-t-2 border-slate-100 flex gap-3">
                <button
                  onClick={handleRunProgram}
                  disabled={isExecuting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-4 border-slate-900 bg-emerald-400 py-3.5 font-black text-slate-900 shadow-[0_4px_0_0_rgba(15,23,42,1)] transition-all hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm"
                  id="run-sequence-btn"
                >
                  <Play className="h-4 w-4 fill-slate-900" />
                  Run Code!
                </button>
                
                <button
                  onClick={resetLevel}
                  disabled={isExecuting}
                  className="flex items-center justify-center rounded-2xl border-4 border-slate-900 bg-white p-3 shadow-[0_4px_0_0_rgba(15,23,42,1)] hover:translate-y-0.5 hover:shadow-[0_2px_0_0_rgba(15,23,42,1)] active:translate-y-1 active:shadow-none"
                  title="Reset Robot position"
                  id="reset-robot-btn"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Right Side: The Interactive 2D Grid Game Board */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-3xl border-4 border-slate-900 bg-white shadow-[6px_6px_0_0_rgba(15,23,42,1)] overflow-hidden">
            
            {/* Header board banner */}
            <div className="border-b-4 border-slate-900 bg-indigo-500 px-4 py-3 text-white flex items-center justify-between">
              <span className="text-sm font-black uppercase tracking-wider flex items-center gap-1.5">
                🎮 Circuit Monitor
              </span>
              <span className="rounded-full bg-slate-900 text-indigo-300 text-[10px] font-black px-2.5 py-0.5">
                GRID SCREEN
              </span>
            </div>

            {/* Active Running Status Indicator */}
            <div className="bg-slate-900 text-emerald-400 p-2.5 text-center font-mono text-[10px] tracking-widest border-b-2 border-slate-800 uppercase animate-pulse">
              {feedbackMsg}
            </div>

            {/* Actual Grid Board Canvas rendering */}
            <div className="p-6 bg-slate-50 flex items-center justify-center">
              <div
                className="grid gap-1 border-4 border-slate-900 bg-slate-200 p-2 rounded-2xl shadow-[4px_4px_0_0_rgba(15,23,42,1)]"
                style={{
                  gridTemplateColumns: `repeat(${task.gridSize.cols}, minmax(0, 1fr))`,
                  gridTemplateRows: `repeat(${task.gridSize.rows}, minmax(0, 1fr))`,
                }}
                id="interactive-grid-canvas"
              >
                {Array.from({ length: task.gridSize.rows }).map((_, rIndex) => {
                  return Array.from({ length: task.gridSize.cols }).map((_, cIndex) => {
                    const isRobot = robotPos.x === cIndex && robotPos.y === rIndex;
                    const isTarget = task.targetPos.x === cIndex && task.targetPos.y === rIndex;
                    const isStart = task.startPos.x === cIndex && task.startPos.y === rIndex;
                    const isObstacle = task.obstacles.some((obs) => obs.x === cIndex && obs.y === rIndex);

                    let cellBgColor = 'bg-white';
                    if (isStart) cellBgColor = 'bg-orange-50';

                    return (
                      <div
                        key={`${rIndex}-${cIndex}`}
                        className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl border-2 border-slate-900 flex items-center justify-center relative select-none shadow-[inset_0_-2px_0_rgba(15,23,42,0.1)] ${cellBgColor}`}
                        id={`grid-cell-${rIndex}-${cIndex}`}
                      >
                        {/* Obstacle Graphics */}
                        {isObstacle && (
                          <div className="animate-pulse">
                            <StoneObstacle className="h-9 w-9" />
                          </div>
                        )}

                        {/* Destination Target Crystal */}
                        {isTarget && (
                          <div className="relative animate-bounce">
                            <GlowingCrystal className="h-8 w-8" />
                            <span className="absolute -inset-1 rounded-full bg-cyan-400 opacity-25 blur-sm"></span>
                          </div>
                        )}

                        {/* Start coordinates dot helper */}
                        {isStart && !isRobot && (
                          <div className="h-3 w-3 rounded-full bg-orange-400/60 border border-orange-500"></div>
                        )}

                        {/* Animated Robot Node */}
                        {isRobot && (
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-lg border-2 border-slate-900 bg-amber-300 transition-transform duration-200 shadow-[1px_1px_0_rgba(0,0,0,0.15)] p-1 ${getDirAngle(
                              robotDir
                            )}`}
                          >
                            {renderMascot(
                              mascotStatus === 'sad' ? 'sad' : mascotStatus === 'victory' ? 'victory' : 'happy',
                              'h-7 w-7'
                            )}
                          </div>
                        )}
                      </div>
                    );
                  });
                })}
              </div>
            </div>

            {/* Grid Legend labels */}
            <div className="px-5 py-3 border-t-2 border-slate-100 bg-slate-50 flex items-center justify-between text-[10px] font-black uppercase text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="inline-block h-4 w-4 rounded-full border-2 border-slate-900 bg-amber-400 flex items-center justify-center overflow-hidden">
                  {renderMascot('happy', 'h-3 w-3')}
                </span> 
                <span>{mascotInfo.name}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <GlowingCrystal className="h-4.5 w-4.5" />
                <span>Crystal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StoneObstacle className="h-4.5 w-4.5" />
                <span>Stone</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
