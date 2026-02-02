import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Target, Code, Award, User, Settings, BarChart3 } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: Home },
    { path: '/missions', label: 'Missions', icon: Target },
    { path: '/codelab', label: 'Code Lab', icon: Code },
    { path: '/avatar', label: 'Avatar', icon: User },
    { path: '/badges', label: 'Badges', icon: Award },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  // Add parent dashboard for parent users
  if (user?.isParent) {
    navItems.push({ path: '/parent-dashboard', label: 'Parent Dashboard', icon: BarChart3 });
  }

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform -translate-x-full transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0">
      <div className="flex flex-col h-full">
        {/* User Profile */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{user?.firstName || 'User'}</h3>
              <p className="text-sm text-gray-500">Level {user?.level || 1}</p>
            </div>
          </div>

          {/* XP Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>XP</span>
              <span>{user?.xp}/2000</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((user?.xp || 0) / 2000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-purple-600'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Badges Preview */}
        <div className="p-4 border-t border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Recent Badges</h4>
          <div className="flex space-x-2">
            {(user?.badges || []).slice(0, 3).map((_, index) => (
              <div key={index} className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
            ))}
            {(!user?.badges || user.badges.length === 0) && (
              <p className="text-xs text-gray-500">No badges yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;