/**
 * WORLD MAP — Visual Learning Journey Path
 * MinesMinis v4.0
 *
 * Route: /worlds
 * A child-friendly board-game-style winding path.
 * Each stop = a curriculum phase unit.
 * Completed = green check, Current = golden pulse, Locked = gray lock.
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check } from 'lucide-react';
import { ProgressBar } from '../components/ui';
import UnifiedMascot from '../components/UnifiedMascot';
import { useAuth } from '../contexts/AuthContext';
import { PHASES, type LearningPhase, type LearningUnit } from '../data/curriculumPhases';
import MimiGuide from '../components/MimiGuide';
import './WorldMap.css';

// ============================================================
// HELPERS
// ============================================================

/** Phase emoji icons */
const PHASE_EMOJIS: Record<string, string> = {
  'little-ears': '\u{1F423}',
  'word-builders': '\u{1F3D7}\u{FE0F}',
  'story-makers': '\u{1F4DA}',
  'young-explorers': '\u{1F30D}',
};

/** Per-unit emoji icons based on unit content */
function getUnitEmoji(unit: LearningUnit): string {
  const title = unit.title.toLowerCase();
  if (title.includes('snake')) return '\u{1F40D}';
  if (title.includes('mouse')) return '\u{1F42D}';
  if (title.includes('cat')) return '\u{1F431}';
  if (title.includes('lion')) return '\u{1F981}';
  if (title.includes('octopus') || title.includes('umbrella')) return '\u{1F419}';
  if (title.includes('lollipop') || title.includes('ball')) return '\u{1F3C0}';
  if (title.includes('rain')) return '\u{1F327}\u{FE0F}';
  if (title.includes('kite') || title.includes('bee')) return '\u{1F41D}';
  if (title.includes('buzz') || title.includes('ring')) return '\u{1F514}';
  if (title.includes('van') || title.includes('moon')) return '\u{1F319}';
  if (title.includes('workshop') || title.includes('builder')) return '\u{1F527}';
  if (title.includes('challenge')) return '\u{1F3C6}';
  if (title.includes('fox')) return '\u{1F98A}';
  if (title.includes('tongue') || title.includes('thinking')) return '\u{1F914}';
  if (title.includes('queen') || title.includes('coin')) return '\u{1F451}';
  if (title.includes('star') || title.includes('blue')) return '\u{2B50}';
  if (title.includes('expression') || title.includes('reading')) return '\u{1F3AD}';
  if (title.includes('understanding') || title.includes('stories')) return '\u{1F4D6}';
  if (title.includes('writing') || title.includes('first stories')) return '\u{270D}\u{FE0F}';
  if (title.includes('champion') || title.includes('phonics')) return '\u{1F947}';
  return '\u{1F4CC}';
}

/** Get unit progress from localStorage */
interface UnitProgressInfo {
  status: 'completed' | 'current' | 'unlocked' | 'locked';
  starsEarned: number; // 0-3
  activitiesCompleted: number;
  totalActivities: number;
}

