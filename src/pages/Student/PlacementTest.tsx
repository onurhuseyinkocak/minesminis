import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, Play, Check, Star } from 'lucide-react';
import { Button, ProgressBar, StarBurst } from '../../components/ui';
import { SFX } from '../../data/soundLibrary';
import MimiGuide from '../../components/MimiGuide';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import { LS_PLACEMENT_RESULT } from '../../config/storageKeys';
import './PlacementTest.css';

// ─── Inline SVG Illustrations ───────────────────────────────────────────────

function CatSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <circle cx="50" cy="55" r="30" fill="#94A3B8" />
      <polygon points="25,35 20,10 40,30" fill="#94A3B8" />
      <polygon points="27,32 23,15 37,30" fill="#F9A8D4" />
      <polygon points="75,35 80,10 60,30" fill="#94A3B8" />
      <polygon points="73,32 77,15 63,30" fill="#F9A8D4" />
      <circle cx="38" cy="50" r="5" fill="var(--success)" />
      <circle cx="62" cy="50" r="5" fill="var(--success)" />
      <circle cx="39" cy="49" r="2" fill="#0C0F1A" />
      <circle cx="63" cy="49" r="2" fill="#0C0F1A" />
      <polygon points="50,58 47,62 53,62" fill="#F9A8D4" />
      <path d="M47,64 Q50,68 53,64" fill="none" stroke="#64748B" strokeWidth="1.5" />
      <line x1="15" y1="55" x2="35" y2="58" stroke="#64748B" strokeWidth="1" />
      <line x1="15" y1="62" x2="35" y2="62" stroke="#64748B" strokeWidth="1" />
      <line x1="65" y1="58" x2="85" y2="55" stroke="#64748B" strokeWidth="1" />
      <line x1="65" y1="62" x2="85" y2="62" stroke="#64748B" strokeWidth="1" />
    </svg>
  );
}

function HatSVG() {
  return (
    <svg viewBox="0 0 100 100" width="80" height="80">
      <ellipse cx="50" cy="78" rx="45" ry="8" fill="#1E40AF" />
      <rect x="28" y="30" width="44" height="48" rx="3" fill="#2563EB" />
      <rect x="25" y="28" width="50" height="6" rx="2" fill="#1E40AF" />
      <rect x="28" y="60" width="44" height="6" fill="var(--warning)" />
    </svg>
  );
}

function BatSVG() {
  return (
    <svg viewBox="0 0 120 80" width="90" height="60">
      <ellipse cx="60" cy="45" rx="12" ry="18" fill="#475569" />
      <circle cx="60" cy="25" r="10" fill="#475569" />
      <polygon points="52,18 48,5 56,16" fill="#475569" />
      <polygon points="68,18 72,5 64,16" fill="#475569" />
      <circle cx="56" cy="23" r="2.5" fill="#FBBF24" />
      <circle cx="64" cy="23" r="2.5" fill="#FBBF24" />
      <path d="M48,38 Q20,20 5,45 Q15,40 25,42 Q18,50 10,55 Q25,48 35,50 Q30,55 28,62 L48,50Z" fill="#334155" />
      <path d="M72,38 Q100,20 115,45 Q105,40 95,42 Q102,50 110,55 Q95,48 85,50 Q90,55 92,62 L72,50Z" fill="#334155" />
    </svg>
  );
}

function PinSVG() {
  return (
    <svg viewBox="0 0 60 100" width="50" height="80">
      <circle cx="30" cy="22" r="18" fill="#EF4444" />
      <circle cx="30" cy="22" r="8" fill="#FCA5A5" />
      <rect x="28" y="38" width="4" height="40" fill="#94A3B8" />
      <polygon points="28,78 32,78 30,95" fill="#64748B" />
    </svg>
  );
}

