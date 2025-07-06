import React, { useState } from 'react';
import { 
  User, 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff, 
  Shield, 
  Clock, 
  Palette, 
  Save,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';

const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    username: 'Alex',
    avatar: '🧒',
    theme: 'light',
    soundEffects: true,
    notifications: true,
    screenTimeLimit: 120, // minutes
    parentalControls: true
  });

  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  const avatarOptions = ['🧒', '👧', '🧑', '👦', '🧒🏽', '👧🏽', '🧑🏽', '👦🏽', '🧒🏿', '👧🏿', '🧑🏿', '👦🏿'];
  const themeOptions = [
    { id: 'light', label: 'Light', icon: Sun, color: 'from-yellow-400 to-orange-500' },
    { id: 'dark', label: 'Dark', icon: Moon, color: 'from-purple-600 to-blue-600' },
    { id: 'auto', label: 'Auto', icon: Monitor, color: 'from-green-500 to-emerald-500' }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = () => {
    // Save settings logic here
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 3000);
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sound', label: 'Sound & Notifications', icon: Volume2 },
    { id: 'parental', label: 'Parental Controls', icon: Shield }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Customize your BitBuds experience to make it perfect for you!
        </p>
      </div>

      {/* Success Message */}
      {showSavedMessage && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-bounce">
          <Check className="w-5 h-5" />
          <span>Settings Updated!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-4 shadow-lg">
            <nav className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {/* Profile Settings */}
            {activeSection === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <User className="w-6 h-6 text-purple-600" />
                    <span>Profile Settings</span>
                  </h2>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Username
                  </label>
                  <input
                    type="text"
                    value={settings.username}
                    onChange={(e) => handleSettingChange('username', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
                    placeholder="Enter your username"
                  />
                </div>

                {/* Avatar Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Choose Your Avatar
                  </label>
                  <div className="grid grid-cols-6 gap-3">
                    {avatarOptions.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleSettingChange('avatar', avatar)}
                        className={`w-16 h-16 text-3xl rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          settings.avatar === avatar
                            ? 'border-purple-500 bg-purple-50 scale-110'
                            : 'border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {avatar}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Theme Color
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {themeOptions.map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleSettingChange('theme', theme.id)}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                            settings.theme === theme.id
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto mb-2 rounded-lg bg-gradient-to-br ${theme.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="text-sm font-medium text-gray-700">{theme.label}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Sound & Notifications */}
            {activeSection === 'sound' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Volume2 className="w-6 h-6 text-purple-600" />
                    <span>Sound & Notifications</span>
                  </h2>
                </div>

                {/* Sound Effects Toggle */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      {settings.soundEffects ? (
                        <Volume2 className="w-6 h-6 text-white" />
                      ) : (
                        <VolumeX className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Sound Effects</h3>
                      <p className="text-gray-600">Play sounds when you complete missions and earn badges</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('soundEffects', !settings.soundEffects)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      settings.soundEffects ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 ${
                      settings.soundEffects ? 'left-9' : 'left-1'
                    }`}></div>
                  </button>
                </div>

                {/* Notifications Toggle */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                      {settings.notifications ? (
                        <Bell className="w-6 h-6 text-white" />
                      ) : (
                        <BellOff className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
                      <p className="text-gray-600">Get notified about new missions and achievements</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                      settings.notifications ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div className={`absolute w-6 h-6 bg-white rounded-full top-1 transition-all duration-300 ${
                      settings.notifications ? 'left-9' : 'left-1'
                    }`}></div>
                  </button>
                </div>
              </div>
            )}

            {/* Parental Controls */}
            {activeSection === 'parental' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                    <Shield className="w-6 h-6 text-purple-600" />
                    <span>Parental Controls</span>
                  </h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                      🔒 These settings require parent permission to change.
                    </p>
                  </div>
                </div>

                {/* Screen Time Limit */}
                <div className="p-6 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Daily Screen Time Limit</h3>
                      <p className="text-gray-600">Set how long you can code each day</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Current limit:</span>
                      <span className="text-2xl font-bold text-orange-600">
                        {Math.floor(settings.screenTimeLimit / 60)}h {settings.screenTimeLimit % 60}m
                      </span>
                    </div>
                    
                    <input
                      type="range"
                      min="30"
                      max="240"
                      step="15"
                      value={settings.screenTimeLimit}
                      onChange={(e) => handleSettingChange('screenTimeLimit', parseInt(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      disabled
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>30 min</span>
                      <span>4 hours</span>
                    </div>
                  </div>
                </div>

                {/* Safety Features */}
                <div className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Safety Features</h3>
                      <p className="text-gray-600">Keep your coding experience safe and fun</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Content filtering</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Safe chat mode</span>
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Enabled
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Progress reports</span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Weekly
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleSaveSettings}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 font-semibold text-lg flex items-center justify-center space-x-2 shadow-lg"
              >
                <Save className="w-5 h-5" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;