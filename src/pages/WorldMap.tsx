// ============================================================
// MinesMinis — WorldMap (Learn Page)
// Kid-themed design: Mimi mascot, speech bubble, big colorful
// phase buttons and chunky unit cards (Khan Academy Kids style)
// ============================================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Star } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getDisplayPhases } from '../services/curriculumService';
import LottieCharacter from '../components/LottieCharacter';
import type { LearningPhase, LearningUnit } from '../data/curriculumPhases';

// ── Constants ────────────────────────────────────────────────

const PHASE_STYLES: Record<string, {
  gradient: string;
  cardGradient: string;
  completedGradient: string;
  lockedGradient: string;
  activeRing: string;
}> = {
  'little-ears': {
    gradient: 'from-orange-500 to-amber-500',
    cardGradient: 'from-orange-500 to-rose-500',
    completedGradient: 'from-emerald-500 to-green-500',
    lockedGradient: 'from-gray-300 to-gray-400',
    activeRing: 'ring-orange-400',
  },
  'word-builders': {
    gradient: 'from-blue-500 to-cyan-500',
    cardGradient: 'from-blue-500 to-indigo-500',
    completedGradient: 'from-emerald-500 to-green-500',
    lockedGradient: 'from-gray-300 to-gray-400',
    activeRing: 'ring-blue-400',
  },
  'story-makers': {
    gradient: 'from-emerald-500 to-teal-500',
    cardGradient: 'from-emerald-500 to-cyan-500',
    completedGradient: 'from-emerald-500 to-green-500',
    lockedGradient: 'from-gray-300 to-gray-400',
    activeRing: 'ring-emerald-400',
  },
  'young-explorers': {
    gradient: 'from-purple-500 to-violet-500',
    cardGradient: 'from-purple-500 to-pink-500',
    completedGradient: 'from-emerald-500 to-green-500',
    lockedGradient: 'from-gray-300 to-gray-400',
    activeRing: 'ring-purple-400',
  },
};

const DEFAULT_STYLE = {
  gradient: 'from-gray-500 to-gray-600',
  cardGradient: 'from-gray-500 to-gray-600',
  completedGradient: 'from-emerald-500 to-green-500',
  lockedGradient: 'from-gray-300 to-gray-400',
  activeRing: 'ring-gray-400',
};

const PHASE_LOTTIE: Record<string, string> = {
  'little-ears': 'idle',
  'word-builders': 'happy',
  'story-makers': 'talk',
  'young-explorers': 'star',
};

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };
const gentleSpring = { type: 'spring' as const, stiffness: 200, damping: 20 };

// ── Phase Button (BIG chunky gradient) ───────────────────────

function PhaseButton({ phase, isActive, onClick, lang }: {
  phase: LearningPhase;
  isActive: boolean;
  onClick: () => void;
  lang: string;
}) {
  const style = PHASE_STYLES[phase.id] ?? DEFAULT_STYLE;
  const label = lang === 'tr' ? phase.nameTr : phase.name;

  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.93 }}
      transition={springTransition}
      className={`
        flex items-center justify-center gap-2
        rounded-[24px] border-4 font-extrabold text-base
        cursor-pointer whitespace-nowrap min-h-[56px] px-6 py-3
        transition-all duration-200 outline-none
        ${isActive
          ? `bg-gradient-to-r ${style.gradient} text-white border-white/30 shadow-lg`
          : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
        }
      `}
    >
      {label}
    </motion.button>
  );
}

// ── Unit Card (big, chunky, kid-friendly) ─────────────────────

function KidUnitCard({ unit, phase, index, lang, isCompleted, isUnlocked, isCurrent }: {
  unit: LearningUnit;
  phase: LearningPhase;
  index: number;
  lang: string;
  isCompleted: boolean;
  isUnlocked: boolean;
  isCurrent: boolean;
}) {
  const style = PHASE_STYLES[phase.id] ?? DEFAULT_STYLE;
  const title = lang === 'tr' ? unit.titleTr : unit.title;

  const gradientClass = isCompleted
    ? style.completedGradient
    : !isUnlocked
      ? style.lockedGradient
      : style.cardGradient;

  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ ...gentleSpring, delay: index * 0.05 }}
      whileTap={isUnlocked ? { scale: 0.93 } : undefined}
      className={`
        rounded-[28px] flex flex-col items-center justify-center
        text-white bg-gradient-to-br ${gradientClass}
        border-4 border-white/20 shadow-lg
        relative overflow-hidden
        ${!isUnlocked ? 'opacity-50' : 'cursor-pointer'}
        ${isCurrent ? `kid-pulse ring-4 ${style.activeRing}` : ''}
      `}
      style={{ minHeight: 130, padding: 16 }}
    >
      {/* Status icon */}
      <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mb-2">
        {isCompleted ? (
          <Star size={28} fill="white" className="text-white" />
        ) : !isUnlocked ? (
          <Lock size={24} className="text-white/80" />
        ) : (
          <span className="text-3xl font-black text-white drop-shadow-sm">
            {unit.number}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="text-sm font-extrabold text-center leading-tight text-white drop-shadow-sm m-0">
        {title}
      </h3>
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
  const { isUnitCompleted, isUnitUnlocked, currentUnitId } = useProgress();
  usePageTitle('Ogren', 'Learn');

  const phases = useMemo(() => getDisplayPhases(), []);

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

  const isTr = lang === 'tr';

  return (
    <div className="kid-bg kid-bubbles pb-24" style={{ minHeight: 'calc(100dvh - 64px)' }}>
      {/* Content sits above the bubble overlay */}
      <div className="relative z-10">

        {/* Mimi mascot + speech bubble */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={gentleSpring}
          className="px-4 pt-6 pb-2 flex items-end gap-3"
        >
          <div className="shrink-0">
            <LottieCharacter
              state={PHASE_LOTTIE[activePhaseId] ?? 'idle'}
              size={80}
            />
          </div>
          <div className="kid-speech-bubble flex-1 mb-2">
            {isTr ? 'Hadi ogrenelim!' : "Let's learn!"}
          </div>
        </motion.div>

        {/* Phase Buttons — big colorful horizontal scroll */}
        <div className="px-4 pt-3 pb-2 overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
          <div className="flex gap-3" style={{ minWidth: 'max-content' }}>
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

        {/* Unit Cards Grid — 2 columns, big chunky cards */}
        <div className="px-4 pt-4 pb-8">
          <motion.div
            key={activePhaseId}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={gentleSpring}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {activePhase.units.map((unit, idx) => (
              <KidUnitCard
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
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <LottieCharacter state="idle" size={80} />
              <p className="text-gray-400 text-sm mt-4 font-medium">
                {isTr ? 'Henuz ders yok.' : 'No lessons yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
