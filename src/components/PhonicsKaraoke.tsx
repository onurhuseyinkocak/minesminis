import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { speak } from '../services/ttsService';
import { SFX } from '../data/soundLibrary';
import { useLanguage } from '../contexts/LanguageContext';
import type { PhonicsLyrics, SongLine } from '../data/phonicsSongLyrics';
import './PhonicsKaraoke.css';

// ─── Types ─────────────────────────────────────────────────────────────────

interface PhonicsKaraokeProps {
  lyrics: PhonicsLyrics;
  onComplete?: () => void;
}

// ─── Sound-to-color palette (7 distinct per group sound) ───────────────────

const SOUND_COLORS: string[] = [
  '#FF6B35', // orange
  '#7C3AED', // violet
  '#22C55E', // green
  '#3B82F6', // blue
  '#F59E0B', // amber
  '#EC4899', // pink
  '#14B8A6', // teal
];

function getSoundColor(sound: string, targetSounds: string[]): string {
  const idx = targetSounds.indexOf(sound.toLowerCase());
  if (idx >= 0) return SOUND_COLORS[idx % SOUND_COLORS.length];
  // fuzzy: check if any targetSound appears inside the word
  const lower = sound.toLowerCase();
  for (let i = 0; i < targetSounds.length; i++) {
    if (lower.includes(targetSounds[i])) {
      return SOUND_COLORS[i % SOUND_COLORS.length];
    }
  }
  return '#10b981';
}

// ─── Word renderer ──────────────────────────────────────────────────────────

