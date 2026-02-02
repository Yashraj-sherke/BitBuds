import React, { useState } from 'react';
import { Target, Lock, Clock, Award, Star, ChevronRight } from 'lucide-react';

const Missions: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const missions = [
    {
      id: 1,
      title: 'Code Your First Robot',
      description: 'Learn the basics of coding by controlling a friendly robot!',
      difficulty: 'Beginner',
      duration: '15 min',
      xpReward: 100,
      isLocked: false,
      isCompleted: true,
      progress: 100,
      category: 'basics',
      topics: ['Variables', 'Commands']
    },
    {
      id: 2,
      title: 'Loop Adventure',
      description: 'Master loops by helping characters repeat actions efficiently.',
      difficulty: 'Beginner',
      duration: '20 min',
      xpReward: 150,
      isLocked: false,
      isCompleted: false,
      progress: 75,
      category: 'loops',
      topics: ['For Loops', 'While Loops']
    },
    {
      id: 3,
      title: 'Conditional Castle',
      description: 'Use if-else statements to navigate through a magical castle.',
      difficulty: 'Intermediate',
      duration: '25 min',
      xpReward: 200,
      isLocked: false,
      isCompleted: false,
      progress: 30,
      category: 'conditionals',
      topics: ['If Statements', 'Boolean Logic']
    },
    {
      id: 4,
      title: 'Function Forest',
      description: 'Create reusable code blocks to solve forest puzzles.',
      difficulty: 'Intermediate',
      duration: '30 min',
      xpReward: 250,
      isLocked: false,
      isCompleted: false,
      progress: 0,
      category: 'functions',
      topics: ['Function Creation', 'Parameters']
    },
    {
      id: 5,
      title: 'Array Arena',
      description: 'Battle with lists and arrays in this exciting challenge!',
      difficulty: 'Advanced',
      duration: '35 min',
      xpReward: 300,
      isLocked: true,
      isCompleted: false,
      progress: 0,
      category: 'arrays',
      topics: ['Array Methods', 'Data Structures']
    },
    {
      id: 6,
      title: 'Object Odyssey',
      description: 'Explore the world of objects and their properties.',
      difficulty: 'Advanced',
      duration: '40 min',
      xpReward: 350,
      isLocked: true,
      isCompleted: false,
      progress: 0,
      category: 'objects',
      topics: ['Object Properties', 'Methods']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Missions', count: missions.length },
    { id: 'basics', label: 'Basics', count: missions.filter(m => m.category === 'basics').length },
    { id: 'loops', label: 'Loops', count: missions.filter(m => m.category === 'loops').length },
    { id: 'conditionals', label: 'Conditionals', count: missions.filter(m => m.category === 'conditionals').length },
    { id: 'functions', label: 'Functions', count: missions.filter(m => m.category === 'functions').length },
    { id: 'arrays', label: 'Arrays', count: missions.filter(m => m.category === 'arrays').length },
    { id: 'objects', label: 'Objects', count: missions.filter(m => m.category === 'objects').length }
  ];

  const filteredMissions = selectedCategory === 'all' 
    ? missions 
    : missions.filter(mission => mission.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'from-gray-300 to-gray-400';
    if (progress < 50) return 'from-red-400 to-red-500';
    if (progress < 100) return 'from-yellow-400 to-yellow-500';
    return 'from-green-400 to-green-500';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Coding Missions</h1>
        <p className="text-gray-600">
          Choose your adventure and start coding! Each mission teaches you new skills while having fun.
        </p>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMissions.map((mission) => (
          <div
            key={mission.id}
            className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
              mission.isLocked ? 'opacity-60' : ''
            }`}
          >
            {/* Mission Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  mission.isLocked 
                    ? 'bg-gray-200' 
                    : mission.isCompleted 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                      : 'bg-gradient-to-br from-purple-500 to-blue-500'
                }`}>
                  {mission.isLocked ? (
                    <Lock className="w-6 h-6 text-gray-500" />
                  ) : mission.isCompleted ? (
                    <Star className="w-6 h-6 text-white" />
                  ) : (
                    <Target className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{mission.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mission.difficulty)}`}>
                    {mission.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Mission Description */}
            <p className="text-gray-600 mb-4">{mission.description}</p>

            {/* Mission Info */}
            <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{mission.duration}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Award className="w-4 h-4" />
                <span>+{mission.xpReward} XP</span>
              </div>
            </div>

            {/* Progress Bar */}
            {!mission.isLocked && (
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{mission.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full bg-gradient-to-r ${getProgressColor(mission.progress)} transition-all duration-300`}
                    style={{ width: `${mission.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Topics */}
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {mission.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <button
              disabled={mission.isLocked}
              className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                mission.isLocked
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : mission.isCompleted
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600'
                    : mission.progress > 0
                      ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                      : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              <span>
                {mission.isLocked
                  ? 'Locked'
                  : mission.isCompleted
                    ? 'Completed'
                    : mission.progress > 0
                      ? 'Continue'
                      : 'Start Mission'
                }
              </span>
              {!mission.isLocked && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        ))}
      </div>

      {/* Progress Summary */}
      <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {missions.filter(m => m.isCompleted).length}
            </div>
            <div className="text-gray-600">Missions Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {missions.filter(m => m.progress > 0 && !m.isCompleted).length}
            </div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {missions.reduce((sum, m) => sum + m.xpReward * (m.isCompleted ? 1 : 0), 0)}
            </div>
            <div className="text-gray-600">XP Earned</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Missions;