import React, { useState, useEffect, useCallback } from 'react';
import Recorder from './components/Recorder';
import InterviewPanel from './components/InterviewPanel';
import CameraFeed from './components/CameraFeed';

// Helper for Text-to-Speech
function speak(text, onEnd) {
  try {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = onEnd;
    utterance.onerror = (e) => console.error('Speech synthesis error', e);
    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Error speaking text:', e);
  }
}

export default function App() {
  const [jobRole, setJobRole] = useState('Software Engineer');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [conversation, setConversation] = useState([]);
  const [interviewState, setInterviewState] = useState('idle'); // idle | loading | interviewing | finished | error
  const [error, setError] = useState(null);

  const startInterview = async () => {
    setInterviewState('loading');
    setError(null);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobRole }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch questions');
      }
      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions were generated. Please try a different job role.');
      }
      setQuestions(data.questions);
      setConversation([]);
      setCurrentQuestionIndex(0);
      setInterviewState('interviewing');
    } catch (err) {
      console.error(err);
      setError(err.message);
      setInterviewState('error');
    }
  };

  const handleAnswer = useCallback((answer) => {
    setConversation(prev => [...prev, { type: 'answer', text: answer }]);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setInterviewState('finished');
    }
  }, [currentQuestionIndex, questions.length]);

  useEffect(() => {
    if (interviewState === 'interviewing' && currentQuestionIndex < questions.length) {
      const currentQuestion = questions[currentQuestionIndex];
      setConversation(prev => [...prev, { type: 'question', text: currentQuestion }]);
      speak(currentQuestion, () => {
        // The user will now manually click the button to answer.
      });
    }
  }, [interviewState, questions, currentQuestionIndex]);

  return (
    <div className="app-container">
      {['interviewing', 'finished', 'error'].includes(interviewState) && <CameraFeed />}
      <div className="card">
        <div className="app-header">
          <h1>AI Interviewer</h1>
        </div>
        <p className="mb-4 text-sm text-gray-600">Enter a job role, and the AI will ask you relevant questions. Answer with your voice.</p>

        {interviewState === 'idle' && (
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
              className="text-input"
              placeholder="e.g., Software Engineer"
            />
            <button onClick={startInterview} className="btn">
              Start Interview
            </button>
          </div>
        )}

        {interviewState === 'loading' && <div className="loader"></div>}

        {interviewState === 'error' && (
            <div className="text-red-500 text-center">
                <p><strong>Error:</strong> {error}</p>
                <button onClick={startInterview} className="btn mt-4">
                    Try Again
                </button>
            </div>
        )}

        {(interviewState === 'interviewing' || interviewState === 'finished') && (
          <div className="flex flex-col gap-4">
            <Recorder onTranscript={handleAnswer} disabled={interviewState !== 'interviewing'} />
            <InterviewPanel conversation={conversation} />
            {interviewState === 'finished' && (
              <p className="text-center font-bold p-4">Interview Finished!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}