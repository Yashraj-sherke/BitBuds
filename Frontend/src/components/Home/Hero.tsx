import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Play, Sparkles, Code, Heart } from 'lucide-react';
import AuthModal from '../Auth/AuthModal';

const Hero: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
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
    if (isAuthenticated) {
      navigate('/parent-dashboard');
    } else {
      setAuthMode('login');
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-surface">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none hero-grid" aria-hidden="true">
          <div className="absolute top-16 left-10 w-24 h-24 bg-purple-200 rounded-full opacity-60 floating-orb"></div>
          <div className="absolute top-32 right-24 w-16 h-16 bg-blue-200 rounded-full opacity-60 floating-orb"></div>
          <div className="absolute bottom-40 left-16 w-28 h-28 bg-orange-200 rounded-full opacity-60 floating-orb"></div>
          <div className="absolute bottom-24 right-10 w-16 h-16 bg-green-200 rounded-full opacity-60 floating-orb"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg floating-badge">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ families</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                BitBuds
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-4">
              Your First Buddy in the World of Code
            </p>
            
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              Transform your child's screen time into learning time with our fun, interactive coding platform designed for kids aged 6-14.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={handleStartLearning}
                className="group bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center space-x-2 shine"
              >
                <Play className="w-5 h-5" />
                <span>Start Learning</span>
              </button>
              
              <button
                onClick={handleParentZone}
                className="group bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-all duration-200 transform hover:scale-105 shadow-lg border-2 border-purple-200 flex items-center space-x-2 shine"
              >
                <Heart className="w-5 h-5" />
                <span>Parent Zone</span>
              </button>
            </div>

            {/* Demo Preview */}
            <div className="relative max-w-4xl mx-auto">
              <div className="glass-card glow-ring hover-card rounded-2xl p-8 border border-purple-100 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-purple-100 via-blue-50 to-blue-100 rounded-xl flex items-center justify-center shine">
                  <div className="text-center">
                    <Code className="w-16 h-16 text-purple-600 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Code Lab</h3>
                    <p className="text-gray-600">Drag, drop, and create amazing projects!</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -left-6 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white font-bold">🎯</span>
              </div>
              <div className="absolute -top-6 -right-6 bg-green-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse">
                <span className="text-white font-bold">⭐</span>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-blue-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '1s' }}>
                <span className="text-white font-bold">🚀</span>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-purple-400 rounded-full w-12 h-12 flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '2s' }}>
                <span className="text-white font-bold">💎</span>
              </div>
            </div>
          </div>
        </div>
      </section>

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

export default Hero;