/**
 * WORLD DETAIL — Individual World Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId
 * Shows the world header, lesson list, and vocabulary preview.
 * Uses real curriculum data and progress tracking.
 */
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Check,
  Play,
  Clock,
  Star,
  Music,
  Gamepad2,
  BookOpen,
  Layers,
  Mic,
  HelpCircle,
  Globe,
  Home,
  PawPrint,
  Palette,
  Apple,
  Activity,
  TreePine,
  Gem,
  GraduationCap,
  MapPin,
  BookMarked,
  Plane,
  Ear,
  Building2,
  type LucideIcon,
} from 'lucide-react';

// World ID → Lucide icon mapping (replaces emoji world.icon)
const WORLD_ICON_MAP: Record<string, LucideIcon> = {
  w1: Globe,
  w2: Home,
  w3: PawPrint,
  w4: Palette,
  w5: Apple,
  w6: Activity,
  w7: TreePine,
  w8: Gem,
  w9: GraduationCap,
  w10: MapPin,
  w11: BookMarked,
  w12: Plane,
};

// Phase ID → Lucide icon mapping (replaces emoji phase.icon)
const PHASE_ICON_MAP: Record<string, LucideIcon> = {
  'little-ears': Ear,
  'word-builders': Building2,
  'story-makers': BookMarked,
  'young-explorers': Globe,
};

function WorldIcon({ worldId, size = 40 }: { worldId: string; size?: number }) {
  const Icon = WORLD_ICON_MAP[worldId] || Globe;
  return <Icon size={size} color="currentColor" />;
}

function PhaseIcon({ phaseId, size = 40 }: { phaseId: string; size?: number }) {
  const Icon = PHASE_ICON_MAP[phaseId] || BookOpen;
  return <Icon size={size} color="currentColor" />;
}
import { Card, ProgressBar, Button, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { getWorldById } from '../data/curriculum';
import type { Lesson } from '../data/curriculum';
import { hasPassedCheckpoint, getCheckpointResult } from '../services/phaseCheckpointService';
import {
  isLessonAvailable,
  getWorldCompletionCount,
} from '../data/progressTracker';
import { getProgress } from '../data/progressTracker';
import { PHASES, type LearningUnit, type LearningPhase } from '../data/curriculumPhases';
import './WorldDetail.css';

// ============================================================
// CURRICULUM PHASE UNIT LOOKUP HELPERS
// ============================================================

/** Find a LearningUnit and its parent LearningPhase by unit ID (e.g. 'p1-u1') */
function getUnitAndPhaseById(unitId: string): { unit: LearningUnit; phase: LearningPhase } | undefined {
  for (const phase of PHASES) {
    const unit = phase.units.find((u) => u.id === unitId);
    if (unit) return { unit, phase };
  }
  return undefined;
}

// ============================================================
// TYPE BADGE CONFIG
// ============================================================

const TYPE_CONFIG: Record<string, { icon: typeof Play; label: string; variant: string }> = {
  vocabulary: { icon: Layers,     label: 'Vocabulary', variant: 'warning' },
  phonics:    { icon: Music,      label: 'Phonics',    variant: 'info' },
  grammar:    { icon: BookOpen,   label: 'Grammar',    variant: 'success' },
  story:      { icon: BookOpen,   label: 'Story',      variant: 'premium' },
  review:     { icon: HelpCircle, label: 'Review',     variant: 'error' },
  // Activity-level types (if used as lesson types)
  song:       { icon: Music,      label: 'Song',       variant: 'info' },
  game:       { icon: Gamepad2,   label: 'Game',       variant: 'success' },
  flashcard:  { icon: Layers,     label: 'Flashcard',  variant: 'warning' },
  practice:   { icon: Mic,        label: 'Practice',   variant: 'default' },
  quiz:       { icon: HelpCircle, label: 'Quiz',       variant: 'error' },
};

function getTypeConfig(type: string) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.vocabulary;
}

