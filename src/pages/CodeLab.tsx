import React, { useState } from 'react';
import { Play, Square, RotateCcw, Save, Share2, HelpCircle } from 'lucide-react';

const CodeLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'code'>('blocks');
  const [isRunning, setIsRunning] = useState(false);

  const codeBlocks = [
    {
      category: 'Movement',
      color: 'bg-blue-500',
      blocks: [
        { id: 'move_forward', label: 'Move Forward', icon: '→' },
        { id: 'move_backward', label: 'Move Backward', icon: '←' },
        { id: 'turn_left', label: 'Turn Left', icon: '↺' },
        { id: 'turn_right', label: 'Turn Right', icon: '↻' }
      ]
    },
    {
      category: 'Loops',
      color: 'bg-green-500',
      blocks: [
        { id: 'repeat', label: 'Repeat', icon: '🔄' },
        { id: 'while', label: 'While', icon: '⚡' },
        { id: 'for', label: 'For', icon: '🔢' }
      ]
    },
    {
      category: 'Logic',
      color: 'bg-purple-500',
      blocks: [
        { id: 'if', label: 'If', icon: '❓' },
        { id: 'else', label: 'Else', icon: '❗' },
        { id: 'compare', label: 'Compare', icon: '⚖️' }
      ]
    },
    {
      category: 'Actions',
      color: 'bg-orange-500',
      blocks: [
        { id: 'pickup', label: 'Pick Up', icon: '🤏' },
        { id: 'drop', label: 'Drop', icon: '📦' },
        { id: 'say', label: 'Say', icon: '💬' }
      ]
    }
  ];

  const handleRunCode = () => {
    setIsRunning(true);
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false);
    }, 3000);
  };

  const handleStopCode = () => {
    setIsRunning(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Code Blocks */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Code Blocks</h2>
          <p className="text-sm text-gray-600">Drag blocks to build your program</p>
        </div>
        
        <div className="p-4 space-y-6">
          {codeBlocks.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <div className={`w-3 h-3 rounded-full ${category.color} mr-2`}></div>
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.blocks.map((block) => (
                  <div
                    key={block.id}
                    className={`${category.color} text-white px-4 py-3 rounded-lg cursor-move hover:opacity-90 transition-opacity flex items-center space-x-2 shadow-sm`}
                    draggable
                  >
                    <span className="text-lg">{block.icon}</span>
                    <span className="font-medium">{block.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Code Lab</h1>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveTab('blocks')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'blocks'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Blocks
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'code'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Code
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={isRunning ? handleStopCode : handleRunCode}
              className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-all duration-200 ${
                isRunning
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isRunning ? (
                <>
                  <Square className="w-4 h-4" />
                  <span>Stop</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Run</span>
                </>
              )}
            </button>
            <button className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2">
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Workspace */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-2xl shadow-lg h-full">
              {activeTab === 'blocks' ? (
                <div className="p-6 h-full">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Start Building!</h3>
                      <p className="text-gray-600 max-w-md">
                        Drag code blocks from the sidebar to this workspace. Connect them to create your program!
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 h-full">
                  <div className="bg-gray-900 text-green-400 p-4 rounded-xl h-full font-mono text-sm">
                    <div className="mb-2">// Your generated code will appear here</div>
                    <div className="text-white">
                      function main() {'{'}
                      <br />
                      &nbsp;&nbsp;// Add blocks to generate code
                      <br />
                      {'}'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Panel */}
          <div className="w-80 p-6">
            <div className="bg-white rounded-2xl shadow-lg h-full">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Output</h3>
                <div className="bg-gray-100 rounded-xl p-4 h-80 mb-4">
                  {isRunning ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                        <p className="text-gray-600">Running your code...</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🤖</div>
                        <p className="text-gray-600">Click "Run" to execute your code!</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Problem Description */}
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Challenge:</h4>
                      <p className="text-blue-800 text-sm">
                        Help the robot collect all the gems by moving it around the maze. Use loops to make your code more efficient!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeLab;