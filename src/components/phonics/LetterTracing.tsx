import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, ArrowRight, Volume2 } from 'lucide-react';
import { Button, Badge } from '../ui';
import { LETTER_PATHS } from '../../data/letterPaths';
import { SFX } from '../../data/soundLibrary';

// ─── Types ─────────────────────────────────────────────────────────────────

export interface LetterTracingProps {
  letter: string;
  onComplete: (accuracy: number) => void;
  showGuide?: boolean;
  difficulty?: 'guided' | 'assisted' | 'free';
}

interface Point {
  x: number;
  y: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────

const CANVAS_SIZE = 300;
const LINE_WIDTH = 8;
const HIT_RADIUS = 30;

function speak(text: string, rate = 0.75) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }
}

/**
 * Speak the phoneme sound, not the letter name.
 * Vowels get a phonetic hint word so TTS produces the short vowel sound.
 */
function speakPhoneme(letter: string) {
  const lower = letter.toLowerCase();
  const VOWEL_PHONETIC: Record<string, string> = {
    a: 'a as in apple',
    e: 'e as in egg',
    i: 'i as in igloo',
    o: 'o as in orange',
    u: 'u as in umbrella',
  };
  const text = VOWEL_PHONETIC[lower] ?? `${lower}${lower}${lower}`;
  speak(text, 0.5);
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function toCanvasCoords(normalized: [number, number]): Point {
  return { x: normalized[0] * CANVAS_SIZE, y: normalized[1] * CANVAS_SIZE };
}

// ─── Component ─────────────────────────────────────────────────────────────

export function LetterTracing({
  letter,
  onComplete,
  showGuide = true,
  difficulty = 'guided',
}: LetterTracingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [hitCheckpoints, setHitCheckpoints] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<{ accuracy: number; message: string; color: string } | null>(null);
  const [canvasScale, setCanvasScale] = useState(1);

  const letterKey = letter.toLowerCase();
  const pathData = LETTER_PATHS[letterKey];
  const guideDots = useMemo(() => pathData?.guideDots ?? [], [pathData]);

  // Speak the phoneme sound on mount
  useEffect(() => {
    speakPhoneme(letter);
  }, [letter]);

  // Measure container for responsive scaling
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const scale = Math.min(width / CANVAS_SIZE, 1.5);
        setCanvasScale(scale);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // ── Drawing functions ──

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw the letter as a large ghost guide (very light so child traces on top)
    ctx.save();
    ctx.font = 'bold 220px Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#334155';
    ctx.fillText(letterKey, CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 10);
    ctx.globalAlpha = 1;
    ctx.restore();

    // Draw guide dots based on difficulty
    if (pathData && (difficulty === 'guided' || (difficulty === 'assisted' && showGuide))) {
      const dots = guideDots;
      for (let i = 0; i < dots.length; i++) {
        const pt = toCanvasCoords(dots[i]);
        const isHit = hitCheckpoints.has(i);

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isHit ? 6 : 5, 0, Math.PI * 2);
        ctx.fillStyle = isHit ? '#22c55e' : '#c0c0c0';
        ctx.fill();

        if (difficulty === 'guided' && !isHit) {
          // Dotted circle indicator
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, HIT_RADIUS, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      }

      // Start point (green dot)
      if (dots.length > 0) {
        const start = toCanvasCoords(dots[0]);
        ctx.beginPath();
        ctx.arc(start.x, start.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = hitCheckpoints.has(0) ? '#16a34a' : '#22c55e';
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Direction arrows for assisted mode
      if (difficulty === 'assisted' && dots.length > 1) {
        const first = toCanvasCoords(dots[0]);
        const second = toCanvasCoords(dots[1]);
        const angle = Math.atan2(second.y - first.y, second.x - first.x);
        ctx.save();
        ctx.translate(first.x + Math.cos(angle) * 25, first.y + Math.sin(angle) * 25);
        ctx.rotate(angle);
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(8, 0);
        ctx.lineTo(-4, -5);
        ctx.lineTo(-4, 5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    // Draw the user's traced path
    if (drawnPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      for (let i = 1; i < drawnPoints.length; i++) {
        const prev = drawnPoints[i - 1];
        const curr = drawnPoints[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      const last = drawnPoints[drawnPoints.length - 1];
      ctx.lineTo(last.x, last.y);

      const accuracy = guideDots.length > 0 ? (hitCheckpoints.size / guideDots.length) * 100 : 0;
      ctx.strokeStyle = result
        ? result.color
        : accuracy >= 70
          ? '#22c55e'
          : '#E8A317';
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [drawnPoints, hitCheckpoints, pathData, guideDots, difficulty, showGuide, letterKey, result]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // ── Event handlers ──

  function getCanvasPoint(e: React.MouseEvent | React.TouchEvent): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_SIZE / rect.width;
    const scaleY = CANVAS_SIZE / rect.height;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }

  function checkHits(point: Point) {
    const newHits = new Set(hitCheckpoints);
    for (let i = 0; i < guideDots.length; i++) {
      if (newHits.has(i)) continue;
      const dotPt = toCanvasCoords(guideDots[i]);
      if (dist(point, dotPt) <= HIT_RADIUS) {
        newHits.add(i);
      }
    }
    if (newHits.size !== hitCheckpoints.size) {
      setHitCheckpoints(newHits);
    }
  }

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    if (result) return;
    // Multi-touch guard: ignore pinch/zoom gestures
    if ('touches' in e && e.touches.length > 1) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (!pt) return;
    setIsDrawing(true);
    setDrawnPoints([pt]);
    checkHits(pt);
  }

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || result) return;
    // Multi-touch guard: if a second finger appears mid-stroke, stop drawing
    if ('touches' in e && e.touches.length > 1) return;
    e.preventDefault();
    const pt = getCanvasPoint(e);
    if (!pt) return;
    setDrawnPoints((prev) => [...prev, pt]);
    checkHits(pt);
  }

  function handleEnd() {
    if (!isDrawing) return;
    setIsDrawing(false);
    evaluateTrace();
  }

  function evaluateTrace() {
    if (guideDots.length === 0) {
      // No path data for this letter, give full marks
      setResult({ accuracy: 100, message: 'Great job!', color: '#22c55e' });
      SFX.correct();
      speak(letter, 0.5);
      onComplete(100);
      return;
    }

    const accuracy = Math.round((hitCheckpoints.size / guideDots.length) * 100);

    if (accuracy >= 70) {
      setResult({ accuracy, message: 'Great job!', color: '#22c55e' });
      SFX.correct();
      speakPhoneme(letter);
    } else if (accuracy >= 40) {
      setResult({ accuracy, message: 'Good try! Let\'s practice more!', color: '#E8A317' });
    } else {
      setResult({ accuracy, message: 'Let\'s try again!', color: '#ef4444' });
    }

    // onComplete is called via the "Next Letter" button, not here
  }

  function handleReset() {
    setDrawnPoints([]);
    setHitCheckpoints(new Set());
    setResult(null);
  }

  // ─── Render ──────────────────────────────────────────────────────────

  return (
    <div style={styles.wrapper}>
      <div style={styles.letterLabel}>
        <button type="button" onClick={() => speakPhoneme(letter)} style={styles.soundBtn} aria-label={`Hear phoneme sound for ${letter}`}>
          <Volume2 size={18} />
        </button>
        {/* Show both uppercase and lowercase so children learn both letter forms */}
        <span style={styles.letterText}>
          {letter.toUpperCase()} / {letter.toLowerCase()}
        </span>
      </div>

      <div ref={containerRef} style={styles.canvasContainer}>
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          style={{
            ...styles.canvas,
            width: CANVAS_SIZE * canvasScale,
            height: CANVAS_SIZE * canvasScale,
            touchAction: 'none',
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
      </div>

      {/* Progress dots */}
      <div style={styles.progressRow}>
        {guideDots.map((_, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: hitCheckpoints.has(i) ? '#22c55e' : '#d1d5db',
              transition: 'background-color 0.2s',
            }}
          />
        ))}
      </div>

      {/* Result feedback */}
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={styles.resultBox}
        >
          <Badge variant={result.accuracy >= 70 ? 'success' : result.accuracy >= 40 ? 'warning' : 'error'}>
            {result.accuracy}% accuracy
          </Badge>
          <p style={{ ...styles.resultMessage, color: result.color }}>{result.message}</p>
        </motion.div>
      )}

      {/* Actions */}
      <div style={styles.actions}>
        <Button
          variant="secondary"
          size="lg"
          icon={<RotateCcw size={18} />}
          onClick={handleReset}
        >
          Try Again
        </Button>
        {result && result.accuracy >= 40 && (
          <Button
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            onClick={() => onComplete(result.accuracy)}
            style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
          >
            Next Letter
          </Button>
        )}
      </div>
    </div>
  );
}

LetterTracing.displayName = 'LetterTracing';

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    padding: '0.5rem',
    width: '100%',
  },
  letterLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  letterText: {
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    fontFamily: 'Nunito, sans-serif',
  },
  soundBtn: {
    background: 'none',
    border: '2px solid #1A6B5A',
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#1A6B5A',
  },
  canvasContainer: {
    width: '100%',
    maxWidth: 450,
    display: 'flex',
    justifyContent: 'center',
  },
  canvas: {
    border: '3px solid #e0e0e0',
    borderRadius: '1rem',
    backgroundColor: '#fafafa',
    cursor: 'crosshair',
  },
  progressRow: {
    display: 'flex',
    gap: '4px',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
  resultBox: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
  },
  resultMessage: {
    fontSize: '1.1rem',
    fontWeight: 700,
    margin: 0,
    fontFamily: 'Nunito, sans-serif',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap' as const,
  },
};
