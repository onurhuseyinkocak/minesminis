/**
 * WORLD DETAIL — Individual World Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId
 * Shows the world header, lesson list, and vocabulary preview.
 * Uses real curriculum data and progress tracking.
 */
import { useParams, Link } from 'react-router-dom';
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
} from 'lucide-react';
import { Card, ProgressBar, Button, Badge } from '../components/ui';
import { useAuth } from '../contexts/AuthContext';
import { getWorldById } from '../data/curriculum';
import type { Lesson } from '../data/curriculum';
import {
  isLessonAvailable,
  getWorldCompletionCount,
} from '../data/progressTracker';
import { getProgress } from '../data/progressTracker';
import './WorldDetail.css';

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
  const userId = user?.uid || 'guest';

  const world = getWorldById(worldId || '');

  if (!world) {
    return (
      <div className="world-detail-page world-detail-page--not-found">
        <h2>World not found</h2>
        <Link to="/worlds">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Worlds</Button>
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
        All Worlds
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
        <span className="world-detail-header__icon">{world.icon}</span>
        <div className="world-detail-header__info">
          <h1 className="world-detail-header__name">{world.name}</h1>
          <p className="world-detail-header__theme">{world.theme}</p>
          <div className="world-detail-header__progress">
            <ProgressBar value={progressPct} size="sm" variant="default" showLabel />
            <span className="world-detail-header__count">
              {completedCount}/{world.lessons.length} lessons completed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Vocabulary Preview */}
      <section className="world-detail-vocab">
        <h2 className="world-detail-section-title">Vocabulary Preview</h2>
        <div className="world-detail-vocab__scroll">
          {vocabPreview.map((v, i) => (
            <div key={i} className="vocab-preview-card">
              <span className="vocab-preview-card__emoji">{v.emoji}</span>
              <span className="vocab-preview-card__word">{v.english}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lesson List */}
      <section className="world-detail-lessons">
        <h2 className="world-detail-section-title">Lessons</h2>
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
}

function LessonCard({ lesson, cfg, TypeIcon, isAvailable, isCompleted, isLocked }: LessonCardProps) {
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
        <h3 className="lesson-card__title">{lesson.title}</h3>
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
            Start
          </Button>
        )}
        {isCompleted && (
          <span className="lesson-card__done-badge">
            <Check size={14} /> Done
          </span>
        )}
        {isLocked && (
          <Lock size={18} className="lesson-card__lock-icon" />
        )}
      </div>
    </Card>
  );
}

export default WorldDetail;
