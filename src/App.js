import React, { useState, useRef } from 'react';
import { Camera, Square, Mic } from 'lucide-react';

const App = () => {
 const [recording, setRecording] = useState(false);
 const [wordCount, setWordCount] = useState(0);
 const [transcript, setTranscript] = useState('');
 const mediaRecorderRef = useRef(null);
 const streamRef = useRef(null);
 const recognitionRef = useRef(null);

 const startRecording = async () => {
   try {
     const stream = await navigator.mediaDevices.getUserMedia({ 
       video: true, 
       audio: true 
     });
     streamRef.current = stream;
     const videoElement = document.getElementById('preview');
     videoElement.srcObject = stream;
     
     mediaRecorderRef.current = new MediaRecorder(stream);
     
     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
     recognitionRef.current = new SpeechRecognition();
     recognitionRef.current.continuous = true;
     recognitionRef.current.interimResults = true;
     
     recognitionRef.current.onresult = (event) => {
       let fullTranscript = '';
       for (let i = 0; i < event.results.length; i++) {
         fullTranscript += event.results[i][0].transcript + ' ';
       }
       setTranscript(fullTranscript);
       const words = fullTranscript.trim().split(/\s+/);
       setWordCount(words.length);
     };
     
     recognitionRef.current.start();
     mediaRecorderRef.current.start();
     setRecording(true);
   } catch (err) {
     console.error('Error accessing media devices:', err);
   }
 };

 const stopRecording = () => {
   if (mediaRecorderRef.current && streamRef.current) {
     mediaRecorderRef.current.stop();
     streamRef.current.getTracks().forEach(track => track.stop());
     recognitionRef.current.stop();
     setRecording(false);
   }
 };

 return (
   <div className="min-h-screen bg-gray-50 p-8">
     <div className="max-w-4xl mx-auto">
       <div className="relative mb-6">
         <video 
           id="preview" 
           autoPlay 
           muted 
           playsInline
           className="w-full h-96 object-cover rounded-2xl bg-gray-900 shadow-lg"
         />
         
         <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
           {!recording ? (
             <button
               onClick={startRecording}
               className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
             >
               <Camera size={24} />
               Start Recording
             </button>
           ) : (
             <button
               onClick={stopRecording}
               className="flex items-center gap-3 bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors shadow-lg animate-pulse"
             >
               <Square size={24} />
               Stop Recording
             </button>
           )}
         </div>

         {recording && (
           <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500 text-white px-3 py-1 rounded-full animate-pulse">
             <div className="w-2 h-2 bg-white rounded-full"></div>
             Recording
           </div>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-md">
           <div className="flex items-center gap-3 mb-4">
             <div className="p-2 bg-blue-100 rounded-lg">
               <Mic size={24} className="text-blue-600" />
             </div>
             <h3 className="text-lg font-semibold">Words Spoken</h3>
           </div>
           <p className="text-4xl font-bold text-blue-600">{wordCount}</p>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-md">
           <h3 className="text-lg font-semibold mb-3">Live Transcript</h3>
           <div className="h-32 overflow-y-auto">
             <p className="text-gray-600 whitespace-pre-wrap">{transcript || 'Transcript will appear here...'}</p>
           </div>
         </div>
       </div>
     </div>
   </div>
 );
};

export default App;
