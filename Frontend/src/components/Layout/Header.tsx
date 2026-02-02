import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Code, User, LogOut, Menu, X } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();

  const handleStartLearning = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleParentZone = () => {
    if (isAuthenticated && user?.isParent) {
      navigate('/parent-dashboard');
    } else {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BitBuds
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/missions" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Missions
                  </Link>
                  <Link to="/codelab" className="text-gray-700 hover:text-purple-600 transition-colors">
                    Code Lab
                  </Link>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        Level {user?.level}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartLearning}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Start Learning
                  </button>
                  <button
                    onClick={handleParentZone}
                    className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Parent Zone
                  </button>
                </>
              )}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/missions"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Missions
                  </Link>
                  <Link
                    to="/codelab"
                    className="block px-3 py-2 text-gray-700 hover:text-purple-600 transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Code Lab
                  </Link>
                  <div className="px-3 py-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <User className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        Level {user?.level}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 text-red-500 hover:text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={handleStartLearning}
                    className="block w-full text-left px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                  >
                    Start Learning
                  </button>
                  <button
                    onClick={handleParentZone}
                    className="block w-full text-left px-3 py-2 text-purple-600 hover:text-purple-700 font-medium transition-colors"
                  >
                    Parent Zone
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={setAuthMode}
        />
      )}
    </>
  );
};

export default Header;