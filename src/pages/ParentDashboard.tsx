import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  BarChart3, 
  Clock, 
  Target, 
  Award, 
  TrendingUp, 
  Calendar,
  Settings,
  Shield,
  BookOpen,
  Star
} from 'lucide-react';

const ParentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const childrenData = [
    {
      id: 1,
      name: 'Alex',
      age: 8,
      level: 3,
      xp: 1250,
      totalTime: 45, // hours
      weeklyTime: 8, // hours
      missionsCompleted: 12,
      badgesEarned: 5,
      lastActive: '2 hours ago',
      avatar: '🧒'
    }
  ];

  const weeklyProgress = [
    { day: 'Mon', time: 45, missions: 2 },
    { day: 'Tue', time: 60, missions: 1 },
    { day: 'Wed', time: 30, missions: 3 },
    { day: 'Thu', time: 75, missions: 2 },
    { day: 'Fri', time: 40, missions: 1 },
    { day: 'Sat', time: 90, missions: 4 },
    { day: 'Sun', time: 55, missions: 2 }
  ];

  const recentActivities = [
    { id: 1, child: 'Alex', activity: 'Completed "Loop Adventure"', time: '2 hours ago', type: 'mission' },
    { id: 2, child: 'Alex', activity: 'Earned "Debug Detective" badge', time: '1 day ago', type: 'badge' },
    { id: 3, child: 'Alex', activity: 'Created "Dancing Robot" project', time: '2 days ago', type: 'project' },
    { id: 4, child: 'Alex', activity: 'Completed "Variables Quest"', time: '3 days ago', type: 'mission' }
  ];

  const skillsProgress = [
    { skill: 'Loops', progress: 85, color: 'bg-blue-500' },
    { skill: 'Variables', progress: 75, color: 'bg-green-500' },
    { skill: 'Conditionals', progress: 60, color: 'bg-purple-500' },
    { skill: 'Functions', progress: 40, color: 'bg-orange-500' },
    { skill: 'Arrays', progress: 20, color: 'bg-red-500' }
  ];

  const getMaxTime = () => Math.max(...weeklyProgress.map(d => d.time));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
        <p className="text-gray-600">
          Track your child's coding journey and celebrate their achievements.
        </p>
      </div>

      {/* Period Selection */}
      <div className="mb-6">
        <div className="flex space-x-2">
          {['week', 'month', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === period
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              This {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Child Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {childrenData.map((child) => (
          <div key={child.id} className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{child.avatar}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{child.name}</h3>
                  <p className="text-sm text-gray-600">{child.age} years old</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-purple-600">Level {child.level}</div>
                <div className="text-xs text-gray-500">{child.xp} XP</div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{child.weeklyTime}h</div>
                <div className="text-xs text-gray-600">This Week</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{child.missionsCompleted}</div>
                <div className="text-xs text-gray-600">Missions</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-2">Last active: {child.lastActive}</div>
              <div className="flex justify-center space-x-1">
                {[...Array(child.badgesEarned)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Progress Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Progress</h2>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm font-medium text-gray-600">Coding Time (minutes)</div>
                <div className="text-sm font-medium text-gray-600">Missions Completed</div>
              </div>
              
              <div className="space-y-3">
                {weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-700">{day.day}</div>
                    <div className="flex-1">
                      <div className="bg-gray-200 rounded-full h-6 relative">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-blue-500 h-6 rounded-full flex items-center justify-end pr-2"
                          style={{ width: `${(day.time / getMaxTime()) * 100}%` }}
                        >
                          <span className="text-xs text-white font-medium">{day.time}m</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-right">
                      <div className="flex justify-end space-x-1">
                        {[...Array(day.missions)].map((_, i) => (
                          <Target key={i} className="w-4 h-4 text-green-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {weeklyProgress.reduce((sum, day) => sum + day.time, 0)}m
                </div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {weeklyProgress.reduce((sum, day) => sum + day.missions, 0)}
                </div>
                <div className="text-sm text-gray-600">Missions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {Math.round(weeklyProgress.reduce((sum, day) => sum + day.time, 0) / 7)}m
                </div>
                <div className="text-sm text-gray-600">Daily Avg</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'mission' && <Target className="w-4 h-4 text-white" />}
                    {activity.type === 'badge' && <Award className="w-4 h-4 text-white" />}
                    {activity.type === 'project' && <BookOpen className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.activity}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parental Controls */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Parental Controls</h2>
            <div className="space-y-3">
              <button className="w-full bg-purple-100 text-purple-700 py-3 px-4 rounded-lg hover:bg-purple-200 transition-colors text-left flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Screen Time Limits</span>
                </div>
                <span className="text-sm">2h/day</span>
              </button>
              <button className="w-full bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors text-left flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Safety Settings</span>
                </div>
                <span className="text-sm">Active</span>
              </button>
              <button className="w-full bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition-colors text-left flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Content Filters</span>
                </div>
                <span className="text-sm">On</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Progress */}
      <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Skills Development</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {skillsProgress.map((skill, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke={skill.color.replace('bg-', '#')}
                    strokeWidth="2"
                    strokeDasharray={`${skill.progress}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{skill.progress}%</span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900">{skill.skill}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;