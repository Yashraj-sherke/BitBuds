import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Code, Award, TrendingUp, Calendar, Clock } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const currentMission = {
    id: 1,
    title: 'Loop Adventure',
    description: 'Learn about loops by helping a robot navigate a maze!',
    progress: 75,
    xpReward: 150,
    difficulty: 'Beginner'
  };

  const recentActivities = [
    { id: 1, type: 'mission', title: 'Completed "Variables Quest"', time: '2 hours ago', xp: 100 },
    { id: 2, type: 'badge', title: 'Earned "Loop Master" badge', time: '1 day ago', xp: 50 },
    { id: 3, type: 'project', title: 'Created "Dancing Robot" animation', time: '2 days ago', xp: 75 }
  ];

  const stats = [
    { label: 'Total XP', value: user?.xp || 0, icon: TrendingUp, color: 'from-purple-500 to-blue-500' },
    { label: 'Missions Completed', value: 12, icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Badges Earned', value: user?.badges.length || 0, icon: Award, color: 'from-green-500 to-emerald-500' },
    { label: 'Coding Streak', value: 7, icon: Calendar, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.name}! 🎉
        </h1>
        <p className="text-gray-600">
          Ready to continue your coding adventure? Let's see what you can build today!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Mission */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Current Mission</h2>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {currentMission.difficulty}
              </span>
            </div>
            
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentMission.title}</h3>
              <p className="text-gray-600 mb-4">{currentMission.description}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>30 min remaining</span>
                </div>
                <div className="flex items-center text-sm text-purple-600">
                  <Award className="w-4 h-4 mr-1" />
                  <span>+{currentMission.xpReward} XP</span>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{currentMission.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${currentMission.progress}%` }}
                  ></div>
                </div>
              </div>
              
              <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold">
                Continue Mission
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'mission' && <Target className="w-4 h-4 text-white" />}
                    {activity.type === 'badge' && <Award className="w-4 h-4 text-white" />}
                    {activity.type === 'project' && <Code className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.time}</p>
                    <p className="text-xs text-purple-600">+{activity.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 py-3 px-4 rounded-xl hover:from-purple-200 hover:to-blue-200 transition-all duration-200 text-left">
                <div className="flex items-center justify-between">
                  <span>Continue Learning</span>
                  <Target className="w-4 h-4" />
                </div>
              </button>
              <button className="w-full bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 py-3 px-4 rounded-xl hover:from-green-200 hover:to-emerald-200 transition-all duration-200 text-left">
                <div className="flex items-center justify-between">
                  <span>Open Code Lab</span>
                  <Code className="w-4 h-4" />
                </div>
              </button>
              <button className="w-full bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 py-3 px-4 rounded-xl hover:from-orange-200 hover:to-red-200 transition-all duration-200 text-left">
                <div className="flex items-center justify-between">
                  <span>View Badges</span>
                  <Award className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;