import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Music, Volume2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Badge, ProgressBar } from '../ui';
import type { PhonicsSong } from '../../data/phonicsSongs';
import {
  playFrequencyArray,
  playNurseryMelody,
  stopMelody,
  startBackgroundRhythm,
  stopBackgroundRhythm,
} from '../../utils/melodyPlayer';

// ─── Types ─────────────────────────────────────────────────────────────────

interface SongPlayerProps {
  song: PhonicsSong;
  mode?: 'listen' | 'singalong';
  onComplete: () => void;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function speak(text: string, rate = 0.85, pitch = 1.1) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    utter.pitch = pitch;
    return new Promise<void>((resolve) => {
      utter.onend = () => resolve();
      utter.onerror = () => resolve();
      window.speechSynthesis.speak(utter);
    });
  }
  return Promise.resolve();
}

function highlightSoundsInText(text: string, sounds: string[]): React.ReactNode[] {
  if (sounds.length === 0) return [text];

  const lowerText = text.toLowerCase();
  const result: React.ReactNode[] = [];
  let lastIdx = 0;

  // Find all positions of highlighted sounds
  const positions: { start: number; end: number }[] = [];

  for (const sound of sounds) {
    const lowerSound = sound.toLowerCase();
    let searchFrom = 0;
    while (searchFrom < lowerText.length) {
      const idx = lowerText.indexOf(lowerSound, searchFrom);
      if (idx === -1) break;
      // Only highlight if it's part of a word (not in punctuation context)
      positions.push({ start: idx, end: idx + lowerSound.length });
      searchFrom = idx + 1;
    }
  }

  // Sort positions and remove overlaps
  positions.sort((a, b) => a.start - b.start);
  const merged: { start: number; end: number }[] = [];
  for (const pos of positions) {
    if (merged.length > 0 && pos.start < merged[merged.length - 1].end) {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, pos.end);
    } else {
      merged.push({ ...pos });
    }
  }

  for (let i = 0; i < merged.length; i++) {
    const pos = merged[i];
    if (pos.start > lastIdx) {
      result.push(text.slice(lastIdx, pos.start));
    }
    result.push(
      <span
        key={`hl-${i}`}
        style={{
          color: '#E8A317',
          fontWeight: 800,
          textDecoration: 'underline',
          textDecorationStyle: 'wavy',
          textUnderlineOffset: '4px',
        }}
      >
        {text.slice(pos.start, pos.end)}
      </span>
    );
    lastIdx = pos.end;
  }

  if (lastIdx < text.length) {
    result.push(text.slice(lastIdx));
  }

  return result;
}

// ─── Floating Notes Animation ──────────────────────────────────────────────

// Deterministic offsets so renders are stable (no Math.random() at render time)
const NOTE_OFFSETS = [-120, 80, -60, 140, -100, 50, -30, 110];
const NOTE_DURATIONS = [4, 6, 5, 4.5, 7, 5.5, 4, 6.5];
const NOTE_COLORS = ['#E8A317', '#1A6B5A', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#E8A317', '#1A6B5A'];

function FloatingNotes() {
  const notes = ['\u{266A}', '\u{266B}', '\u{266C}', '\u{2669}'];
  return (
    <div style={floatingStyles.container}>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{
            x: NOTE_OFFSETS[i],
            y: 60,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: -200,
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1.2, 0.8],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: NOTE_DURATIONS[i],
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
          style={{
            ...floatingStyles.note,
            left: `${10 + i * 12}%`,
            color: NOTE_COLORS[i],
          }}
        >
          {notes[i % notes.length]}
        </motion.span>
      ))}
    </div>
  );
}

