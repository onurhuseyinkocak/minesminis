/**
 * WORLD MAP — Visual Learning Journey Path
 * MinesMinis v4.0
 *
 * Route: /worlds
 * A child-friendly board-game-style winding path.
 * Each stop = a curriculum phase unit.
 * Completed = green check, Current = golden pulse, Locked = gray lock.
 */
import React, { useState, useCallback, useMemo, useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Star, Check, Music, BookMarked, BookOpen, Rocket } from 'lucide-react';
import { ProgressBar, KidIcon } from '../components/ui';
import LottieCharacter from '../components/LottieCharacter';
import type { LearningUnit } from '../data/curriculumPhases';
import { getAllPhases } from '../services/curriculumService';

// Module-level reference: evaluated once, always up-to-date (ALL_PHASES is a stable array)
const PHASES = getAllPhases();
import MimiGuide from '../components/MimiGuide';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { LS_PLACEMENT_RESULT } from '../config/storageKeys';
import { saveCurrentUnit } from '../services/lessonProgressService';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { getAgeGroupFromSettings } from '../services/ageGroupService';
import toast from 'react-hot-toast';
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

// ── Storage key helpers (must match lessonProgressService prefix logic) ──────
// lessonProgressService uses `mm_` or `mm_child_{id}_` prefix.
// WorldMap reads directly from localStorage — must use the SAME keys.
function getActiveChildPrefix(): string {
  try {
    const childId = localStorage.getItem('mimi_active_child');
    return childId ? `mm_child_${childId}_` : 'mm_';
  } catch {
    return 'mm_';
  }
}

/** Read activitiesCompleted for a unit via the canonical storage key. */
function readActivitiesCompleted(unitId: string): number {
  try {
    const pfx = getActiveChildPrefix();
    // Primary: lessonProgressService writes activity index to this key (0-based next index).
    const actRaw = localStorage.getItem(`${pfx}unit_${unitId}_activity`);
    if (actRaw !== null) {
      const val = parseInt(actRaw, 10);
      if (!isNaN(val)) return val;
    }
    // Secondary: old WorldMap written JSON { activitiesCompleted: N }
    const legacyRaw = localStorage.getItem(`mimi_unit_progress_${unitId}`);
    if (legacyRaw) {
      const parsed = JSON.parse(legacyRaw);
      if (typeof parsed === 'object' && parsed !== null && typeof parsed.activitiesCompleted === 'number') {
        return parsed.activitiesCompleted;
      }
    }
  } catch { /* ignore */ }
  return 0;
}

/** Read placement start phase (0-based index) from localStorage. Cached per call site. */
function readStartPhase(): number {
  try {
    const detailRaw = localStorage.getItem('mimi_placement_detail');
    if (detailRaw) {
      const detail = JSON.parse(detailRaw);
      if (detail.phase !== undefined) return Math.max(0, detail.phase - 1);
    }
  } catch { /* ignore */ }
  try {
    const legacyRaw = localStorage.getItem(LS_PLACEMENT_RESULT);
    if (legacyRaw) {
      const group = parseInt(legacyRaw, 10);
      if (!isNaN(group)) {
        if (group <= 2) return 0;
        if (group === 3) return 1;
        if (group <= 5) return 2;
        return 3;
      }
    }
  } catch { /* ignore */ }
  return 0;
}

/** Check if a unit is marked completed via lessonProgressService's dedicated completed key. */
function readUnitCompleted(unitId: string): boolean {
  try {
    const pfx = getActiveChildPrefix();
    return localStorage.getItem(`${pfx}unit_${unitId}_completed`) === '1';
  } catch {
    return false;
  }
}

// ── Flat progress builder (non-recursive) ────────────────────────────────────
// Builds progress for ALL units in a phase in one pass to avoid recursive
// O(n²) localStorage reads on each render.

interface RawUnitData {
  activitiesCompleted: number;
  isCompleted: boolean;
  totalActivities: number;
}

