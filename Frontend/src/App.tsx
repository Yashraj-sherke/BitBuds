/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import AdventureMap from './components/AdventureMap';
import Workspace from './components/Workspace';
import FeedbackModal from './components/FeedbackModal';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { UserProgress, Difficulty, Task } from './types';
import { TASKS_BY_DOMAIN } from './data';
import { playSound } from './utils/audio';
import { useAuth } from './types';
import { request } from './lib/api';
import type { GameProgressSyncPayload, GameProgressSyncRequest } from './types/api';

const LOCAL_STORAGE_KEY = 'kids_coding_quest_progress';

const DEFAULT_PROGRESS: UserProgress = {
  points: 0,
  currentLevel: 1,
  unlockedLevel: 1,
  selectedDomain: 'robo-logic',
  selectedDifficulty: 'beginner',
  avatar: '🦖'
};

export default function App() {
  const auth = useAuth();

  // Navigation / Game state
  const [view, setView] = useState<'home' | 'map' | 'workspace' | 'login' | 'signup'>('home');
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Dialog state
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [recentPoints, setRecentPoints] = useState(0);

  // Load progress from localStorage on startup
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setProgress(JSON.parse(saved));
      }
    } catch (e) {
      console.warn('LocalStorage not accessible', e);
    }
  }, []);

  // Save progress changes
  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProgress));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  };

  const syncProgressToBackend = async (payload: GameProgressSyncRequest) => {
    if (!auth.isAuthenticated) return null;

    const synced = await request<GameProgressSyncPayload>('/stats/progress', {
      method: 'POST',
      body: payload,
    });
    await auth.refreshSession();
    return synced;
  };

  const handleSelectDomainAndDifficulty = (domainId: string, difficulty: Difficulty) => {
    const updatedProgress = {
      ...progress,
      selectedDomain: domainId,
      selectedDifficulty: difficulty,
      // If they changed kingdoms, reset levels to 1, or keep track of unlocked
      currentLevel: 1
    };
    saveProgress(updatedProgress);
    setView('map');
  };

  const handleSelectTask = (taskId: number) => {
    saveProgress({
      ...progress,
      currentLevel: taskId
    });
    setView('workspace');
  };

  const handleSuccess = (pointsEarned: number) => {
    setRecentPoints(pointsEarned);
    setFeedbackOpen(true);
  };

  const handleNextLevel = () => {
    setFeedbackOpen(false);
    const nextLevel = progress.currentLevel + 1;
    const isNextUnlocked = progress.unlockedLevel > nextLevel;
    
    const newUnlocked = isNextUnlocked 
      ? progress.unlockedLevel 
      : Math.min(10, Math.max(progress.unlockedLevel, nextLevel));

    const updatedProgress = {
      ...progress,
      points: progress.points + recentPoints,
      unlockedLevel: newUnlocked,
      currentLevel: Math.min(10, nextLevel)
    };

    saveProgress(updatedProgress);
    void syncProgressToBackend({
      xpEarned: recentPoints,
      currentLevel: progress.currentLevel,
      unlockedLevel: updatedProgress.unlockedLevel,
      selectedDomain: updatedProgress.selectedDomain,
      selectedDifficulty: updatedProgress.selectedDifficulty,
    }).catch((err) => console.warn('Backend progress sync failed', err));

    // If they cleared level 10, go back to map, else load next workspace task
    if (progress.currentLevel >= 10) {
      setView('map');
    } else {
      // workspace updates automatically via the task dependency inside Workspace component!
    }
  };

  const handleCloseToMap = () => {
    setFeedbackOpen(false);
    const updatedProgress = {
      ...progress,
      points: progress.points + recentPoints,
      unlockedLevel: Math.min(10, Math.max(progress.unlockedLevel, progress.currentLevel + 1))
    };
    saveProgress(updatedProgress);
    void syncProgressToBackend({
      xpEarned: recentPoints,
      currentLevel: progress.currentLevel,
      unlockedLevel: updatedProgress.unlockedLevel,
      selectedDomain: updatedProgress.selectedDomain,
      selectedDifficulty: updatedProgress.selectedDifficulty,
    }).catch((err) => console.warn('Backend progress sync failed', err));
    setView('map');
  };

  const handleAvatarChange = (avatar: string) => {
    saveProgress({
      ...progress,
      avatar
    });
  };

  const handleScrollToDomains = () => {
    const el = document.getElementById('domains-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Get current active level task
  const activeTasks = TASKS_BY_DOMAIN[progress.selectedDomain] || TASKS_BY_DOMAIN['robo-logic'];
  const activeTask = activeTasks.find((t) => t.id === progress.currentLevel) || activeTasks[0];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      
      {/* Playful Top Navbar */}
      <Navbar
        progress={progress}
        onNavigateHome={() => setView('home')}
        onNavigateBack={
          view === 'workspace' 
            ? () => setView('map') 
            : view === 'map' 
            ? () => setView('home') 
            : (view === 'login' || view === 'signup')
            ? () => setView('home')
            : null
        }
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        onAvatarChange={handleAvatarChange}
        currentView={view}
        onLoginClick={() => setView('login')}
        onSignupClick={() => setView('signup')}
        onLogout={() => {
          void auth.logout();
          const resetProgress = { ...DEFAULT_PROGRESS, username: undefined };
          setProgress(resetProgress);
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(resetProgress));
          } catch (e) {
            console.warn('LocalStorage save failed', e);
          }
          setView('home');
        }}
      />

      {/* Main Core Router Panels */}
      <main>
        {view === 'home' && (
          <div className="animate-fadeIn">
            <LandingPage
              onStartAdventure={(domainId) => {
                // If logged in, go to map directly, otherwise prompt to Sign Up first!
                if (progress.username) {
                  handleSelectDomainAndDifficulty(domainId, 'beginner');
                } else {
                  setView('signup');
                }
              }}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled((prev) => !prev)}
            />
          </div>
        )}

        {view === 'login' && (
          <div className="animate-fadeIn">
            <LoginPage
              onLoginSuccess={(_uname, loadedProgress) => {
                setProgress(loadedProgress);
                setView('map');
              }}
              onNavigateToSignup={() => setView('signup')}
              onNavigateHome={() => setView('home')}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {view === 'signup' && (
          <div className="animate-fadeIn">
            <SignupPage
              onSignupSuccess={(_uname, createdProgress) => {
                setProgress(createdProgress);
                setView('map');
              }}
              onNavigateToLogin={() => setView('login')}
              onNavigateHome={() => setView('home')}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {view === 'map' && (
          <div className="animate-fadeIn">
            <AdventureMap
              progress={progress}
              tasks={activeTasks}
              onSelectTask={handleSelectTask}
              onGoBack={() => setView('home')}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {view === 'workspace' && (
          <div className="animate-fadeIn bg-slate-50 min-h-screen">
            <Workspace
              task={activeTask}
              progress={progress}
              onGoBack={() => setView('map')}
              onSuccess={handleSuccess}
              soundEnabled={soundEnabled}
            />
          </div>
        )}
      </main>

      {/* Level Success Celebration Drawer */}
      <FeedbackModal
        isOpen={feedbackOpen}
        pointsEarned={recentPoints}
        levelCompleted={progress.currentLevel}
        onNextLevel={handleNextLevel}
        onCloseToMap={handleCloseToMap}
        soundEnabled={soundEnabled}
      />

      {/* Footer Branding */}
      {view !== 'home' && (
        <footer className="border-t-4 border-slate-900 bg-slate-100 py-6 text-center text-xs font-bold text-slate-500">
          <p>© 2026 BitBuds. Designed for kids with accessible high-contrast UI/UX.</p>
        </footer>
      )}

    </div>
  );
}
