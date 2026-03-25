/**
 * LetterTracingPage — Alphabet tracing activity hub.
 * Grid of 26 letters, mastery tracking, "Alphabet Practice" sequential mode.
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCcw, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { LetterTracer } from '../../components/LetterTracer';
import {
  getTracingProgress,
  recordTrace,
  getMasteredLetters,
} from '../../services/tracingService';
import './LetterTracingPage.css';

// ─── Constants ───────────────────────────────────────────────────────────────

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');
const MASTERY_THRESHOLD = 3;

// ─── Types ───────────────────────────────────────────────────────────────────

type View = 'grid' | 'tracing';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function masteryStars(count: number): number {
  if (count >= MASTERY_THRESHOLD) return 3;
  if (count === 2) return 2;
  if (count === 1) return 1;
  return 0;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function LetterTracingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?.uid ?? 'guest';

  const [view, setView] = useState<View>('grid');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isPracticeMode, setIsPracticeMode] = useState(false);
  const [practiceQueue, setPracticeQueue] = useState<string[]>([]);
  const [practiceIdx, setPracticeIdx] = useState(0);
  // Trigger re-renders when progress changes
  const [progressKey, setProgressKey] = useState(0);

  const progress = getTracingProgress(userId);
  const mastered = getMasteredLetters(userId);

  // ── Open single letter ──
  function openLetter(letter: string) {
    setActiveLetter(letter);
    setIsPracticeMode(false);
    setView('tracing');
  }

  // ── Start Alphabet Practice (unmastered letters first) ──
  function startPractice() {
    const unmastered = ALPHABET.filter((l) => !mastered.includes(l));
    const queue = unmastered.length > 0 ? unmastered : ALPHABET;
    setPracticeQueue(queue);
    setPracticeIdx(0);
    setActiveLetter(queue[0]);
    setIsPracticeMode(true);
    setView('tracing');
  }

  // ── Handle trace completion ──
  const handleComplete = useCallback(
    (accuracy: number) => {
      if (!activeLetter) return;
      const correct = accuracy >= 70;
      recordTrace(userId, activeLetter, correct);
      setProgressKey((k) => k + 1);

      if (isPracticeMode) {
        const next = practiceIdx + 1;
        if (next < practiceQueue.length) {
          setPracticeIdx(next);
          setActiveLetter(practiceQueue[next]);
        } else {
          // Practice complete — go back to grid
          setIsPracticeMode(false);
          setView('grid');
        }
      }
    },
    [activeLetter, isPracticeMode, practiceIdx, practiceQueue, userId],
  );

  // ── Back navigation ──
  function handleBack() {
    if (view === 'tracing') {
      setView('grid');
      setActiveLetter(null);
      setIsPracticeMode(false);
    } else {
      navigate(-1);
    }
  }

  // ─── Render: Tracing view ────────────────────────────────────────────────

  if (view === 'tracing' && activeLetter) {
    const letterCount = progress[activeLetter] ?? 0;
    const stars = masteryStars(letterCount);

    return (
      <div className="ltp ltp--tracing">
        <header className="ltp-header">
          <button type="button" className="ltp-back-btn" onClick={handleBack}>
            <ArrowLeft size={20} />
            {isPracticeMode ? 'End Practice' : 'All Letters'}
          </button>

          <div className="ltp-header__title">
            {isPracticeMode
              ? `Practice (${practiceIdx + 1} / ${practiceQueue.length})`
              : 'Letter Tracing'}
          </div>

          <div className="ltp-mastery-stars">
            {[0, 1, 2].map((i) => (
              <Star
                key={i}
                size={18}
                className={`ltp-star ${i < stars ? 'ltp-star--filled' : ''}`}
              />
            ))}
          </div>
        </header>

        <main className="ltp-tracer-area" key={`${progressKey}-${activeLetter}`}>
          <LetterTracer
            letter={activeLetter}
            size={300}
            onComplete={handleComplete}
            showGuide
          />
        </main>

        {/* Quick-jump to phonics lesson */}
        <div className="ltp-phonics-link">
          <button
            type="button"
            className="ltp-phonics-btn"
            onClick={() => navigate(`/phonics/${activeLetter}`)}
          >
            Hear the sound for &ldquo;{activeLetter.toUpperCase()}&rdquo;
          </button>
        </div>
      </div>
    );
  }

  // ─── Render: Grid view ───────────────────────────────────────────────────

  return (
    <div className="ltp">
      <header className="ltp-header">
        <button type="button" className="ltp-back-btn" onClick={handleBack}>
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="ltp-header__title">Letter Tracing</h1>
        <button type="button" className="ltp-practice-btn" onClick={startPractice}>
          <RefreshCcw size={16} />
          Practice All
        </button>
      </header>

      {/* Stats bar */}
      <div className="ltp-stats" key={progressKey}>
        <div className="ltp-stat">
          <span className="ltp-stat__value">{mastered.length}</span>
          <span className="ltp-stat__label">Mastered</span>
        </div>
        <div className="ltp-stat">
          <span className="ltp-stat__value">{26 - mastered.length}</span>
          <span className="ltp-stat__label">To Learn</span>
        </div>
        <div className="ltp-stat">
          <span className="ltp-stat__value">
            {Math.round((mastered.length / 26) * 100)}%
          </span>
          <span className="ltp-stat__label">Complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="ltp-overall-bar-track" aria-label="Alphabet mastery progress">
        <div
          className="ltp-overall-bar-fill"
          style={{ width: `${Math.round((mastered.length / 26) * 100)}%` }}
        />
      </div>

      {/* Alphabet grid */}
      <div className="ltp-grid" key={`grid-${progressKey}`}>
        {ALPHABET.map((letter) => {
          const count = progress[letter] ?? 0;
          const stars = masteryStars(count);
          const isMastered = stars === 3;

          return (
            <button
              key={letter}
              type="button"
              className={`ltp-letter-btn ${isMastered ? 'ltp-letter-btn--mastered' : ''}`}
              onClick={() => openLetter(letter)}
              aria-label={`Trace letter ${letter.toUpperCase()}, ${stars} stars`}
            >
              <span className="ltp-letter-btn__char">{letter.toUpperCase()}</span>
              <span className="ltp-letter-btn__lower">{letter}</span>
              <div className="ltp-letter-btn__stars">
                {[0, 1, 2].map((i) => (
                  <Star
                    key={i}
                    size={10}
                    className={`ltp-star ltp-star--sm ${i < stars ? 'ltp-star--filled' : ''}`}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
