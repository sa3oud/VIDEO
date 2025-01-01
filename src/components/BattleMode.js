import React, { useState, useRef } from 'react';
import { ArrowLeft, Users, Mail } from 'lucide-react';

const BattleMode = ({ onBack, onInvite }) => {
  const [recording, setRecording] = useState(false);
  const [participants, setParticipants] = useState({
    player1: { wordCount: 0, transcript: '' },
    player2: { wordCount: 0, transcript: '' }
  });

  const mediaRefs = useRef({
    player1: { media: null, stream: null, recognition: null },
    player2: { media: null, stream: null, recognition: null }
  });

  const startBattle = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      // Set up speech recognition for both players
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      ['player1', 'player2'].forEach(player => {
        mediaRefs.current[player].stream = stream.clone();
        mediaRefs.current[player].media = new MediaRecorder(mediaRefs.current[player].stream);
        
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript + ' ';
          }
          
          setParticipants(prev => ({
            ...prev,
            [player]: {
              transcript,
              wordCount: transcript.trim().split(/\s+/).length
            }
          }));
        };
        
        mediaRefs.current[player].recognition = recognition;
        recognition.start();
        mediaRefs.current[player].media.start();
      });

      setRecording(true);
    } catch (err) {
      console.error('Error starting battle:', err);
    }
  };

  const stopBattle = () => {
    ['player1', 'player2'].forEach(player => {
      if (mediaRefs.current[player].media) {
        mediaRefs.current[player].media.stop();
        mediaRefs.current[player].stream.getTracks().forEach(track => track.stop());
        mediaRefs.current[player].recognition.stop();
      }
    });
    setRecording(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={onBack} className="mb-6 text-gray-600 hover:text-gray-900">
        <ArrowLeft className="inline mr-2" size={20} />
        Back
      </button>

      {!recording && (
        <button
          onClick={onInvite}
          className="ml-4 text-blue-500 hover:text-blue-600"
        >
          <Mail className="inline mr-2" size={20} />
          Invite Opponent
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {['player1', 'player2'].map((player, index) => (
          <div key={player} className="bg-white p-6 rounded-2xl shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <Users size={24} className="text-blue-500" />
              <h3 className="text-lg font-semibold">Player {index + 1}</h3>
              <span className="text-2xl font-bold ml-auto">
                {participants[player].wordCount}
              </span>
            </div>
            <div className="h-32 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                {participants[player].transcript || 'Waiting to start...'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-8">
        {!recording ? (
          <button
            onClick={startBattle}
            className="bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600"
          >
            Start Battle
          </button>
        ) : (
          <button
            onClick={stopBattle}
            className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600"
          >
            End Battle
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleMode;
