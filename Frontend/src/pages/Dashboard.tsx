import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Target, Code, Award, TrendingUp, Calendar, Clock } from 'lucide-react';
import statsService from '../services/statsService';
import missionService from '../services/missionService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await statsService.getDashboard();
        setDashboardData(data.data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const inProgressMissions = dashboardData?.inProgressMissions || [];
  const recentCompletions = dashboardData?.recentCompletions || [];
  const rank = dashboardData?.rank || 0;

  const currentMission = inProgressMissions[0] || null;

  const recentActivities = recentCompletions.slice(0, 3).map((completion: any, index: number) => ({
    id: index + 1,
    type: 'mission',
    title: `Completed "${completion.mission?.title}"`,
    time: new Date(completion.completedAt).toLocaleDateString(),
    xp: completion.xpEarned || 0,
  }));

  const statsCards = [
    { label: 'Total XP', value: stats.totalXP || 0, icon: TrendingUp, color: 'from-purple-500 to-blue-500' },
    { label: 'Missions Completed', value: stats.missionsCompleted || 0, icon: Target, color: 'from-blue-500 to-cyan-500' },
    { label: 'Badges Earned', value: stats.badges?.length || 0, icon: Award, color: 'from-green-500 to-emerald-500' },
    { label: 'Coding Streak', value: stats.currentStreak || 0, icon: Calendar, color: 'from-orange-500 to-red-500' }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Coder'}! 🎉
        </h1>
        <p className="text-gray-600">
          Ready to continue your coding adventure? Let's see what you can build today!
        </p>
        {rank > 0 && (
          <p className="text-sm text-purple-600 mt-2">
            🏆 You're ranked #{rank} on the leaderboard!
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => {
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
              {currentMission && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                  {currentMission.mission?.difficulty || 'Beginner'}
                </span>
              )}
            </div>

            {currentMission ? (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-6 mb-4">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{currentMission.mission?.title}</h3>
                <p className="text-gray-600 mb-4">{currentMission.mission?.description}</p>

                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{currentMission.mission?.duration} min</span>
                  </div>
                  <div className="flex items-center text-sm text-purple-600">
                    <Award className="w-4 h-4 mr-1" />
                    <span>+{currentMission.mission?.xpReward} XP</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{currentMission.progress || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${currentMission.progress || 0}%` }}
                    ></div>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold">
                  Continue Mission
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Mission</h3>
                <p className="text-gray-600 mb-4">Start a new mission to continue learning!</p>
                <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-semibold">
                  Browse Missions
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activities */}
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activities</h2>
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.time}</p>
                      <p className="text-xs text-purple-600">+{activity.xp} XP</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
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