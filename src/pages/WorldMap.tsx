// ============================================================
// MinesMinis — WorldMap (Learn Page)
// Main learning journey page with phase tabs + unit cards grid
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, Star, ChevronRight, BookOpen, Volume2, Sparkles } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getAllPhases } from '../services/curriculumService';
import LottieCharacter from '../components/LottieCharacter';
import type { LearningPhase, LearningUnit } from '../data/curriculumPhases';

// ── Constants ────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { bg: string; gradient: string; border: string; text: string; pill: string; pillActive: string; cardFrom: string; cardTo: string }> = {
  'little-ears': {
    bg: '#FFF7ED',
    gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)',
    border: '#FDBA74',
    text: '#C2410C',
    pill: '#FFF7ED',
    pillActive: '#FB923C',
    cardFrom: '#FFF7ED',
    cardTo: '#FFEDD5',
  },
  'word-builders': {
    bg: '#EFF6FF',
    gradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
    border: '#93C5FD',
    text: '#1D4ED8',
    pill: '#EFF6FF',
    pillActive: '#60A5FA',
    cardFrom: '#EFF6FF',
    cardTo: '#DBEAFE',
  },
  'story-makers': {
    bg: '#F0FDF4',
    gradient: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
    border: '#86EFAC',
    text: '#15803D',
    pill: '#F0FDF4',
    pillActive: '#4ADE80',
    cardFrom: '#F0FDF4',
    cardTo: '#DCFCE7',
  },
  'young-explorers': {
    bg: '#FAF5FF',
    gradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
    border: '#C084FC',
    text: '#7E22CE',
    pill: '#FAF5FF',
    pillActive: '#A855F7',
    cardFrom: '#FAF5FF',
    cardTo: '#F3E8FF',
  },
};

const PHASE_ICONS: Record<string, string> = {
  'little-ears': 'idle',
  'word-builders': 'happy',
  'story-makers': 'talk',
  'young-explorers': 'star',
};

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };
const gentleSpring = { type: 'spring' as const, stiffness: 200, damping: 20 };

// ── Progress Ring Component ──────────────────────────────────

function ProgressRing({ progress, size = 56, strokeWidth = 5, color = '#FB923C' }: {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={strokeWidth}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ ...gentleSpring, delay: 0.3 }}
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.24}
        fontWeight={700}
        fill={color}
      >
        {Math.round(progress)}%
      </text>
    </svg>
  );
}

// ── Phase Tab Pill ───────────────────────────────────────────

function PhaseTab({ phase, isActive, onClick, lang }: {
  phase: LearningPhase;
  isActive: boolean;
  onClick: () => void;
  lang: string;
}) {
  const colors = PHASE_COLORS[phase.id];
  const label = lang === 'tr' ? phase.nameTr : phase.name;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 20px',
        borderRadius: 9999,
        border: `2px solid ${isActive ? colors.pillActive : '#E5E7EB'}`,
        background: isActive ? colors.pillActive : '#FFFFFF',
        color: isActive ? '#FFFFFF' : '#6B7280',
        fontWeight: 600,
        fontSize: 14,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        minHeight: 48,
        position: 'relative',
        outline: 'none',
      }}
    >
      <span style={{ fontSize: 12, opacity: 0.8 }}>P{phase.number}</span>
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="phase-indicator"
          style={{
            position: 'absolute',
            bottom: -2,
            left: '50%',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: colors.pillActive,
            transform: 'translateX(-50%)',
          }}
          transition={springTransition}
        />
      )}
    </motion.button>
  );
}

// ── Unit Card ────────────────────────────────────────────────