const floatingStyles: Record<string, React.CSSProperties> = {
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    pointerEvents: 'none',
    zIndex: 0,
  },
  note: {
    position: 'absolute',
    fontSize: '1.5rem',
    bottom: 0,
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export function SongPlayer({ song, mode = 'singalong', onComplete }: SongPlayerProps) {
  const [currentLineIdx, setCurrentLineIdx] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [melodyEnabled, setMelodyEnabled] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const elapsedBeforePauseRef = useRef<number>(0);
  const isSpeakingRef = useRef(false);

  const totalDuration = song.lyrics.reduce(
    (max, line) => Math.max(max, line.startMs + line.durationMs),
    0,
  );

  // Progress percentage
  const currentLine = currentLineIdx >= 0 ? song.lyrics[currentLineIdx] : null;
  const progressMs = currentLine
    ? currentLine.startMs + currentLine.durationMs
    : 0;
  const progressPct = totalDuration > 0 ? Math.min((progressMs / totalDuration) * 100, 100) : 0;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
      stopMelody();
    };
  }, []);

  const speakLine = useCallback(async (line: typeof song.lyrics[0]) => {
    isSpeakingRef.current = true;
    // Adjust rate/pitch based on style
    const rate = song.style === 'lullaby' ? 0.7 : song.style === 'rap' ? 1.0 : 0.85;
    const pitch = song.style === 'lullaby' ? 0.9 : song.style === 'chant' ? 1.2 : 1.1;
    await speak(line.text, rate, pitch);
    isSpeakingRef.current = false;
  }, [song]);

  const playLinemelody = useCallback(
    (line: typeof song.lyrics[0], lineIdx: number) => {
      if (!melodyEnabled) return;
      // Use the line's custom melody if available, otherwise fall back to pattern
      if (line.melody && Array.isArray(line.melody) && line.melody.length > 0) {
        // Calculate tempo so melody fits within ~60% of line duration
        const tempo = Math.max(150, Math.floor((line.durationMs * 0.6) / line.melody.length));
        playFrequencyArray(line.melody, tempo);
      } else {
        const tempoMap = { slow: 300, medium: 250, fast: 180 };
        playNurseryMelody(lineIdx, tempoMap[song.tempo]);
      }
    },
    [melodyEnabled, song],
  );

  const advanceLine = useCallback(
    (lineIdx: number) => {
      if (lineIdx >= song.lyrics.length) {
        setIsPlaying(false);
        setIsFinished(true);
        stopBackgroundRhythm();
        return;
      }

      setCurrentLineIdx(lineIdx);
      const line = song.lyrics[lineIdx];

      // Show action prompt if exists
      if (line.actions) {
        setShowAction(true);
        setTimeout(() => setShowAction(false), 2500);
      }

      // Play melody for this line
      playLinemelody(line, lineIdx);

      // In listen mode, TTS reads the line
      if (mode === 'listen') {
        speakLine(line);
      }

      // Schedule next line
      const nextIdx = lineIdx + 1;
      if (nextIdx < song.lyrics.length) {
        const delay = song.lyrics[nextIdx].startMs - line.startMs;
        timerRef.current = setTimeout(() => advanceLine(nextIdx), delay);
      } else {
        // Last line — wait for duration then finish
        timerRef.current = setTimeout(() => {
          setIsPlaying(false);
          setIsFinished(true);
          stopBackgroundRhythm();
        }, line.durationMs);
      }
    },
    [song.lyrics, mode, speakLine, playLinemelody],
  );

  const handlePlay = useCallback(() => {
    if (isFinished) {
      // Restart
      setIsFinished(false);
      setCurrentLineIdx(-1);
      elapsedBeforePauseRef.current = 0;
    }

    setIsPlaying(true);
    startTimeRef.current = Date.now();

    // Start background rhythm if melody is enabled
    if (melodyEnabled) {
      startBackgroundRhythm(60);
    }

    // Start from the beginning or current position
    const startIdx = currentLineIdx < 0 ? 0 : currentLineIdx;
    advanceLine(startIdx);
  }, [isFinished, currentLineIdx, advanceLine, melodyEnabled]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    stopMelody();
    elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
  }, []);

  const handleRestart = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    stopMelody();
    setCurrentLineIdx(-1);
    setIsPlaying(false);
    setIsFinished(false);
    elapsedBeforePauseRef.current = 0;
  }, []);

  const handleRepeatLine = useCallback(() => {
    if (currentLine) {
      speak(currentLine.text, 0.75, 1.0);
    }
  }, [currentLine]);

  const handlePrevLine = useCallback(() => {
    if (currentLineIdx > 0) {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
      const newIdx = currentLineIdx - 1;
      setCurrentLineIdx(newIdx);
      if (isPlaying) {
        advanceLine(newIdx);
      }
    }
  }, [currentLineIdx, isPlaying, advanceLine]);

  const handleNextLine = useCallback(() => {
    if (currentLineIdx < song.lyrics.length - 1) {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.speechSynthesis?.cancel();
      const newIdx = currentLineIdx + 1;
      setCurrentLineIdx(newIdx);
      if (isPlaying) {
        advanceLine(newIdx);
      }
    }
  }, [currentLineIdx, song.lyrics.length, isPlaying, advanceLine]);

  // ── Finished state ──
  if (isFinished) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.container}
      >
        <FloatingNotes />
        <div style={{ ...styles.content, position: 'relative', zIndex: 1 }}>
          <motion.span
            animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ fontSize: '5rem', display: 'block', textAlign: 'center' }}
          >
            {'\u{1F389}'}
          </motion.span>

          <h2 style={styles.celebrateTitle}>Great singing!</h2>
          <p style={styles.celebrateSub}>
            You finished &quot;{song.title}&quot;
          </p>

          <Badge variant="success" icon={<Music size={14} />}>
            +25 XP earned!
          </Badge>

          <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column', width: '100%', maxWidth: 300 }}>
            <Button
              variant="secondary"
              size="lg"
              icon={<RotateCcw size={18} />}
              onClick={handleRestart}
              fullWidth
            >
              Sing Again
            </Button>
            <Button
              variant="primary"
              size="lg"
              onClick={onComplete}
              fullWidth
              style={{ backgroundColor: 'var(--secondary, #1A6B5A)', borderColor: 'var(--secondary, #1A6B5A)' }}
            >
              Continue
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Main player ──
  return (
    <div style={styles.container}>
      <FloatingNotes />

      <div style={{ ...styles.content, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: 'var(--text-on-primary, #fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>{song.title.charAt(0).toUpperCase()}</div>
          <div>
            <h2 style={styles.title}>{song.title}</h2>
            <p style={styles.subtitle}>{song.titleTr}</p>
          </div>
          <Badge variant="info">Group {song.groupNumber}</Badge>
        </div>

        {/* Mode indicator */}
        <div style={styles.modeTag}>
          {mode === 'listen' ? '\u{1F3A7} Listen Mode' : '\u{1F3A4} Sing Along!'}
        </div>

        {/* Progress */}
        <div style={{ width: '100%' }}>
          <ProgressBar
            value={progressPct}
            variant={isPlaying ? 'success' : 'default'}
            size="sm"
            animated={isPlaying}
          />
          <div style={styles.lineCounter}>
            {currentLineIdx >= 0
              ? `${currentLineIdx + 1} / ${song.lyrics.length}`
              : `0 / ${song.lyrics.length}`}
          </div>
        </div>

        {/* Lyrics display */}
        <div style={styles.lyricsArea}>
          <AnimatePresence mode="wait">
            {currentLine ? (
              <motion.div
                key={currentLineIdx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.3 }}
                style={styles.lyricLine}
              >
                <motion.p
                  style={styles.lyricText}
                  animate={isPlaying ? { scale: [1, 1.02, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  {highlightSoundsInText(currentLine.text, currentLine.highlightSounds)}
                </motion.p>
                <p style={styles.lyricTr}>{currentLine.textTr}</p>
              </motion.div>
            ) : (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.lyricLine}
              >
                <p style={{ ...styles.lyricText, color: 'var(--text-muted, #999)' }}>
                  {isPlaying ? 'Get ready...' : 'Press play to start!'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action prompt */}
        <AnimatePresence>
          {showAction && currentLine?.actions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -10 }}
              style={styles.actionPrompt}
            >
              <span style={{ fontSize: '1.5rem' }}>{'\u{1F44F}'}</span>
              <span>{currentLine.actions}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div style={styles.controls}>
          <button
            type="button"
            onClick={handlePrevLine}
            disabled={currentLineIdx <= 0}
            style={styles.controlBtn}
            aria-label="Previous line"
          >
            <ChevronLeft size={20} />
          </button>

          {isPlaying ? (
            <button
              type="button"
              onClick={handlePause}
              style={styles.playBtn}
              aria-label="Pause"
            >
              <Pause size={28} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePlay}
              style={styles.playBtn}
              aria-label="Play"
            >
              <Play size={28} style={{ marginLeft: 3 }} />
            </button>
          )}

          <button
            type="button"
            onClick={handleNextLine}
            disabled={currentLineIdx >= song.lyrics.length - 1}
            style={styles.controlBtn}
            aria-label="Next line"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Secondary controls */}
        <div style={styles.secondaryControls}>
          <Button
            variant="secondary"
            size="sm"
            icon={<RotateCcw size={14} />}
            onClick={handleRestart}
          >
            Restart
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Volume2 size={14} />}
            onClick={handleRepeatLine}
            disabled={!currentLine}
          >
            Repeat Line
          </Button>
          <Button
            variant={melodyEnabled ? 'primary' : 'secondary'}
            size="sm"
            icon={<Music size={14} />}
            onClick={() => {
              setMelodyEnabled((prev) => {
                if (prev) {
                  stopMelody();
                } else if (isPlaying) {
                  startBackgroundRhythm(60);
                }
                return !prev;
              });
            }}
            style={melodyEnabled ? { backgroundColor: '#E8A317', borderColor: '#E8A317' } : undefined}
          >
            {'\uD83C\uDFB5'} Music
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
    background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(14,165,233,0.08) 50%, rgba(245,158,11,0.08) 100%)',
    borderRadius: '1.5rem',
    overflow: 'hidden',
    fontFamily: 'Nunito, sans-serif',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    width: '100%',
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: '#888',
    margin: 0,
    fontStyle: 'italic',
  },
  modeTag: {
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#E8A317',
    backgroundColor: 'rgba(232,163,23,0.12)',
    padding: '0.3rem 1rem',
    borderRadius: '2rem',
  },
  lineCounter: {
    fontSize: '0.75rem',
    color: '#999',
    textAlign: 'center' as const,
    marginTop: '0.25rem',
  },
  lyricsArea: {
    width: '100%',
    minHeight: 120,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lyricLine: {
    textAlign: 'center' as const,
    width: '100%',
  },
  lyricText: {
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#1A6B5A',
    lineHeight: 1.5,
    margin: '0 0 0.5rem 0',
  },
  lyricTr: {
    fontSize: '0.85rem',
    color: '#888',
    fontStyle: 'italic',
    margin: 0,
  },
  actionPrompt: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.6rem 1rem',
    background: 'rgba(232,163,23,0.12)',
    borderRadius: '1rem',
    border: '2px solid #E8A317',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#92400e',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    border: '3px solid #1A6B5A',
    backgroundColor: '#1A6B5A',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(26, 107, 90, 0.3)',
    transition: 'transform 0.15s',
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '2px solid #d1d5db',
    backgroundColor: '#F8F9FA',
    color: '#555',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s',
  },
  secondaryControls: {
    display: 'flex',
    gap: '0.5rem',
  },
  celebrateTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
    textAlign: 'center' as const,
  },
  celebrateSub: {
    fontSize: '1rem',
    color: '#666',
    margin: 0,
    textAlign: 'center' as const,
  },
};

export default SongPlayer;
