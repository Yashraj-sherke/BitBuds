import React from 'react';
import { Gamepad2, Shield, BookOpen, Award } from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: Gamepad2,
      title: 'Learn by Playing',
      description: 'Interactive games and challenges that make coding feel like play. Kids learn best when they\'re having fun!',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Safe & Supervised',
      description: 'Kid-friendly environment with built-in safety features and parental controls for peace of mind.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: BookOpen,
      title: 'Game-Based Lessons',
      description: 'Structured curriculum disguised as exciting adventures. From basics to advanced concepts.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Earn Badges',
      description: 'Celebrate achievements with digital badges, certificates, and unlock new coding adventures.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose BitBuds?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We've designed every aspect of our platform to make learning to code as natural and enjoyable as possible for young minds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative glass-card glow-ring hover-card shine tilt rounded-2xl p-8 border border-gray-100 overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                
                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-100">Happy Kids</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
              <div className="text-purple-100">Coding Lessons</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">100+</div>
              <div className="text-purple-100">Projects Created</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Safe Learning</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;