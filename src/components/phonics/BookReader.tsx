import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Volume2, Mic, BookOpen } from 'lucide-react';
import { Button } from '../ui';
import type { DecodableBook } from '../../data/readingLibrary';
import { calculateStars } from '../../data/readingLibrary';

// --- TYPES ---

interface BookReaderProps {
  book: DecodableBook;
  onComplete: (comprehensionScore: number) => void;
  onClose?: () => void;
}

// --- TTS HELPER ---

function speak(text: string, rate = 0.75): void {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }
}

// --- COMPONENT ---

export const BookReader: React.FC<BookReaderProps> = ({ book, onComplete, onClose }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [phase, setPhase] = useState<'reading' | 'quiz' | 'result'>('reading');
  const [quizIndex, setQuizIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [direction, setDirection] = useState(1);

  const totalPages = book.pages.length;
  const page = book.pages[currentPage];
  const currentQuestion = book.comprehensionQuestions[quizIndex];

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const goNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      setDirection(1);
      setCurrentPage((p) => p + 1);
    } else {
      // Done reading, move to quiz
      setPhase('quiz');
    }
  }, [currentPage, totalPages]);

  const goPrevPage = useCallback(() => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  }, [currentPage]);

  const handleWordClick = useCallback((word: string) => {
    const clean = word.replace(/[^a-zA-Z']/g, '');
    if (clean) speak(clean, 0.7);
  }, []);

  const handleReadPage = useCallback(() => {
    if (page) speak(page.text, 0.65);
  }, [page]);

  const handleReadAloud = useCallback(() => {
    const SpeechRecognitionAPI =
      (window as unknown as Record<string, unknown>).SpeechRecognition ||
      (window as unknown as Record<string, unknown>).webkitSpeechRecognition;

    if (SpeechRecognitionAPI) {
      const recognition = new (SpeechRecognitionAPI as new () => SpeechRecognition)();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      setIsListening(true);

      recognition.onresult = () => {
        setIsListening(false);
      };
      recognition.onerror = () => {
        setIsListening(false);
      };
      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      setTimeout(() => {
        try { recognition.stop(); } catch { /* ignore */ }
      }, 10000);
    }
  }, []);

  const handleQuizAnswer = useCallback((optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    if (isCorrect) {
      setCorrectCount((c) => c + 1);
    }

    // Advance after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      if (quizIndex < book.comprehensionQuestions.length - 1) {
        setQuizIndex((q) => q + 1);
      } else {
        setPhase('result');
      }
    }, 1200);
  }, [showFeedback, currentQuestion, quizIndex, book.comprehensionQuestions.length]);

  const stars = calculateStars(correctCount, book.comprehensionQuestions.length);
  const xpEarned = stars * 10;

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (phase !== 'reading') return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevPage();
      } else if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [phase, goNextPage, goPrevPage, onClose]);

  // --- READING PHASE ---
  if (phase === 'reading' && page) {
    const words = page.text.split(/\s+/);
    const highlightSet = new Set(page.highlightWords.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')));

    return (
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          {onClose && (
            <button onClick={onClose} style={styles.closeBtn} aria-label="Close">
              <X size={24} />
            </button>
          )}
          <div style={styles.titleArea}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>{book.title.charAt(0).toUpperCase()}</div>
            <span style={styles.bookTitle}>{book.title}</span>
          </div>
          <div style={styles.pageIndicator}>
            {currentPage + 1} / {totalPages}
          </div>
        </div>

        {/* Progress bar */}
        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${((currentPage + 1) / totalPages) * 100}%`,
            }}
          />
        </div>

        {/* Page content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            initial={{ opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -direction * 60 }}
            transition={{ duration: 0.25 }}
            style={styles.pageContent}
          >
            {/* Illustration */}
            <div style={styles.illustration}>
              {page.illustration}
            </div>

            {/* Text */}
            <div style={styles.textArea}>
              {words.map((word, i) => {
                const clean = word.toLowerCase().replace(/[^a-z']/g, '');
                const isHighlight = highlightSet.has(clean);
                return (
                  <motion.span
                    key={i}
                    onClick={() => handleWordClick(word)}
                    whileTap={{ scale: 0.92 }}
                    style={{
                      ...styles.word,
                      backgroundColor: isHighlight ? 'rgba(232,163,23,0.12)' : 'transparent',
                      borderBottom: isHighlight ? '3px solid #F59E0B' : '3px solid transparent',
                      color: isHighlight ? '#92400E' : '#1F2937',
                    }}
                  >
                    {word}
                  </motion.span>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div style={styles.actionsRow}>
          <button
            onClick={handleReadPage}
            style={styles.actionBtn}
            aria-label="Read to me"
          >
            <Volume2 size={20} />
            <span>Read to me</span>
          </button>
          <button
            onClick={handleReadAloud}
            style={{
              ...styles.actionBtn,
              backgroundColor: isListening ? '#FEE2E2' : '#EFF6FF',
              color: isListening ? '#DC2626' : '#2563EB',
            }}
            disabled={isListening}
            aria-label="Read aloud"
          >
            <Mic size={20} />
            <span>{isListening ? 'Listening...' : 'Read aloud'}</span>
          </button>
        </div>

        {/* Navigation */}
        <div style={styles.navRow}>
          <button
            onClick={goPrevPage}
            style={{
              ...styles.navBtn,
              opacity: currentPage === 0 ? 0.3 : 1,
            }}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            <ChevronLeft size={28} />
          </button>

          <button
            onClick={goNextPage}
            style={styles.navBtnPrimary}
            aria-label={currentPage === totalPages - 1 ? 'Finish reading' : 'Next page'}
          >
            {currentPage === totalPages - 1 ? (
              <>
                <BookOpen size={20} />
                <span>Take Quiz</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight size={28} />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // --- QUIZ PHASE ---
  if (phase === 'quiz' && currentQuestion) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.titleArea}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 900 }}>{book.title.charAt(0).toUpperCase()}</div>
            <span style={styles.bookTitle}>Quiz Time!</span>
          </div>
          <div style={styles.pageIndicator}>
            {quizIndex + 1} / {book.comprehensionQuestions.length}
          </div>
        </div>

        <div style={styles.progressBarBg}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${((quizIndex + 1) / book.comprehensionQuestions.length) * 100}%`,
              backgroundColor: '#8B5CF6',
            }}
          />
        </div>

        <motion.div
          key={quizIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.quizContent}
        >
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--primary, #FF6B35)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, margin: '0 auto' }}>{currentQuestion.question.charAt(0).toUpperCase()}</div>
          <h2 style={styles.quizQuestion}>{currentQuestion.question}</h2>
          <p style={styles.quizQuestionTr}>{currentQuestion.questionTr}</p>

          <div style={styles.optionsGrid}>
            {currentQuestion.options.map((option, i) => {
              let optionStyle = { ...styles.optionBtn };
              if (showFeedback && selectedOption !== null) {
                if (i === currentQuestion.correctIndex) {
                  optionStyle = {
                    ...optionStyle,
                    backgroundColor: '#D1FAE5',
                    borderColor: '#10B981',
                    color: '#065F46',
                  };
                } else if (i === selectedOption && i !== currentQuestion.correctIndex) {
                  optionStyle = {
                    ...optionStyle,
                    backgroundColor: '#FEE2E2',
                    borderColor: '#EF4444',
                    color: '#991B1B',
                  };
                }
              }

              return (
                <motion.button
                  key={i}
                  onClick={() => handleQuizAnswer(i)}
                  whileTap={{ scale: 0.96 }}
                  style={optionStyle}
                  disabled={showFeedback}
                >
                  {option}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  // --- RESULT PHASE ---
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={styles.resultContent}
      >
        <div style={styles.starsRow}>
          {[1, 2, 3].map((s) => (
            <motion.span
              key={s}
              initial={{ opacity: 0, y: -20, rotate: -30 }}
              animate={{
                opacity: s <= stars ? 1 : 0.2,
                y: 0,
                rotate: 0,
              }}
              transition={{ delay: s * 0.2, type: 'spring' }}
              style={{
                fontSize: 56,
                filter: s <= stars ? 'none' : 'grayscale(1)',
              }}
            >
              {'\u2B50'}
            </motion.span>
          ))}
        </div>

        <h2 style={styles.resultTitle}>
          {stars === 3 ? 'Perfect Reading!' : stars === 2 ? 'Great Job!' : 'Good Try!'}
        </h2>

        <p style={styles.resultSubtitle}>
          You got {correctCount} out of {book.comprehensionQuestions.length} correct
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={styles.xpBadge}
        >
          +{xpEarned} XP
        </motion.div>

        <div style={styles.resultButtons}>
          <Button
            variant="primary"
            size="lg"
            onClick={() => onComplete(correctCount)}
            style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A' }}
          >
            Back to Library
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
            >
              Close
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

BookReader.displayName = 'BookReader';

// --- STYLES ---

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Nunito, sans-serif',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 20px',
    backgroundColor: '#F8F9FA',
    borderBottom: '1px solid #E5E7EB',
    gap: 12,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#6B7280',
    padding: 4,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
  },
  titleArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  bookEmoji: {
    fontSize: 28,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#1a1a2e',
  },
  pageIndicator: {
    fontSize: 14,
    fontWeight: 700,
    color: '#9CA3AF',
    backgroundColor: '#F3F4F6',
    padding: '4px 12px',
    borderRadius: 20,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: '#E5E7EB',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A6B5A',
    borderRadius: 4,
    transition: 'width 0.3s ease',
  },
  pageContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    gap: 28,
    overflow: 'auto',
  },
  illustration: {
    fontSize: 72,
    textAlign: 'center',
    lineHeight: 1.3,
    minHeight: 90,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    maxWidth: 520,
    lineHeight: 2,
  },
  word: {
    fontSize: 28,
    fontWeight: 700,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 8,
    transition: 'all 0.15s ease',
    userSelect: 'none',
    display: 'inline-block',
  },
  actionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    padding: '8px 20px',
  },
  actionBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '8px 16px',
    borderRadius: 24,
    border: 'none',
    backgroundColor: 'rgba(34,197,94,0.08)',
    color: '#1A6B5A',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px 24px',
    gap: 16,
  },
  navBtn: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    border: '2px solid #E5E7EB',
    backgroundColor: '#F8F9FA',
    color: '#6B7280',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnPrimary: {
    flex: 1,
    maxWidth: 240,
    height: 56,
    borderRadius: 28,
    border: 'none',
    backgroundColor: '#1A6B5A',
    color: '#FFF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    fontSize: 18,
    fontWeight: 800,
    fontFamily: 'Nunito, sans-serif',
  },
  quizContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    gap: 16,
  },
  quizEmoji: {
    fontSize: 64,
  },
  quizQuestion: {
    fontSize: 22,
    fontWeight: 800,
    color: '#1a1a2e',
    textAlign: 'center',
    margin: 0,
  },
  quizQuestionTr: {
    fontSize: 14,
    fontWeight: 600,
    color: '#9CA3AF',
    textAlign: 'center',
    margin: 0,
    fontStyle: 'italic',
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 400,
    marginTop: 16,
  },
  optionBtn: {
    padding: '16px 20px',
    borderRadius: 16,
    border: '2px solid #E5E7EB',
    backgroundColor: '#F8F9FA',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 700,
    color: '#334155',
    textAlign: 'center' as const,
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.15s ease',
    borderColor: '#E5E7EB',
  },
  resultContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    gap: 20,
  },
  starsRow: {
    display: 'flex',
    gap: 12,
  },
  resultTitle: {
    fontSize: 28,
    fontWeight: 900,
    color: '#1a1a2e',
    margin: 0,
    textAlign: 'center',
  },
  resultSubtitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#6B7280',
    margin: 0,
  },
  xpBadge: {
    fontSize: 24,
    fontWeight: 900,
    color: '#F59E0B',
    backgroundColor: 'rgba(232,163,23,0.12)',
    padding: '8px 24px',
    borderRadius: 20,
    border: '2px solid #F59E0B',
  },
  resultButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 16,
    alignItems: 'center',
  },
};
