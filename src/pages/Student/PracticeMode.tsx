/**
 * PRACTICE MODE — Free Review & Spaced Repetition
 * Students review words outside of lessons.
 * Warm, clean, large touch targets.
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Filter,
  Volume2,
  X,
  Zap,
  CheckCircle2,
  Clock,
  BookOpen,
  Star,
  Globe,
  RotateCcw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tabs } from '../../components/ui/Tabs';
import { ProgressBar } from '../../components/ui/ProgressBar';
import './PracticeMode.css';

// ============================================================
// TYPES
// ============================================================

type MasteryLevel = 'mastered' | 'reviewing' | 'learning' | 'new';

interface WordCard {
  id: string;
  english: string;
  turkish: string;
  emoji: string;
  mastery: MasteryLevel;
  world: string;
  confidence: number; // 0-100
  exampleSentence: string;
  lastPracticed?: string;
  dueForReview?: boolean;
}

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_WORDS: WordCard[] = [
  { id: '1', english: 'Cat', turkish: 'Kedi', emoji: '🐱', mastery: 'mastered', world: 'Animals', confidence: 95, exampleSentence: 'The cat is sleeping on the sofa.' },
  { id: '2', english: 'Dog', turkish: 'Kopek', emoji: '🐶', mastery: 'mastered', world: 'Animals', confidence: 90, exampleSentence: 'My dog likes to play in the park.' },
  { id: '3', english: 'Bird', turkish: 'Kus', emoji: '🐦', mastery: 'reviewing', world: 'Animals', confidence: 70, exampleSentence: 'A bird is singing in the tree.', dueForReview: true },
  { id: '4', english: 'Fish', turkish: 'Balik', emoji: '🐟', mastery: 'reviewing', world: 'Animals', confidence: 65, exampleSentence: 'The fish swims in the water.', dueForReview: true },
  { id: '5', english: 'Red', turkish: 'Kirmizi', emoji: '🔴', mastery: 'mastered', world: 'Colors', confidence: 100, exampleSentence: 'The apple is red.' },
  { id: '6', english: 'Blue', turkish: 'Mavi', emoji: '🔵', mastery: 'learning', world: 'Colors', confidence: 45, exampleSentence: 'The sky is blue today.' },
  { id: '7', english: 'Green', turkish: 'Yesil', emoji: '🟢', mastery: 'learning', world: 'Colors', confidence: 40, exampleSentence: 'The grass is green.' },
  { id: '8', english: 'Apple', turkish: 'Elma', emoji: '🍎', mastery: 'reviewing', world: 'Food', confidence: 75, exampleSentence: 'I eat an apple every day.', dueForReview: true },
  { id: '9', english: 'Bread', turkish: 'Ekmek', emoji: '🍞', mastery: 'new', world: 'Food', confidence: 10, exampleSentence: 'We have bread for breakfast.' },
  { id: '10', english: 'Water', turkish: 'Su', emoji: '💧', mastery: 'new', world: 'Food', confidence: 5, exampleSentence: 'Please drink your water.' },
  { id: '11', english: 'Mother', turkish: 'Anne', emoji: '👩', mastery: 'learning', world: 'Family', confidence: 50, exampleSentence: 'My mother makes delicious cakes.' },
  { id: '12', english: 'Father', turkish: 'Baba', emoji: '👨', mastery: 'learning', world: 'Family', confidence: 55, exampleSentence: 'My father reads me stories.' },
  { id: '13', english: 'One', turkish: 'Bir', emoji: '1️⃣', mastery: 'mastered', world: 'Numbers', confidence: 100, exampleSentence: 'I have one pencil.' },
  { id: '14', english: 'Two', turkish: 'Iki', emoji: '2️⃣', mastery: 'mastered', world: 'Numbers', confidence: 98, exampleSentence: 'I have two hands.' },
  { id: '15', english: 'Horse', turkish: 'At', emoji: '🐴', mastery: 'new', world: 'Animals', confidence: 0, exampleSentence: 'The horse runs very fast.' },
  { id: '16', english: 'Rabbit', turkish: 'Tavsan', emoji: '🐰', mastery: 'new', world: 'Animals', confidence: 15, exampleSentence: 'The rabbit has long ears.' },
];

const WORLDS = ['All', 'Animals', 'Colors', 'Food', 'Family', 'Numbers'];

const FILTER_TABS = [
  { id: 'all', label: 'All Words', icon: <BookOpen size={16} /> },
  { id: 'mimi', label: "Mimi's Picks", icon: <Sparkles size={16} /> },
  { id: 'mastered', label: 'Mastered', icon: <CheckCircle2 size={16} /> },
  { id: 'reviewing', label: 'Reviewing', icon: <Clock size={16} /> },
  { id: 'learning', label: 'Learning', icon: <Star size={16} /> },
  { id: 'new', label: 'New', icon: <Zap size={16} /> },
];

const MASTERY_CONFIG: Record<MasteryLevel, { label: string; color: string; bg: string }> = {
  mastered: { label: 'Mastered', color: 'var(--success)', bg: 'var(--success-pale)' },
  reviewing: { label: 'Reviewing', color: 'var(--primary)', bg: 'var(--primary-pale)' },
  learning: { label: 'Learning', color: 'var(--info)', bg: 'var(--info-pale)' },
  new: { label: 'New', color: 'var(--stone)', bg: 'var(--bg-muted)' },
};

const ENCOURAGEMENTS = [
  "You are doing great! Keep it up!",
  "Practice makes perfect!",
  "Mimi believes in you!",
  "Every word counts!",
  "You are a word champion!",
];

// ============================================================
// COMPONENT
// ============================================================

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

const PracticeMode: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWorld, setSelectedWorld] = useState('All');
  const [selectedWord, setSelectedWord] = useState<WordCard | null>(null);

  const encouragement = useMemo(
    () => ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)],
    []
  );

  // Filter words
  const filteredWords = useMemo(() => {
    let words = [...MOCK_WORDS];

    // World filter
    if (selectedWorld !== 'All') {
      words = words.filter(w => w.world === selectedWorld);
    }

    // Mastery filter
    switch (activeFilter) {
      case 'mimi':
        words = words.filter(w => w.dueForReview || w.mastery === 'learning');
        break;
      case 'mastered':
        words = words.filter(w => w.mastery === 'mastered');
        break;
      case 'reviewing':
        words = words.filter(w => w.mastery === 'reviewing');
        break;
      case 'learning':
        words = words.filter(w => w.mastery === 'learning');
        break;
      case 'new':
        words = words.filter(w => w.mastery === 'new');
        break;
    }

    return words;
  }, [activeFilter, selectedWorld]);

  // Summary stats
  const stats = useMemo(() => {
    const total = MOCK_WORDS.length;
    const mastered = MOCK_WORDS.filter(w => w.mastery === 'mastered').length;
    const reviewing = MOCK_WORDS.filter(w => w.mastery === 'reviewing').length;
    const learning = MOCK_WORDS.filter(w => w.mastery === 'learning').length;
    const newWords = MOCK_WORDS.filter(w => w.mastery === 'new').length;
    const dueForReview = MOCK_WORDS.filter(w => w.dueForReview).length;
    return { total, mastered, reviewing, learning, new: newWords, dueForReview };
  }, []);

  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="pm">
      {/* ---- HEADER ---- */}
      <div className="pm-header">
        <div className="pm-header__left">
          <motion.div
            className="pm-header__mimi"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          >
            🐉
          </motion.div>
          <div>
            <h1 className="pm-header__title">Practice Time!</h1>
            <p className="pm-header__subtitle">{encouragement}</p>
          </div>
        </div>
        <div className="pm-header__right">
          {stats.dueForReview > 0 && (
            <Badge variant="warning" icon={<RotateCcw size={14} />}>
              {stats.dueForReview} due for review
            </Badge>
          )}
          <Button
            variant="primary"
            icon={<Zap size={18} />}
            onClick={() => navigate('/games')}
          >
            Quick Quiz
          </Button>
        </div>
      </div>

      {/* ---- FILTERS ---- */}
      <div className="pm-filters">
        <Tabs
          tabs={FILTER_TABS}
          activeTab={activeFilter}
          onChange={setActiveFilter}
          variant="pill"
          className="pm-filter-tabs"
        />

        <div className="pm-world-filter">
          <Filter size={16} className="pm-world-filter__icon" />
          <select
            className="pm-world-select"
            value={selectedWorld}
            onChange={(e) => setSelectedWorld(e.target.value)}
            aria-label="Filter by world"
          >
            {WORLDS.map(w => (
              <option key={w} value={w}>{w === 'All' ? 'All Worlds' : w}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ---- WORD GRID ---- */}
      {filteredWords.length === 0 ? (
        <div className="pm-empty">
          <span className="pm-empty__emoji">🐉</span>
          <p className="pm-empty__text">Mimi could not find any words here. Try a different filter!</p>
        </div>
      ) : (
        <div className="pm-grid">
          {filteredWords.map((word, i) => {
            const cfg = MASTERY_CONFIG[word.mastery];
            return (
              <motion.div
                key={word.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <Card
                  variant="interactive"
                  padding="md"
                  className={`pm-word-card pm-word-card--${word.mastery}`}
                  onClick={() => setSelectedWord(word)}
                >
                  <div className="pm-word-card__top">
                    <span className="pm-word-card__emoji">{word.emoji}</span>
                    <span
                      className="pm-word-card__mastery"
                      style={{ color: cfg.color, background: cfg.bg }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <h3 className="pm-word-card__english">{word.english}</h3>
                  <p className="pm-word-card__turkish">{word.turkish}</p>
                  <div className="pm-word-card__confidence">
                    <div className="pm-word-card__confidence-bar">
                      <div
                        className="pm-word-card__confidence-fill"
                        style={{
                          width: `${word.confidence}%`,
                          background: cfg.color,
                        }}
                      />
                    </div>
                    <span className="pm-word-card__confidence-label" style={{ color: cfg.color }}>
                      {word.confidence}%
                    </span>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ---- WORD DETAIL MODAL ---- */}
      <AnimatePresence>
        {selectedWord && (
          <>
            <motion.div
              className="pm-modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedWord(null)}
            />
            <motion.div
              className="pm-modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <button
                className="pm-modal__close"
                onClick={() => setSelectedWord(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>

              <span className="pm-modal__emoji">{selectedWord.emoji}</span>
              <h2 className="pm-modal__english">{selectedWord.english}</h2>
              <p className="pm-modal__turkish">{selectedWord.turkish}</p>

              <button
                className="pm-modal__pronounce"
                onClick={() => handlePronounce(selectedWord.english)}
              >
                <Volume2 size={22} />
                <span>Listen to pronunciation</span>
              </button>

              <div className="pm-modal__example">
                <span className="pm-modal__example-label">Example:</span>
                <p className="pm-modal__example-text">{selectedWord.exampleSentence}</p>
              </div>

              <div className="pm-modal__mastery">
                <span className="pm-modal__mastery-label">Mastery</span>
                <ProgressBar
                  value={selectedWord.confidence}
                  variant={selectedWord.confidence >= 80 ? 'success' : selectedWord.confidence >= 50 ? 'warning' : 'default'}
                  size="lg"
                  showLabel
                />
              </div>

              <div className="pm-modal__meta">
                <Badge
                  variant={
                    selectedWord.mastery === 'mastered' ? 'success' :
                    selectedWord.mastery === 'reviewing' ? 'warning' :
                    selectedWord.mastery === 'learning' ? 'info' : 'default'
                  }
                >
                  {MASTERY_CONFIG[selectedWord.mastery].label}
                </Badge>
                <Badge variant="default" icon={<Globe size={12} />}>
                  {selectedWord.world}
                </Badge>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ---- PROGRESS SUMMARY ---- */}
      <div className="pm-summary">
        <Card variant="elevated" padding="lg" className="pm-summary-card">
          <h3 className="pm-summary__title">Your Progress</h3>
          <div className="pm-summary__stats">
            <div className="pm-summary__stat">
              <span className="pm-summary__stat-value" style={{ color: 'var(--success)' }}>{stats.mastered}</span>
              <span className="pm-summary__stat-label">Mastered</span>
            </div>
            <div className="pm-summary__stat">
              <span className="pm-summary__stat-value" style={{ color: 'var(--primary)' }}>{stats.reviewing}</span>
              <span className="pm-summary__stat-label">Reviewing</span>
            </div>
            <div className="pm-summary__stat">
              <span className="pm-summary__stat-value" style={{ color: 'var(--info)' }}>{stats.learning}</span>
              <span className="pm-summary__stat-label">Learning</span>
            </div>
            <div className="pm-summary__stat">
              <span className="pm-summary__stat-value" style={{ color: 'var(--stone)' }}>{stats.new}</span>
              <span className="pm-summary__stat-label">New</span>
            </div>
          </div>
          <ProgressBar
            value={(stats.mastered / stats.total) * 100}
            variant="success"
            size="md"
            showLabel
            animated
          />
          <p className="pm-summary__note">
            {stats.mastered} of {stats.total} words mastered ({Math.round((stats.mastered / stats.total) * 100)}%)
          </p>
        </Card>
      </div>
    </div>
  );
};

export default PracticeMode;