function getUnitProgress(unit: LearningUnit, phaseIndex: number, unitIndex: number): UnitProgressInfo {
  const totalActivities = unit.activities.length;

  // Check localStorage for placement result
  let startPhase = 0;
  try {
    const placement = localStorage.getItem('mimi_placement_result');
    if (placement) {
      const parsed = JSON.parse(placement);
      if (parsed.phaseIndex !== undefined) startPhase = parsed.phaseIndex;
    }
  } catch { /* ignore */ }

  // Check localStorage for unit completion
  let activitiesCompleted = 0;
  try {
    const key = `mimi_unit_progress_${unit.id}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      activitiesCompleted = parsed.activitiesCompleted || 0;
    }
  } catch { /* ignore */ }

  const pct = totalActivities > 0 ? activitiesCompleted / totalActivities : 0;
  const starsEarned = pct >= 1 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;

  // Determine status
  if (pct >= 1) return { status: 'completed', starsEarned, activitiesCompleted, totalActivities };

  // Check if previous unit is completed (or this is the first unit in starting phase)
  if (phaseIndex < startPhase) {
    return { status: 'completed', starsEarned: 3, activitiesCompleted: totalActivities, totalActivities };
  }

  if (phaseIndex === startPhase && unitIndex === 0 && activitiesCompleted === 0) {
    return { status: 'current', starsEarned, activitiesCompleted, totalActivities };
  }

  if (phaseIndex > startPhase && unitIndex === 0) {
    // First unit in a later phase — check if prev phase last unit is completed
    return { status: 'locked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
  }

  // Check if this is the first incomplete unit after completed ones
  if (activitiesCompleted > 0 && pct < 1) {
    return { status: 'current', starsEarned, activitiesCompleted, totalActivities };
  }

  // Check previous unit
  const phase = PHASES[phaseIndex];
  if (unitIndex > 0) {
    const prevUnit = phase.units[unitIndex - 1];
    const prevProgress = getUnitProgress(prevUnit, phaseIndex, unitIndex - 1);
    if (prevProgress.status === 'completed') {
      return { status: activitiesCompleted > 0 ? 'current' : 'unlocked', starsEarned, activitiesCompleted, totalActivities };
    }
    if (prevProgress.status === 'current' || prevProgress.status === 'unlocked') {
      return { status: 'locked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
    }
  }

  return { status: 'locked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const pathVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const stopVariants = {
  hidden: { opacity: 0, scale: 0.6, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 22 },
  },
};

const tooltipVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  exit: { opacity: 0, scale: 0.8, y: 8, transition: { duration: 0.15 } },
};

// ============================================================
// COMPONENT
// ============================================================

const WorldMap = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const _userId = user?.uid || 'guest';

  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  const phase = PHASES[activePhaseIndex];
  const allUnits = phase.units;

  // Build flat stop list with progress
  const stops = allUnits.map((unit, i) => ({
    unit,
    emoji: getUnitEmoji(unit),
    progress: getUnitProgress(unit, activePhaseIndex, i),
    index: i,
  }));

  // Overall phase progress
  const completedCount = stops.filter((s) => s.progress.status === 'completed').length;
  const overallPct = allUnits.length > 0 ? Math.round((completedCount / allUnits.length) * 100) : 0;

  // Find current stop index for Mimi placement
  const currentStopIndex = stops.findIndex((s) => s.progress.status === 'current');

  const handleStopClick = useCallback(
    (stop: (typeof stops)[number]) => {
      if (stop.progress.status === 'locked') {
        setLockedTooltip(stop.unit.id);
        setTimeout(() => setLockedTooltip(null), 2000);
        return;
      }
      // Navigate to first activity in unit
      navigate(`/worlds/${phase.id}/${stop.unit.id}`);
    },
    [navigate, phase.id],
  );

  return (
    <div className="journey-page">
      {/* ---- SKY BACKGROUND DECORATIONS ---- */}
      <div className="journey-bg">
        <div className="journey-cloud journey-cloud--1" />
        <div className="journey-cloud journey-cloud--2" />
        <div className="journey-cloud journey-cloud--3" />
        <div className="journey-star journey-star--1">{'\u2B50'}</div>
        <div className="journey-star journey-star--2">{'\u{1F31F}'}</div>
        <div className="journey-star journey-star--3">{'\u2728'}</div>
      </div>

      {/* ---- HEADER ---- */}
      <header className="journey-header">
        <div className="journey-header__top">
          <h1 className="journey-header__title">
            <span className="journey-header__phase-emoji">
              {PHASE_EMOJIS[phase.id] || phase.icon}
            </span>
            {phase.name}
          </h1>
          <span className="journey-header__age">{phase.ageRange} yrs</span>
        </div>

        <div className="journey-header__progress">
          <ProgressBar
            value={overallPct}
            size="sm"
            variant={overallPct === 100 ? 'success' : 'default'}
            animated
          />
          <span className="journey-header__pct">{overallPct}% complete</span>
        </div>

        {/* Phase tabs */}
        <div className="journey-phase-tabs">
          {PHASES.map((p, i) => (
            <button
              key={p.id}
              className={`journey-phase-tab ${i === activePhaseIndex ? 'journey-phase-tab--active' : ''}`}
              onClick={() => setActivePhaseIndex(i)}
              aria-label={p.name}
              style={
                i === activePhaseIndex
                  ? { borderColor: p.color, color: p.color }
                  : undefined
              }
            >
              <span className="journey-phase-tab__icon">{PHASE_EMOJIS[p.id] || p.icon}</span>
              <span className="journey-phase-tab__label">{p.name}</span>
            </button>
          ))}
        </div>
      </header>

      {/* ---- WINDING PATH ---- */}
      <motion.div
        className="journey-path"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
        key={phase.id}
      >
        {/* SVG path connector line */}
        <svg
          className="journey-path-svg"
          viewBox={`0 0 400 ${stops.length * 160 + 40}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <path
            d={buildPathD(stops.length)}
            fill="none"
            stroke="var(--journey-path-color, #E8C547)"
            strokeWidth="4"
            strokeDasharray="12 8"
            strokeLinecap="round"
            opacity="0.6"
          />
        </svg>

        {stops.map((stop, i) => {
          const isLeft = i % 2 === 0;
          const isCurrent = stop.progress.status === 'current';
          const isCompleted = stop.progress.status === 'completed';
          const isLocked = stop.progress.status === 'locked';
          const isUnlocked = stop.progress.status === 'unlocked';

          return (
            <motion.div
              key={stop.unit.id}
              className={[
                'journey-stop',
                isLeft ? 'journey-stop--left' : 'journey-stop--right',
                isCurrent && 'journey-stop--current',
                isCompleted && 'journey-stop--completed',
                isLocked && 'journey-stop--locked',
                isUnlocked && 'journey-stop--unlocked',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--stop-index': i } as React.CSSProperties}
              variants={stopVariants}
              onClick={() => handleStopClick(stop)}
              role="button"
              tabIndex={0}
              aria-label={`${stop.unit.title} - ${stop.progress.status}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleStopClick(stop);
                }
              }}
            >
              {/* Mimi at current position */}
              {isCurrent && currentStopIndex === i && (
                <div className="journey-mimi-marker">
                  <UnifiedMascot id="mimi_dragon" state="waving" size={48} />
                </div>
              )}

              {/* Stop circle */}
              <div className="journey-stop__circle">
                {isCompleted && (
                  <span className="journey-stop__badge journey-stop__badge--done">
                    <Check size={18} strokeWidth={3} />
                  </span>
                )}
                {isCurrent && (
                  <span className="journey-stop__badge journey-stop__badge--current">
                    {'\u2B50'}
                  </span>
                )}
                {isLocked && (
                  <span className="journey-stop__badge journey-stop__badge--locked">
                    <Lock size={16} />
                  </span>
                )}
                {isUnlocked && (
                  <span className="journey-stop__badge journey-stop__badge--unlocked">
                    {'\u{1F31F}'}
                  </span>
                )}
                <span className="journey-stop__emoji">{stop.emoji}</span>
              </div>

              {/* Label */}
              <div className="journey-stop__info">
                <span className="journey-stop__title">{stop.unit.title}</span>
                {/* Stars */}
                <span className="journey-stop__stars">
                  {[1, 2, 3].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= stop.progress.starsEarned
                          ? 'journey-star-icon journey-star-icon--filled'
                          : 'journey-star-icon'
                      }
                    />
                  ))}
                </span>
              </div>

              {/* Locked tooltip */}
              <AnimatePresence>
                {lockedTooltip === stop.unit.id && (
                  <motion.div
                    className="journey-tooltip"
                    variants={tooltipVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    Complete the previous unit first!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Decorative elements along the path */}
        <div className="journey-deco journey-deco--tree1">{'\u{1F333}'}</div>
        <div className="journey-deco journey-deco--tree2">{'\u{1F332}'}</div>
        <div className="journey-deco journey-deco--flower1">{'\u{1F33C}'}</div>
        <div className="journey-deco journey-deco--flower2">{'\u{1F337}'}</div>
        <div className="journey-deco journey-deco--flower3">{'\u{1F33A}'}</div>
      </motion.div>

      <MimiGuide
        message="Tap a game to play! The golden \u2B50 one is next!"
        messageTr="Oynamak icin bir oyuna dokun! Yildizli olan siradasin!"
        showOnce="mimi_guide_worldmap"
        position="bottom-left"
      />
    </div>
  );
};

// ============================================================
// SVG PATH BUILDER — zigzag dotted trail
// ============================================================

function buildPathD(stopCount: number): string {
  if (stopCount < 1) return '';
  const segments: string[] = [];
  const cx = 200; // center x
  const offsetX = 100; // zigzag amplitude
  const startY = 60;
  const stepY = 160;

  for (let i = 0; i < stopCount; i++) {
    const isLeft = i % 2 === 0;
    const x = isLeft ? cx - offsetX : cx + offsetX;
    const y = startY + i * stepY;

    if (i === 0) {
      segments.push(`M ${x} ${y}`);
    } else {
      const prevLeft = (i - 1) % 2 === 0;
      const prevX = prevLeft ? cx - offsetX : cx + offsetX;
      const prevY = startY + (i - 1) * stepY;
      // Smooth S-curve between stops
      const cpY = prevY + stepY * 0.5;
      segments.push(`C ${prevX} ${cpY}, ${x} ${cpY}, ${x} ${y}`);
    }
  }
  return segments.join(' ');
}

export default WorldMap;