function buildPhaseProgressMap(units: LearningUnit[]): Map<string, RawUnitData> {
  const map = new Map<string, RawUnitData>();
  for (const unit of units) {
    const isCompleted = readUnitCompleted(unit.id);
    const activitiesCompleted = isCompleted ? unit.activities.length : readActivitiesCompleted(unit.id);
    map.set(unit.id, {
      activitiesCompleted,
      isCompleted,
      totalActivities: unit.activities.length,
    });
  }
  return map;
}

function getUnitProgress(unit: LearningUnit, phaseIndex: number, unitIndex: number): UnitProgressInfo {
  const totalActivities = unit.activities.length;
  const startPhase = readStartPhase();

  const isCompleted = readUnitCompleted(unit.id);
  let activitiesCompleted = isCompleted ? totalActivities : readActivitiesCompleted(unit.id);

  const pct = totalActivities > 0 ? activitiesCompleted / totalActivities : 0;
  const starsEarned = pct >= 1 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;

  // 1. Already fully completed (real progress or placement skip)
  if (pct >= 1) return { status: 'completed', starsEarned, activitiesCompleted, totalActivities };

  // 2. Phase is before placement start → auto-complete (skip for advanced users)
  if (phaseIndex < startPhase) {
    return { status: 'completed', starsEarned: 3, activitiesCompleted: totalActivities, totalActivities };
  }

  // 3. First unit in the placement-start phase with no progress → current
  if (phaseIndex === startPhase && unitIndex === 0 && activitiesCompleted === 0) {
    return { status: 'current', starsEarned, activitiesCompleted, totalActivities };
  }

  // 4. First unit in a later-than-startPhase phase → check if prev phase unlocks it
  //    Uses flat scan (no recursion) to count prev phase completion.
  if (phaseIndex > startPhase && unitIndex === 0) {
    const prevPhase = PHASES[phaseIndex - 1];
    if (prevPhase) {
      const prevMap = buildPhaseProgressMap(prevPhase.units);
      let prevCompletedCount = 0;
      let prevWithStarsCount = 0;
      for (const data of prevMap.values()) {
        const puPct = data.totalActivities > 0 ? data.activitiesCompleted / data.totalActivities : 0;
        if (puPct >= 1 || data.isCompleted) prevCompletedCount++;
        if (puPct >= 0.3) prevWithStarsCount++;
      }
      const allCompleted = prevCompletedCount === prevPhase.units.length;
      const seventyPctWithStars = prevPhase.units.length > 0 && prevWithStarsCount / prevPhase.units.length >= 0.7;
      if (allCompleted || seventyPctWithStars) {
        return { status: activitiesCompleted > 0 ? 'current' : 'unlocked', starsEarned, activitiesCompleted, totalActivities };
      }
    }
    return { status: 'locked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
  }

  // 5. Unit has in-progress activities → current (only valid after prev unit check)
  //    We defer this check until after prev unit gate to avoid false positives.
  if (unitIndex === 0 && activitiesCompleted > 0) {
    // First unit in startPhase with partial progress
    return { status: 'current', starsEarned, activitiesCompleted, totalActivities };
  }

  // 6. Check previous unit in same phase (flat, no recursion — read direct from storage)
  if (unitIndex > 0) {
    const phase = PHASES[phaseIndex];
    const prevUnit = phase.units[unitIndex - 1];
    const prevCompleted = readUnitCompleted(prevUnit.id);
    const prevActivitiesDone = prevCompleted ? prevUnit.activities.length : readActivitiesCompleted(prevUnit.id);
    const prevPct = prevUnit.activities.length > 0 ? prevActivitiesDone / prevUnit.activities.length : 0;

    if (prevPct >= 1 || prevCompleted) {
      // Previous unit fully done: this unit is unlocked
      if (activitiesCompleted > 0) return { status: 'current', starsEarned, activitiesCompleted, totalActivities };
      return { status: 'unlocked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
    }

    // Previous unit is in progress or locked → this unit stays locked
    return { status: 'locked', starsEarned: 0, activitiesCompleted: 0, totalActivities };
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

// ============================================================
// TRACK CONFIG — age-based journey label
// ============================================================

interface TrackConfig {
  icon: string;
  label: string;
  color: string;
  desc: string;
}

type TrackKey = '3-5' | '5-7' | '7-9' | '9-10';

function getTrackConfig(isTr: boolean): Record<TrackKey, TrackConfig> {
  return {
    '3-5':  { icon: 'primary',       label: isTr ? 'Ses Gezgini'       : 'Sound Explorer',   color: 'var(--primary)',        desc: isTr ? 'Sesler ve hareketlerle öğren'        : 'Learn with sounds & movement' },
    '5-7':  { icon: 'accent-purple', label: isTr ? 'Kelime Kâşifi'     : 'Word Explorer',    color: 'var(--accent-purple)',  desc: isTr ? 'Harfleri birleştir, kelimeler oluştur' : 'Blend letters, build words' },
    '7-9':  { icon: 'info',          label: isTr ? 'Okuma Yıldızı'     : 'Reading Star',     color: 'var(--info)',           desc: isTr ? 'Akıcı oku, cümle kur'                 : 'Read fluently, build sentences' },
    '9-10': { icon: 'success',       label: isTr ? 'İngilizce Ustası'  : 'English Master',   color: 'var(--success)',        desc: isTr ? 'Gramer ve ileri kelime bilgisi'        : 'Grammar & advanced vocabulary' },
  };
}

/** Render a track icon via lucide-react (no emoji) */
function TrackIconEl({ icon, color }: { icon: string; color: string }) {
  const style = { color };
  const size = 22;
  if (icon === 'primary')       return <Music size={size} style={style} aria-hidden="true" />;
  if (icon === 'accent-purple') return <Star size={size} style={style} aria-hidden="true" />;
  if (icon === 'info')          return <BookOpen size={size} style={style} aria-hidden="true" />;
  if (icon === 'success')       return <Rocket size={size} style={style} aria-hidden="true" />;
  return <BookMarked size={size} style={style} aria-hidden="true" />;
}

/** Returns true if a phase (1-based number) is appropriate for the given age group */
function isPhaseAgeAppropriate(phaseNumber: number, ageGroup: string): boolean {
  if (ageGroup === '3-5') return phaseNumber <= 2;
  if (ageGroup === '5-7') return phaseNumber <= 3;
  return true; // 7-9 and 9-10 have full access
}

const WorldMap = () => {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const { setCurrentUnit } = useProgress();
  usePageTitle('Dünya Haritası', 'World Map');
  const { userProfile } = useAuth();
  // Initialise the active tab to the user's placement start phase so advanced
  // users land on their correct phase instead of always seeing Phase 1.
  const [activePhaseIndex, setActivePhaseIndex] = useState(() => readStartPhase());
  const [lockedTooltip, setLockedTooltip] = useState<string | null>(null);
  // useTransition: phase switching recalculates useMemo(stops) via localStorage reads
  // across all units — mark as non-urgent so the UI stays responsive
  const [isPhaseTransitioning, startPhaseTransition] = useTransition();

  const isTr = lang === 'tr';
  const ageGroup = getAgeGroupFromSettings(userProfile?.settings as Record<string, unknown> | null | undefined);
  const trackConfigs = getTrackConfig(isTr);
  const track: TrackConfig = trackConfigs[(ageGroup as TrackKey)] ?? trackConfigs['7-9'];

  // Show placement done banner once after placement test / onboarding
  useEffect(() => {
    const placementShown = localStorage.getItem('mimi_placement_shown');
    const placementDetail = localStorage.getItem('mimi_placement_detail');
    if (placementDetail && !placementShown) {
      localStorage.setItem('mimi_placement_shown', '1');
      try {
        const detail = JSON.parse(placementDetail) as { phaseLabel?: string };
        const label = detail.phaseLabel ?? 'your level';
        toast.success(
          lang === 'tr'
            ? `Seviyene uygun başlangıç noktasına yerleştirildin! (${label})`
            : `You've been placed at the right starting point! (${label})`,
          { duration: 4000 },
        );
      } catch { /* ignore */ }
    }
  }, [lang]);

  const phase = PHASES[activePhaseIndex];
  const allUnits = phase.units;

  // Build flat stop list with progress (memoized to avoid repeated localStorage reads)
  const stops = useMemo(() => allUnits.map((unit, i) => ({
    unit,
    icon: getUnitIcon(unit, i),
    progress: getUnitProgress(unit, activePhaseIndex, i),
    index: i,
  })), [allUnits, activePhaseIndex]);

  // Overall phase progress
  const completedCount = stops.filter((s) => s.progress.status === 'completed').length;
  const overallPct = allUnits.length > 0 ? Math.round((completedCount / allUnits.length) * 100) : 0;

  // Find current stop index for Mimi placement
  const currentStopIndex = stops.findIndex((s) => s.progress.status === 'current');

  // Persist the active unit so dailyLessonService can pick curriculum-relevant words
  React.useEffect(() => {
    const effectiveIdx = currentStopIndex >= 0 ? currentStopIndex : 0;
    saveCurrentUnit(activePhaseIndex, effectiveIdx);
    // Also sync to unified ProgressContext
    const currentUnitId = stops[effectiveIdx]?.unit?.id;
    if (currentUnitId) setCurrentUnit(currentUnitId);
  }, [activePhaseIndex, currentStopIndex, stops, setCurrentUnit]);

  const handleStopClick = useCallback(
    (stop: (typeof stops)[number]) => {
      if (stop.progress.status === 'locked') {
        setLockedTooltip(stop.unit.id);
        setTimeout(() => setLockedTooltip(null), 2000);
        return;
      }
      // Save selected unit immediately before navigating so dailyLessonService
      // reads the correct phase/unit on the very next render (not after the effect fires)
      saveCurrentUnit(activePhaseIndex, stop.index ?? stops.indexOf(stop));
      setCurrentUnit(stop.unit.id);
      navigate(`/worlds/${stop.unit.id}`);
    },
    [navigate, activePhaseIndex, stops, setCurrentUnit],
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
        <div className="journey-header__inner">
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

          {/* Age-based journey track banner */}
          {ageGroup && (
            <div className="journey-track-banner" style={{ borderLeftColor: track.color }}>
              <span className="journey-track-icon">
                <TrackIconEl icon={track.icon} color={track.color} />
              </span>
              <div>
                <div className="journey-track-label" style={{ color: track.color }}>{track.label}</div>
                <div className="journey-track-desc">{track.desc}</div>
              </div>
            </div>
          )}

          {/* Phase tabs */}
          <div className="journey-phase-tabs">
            {PHASES.map((p, i) => (
              <button
                type="button"
                key={p.id}
                className={`journey-phase-tab ${i === activePhaseIndex ? 'journey-phase-tab--active' : ''}`}
                onClick={() => startPhaseTransition(() => setActivePhaseIndex(i))}
                aria-label={p.name}
                disabled={isPhaseTransitioning}
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
        {/* Empty phase guard */}
        {stops.length === 0 && (
          <div className="journey-empty">
            <KidIcon name="learn" size={48} />
            <p>
              {isTr
                ? 'Bu bölümde henüz ders yok. Yakında ekleniyor!'
                : 'No lessons in this section yet. Coming soon!'}
            </p>
          </div>
        )}

        {/* New user motivational banner — shown when all stops are locked (0 progress) */}
        {stops.length > 0 && stops.every(s => s.progress.status === 'locked') && (
          <motion.div
            className="journey-new-user-banner"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <LottieCharacter state="wave" size={56} />
            <div className="journey-new-user-banner__text">
              <strong>
                {isTr ? 'Macera buradan başlıyor!' : 'Your adventure starts here!'}
              </strong>
              <span>
                {isTr
                  ? 'İlk dersi açmak için Günlük Derse git!'
                  : 'Go to Daily Lesson to unlock your first unit!'}
              </span>
            </div>
          </motion.div>
        )}

        {/* SVG path connector line — viewBox height matches stepY * stops */}
        <svg
          className="journey-path-svg"
          viewBox={`0 0 400 ${stops.length * 160 + 80}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          {/* Wider stroke for dotted trail visibility */}
          <path
            d={buildPathD(stops.length)}
            fill="none"
            stroke="var(--journey-path-color, #FF6B35)"
            strokeWidth="5"
            strokeDasharray="14 9"
            strokeLinecap="round"
            opacity="0.45"
          />
        </svg>

        {stops.map((stop, i) => {
          const isLeft = i % 2 === 0;
          const isCurrent = stop.progress.status === 'current';
          const isCompleted = stop.progress.status === 'completed';
          const isLocked = stop.progress.status === 'locked';
          const isUnlocked = stop.progress.status === 'unlocked';

          // Age-lock: phase is not appropriate for this age group
          const isAgeLocked = ageGroup
            ? !isPhaseAgeAppropriate(phase.number, ageGroup)
            : false;

          // Show advanced badge for 9-10 on phases 3 & 4
          const showAdvancedBadge = ageGroup === '9-10' && (phase.number === 3 || phase.number === 4);

          const showMimi = !isAgeLocked && isCurrent && currentStopIndex === i;

          return (
            <motion.div
              key={stop.unit.id}
              className={[
                'journey-stop',
                isLeft ? 'journey-stop--left' : 'journey-stop--right',
                !isAgeLocked && isCurrent && 'journey-stop--current',
                !isAgeLocked && isCompleted && 'journey-stop--completed',
                (isLocked || isAgeLocked) && 'journey-stop--locked',
                !isAgeLocked && isUnlocked && 'journey-stop--unlocked',
                showMimi && 'journey-stop--has-mimi',
              ]
                .filter(Boolean)
                .join(' ')}
              style={{ '--stop-index': i } as React.CSSProperties}
              variants={stopVariants}
              onClick={() => {
                if (isAgeLocked) {
                  setLockedTooltip(stop.unit.id);
                  setTimeout(() => setLockedTooltip(null), 2000);
                  return;
                }
                handleStopClick(stop);
              }}
              role="button"
              tabIndex={0}
              aria-label={`${lang === 'tr' ? stop.unit.titleTr : stop.unit.title} - ${isAgeLocked ? 'age-locked' : stop.progress.status}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (isAgeLocked) {
                    setLockedTooltip(stop.unit.id);
                    setTimeout(() => setLockedTooltip(null), 2000);
                    return;
                  }
                  handleStopClick(stop);
                }
              }}
            >
              {/* Mimi at current position */}
              {showMimi && (
                <div className="journey-mimi-marker">
                  <LottieCharacter state="happy" size={48} />
                </div>
              )}

              {/* Stop circle */}
              <div className="journey-stop__circle">
                {!isAgeLocked && isCompleted && (
                  <span className="journey-stop__badge journey-stop__badge--done">
                    <Check size={18} strokeWidth={3} />
                  </span>
                )}
                {!isAgeLocked && isCurrent && (
                  <span className="journey-stop__badge journey-stop__badge--current">
                    <KidIcon name="star" size={14} />
                  </span>
                )}
                {(isLocked || isAgeLocked) && (
                  <span className="journey-stop__badge journey-stop__badge--locked">
                    <Lock size={16} />
                  </span>
                )}
                {!isAgeLocked && isUnlocked && (
                  <span className="journey-stop__badge journey-stop__badge--unlocked">
                    <KidIcon name="star" size={14} />
                  </span>
                )}
                <span className="journey-stop__icon">{stop.icon}</span>
              </div>

              {/* Label */}
              <div className="journey-stop__info">
                <span className="journey-stop__title">{lang === 'tr' ? stop.unit.titleTr : stop.unit.title}</span>
                {/* Advanced badge for 9-10 age group */}
                {showAdvancedBadge && !isAgeLocked && (
                  <span className="journey-stop__advanced">Advanced</span>
                )}
                {/* Stars */}
                {!isAgeLocked && (
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
                )}
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
                    {isAgeLocked
                      ? (isTr ? 'Büyüyünce açılır' : 'Unlocks when you grow up')
                      : i === 0
                        ? (isTr ? 'Önceki bölümü tamamla' : 'Complete the previous section first')
                        : (isTr ? 'Önceki dersi tamamla' : 'Complete the previous lesson first')}
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
