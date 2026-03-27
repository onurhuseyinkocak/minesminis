import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, Trophy, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Card, Badge, ProgressBar } from '../ui';
import { SFX } from '../../data/soundLibrary';
import { speak } from '../../services/ttsService';
import { SpeakButton } from '../SpeakButton';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import UnifiedMascot from '../UnifiedMascot';
import { WordIllustration } from '../WordIllustration';
import './SayItGame.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SayItQuestion {
  id: string;
  word: string;
  wordTr: string;
  phonetic?: string;
  hint?: string;
  hintTr?: string;
}

export interface SayItGameProps {
  questions: SayItQuestion[];
  onComplete: (score: number, total: number) => void;
  onWrongAnswer?: () => void;
}

// ── Speech Recognition helpers ────────────────────────────────────────────────

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognition;
  webkitSpeechRecognition?: new () => SpeechRecognition;
};

function getSpeechRecognitionConstructor(): (new () => SpeechRecognition) | null {
  if (typeof window === 'undefined') return null;
  const w = window as SpeechRecognitionWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// ── Mic button states ─────────────────────────────────────────────────────────

type MicState = 'idle' | 'listening' | 'processing' | 'success' | 'error';

// ── Mic SVG icon ──────────────────────────────────────────────────────────────

function MicIcon({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
    </svg>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export const SayItGame: React.FC<SayItGameProps> = ({
  questions,
  onComplete,
  onWrongAnswer,
}) => {
  const { t } = useLanguage();
  const { loseHeart } = useHearts();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [micState, setMicState] = useState<MicState>('idle');
  const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
  const [heardText, setHeardText] = useState('');
  const [missCount, setMissCount] = useState(0);
  const [completed, setCompleted] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const SRConstructor = getSpeechRecognitionConstructor();
  const isSpeechSupported = SRConstructor !== null;

  const currentQuestion = questions[currentIndex];

  // ── Auto-speak word when question changes ────────────────────────────────
  // Gives the child a model pronunciation on each new question.
  // On iOS Safari this may be blocked until a user gesture — that's fine;
  // the SpeakButton lets them tap to hear it manually.
  useEffect(() => {
    if (!currentQuestion) return;
    const id = setTimeout(() => {
      speak(currentQuestion.word, { lang: 'en-US', rate: 0.8, pitch: 1.1 });
    }, 400);
    return () => clearTimeout(id);
  }, [currentIndex, currentQuestion]);

  // ── Advance to next question ─────────────────────────────────────────────

  const advanceQuestion = useCallback(
    (nextScore: number) => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= questions.length) {
        setCompleted(true);
        SFX.celebration();
        onComplete(nextScore, questions.length);
      } else {
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setFeedbackType(null);
          setHeardText('');
          setMicState('idle');
          setMissCount(0);
        }, 1200);
      }
    },
    [currentIndex, questions.length, onComplete],
  );

  // ── Handle recognised speech result ─────────────────────────────────────

  const handleSpeechResult = useCallback(
    (spoken: string) => {
      if (!currentQuestion) return;

      const target = currentQuestion.word.trim().toLowerCase();
      const heard = spoken.trim().toLowerCase();
      const isCorrect = heard === target || heard.includes(target);

      setHeardText(spoken);
      setMicState(isCorrect ? 'success' : 'error');

      if (isCorrect) {
        setFeedbackType('correct');
        SFX.correct();
        const nextScore = score + 1;
        setScore(nextScore);
        advanceQuestion(nextScore);
      } else {
        setFeedbackType('wrong');
        SFX.wrong();
        onWrongAnswer?.();

        const newMisses = missCount + 1;
        setMissCount(newMisses);
        if (newMisses >= 2) {
          loseHeart();
        }
      }
    },
    [currentQuestion, score, missCount, advanceQuestion, onWrongAnswer, loseHeart],
  );

  // ── Start listening ──────────────────────────────────────────────────────

  const startListening = useCallback(() => {
    if (!SRConstructor || micState === 'listening') return;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* ignore */
      }
    }

    const recognition = new SRConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setMicState('listening');
      setFeedbackType(null);
      setHeardText('');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setMicState('processing');
      const result = event.results[0];
      if (result?.[0]) {
        handleSpeechResult(result[0].transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setMicState('error');
      const errorMsg =
        event.error === 'no-speech'
          ? (t('games.noSpeechDetected') || 'No speech detected -- try again')
          : event.error === 'not-allowed'
            ? (t('games.micPermissionDenied') || 'Microphone permission denied')
            : event.error === 'network'
              ? (t('games.networkError') || 'Network error -- check your connection')
              : (t('games.errorOccurred') || 'An error occurred -- try again');
      setHeardText(errorMsg);
      setFeedbackType('wrong');
    };

    recognition.onend = () => {
      setMicState((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [SRConstructor, micState, handleSpeechResult]);

  // ── Stop listening ───────────────────────────────────────────────────────

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    setMicState('idle');
  }, []);

  // ── Skip current question ────────────────────────────────────────────────

  const handleSkip = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        /* ignore */
      }
    }
    onWrongAnswer?.();
    advanceQuestion(score);
  }, [advanceQuestion, score, onWrongAnswer]);

  // ── Mark as done (no speech support fallback) ────────────────────────────

  const handleMarkDone = useCallback(() => {
    advanceQuestion(score + 1);
    setScore((prev) => prev + 1);
  }, [advanceQuestion, score]);

  // ── Play again ───────────────────────────────────────────────────────────

  const handlePlayAgain = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setMicState('idle');
    setFeedbackType(null);
    setHeardText('');
    setMissCount(0);
    setCompleted(false);
  }, []);

  // ── Unsupported browser ──────────────────────────────────────────────────

  if (!isSpeechSupported) {
    return (
      <div className="sig">
        <div className="sig__unsupported">
          <UnifiedMascot state="thinking" size={100} />
          <h2>{t('games.speechUnavailable') || 'Speech recognition not supported'}</h2>
          <p>
            {t('games.speechUnavailableMsg') || 'This exercise requires speech recognition. Try a different browser or tap the button to continue.'}
          </p>
          {currentQuestion && (
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="sig__word">{currentQuestion.word}</span>
              <br />
              <span className="sig__translation">{currentQuestion.wordTr}</span>
            </div>
          )}
          <div className="sig__actions">
            <button
              type="button"
              className="sig__btn sig__btn--mark-done"
              onClick={handleMarkDone}
            >
              {t('games.markAsDone') || 'Mark as done'}
            </button>
            <button
              type="button"
              className="sig__btn sig__btn--skip"
              onClick={handleSkip}
            >
              {t('games.skip')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Completion screen ────────────────────────────────────────────────────

  if (completed) {
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="sig">
        <Card variant="elevated" padding="xl" className="sig__completion">
          <motion.div
            className="sig__completion-content"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <UnifiedMascot state="celebrating" size={120} />

            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
            >
              {pct >= 90 ? (
                <Trophy size={48} color="var(--primary, #E8A317)" />
              ) : pct >= 60 ? (
                <Star size={48} fill="var(--primary, #E8A317)" color="var(--primary, #E8A317)" />
              ) : (
                <Check size={48} color="var(--mimi-green, #4caf50)" />
              )}
            </motion.span>

            <h2 className="sig__completion-title">
              {pct >= 80 ? t('games.amazingPronunciation') : pct >= 50 ? t('games.goodEffort') : t('games.keepPracticing')}
            </h2>

            <p className="sig__completion-score">
              {score} / {questions.length}
            </p>

            <span className="game-stars">
              {Array.from({ length: 3 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.4 + i * 0.15 }}
                >
                  <Star
                    size={32}
                    fill={i < stars ? 'var(--primary, #E8A317)' : 'none'}
                    color={i < stars ? 'var(--primary, #E8A317)' : '#ccc'}
                  />
                </motion.span>
              ))}
            </span>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.9 }}
            >
              <Badge variant="success" icon={<Sparkles size={14} />}>
                +{score * 15} XP
              </Badge>
            </motion.div>

            <div className="sig__completion-actions">
              <button
                type="button"
                className="sig__completion-btn sig__completion-btn--secondary"
                onClick={() => onComplete(score, questions.length)}
              >
                <ArrowRight size={16} />
                {t('games.backToGames')}
              </button>
              <button
                type="button"
                className="sig__completion-btn sig__completion-btn--primary"
                onClick={handlePlayAgain}
              >
                <RotateCcw size={16} />
                {t('games.playAgain')}
              </button>
            </div>
          </motion.div>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const progress = questions.length > 0 ? (currentIndex / questions.length) * 100 : 0;

  const cardClass = [
    'sig__card',
    feedbackType === 'correct' && 'sig__card--correct',
    feedbackType === 'wrong' && 'sig__card--wrong',
  ]
    .filter(Boolean)
    .join(' ');

  const micLabel =
    micState === 'listening'
      ? (t('games.listening') || 'Listening...')
      : micState === 'processing'
        ? (t('games.processing') || 'Processing...')
        : micState === 'success'
          ? (t('games.great') || 'Great!')
          : micState === 'error'
            ? (t('games.tryAgain') || 'Try again')
            : (t('games.speak') || 'Say it');

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="sig" role="application" aria-label="Say It pronunciation practice game">
      {/* Header */}
      <div className="sig__header">
        <h2 className="sig__title">Say It!</h2>
        <Badge variant="info">
          {currentIndex + 1} / {questions.length}
        </Badge>
      </div>

      <ProgressBar value={progress} variant="success" size="md" animated />

      <p className="sig__score-row">
        {t('games.score')}: {score}/{questions.length}
      </p>

      {/* Word card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${currentIndex}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28 }}
          className={cardClass}
        >
          {/* Illustration */}
          <WordIllustration word={currentQuestion.word} size={110} />

          {/* Word */}
          <div className="sig__word">
            {currentQuestion.word}
            <SpeakButton text={currentQuestion.word} size="md" />
          </div>
          <div className="sig__translation">{currentQuestion.wordTr}</div>

          {currentQuestion.phonetic && (
            <div className="sig__phonetic">/{currentQuestion.phonetic}/</div>
          )}

          {currentQuestion.hint && (
            <div className="sig__hint">{currentQuestion.hint}</div>
          )}

          {/* Mic button */}
          <div className="sig__mic-wrap">
            <button
              type="button"
              className={`sig__mic-btn sig__mic-btn--${micState}`}
              onClick={micState === 'listening' ? stopListening : startListening}
              disabled={micState === 'processing' || feedbackType === 'correct'}
              aria-label={micState === 'listening' ? 'Kaydı durdur' : 'Söylemeye başla'}
            >
              <MicIcon size={34} />
            </button>
            <span className="sig__mic-label" aria-live="polite">
              {micLabel}
            </span>
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {feedbackType && (
              <motion.div
                key={feedbackType}
                className={`sig__feedback sig__feedback--${feedbackType}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                aria-live="assertive"
              >
                {feedbackType === 'correct'
                  ? t('games.perfectWellDone')
                  : t('games.notQuiteRight')}

                {feedbackType === 'wrong' && heardText && (
                  <div className="sig__heard">
                    {t('games.youSaid')} &ldquo;<strong>{heardText}</strong>&rdquo; —{' '}
                    {t('games.expected')} &ldquo;<strong>{currentQuestion.word}</strong>&rdquo;
                  </div>
                )}

                {feedbackType === 'wrong' && (
                  <div className="sig__actions" style={{ marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      className="sig__btn sig__btn--retry"
                      onClick={startListening}
                    >
                      <MicIcon size={16} />
                      {t('games.tryAgain')}
                    </button>
                    <button
                      type="button"
                      className="sig__btn sig__btn--skip"
                      onClick={handleSkip}
                    >
                      {t('games.skip')}
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Always-visible skip (when not showing feedback skip) */}
      {!feedbackType && (
        <div className="sig__skip-row">
          <button
            type="button"
            className="sig__btn sig__btn--skip"
            onClick={handleSkip}
          >
            {t('games.skip')}
          </button>
        </div>
      )}
    </div>
  );
};

SayItGame.displayName = 'SayItGame';
