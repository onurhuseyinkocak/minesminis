// ============================================================
// MinesMinis — WorldDetail Page
// Unit detail page with activity timeline
// Supports both phase units (p1-u1) and legacy worlds (w1)
// ============================================================

import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Check,
  Star,
  ChevronRight,
  Play,
  Volume2,
  BookOpen,
  Music,
  Mic,
  Headphones,
  PenTool,
  Sparkles,
  Scissors,
  Grid3X3,
  PersonStanding,
  BookOpenCheck,
  Zap,
  Clock,
  type LucideIcon,
} from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  getUnitById,
  getPhaseForUnit,
  getNextUnit,
  getWorldById,
} from '../services/curriculumService';
import type { UnitActivity } from '../data/curriculumPhases';
import type { World, Lesson } from '../data/curriculum';

// ── Activity type icon mapping ──────────────────────────────

const ACTIVITY_ICON_MAP: Record<UnitActivity['type'], LucideIcon> = {
  'sound-intro': Volume2,
  'blending': Sparkles,
  'segmenting': Scissors,
  'word-match': Grid3X3,
  'listening': Headphones,
  'pronunciation': Mic,
  'tpr': PersonStanding,
  'reading': BookOpen,
  'spelling': PenTool,
  'story': BookOpenCheck,
  'song': Music,
};

// ── Lesson type badge colors (legacy) ───────────────────────

const LESSON_TYPE_COLORS: Record<string, string> = {
  vocabulary: '#4ECDC4',
  phonics: '#FF6B6B',
  grammar: '#45B7D1',
  story: '#96CEB4',
  review: '#DDA0DD',
};

// ── Spring animation config ─────────────────────────────────

const springTransition = { type: 'spring' as const, stiffness: 300, damping: 24 };
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const staggerItem = {
  hidden: { opacity: 0, x: -24 },
  show: { opacity: 1, x: 0, transition: springTransition },
};

// ── Main component ──────────────────────────────────────────

