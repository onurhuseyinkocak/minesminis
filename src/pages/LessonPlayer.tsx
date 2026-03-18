/**
 * LESSON PLAYER — Lesson Play Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId/lessons/:lessonId
 * Plays through lesson activities sequentially with progress tracking.
 * Renders REAL interactive game components from curriculum data.
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
  Volume2,
  Eye,
  EyeOff,
  Heart,
} from 'lucide-react';
import { Button, ProgressBar, Card, StarBurst, ConfettiRain, PerfectBadge, XPPop } from '../components/ui';
import { useGamification } from '../contexts/GamificationContext';
import { GameSelector } from '../components/games';
import { getLessonById, getWorldById, getWorldVocabulary } from '../data/curriculum';
import type { Activity, VocabularyWord } from '../data/curriculum';
import { completeLesson } from '../data/progressTracker';
import { updateWordProgress } from '../data/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';
import { SFX } from '../data/soundLibrary';
import { logActivity } from '../services/activityLogger';
import { syncStudentProgress } from '../services/classroomService';
import './LessonPlayer.css';

// ============================================================
// CONSTANTS
// ============================================================

const INITIAL_HEARTS = 3;
const HEART_BONUS_XP = 10;

// ============================================================
// ACTIVITY TYPE CONFIG
// ============================================================

const ACTIVITY_ICONS: Record<string, typeof Music> = {
  'word-match': Gamepad2,
  'phonics-builder': Music,
  'sentence-scramble': Layers,
  'listening-challenge': Mic,
  'spelling-bee': BookOpen,
  'quick-quiz': HelpCircle,
  'story-choices': BookOpen,
  // Legacy types (fallback)
  song: Music,
  game: Gamepad2,
  flashcard: Layers,
  story: BookOpen,
  practice: Mic,
  quiz: HelpCircle,
};

const ACTIVITY_COLORS: Record<string, string> = {
  'word-match': 'var(--accent-emerald)',
  'phonics-builder': 'var(--accent-blue)',
  'sentence-scramble': 'var(--warning)',
  'listening-challenge': 'var(--accent-pink)',
  'spelling-bee': 'var(--accent-purple)',
  'quick-quiz': 'var(--error)',
  'story-choices': 'var(--accent-blue)',
  // Legacy types (fallback)
  song: 'var(--accent-blue)',
  game: 'var(--accent-emerald)',
  flashcard: 'var(--warning)',
  story: 'var(--accent-purple)',
  practice: 'var(--accent-pink)',
  quiz: 'var(--error)',
};

// Game types that GameSelector can handle
const SUPPORTED_GAME_TYPES = new Set([
  'word-match',
  'spelling-bee',
  'quick-quiz',
  'sentence-scramble',
  'listening-challenge',
]);

// ============================================================
// MIMI ENCOURAGEMENTS
// ============================================================

const ENCOURAGEMENTS = [
  { text: 'You\'re doing great!', icon: 'star' },
  { text: 'Keep going, you can do it!', icon: 'star' },
  { text: 'Wonderful! I\'m proud of you!', icon: 'star' },
  { text: 'Almost there, keep it up!', icon: 'star' },
  { text: 'You\'re a superstar!', icon: 'star' },
  { text: 'Amazing work, friend!', icon: 'star' },
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
// FALLBACK ACTIVITY (Flashcard review for unsupported types)
// ============================================================

interface FallbackActivityProps {
  activity: Activity;
  words: { english: string; turkish: string; emoji: string; phonetic?: string; exampleSentence?: string }[];
  onComplete: (score: number, total: number) => void;
}

function FallbackActivity({ activity, words, onComplete }: FallbackActivityProps) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  const word = words[currentCard];

  const handleFlip = () => setFlipped((f) => !f);

  const handleNextCard = () => {
    setFlipped(false);
    const newReviewed = reviewedCount + 1;
    setReviewedCount(newReviewed);

    if (currentCard < words.length - 1) {
      setCurrentCard((c) => c + 1);
    } else {
      // All cards reviewed
      onComplete(words.length, words.length);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.english);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  if (!word) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>No words to review.</p>
      </div>
    );
  }

  return (
    <div className="fallback-activity">
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        {activity.instructions}
      </p>
      <p style={{ textAlign: 'center', color: 'var(--text-tertiary)', marginBottom: '1rem', fontSize: '0.8rem' }}>
        Card {currentCard + 1} of {words.length}
      </p>

      <div
        onClick={handleFlip}
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-md)',
          padding: '2rem',
          textAlign: 'center',
          cursor: 'pointer',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          boxShadow: 'var(--shadow-sm)',
          border: '2px solid var(--border-light)',
          transition: 'transform 0.2s',
        }}
      >
        <span style={{ fontSize: '3rem' }}>{word.emoji}</span>
        <span style={{ fontSize: '2rem', fontWeight: 700 }}>{word.english}</span>

        {flipped ? (
          <>
            <span style={{ fontSize: '1.4rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              {word.turkish}
            </span>
            {word.phonetic && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                {word.phonetic}
              </span>
            )}
            {word.exampleSentence && (
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '0.5rem' }}>
                "{word.exampleSentence}"
              </span>
            )}
          </>
        ) : (
          <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>
            Tap to reveal
          </span>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1.5rem' }}>
        <button
          onClick={(e) => { e.stopPropagation(); handleFlip(); }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: '2px solid var(--border-light)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
          }}
        >
          {flipped ? <EyeOff size={18} /> : <Eye size={18} />}
          {flipped ? 'Hide' : 'Reveal'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); speakWord(); }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: '2px solid var(--border-light)',
            background: 'var(--bg-card)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
          }}
        >
          <Volume2 size={18} />
          Listen
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); handleNextCard(); }}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '0.75rem',
            border: 'none',
            background: 'var(--primary)',
            color: 'var(--text-on-primary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
          }}
        >
          {currentCard < words.length - 1 ? 'Next' : 'Done'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT
// ============================================================

const LessonPlayer = () => {
  const { worldId = '', lessonId = '' } = useParams<{ worldId: string; lessonId: string }>();
  const navigate = useNavigate();
  const { addXP } = useGamification();
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  // Load real lesson data from curriculum
  const lesson = useMemo(() => getLessonById(worldId, lessonId), [worldId, lessonId]);
  const world = useMemo(() => getWorldById(worldId), [worldId]);
  const vocabulary = useMemo(() => getWorldVocabulary(worldId), [worldId]);

  // Build word items for game components from lesson's targetWords + world vocabulary
  const activityWords = useMemo(() => {
    if (!lesson) return [];
    return lesson.targetWords
      .map((tw) => vocabulary.find((v) => v.english === tw))
      .filter((w): w is VocabularyWord => Boolean(w))
      .map((w) => ({
        english: w.english,
        turkish: w.turkish,
        emoji: w.emoji,
        phonetic: w.phonetic,
        exampleSentence: w.exampleSentence,
      }));
  }, [lesson, vocabulary]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [activityScores, setActivityScores] = useState<{ score: number; total: number }[]>([]);
  const [hearts, setHearts] = useState(INITIAL_HEARTS);
  const [gameOver, setGameOver] = useState(false);
  const [heartLostIndex, setHeartLostIndex] = useState<number | null>(null);
  const [showStarBurst, setShowStarBurst] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showPerfect, setShowPerfect] = useState(false);
  const [xpPopAmount, setXpPopAmount] = useState<number | null>(null);

  const totalActivities = lesson?.activities.length || 0;
  const progressPct = totalActivities > 0 ? Math.round(((currentIndex + (completed ? 1 : 0)) / totalActivities) * 100) : 0;
  const currentActivity = lesson?.activities[currentIndex];

  const handleActivityComplete = useCallback((score: number, total: number) => {
    setActivityScores((prev) => [...prev, { score, total }]);

    // Award XP for this activity
    const activityXp = currentActivity?.xpReward || 10;
    const scoreRatio = total > 0 ? score / total : 1;
    const earnedXp = Math.round(activityXp * scoreRatio);
    if (earnedXp > 0) {
      addXP(earnedXp, 'activity_completed', { lessonId, worldId, activityId: currentActivity?.id });
    }

    // Trigger celebration animations based on score
    const pct = total > 0 ? Math.round((score / total) * 100) : 100;
    if (pct >= 80) {
      setShowStarBurst(true);
      SFX.correct();
      setTimeout(() => setShowStarBurst(false), 1500);
    }
    if (pct === 100) {
      setShowConfetti(true);
      setShowPerfect(true);
      SFX.celebration();
      setTimeout(() => { setShowConfetti(false); setShowPerfect(false); }, 3200);
    }
    if (earnedXp > 0) {
      setXpPopAmount(earnedXp);
      setTimeout(() => setXpPopAmount(null), 1800);
    }

    // Update spaced repetition for each word used in this activity
    const wasCorrect = total > 0 ? score / total >= 0.5 : true;
    for (const w of activityWords) {
      updateWordProgress(w.english, wasCorrect);
    }

    // Auto-advance to next activity after a short delay
    setTimeout(() => {
      if (!lesson) return;
      setDirection(1);
      if (currentIndex < totalActivities - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        // Lesson complete
        setCompleted(true);
        const totalXP = lesson.xpReward || 30;
        // Heart bonus: +10 XP per remaining heart
        setHearts((currentHearts) => {
          const heartBonus = currentHearts * HEART_BONUS_XP;
          addXP(totalXP + heartBonus, 'lesson_completed', { lessonId, worldId });
          return currentHearts;
        });

        // Save progress via progressTracker (unlocks next lesson/world)
        try {
          const totalScore = [...activityScores, { score, total }].reduce((a, s) => a + s.score, 0);
          const totalPossible = [...activityScores, { score, total }].reduce((a, s) => a + s.total, 0);
          const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
          completeLesson(userId, lessonId, worldId, totalXP, accuracy);

          // Log activity for parent dashboard analytics
          logActivity({
            type: 'game',
            title: lesson.title || `Lesson: ${lessonId}`,
            duration: Math.round(totalActivities * 60), // ~60s per activity estimate
            accuracy,
            xpEarned: totalXP,
          });

          // Sync progress to classroom (for teacher dashboard)
          syncStudentProgress(totalXP);
        } catch {
          // localStorage might be unavailable
        }
      }
    }, 1500);
  }, [currentIndex, totalActivities, lesson, addXP, lessonId, worldId, currentActivity, activityScores, userId]);

  const handleXpEarned = useCallback((xp: number) => {
    addXP(xp, 'activity_completed', { lessonId, worldId });
  }, [addXP, lessonId, worldId]);

  const handleWrongAnswer = useCallback(() => {
    SFX.wrong();
    setHearts((prev) => {
      const next = prev - 1;
      if (next <= 0) {
        setGameOver(true);
      }
      return Math.max(0, next);
    });
    // Trigger heart-lost animation
    setHeartLostIndex(Date.now());
    setTimeout(() => setHeartLostIndex(null), 600);
  }, []);

  const handleSkip = useCallback(() => {
    if (!lesson) return;
    setDirection(1);
    if (currentIndex < totalActivities - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCompleted(true);
      addXP(lesson.xpReward || 30, 'lesson_completed', { lessonId, worldId });
    }
  }, [currentIndex, totalActivities, lesson, addXP, lessonId, worldId]);

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
    setActivityScores([]);
    setHearts(INITIAL_HEARTS);
    setGameOver(false);
    setHeartLostIndex(null);
  }, []);

  // Not found
  if (!lesson) {
    return (
      <div className="lesson-player-page lesson-player-page--not-found">
        <h2>Lesson not found</h2>
        <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>
          Could not find lesson "{lessonId}" in world "{worldId}".
        </p>
        <Link to={`/worlds/${worldId}`}>
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to World</Button>
        </Link>
      </div>
    );
  }

  // ========== GAME OVER (out of hearts) ==========
  if (gameOver) {
    return (
      <div className="lesson-player-page">
        <motion.div
          className="lesson-complete"
          variants={celebrationVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lesson-gameover__hearts" aria-hidden="true">
            <span className="lesson-gameover__heart lesson-gameover__heart--empty">
              <Heart size={48} />
            </span>
          </div>
          <h1 className="lesson-complete__title">Out of Hearts!</h1>
          <p className="lesson-complete__subtitle">
            Don&apos;t worry, practice makes perfect! Try again.
          </p>

          <div className="lesson-complete__mimi">
            <span className="lesson-complete__mimi-avatar">{'\u{1F431}'}</span>
            <p>You can do it! Let&apos;s try one more time!</p>
          </div>

          <div className="lesson-complete__actions">
            <Button
              variant="primary"
              size="lg"
              icon={<RotateCcw size={18} />}
              onClick={handleRestart}
            >
              Try Again
            </Button>
            <Button
              variant="ghost"
              size="lg"
              icon={<ArrowLeft size={18} />}
              onClick={() => navigate(`/worlds/${worldId}`)}
            >
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ========== COMPLETION SCREEN ==========
  if (completed) {
    const totalScore = activityScores.reduce((a, s) => a + s.score, 0);
    const totalPossible = activityScores.reduce((a, s) => a + s.total, 0);
    const accuracy = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 100;
    const heartBonusXp = hearts * HEART_BONUS_XP;

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
            Great job! You finished &quot;{lesson.title}&quot; - all {totalActivities} activities!
          </p>

          {/* Hearts remaining */}
          <div className="lesson-complete__hearts">
            {Array.from({ length: INITIAL_HEARTS }).map((_, i) => (
              <span
                key={i}
                className={`lesson-complete__heart ${i < hearts ? 'lesson-complete__heart--full' : 'lesson-complete__heart--empty'}`}
              >
                <Heart size={28} fill={i < hearts ? 'var(--error)' : 'none'} color={i < hearts ? 'var(--error)' : 'var(--text-muted)'} />
              </span>
            ))}
            {hearts > 0 && (
              <span className="lesson-complete__heart-bonus">+{heartBonusXp} bonus XP</span>
            )}
          </div>

          {totalPossible > 0 && (
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              Accuracy: {accuracy}% ({totalScore}/{totalPossible})
            </p>
          )}

          <div className="lesson-complete__xp">
            <Star size={24} />
            <span className="lesson-complete__xp-value">+{(lesson.xpReward || 0) + heartBonusXp} XP</span>
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
              Back to {world?.name || 'World'}
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
  const ActivityIcon = ACTIVITY_ICONS[currentActivity?.type || 'word-match'] || Gamepad2;
  const activityColor = ACTIVITY_COLORS[currentActivity?.type || 'word-match'] || 'var(--accent-emerald)';
  const encouragement = getEncouragement(currentIndex);
  const isSupported = currentActivity ? SUPPORTED_GAME_TYPES.has(currentActivity.type) : false;

  return (
    <div className="lesson-player-page">
      {/* Celebration overlays */}
      {showStarBurst && <StarBurst />}
      {showConfetti && <ConfettiRain />}
      {showPerfect && <PerfectBadge />}
      {xpPopAmount !== null && <XPPop amount={xpPopAmount} />}

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

        {/* Hearts Display */}
        <div className={`lesson-player-topbar__hearts${heartLostIndex !== null ? ' lesson-player-topbar__hearts--shake' : ''}`} aria-label={`${hearts} hearts remaining`}>
          {Array.from({ length: INITIAL_HEARTS }).map((_, i) => (
            <span
              key={i}
              className={`lesson-player-topbar__heart ${i < hearts ? 'lesson-player-topbar__heart--full' : 'lesson-player-topbar__heart--empty'}`}
            >
              <Heart size={20} fill={i < hearts ? 'var(--error)' : 'none'} color={i < hearts ? 'var(--error)' : 'var(--text-muted)'} />
            </span>
          ))}
        </div>

        <button
          className="lesson-player-topbar__skip"
          onClick={handleSkip}
          aria-label="Skip activity"
        >
          <SkipForward size={18} />
        </button>
      </div>

      {/* Lesson Info */}
      {currentIndex === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '0.5rem 1rem',
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
        }}>
          {world && <span>{world.icon} {world.name} &bull; </span>}
          {lesson.objective}
        </div>
      )}

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

            {/* Activity Content - Real Games */}
            <Card variant="outlined" padding="xl" className="lesson-activity__content">
              {currentActivity && isSupported ? (
                <GameSelector
                  type={currentActivity.type}
                  words={activityWords}
                  onComplete={handleActivityComplete}
                  onXpEarned={handleXpEarned}
                  onWrongAnswer={handleWrongAnswer}
                />
              ) : currentActivity ? (
                <FallbackActivity
                  activity={currentActivity}
                  words={activityWords}
                  onComplete={handleActivityComplete}
                />
              ) : null}
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Mimi Encouragement */}
        <div className="lesson-player-mimi">
          <span className="lesson-player-mimi__avatar">{'\u{1F431}'}</span>
          <div className="lesson-player-mimi__bubble">
            <Star size={16} /> {encouragement.text}
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
          onClick={handleSkip}
        >
          {currentIndex < totalActivities - 1 ? 'Next' : 'Finish'}
        </Button>
      </div>
    </div>
  );
};

export default LessonPlayer;
