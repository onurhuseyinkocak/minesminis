import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, ArrowRight, Sparkles, Star } from 'lucide-react';
import { Button, Card, ProgressBar } from '../../components/ui';
import { SFX } from '../../data/soundLibrary';
import MimiGuide from '../../components/MimiGuide';
import { LS_PLACEMENT_RESULT } from '../../config/storageKeys';

// ─── Types ─────────────────────────────────────────────────────────────────

interface QuestionOption {
  label: string;
  value: string;
  emoji?: string;
  image?: string;
}

interface PlacementQuestion {
  id: number;
  skill: string;
  title: string;
  instruction: string;
  /** Text to speak aloud for the question (optional) */
  ttsPrompt?: string;
  /** Visual element to display (letter, word, sentence, or sound tiles) */
  display?: string;
  /** Sound tiles to show (for blending question) */
  soundTiles?: string[];
  options: QuestionOption[];
  correctValue: string;
  mimiEncouragement: string;
}

interface PlacementResult {
  score: number;
  total: number;
  phase: number;
  group: number;
  phaseLabel: string;
  timestamp: string;
}

// ─── Question data ─────────────────────────────────────────────────────────

const QUESTIONS: PlacementQuestion[] = [
  {
    id: 1,
    skill: 'Phoneme Awareness',
    title: 'Listen & Find!',
    instruction: 'What sound does this word START with?',
    ttsPrompt: 'sun',
    options: [
      { label: 's', value: 's', emoji: '🐍' },
      { label: 'm', value: 'm', emoji: '😋' },
      { label: 'b', value: 'b', emoji: '🏏' },
    ],
    correctValue: 's',
    mimiEncouragement: "Great listening! You have super ears!",
  },
  {
    id: 2,
    skill: 'Letter-Sound Knowledge',
    title: 'Sound Match!',
    instruction: 'Which sound does this letter make?',
    display: 't',
    ttsPrompt: undefined, // we play each option's sound
    options: [
      { label: '/t/', value: 't' },
      { label: '/p/', value: 'p' },
      { label: '/k/', value: 'k' },
    ],
    correctValue: 't',
    mimiEncouragement: "You know your letters! Amazing!",
  },
  {
    id: 3,
    skill: 'Blending',
    title: 'Blend It!',
    instruction: 'When we put these sounds together, what word do we get?',
    soundTiles: ['c', 'a', 't'],
    options: [
      { label: 'cat', value: 'cat', emoji: '🐱' },
      { label: 'hat', value: 'hat', emoji: '🎩' },
      { label: 'bat', value: 'bat', emoji: '🦇' },
    ],
    correctValue: 'cat',
    mimiEncouragement: "You blended those sounds perfectly!",
  },
  {
    id: 4,
    skill: 'Decoding',
    title: 'Read & Match!',
    instruction: 'Which picture matches this word?',
    display: 'pin',
    options: [
      { label: 'pin', value: 'pin', emoji: '📌' },
      { label: 'pen', value: 'pen', emoji: '🖊️' },
      { label: 'pan', value: 'pan', emoji: '🍳' },
    ],
    correctValue: 'pin',
    mimiEncouragement: "You can read words! So clever!",
  },
  {
    id: 5,
    skill: 'Comprehension',
    title: 'Read & Understand!',
    instruction: 'Which picture matches the sentence?',
    display: 'The dog is big.',
    options: [
      { label: 'Big dog', value: 'big', emoji: '🐕' },
      { label: 'Small dog', value: 'small', emoji: '🐩' },
    ],
    correctValue: 'big',
    mimiEncouragement: "You understood the sentence! Brilliant!",
  },
];

// ─── Scoring logic ─────────────────────────────────────────────────────────

function getPlacementResult(score: number): { phase: number; group: number; phaseLabel: string } {
  if (score <= 1) return { phase: 1, group: 1, phaseLabel: 'Phase 1: First Sounds' };
  if (score === 2) return { phase: 1, group: 2, phaseLabel: 'Phase 1: More Letters' };
  if (score === 3) return { phase: 2, group: 3, phaseLabel: 'Phase 2: Growing Letters' };
  if (score === 4) return { phase: 3, group: 5, phaseLabel: 'Phase 3: Tricky Sounds' };
  return { phase: 4, group: 7, phaseLabel: 'Phase 4: Final Sounds' };
}

// ─── TTS helper ────────────────────────────────────────────────────────────

function speak(text: string, rate = 0.75) {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'en-US';
    utter.rate = rate;
    window.speechSynthesis.speak(utter);
  }
}

// ─── Component ─────────────────────────────────────────────────────────────

type Screen = 'intro' | 'question' | 'feedback' | 'result';

