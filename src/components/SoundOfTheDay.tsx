import { useState, useCallback } from 'react';
import { Volume2 } from 'lucide-react';
import { speak } from '../services/ttsService';
import { SFX } from '../data/soundLibrary';
import { PHONICS_GROUPS } from '../data/phonics';
import './SoundOfTheDay.css';

// ─── Types ──────────────────────────────────────────────────────────────────

interface SoundOfTheDayProps {
  /** Label shown above the widget. Defaults to "Sound of the Day". */
  label?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Collect all phonics sounds across all groups */
function getAllSounds() {
  return PHONICS_GROUPS.flatMap((g) => g.sounds);
}

/** Pick today's featured sound (rotates daily using day-of-year) */
function getTodaySound() {
  const allSounds = getAllSounds();
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000,
  );
  return allSounds[dayOfYear % allSounds.length];
}

/**
 * Highlight the target grapheme inside a word by wrapping it in a span.
 * Returns segments: { text, isTarget }[]
 */
function segmentWord(word: string, grapheme: string): { text: string; isTarget: boolean }[] {
  const lower = word.toLowerCase();
  const target = grapheme.toLowerCase();
  const idx = lower.indexOf(target);
  if (idx === -1) return [{ text: word, isTarget: false }];
  return [
    { text: word.slice(0, idx), isTarget: false },
    { text: word.slice(idx, idx + target.length), isTarget: true },
    { text: word.slice(idx + target.length), isTarget: false },
  ];
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function SoundOfTheDay({ label = 'Sound of the Day' }: SoundOfTheDayProps) {
  const todaySound = getTodaySound();
  const [isPlaying, setIsPlaying] = useState(false);

  // Speak the sound three times
  const handlePlay = useCallback(async () => {
    if (isPlaying) return;
    SFX.click();
    setIsPlaying(true);
    for (let i = 0; i < 3; i++) {
      await speak(todaySound.sound, { lang: 'en-US', rate: 0.7, pitch: 1.15 });
      // Small pause between repetitions
      await new Promise<void>((res) => setTimeout(res, 350));
    }
    setIsPlaying(false);
  }, [isPlaying, todaySound.sound]);

  const handleWordTap = useCallback((word: string) => {
    SFX.click();
    speak(word, { lang: 'en-US', rate: 0.8, pitch: 1.1 });
  }, []);

  const exampleWords = todaySound.keywords.slice(0, 3);

  return (
    <div className="sotd-card">
      <span className="sotd-label">{label}</span>

      <div className="sotd-main">
        {/* Sound badge — tap to hear */}
        <div
          className={`sotd-sound-badge${isPlaying ? ' playing' : ''}`}
          onClick={handlePlay}
          role="button"
          aria-label={`Hear the sound: ${todaySound.grapheme}`}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handlePlay(); }}
        >
          {todaySound.grapheme}
        </div>

        <div className="sotd-info">
          <p className="sotd-sound-name">/{todaySound.ipa}/</p>
          <p className="sotd-action">
            {todaySound.action.length > 55
              ? `${todaySound.action.slice(0, 55)}…`
              : todaySound.action}
          </p>
        </div>

        {/* Play button */}
        <button
          type="button"
          className="sotd-play-btn"
          onClick={handlePlay}
          aria-label="Listen to sound"
          disabled={isPlaying}
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Example words */}
      <div className="sotd-words">
        {exampleWords.map((word) => {
          const segments = segmentWord(word, todaySound.grapheme);
          return (
            <button
              key={word}
              type="button"
              className="sotd-word-chip"
              onClick={() => handleWordTap(word)}
              aria-label={`Listen to word: ${word}`}
            >
              {segments.map((seg, i) =>
                seg.isTarget ? (
                  <span key={i} className="highlight">{seg.text}</span>
                ) : (
                  <span key={i}>{seg.text}</span>
                ),
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