function UnitCard({ unit, phase, index, lang, progress, isCompleted, isUnlocked, isCurrent }: {
  unit: LearningUnit;
  phase: LearningPhase;
  index: number;
  lang: string;
  progress: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
}) {
  const colors = PHASE_COLORS[phase.id];
  const title = lang === 'tr' ? unit.titleTr : unit.title;
  const progressPercent = Math.round(progress * 100);

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...gentleSpring, delay: index * 0.06 }}
      whileTap={isUnlocked ? { scale: 0.97 } : undefined}
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: 20,
        background: isUnlocked
          ? `linear-gradient(145deg, ${colors.cardFrom} 0%, ${colors.cardTo} 100%)`
          : '#F9FAFB',
        border: `2px solid ${isCurrent ? colors.pillActive : isUnlocked ? colors.border : '#E5E7EB'}`,
        opacity: isUnlocked ? 1 : 0.6,
        cursor: isUnlocked ? 'pointer' : 'default',
        overflow: 'hidden',
        minHeight: 140,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 12,
        boxShadow: isCurrent
          ? `0 0 0 3px ${colors.pillActive}33, 0 4px 12px ${colors.pillActive}22`
          : isCompleted
            ? `0 2px 8px ${colors.border}33`
            : '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {/* Current unit pulse ring */}
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 20,
            border: `3px solid ${colors.pillActive}`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: isUnlocked ? colors.pillActive : '#D1D5DB',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {unit.number}
        </div>

        {/* Status icon */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isCompleted ? '#22C55E' : !isUnlocked ? '#E5E7EB' : 'transparent',
          }}
        >
          {isCompleted ? (
            <Star size={16} color="#FFFFFF" fill="#FFFFFF" />
          ) : !isUnlocked ? (
            <Lock size={14} color="#9CA3AF" />
          ) : isCurrent ? (
            <Sparkles size={16} color={colors.pillActive} />
          ) : null}
        </div>
      </div>

      {/* Title */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
        <h3
          style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 700,
            color: isUnlocked ? colors.text : '#9CA3AF',
            lineHeight: 1.3,
          }}
        >
          {title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <BookOpen size={12} color={isUnlocked ? colors.text + 'AA' : '#D1D5DB'} />
          <span
            style={{
              fontSize: 12,
              color: isUnlocked ? colors.text + 'AA' : '#D1D5DB',
              fontWeight: 500,
            }}
          >
            {unit.vocabularyTheme}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {isUnlocked && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: colors.text + 'CC' }}>
              {progressPercent}%
            </span>
            {isUnlocked && !isCompleted && (
              <ChevronRight size={14} color={colors.pillActive} />
            )}
            {isCompleted && (
              <Check size={14} color="#22C55E" />
            )}
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 3,
              background: '#FFFFFF',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ...gentleSpring, delay: index * 0.06 + 0.2 }}
              style={{
                height: '100%',
                borderRadius: 3,
                background: isCompleted
                  ? '#22C55E'
                  : `linear-gradient(90deg, ${colors.pillActive}, ${colors.border})`,
              }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );

  if (!isUnlocked) {
    return cardContent;
  }

  return (
    <Link to={`/worlds/${unit.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      {cardContent}
    </Link>
  );
}

// ── Motivational Message ─────────────────────────────────────

function getMotivationalMessage(progress: number, lang: string): string {
  if (progress >= 100) return lang === 'tr' ? 'Harika! Hepsini tamamladin!' : 'Amazing! You completed everything!';
  if (progress >= 75) return lang === 'tr' ? 'Neredeyse bitti! Devam et!' : 'Almost there! Keep going!';
  if (progress >= 50) return lang === 'tr' ? 'Yarisini gectin, harika gidiyorsun!' : 'Halfway there, great job!';
  if (progress >= 25) return lang === 'tr' ? 'Guzel ilerliyorsun!' : 'Great progress!';
  if (progress > 0) return lang === 'tr' ? 'Harika bir baslangic!' : 'Great start!';
  return lang === 'tr' ? 'Maceraya basla!' : 'Start your adventure!';
}

// ── Main Component ───────────────────────────────────────────

export default function WorldMap() {
  const { lang } = useLanguage();
  const { getUnitProgress, isUnitCompleted, isUnitUnlocked, currentUnitId } = useProgress();
  usePageTitle('Ogren', 'Learn');

  const phases = useMemo(() => getAllPhases(), []);

  // Find which phase contains the current unit
  const defaultPhaseId = useMemo(() => {
    for (const phase of phases) {
      if (phase.units.some((u) => u.id === currentUnitId)) {
        return phase.id;
      }
    }
    return phases[0]?.id ?? 'little-ears';
  }, [phases, currentUnitId]);

  const [activePhaseId, setActivePhaseId] = useState<string>(defaultPhaseId);

  const activePhase = useMemo(
    () => phases.find((p) => p.id === activePhaseId) ?? phases[0],
    [phases, activePhaseId],
  );

  // Overall progress across all phases
  const overallProgress = useMemo(() => {
    const allUnits = phases.flatMap((p) => p.units);
    if (allUnits.length === 0) return 0;
    const total = allUnits.reduce((sum, u) => sum + getUnitProgress(u.id), 0);
    return (total / allUnits.length) * 100;
  }, [phases, getUnitProgress]);

  // Phase progress
  const phaseProgress = useMemo(() => {
    if (!activePhase || activePhase.units.length === 0) return 0;
    const total = activePhase.units.reduce((sum, u) => sum + getUnitProgress(u.id), 0);
    return (total / activePhase.units.length) * 100;
  }, [activePhase, getUnitProgress]);

  const colors = PHASE_COLORS[activePhaseId] ?? PHASE_COLORS['little-ears'];
  const motivationalMsg = getMotivationalMessage(overallProgress, lang);

  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 64px)',
        background: '#FAFAFA',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={gentleSpring}
        style={{
          padding: '24px 20px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 800,
              color: '#1F2937',
              letterSpacing: -0.5,
            }}
          >
            {lang === 'tr' ? 'Ogren' : 'Learn'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color={colors.pillActive} />
            <span style={{ fontSize: 13, color: '#6B7280', fontWeight: 500 }}>
              {motivationalMsg}
            </span>
          </div>
        </div>

        <ProgressRing
          progress={overallProgress}
          size={56}
          strokeWidth={5}
          color={colors.pillActive}
        />
      </motion.div>

      {/* ── Phase Tabs ─────────────────────────────────────── */}
      <div
        style={{
          padding: '0 20px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            paddingBottom: 12,
            minWidth: 'max-content',
          }}
        >
          {phases.map((phase) => (
            <PhaseTab
              key={phase.id}
              phase={phase}
              isActive={activePhaseId === phase.id}
              onClick={() => setActivePhaseId(phase.id)}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ── Phase Info Banner ──────────────────────────────── */}
      <motion.div
        key={activePhaseId}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={gentleSpring}
        style={{
          margin: '0 20px 16px',
          padding: 16,
          borderRadius: 16,
          background: colors.gradient,
          border: `1.5px solid ${colors.border}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <LottieCharacter
            state={PHASE_ICONS[activePhaseId] ?? 'idle'}
            size={56}
          />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h2
              style={{
                margin: 0,
                fontSize: 16,
                fontWeight: 700,
                color: colors.text,
              }}
            >
              {lang === 'tr' ? activePhase.nameTr : activePhase.name}
            </h2>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: colors.pillActive,
                background: '#FFFFFF',
                padding: '2px 8px',
                borderRadius: 8,
              }}
            >
              {activePhase.ageRange}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: colors.text + 'BB',
              lineHeight: 1.4,
            }}
          >
            {lang === 'tr' ? activePhase.descriptionTr : activePhase.description}
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ProgressRing
            progress={phaseProgress}
            size={44}
            strokeWidth={4}
            color={colors.pillActive}
          />
        </div>
      </motion.div>

      {/* ── Unit Cards Grid ────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: '0 20px 32px',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          {activePhase.units.map((unit, idx) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              phase={activePhase}
              index={idx}
              lang={lang}
              progress={getUnitProgress(unit.id)}
              isCompleted={isUnitCompleted(unit.id)}
              isUnlocked={isUnitUnlocked(unit.id)}
              isCurrent={unit.id === currentUnitId}
            />
          ))}
        </div>

        {/* Empty state if no units */}
        {activePhase.units.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: '#9CA3AF',
            }}
          >
            <Volume2 size={32} color="#D1D5DB" />
            <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>
              {lang === 'tr' ? 'Bu asamada henuz ders yok.' : 'No lessons in this phase yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
