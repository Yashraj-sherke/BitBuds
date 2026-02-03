import React, { useState } from 'react';
import { Award, Lock, Star, Zap, Target, Code, Trophy, Heart, Sparkles, Crown } from 'lucide-react';

const Badges: React.FC = () => {
  const [hoveredBadge, setHoveredBadge] = useState<number | null>(null);

  const badges = [
    {
      id: 1,
      name: 'First Steps',
      description: 'Completed your very first coding mission!',
      icon: Star,
      color: 'from-yellow-400 to-orange-500',
      unlocked: true,
      category: 'Beginner',
      xpRequired: 0
    },
    {
      id: 2,
      name: 'Loop Master',
      description: 'Successfully used loops in 5 different projects.',
      icon: Zap,
      color: 'from-blue-400 to-purple-500',
      unlocked: true,
      category: 'Loops',
      xpRequired: 200
    },
    {
      id: 3,
      name: 'Debug Detective',
      description: 'Found and fixed 10 bugs in your code.',
      icon: Target,
      color: 'from-green-400 to-emerald-500',
      unlocked: true,
      category: 'Problem Solving',
      xpRequired: 400
    },
    {
      id: 4,
      name: 'Code Creator',
      description: 'Built your first complete game from scratch.',
      icon: Code,
      color: 'from-purple-400 to-pink-500',
      unlocked: false,
      category: 'Projects',
      xpRequired: 600
    },
    {
      id: 5,
      name: 'Speed Coder',
      description: 'Completed 3 missions in under 30 minutes.',
      icon: Trophy,
      color: 'from-orange-400 to-red-500',
      unlocked: false,
      category: 'Speed',
      xpRequired: 800
    },
    {
      id: 6,
      name: 'Helper Hero',
      description: 'Helped 5 other kids solve coding problems.',
      icon: Heart,
      color: 'from-pink-400 to-rose-500',
      unlocked: false,
      category: 'Community',
      xpRequired: 1000
    },
    {
      id: 7,
      name: 'Function Wizard',
      description: 'Created and used functions in 10 projects.',
      icon: Sparkles,
      color: 'from-indigo-400 to-blue-500',
      unlocked: false,
      category: 'Functions',
      xpRequired: 1200
    },
    {
      id: 8,
      name: 'Coding Champion',
      description: 'Reached Level 10 and mastered all basics!',
      icon: Crown,
      color: 'from-yellow-400 to-yellow-600',
      unlocked: false,
      category: 'Achievement',
      xpRequired: 1500
    },
    {
      id: 9,
      name: 'Array Explorer',
      description: 'Successfully worked with arrays in 5 missions.',
      icon: Target,
      color: 'from-cyan-400 to-blue-500',
      unlocked: false,
      category: 'Data Structures',
      xpRequired: 1800
    },
    {
      id: 10,
      name: 'Creative Genius',
      description: 'Created 3 unique and original projects.',
      icon: Sparkles,
      color: 'from-purple-400 to-indigo-500',
      unlocked: false,
      category: 'Creativity',
      xpRequired: 2000
    },
    {
      id: 11,
      name: 'Persistence Pro',
      description: 'Never gave up and completed 20 missions!',
      icon: Trophy,
      color: 'from-green-400 to-teal-500',
      unlocked: false,
      category: 'Persistence',
      xpRequired: 2500
    },
    {
      id: 12,
      name: 'Code Master',
      description: 'The ultimate achievement - mastered all coding concepts!',
      icon: Crown,
      color: 'from-gradient-to-r from-purple-500 via-pink-500 to-red-500',
      unlocked: false,
      category: 'Master',
      xpRequired: 3000
    }
  ];

  const currentXP = 1250;
  const nextBadge = badges.find(badge => !badge.unlocked && badge.xpRequired > currentXP);
  const progressToNext = nextBadge ? ((currentXP / nextBadge.xpRequired) * 100) : 100;

  const categories = ['All', 'Beginner', 'Loops', 'Functions', 'Projects', 'Achievement'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredBadges = selectedCategory === 'All' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory);

  const unlockedCount = badges.filter(badge => badge.unlocked).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Badge Collection</h1>
        <p className="text-gray-600">
          Collect badges by completing missions and mastering coding skills! 
          You've earned {unlockedCount} out of {badges.length} badges.
        </p>
      </div>

      {/* XP Progress to Next Badge */}
      {nextBadge && (
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Next Badge</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${nextBadge.color} flex items-center justify-center`}>
                <nextBadge.icon className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">{nextBadge.name}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress to {nextBadge.name}</span>
              <span>{currentXP} / {nextBadge.xpRequired} XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${Math.min(progressToNext, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm">{nextBadge.description}</p>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-purple-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {filteredBadges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`relative bg-white rounded-2xl p-6 shadow-lg transition-all duration-300 cursor-pointer ${
                badge.unlocked 
                  ? 'hover:shadow-xl hover:-translate-y-2 transform' 
                  : 'opacity-60'
              }`}
              onMouseEnter={() => setHoveredBadge(badge.id)}
              onMouseLeave={() => setHoveredBadge(null)}
            >
              {/* Badge Icon */}
              <div className="relative mb-4">
                <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center ${
                  badge.unlocked 
                    ? `bg-gradient-to-br ${badge.color}` 
                    : 'bg-gray-300'
                } transition-all duration-300 ${
                  badge.unlocked && hoveredBadge === badge.id ? 'scale-110' : ''
                }`}>
                  <Icon className={`w-8 h-8 ${badge.unlocked ? 'text-white' : 'text-gray-500'}`} />
                </div>
                
                {/* Lock Overlay for Locked Badges */}
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                
                {/* Sparkle Animation for Unlocked Badges */}
                {badge.unlocked && hoveredBadge === badge.id && (
                  <div className="absolute -top-2 -right-2 text-yellow-400 animate-bounce">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
              </div>

              {/* Badge Info */}
              <div className="text-center">
                <h3 className={`font-bold mb-2 ${
                  badge.unlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {badge.name}
                </h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  badge.unlocked 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {badge.category}
                </span>
              </div>

              {/* Hover Tooltip */}
              {badge.unlocked && hoveredBadge === badge.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10 whitespace-nowrap">
                  {badge.description}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                </div>
              )}

              {/* XP Requirement for Locked Badges */}
              {!badge.unlocked && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
                  {badge.xpRequired} XP
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Achievement Summary */}
      <div className="mt-12 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Achievement Journey</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600 mb-2">{unlockedCount}</div>
              <div className="text-gray-600">Badges Earned</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600 mb-2">{currentXP}</div>
              <div className="text-gray-600">Total XP</div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {Math.round((unlockedCount / badges.length) * 100)}%
              </div>
              <div className="text-gray-600">Collection Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;