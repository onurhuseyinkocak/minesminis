/**
 * WORLD MAP — Visual Learning Journey Path
 * MinesMinis v4.0
 *
 * Route: /worlds
 * A child-friendly board-game-style winding path.
 * Each stop = a curriculum phase unit.
 * Completed = green check, Current = golden pulse, Locked = gray lock.
 */
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check } from 'lucide-react';
import { ProgressBar, KidIcon } from '../components/ui';
import LottieCharacter from '../components/LottieCharacter';
import { PHASES, type LearningUnit } from '../data/curriculumPhases';
import MimiGuide from '../components/MimiGuide';
import { useLanguage } from '../contexts/LanguageContext';
import { LS_PLACEMENT_RESULT } from '../config/storageKeys';
import './WorldMap.css';

// ============================================================
// HELPERS
// ============================================================

/** Phase icons */
const PHASE_ICONS: Record<string, React.ReactNode> = {
  'little-ears': <KidIcon name="mic" size={20} />,
  'word-builders': <KidIcon name="learn" size={20} />,
  'story-makers': <KidIcon name="stories" size={20} />,
  'young-explorers': <KidIcon name="games" size={20} />,
};

/** Per-unit icon based on unit index */
function getUnitIcon(_unit: LearningUnit, index: number): React.ReactNode {
  return <span style={{ fontSize: '0.8rem', fontWeight: 900, color: 'inherit' }}>{index + 1}</span>;
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
    const placement = localStorage.getItem(LS_PLACEMENT_RESULT);
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
    // First unit in a later phase — unlock if previous phase has enough completion.
    // Condition: ALL units in prev phase completed OR >= 70% of prev phase units have 1+ star.
    const prevPhase = PHASES[phaseIndex - 1];
    if (prevPhase) {
      const prevUnits = prevPhase.units;
      let prevCompletedCount = 0;
      let prevWithStarsCount = 0;
      for (let pi = 0; pi < prevUnits.length; pi++) {
        const pu = prevUnits[pi];
        let puActivitiesCompleted = 0;
        try {
          const raw = localStorage.getItem(`mimi_unit_progress_${pu.id}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            puActivitiesCompleted = parsed.activitiesCompleted || 0;
          }
        } catch { /* ignore */ }
        const puPct = pu.activities.length > 0 ? puActivitiesCompleted / pu.activities.length : 0;
        if (puPct >= 1) prevCompletedCount++;
        if (puPct >= 0.3) prevWithStarsCount++; // 0.3+ means at least 1 star
      }
      const allCompleted = prevCompletedCount === prevUnits.length;
      const seventyPctWithStars = prevUnits.length > 0 && prevWithStarsCount / prevUnits.length >= 0.7;
      if (allCompleted || seventyPctWithStars) {
        return { status: activitiesCompleted > 0 ? 'current' : 'unlocked', starsEarned, activitiesCompleted, totalActivities };
      }
    }
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
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);

  const phase = PHASES[activePhaseIndex];
  const allUnits = phase.units;

  // Build flat stop list with progress
  const stops = allUnits.map((unit, i) => ({
    unit,
    icon: getUnitIcon(unit, i),
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
      // Navigate to unit detail — unit.id is used as the worldId param
      navigate(`/worlds/${stop.unit.id}`);
    },
    [navigate],
  );

  return (
    <div className="journey-page">
      {/* ---- SKY BACKGROUND DECORATIONS ---- */}
      <div className="journey-bg">
        <div className="journey-cloud journey-cloud--1" />
        <div className="journey-cloud journey-cloud--2" />
        <div className="journey-cloud journey-cloud--3" />
        <div className="journey-star journey-star--1"><KidIcon name="star" size={16} /></div>
        <div className="journey-star journey-star--2"><KidIcon name="star" size={12} /></div>
        <div className="journey-star journey-star--3"><KidIcon name="star" size={10} /></div>
      </div>

      {/* ---- HEADER ---- */}
      <header className="journey-header">
        <div className="journey-header__top">
          <h1 className="journey-header__title">
            <span className="journey-header__phase-emoji">
              {PHASE_ICONS[phase.id] || <KidIcon name="learn" size={20} />}
            </span>
            {lang === 'tr' ? phase.nameTr : phase.name}
          </h1>
          <span className="journey-header__age">{phase.ageRange} {t('worlds.years')}</span>
        </div>

        <div className="journey-header__progress">
          <ProgressBar
            value={overallPct}
            size="sm"
            variant={overallPct === 100 ? 'success' : 'default'}
            animated
          />
          <span className="journey-header__pct">{overallPct}{t('worlds.percentComplete')}</span>
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
              <span className="journey-phase-tab__icon">{PHASE_ICONS[p.id] || <KidIcon name="learn" size={16} />}</span>
              <span className="journey-phase-tab__label">{lang === 'tr' ? p.nameTr : p.name}</span>
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
              aria-label={`${lang === 'tr' ? stop.unit.titleTr : stop.unit.title} - ${stop.progress.status}`}
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
                  <LottieCharacter state="happy" size={48} />
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
                    <KidIcon name="star" size={14} />
                  </span>
                )}
                {isLocked && (
                  <span className="journey-stop__badge journey-stop__badge--locked">
                    <Lock size={16} />
                  </span>
                )}
                {isUnlocked && (
                  <span className="journey-stop__badge journey-stop__badge--unlocked">
                    <KidIcon name="star" size={14} />
                  </span>
                )}
                <span className="journey-stop__icon">{stop.icon}</span>
              </div>

              {/* Label */}
              <div className="journey-stop__info">
                <span className="journey-stop__title">{lang === 'tr' ? stop.unit.titleTr : stop.unit.title}</span>
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
                    {t('worlds.completePreviousUnit')}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}

        {/* Decorative elements along the path */}
        <div className="journey-deco journey-deco--tree1"><KidIcon name="garden" size={24} /></div>
        <div className="journey-deco journey-deco--tree2"><KidIcon name="garden" size={20} /></div>
        <div className="journey-deco journey-deco--flower1"><KidIcon name="star" size={16} /></div>
        <div className="journey-deco journey-deco--flower2"><KidIcon name="star" size={14} /></div>
        <div className="journey-deco journey-deco--flower3"><KidIcon name="star" size={12} /></div>
      </motion.div>

      <MimiGuide
        message="Tap a game to play! The highlighted one is next!"
        messageTr="Oynamak için bir oyuna dokun! Yıldızlı olan sıradasın!"
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