function renderLineWords(
  line: SongLine,
  targetSounds: string[],
  isCurrent: boolean,
  onTap: (word: string) => void,
): React.ReactNode {
  const words = line.text.split(' ');
  return words.map((word, idx) => {
    const clean = word.toLowerCase().replace(/[^a-z]/g, '');
    const isHighlighted =
      line.highlightWords.some(
        (hw) => hw.toLowerCase() === word.toLowerCase() || hw.toLowerCase() === clean,
      );

    if (!isHighlighted) {
      return (
        <span key={idx} className="karaoke-word">
          {word}{' '}
        </span>
      );
    }

    // Determine the matched sound for coloring
    const color = getSoundColor(clean, targetSounds);
    const bg = `${color}22`; // 13% opacity background

    return (
      <span
        key={idx}
        className={`karaoke-word highlighted${isCurrent ? ' tappable glowing' : ''}`}
        style={{
          color,
          background: isCurrent ? bg : 'transparent',
          boxShadow: isCurrent ? `inset 0 0 0 1.5px ${color}44` : 'none',
        }}
        onClick={() => {
          if (isCurrent) onTap(word);
        }}
      >
        {word}
        {' '}
      </span>
    );
  });
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function PhonicsKaraoke({ lyrics, onComplete }: PhonicsKaraokeProps) {
  const { lang } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [speed, setSpeed] = useState<0.75 | 1>(1);
  const [showFullLyrics, setShowFullLyrics] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const elapsedRef = useRef(0); // track without triggering re-renders every tick
  const tickMs = 100; // interval granularity

  // Total duration = last line's endMs
  const totalMs = lyrics.lines[lyrics.lines.length - 1]?.endMs ?? 60000;

  // Current line index
  const currentLineIdx = lyrics.lines.findIndex(
    (line) => elapsedMs >= line.startMs && elapsedMs < line.endMs,
  );

  // ── Playback engine ──
  const stopInterval = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startInterval = useCallback(() => {
    stopInterval();
    intervalRef.current = setInterval(() => {
      elapsedRef.current += tickMs * speed;
      setElapsedMs(elapsedRef.current);

      if (elapsedRef.current >= totalMs) {
        stopInterval();
        setIsPlaying(false);
        setIsComplete(true);
        SFX.correct();
        onComplete?.();
      }
    }, tickMs);
  }, [stopInterval, speed, totalMs, onComplete]);

  // Restart when speed changes mid-play
  useEffect(() => {
    if (isPlaying) {
      startInterval();
    }
    return stopInterval;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speed]);

  // Cleanup on unmount
  useEffect(() => () => stopInterval(), [stopInterval]);

  // Read current line aloud via TTS when it changes
  const prevLineIdxRef = useRef(-1);
  useEffect(() => {
    if (currentLineIdx !== -1 && currentLineIdx !== prevLineIdxRef.current && isPlaying) {
      prevLineIdxRef.current = currentLineIdx;
      const line = lyrics.lines[currentLineIdx];
      const text = lang === 'tr' ? line.textTr : line.text;
      speak(text, { rate: speed * 0.85, pitch: 1.1 });
    }
  }, [currentLineIdx, isPlaying, lyrics.lines, lang, speed]);

  // ── Handlers ──
  const handlePlayPause = () => {
    SFX.click();
    if (isComplete) return;
    if (isPlaying) {
      stopInterval();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      startInterval();
    }
  };

  const handleReplay = () => {
    SFX.click();
    stopInterval();
    elapsedRef.current = 0;
    setElapsedMs(0);
    setIsComplete(false);
    setIsPlaying(false);
    prevLineIdxRef.current = -1;
  };

  const handleWordTap = (word: string) => {
    SFX.click();
    speak(word, { rate: 0.7, pitch: 1.2 });
  };

  // ── Derived ──
  const progress = Math.min(elapsedMs / totalMs, 1);

  // Lines visible in the display window: 1 past + current + 2 upcoming
  const displayStart = Math.max(0, currentLineIdx - 1);
  const displayEnd = Math.min(lyrics.lines.length, currentLineIdx + 3);
  const visibleLines = lyrics.lines.slice(displayStart, displayEnd);

  return (
    <div className="karaoke-wrapper">
      {/* Progress bar */}
      <div className="karaoke-progress-track">
        <div
          className="karaoke-progress-fill"
          style={{ width: `${progress * 100}%` }}
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      {/* Header */}
      <div className="karaoke-header">
        <div style={{ flex: 1 }}>
          <p className="karaoke-title">{lyrics.title}</p>
          <p className="karaoke-title-tr">{lyrics.titleTr}</p>
          {/* Sound chips */}
          <div className="karaoke-sound-chips">
            {lyrics.targetSounds.map((sound, i) => {
              const color = SOUND_COLORS[i % SOUND_COLORS.length];
              const isActive =
                currentLineIdx >= 0 &&
                lyrics.lines[currentLineIdx].highlightWords.some((hw) =>
                  hw.toLowerCase().includes(sound.toLowerCase()),
                );
              return (
                <span
                  key={sound}
                  className={`karaoke-sound-chip${isActive ? ' active' : ''}`}
                  style={{ background: color }}
                  onClick={() => {
                    SFX.click();
                    speak(sound, { rate: 0.7, pitch: 1.2 });
                  }}
                >
                  {sound}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lyrics display */}
      {!isComplete ? (
        <div className="karaoke-lyrics-area" aria-live="polite">
          {visibleLines.map((line) => {
            const realIdx = lyrics.lines.indexOf(line);
            let lineClass = 'upcoming';
            if (realIdx < currentLineIdx) lineClass = 'past';
            else if (realIdx === currentLineIdx) lineClass = 'current';

            return (
              <div key={realIdx} className={`karaoke-line ${lineClass}`}>
                <span>
                  {renderLineWords(
                    line,
                    lyrics.targetSounds,
                    lineClass === 'current',
                    handleWordTap,
                  )}
                </span>
                {lineClass === 'current' && (
                  <span className="karaoke-line-tr">{line.textTr}</span>
                )}
              </div>
            );
          })}

          {currentLineIdx === -1 && elapsedMs === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--text-muted, #9ca3af)', margin: 0 }}>
              Press play to start singing!
            </p>
          )}
        </div>
      ) : (
        <div className="karaoke-complete-banner">
          <h3>Amazing singing!</h3>
          <p>You completed the whole song!</p>
          <span className="karaoke-xp-badge">+15 XP earned</span>
        </div>
      )}

      {/* Controls */}
      <div className="karaoke-controls">
        {/* Replay */}
        <button
          type="button"
          className="karaoke-btn secondary"
          onClick={handleReplay}
          aria-label="Replay song"
        >
          <RotateCcw size={18} />
        </button>

        {/* Play / Pause */}
        <button
          type="button"
          className="karaoke-btn primary"
          onClick={handlePlayPause}
          disabled={isComplete}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={22} /> : <Play size={22} />}
        </button>

        {/* Speed control */}
        <div className="karaoke-speed-group" role="group" aria-label="Playback speed">
          <button
            type="button"
            className={`karaoke-speed-btn${speed === 0.75 ? ' active' : ''}`}
            onClick={() => setSpeed(0.75)}
          >
            0.75x
          </button>
          <button
            type="button"
            className={`karaoke-speed-btn${speed === 1 ? ' active' : ''}`}
            onClick={() => setSpeed(1)}
          >
            1x
          </button>
        </div>
      </div>

      {/* Lyrics toggle */}
      <button
        type="button"
        className="karaoke-lyrics-toggle"
        onClick={() => {
          SFX.click();
          setShowFullLyrics((v) => !v);
        }}
        aria-expanded={showFullLyrics}
      >
        {showFullLyrics ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        {showFullLyrics ? 'Hide Lyrics' : 'Show All Lyrics'}
      </button>

      {/* Full lyrics panel */}
      {showFullLyrics && (
        <div className="karaoke-full-lyrics">
          {lyrics.lines.map((line, idx) => (
            <div
              key={idx}
              className={`karaoke-full-line${idx === currentLineIdx ? ' active' : ''}`}
            >
              {lang === 'tr' ? line.textTr : line.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
