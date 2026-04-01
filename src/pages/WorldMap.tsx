// ============================================================
// MinesMinis — WorldMap (Learn Page)
// Simplified for young children (3+): big colorful phase buttons,
// simple unit cards with number + title + lock/star status
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star, Sparkles } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getAllPhases } from '../services/curriculumService';
import LottieCharacter from '../components/LottieCharacter';
import type { LearningPhase, LearningUnit } from '../data/curriculumPhases';

// ── Constants ────────────────────────────────────────────────

const PHASE_COLORS: Record<string, { bg: string; gradient: string; border: string; text: string; active: string; cardFrom: string; cardTo: string }> = {
  'little-ears': {
    bg: '#FFF7ED',
    gradient: 'linear-gradient(135deg, #FB923C 0%, #F97316 100%)',
    border: '#FDBA74',
    text: '#C2410C',
    active: '#FB923C',
    cardFrom: '#FFF7ED',
    cardTo: '#FFEDD5',
  },
  'word-builders': {
    bg: '#EFF6FF',
    gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
    border: '#93C5FD',
    text: '#1D4ED8',
    active: '#60A5FA',
    cardFrom: '#EFF6FF',
    cardTo: '#DBEAFE',
  },
  'story-makers': {
    bg: '#F0FDF4',
    gradient: 'linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)',
    border: '#86EFAC',
    text: '#15803D',
    active: '#4ADE80',
    cardFrom: '#F0FDF4',
    cardTo: '#DCFCE7',
  },
  'young-explorers': {
    bg: '#FAF5FF',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #8B5CF6 100%)',
    border: '#C084FC',
    text: '#7E22CE',
    active: '#A855F7',
    cardFrom: '#FAF5FF',
    cardTo: '#F3E8FF',
  },
};

const PHASE_LOTTIE: Record<string, string> = {
  'little-ears': 'idle',
  'word-builders': 'happy',
  'story-makers': 'talk',
  'young-explorers': 'star',
};

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };
const gentleSpring = { type: 'spring' as const, stiffness: 200, damping: 20 };

// ── Phase Button (BIG colorful) ──────────────────────────────

function PhaseButton({ phase, isActive, onClick, lang }: {
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
      whileTap={{ scale: 0.93 }}
      transition={springTransition}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '14px 24px',
        borderRadius: 20,
        border: `3px solid ${isActive ? colors.active : '#E5E7EB'}`,
        background: isActive ? colors.gradient : '#FFFFFF',
        color: isActive ? '#FFFFFF' : '#6B7280',
        fontWeight: 700,
        fontSize: 15,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        minHeight: 56,
        outline: 'none',
        boxShadow: isActive ? `0 4px 12px ${colors.active}44` : 'none',
      }}
    >
      <span>{label}</span>
    </motion.button>
  );
}

// ── Simple Unit Card ─────────────────────────────────────────

function SimpleUnitCard({ unit, phase, index, lang, isCompleted, isUnlocked, isCurrent }: {
  unit: LearningUnit;
  phase: LearningPhase;
  index: number;
  lang: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
}) {
  const colors = PHASE_COLORS[phase.id];
  const title = lang === 'tr' ? unit.titleTr : unit.title;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...gentleSpring, delay: index * 0.05 }}
      whileTap={isUnlocked ? { scale: 0.95 } : undefined}
      style={{
        borderRadius: 20,
        padding: 16,
        background: isUnlocked
          ? `linear-gradient(145deg, ${colors.cardFrom} 0%, ${colors.cardTo} 100%)`
          : '#F3F4F6',
        border: `3px solid ${isCurrent ? colors.active : isUnlocked ? colors.border : '#E5E7EB'}`,
        opacity: isUnlocked ? 1 : 0.5,
        cursor: isUnlocked ? 'pointer' : 'default',
        minHeight: 100,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        position: 'relative' as const,
        boxShadow: isCurrent
          ? `0 0 0 3px ${colors.active}33, 0 4px 12px ${colors.active}22`
          : isCompleted
            ? `0 2px 8px ${colors.border}33`
            : 'none',
      }}
    >
      {/* Current unit pulse */}
      {isCurrent && (
        <motion.div
          animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -4,
            borderRadius: 24,
            border: `3px solid ${colors.active}`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Number badge */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          background: isCompleted ? '#22C55E' : isUnlocked ? colors.active : '#D1D5DB',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: 16,
        }}
      >
        {isCompleted ? (
          <Star size={20} fill="#FFFFFF" />
        ) : !isUnlocked ? (
          <Lock size={18} />
        ) : (
          unit.number
        )}
      </div>

      {/* Title */}
      <h3
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          color: isUnlocked ? colors.text : '#9CA3AF',
          textAlign: 'center',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      {/* Sparkle for current */}
      {isCurrent && isUnlocked && !isCompleted && (
        <Sparkles size={14} color={colors.active} />
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

  // Suppress unused — getUnitProgress is used to check completion status indirectly
  void getUnitProgress;

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
          padding: '24px 20px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <LottieCharacter
            state={PHASE_LOTTIE[activePhaseId] ?? 'idle'}
            size={48}
          />
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 800,
            color: '#1F2937',
            letterSpacing: -0.5,
          }}
        >
          {lang === 'tr' ? 'Ogren' : 'Learn'}
        </h1>
      </motion.div>

      {/* ── Phase Buttons (big colorful) ─────────────────── */}
      <div
        style={{
          padding: '0 20px 12px',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 10,
            minWidth: 'max-content',
          }}
        >
          {phases.map((phase) => (
            <PhaseButton
              key={phase.id}
              phase={phase}
              isActive={activePhaseId === phase.id}
              onClick={() => setActivePhaseId(phase.id)}
              lang={lang}
            />
          ))}
        </div>
      </div>

      {/* ── Unit Cards Grid ────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          padding: '8px 20px 32px',
          overflowY: 'auto',
        }}
      >
        <motion.div
          key={activePhaseId}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={gentleSpring}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 12,
          }}
        >
          {activePhase.units.map((unit, idx) => (
            <SimpleUnitCard
              key={unit.id}
              unit={unit}
              phase={activePhase}
              index={idx}
              lang={lang}
              isCompleted={isUnitCompleted(unit.id)}
              isUnlocked={isUnitUnlocked(unit.id)}
              isCurrent={unit.id === currentUnitId}
            />
          ))}
        </motion.div>

        {/* Empty state if no units */}
        {activePhase.units.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 48,
              color: '#9CA3AF',
            }}
          >
            <LottieCharacter state="idle" size={80} />
            <p style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>
              {lang === 'tr' ? 'Henuz ders yok.' : 'No lessons yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
