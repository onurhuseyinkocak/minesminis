import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, CheckCircle, XCircle, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SFX } from '../data/soundLibrary';
import UnifiedMascot from './UnifiedMascot';
import './ReadingPlayer.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ComprehensionQuestion {
  id: string;
  question: string;
  questionTr: string;
  options: { id: string; text: string; correct: boolean }[];
}

export interface ReadingStats {
  wpm: number;
  timeSpentMs: number;
  quizScore?: number;
  quizTotal?: number;
}

export interface ReadingPlayerProps {
  content: {
    id: string;
    title: string;
    text: string;
    wordCount: number;
    level: 'beginner' | 'intermediate' | 'advanced';
    comprehensionQuiz?: ComprehensionQuestion[];
  };
  onComplete: (stats: ReadingStats) => void;
  onClose?: () => void;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatMs(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min > 0) return `${min}m ${sec}s`;
  return `${sec}s`;
}

function wpmLabel(wpm: number): string {
  if (wpm < 50) return 'Yeni Okuyucu';
  if (wpm < 100) return 'Gelişen Okuyucu';
  if (wpm < 150) return 'Akıcı Okuyucu';
  return 'Hızlı Okuyucu';
}

function estimatedMinutes(wordCount: number): string {
  const mins = Math.ceil(wordCount / 150);
  return mins === 1 ? '~1 dakika' : `~${mins} dakika`;
}

type Screen = 'ready' | 'reading' | 'stats' | 'quiz';

// ─── Component ───────────────────────────────────────────────────────────────

