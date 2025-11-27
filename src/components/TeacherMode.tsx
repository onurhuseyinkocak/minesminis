import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const TeacherMode: React.FC = () => {
  const { user } = useAuth();
  const [isTeacherMode, setIsTeacherMode] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const [showPinPad, setShowPinPad] = useState(false);
  const [pin, setPin] = useState('');
  const TEACHER_PIN = '1234'; // In a real app, this would be secure

  // Only allow access if user is authenticated
  if (!user) return null;

  const handleModeSwitch = () => {
    if (isTeacherMode) {
      // Switching back to student mode is easy
      setIsTeacherMode(false);
      document.body.classList.remove('teacher-mode');
      setShowTools(false);
    } else {
      // Switching to teacher mode requires PIN
      setShowPinPad(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === TEACHER_PIN) {
      setIsTeacherMode(true);
      document.body.classList.add('teacher-mode');
      setShowPinPad(false);
      setPin('');
    } else {
      alert('Incorrect PIN! Try 1234');
      setPin('');
    }
  };

  return (
    <div className="teacher-mode-container">
      {showPinPad && (
        <div className="pin-overlay">
          <div className="clay-card pin-card">
            <h3>🔐 Teacher Access</h3>
            <p>Enter PIN to enter Teacher Mode</p>
            <form onSubmit={handlePinSubmit}>
              <input
                type="password"
                className="clay-input"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="PIN"
                autoFocus
                maxLength={4}
              />
              <div className="pin-actions">
                <button type="button" className="clay-btn" onClick={() => setShowPinPad(false)}>Cancel</button>
                <button type="submit" className="clay-btn clay-btn-primary">Unlock</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        className={`mode-toggle-btn clay-btn ${isTeacherMode ? 'clay-btn-primary' : 'clay-btn-secondary'}`}
        onClick={handleModeSwitch}
        aria-label={isTeacherMode ? "Switch to Student View" : "Switch to Teacher View"}
      >
        {isTeacherMode ? '👨‍🏫 Teacher View' : '🎓 Student View'}
      </button>

      {isTeacherMode && (
        <div className="teacher-tools-panel">
          <button
            className="tool-btn clay-btn"
            onClick={() => setShowTools(!showTools)}
            aria-expanded={showTools}
          >
            🛠️
          </button>

          {showTools && (
            <div className="tools-grid clay-card">
              <button className="tool-item" title="Pen">🖊️</button>
              <button className="tool-item" title="Highlighter">🖍️</button>
              <button className="tool-item" title="Spotlight">🔦</button>
              <button className="tool-item" title="Timer">⏱️</button>
              <button className="tool-item" title="Poll">📊</button>
            </div>
          )}
        </div>
      )}

      <style>{`
        .teacher-mode-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .pin-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(5px);
          z-index: 10001;
        }

        .pin-card {
          width: 300px;
          text-align: center;
        }

        .pin-card h3 { margin-bottom: 10px; }
        .pin-card p { margin-bottom: 20px; color: #666; font-size: 0.9rem; }
        
        .pin-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }

        .mode-toggle-btn {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .teacher-tools-panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 10px;
        }

        .tool-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          justify-content: center;
          padding: 0;
          font-size: 1.5rem;
        }

        .tools-grid {
          display: flex;
          gap: 10px;
          padding: 10px;
          animation: popIn 0.3s ease;
        }

        .tool-item {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 8px;
          background: #f0f4f8;
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .tool-item:hover {
          transform: scale(1.1);
          background: #e2e8f0;
        }

        @media (min-width: 1920px) {
          .teacher-mode-container {
            bottom: 40px;
            right: 40px;
          }
        }
      `}</style>
    </div>
  );
};

export default TeacherMode;
