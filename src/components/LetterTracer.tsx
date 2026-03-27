/**
 * LetterTracer — Canvas-based Montessori letter tracing component.
 * Features: guide letter, stroke-order arrows, accuracy scoring,
 * "Show me" animation, touch + mouse support.
 */

import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { RotateCcw, Play, Volume2 } from 'lucide-react';
import { LETTER_PATHS } from '../data/letterPaths';
import { SFX } from '../data/soundLibrary';
import { useLanguage } from '../contexts/LanguageContext';
import './LetterTracer.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface LetterTracerProps {
  letter: string;
  size?: number;
  onComplete?: (accuracy: number) => void;
  showGuide?: boolean;
  strokeColor?: string;
}

interface Point {
  x: number;
  y: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_SIZE = 300;
const LINE_WIDTH = 8;
const HIT_RADIUS = 28;
const ANIMATION_STEP_MS = 18;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toCanvas(normalized: [number, number], size: number): Point {
  return { x: normalized[0] * size, y: normalized[1] * size };
}

function dist(a: Point, b: Point): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function speak(text: string) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.6;
    window.speechSynthesis.speak(u);
  }
}

/**
 * Speak the phoneme (isolated sound) rather than the letter name.
 * Repeating a single letter 3x helps TTS engines produce the phoneme sound
 * rather than the letter name (e.g. "sss" vs "ess").
 */
