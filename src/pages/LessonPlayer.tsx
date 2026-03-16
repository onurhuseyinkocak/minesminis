/**
 * LESSON PLAYER — Lesson Play Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId/lessons/:lessonId
 * Plays through lesson activities sequentially with progress tracking.
 * Smart-board friendly with large text and large buttons.
 */
import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  SkipForward,
  Trophy,
  Star,
  Music,
  Gamepad2,
  BookOpen,
  Layers,
  Mic,
  HelpCircle,
  Home,
  RotateCcw,
} from 'lucide-react';
import { Button, ProgressBar, Card } from '../components/ui';
import './LessonPlayer.css';

// ============================================================
// INLINE DATA (mirrors WorldDetail lesson structure)
// ============================================================

interface ActivityData {
  id: string;
  type: 'song' | 'game' | 'flashcard' | 'story' | 'practice' | 'quiz';
  title: string;
  instructions: string;
  duration: number; // minutes
}

interface LessonInfo {
  id: string;
  worldId: string;
  title: string;
  activities: ActivityData[];
  totalXP: number;
}

/** Placeholder lesson data keyed by lessonId */
function getLessonData(worldId: string, lessonId: string): LessonInfo | null {
  // For demo, generate a lesson for the first lesson of any world
  if (!lessonId) return null;

  const activities: ActivityData[] = [
    {
      id: `${lessonId}-a1`,
      type: 'song',
      title: 'Hello Song',
      instructions: 'Listen to the song and sing along with Mimi! Try to follow the words on screen.',
      duration: 3,
    },
    {
      id: `${lessonId}-a2`,
      type: 'flashcard',
      title: 'Learn New Words',
      instructions: 'Look at each card. Say the word out loud, then tap to see the answer.',
      duration: 5,
    },
    {
      id: `${lessonId}-a3`,
      type: 'game',
      title: 'Match the Words',
      instructions: 'Drag each word to the correct picture. Try to match them all!',
      duration: 5,
    },
    {
      id: `${lessonId}-a4`,
      type: 'story',
      title: 'Mimi\'s Story',
      instructions: 'Read along with Mimi. Tap the highlighted words to hear them!',
      duration: 4,
    },
    {
      id: `${lessonId}-a5`,
      type: 'practice',
      title: 'Say It!',
      instructions: 'Practice saying each word. Tap the microphone and speak clearly!',
      duration: 3,
    },
    {
      id: `${lessonId}-a6`,
      type: 'quiz',
      title: 'Quick Quiz',
      instructions: 'Answer the questions to test what you learned today!',
      duration: 4,
    },
  ];

  return {
    id: lessonId,
    worldId,
    title: lessonId.includes('l1') ? 'Say Hello!' : 'Lesson',
    activities,
    totalXP: 120,
  };
}

// ============================================================
// ACTIVITY TYPE CONFIG
// ============================================================

const ACTIVITY_ICONS: Record<string, typeof Music> = {
  song: Music,
  game: Gamepad2,
  flashcard: Layers,
  story: BookOpen,
  practice: Mic,
  quiz: HelpCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  song: 'var(--accent-blue)',
  game: 'var(--accent-emerald)',
  flashcard: 'var(--warning)',
  story: 'var(--accent-purple)',
  practice: 'var(--accent-pink)',
  quiz: 'var(--error)',
};

// ============================================================
// MIMI ENCOURAGEMENTS
// ============================================================

const ENCOURAGEMENTS = [
  { text: 'You\'re doing great!', emoji: '\u{1F31F}' },
  { text: 'Keep going, you can do it!', emoji: '\u{1F4AA}' },
  { text: 'Wonderful! I\'m proud of you!', emoji: '\u{1F60D}' },
  { text: 'Almost there, keep it up!', emoji: '\u{1F680}' },
  { text: 'You\'re a superstar!', emoji: '\u{2B50}' },
  { text: 'Amazing work, friend!', emoji: '\u{1F389}' },
];

function getEncouragement(index: number) {
  return ENCOURAGEMENTS[index % ENCOURAGEMENTS.length];
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 260, damping: 26 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
    transition: { duration: 0.25 },
  }),
};

const celebrationVariants = {
  hidden: { scale: 0.5, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { type: 'spring', stiffness: 200, damping: 15, delay: 0.2 },
  },
};

// ============================================================
// COMPONENT
// ============================================================

