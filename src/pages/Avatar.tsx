import React, { useState } from 'react';
import { Palette, Shirt, Crown, Sparkles, Save, RotateCcw } from 'lucide-react';

const Avatar: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('skin');
  const [avatar, setAvatar] = useState({
    skin: '#FFD1A7',
    hair: '#8B4513',
    eyes: '#2E86AB',
    shirt: '#FF6B6B',
    pants: '#4ECDC4',
    accessory: 'none'
  });

  const categories = [
    { id: 'skin', label: 'Skin', icon: Palette },
    { id: 'hair', label: 'Hair', icon: Crown },
    { id: 'clothes', label: 'Clothes', icon: Shirt },
    { id: 'accessories', label: 'Accessories', icon: Sparkles }
  ];

  const colorOptions = {
    skin: ['#FFD1A7', '#F4C2A1', '#E8B995', '#D4A574', '#C8956D', '#A0522D', '#8B4513', '#654321'],
    hair: ['#000000', '#8B4513', '#D2691E', '#FFD700', '#FF6347', '#9932CC', '#FF1493', '#00CED1'],
    shirt: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#F0E68C', '#FFB6C1'],
    pants: ['#4ECDC4', '#45B7D1', '#2C3E50', '#8B4513', '#000000', '#708090', '#556B2F', '#8B0000']
  };

  const accessories = [
    { id: 'none', label: 'None', emoji: '❌' },
    { id: 'glasses', label: 'Glasses', emoji: '👓' },
    { id: 'hat', label: 'Hat', emoji: '🎩' },
    { id: 'bow', label: 'Bow Tie', emoji: '🎀' },
    { id: 'star', label: 'Star', emoji: '⭐' },
    { id: 'crown', label: 'Crown', emoji: '👑' },
    { id: 'heart', label: 'Heart', emoji: '💖' },
    { id: 'rainbow', label: 'Rainbow', emoji: '🌈' }
  ];

  const handleColorChange = (category: string, color: string) => {
    setAvatar(prev => ({ ...prev, [category]: color }));
  };

  const handleAccessoryChange = (accessory: string) => {
    setAvatar(prev => ({ ...prev, accessory }));
  };

  const handleSaveAvatar = () => {
    // Save avatar logic here
    console.log('Avatar saved:', avatar);
  };

  const handleResetAvatar = () => {
    setAvatar({
      skin: '#FFD1A7',
      hair: '#8B4513',
      eyes: '#2E86AB',
      shirt: '#FF6B6B',
      pants: '#4ECDC4',
      accessory: 'none'
    });
  };

  const getAccessoryEmoji = (accessoryId: string) => {
    const accessory = accessories.find(a => a.id === accessoryId);
    return accessory ? accessory.emoji : '';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Avatar Builder</h1>
        <p className="text-gray-600">
          Create your unique coding buddy! Customize your avatar's appearance and show off your style.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Avatar Preview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Avatar</h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleResetAvatar}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={handleSaveAvatar}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>

            {/* Avatar Display */}
            <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-12 flex items-center justify-center">
              <div className="text-center">
                {/* Avatar SVG */}
                <svg width="200" height="300" viewBox="0 0 200 300" className="mx-auto mb-4">
                  {/* Body */}
                  <rect x="75" y="180" width="50" height="80" fill={avatar.pants} rx="8" />
                  <rect x="70" y="140" width="60" height="60" fill={avatar.shirt} rx="8" />
                  
                  {/* Head */}
                  <circle cx="100" cy="80" r="40" fill={avatar.skin} />
                  
                  {/* Hair */}
                  <path d="M 60 60 Q 60 40 100 40 Q 140 40 140 60 Q 140 80 100 80 Q 60 80 60 60 Z" fill={avatar.hair} />
                  
                  {/* Eyes */}
                  <circle cx="88" cy="75" r="4" fill={avatar.eyes} />
                  <circle cx="112" cy="75" r="4" fill={avatar.eyes} />
                  
                  {/* Smile */}
                  <path d="M 85 90 Q 100 100 115 90" stroke="#000" strokeWidth="2" fill="none" />
                  
                  {/* Arms */}
                  <rect x="50" y="150" width="15" height="40" fill={avatar.skin} rx="8" />
                  <rect x="135" y="150" width="15" height="40" fill={avatar.skin} rx="8" />
                  
                  {/* Legs */}
                  <rect x="80" y="260" width="15" height="30" fill={avatar.skin} rx="8" />
                  <rect x="105" y="260" width="15" height="30" fill={avatar.skin} rx="8" />
                </svg>
                
                {/* Accessory */}
                {avatar.accessory !== 'none' && (
                  <div className="text-4xl mb-4">{getAccessoryEmoji(avatar.accessory)}</div>
                )}
                
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-2">Coding Buddy</h3>
                  <p className="text-sm text-gray-600">Level 3 • 1,250 XP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Panel */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Customize</h2>
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{category.label}</span>
                </button>
              );
            })}
          </div>

          {/* Color Options */}
          {selectedCategory !== 'accessories' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                {selectedCategory === 'clothes' ? 'Shirt Colors' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Colors`}
              </h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {colorOptions[selectedCategory as keyof typeof colorOptions]?.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(selectedCategory === 'clothes' ? 'shirt' : selectedCategory, color)}
                    className={`w-12 h-12 rounded-lg border-2 hover:scale-110 transition-transform ${
                      avatar[selectedCategory as keyof typeof avatar] === color
                        ? 'border-purple-500 scale-110'
                        : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              
              {selectedCategory === 'clothes' && (
                <>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Pants Colors</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {colorOptions.pants.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleColorChange('pants', color)}
                        className={`w-12 h-12 rounded-lg border-2 hover:scale-110 transition-transform ${
                          avatar.pants === color
                            ? 'border-purple-500 scale-110'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Accessory Options */}
          {selectedCategory === 'accessories' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Accessories</h3>
              <div className="grid grid-cols-2 gap-2">
                {accessories.map((accessory) => (
                  <button
                    key={accessory.id}
                    onClick={() => handleAccessoryChange(accessory.id)}
                    className={`p-3 rounded-lg border-2 hover:scale-105 transition-all duration-200 ${
                      avatar.accessory === accessory.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="text-2xl mb-1">{accessory.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{accessory.label}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Avatar Gallery */}
      <div className="mt-12 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Avatar Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-100 rounded-lg p-4 hover:bg-gray-200 transition-colors cursor-pointer">
              <div className="text-center">
                <div className="text-2xl mb-2">🤖</div>
                <div className="text-xs text-gray-600">Avatar {index + 1}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Avatar;