// ============================================================
// ANIMATION
// ============================================================

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ============================================================
// COMPONENT
// ============================================================

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const { user } = useAuth();
  const { t, lang } = useLanguage();
  usePageTitle('Dünya Detayı', 'World Detail');
  const userId = user?.uid || 'guest';

  const world = getWorldById(worldId || '');

  // If not found in the old World curriculum, try the new curriculumPhases system
  const phaseUnitMatch = !world ? getUnitAndPhaseById(worldId || '') : undefined;

  if (!world && phaseUnitMatch) {
    // Render a unit detail view for the new curriculum phases system
    return <UnitDetailView unit={phaseUnitMatch.unit} phase={phaseUnitMatch.phase} lang={lang} />;
  }

  if (!world) {
    return (
      <div className="world-detail-page world-detail-page--not-found">
        <h2>{t('worlds.notFound')}</h2>
        <Link to="/worlds">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>{t('worlds.backToWorlds')}</Button>
        </Link>
      </div>
    );
  }

  const progress = getProgress(userId);
  const completedCount = getWorldCompletionCount(userId, world.id);
  const progressPct = world.lessons.length > 0
    ? Math.round((completedCount / world.lessons.length) * 100)
    : 0;

  // Build vocab preview from real curriculum data (first 8 words)
  const vocabPreview = world.vocabulary.slice(0, 8);

  return (
    <div className="world-detail-page">
      {/* Back */}
      <Link to="/worlds" className="world-detail-back">
        <ArrowLeft size={18} />
        {t('worlds.allWorlds')}
      </Link>

      {/* World Header */}
      <motion.div
        className="world-detail-header"
        style={{
          background: `linear-gradient(135deg, ${world.color}, ${world.gradientTo})`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="world-detail-header__icon"><WorldIcon worldId={world.id} size={40} /></span>
        <div className="world-detail-header__info">
          <h1 className="world-detail-header__name">{lang === 'tr' ? world.nameTr : world.name}</h1>
          <p className="world-detail-header__theme">{lang === 'tr' ? world.descriptionTr : world.theme}</p>
          <div className="world-detail-header__progress">
            <ProgressBar value={progressPct} size="sm" variant="default" showLabel />
            <span className="world-detail-header__count">
              {completedCount}/{world.lessons.length} {t('lesson.lessonsCompleted')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Vocabulary Preview */}
      <section className="world-detail-vocab">
        <h2 className="world-detail-section-title">{t('worlds.vocabularyPreview')}</h2>
        <div className="world-detail-vocab__scroll">
          {vocabPreview.map((v) => (
            <div key={v.english} className="vocab-preview-card">
              <div className="vocab-preview-card__letter">{v.english.charAt(0).toUpperCase()}</div>
              <span className="vocab-preview-card__word">{v.english}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lesson List */}
      <section className="world-detail-lessons">
        <h2 className="world-detail-section-title">{t('worlds.lessons')}</h2>
        <motion.div
          className="world-detail-lessons__list"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {world.lessons.map((lesson) => {
            const isCompleted = !!progress.completedLessons[lesson.id];
            const isAvail = isLessonAvailable(userId, world.id, lesson.id);
            const isLocked = !isCompleted && !isAvail;
            const cfg = getTypeConfig(lesson.type);
            const TypeIcon = cfg.icon;

            return (
              <motion.div key={lesson.id} variants={itemVariants}>
                {isAvail ? (
                  <Link
                    to={`/worlds/${world.id}/lessons/${lesson.id}`}
                    className="lesson-card-link"
                  >
                    <LessonCard
                      lesson={lesson}
                      cfg={cfg}
                      TypeIcon={TypeIcon}
                      isAvailable={isAvail}
                      isCompleted={isCompleted}
                      isLocked={isLocked}
                      t={t}
                      lang={lang}
                    />
                  </Link>
                ) : (
                  <div className={`lesson-card-link ${isLocked ? 'lesson-card-link--locked' : ''}`}>
                    <LessonCard
                      lesson={lesson}
                      cfg={cfg}
                      TypeIcon={TypeIcon}
                      isAvailable={isAvail}
                      isCompleted={isCompleted}
                      isLocked={isLocked}
                      t={t}
                      lang={lang}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// LESSON CARD
// ============================================================

interface LessonCardProps {
  lesson: Lesson;
  cfg: { icon: typeof Play; label: string; variant: string };
  TypeIcon: typeof Play;
  isAvailable: boolean;
  isCompleted: boolean;
  isLocked: boolean;
  t: (key: string) => string;
  lang: string;
}

function LessonCard({ lesson, cfg, TypeIcon, isAvailable, isCompleted, isLocked, t, lang }: LessonCardProps) {
  return (
    <Card
      variant={isAvailable ? 'interactive' : 'default'}
      padding="md"
      className={[
        'lesson-card',
        isCompleted && 'lesson-card--completed',
        isLocked && 'lesson-card--locked',
        isAvailable && 'lesson-card--available',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Number */}
      <div className={`lesson-card__number ${isCompleted ? 'lesson-card__number--done' : ''}`}>
        {isCompleted ? <Check size={18} /> : isLocked ? <Lock size={16} /> : lesson.number}
      </div>

      {/* Info */}
      <div className="lesson-card__info">
        <h3 className="lesson-card__title">{lang === 'tr' ? lesson.titleTr : lesson.title}</h3>
        <div className="lesson-card__meta">
          <Badge
            variant={cfg.variant as 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'}
            size="sm"
            icon={<TypeIcon size={12} />}
          >
            {cfg.label}
          </Badge>
          <span className="lesson-card__duration">
            <Clock size={12} /> {lesson.duration} min
          </span>
          <span className="lesson-card__xp">
            <Star size={12} /> {lesson.xpReward} XP
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="lesson-card__status">
        {isAvailable && !isCompleted && (
          <Button variant="primary" size="sm" icon={<Play size={14} />}>
            {t('worlds.start')}
          </Button>
        )}
        {isCompleted && (
          <span className="lesson-card__done-badge">
            <Check size={14} /> {t('worlds.complete')}
          </span>
        )}
        {isLocked && (
          <Lock size={18} className="lesson-card__lock-icon" />
        )}
      </div>
    </Card>
  );
}

// ============================================================
// UNIT DETAIL VIEW — for new curriculumPhases units (p1-u1, p2-u3, etc.)
// ============================================================

interface UnitDetailViewProps {
  unit: LearningUnit;
  phase: LearningPhase;
  lang: string;
}

function UnitDetailView({ unit, phase, lang }: UnitDetailViewProps) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  // Read progress from localStorage
  let activitiesCompleted = 0;
  try {
    const raw = localStorage.getItem(`mimi_unit_progress_${unit.id}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      activitiesCompleted = parsed.activitiesCompleted || 0;
    }
  } catch { /* ignore */ }

  const totalActivities = unit.activities.length;
  const progressPct = totalActivities > 0 ? Math.round((activitiesCompleted / totalActivities) * 100) : 0;

  // Phase checkpoint state
  const phaseIndex = PHASES.findIndex(p => p.id === phase.id);
  const checkpointPassed = phaseIndex >= 0 ? hasPassedCheckpoint(phaseIndex) : false;
  const checkpointResult = phaseIndex >= 0 ? getCheckpointResult(phaseIndex) : null;

  const activityTypeConfig: Record<string, { label: string; icon: typeof Play }> = {
    'sound-intro':    { label: 'Sound Intro', icon: Music },
    'blending':       { label: 'Blending', icon: Layers },
    'segmenting':     { label: 'Segmenting', icon: Layers },
    'word-match':     { label: 'Word Match', icon: BookOpen },
    'listening':      { label: 'Listening', icon: Mic },
    'pronunciation':  { label: 'Pronunciation', icon: Mic },
    'tpr':            { label: 'TPR Actions', icon: Play },
    'reading':        { label: 'Reading', icon: BookOpen },
    'spelling':       { label: 'Spelling', icon: BookOpen },
    'story':          { label: 'Story', icon: BookOpen },
    'song':           { label: 'Song', icon: Music },
  };

  return (
    <div className="world-detail-page">
      {/* Back */}
      <Link to="/worlds" className="world-detail-back">
        <ArrowLeft size={18} />
        {t('worlds.backToWorldMap')}
      </Link>

      {/* Unit Header */}
      <motion.div
        className="world-detail-header"
        style={{ background: `linear-gradient(135deg, ${phase.color}, ${phase.color}99)` }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="world-detail-header__icon"><PhaseIcon phaseId={phase.id} size={40} /></span>
        <div className="world-detail-header__info">
          <h1 className="world-detail-header__name">
            {lang === 'tr' ? unit.titleTr : unit.title}
          </h1>
          <p className="world-detail-header__theme">{phase.name} · Unit {unit.number}</p>
          <div className="world-detail-header__progress">
            <ProgressBar value={progressPct} size="sm" variant="default" showLabel />
            <span className="world-detail-header__count">
              {activitiesCompleted}/{totalActivities} {t('worlds.activitiesCompleted')}
            </span>
          </div>
          {checkpointPassed && (
            <span className="wd-checkpoint-badge">Seviye Testi Gecildi</span>
          )}
          {checkpointResult && !checkpointPassed && (
            <span className="wd-checkpoint-badge wd-checkpoint-badge--failed">
              Test: {checkpointResult.score}/{checkpointResult.total} — Tekrar dene
            </span>
          )}
        </div>
      </motion.div>

      {/* Phonics Focus */}
      {unit.phonicsFocus.length > 0 && (
        <section className="world-detail-vocab">
          <h2 className="world-detail-section-title">{t('worlds.phonicsFocus')}</h2>
          <div className="world-detail-vocab__scroll">
            {unit.phonicsFocus.map((sound) => (
              <div key={sound} className="vocab-preview-card">
                <div className="vocab-preview-card__letter">{sound.replace(/^g\d+_/, '').charAt(0).toUpperCase()}</div>
                <span className="vocab-preview-card__word">{sound.replace(/^g\d+_/, '')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Activities List */}
      <section className="world-detail-lessons">
        <h2 className="world-detail-section-title">{t('worlds.activities')}</h2>
        <motion.div
          className="world-detail-lessons__list"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {unit.activities.map((activity, idx) => {
            const cfg = activityTypeConfig[activity.type] || activityTypeConfig['tpr'];
            const ActivityIcon = cfg.icon;
            const isDone = idx < activitiesCompleted;
            const isCurrent = idx === activitiesCompleted;

            return (
              <motion.div key={`${activity.type}-${idx}`} variants={itemVariants}>
                <Card
                  variant={isCurrent ? 'interactive' : 'default'}
                  padding="md"
                  className={[
                    'lesson-card',
                    isDone && 'lesson-card--completed',
                    !isDone && !isCurrent && 'lesson-card--locked',
                    isCurrent && 'lesson-card--available',
                  ].filter(Boolean).join(' ')}
                >
                  {/* Number */}
                  <div className={`lesson-card__number ${isDone ? 'lesson-card__number--done' : ''}`}>
                    {isDone ? <Check size={18} /> : !isCurrent ? <Lock size={16} /> : idx + 1}
                  </div>

                  {/* Info */}
                  <div className="lesson-card__info">
                    <h3 className="lesson-card__title">
                      {lang === 'tr' ? activity.titleTr : activity.title}
                    </h3>
                    <div className="lesson-card__meta">
                      <Badge
                        variant="info"
                        size="sm"
                        icon={<ActivityIcon size={12} />}
                      >
                        {cfg.label}
                      </Badge>
                      <span className="lesson-card__duration">
                        <Clock size={12} /> {activity.duration} min
                      </span>
                      <span className="lesson-card__xp">
                        <Star size={12} /> {activity.xp} XP
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="lesson-card__status">
                    {isCurrent && (
                      <Button variant="primary" size="sm" icon={<Play size={14} />} onClick={() => navigate(`/worlds/${unit.id}/lessons/${idx}`)}>
                        {t('worlds.start')}
                      </Button>
                    )}
                    {isDone && (
                      <span className="lesson-card__done-badge">
                        <Check size={14} /> {t('worlds.complete')}
                      </span>
                    )}
                    {!isDone && !isCurrent && (
                      <Lock size={18} className="lesson-card__lock-icon" />
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
}

export default WorldDetail;
