import { useEffect, useState } from 'react';
import { useHearts } from '../contexts/HeartsContext';
import { useLanguage } from '../contexts/LanguageContext';
import './HeartsDisplay.css';

// ── SVG primitives ────────────────────────────────────────────────────────────

const HeartFilledSVG = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const HeartEmptySVG = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────

interface HeartsDisplayProps {
  size?: 'sm' | 'md' | 'lg';
  showTimer?: boolean;
  className?: string;
}

// ── Countdown helpers ─────────────────────────────────────────────────────────

function formatMs(ms: number): string {
  if (ms <= 0) return '0:00';
  const totalSec = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function HeartsDisplay({ size = 'md', showTimer = false, className = '' }: HeartsDisplayProps) {
  const { hearts, maxHearts, isUnlimited, childMode, getRegenTimeMs } = useHearts();
  const { lang } = useLanguage();
  const [regenMs, setRegenMs] = useState<number>(0);

  useEffect(() => {
    if (!showTimer || isUnlimited || hearts >= maxHearts) {
      setRegenMs(0);
      return;
    }

    setRegenMs(getRegenTimeMs());

    const id = setInterval(() => {
      const remaining = getRegenTimeMs();
      setRegenMs(remaining);
      if (remaining <= 0) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [showTimer, isUnlimited, hearts, maxHearts, getRegenTimeMs]);

  const sizeClass = `hearts-display--${size}`;

  // Child mode: hearts system disabled — render nothing
  if (childMode) return null;

  if (isUnlimited) {
    return (
      <div
        className={`hearts-display ${sizeClass} ${className}`}
        role="status"
        aria-label={lang === 'tr' ? 'Sinirsiz can' : 'Unlimited hearts'}
      >
        <span className="hearts-display__unlimited" aria-hidden="true">
          &#x221E;
        </span>
      </div>
    );
  }

  return (
    <div
      className={`hearts-display ${sizeClass}${hearts === 0 ? ' hearts-display--zero' : ''} ${className}`}
      role="status"
      aria-label={lang === 'tr' ? `${maxHearts} candan ${hearts} kaldi` : `${hearts} out of ${maxHearts} hearts remaining`}
    >
      {Array.from({ length: maxHearts }, (_, i) => {
        const isFull = i < hearts;
        return (
          <span
            key={i}
            className={`hearts-display__icon ${isFull ? 'hearts-display__icon--full' : 'hearts-display__icon--empty'}`}
          >
            {isFull ? <HeartFilledSVG /> : <HeartEmptySVG />}
          </span>
        );
      })}

      {showTimer && hearts < maxHearts && regenMs > 0 && (
        <span className="hearts-display__timer-wrap" aria-live="polite">
          <span className="hearts-display__timer">
            {lang === 'tr' ? `Sonraki can: ${formatMs(regenMs)}` : `Next heart in: ${formatMs(regenMs)}`}
          </span>
        </span>
      )}
    </div>
  );
}

HeartsDisplay.displayName = 'HeartsDisplay';

export default HeartsDisplay;
