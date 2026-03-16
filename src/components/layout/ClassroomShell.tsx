import React, { useState, useCallback, useEffect } from 'react';
import {
  Clock,
  SkipBack,
  SkipForward,
  Pause,
  Play,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  RotateCcw,
  Eye,
  Contrast,
} from 'lucide-react';
import './ClassroomShell.css';

interface ClassroomShellProps {
  children: React.ReactNode;
  className?: string;
  lessonName?: string;
  /** Elapsed or remaining time display string, e.g. "12:34" */
  timerDisplay?: string;
  isPaused?: boolean;
  isMuted?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  onMute?: () => void;
  onReset?: () => void;
}

export default function ClassroomShell({
  children,
  className = '',
  lessonName = '',
  timerDisplay = '00:00',
  isPaused = false,
  isMuted = false,
  onPause,
  onResume,
  onNext,
  onPrev,
  onMute,
  onReset,
}: ClassroomShellProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or blocked
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      className={`classroom-shell ${isFullscreen ? 'fullscreen' : ''} ${highContrast ? 'high-contrast' : ''} ${className}`}
    >
      {/* Top Bar */}
      <div className="classroom-shell__topbar">
        <div className="classroom-shell__topbar-left">
          <div className="classroom-shell__class-name">{className || 'Classroom'}</div>
          {lessonName && (
            <div className="classroom-shell__lesson-name">{lessonName}</div>
          )}
        </div>

        <div className="classroom-shell__topbar-center">
          <div className="classroom-shell__timer">
            <Clock />
            <span>{timerDisplay}</span>
          </div>
        </div>

        <div className="classroom-shell__topbar-right">
          <button
            className="classroom-shell__control"
            onClick={onPrev}
            aria-label="Previous"
            type="button"
          >
            <SkipBack />
          </button>

          <button
            className="classroom-shell__control classroom-shell__control--primary"
            onClick={isPaused ? onResume : onPause}
            aria-label={isPaused ? 'Resume' : 'Pause'}
            type="button"
          >
            {isPaused ? <Play /> : <Pause />}
          </button>

          <button
            className="classroom-shell__control"
            onClick={onNext}
            aria-label="Next"
            type="button"
          >
            <SkipForward />
          </button>

          <button
            className="classroom-shell__control"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            type="button"
          >
            {isFullscreen ? <Minimize /> : <Maximize />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="classroom-shell__content">
        <main className="classroom-shell__main">
          {children}
        </main>

        {/* Teacher Floating Panel */}
        <aside className="classroom-shell__teacher-panel" aria-label="Teacher controls">
          <button
            className="classroom-shell__teacher-btn"
            onClick={onMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            type="button"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>

          <button
            className="classroom-shell__teacher-btn"
            onClick={onReset}
            aria-label="Reset"
            type="button"
          >
            <RotateCcw />
          </button>

          <div className="classroom-shell__teacher-divider" />

          <button
            className={`classroom-shell__teacher-btn ${highContrast ? 'classroom-shell__teacher-btn--active' : ''}`}
            onClick={() => setHighContrast(c => !c)}
            aria-label="Toggle high contrast"
            type="button"
          >
            <Contrast />
          </button>

          <button
            className="classroom-shell__teacher-btn"
            aria-label="Focus mode"
            type="button"
          >
            <Eye />
          </button>
        </aside>
      </div>
    </div>
  );
}
