/**
 * CLASSROOM MODE — Smart Board / Projection View
 * Designed for large-screen projection in classrooms.
 * High contrast, giant text, minimal chrome, touch-optimized.
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MimiMascot from '../../components/MimiMascot';
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Maximize,
  Minimize,
  Volume2,
  Users,
  SkipForward,
  RotateCcw,
  X,
  Menu,
  Timer,
  Eye,
} from 'lucide-react';
import './ClassroomMode.css';

// ============================================================
// TYPES
// ============================================================

type ActivityType = 'vocabulary' | 'quiz' | 'story';

interface VocabItem {
  english: string;
  turkish: string;
  emoji: string;
  image?: string;
}

interface QuizItem {
  question: string;
  options: string[];
  correctIndex: number;
  image?: string;
}

interface StorySlide {
  text: string;
  highlight?: string;
}

interface Activity {
  type: ActivityType;
  title: string;
  items: VocabItem[] | QuizItem[] | StorySlide[];
}

// ============================================================
// DEMO LESSON DATA — shown until real classroom data is connected
// ============================================================

const MOCK_CLASS_NAME = 'Demo Classroom';
const MOCK_LESSON_TITLE = 'Animals - Demo Lesson';

const MOCK_STUDENTS = [
  'Elif', 'Ahmet', 'Zeynep', 'Can', 'Defne',
  'Mert', 'Selin', 'Berk', 'Duru', 'Emir',
  'Ada', 'Yusuf', 'Nisa', 'Ali', 'Lina',
];

const MOCK_ACTIVITIES: Activity[] = [
  {
    type: 'vocabulary',
    title: 'New Words',
    items: [
      { english: 'Cat', turkish: 'Kedi', emoji: '🐱' },
      { english: 'Dog', turkish: 'Kopek', emoji: '🐶' },
      { english: 'Bird', turkish: 'Kus', emoji: '🐦' },
      { english: 'Fish', turkish: 'Balik', emoji: '🐟' },
      { english: 'Rabbit', turkish: 'Tavsan', emoji: '🐰' },
      { english: 'Horse', turkish: 'At', emoji: '🐴' },
    ] as VocabItem[],
  },
  {
    type: 'quiz',
    title: 'Quick Quiz',
    items: [
      { question: 'What is "Cat" in Turkish?', options: ['Kopek', 'Kedi', 'Kus', 'Balik'], correctIndex: 1 },
      { question: 'Which animal is "Tavsan"?', options: ['Dog', 'Fish', 'Rabbit', 'Bird'], correctIndex: 2 },
      { question: 'How do you say "Horse"?', options: ['At', 'Kedi', 'Balik', 'Kus'], correctIndex: 0 },
    ] as QuizItem[],
  },
  {
    type: 'story',
    title: 'Story Time with Mimi',
    items: [
      { text: 'Mimi the dragon loves animals. Today, Mimi visits the farm!', highlight: 'animals' },
      { text: '"Hello, Cat!" says Mimi. The cat says "Meow!" and purrs happily.', highlight: 'Cat' },
      { text: 'Mimi sees a big horse. "Wow, Horse! You are so tall!" says Mimi.', highlight: 'Horse' },
      { text: 'At the pond, a fish jumps out of the water. "Splash!" laughs Mimi.', highlight: 'fish' },
    ] as StorySlide[],
  },
];

// ============================================================
// HELPERS
// ============================================================

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// ============================================================
// COMPONENT
// ============================================================

const ClassroomMode: React.FC = () => {
  const [activityIndex, setActivityIndex] = useState(0);
  const [itemIndex, setItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const activity = MOCK_ACTIVITIES[activityIndex];
  const items = activity.items;
  const currentItem = items[itemIndex];
  const totalActivities = MOCK_ACTIVITIES.length;

  // Timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setTimer(t => t + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  // Fullscreen API
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  // Navigation
  const handleNext = useCallback(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (itemIndex < items.length - 1) {
      setItemIndex(i => i + 1);
    } else if (activityIndex < totalActivities - 1) {
      setActivityIndex(a => a + 1);
      setItemIndex(0);
    }
  }, [itemIndex, items.length, activityIndex, totalActivities]);

  const handlePrev = useCallback(() => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    if (itemIndex > 0) {
      setItemIndex(i => i - 1);
    } else if (activityIndex > 0) {
      setActivityIndex(a => a - 1);
      const prevItems = MOCK_ACTIVITIES[activityIndex - 1].items;
      setItemIndex(prevItems.length - 1);
    }
  }, [itemIndex, activityIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrev();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
        case 'Escape':
          if (sidebarOpen) setSidebarOpen(false);
          break;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleNext, handlePrev, toggleFullscreen, sidebarOpen]);

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index);
    setShowAnswer(true);
  };

  const handleRepeat = () => {
    setItemIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  // Pronunciation (Web Speech API placeholder)
  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  // ---- RENDER CONTENT ----
  const renderContent = () => {
    switch (activity.type) {
      case 'vocabulary': {
        const vocab = currentItem as VocabItem;
        return (
          <motion.div
            className="cm-vocab"
            key={`vocab-${itemIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <span className="cm-vocab__emoji">{vocab.emoji}</span>
            <h1 className="cm-vocab__english">{vocab.english}</h1>
            <p className="cm-vocab__turkish">{vocab.turkish}</p>
            <button
              className="cm-pronounce-btn"
              onClick={() => handlePronounce(vocab.english)}
              aria-label={`Pronounce ${vocab.english}`}
            >
              <Volume2 size={28} />
              <span>Listen</span>
            </button>
          </motion.div>
        );
      }

      case 'quiz': {
        const quiz = currentItem as QuizItem;
        return (
          <motion.div
            className="cm-quiz"
            key={`quiz-${itemIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="cm-quiz__question">{quiz.question}</h1>
            <div className="cm-quiz__options">
              {quiz.options.map((opt, i) => {
                let btnClass = 'cm-quiz__option';
                if (showAnswer) {
                  if (i === quiz.correctIndex) btnClass += ' cm-quiz__option--correct';
                  else if (i === selectedAnswer) btnClass += ' cm-quiz__option--wrong';
                }
                return (
                  <motion.button
                    key={i}
                    className={btnClass}
                    onClick={() => handleQuizAnswer(i)}
                    disabled={showAnswer}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="cm-quiz__option-letter">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span>{opt}</span>
                  </motion.button>
                );
              })}
            </div>
            {showAnswer && (
              <motion.p
                className={`cm-quiz__feedback ${selectedAnswer === quiz.correctIndex ? 'correct' : 'wrong'}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {selectedAnswer === quiz.correctIndex
                  ? 'Correct! Well done!'
                  : `The answer is: ${quiz.options[quiz.correctIndex]}`}
              </motion.p>
            )}
          </motion.div>
        );
      }

      case 'story': {
        const slide = currentItem as StorySlide;
        return (
          <motion.div
            className="cm-story"
            key={`story-${itemIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="cm-story__mimi"><MimiMascot size={48} mood="happy" /></div>
            <p className="cm-story__text">
              {slide.highlight
                ? slide.text.split(slide.highlight).map((part, i, arr) => (
                    <React.Fragment key={i}>
                      {part}
                      {i < arr.length - 1 && (
                        <span className="cm-story__highlight">{slide.highlight}</span>
                      )}
                    </React.Fragment>
                  ))
                : slide.text}
            </p>
          </motion.div>
        );
      }
    }
  };

  // Activity progress dots (total across all activities)
  const allDots = MOCK_ACTIVITIES.map((a, ai) =>
    a.items.map((_, ii) => ({ ai, ii }))
  ).flat();

  const currentDotIndex = allDots.findIndex(
    d => d.ai === activityIndex && d.ii === itemIndex
  );

  return (
    <div className="cm" ref={containerRef}>
      {/* ---- TOP BAR ---- */}
      <header className="cm-topbar">
        <div className="cm-topbar__left">
          <span className="cm-topbar__logo-text" role="img" aria-label="MinesMinis"><MimiMascot size={28} mood="happy" animate={false} /></span>
          <span className="cm-topbar__class">{MOCK_CLASS_NAME}</span>
          <span className="cm-topbar__divider" />
          <span className="cm-topbar__lesson">{MOCK_LESSON_TITLE}</span>
        </div>

        <div className="cm-topbar__center">
          <div className="cm-timer">
            <Timer size={18} />
            <span>{formatTime(timer)}</span>
          </div>
        </div>

        <div className="cm-topbar__right">
          <button className="cm-ctrl-btn" onClick={handlePrev} aria-label="Previous">
            <ChevronLeft size={22} />
          </button>
          <button
            className="cm-ctrl-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} />}
          </button>
          <button className="cm-ctrl-btn" onClick={handleNext} aria-label="Next">
            <ChevronRight size={22} />
          </button>
          <button className="cm-ctrl-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
            {isFullscreen ? <Minimize size={22} /> : <Maximize size={22} />}
          </button>
          <button
            className="cm-ctrl-btn cm-ctrl-btn--sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Teacher controls"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* ---- MAIN CONTENT ---- */}
      <main className="cm-main">
        <div className="cm-activity-label">
          <Eye size={16} />
          <span>
            {activity.title} &mdash; {itemIndex + 1} / {items.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>

      {/* ---- BOTTOM DOTS ---- */}
      <footer className="cm-footer">
        <div className="cm-dots">
          {allDots.map((dot, idx) => (
            <button
              key={idx}
              className={`cm-dot ${idx === currentDotIndex ? 'cm-dot--active' : ''} ${idx < currentDotIndex ? 'cm-dot--done' : ''}`}
              onClick={() => {
                setActivityIndex(dot.ai);
                setItemIndex(dot.ii);
                setSelectedAnswer(null);
                setShowAnswer(false);
              }}
              aria-label={`Go to item ${idx + 1}`}
            />
          ))}
        </div>
        <div className="cm-footer__activity-labels">
          {MOCK_ACTIVITIES.map((a, i) => (
            <span
              key={i}
              className={`cm-footer__label ${i === activityIndex ? 'cm-footer__label--active' : ''}`}
            >
              {a.title}
            </span>
          ))}
        </div>
      </footer>

      {/* ---- TEACHER SIDEBAR ---- */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="cm-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="cm-sidebar"
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="cm-sidebar__header">
                <h3>Teacher Controls</h3>
                <button
                  className="cm-sidebar__close"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Quick Controls */}
              <div className="cm-sidebar__section">
                <h4>Quick Actions</h4>
                <div className="cm-sidebar__actions">
                  <button className="cm-sidebar__action" onClick={handleRepeat}>
                    <RotateCcw size={18} /> Repeat Activity
                  </button>
                  <button className="cm-sidebar__action" onClick={handleNext}>
                    <SkipForward size={18} /> Skip Item
                  </button>
                </div>
              </div>

              {/* Activity Switcher */}
              <div className="cm-sidebar__section">
                <h4>Activities</h4>
                <div className="cm-sidebar__activities">
                  {MOCK_ACTIVITIES.map((a, i) => (
                    <button
                      key={i}
                      className={`cm-sidebar__activity ${i === activityIndex ? 'active' : ''}`}
                      onClick={() => {
                        setActivityIndex(i);
                        setItemIndex(0);
                        setSelectedAnswer(null);
                        setShowAnswer(false);
                      }}
                    >
                      <span className="cm-sidebar__activity-type">
                        {a.type === 'vocabulary' ? '📖' : a.type === 'quiz' ? '❓' : '📚'}
                      </span>
                      <span>{a.title}</span>
                      <span className="cm-sidebar__activity-count">{a.items.length}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Student List */}
              <div className="cm-sidebar__section">
                <h4>
                  <Users size={16} /> Students ({MOCK_STUDENTS.length})
                </h4>
                <div className="cm-sidebar__students">
                  {MOCK_STUDENTS.map((name, i) => (
                    <div key={i} className="cm-sidebar__student">
                      <span className="cm-sidebar__student-dot" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassroomMode;