function speakPhoneme(letter: string) {
  const lower = letter.toLowerCase();
  // Vowels need careful handling — single vowel produces letter name from TTS
  // Use phonetic hint words for vowels so TTS captures the short vowel sound
  const VOWEL_PHONETIC: Record<string, string> = {
    a: 'a as in apple',
    e: 'e as in egg',
    i: 'i as in igloo',
    o: 'o as in orange',
    u: 'u as in umbrella',
  };
  const text = VOWEL_PHONETIC[lower] ?? `${lower}${lower}${lower}`;
  speak(text);
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  color: string,
) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const len = 12;
  ctx.save();
  ctx.translate(to.x, to.y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-len, -len * 0.5);
  ctx.lineTo(-len, len * 0.5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawNumberedCircle(
  ctx: CanvasRenderingContext2D,
  pt: Point,
  num: number,
  size: number,
) {
  const r = size * 0.06;
  ctx.beginPath();
  ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
  ctx.fillStyle = 'var(--primary, #FF6B35)';
  ctx.fill();
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${Math.round(r * 1.1)}px Nunito, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(num), pt.x, pt.y);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LetterTracer({
  letter,
  size = DEFAULT_SIZE,
  onComplete,
  showGuide = true,
  strokeColor,
}: LetterTracerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const animTimerRef = useRef<number | null>(null);

  const { t } = useLanguage();

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnPoints, setDrawnPoints] = useState<Point[]>([]);
  const [hitSet, setHitSet] = useState<Set<number>>(new Set());
  const [result, setResult] = useState<{ accuracy: number; pass: boolean } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animPoints, setAnimPoints] = useState<Point[]>([]);
  const [canvasScale, setCanvasScale] = useState(1);

  const letterKey = letter.toLowerCase();
  const pathData = useMemo(() => LETTER_PATHS[letterKey], [letterKey]);
  const guideDots = useMemo(() => pathData?.guideDots ?? [], [pathData]);

  // ── Resolve stroke color ──
  const resolvedStrokeColor = useMemo(() => {
    if (strokeColor) return strokeColor;
    if (typeof document !== 'undefined') {
      const s = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (s) return s;
    }
    return '#FF6B35';
  }, [strokeColor]);

  // ── Responsive scaling ──
  useEffect(() => {
    function measure() {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        setCanvasScale(Math.min(w / size, 1.5));
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [size]);

  // ── Speak phoneme on mount ──
  useEffect(() => {
    speakPhoneme(letter);
  }, [letter]);

  // ── Draw canvas ──
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Guide letter (large, very light)
    ctx.save();
    ctx.font = `bold ${Math.round(size * 0.72)}px Nunito, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    ctx.fillText(letterKey, size / 2, size / 2 + size * 0.04);
    ctx.restore();

    // Guide dots + arrows (if showGuide and pathData)
    if (showGuide && pathData) {
      let globalDotIdx = 0;
      pathData.strokes.forEach((stroke, strokeIdx) => {
        const pts = stroke.points.map((p) => toCanvas(p, size));

        // Draw dashed path for this stroke
        if (pts.length > 1) {
          ctx.beginPath();
          ctx.moveTo(pts[0].x, pts[0].y);
          for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
          ctx.strokeStyle = 'rgba(0,0,0,0.12)';
          ctx.lineWidth = LINE_WIDTH * 0.6;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.setLineDash([6, 6]);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Arrow showing direction (from first to second point)
        if (pts.length >= 2) {
          drawArrowhead(ctx, pts[0], pts[1], 'rgba(0,0,0,0.28)');
        }

        // Numbered start circle for each stroke
        if (pts.length > 0) {
          drawNumberedCircle(ctx, pts[0], strokeIdx + 1, size);
        }

        // Hit indicator dots
        for (let i = 0; i < stroke.points.length; i++) {
          const isHit = hitSet.has(globalDotIdx);
          const pt = pts[i];
          if (i > 0) {
            const dotR = size * 0.018; // ~5.4px on 300px canvas — visible
            // Outer ring for unlit dots
            if (!isHit) {
              ctx.beginPath();
              ctx.arc(pt.x, pt.y, dotR + 1.5, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(0,0,0,0.06)';
              ctx.fill();
            }
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, dotR, 0, Math.PI * 2);
            ctx.fillStyle = isHit ? 'var(--success, #10B981)' : 'rgba(0,0,0,0.22)';
            ctx.fill();
          }
          globalDotIdx++;
        }
      });
    }

    // "Show me" animation path
    if (isAnimating && animPoints.length > 1) {
      ctx.beginPath();
      ctx.moveTo(animPoints[0].x, animPoints[0].y);
      for (let i = 1; i < animPoints.length; i++) {
        const prev = animPoints[i - 1];
        const curr = animPoints[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      ctx.strokeStyle = resolvedStrokeColor;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // User's drawn path
    if (drawnPoints.length > 1) {
      const accuracy = guideDots.length > 0 ? (hitSet.size / guideDots.length) * 100 : 100;
      const color = result
        ? result.pass
          ? 'var(--success, #10B981)'
          : 'var(--error, #EF4444)'
        : accuracy >= 70
          ? 'var(--success, #10B981)'
          : resolvedStrokeColor;

      ctx.beginPath();
      ctx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
      for (let i = 1; i < drawnPoints.length; i++) {
        const prev = drawnPoints[i - 1];
        const curr = drawnPoints[i];
        const mx = (prev.x + curr.x) / 2;
        const my = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, mx, my);
      }
      const last = drawnPoints[drawnPoints.length - 1];
      ctx.lineTo(last.x, last.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = LINE_WIDTH;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }, [
    size,
    letterKey,
    pathData,
    showGuide,
    guideDots,
    hitSet,
    drawnPoints,
    animPoints,
    isAnimating,
    result,
    resolvedStrokeColor,
  ]);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(draw);
    return () => {
      if (animFrameRef.current !== null) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // ── Canvas coordinate helpers ──

  function getPoint(e: React.MouseEvent | React.TouchEvent): Point | null {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = size / rect.width;
    const scaleY = size / rect.height;

    let cx: number, cy: number;
    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      cx = e.touches[0].clientX;
      cy = e.touches[0].clientY;
    } else {
      cx = e.clientX;
      cy = e.clientY;
    }
    return { x: (cx - rect.left) * scaleX, y: (cy - rect.top) * scaleY };
  }

  function checkHits(point: Point) {
    const next = new Set(hitSet);
    guideDots.forEach((dot, i) => {
      if (!next.has(i)) {
        const dp = toCanvas(dot, size);
        if (dist(point, dp) <= HIT_RADIUS) next.add(i);
      }
    });
    if (next.size !== hitSet.size) setHitSet(next);
  }

  // ── Event handlers ──

  function handleStart(e: React.MouseEvent | React.TouchEvent) {
    if (result || isAnimating) return;
    // Multi-touch guard: ignore pinch/zoom gestures
    if ('touches' in e && e.touches.length > 1) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (!pt) return;
    setIsDrawing(true);
    setDrawnPoints([pt]);
    checkHits(pt);
  }

  function handleMove(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing || result || isAnimating) return;
    // Multi-touch guard: if a second finger appears mid-stroke, stop drawing
    if ('touches' in e && e.touches.length > 1) return;
    e.preventDefault();
    const pt = getPoint(e);
    if (!pt) return;
    setDrawnPoints((prev) => [...prev, pt]);
    checkHits(pt);
  }

  function handleEnd() {
    if (!isDrawing) return;
    setIsDrawing(false);
    evaluate();
  }

  function evaluate() {
    let accuracy: number;
    if (guideDots.length === 0) {
      accuracy = 100;
    } else {
      accuracy = Math.round((hitSet.size / guideDots.length) * 100);
    }
    const pass = accuracy >= 70;
    setResult({ accuracy, pass });
    if (pass) {
      SFX.correct();
      speakPhoneme(letter);
    } else {
      SFX.wrong();
    }
    onComplete?.(accuracy);
  }

  // ── "Show me" animation ──

  function handleShowMe() {
    if (isAnimating) return;
    reset(false);
    setIsAnimating(true);

    if (!pathData) {
      setIsAnimating(false);
      return;
    }

    // Flatten all strokes into animation points, with gaps between strokes
    const allPoints: (Point | null)[] = [];
    pathData.strokes.forEach((stroke, si) => {
      if (si > 0) allPoints.push(null); // stroke separator
      stroke.points.forEach((p) => allPoints.push(toCanvas(p, size)));
    });

    // Interpolate between guide points for smoother animation
    const expanded: (Point | null)[] = [];
    for (let i = 0; i < allPoints.length; i++) {
      const curr = allPoints[i];
      if (curr === null) {
        expanded.push(null);
        continue;
      }
      const next = allPoints[i + 1];
      expanded.push(curr);
      if (next !== null && next !== undefined) {
        // Add 5 intermediate points
        for (let t = 1; t <= 5; t++) {
          expanded.push({
            x: curr.x + (next.x - curr.x) * (t / 6),
            y: curr.y + (next.y - curr.y) * (t / 6),
          });
        }
      }
    }

    let idx = 0;
    const drawn: Point[] = [];
    let lastTime = 0;

    // Use requestAnimationFrame for smooth GPU-synced animation instead of setInterval
    function tick(timestamp: number) {
      if (idx >= expanded.length) {
        animTimerRef.current = null;
        setIsAnimating(false);
        setAnimPoints([]);
        return;
      }

      if (timestamp - lastTime >= ANIMATION_STEP_MS) {
        const pt = expanded[idx];
        if (pt === null) {
          // Stroke gap — clear and restart
          drawn.length = 0;
        } else {
          drawn.push(pt);
          setAnimPoints([...drawn]);
        }
        idx++;
        lastTime = timestamp;
      }

      animTimerRef.current = requestAnimationFrame(tick);
    }

    animTimerRef.current = requestAnimationFrame(tick);
  }

  // ── Reset ──

  function reset(clearResult = true) {
    if (animTimerRef.current) {
      cancelAnimationFrame(animTimerRef.current);
      animTimerRef.current = null;
    }
    setIsDrawing(false);
    setDrawnPoints([]);
    setHitSet(new Set());
    setAnimPoints([]);
    setIsAnimating(false);
    if (clearResult) setResult(null);
  }

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (animTimerRef.current) cancelAnimationFrame(animTimerRef.current);
    };
  }, []);

  const accuracy = guideDots.length > 0 ? Math.round((hitSet.size / guideDots.length) * 100) : 0;

  return (
    <div className="lt-wrapper">
      {/* Letter label + speak */}
      <div className="lt-label">
        <button
          type="button"
          className="lt-speak-btn"
          onClick={() => speakPhoneme(letter)}
          aria-label={`Hear phoneme sound for ${letter}`}
        >
          <Volume2 size={18} />
        </button>
        {/* Show uppercase AND lowercase — children must learn both forms */}
        <span className="lt-letter-display">
          {letter.toUpperCase()} / {letter.toLowerCase()}
        </span>
        {result && (
          <span
            className={`lt-accuracy-badge ${result.pass ? 'lt-accuracy-badge--pass' : 'lt-accuracy-badge--fail'}`}
          >
            {result.accuracy}%
          </span>
        )}
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="lt-canvas-container">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className={`lt-canvas${result ? (result.pass ? ' lt-canvas--pass' : ' lt-canvas--fail') : ''}`}
          style={{
            width: size * canvasScale,
            height: size * canvasScale,
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
      {guideDots.length > 0 && (
        <div className="lt-progress-dots" aria-label={`${hitSet.size} of ${guideDots.length} checkpoints hit`}>
          {guideDots.map((_, i) => (
            <span
              key={i}
              className={`lt-dot ${hitSet.has(i) ? 'lt-dot--hit' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Result feedback */}
      {result && (
        <div className={`lt-result ${result.pass ? 'lt-result--pass' : 'lt-result--fail'}`}>
          {result.pass ? t('games.letterTracerGreat') : t('games.letterTracerTryAgain')}
        </div>
      )}

      {/* In-progress accuracy bar */}
      {!result && drawnPoints.length > 0 && guideDots.length > 0 && (
        <div className="lt-accuracy-bar-track">
          <div
            className="lt-accuracy-bar-fill"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="lt-actions">
        <button
          type="button"
          className="lt-btn lt-btn--secondary"
          onClick={() => reset()}
          disabled={isAnimating}
        >
          <RotateCcw size={16} />
          Try Again
        </button>
        <button
          type="button"
          className="lt-btn lt-btn--ghost"
          onClick={handleShowMe}
          disabled={isAnimating}
        >
          <Play size={16} />
          Show Me
        </button>
        {result && result.pass && onComplete && (
          <button
            type="button"
            className="lt-btn lt-btn--primary"
            onClick={() => onComplete(result.accuracy)}
          >
            Next Letter
          </button>
        )}
      </div>
    </div>
  );
}

LetterTracer.displayName = 'LetterTracer';