const ReadingPlayer: React.FC<ReadingPlayerProps> = ({ content, onComplete, onClose }) => {
  const { lang } = useLanguage();
  const [screen, setScreen] = useState<Screen>('ready');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [finalStats, setFinalStats] = useState<ReadingStats | null>(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<'correct' | 'wrong' | null>(null);

  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Timer ────────────────────────────────────────────────────────────────

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopTimer();
  }, [stopTimer]);

  // ── Start reading ─────────────────────────────────────────────────────────

  const handleStartReading = useCallback(() => {
    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - startTimeRef.current);
    }, 500);
    setScreen('reading');
    SFX.correct();
  }, []);

  // ── Done reading ──────────────────────────────────────────────────────────

  const handleDoneReading = useCallback(() => {
    stopTimer();
    const timeSpentMs = Date.now() - startTimeRef.current;
    const minutes = timeSpentMs / 60000;
    const wpm = minutes > 0 ? Math.round(content.wordCount / minutes) : 0;
    const stats: ReadingStats = { wpm, timeSpentMs };
    setFinalStats(stats);

    if (content.comprehensionQuiz && content.comprehensionQuiz.length > 0) {
      setScreen('quiz');
    } else {
      setScreen('stats');
    }
  }, [stopTimer, content.wordCount, content.comprehensionQuiz]);

  // ── Quiz answer ───────────────────────────────────────────────────────────

  const handleSelectOption = useCallback((optionId: string, correct: boolean) => {
    if (quizFeedback !== null) return;
    setSelectedId(optionId);
    if (correct) {
      setQuizFeedback('correct');
      setQuizCorrect((prev) => prev + 1);
      SFX.correct();
    } else {
      setQuizFeedback('wrong');
      SFX.wrong();
    }

    setTimeout(() => {
      const quiz = content.comprehensionQuiz ?? [];
      if (quizIndex + 1 < quiz.length) {
        setQuizIndex((prev) => prev + 1);
        setSelectedId(null);
        setQuizFeedback(null);
      } else {
        // Quiz done — merge into stats and show stats screen
        const total = quiz.length;
        const newCorrect = correct ? quizCorrect + 1 : quizCorrect;
        const quizScore = total > 0 ? Math.round((newCorrect / total) * 100) : 0;
        setFinalStats((prev) =>
          prev ? { ...prev, quizScore, quizTotal: total } : { wpm: 0, timeSpentMs: 0, quizScore, quizTotal: total }
        );
        setScreen('stats');
      }
    }, 1400);
  }, [quizFeedback, quizIndex, quizCorrect, content.comprehensionQuiz]);

  // ── Complete ──────────────────────────────────────────────────────────────

  const handleComplete = useCallback(() => {
    if (finalStats) {
      onComplete(finalStats);
    }
  }, [finalStats, onComplete]);

  // ── Derived values ────────────────────────────────────────────────────────

  const quiz = content.comprehensionQuiz ?? [];
  const currentQuestion = quiz[quizIndex] ?? null;
  const quizProgress = quiz.length > 0 ? ((quizIndex) / quiz.length) * 100 : 0;

  const xpEarned = finalStats
    ? Math.min(50, Math.max(10, Math.round((finalStats.wpm / 150) * 30)))
    + (finalStats.quizScore !== undefined ? Math.round(finalStats.quizScore / 10) : 0)
    : 0;

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="rp-wrap">
      {/* Header */}
      <div className="rp-header">
        <button type="button" className="rp-closeBtn" onClick={onClose} aria-label="Close">
          <ArrowLeft size={20} />
        </button>
        <div className="rp-headerMeta">
          <h1 className="rp-headerTitle">{content.title}</h1>
          <span className={`rp-levelBadge rp-levelBadge--${content.level}`}>{content.level}</span>
        </div>
        {screen === 'reading' && (
          <span className="rp-timerBar">
            <span className="rp-timerDot" />
            {formatMs(elapsedMs)}
          </span>
        )}
      </div>

      {/* Screens */}
      <AnimatePresence mode="wait">
        {/* ── READY ─────────────────────────────────────────────── */}
        {screen === 'ready' && (
          <motion.div
            key="ready"
            className="rp-screen"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <UnifiedMascot state="waving" size={100} />
            <div className="rp-readyCard">
              <BookOpen size={40} color="var(--primary, #ff6b35)" />
              <h2 className="rp-readyTitle">
                {lang === 'tr' ? 'Okumaya hazır mısın?' : 'Ready to read?'}
              </h2>
              <div className="rp-estTime">
                <Clock size={14} />
                {lang === 'tr' ? 'Tahmini süre:' : 'Estimated time:'} {estimatedMinutes(content.wordCount)}
              </div>
              <p className="rp-wordCount">
                {content.wordCount} {lang === 'tr' ? 'kelime' : 'words'}
              </p>
              <button type="button" className="rp-primaryBtn" onClick={handleStartReading}>
                {lang === 'tr' ? 'Okumaya Başla' : 'Start Reading'}
              </button>
            </div>
          </motion.div>
        )}

        {/* ── READING ───────────────────────────────────────────── */}
        {screen === 'reading' && (
          <motion.div
            key="reading"
            className="rp-readingArea"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="rp-textCard">
              <p className="rp-text">{content.text}</p>
            </div>
            <button type="button" className="rp-doneBtn" onClick={handleDoneReading}>
              <CheckCircle size={18} />
              {lang === 'tr' ? 'Okumayı Bitirdim' : 'Done Reading'}
            </button>
          </motion.div>
        )}

        {/* ── QUIZ ──────────────────────────────────────────────── */}
        {screen === 'quiz' && currentQuestion && (
          <motion.div
            key="quiz"
            className="rp-screen"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <div className="rp-quizWrap">
              <div className="rp-quizHeader">
                <h2 className="rp-quizTitle">
                  {lang === 'tr' ? 'Anlama Soruları' : 'Comprehension Quiz'}
                </h2>
                <span className="rp-quizCounter">{quizIndex + 1} / {quiz.length}</span>
              </div>

              <div className="rp-quizProgress">
                <div className="rp-quizProgressFill" style={{ width: `${quizProgress}%` }} />
              </div>

              <motion.div
                key={currentQuestion.id}
                className="rp-questionCard"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="rp-questionText">{currentQuestion.question}</p>
                <p className="rp-questionTextTr">{currentQuestion.questionTr}</p>
              </motion.div>

              <div className="rp-quizOptions">
                {currentQuestion.options.map((opt, i) => {
                  let cls = 'rp-option';
                  if (quizFeedback && opt.correct) cls += ' rp-option--correct';
                  else if (quizFeedback === 'wrong' && selectedId === opt.id) cls += ' rp-option--wrong';

                  return (
                    <motion.button
                      key={opt.id}
                      className={cls}
                      onClick={() => handleSelectOption(opt.id, opt.correct)}
                      disabled={quizFeedback !== null}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span className="rp-optionLabel">{String.fromCharCode(65 + i)}</span>
                      {opt.text}
                    </motion.button>
                  );
                })}
              </div>

              {quizFeedback && (
                <motion.div
                  className={`rp-feedback rp-feedback--${quizFeedback}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  {quizFeedback === 'correct'
                    ? (lang === 'tr' ? 'Harika! Doğru!' : 'Correct!')
                    : (lang === 'tr' ? 'Yanlış, ama devam et!' : 'Not quite — keep going!')}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── STATS ─────────────────────────────────────────────── */}
        {screen === 'stats' && finalStats && (
          <motion.div
            key="stats"
            className="rp-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <UnifiedMascot state="celebrating" size={100} />
            <div className="rp-statsCard">
              <h2 className="rp-statsTitle">
                {lang === 'tr' ? 'Harika iş!' : 'Great job!'}
              </h2>

              <div className="rp-statsRow">
                <div className="rp-statChip">
                  <span className="rp-statChip__value">{finalStats.wpm}</span>
                  <span className="rp-statChip__label">{lang === 'tr' ? 'kelime/dk' : 'WPM'}</span>
                </div>
                <div className="rp-statChip">
                  <span className="rp-statChip__value">{formatMs(finalStats.timeSpentMs)}</span>
                  <span className="rp-statChip__label">{lang === 'tr' ? 'Süre' : 'Time'}</span>
                </div>
                {finalStats.quizScore !== undefined && (
                  <div className="rp-statChip">
                    <span className="rp-statChip__value">{finalStats.quizScore}%</span>
                    <span className="rp-statChip__label">{lang === 'tr' ? 'Anlama' : 'Quiz'}</span>
                  </div>
                )}
              </div>

              <p className="rp-wpmTitle">{wpmLabel(finalStats.wpm)}</p>

              <div className="rp-xpBadge">
                <Zap size={16} />
                +{xpEarned} XP
              </div>

              <div className="rp-btnRow">
                {onClose && (
                  <button type="button" className="rp-secondaryBtn" onClick={onClose}>
                    <XCircle size={16} />
                    {lang === 'tr' ? 'Kütüphane' : 'Library'}
                  </button>
                )}
                <button type="button" className="rp-primaryBtn" onClick={handleComplete}>
                  <CheckCircle size={16} />
                  {lang === 'tr' ? 'Tamamla' : 'Complete'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReadingPlayer;