export default function WorldDetail() {
  const { worldId } = useParams<{ worldId: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { getUnitProgress, isUnitCompleted, getCurrentActivityIndex } = useProgress();

  // Determine if this is a phase unit or legacy world
  const isLegacy = worldId?.startsWith('w') ?? false;

  const unit = useMemo(() => (worldId && !isLegacy ? getUnitById(worldId) : null), [worldId, isLegacy]);
  const phase = useMemo(() => (worldId && !isLegacy ? getPhaseForUnit(worldId) : null), [worldId, isLegacy]);
  const nextUnit = useMemo(() => (worldId && !isLegacy ? getNextUnit(worldId) : null), [worldId, isLegacy]);
  const legacyWorld = useMemo(() => (worldId && isLegacy ? getWorldById(worldId) : null), [worldId, isLegacy]);

  // Page title
  const titleTr = unit?.titleTr ?? legacyWorld?.nameTr ?? '';
  const titleEn = unit?.title ?? legacyWorld?.name ?? '';
  usePageTitle(titleTr, titleEn);

  // Progress
  const progress = worldId ? getUnitProgress(worldId) : 0;
  const completed = worldId ? isUnitCompleted(worldId) : false;
  const currentActivityIdx = worldId ? getCurrentActivityIndex(worldId) : 0;

  // 404
  if (!unit && !legacyWorld) {
    return <NotFoundState />;
  }

  // Legacy world → card grid
  if (isLegacy && legacyWorld) {
    return <LegacyWorldView world={legacyWorld} lang={lang} />;
  }

  // Phase unit → timeline
  if (!unit || !phase) return <NotFoundState />;

  const phaseColor = phase.color;
  const unitTitle = lang === 'tr' ? unit.titleTr : unit.title;
  const phaseName = lang === 'tr' ? phase.nameTr : phase.name;

  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 64px)',
        background: '#FAFBFC',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Header ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        style={{
          background: `linear-gradient(135deg, ${phaseColor}22 0%, ${phaseColor}08 100%)`,
          borderBottom: `2px solid ${phaseColor}33`,
          padding: '20px 24px 24px',
        }}
      >
        {/* Back button */}
        <Link
          to="/worlds"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#555',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
            padding: '8px 0',
            minHeight: 48,
          }}
        >
          <ArrowLeft size={18} />
          <span>{lang === 'tr' ? 'Haritaya Don' : 'Back to Map'}</span>
        </Link>

        {/* Unit number badge + title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springTransition, delay: 0.1 }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: phaseColor,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {unit.number}
          </motion.div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: '#1a1a2e',
                lineHeight: 1.25,
              }}
            >
              {unitTitle}
            </h1>
            <span
              style={{
                display: 'inline-block',
                marginTop: 4,
                padding: '3px 10px',
                borderRadius: 999,
                background: `${phaseColor}20`,
                color: phaseColor,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {phaseName}
            </span>
          </div>
        </div>

        {/* Phonics focus chips */}
        {unit.phonicsFocus.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {unit.phonicsFocus.map((p) => (
              <span
                key={p}
                style={{
                  padding: '2px 8px',
                  borderRadius: 6,
                  background: '#fff',
                  border: `1px solid ${phaseColor}44`,
                  fontSize: 11,
                  color: '#555',
                  fontWeight: 500,
                }}
              >
                {p.replace(/^g\d+_/, '/')}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── Activity Timeline ───────────────────── */}
      <div style={{ flex: 1, padding: '24px 16px', maxWidth: 520, margin: '0 auto', width: '100%' }}>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          style={{ position: 'relative' }}
        >
          {/* Vertical connecting line */}
          <div
            style={{
              position: 'absolute',
              left: 19,
              top: 24,
              bottom: 24,
              width: 3,
              background: `linear-gradient(180deg, ${phaseColor}44, ${phaseColor}11)`,
              borderRadius: 2,
            }}
          />

          {unit.activities.map((activity, idx) => {
            const isActivityCompleted = idx < currentActivityIdx || completed;
            const isCurrent = idx === currentActivityIdx && !completed;
            const isLocked = idx > currentActivityIdx && !completed;
            const IconComponent = ACTIVITY_ICON_MAP[activity.type] ?? Zap;
            const activityTitle = lang === 'tr' ? activity.titleTr : activity.title;

            return (
              <motion.div
                key={idx}
                variants={staggerItem}
                style={{
                  display: 'flex',
                  gap: 14,
                  marginBottom: idx < unit.activities.length - 1 ? 12 : 0,
                  position: 'relative',
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: isActivityCompleted
                      ? '#22C55E'
                      : isCurrent
                        ? phaseColor
                        : '#E5E7EB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 1,
                    boxShadow: isCurrent ? `0 0 0 4px ${phaseColor}33` : 'none',
                  }}
                >
                  {isActivityCompleted ? (
                    <Check size={18} color="#fff" strokeWidth={3} />
                  ) : isLocked ? (
                    <Lock size={16} color="#9CA3AF" />
                  ) : (
                    <IconComponent size={18} color="#fff" />
                  )}
                </div>

                {/* Activity card */}
                <motion.button
                  onClick={() => {
                    if (!isLocked) {
                      navigate(`/worlds/${worldId}/lessons/${idx}`);
                    }
                  }}
                  disabled={isLocked}
                  whileHover={!isLocked ? { scale: 1.02 } : undefined}
                  whileTap={!isLocked ? { scale: 0.98 } : undefined}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 14px',
                    borderRadius: 14,
                    border: isActivityCompleted
                      ? '2px solid #22C55E44'
                      : isCurrent
                        ? `2px solid ${phaseColor}`
                        : '2px solid #E5E7EB',
                    background: isLocked ? '#F9FAFB' : '#fff',
                    opacity: isLocked ? 0.55 : 1,
                    cursor: isLocked ? 'not-allowed' : 'pointer',
                    textAlign: 'left',
                    outline: 'none',
                    minHeight: 48,
                    boxShadow: isCurrent ? `0 4px 16px ${phaseColor}22` : '0 1px 3px rgba(0,0,0,0.04)',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        color: isLocked ? '#9CA3AF' : '#1a1a2e',
                        lineHeight: 1.3,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {activityTitle}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginTop: 4,
                        fontSize: 12,
                        color: '#9CA3AF',
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Star size={12} />
                        {activity.xp} XP
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Clock size={12} />
                        {activity.duration} min
                      </span>
                    </div>
                  </div>

                  {/* Right side: CTA or status */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        background: phaseColor,
                        flexShrink: 0,
                      }}
                    >
                      <Play size={18} color="#fff" fill="#fff" />
                    </motion.div>
                  )}
                  {isActivityCompleted && (
                    <Check size={20} color="#22C55E" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                  )}
                  {isLocked && (
                    <ChevronRight size={18} color="#D1D5DB" style={{ flexShrink: 0 }} />
                  )}
                </motion.button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Bottom Section ──────────────────────── */}
      <div
        style={{
          padding: '16px 16px 24px',
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Progress bar */}
        <div style={{ marginBottom: nextUnit ? 16 : 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 6,
              fontSize: 13,
              fontWeight: 600,
              color: '#555',
            }}
          >
            <span>{lang === 'tr' ? 'Ilerleme' : 'Progress'}</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div
            style={{
              height: 10,
              borderRadius: 5,
              background: '#E5E7EB',
              overflow: 'hidden',
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ ...springTransition, delay: 0.3 }}
              style={{
                height: '100%',
                borderRadius: 5,
                background: completed
                  ? '#22C55E'
                  : `linear-gradient(90deg, ${phaseColor}, ${phaseColor}CC)`,
              }}
            />
          </div>
        </div>

        {/* Next unit card */}
        {nextUnit && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springTransition, delay: 0.4 }}
          >
            <Link
              to={`/worlds/${nextUnit.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid #E5E7EB',
                textDecoration: 'none',
                minHeight: 48,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: '#F3F4F6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: 14,
                  color: '#9CA3AF',
                  flexShrink: 0,
                }}
              >
                {nextUnit.number}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                  {lang === 'tr' ? 'Siradaki Unite' : 'Next Unit'}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: '#1a1a2e',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {lang === 'tr' ? nextUnit.titleTr : nextUnit.title}
                </div>
              </div>
              <ChevronRight size={18} color="#9CA3AF" style={{ flexShrink: 0 }} />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// ── Legacy World View ───────────────────────────────────────

function LegacyWorldView({
  world,
  lang,
}: {
  world: World;
  lang: string;
}) {
  const worldName = lang === 'tr' ? world.nameTr : world.name;
  const worldDesc = lang === 'tr' ? world.descriptionTr : world.description;

  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 64px)',
        background: '#FAFBFC',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springTransition}
        style={{
          background: `linear-gradient(135deg, ${world.gradientFrom}22 0%, ${world.gradientTo}08 100%)`,
          borderBottom: `2px solid ${world.color}33`,
          padding: '20px 24px 24px',
        }}
      >
        <Link
          to="/worlds"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#555',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            marginBottom: 16,
            padding: '8px 0',
            minHeight: 48,
          }}
        >
          <ArrowLeft size={18} />
          <span>{lang === 'tr' ? 'Haritaya Don' : 'Back to Map'}</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: world.color,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {world.number}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 700,
                color: '#1a1a2e',
                lineHeight: 1.25,
              }}
            >
              {worldName}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#777', lineHeight: 1.4 }}>
              {worldDesc}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Lesson cards grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        style={{
          flex: 1,
          padding: '24px 16px',
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
          alignContent: 'start',
        }}
      >
        {world.lessons.map((lesson, idx) => (
          <LegacyLessonCard
            key={lesson.id}
            lesson={lesson}
            index={idx}
            worldId={world.id}
            lang={lang}
          />
        ))}
      </motion.div>
    </div>
  );
}

function LegacyLessonCard({
  lesson,
  index,
  worldId,
  lang,
}: {
  lesson: Lesson;
  index: number;
  worldId: string;
  lang: string;
}) {
  const badgeColor = LESSON_TYPE_COLORS[lesson.type] ?? '#888';
  const lessonTitle = lang === 'tr' ? lesson.titleTr : lesson.title;

  return (
    <motion.div variants={staggerItem}>
      <Link
        to={`/worlds/${worldId}/lessons/${index}`}
        style={{
          display: 'block',
          padding: '14px 16px',
          borderRadius: 14,
          background: '#fff',
          border: '1px solid #E5E7EB',
          textDecoration: 'none',
          minHeight: 48,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span
            style={{
              padding: '2px 8px',
              borderRadius: 6,
              background: `${badgeColor}18`,
              color: badgeColor,
              fontSize: 11,
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {lesson.type}
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: '#1a1a2e',
            lineHeight: 1.35,
            marginBottom: 8,
          }}
        >
          {lessonTitle}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: '#9CA3AF' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Star size={12} />
            {lesson.xpReward} XP
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Clock size={12} />
            {lesson.duration} min
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Not Found State ─────────────────────────────────────────

function NotFoundState() {
  return (
    <div
      style={{
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        textAlign: 'center',
        background: '#FAFBFC',
      }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={springTransition}
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#FEE2E2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
        }}
      >
        <BookOpen size={32} color="#EF4444" />
      </motion.div>
      <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
        Unit Not Found
      </h2>
      <p style={{ margin: '0 0 24px', fontSize: 14, color: '#777' }}>
        This unit doesn&apos;t exist or hasn&apos;t been unlocked yet.
      </p>
      <Link
        to="/worlds"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '12px 24px',
          borderRadius: 12,
          background: '#4ECDC4',
          color: '#fff',
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 14,
          minHeight: 48,
        }}
      >
        <ArrowLeft size={16} />
        Back to Map
      </Link>
    </div>
  );
}
