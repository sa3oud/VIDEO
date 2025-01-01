import React, { useState } from 'react';
import { Camera, Swords } from 'lucide-react';
import VideoRecorder from './components/VideoRecorder';
import BattleMode from './components/BattleMode';

const App = () => {
  const [mode, setMode] = useState('home');
  
  const renderHome = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-2xl w-full space-y-8 p-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Word Counter</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button onClick={() => setMode('solo')} className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-4">
            <Camera size={48} className="text-blue-500" />
            <h2 className="text-xl font-semibold">Solo Recording</h2>
            <p className="text-gray-600 text-center">Record yourself and count words</p>
          </button>
          
          <button onClick={() => setMode('battle')} className="p-8 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-4">
            <Swords size={48} className="text-red-500" />
            <h2 className="text-xl font-semibold">Battle Mode</h2>
            <p className="text-gray-600 text-center">Challenge someone to a word battle</p>
          </button>
        </div>
      </div>
    </div>
  );

  switch(mode) {
    case 'solo':
      return <VideoRecorder onBack={() => setMode('home')} />;
    case 'battle':
      return <BattleMode onBack={() => setMode('home')} />;
    default:
      return renderHome();
  }
};

export default App;