function PlacementTest() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);

  const question = QUESTIONS[currentQ];

  // Auto-play TTS when a question appears
  useEffect(() => {
    if (screen === 'question' && question) {
      const timer = setTimeout(() => {
        if (question.ttsPrompt) {
          speak(question.ttsPrompt, 0.7);
        }
        if (question.soundTiles) {
          // Play each sound tile in sequence
          question.soundTiles.forEach((s, i) => {
            setTimeout(() => speak(s, 0.5), i * 700);
          });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [screen, currentQ, question]);

  const handleAnswer = useCallback((value: string) => {
    if (selectedValue !== null) return;
    const correct = value === question.correctValue;
    setSelectedValue(value);
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      SFX.correct();
    } else {
      SFX.wrong();
    }
    setAnswers((a) => [...a, correct]);

    // Show feedback briefly
    setScreen('feedback');

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ((q) => q + 1);
        setSelectedValue(null);
        setScreen('question');
      } else {
        // Calculate result
        const finalScore = correct ? score + 1 : score;
        const placement = getPlacementResult(finalScore);
        const res: PlacementResult = {
          score: finalScore,
          total: QUESTIONS.length,
          ...placement,
          timestamp: new Date().toISOString(),
        };
        setResult(res);
        localStorage.setItem(LS_PLACEMENT_RESULT, JSON.stringify(res));
        setScreen('result');
      }
    }, 2000);
  }, [selectedValue, question, currentQ, score]);

  const handlePlaySound = useCallback((text: string) => {
    speak(text, 0.7);
  }, []);

  // ─── Intro screen ─────────────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={styles.introCard}
        >
          <motion.span
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            style={{ fontSize: '4rem', display: 'block', textAlign: 'center' }}
          >
            🐉
          </motion.span>
          <h1 style={styles.introTitle}>Hi there!</h1>
          <p style={styles.introText}>
            I&apos;m Mimi! Let&apos;s play a quick game so I can find the best
            lessons for you. There are no wrong answers — just do your best!
          </p>
          <p style={styles.introSubtext}>5 quick questions</p>
          <Button
            variant="primary"
            size="xl"
            icon={<ArrowRight size={20} />}
            onClick={() => setScreen('question')}
            style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A', marginTop: '1rem' }}
            fullWidth
          >
            Let&apos;s Go!
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Result screen ────────────────────────────────────────────────────

  if (screen === 'result' && result) {
    return (
      <div style={styles.container}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={styles.resultCard}
        >
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{ fontSize: '4rem', display: 'block', textAlign: 'center' }}
          >
            🎉
          </motion.span>
          <h1 style={styles.resultTitle}>All Done!</h1>
          <p style={styles.resultText}>
            Mimi found the perfect starting point for you!
          </p>

          <Card variant="elevated" padding="lg">
            <div style={{ textAlign: 'center' }}>
              <div style={styles.resultBadge}>
                <Star size={20} color="#E8A317" fill="#E8A317" />
                <span>{result.phaseLabel}</span>
              </div>
              <p style={{ color: '#666', margin: '0.75rem 0 0', fontSize: '0.95rem' }}>
                You got {result.score} out of {result.total} — great job!
              </p>
            </div>
          </Card>

          {/* Progress dots showing answers */}
          <div style={styles.dotRow}>
            {answers.map((correct, i) => (
              <div
                key={i}
                style={{
                  ...styles.answerDot,
                  backgroundColor: correct ? '#10b981' : '#f59e0b',
                }}
              >
                {correct ? '✓' : '~'}
              </div>
            ))}
          </div>

          <p style={styles.mimiSpeech}>
            &quot;We&apos;ll have so much fun learning together! Let&apos;s start your
            adventure!&quot; — Mimi
          </p>

          <Button
            variant="primary"
            size="xl"
            icon={<Sparkles size={20} />}
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: '#1A6B5A', borderColor: '#1A6B5A', marginTop: '0.5rem' }}
            fullWidth
          >
            Start Learning!
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Question + Feedback screens ──────────────────────────────────────

  const progress = ((currentQ + (screen === 'feedback' ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div style={styles.container}>
      {/* Progress dots */}
      <div style={styles.progressRow}>
        {QUESTIONS.map((_, i) => (
          <div
            key={i}
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor:
                i < currentQ
                  ? answers[i]
                    ? '#10b981'
                    : '#f59e0b'
                  : i === currentQ
                  ? '#1A6B5A'
                  : '#e0e0e0',
              transition: 'background-color 0.3s',
            }}
          />
        ))}
      </div>

      <ProgressBar value={progress} variant="success" size="sm" animated />

      <AnimatePresence mode="wait">
        {screen === 'feedback' ? (
          /* ── Feedback overlay ── */
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            style={styles.feedbackCard}
          >
            <span style={{ fontSize: '3.5rem' }}>{isCorrect ? '🌟' : '💪'}</span>
            <h2 style={{ color: isCorrect ? '#1A6B5A' : '#E8A317', margin: '0.5rem 0' }}>
              {isCorrect ? 'Wonderful!' : 'Nice try!'}
            </h2>
            <p style={styles.mimiSpeech}>
              &quot;{question.mimiEncouragement}&quot; — Mimi
            </p>
          </motion.div>
        ) : (
          /* ── Question card ── */
          <motion.div
            key={`q-${question.id}`}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            style={styles.questionCard}
          >
            {/* Skill badge */}
            <div style={styles.skillBadge}>{question.skill}</div>

            <h2 style={styles.questionTitle}>{question.title}</h2>

            {/* Visual display area */}
            {question.display && (
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                style={styles.displayArea}
              >
                <span style={{
                  fontSize: question.display.length > 5 ? '1.8rem' : '4rem',
                  fontWeight: 800,
                  color: '#1A6B5A',
                }}>
                  {question.display}
                </span>
              </motion.div>
            )}

            {/* Sound tiles (for blending question) */}
            {question.soundTiles && (
              <div style={styles.tilesRow}>
                {question.soundTiles.map((tile, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.2 }}
                    onClick={() => speak(tile, 0.5)}
                    style={styles.soundTile}
                  >
                    {tile}
                  </motion.button>
                ))}
              </div>
            )}

            {/* TTS play button */}
            {question.ttsPrompt && (
              <Button
                variant="secondary"
                size="lg"
                icon={<Volume2 size={20} />}
                onClick={() => handlePlaySound(question.ttsPrompt!)}
                style={{ alignSelf: 'center', marginBottom: '0.5rem' }}
              >
                Listen Again
              </Button>
            )}

            <p style={styles.instruction}>{question.instruction}</p>

            {/* Options */}
            <div style={styles.optionsGrid}>
              {question.options.map((opt) => (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(opt.value)}
                  disabled={selectedValue !== null}
                  style={{
                    ...styles.optionButton,
                    opacity: selectedValue !== null && selectedValue !== opt.value ? 0.5 : 1,
                    borderColor:
                      selectedValue === opt.value
                        ? opt.value === question.correctValue
                          ? '#10b981'
                          : '#f59e0b'
                        : '#e0e0e0',
                    backgroundColor:
                      selectedValue === opt.value
                        ? opt.value === question.correctValue
                          ? '#ecfdf5'
                          : '#fffbeb'
                        : '#fff',
                  }}
                >
                  {opt.emoji && <span style={{ fontSize: '2rem' }}>{opt.emoji}</span>}
                  <span style={styles.optionLabel}>{opt.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <MimiGuide
        message="Don't worry, there are no wrong answers! Just try your best! \u{1F4AA}"
        messageTr="Endise etme, yanlis cevap yok! Sadece elinden gelenin en iyisini yap!"
        showOnce="mimi_guide_placement"
      />
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1.25rem',
    padding: '1.5rem',
    minHeight: '100vh',
    fontFamily: 'Nunito, sans-serif',
    maxWidth: '500px',
    margin: '0 auto',
  },
  progressRow: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    background: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    maxWidth: '420px',
    width: '100%',
    marginTop: '2rem',
  },
  introTitle: {
    textAlign: 'center' as const,
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  introText: {
    textAlign: 'center' as const,
    fontSize: '1.1rem',
    color: '#555',
    lineHeight: 1.6,
    margin: 0,
  },
  introSubtext: {
    textAlign: 'center' as const,
    fontSize: '0.9rem',
    color: '#999',
    margin: 0,
  },
  questionCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1.5rem',
    background: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    width: '100%',
  },
  skillBadge: {
    alignSelf: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#E8A317',
    background: '#FFF8E1',
    padding: '0.25rem 0.75rem',
    borderRadius: '1rem',
  },
  questionTitle: {
    textAlign: 'center' as const,
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  displayArea: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem',
    background: '#f0fdf4',
    borderRadius: '1rem',
    minHeight: '4rem',
  },
  tilesRow: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
  },
  soundTile: {
    width: '3.5rem',
    height: '3.5rem',
    borderRadius: '0.75rem',
    border: '3px solid #1A6B5A',
    backgroundColor: '#E8F5E9',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1A6B5A',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  instruction: {
    textAlign: 'center' as const,
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#333',
    margin: 0,
  },
  optionsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  optionButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    padding: '1rem 1.25rem',
    borderRadius: '1rem',
    border: '3px solid #e0e0e0',
    background: '#fff',
    cursor: 'pointer',
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.2s',
    width: '100%',
  },
  optionLabel: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#333',
  },
  feedbackCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '2rem',
    background: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    width: '100%',
    textAlign: 'center' as const,
  },
  mimiSpeech: {
    fontSize: '0.95rem',
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center' as const,
    margin: 0,
  },
  resultCard: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '2rem',
    background: '#fff',
    borderRadius: '1.5rem',
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    maxWidth: '420px',
    width: '100%',
    marginTop: '2rem',
  },
  resultTitle: {
    textAlign: 'center' as const,
    fontSize: '2rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  resultText: {
    textAlign: 'center' as const,
    fontSize: '1.1rem',
    color: '#555',
    margin: 0,
  },
  resultBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#1A6B5A',
    background: '#f0fdf4',
    padding: '0.5rem 1rem',
    borderRadius: '1rem',
  },
  dotRow: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'center',
  },
  answerDot: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
};

export default PlacementTest;