const LessonPlayer = () => {
  const { worldId = '', lessonId = '' } = useParams<{ worldId: string; lessonId: string }>();
  const navigate = useNavigate();

  const lesson = useMemo(() => getLessonData(worldId, lessonId), [worldId, lessonId]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);

  const totalActivities = lesson?.activities.length || 0;
  const progressPct = totalActivities > 0 ? Math.round(((currentIndex + (completed ? 1 : 0)) / totalActivities) * 100) : 0;
  const currentActivity = lesson?.activities[currentIndex];

  const handleNext = useCallback(() => {
    if (!lesson) return;
    setDirection(1);
    if (currentIndex < totalActivities - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  }, [currentIndex, totalActivities, lesson]);

  const handleSkip = useCallback(() => {
    handleNext();
  }, [handleNext]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setDirection(-1);
    setCompleted(false);
  }, []);

  // Not found
  if (!lesson) {
    return (
      <div className="lesson-player-page lesson-player-page--not-found">
        <h2>Lesson not found</h2>
        <Link to={`/worlds/${worldId}`}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to World</Button>
        </Link>
      </div>
    );
  }

  // ========== COMPLETION SCREEN ==========
  if (completed) {
    return (
      <div className="lesson-player-page">
        <motion.div
          className="lesson-complete"
          variants={celebrationVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lesson-complete__confetti" aria-hidden="true">
            {'\u{1F389}\u{1F38A}\u{2B50}\u{1F31F}\u{1F386}'}
          </div>
          <div className="lesson-complete__trophy">
            <Trophy size={64} />
          </div>
          <h1 className="lesson-complete__title">Lesson Complete!</h1>
          <p className="lesson-complete__subtitle">
            Great job! You finished all {totalActivities} activities!
          </p>

          <div className="lesson-complete__xp">
            <Star size={24} />
            <span className="lesson-complete__xp-value">+{lesson.totalXP} XP</span>
          </div>

          <div className="lesson-complete__mimi">
            <span className="lesson-complete__mimi-avatar">{'\u{1F431}'}</span>
            <p>I knew you could do it! You are amazing!</p>
          </div>

          <div className="lesson-complete__actions">
            <Button
              variant="primary"
              size="lg"
              icon={<Home size={18} />}
              onClick={() => navigate(`/worlds/${worldId}`)}
            >
              Back to World
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={<RotateCcw size={18} />}
              onClick={handleRestart}
            >
              Play Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== ACTIVE LESSON ==========
  const ActivityIcon = ACTIVITY_ICONS[currentActivity?.type || 'game'];
  const activityColor = ACTIVITY_COLORS[currentActivity?.type || 'game'];
  const encouragement = getEncouragement(currentIndex);

  return (
    <div className="lesson-player-page">
      {/* Top Bar */}
      <div className="lesson-player-topbar">
        <button
          className="lesson-player-topbar__back"
          onClick={() => navigate(`/worlds/${worldId}`)}
          aria-label="Exit lesson"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="lesson-player-topbar__center">
          <span className="lesson-player-topbar__title">{lesson.title}</span>
          <ProgressBar value={progressPct} size="sm" animated />
          <span className="lesson-player-topbar__count">
            {currentIndex + 1} / {totalActivities}
          </span>
        </div>

        <button
          className="lesson-player-topbar__skip"
          onClick={handleSkip}
          aria-label="Skip activity"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Main Activity Area */}
      <div className="lesson-player-main">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentActivity?.id}
            className="lesson-activity"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            {/* Activity Header */}
            <div className="lesson-activity__header" style={{ borderColor: activityColor }}>
              <div className="lesson-activity__icon" style={{ background: activityColor }}>
                <ActivityIcon size={28} color="var(--white)" />
              </div>
              <div>
                <h2 className="lesson-activity__title">{currentActivity?.title}</h2>
                <span className="lesson-activity__type">{currentActivity?.type}</span>
              </div>
            </div>

            {/* Activity Content (placeholder) */}
            <Card variant="outlined" padding="xl" className="lesson-activity__content">
              <p className="lesson-activity__instructions">
                {currentActivity?.instructions}
              </p>
              <div className="lesson-activity__placeholder">
                <span className="lesson-activity__placeholder-icon">
                  <ActivityIcon size={48} color={activityColor} />
                </span>
                <p className="lesson-activity__placeholder-text">
                  {currentActivity?.type === 'song' && 'Music player will appear here'}
                  {currentActivity?.type === 'flashcard' && 'Flashcard deck will appear here'}
                  {currentActivity?.type === 'game' && 'Game component will appear here'}
                  {currentActivity?.type === 'story' && 'Story reader will appear here'}
                  {currentActivity?.type === 'practice' && 'Speech practice will appear here'}
                  {currentActivity?.type === 'quiz' && 'Quiz questions will appear here'}
                </p>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Mimi Encouragement */}
        <div className="lesson-player-mimi">
          <span className="lesson-player-mimi__avatar">{'\u{1F431}'}</span>
          <div className="lesson-player-mimi__bubble">
            <span>{encouragement.emoji}</span> {encouragement.text}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="lesson-player-bottombar">
        {currentIndex > 0 && (
          <Button
            variant="ghost"
            size="lg"
            icon={<ArrowLeft size={16} />}
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        <div className="lesson-player-bottombar__spacer" />
        <Button
          variant="primary"
          size="lg"
          icon={<ChevronRight size={18} />}
          onClick={handleNext}
        >
          {currentIndex < totalActivities - 1 ? 'Next' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;
