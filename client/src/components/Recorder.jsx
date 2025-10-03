import React, { useState, useRef, useEffect } from 'react';

export default function Recorder({ onTranscript, disabled }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setRecording(false);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech Recognition not supported in this browser.');
    }
  }, [onTranscript]);

  const toggleRecording = () => {
    if (disabled) return;

    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
    } else {
      recognitionRef.current?.start();
      setRecording(true);
    }
  };

  return (
    <div className="text-center">
      <button
        id="recorder-button"
        className={`btn ${recording ? 'btn-danger' : ''}`}
        onClick={toggleRecording}
        disabled={disabled}
      >
        {recording ? 'Listening... (Click to Stop)' : '🎤 Answer Question'}
      </button>
    </div>
  );
}