function PenSVG() {
  return (
    <svg viewBox="0 0 100 100" width="70" height="70">
      <rect x="20" y="35" width="55" height="14" rx="2" fill="#3B82F6" transform="rotate(-30 50 42)" />
      <rect x="15" y="40" width="15" height="10" rx="1" fill="#1E40AF" transform="rotate(-30 22 45)" />
      <polygon points="72,58 85,68 70,63" fill="#94A3B8" transform="rotate(-5 75 62)" />
      <rect x="60" y="25" width="2" height="18" fill="#94A3B8" transform="rotate(-30 61 34)" />
    </svg>
  );
}

function PanSVG() {
  return (
    <svg viewBox="0 0 120 80" width="90" height="60">
      <ellipse cx="50" cy="45" rx="35" ry="25" fill="#475569" />
      <ellipse cx="50" cy="42" rx="30" ry="20" fill="#64748B" />
      <rect x="82" y="38" width="35" height="8" rx="3" fill="#92400E" />
    </svg>
  );
}

function BigDogSVG() {
  return (
    <svg viewBox="0 0 120 130" width="110" height="110">
      <ellipse cx="60" cy="80" rx="40" ry="25" fill="#92400E" />
      <circle cx="60" cy="38" r="25" fill="#A16207" />
      <ellipse cx="40" cy="20" rx="10" ry="15" fill="#78350F" transform="rotate(-15 40 20)" />
      <ellipse cx="80" cy="20" rx="10" ry="15" fill="#78350F" transform="rotate(15 80 20)" />
      <circle cx="50" cy="35" r="4" fill="#0C0F1A" />
      <circle cx="70" cy="35" r="4" fill="#0C0F1A" />
      <circle cx="51" cy="34" r="1.5" fill="#fff" />
      <circle cx="71" cy="34" r="1.5" fill="#fff" />
      <ellipse cx="60" cy="45" rx="5" ry="3.5" fill="#0C0F1A" />
      <path d="M55,49 Q60,55 65,49" fill="none" stroke="#0C0F1A" strokeWidth="1.5" />
      <ellipse cx="60" cy="55" rx="4" ry="5" fill="#F87171" />
      <rect x="30" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="50" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="60" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="80" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <path d="M98,73 Q115,55 108,45" fill="none" stroke="#92400E" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function SmallDogSVG() {
  return (
    <svg viewBox="0 0 120 130" width="55" height="55">
      <ellipse cx="60" cy="80" rx="40" ry="25" fill="#92400E" />
      <circle cx="60" cy="38" r="25" fill="#A16207" />
      <ellipse cx="40" cy="20" rx="10" ry="15" fill="#78350F" transform="rotate(-15 40 20)" />
      <ellipse cx="80" cy="20" rx="10" ry="15" fill="#78350F" transform="rotate(15 80 20)" />
      <circle cx="50" cy="35" r="4" fill="#0C0F1A" />
      <circle cx="70" cy="35" r="4" fill="#0C0F1A" />
      <circle cx="51" cy="34" r="1.5" fill="#fff" />
      <circle cx="71" cy="34" r="1.5" fill="#fff" />
      <ellipse cx="60" cy="45" rx="5" ry="3.5" fill="#0C0F1A" />
      <path d="M55,49 Q60,55 65,49" fill="none" stroke="#0C0F1A" strokeWidth="1.5" />
      <rect x="30" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="50" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="60" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <rect x="80" y="98" width="10" height="22" rx="4" fill="#92400E" />
      <path d="M98,75 Q105,80 103,85" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function MimiDragonSVG() {
  return (
    <svg viewBox="0 0 120 140" width="120" height="140">
      <ellipse cx="60" cy="100" rx="30" ry="25" fill="var(--success)" />
      <ellipse cx="60" cy="105" rx="20" ry="18" fill="#86EFAC" />
      <circle cx="60" cy="55" r="28" fill="var(--success)" />
      <ellipse cx="48" cy="48" rx="7" ry="8" fill="#fff" />
      <ellipse cx="72" cy="48" rx="7" ry="8" fill="#fff" />
      <circle cx="50" cy="49" r="4" fill="#FBBF24" />
      <circle cx="74" cy="49" r="4" fill="#FBBF24" />
      <circle cx="51" cy="48" r="2" fill="#0C0F1A" />
      <circle cx="75" cy="48" r="2" fill="#0C0F1A" />
      <circle cx="54" cy="62" r="2" fill="#15803D" />
      <circle cx="66" cy="62" r="2" fill="#15803D" />
      <path d="M45,68 Q60,80 75,68" fill="none" stroke="#15803D" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30,85 Q10,60 20,45 Q25,55 30,50 Q28,65 32,75Z" fill="#4ADE80" />
      <path d="M90,85 Q110,60 100,45 Q95,55 90,50 Q92,65 88,75Z" fill="#4ADE80" />
      <polygon points="45,30 40,12 50,28" fill="#FBBF24" />
      <polygon points="75,30 80,12 70,28" fill="#FBBF24" />
      <ellipse cx="42" cy="122" rx="10" ry="6" fill="var(--success)" />
      <ellipse cx="78" cy="122" rx="10" ry="6" fill="var(--success)" />
      <path d="M88,110 Q110,115 105,100 Q108,95 112,98" fill="none" stroke="#22C55E" strokeWidth="6" strokeLinecap="round" />
      <polygon points="110,95 118,90 115,100" fill="#4ADE80" />
    </svg>
  );
}

// ─── i18n ───────────────────────────────────────────────────────────────────

const ptContent = {
  en: {
    letsPlay: "Let's Play!",
    funQuestions: '5 fun questions',
    go: 'Go!',
    allDone: 'All Done!',
    startLearning: 'Start Learning!',
    great: 'Great!',
    almost: 'Almost!',
    listen: 'Listen!',
    whatSound: 'What sound?',
    buildWord: 'Build the word!',
    readThis: 'Read this!',
    whichOne: 'Which one?',
    sound: 'Sound',
  },
  tr: {
    letsPlay: 'Hadi Oynayalim!',
    funQuestions: '5 eglenceli soru',
    go: 'Basla!',
    allDone: 'Tamamlandi!',
    startLearning: 'Ogrenmeye Basla!',
    great: 'Harika!',
    almost: 'Neredeyse!',
    listen: 'Dinle!',
    whatSound: 'Hangi ses?',
    buildWord: 'Kelimeyi olustur!',
    readThis: 'Bunu oku!',
    whichOne: 'Hangisi?',
    sound: 'Ses',
  },
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────

type QuestionType = 'phoneme' | 'letter-sound' | 'blending' | 'decoding' | 'comprehension';

interface PlacementQuestion {
  id: number;
  type: QuestionType;
  ttsPrompt?: string;
  display?: string;
  soundTiles?: string[];
  soundOptions?: string[];
  options: string[];
  correctIndex: number;
  mimiEncouragement: string;
  mimiEncouragementTr: string;
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
    type: 'phoneme',
    ttsPrompt: 'sun',
    options: ['S', 'M', 'B'],
    correctIndex: 0,
    mimiEncouragement: 'Great listening!',
    mimiEncouragementTr: 'Harika dinleme!',
  },
  {
    id: 2,
    type: 'letter-sound',
    display: 'T',
    soundOptions: ['tuh', 'puh', 'kuh'],
    options: ['1', '2', '3'],
    correctIndex: 0,
    mimiEncouragement: 'You know your letters!',
    mimiEncouragementTr: 'Harfleri biliyorsun!',
  },
  {
    id: 3,
    type: 'blending',
    soundTiles: ['C', 'A', 'T'],
    options: ['cat', 'hat', 'bat'],
    correctIndex: 0,
    mimiEncouragement: 'Perfect blending!',
    mimiEncouragementTr: 'Mukemmel birlestirme!',
  },
  {
    id: 4,
    type: 'decoding',
    display: 'pin',
    options: ['pin', 'pen', 'pan'],
    correctIndex: 0,
    mimiEncouragement: 'You can read!',
    mimiEncouragementTr: 'Okuyabiliyorsun!',
  },
  {
    id: 5,
    type: 'comprehension',
    display: 'The dog is big.',
    options: ['big', 'small'],
    correctIndex: 0,
    mimiEncouragement: 'You understood it!',
    mimiEncouragementTr: 'Anladın!',
  },
];

// ─── Scoring logic ─────────────────────────────────────────────────────────

function getPlacementResult(score: number, isTr: boolean): { phase: number; group: number; phaseLabel: string } {
  if (score <= 1) return { phase: 1, group: 1, phaseLabel: isTr ? 'Aşama 1: İlk Sesler' : 'Phase 1: First Sounds' };
  if (score === 2) return { phase: 1, group: 2, phaseLabel: isTr ? 'Aşama 1: Daha Fazla Harf' : 'Phase 1: More Letters' };
  if (score === 3) return { phase: 2, group: 3, phaseLabel: isTr ? 'Aşama 2: Gelişen Harfler' : 'Phase 2: Growing Letters' };
  if (score === 4) return { phase: 3, group: 5, phaseLabel: isTr ? 'Aşama 3: Zor Sesler' : 'Phase 3: Tricky Sounds' };
  return { phase: 4, group: 7, phaseLabel: isTr ? 'Aşama 4: Son Sesler' : 'Phase 4: Final Sounds' };
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

// ─── Picture renderer (no text labels) ─────────────────────────────────────

function renderPicture(key: string) {
  switch (key) {
    case 'cat': return <CatSVG />;
    case 'hat': return <HatSVG />;
    case 'bat': return <BatSVG />;
    case 'pin': return <PinSVG />;
    case 'pen': return <PenSVG />;
    case 'pan': return <PanSVG />;
    case 'big': return <BigDogSVG />;
    case 'small': return <SmallDogSVG />;
    default: return null;
  }
}

// ─── Color constants — use CSS vars; keep minimal palette for dynamic inline borders ───

const C = {
  correct: 'var(--success, #22C55E)',
  wrong: 'var(--warning, #F59E0B)',
  primary: 'var(--primary, #FF6B35)',
  border: 'var(--border, #E2E8F0)',
  text: 'var(--text-primary)',
  textSec: 'var(--text-secondary)',
  cardAlt: 'var(--bg-soft)',
};

const SOUND_COLORS = ['var(--error, #EF4444)', 'var(--accent-blue, #3B82F6)', 'var(--success, #22C55E)'];

// ─── Component ─────────────────────────────────────────────────────────────

type Screen = 'intro' | 'question' | 'feedback' | 'result';

function PlacementTest() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { user } = useAuth();
  const isTr = lang === 'tr';
  const t = ptContent[lang];
  const [screen, setScreen] = useState<Screen>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const [showStarBurst, setShowStarBurst] = useState(false);

  const question = QUESTIONS[currentQ];

  // Auto-play TTS when a question appears
  useEffect(() => {
    if (screen === 'question' && question) {
      const timer = setTimeout(() => {
        if (question.ttsPrompt) {
          speak(question.ttsPrompt, 0.7);
        }
        if (question.soundTiles) {
          question.soundTiles.forEach((s, i) => {
            setTimeout(() => speak(s, 0.5), i * 700);
          });
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [screen, currentQ, question]);

  const handleAnswer = useCallback((index: number) => {
    if (selectedIndex !== null) return;
    const correct = index === question.correctIndex;
    setSelectedIndex(index);
    setIsCorrect(correct);
    if (correct) {
      SFX.correct();
    } else {
      SFX.wrong();
    }
    setAnswers((a) => [...a, correct]);

    setScreen('feedback');

    setTimeout(() => {
      if (currentQ + 1 < QUESTIONS.length) {
        setCurrentQ((q) => q + 1);
        setSelectedIndex(null);
        setScreen('question');
      } else {
        // FIX: Use the locally-computed `correct` boolean instead of relying on
        // the `score` state variable, which hasn't been flushed yet (async setState).
        // `newAnswers` holds the full truth — count directly from it.
        const newAnswers = [...answers, correct];
        const finalScore = newAnswers.filter(Boolean).length;
        const placement = getPlacementResult(finalScore, isTr);
        const res: PlacementResult = {
          score: finalScore,
          total: QUESTIONS.length,
          ...placement,
          timestamp: new Date().toISOString(),
        };
        setResult(res);
        localStorage.setItem(LS_PLACEMENT_RESULT, String(res.group));
        localStorage.setItem('mimi_placement_detail', JSON.stringify({
          ...res,
          phaseIndex: res.phase - 1,
        }));

        // FIX: Persist placement result to Supabase so it survives cross-device logins.
        // Fire-and-forget — don't block the UI transition on this.
        if (user) {
          const uid = user.uid;
          if (uid) {
            userService.getUserProfile(uid).then(existing => {
              const base = (existing?.settings as Record<string, unknown>) ?? {};
              userService.updateUserProfile(uid, {
                settings: {
                  ...base,
                  placement_phase: res.phase,
                  placement_group: res.group,
                  placement_score: res.score,
                  placement_date: res.timestamp,
                  setup_completed: true,
                },
              }).catch(() => {
                // localStorage is already written — non-fatal
              });
            }).catch(() => {});
          }
        }

        setShowStarBurst(true);
        setTimeout(() => setShowStarBurst(false), 1500);
        setScreen('result');
      }
    }, 1500);
  }, [selectedIndex, question, currentQ, answers, isTr, user]);

  // ─── Intro screen ─────────────────────────────────────────────────────

  if (screen === 'intro') {
    return (
      <div className="pt-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-centered-col"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          >
            <MimiDragonSVG />
          </motion.div>

          <h1 className="pt-hero-title">
            {t.letsPlay}
          </h1>
          <p className="pt-hero-subtitle">
            {t.funQuestions}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setScreen('question')}
            className="pt-go-button"
          >
            {t.go}
          </motion.button>
        </motion.div>

        <MimiGuide
          message="Just try your best! There's no pressure — every answer helps me find the right starting point for you."
          messageTr="Sadece elinden gelenin en iyisini yap! Her cevap, senin için en iyi başlangıç noktasını bulmama yardımcı oluyor."
          showOnce="mimi_guide_placement"
        />
      </div>
    );
  }

  // ─── Result screen ────────────────────────────────────────────────────

  if (screen === 'result' && result) {
    return (
      <div className="pt-container">
        {showStarBurst && <StarBurst count={16} />}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="pt-centered-col"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <MimiDragonSVG />
          </motion.div>

          <h1 className="pt-hero-title">
            {t.allDone}
          </h1>

          {/* Score dots */}
          <div className="pt-score-dots">
            {answers.map((correct, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15 }}
                className={`pt-score-dot ${correct ? 'pt-score-dot--correct' : 'pt-score-dot--wrong'}`}
              >
                {correct && <Check size={18} color="#fff" strokeWidth={3} />}
              </motion.div>
            ))}
          </div>

          {/* Phase badge */}
          <div className="pt-phase-badge">
            <Star size={20} color={C.primary} fill={C.primary} />
            <span className="pt-phase-label">{result.phaseLabel}</span>
          </div>

          <Button
            variant="primary"
            size="xl"
            onClick={() => navigate('/dashboard')}
            style={{ marginTop: '0.5rem', minHeight: 80, fontSize: '1.3rem' }}
            fullWidth
          >
            {t.startLearning}
          </Button>
        </motion.div>
      </div>
    );
  }

  // ─── Question + Feedback screens ──────────────────────────────────────

  const progress = ((currentQ + (screen === 'feedback' ? 1 : 0)) / QUESTIONS.length) * 100;

  return (
    <div className="pt-container">
      {/* Progress dots */}
      <div className="pt-dots">
        {QUESTIONS.map((_, i) => {
          let dotClass = 'pt-dot';
          if (i < currentQ) dotClass += answers[i] ? ' pt-dot--correct' : ' pt-dot--wrong';
          else if (i === currentQ) dotClass += ' pt-dot--current';
          return <div key={i} className={dotClass} />;
        })}
      </div>

      <ProgressBar value={progress} variant="success" size="sm" animated />

      <AnimatePresence mode="wait">
        {screen === 'feedback' ? (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="pt-feedback-card"
          >
            {isCorrect ? (
              <>
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8 }}
                >
                  <Check size={72} color={C.correct} strokeWidth={3} />
                </motion.div>
                <p className="pt-feedback-correct-text">
                  {t.great}
                </p>
              </>
            ) : (
              <>
                <div className="pt-feedback-wrong-icon">
                  <span style={{ fontSize: '2rem', color: C.wrong, fontWeight: 800 }}>~</span>
                </div>
                <p className="pt-feedback-wrong-text">
                  {t.almost}
                </p>
                <div className="pt-answer-reveal">
                  {question.type === 'phoneme' && (
                    <span style={{ fontSize: '2rem', fontWeight: 800, color: C.correct }}>
                      {question.options[question.correctIndex]}
                    </span>
                  )}
                  {question.type === 'letter-sound' && (
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, color: C.correct }}>
                      {isTr ? 'Ses' : 'Sound'} {question.correctIndex + 1}
                    </span>
                  )}
                  {(question.type === 'blending' || question.type === 'decoding' || question.type === 'comprehension') && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      {renderPicture(question.options[question.correctIndex])}
                    </div>
                  )}
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key={`q-${question.id}`}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            className="pt-question-card"
          >
            {question.type === 'phoneme' && (
              <Q1Phoneme q={question} selectedIndex={selectedIndex} onAnswer={handleAnswer} isTr={isTr} />
            )}
            {question.type === 'letter-sound' && (
              <Q2LetterSound q={question} selectedIndex={selectedIndex} onAnswer={handleAnswer} isTr={isTr} />
            )}
            {question.type === 'blending' && (
              <Q3Blending q={question} selectedIndex={selectedIndex} onAnswer={handleAnswer} isTr={isTr} />
            )}
            {question.type === 'decoding' && (
              <Q4Decoding q={question} selectedIndex={selectedIndex} onAnswer={handleAnswer} isTr={isTr} />
            )}
            {question.type === 'comprehension' && (
              <Q5Comprehension q={question} selectedIndex={selectedIndex} onAnswer={handleAnswer} isTr={isTr} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Question Sub-Components ────────────────────────────────────────────────

interface QProps {
  q: PlacementQuestion;
  selectedIndex: number | null;
  onAnswer: (index: number) => void;
  isTr: boolean;
}

/** Q1: "Listen!" -- big speaker, 3 large letter cards */
function Q1Phoneme({ q, selectedIndex, onAnswer, isTr }: QProps) {
  return (
    <>
      <h2 className="pt-q-title">{isTr ? 'Dinle!' : 'Listen!'}</h2>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => speak(q.ttsPrompt!, 0.7)}
        className="pt-speaker-btn"
      >
        <Volume2 size={48} color="var(--text-primary)" />
      </motion.button>
      <div className="pt-options-row">
        {q.options.map((letter, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onAnswer(i)}
            disabled={selectedIndex !== null}
            className={optionCardClass(i, selectedIndex, q.correctIndex)}
          >
            <span style={{ fontSize: '4.5rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
              {letter}
            </span>
          </motion.button>
        ))}
      </div>
    </>
  );
}

/** Q2: "What sound?" -- big letter + 3 play buttons */
function Q2LetterSound({ q, selectedIndex, onAnswer, isTr }: QProps) {
  return (
    <>
      <h2 className="pt-q-title">{isTr ? 'Hangi ses?' : 'What sound?'}</h2>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}
      >
        <span className="pt-big-letter">
          {q.display}
        </span>
      </motion.div>
      <div className="pt-options-row">
        {q.options.map((label, i) => {
          const isSelected = selectedIndex === i;
          const isCorrectOpt = i === q.correctIndex;
          const showResult = selectedIndex !== null;
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => {
                if (q.soundOptions) speak(q.soundOptions[i], 0.5);
                if (selectedIndex === null) onAnswer(i);
              }}
              disabled={selectedIndex !== null}
              className="pt-sound-circle"
              style={{
                border: `4px solid ${
                  showResult
                    ? isSelected
                      ? isCorrectOpt ? C.correct : C.wrong
                      : 'transparent'
                    : SOUND_COLORS[i]
                }`,
                backgroundColor: showResult && isSelected
                  ? isCorrectOpt ? 'var(--success-pale)' : 'var(--warning-pale)'
                  : 'var(--bg-elevated)',
                opacity: showResult && !isSelected ? 0.4 : 1,
              }}
            >
              <Play size={28} color={SOUND_COLORS[i]} fill={SOUND_COLORS[i]} />
              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>{label}</span>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}

/** Q3: "Build the word!" -- sound tiles + 3 picture cards */
function Q3Blending({ q, selectedIndex, onAnswer, isTr }: QProps) {
  return (
    <>
      <h2 className="pt-q-title">{isTr ? 'Kelimeyi olustur!' : 'Build the word!'}</h2>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
        {(q.soundTiles ?? []).map((tile, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            onClick={() => speak(tile, 0.5)}
            className="pt-sound-tile"
          >
            {tile}
          </motion.button>
        ))}
      </div>
      <div className="pt-options-row">
        {q.options.map((key, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onAnswer(i)}
            disabled={selectedIndex !== null}
            className={`${optionCardClass(i, selectedIndex, q.correctIndex)} pt-picture-card`}
          >
            {renderPicture(key)}
          </motion.button>
        ))}
      </div>
    </>
  );
}

/** Q4: "Read this!" -- big word + 3 picture cards */
function Q4Decoding({ q, selectedIndex, onAnswer, isTr }: QProps) {
  return (
    <>
      <h2 className="pt-q-title">{isTr ? 'Bunu oku!' : 'Read this!'}</h2>
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200 }}
        style={{ display: 'flex', justifyContent: 'center', padding: '0.5rem' }}
      >
        <span className="pt-big-word">
          {q.display}
        </span>
      </motion.div>
      <div className="pt-options-row">
        {q.options.map((key, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onAnswer(i)}
            disabled={selectedIndex !== null}
            className={`${optionCardClass(i, selectedIndex, q.correctIndex)} pt-picture-card`}
          >
            {renderPicture(key)}
          </motion.button>
        ))}
      </div>
    </>
  );
}

/** Q5: "Which one?" -- sentence + 2 big pictures */
function Q5Comprehension({ q, selectedIndex, onAnswer, isTr }: QProps) {
  return (
    <>
      <h2 className="pt-q-title">{isTr ? 'Hangisi?' : 'Which one?'}</h2>
      <div className="pt-sentence-box">
        <span className="pt-sentence-text">
          {q.display}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {q.options.map((key, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.93 }}
            onClick={() => onAnswer(i)}
            disabled={selectedIndex !== null}
            className={`${optionCardClass(i, selectedIndex, q.correctIndex)} pt-picture-card`}
            style={{ flex: 1, minHeight: 140 }}
          >
            {renderPicture(key)}
          </motion.button>
        ))}
      </div>
    </>
  );
}

// ─── Class name helpers (replaces old inline style helpers) ──────────────────

function optionCardClass(
  index: number,
  selectedIndex: number | null,
  correctIndex: number,
): string {
  const showResult = selectedIndex !== null;
  const isSelected = selectedIndex === index;
  const isCorrectOpt = index === correctIndex;
  let cls = 'pt-option-card';
  if (showResult) {
    if (isSelected) {
      cls += isCorrectOpt ? ' pt-option-card--correct' : ' pt-option-card--wrong';
    } else {
      cls += ' pt-option-card--dimmed';
    }
  }
  return cls;
}

// All styles are now in PlacementTest.css

export default PlacementTest;
