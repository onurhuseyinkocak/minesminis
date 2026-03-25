import { useState, useEffect, useCallback } from 'react';
import { speak, isTTSAvailable, stopSpeech } from '../services/ttsService';
import './SpeakButton.css';

// ── Speaker SVG icon ──────────────────────────────────────────────────────────

function SpeakerIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

export interface SpeakButtonProps {
  text: string;
  lang?: 'en-US' | 'tr-TR';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'labeled';
  autoPlay?: boolean;
  children?: React.ReactNode;
  className?: string;
}

// ── Icon size map ─────────────────────────────────────────────────────────────

const ICON_SIZE: Record<NonNullable<SpeakButtonProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 26,
};

// ── Component ─────────────────────────────────────────────────────────────────

export function SpeakButton({
  text,
  lang = 'en-US',
  size = 'md',
  variant = 'icon',
  autoPlay = false,
  children,
  className,
}: SpeakButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const available = isTTSAvailable();

  const handleSpeak = useCallback(() => {
    if (!available || !text.trim()) return;

    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setIsPlaying(true);
    speak(text, {
      lang,
      rate: 0.8,
      pitch: 1.1,
      volume: 1,
      onEnd: () => setIsPlaying(false),
      onError: () => setIsPlaying(false),
    });
  }, [available, text, lang, isPlaying]);

  // autoPlay: speak on mount — only works in browsers that allow it without a
  // prior gesture (desktop). On iOS Safari this will silently be blocked; the
  // child can always tap the button manually.
  useEffect(() => {
    if (!autoPlay || !available || !text.trim()) return;

    // Small delay so the component renders before speaking
    const id = setTimeout(() => {
      setIsPlaying(true);
      speak(text, {
        lang,
        rate: 0.8,
        pitch: 1.1,
        volume: 1,
        onEnd: () => setIsPlaying(false),
        onError: () => setIsPlaying(false),
      });
    }, 300);

    return () => clearTimeout(id);
    // Only run on mount — intentionally ignoring dep changes for autoPlay
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!available) return null;

  const buttonClass = [
    'speak-btn',
    `speak-btn--${size}`,
    isPlaying && 'speak-btn--playing',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSize = ICON_SIZE[size];

  return (
    <span className="speak-btn-wrap">
      {children}
      <button
        type="button"
        className={buttonClass}
        onClick={handleSpeak}
        aria-label={isPlaying ? 'Stop audio' : `Listen: ${text}`}
        title={isPlaying ? 'Stop' : 'Listen'}
      >
        <SpeakerIcon size={iconSize} />
        {variant === 'labeled' && (
          <span className="speak-btn__label">{isPlaying ? 'Durdu' : 'Dinle'}</span>
        )}
      </button>
    </span>
  );
}

SpeakButton.displayName = 'SpeakButton';
