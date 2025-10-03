import React from 'react';

export default function InterviewPanel({ conversation }) {
  return (
    <div className="conversation-panel flex flex-col gap-4">
      {conversation.map((entry, index) => (
        <div key={index} className={`conversation-entry ${entry.type}`}>
          <strong>{entry.type === 'question' ? '🤖 AI Interviewer' : '👤 You'}:</strong>
          <p className="m-0">{entry.text}</p>
        </div>
      ))}
    </div>
  );
}
