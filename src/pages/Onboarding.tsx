/**
 * Onboarding — MinesMinis
 * Student-only flow: Welcome → Age group → Placement test → Learning path
 */
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { userService } from '../services/userService';
import { speak } from '../services/ttsService';
import toast from 'react-hot-toast';
import { LS_PLACEMENT_RESULT } from '../config/storageKeys';
import { useABTest } from '../hooks/useABTest';
import { analytics } from '../services/analytics';
import {
  ArrowLeft, ArrowRight, Rocket, Check, CheckCircle,
  Baby, BookOpen, Globe, Volume2, Lock as LockIcon, Sparkles, Feather,
} from 'lucide-react';
import { Button } from '../components/ui';
import LottieCharacter from '../components/LottieCharacter';
import './Onboarding.css';

// ── Types ─────────────────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────

const STUDENT_AGE_GROUPS: {
  value: string; label: string; labelTr: string;
  phase: string; phaseTr: string;
  desc: string; descTr: string;
}[] = [
  {
    value: '3-5', label: 'Ages 3–5', labelTr: '3–5 Yaş',
    phase: 'Little Ears', phaseTr: 'Küçük Kulaklar',
    desc: 'First sounds & letters', descTr: 'İlk sesler ve harfler',
  },
  {
    value: '5-7', label: 'Ages 5–7', labelTr: '5–7 Yaş',
    phase: 'Word Builders', phaseTr: 'Kelime Ustaları',
    desc: 'Reading first words', descTr: 'İlk kelimeleri okuma',
  },
  {
    value: '7-9', label: 'Ages 7–9', labelTr: '7–9 Yaş',
    phase: 'Story Makers', phaseTr: 'Hikaye Yazarları',
    desc: 'Fluency & stories', descTr: 'Akıcılık ve hikayeler',
  },
  {
    value: '9-10', label: 'Ages 9–10', labelTr: '9–10 Yaş',
    phase: 'Young Explorers', phaseTr: 'Genç Kaşifler',
    desc: 'Advanced phonics', descTr: 'İleri fonetik',
  },
];

const AGE_GROUP_ICONS: Record<string, React.ReactNode> = {
  '3-5': <Baby size={22} />,
  '5-7': <BookOpen size={22} />,
  '7-9': <Feather size={22} />,
  '9-10': <Rocket size={22} />,
};

const PLACEMENT_QUESTIONS = [
  // LEVEL 1 — Very basic (letter recognition)
  {
    id: 1,
    level: 1,
    title: 'Apple starts with which letter?',
    titleTr: 'Elma hangi harfle başlar?',
    options: [
      { label: 'A', value: 'correct' },
      { label: 'B', value: 'wrong1' },
      { label: 'C', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 2,
    level: 1,
    title: 'Cat starts with which letter?',
    titleTr: 'Cat (kedi) hangi harfle başlar?',
    options: [
      { label: 'C', value: 'correct' },
      { label: 'K', value: 'wrong1' },
      { label: 'T', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  // LEVEL 2 — Letter sounds
  {
    id: 3,
    level: 2,
    title: 'The letter "S" makes which sound?',
    titleTr: '"S" harfi hangi sesi çıkarır?',
    options: [
      { label: '"sss" like a snake', value: 'correct' },
      { label: '"mmm" like humming', value: 'wrong1' },
      { label: '"rrr" like a lion', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 4,
    level: 2,
    title: 'Which word starts with the M sound?',
    titleTr: 'Hangi kelime M sesiyle başlar?',
    options: [
      { label: 'Moon', value: 'correct' },
      { label: 'Sun', value: 'wrong1' },
      { label: 'Dog', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  // LEVEL 3 — CVC blending
  {
    id: 5,
    level: 3,
    title: 's – a – t = ?',
    titleTr: 's – a – t = ?',
    options: [
      { label: 'sat', value: 'correct' },
      { label: 'set', value: 'wrong1' },
      { label: 'sit', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 6,
    level: 3,
    title: 'p – i – g = ?',
    titleTr: 'p – i – g = ?',
    options: [
      { label: 'pig', value: 'correct' },
      { label: 'bag', value: 'wrong1' },
      { label: 'big', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  // LEVEL 4 — Sight words & vocabulary
  {
    id: 7,
    level: 4,
    title: 'What does "apple" mean?',
    titleTr: '"apple" ne demek?',
    options: [
      { label: 'Elma', value: 'correct' },
      { label: 'Armut', value: 'wrong1' },
      { label: 'Çilek', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 8,
    level: 4,
    title: 'What is the color RED in Turkish?',
    titleTr: 'RED rengi Türkçede ne demektir?',
    options: [
      { label: 'Kırmızı', value: 'correct' },
      { label: 'Mavi', value: 'wrong1' },
      { label: 'Yeşil', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  // LEVEL 5 — Sentences & grammar
  {
    id: 9,
    level: 5,
    title: 'Fill in the blank: "The cat ___ on the mat."',
    titleTr: 'Boşluğu doldur: "The cat ___ on the mat."',
    options: [
      { label: 'sits', value: 'correct' },
      { label: 'run', value: 'wrong1' },
      { label: 'happy', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 10,
    level: 5,
    title: 'Which is correct?',
    titleTr: 'Hangisi doğru?',
    options: [
      { label: 'I have a dog.', value: 'correct' },
      { label: 'I has a dog.', value: 'wrong1' },
      { label: 'I am a dog.', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  // LEVEL 6 — Advanced
  {
    id: 11,
    level: 6,
    title: 'What does "She is happy" mean in Turkish?',
    titleTr: '"She is happy" Türkçede ne anlama gelir?',
    options: [
      { label: 'O mutlu.', value: 'correct' },
      { label: 'O üzgün.', value: 'wrong1' },
      { label: 'O meşgul.', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 12,
    level: 6,
    title: 'Which word is an ADJECTIVE (sıfat)?',
    titleTr: 'Hangisi bir sıfattır (adjective)?',
    options: [
      { label: 'beautiful', value: 'correct' },
      { label: 'run', value: 'wrong1' },
      { label: 'table', value: 'wrong2' },
    ],
    correct: 'correct',
  },
];

const PHONICS_GROUPS = [
  { id: 1, name: 'Group 1', sounds: 's, a, t, p', desc: 'First letter sounds & simple words' },
  { id: 2, name: 'Group 2', sounds: 'i, n, m, d', desc: 'More consonants & short vowels' },
  { id: 3, name: 'Group 3', sounds: 'g, o, c, k', desc: 'Hard sounds & word families' },
  { id: 4, name: 'Group 4', sounds: 'e, u, r, b', desc: 'All short vowels & blends' },
  { id: 5, name: 'Group 5', sounds: 'h, f, l, ss', desc: 'Consonant digraphs & doubles' },
  { id: 6, name: 'Group 6', sounds: 'j, v, w, x', desc: 'Less common consonants' },
  { id: 7, name: 'Group 7', sounds: 'y, z, qu, ch', desc: 'Advanced digraphs & trigraphs' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function computePhonicsGroup(score: number, ageGroup: string, questionsAnswered: number = 3): number {
  // FIX: Enforce minimum question count before trusting the percentage.
  // If fewer than 3 questions were answered (e.g. early stop on 2 wrong + 1 right)
  // we cap the derived group at 3 to avoid over-placing on thin evidence.
  const MIN_QUESTIONS_FOR_FULL_RANGE = 3;
  const thinDataCap = questionsAnswered < MIN_QUESTIONS_FOR_FULL_RANGE ? 3 : 7;

  const percentage = questionsAnswered > 0 ? (score / questionsAnswered) * 100 : 0;

  // Age-based cap: younger children can't be placed too high
  const ageCap: Record<string, number> = { '3-5': 2, '5-7': 4, '7-9': 6, '9-10': 7 };
  const cap = Math.min(ageCap[ageGroup] ?? 4, thinDataCap);

  let group: number;
  if (percentage < 25) group = 1;
  else if (percentage < 45) group = 2;
  else if (percentage < 60) group = 3;
  else if (percentage < 75) group = 4;
  else if (percentage < 88) group = 5;
  else if (percentage < 95) group = 6;
  else group = 7;

  return Math.min(group, cap);
}

// ── Slide animation ────────────────────────────────────────────────────────────

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const TOTAL_STEPS = 4;

// ── Component ──────────────────────────────────────────────────────────────────

const Onboarding: React.FC = () => {
  usePageTitle('Kurulum', 'Setup');
  const { user, refreshUserProfile, setHasSkippedSetup } = useAuth();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const navigate = useNavigate();

  const handleSkip = useCallback(() => {
    setHasSkippedSetup(true);
    navigate('/dashboard', { replace: true });
  }, [setHasSkippedSetup, navigate]);

  // A/B test: reward style shown on onboarding completion
  // 'stars'    → star animation
  // 'xp_only'  → plain "+X XP" text
  // 'badges'   → badge icon
  const { variant: rewardStyle } = useABTest('reward_style');

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: nickname
  const [nickname, setNickname] = useState(user?.displayName?.split(' ')[0] || '');

  // Step 2: age group
  const [ageGroup, setAgeGroup] = useState('');

  // Step 3: placement test
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [placementDone, setPlacementDone] = useState(false);
  const [startingGroup, setStartingGroup] = useState(1);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);

  // Step 1: FTUE sub-stages
  const [welcomeStage, setWelcomeStage] = useState<'greeting' | 'tap' | 'name'>('greeting');
  const [mimiTapped, setMimiTapped] = useState(false);

  // Questions filtered by age group — 3-5 gets no test, 5-7 gets only levels 1-2
  const activeQuestions = useMemo(() => {
    if (ageGroup === '5-7') return PLACEMENT_QUESTIONS.filter(q => q.level <= 2);
    if (ageGroup === '7-9') return PLACEMENT_QUESTIONS.filter(q => q.level <= 4);
    return PLACEMENT_QUESTIONS;
  }, [ageGroup]);

  const goNext = useCallback(() => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); }, []);

  // When leaving age step: 3-5 year olds skip placement entirely
  const handleAgeNext = useCallback(() => {
    if (ageGroup === '3-5') {
      setStartingGroup(1);
      setPlacementDone(true);
      setDir(1);
      setStep(4);
    } else {
      goNext();
    }
  }, [ageGroup, goNext]);
  const goPrev = useCallback(() => {
    setDir(-1);
    setStep(s => {
      const prev = Math.max(s - 1, 1);
      // FIX: When navigating back from or within the placement step, reset all
      // placement state so answers don't carry over and inflate the score on retry.
      if (s === 3) {
        setAnswers({});
        setQuestionIdx(0);
        setPlacementDone(false);
        setStartingGroup(1);
        setConsecutiveWrong(0);
      }
      return prev;
    });
  }, []);

  const canProceed = (): boolean => {
    if (step === 1) return nickname.trim().length >= 2;
    if (step === 2) return !!ageGroup;
    if (step === 3) return placementDone;
    return true;
  };

  const handleAnswer = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);

    const isCorrect = activeQuestions[questionIdx].correct === value;
    const newConsecutiveWrong = isCorrect ? 0 : consecutiveWrong + 1;
    setConsecutiveWrong(newConsecutiveWrong);

    const isLastQuestion = questionIdx >= activeQuestions.length - 1;
    // Stop early if 3 consecutive wrong answers
    const shouldStop = newConsecutiveWrong >= 3 || isLastQuestion;

    if (shouldStop) {
      const score = activeQuestions.filter(q => updated[q.id] === q.correct).length;
      // FIX: `questionsAnswered` must reflect answers actually recorded in `updated`,
      // not `questionIdx + 1` which can be off-by-one when stopping early.
      const questionsAnswered = Object.keys(updated).length;
      const group = computePhonicsGroup(score, ageGroup, questionsAnswered);
      setStartingGroup(group);
      setTimeout(() => setPlacementDone(true), 350);
    } else {
      setTimeout(() => setQuestionIdx(i => i + 1), 350);
    }
  };

  const handleFinish = async () => {
    if (!user) { navigate('/login'); return; }
    setIsSubmitting(true);
    try {
      const gradeMap: Record<string, string> = {
        '3-5': 'primary', '5-7': 'primary', '7-9': 'grade2', '9-10': 'grade4',
      };
      const uid = user.uid;
      const placementScore = activeQuestions.filter(q => answers[q.id] === q.correct).length;

      await userService.createOrUpdateUserProfile(user, {
        role: 'student',
        displayName: nickname.trim() || user.displayName || 'Explorer',
        grade: gradeMap[ageGroup] || 'primary',
        avatar_emoji: 'A',
        mascotId: 'mimi_cat',
      });

      if (uid) {
        const existing = await userService.getUserProfile(uid);
        const base = (existing?.settings as Record<string, unknown>) ?? {};
        await userService.updateUserProfile(uid, {
          settings: {
            ...base,
            setup_completed: true,
            setup_date: new Date().toISOString(),
            avatar_emoji: 'A',
            mascotId: 'mimi_cat',
            startingPhonicsGroup: startingGroup,
            ageGroup,
            placementScore,
          },
        });
      }

      localStorage.setItem(LS_PLACEMENT_RESULT, String(startingGroup));
      // FIX: Use the same phase-from-group mapping as PlacementTest.tsx (getPlacementResult).
      // Old formula was: group<=2→1, group==3→2, group<=5→3, else→4
      // which diverged from the score-based formula used in the standalone test.
      // Unified rule: group 1-2 = Phase 1, group 3-4 = Phase 2, group 5-6 = Phase 3, group 7 = Phase 4.
      const phaseFromGroup =
        startingGroup <= 2 ? 1
        : startingGroup <= 4 ? 2
        : startingGroup <= 6 ? 3
        : 4;
      localStorage.setItem('mimi_placement_detail', JSON.stringify({
        phase: phaseFromGroup,
        group: startingGroup,
        phaseLabel: `Phase ${phaseFromGroup}`,
        ageGroup,
      }));

      const { createPet } = await import('../services/petService');
      await createPet(user.uid, 'mimi_cat', nickname.trim() || user.displayName || 'Explorer');

      // Track funnel events
      analytics.placementTestComplete(placementScore, activeQuestions.length, startingGroup);
      analytics.onboardingComplete(ageGroup, placementScore, startingGroup);

      await refreshUserProfile();
      toast.success(isTr ? `Hoş geldin, ${nickname}! Macera başlıyor!` : `Welcome, ${nickname}! Adventure starts!`);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Oops! ${msg}`, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 1: Welcome (FTUE) ────────────────────────────────────────────────

  const handleMimiTap = () => {
    if (welcomeStage === 'tap') {
      setMimiTapped(true);
      speak(isTr ? 'Merhaba!' : 'Hello!');
      setTimeout(() => setWelcomeStage('name'), 1200);
    } else if (welcomeStage === 'greeting') {
      setWelcomeStage('tap');
    }
  };

  const renderWelcome = () => (
    <motion.div
      key="welcome"
      custom={dir}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="onboarding-step"
    >
      {/* Mimi mascot — interactive */}
      <div
        className="onboarding-ftue-mascot"
        onClick={handleMimiTap}
        role="button"
        tabIndex={0}
        aria-label="Tap Mimi"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleMimiTap(); } }}
      >
        <motion.div
          className={`onboarding-ftue-ring${welcomeStage === 'tap' ? ' onboarding-ftue-ring--pulse' : ''}`}
          animate={welcomeStage === 'tap' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ repeat: welcomeStage === 'tap' ? Infinity : 0, duration: 1.5 }}
        >
          <LottieCharacter
            state={mimiTapped ? 'happy' : welcomeStage === 'greeting' ? 'wave' : 'idle'}
            size={130}
          />
        </motion.div>

        {/* Speech bubble */}
        <AnimatePresence mode="wait">
          {welcomeStage === 'greeting' && (
            <motion.div
              key="bubble-greet"
              className="onboarding-speech-bubble"
              initial={{ scale: 0, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.4 }}
            >
              {isTr ? 'Merhaba! Ben Mimi!' : "Hello! I'm Mimi!"}
            </motion.div>
          )}
          {welcomeStage === 'tap' && !mimiTapped && (
            <motion.div
              key="bubble-tap"
              className="onboarding-speech-bubble onboarding-speech-bubble--prompt"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {isTr ? 'Bana dokun!' : 'Tap me!'}
            </motion.div>
          )}
          {mimiTapped && (
            <motion.div
              key="bubble-happy"
              className="onboarding-speech-bubble onboarding-speech-bubble--happy"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              {isTr ? 'Harika!' : 'Yay!'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Greeting stage: continue button */}
      <AnimatePresence mode="wait">
        {welcomeStage === 'greeting' && (
          <motion.div
            key="greet-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.6 }}
            className="onboarding-ftue-content"
          >
            <h2 className="onboarding-welcome-title">
              {isTr ? "MinesMinis'e Hoş Geldin!" : 'Welcome to MinesMinis!'}
            </h2>
            <p className="onboarding-step-sub">
              {isTr
                ? 'Mimi ile İngilizce öğrenmek çok eğlenceli!'
                : 'Learning English with Mimi is super fun!'
              }
            </p>
            <Button
              variant="primary"
              size="lg"
              onClick={() => setWelcomeStage('tap')}
              icon={<ArrowRight size={18} />}
            >
              {isTr ? 'Mimi ile Tanış!' : 'Meet Mimi!'}
            </Button>
          </motion.div>
        )}

        {welcomeStage === 'tap' && (
          <motion.div
            key="tap-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="onboarding-ftue-content"
          >
            <p className="onboarding-tap-hint">
              {isTr ? 'Mimi\'ye dokun!' : 'Tap Mimi!'}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWelcomeStage('name')}
            >
              {isTr ? 'Atla' : 'Skip'}
            </Button>
          </motion.div>
        )}

        {welcomeStage === 'name' && (
          <motion.div
            key="name-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="onboarding-ftue-content"
          >
            <h2 className="onboarding-welcome-title">
              {isTr ? 'Sana nasıl seslenelim?' : 'What should we call you?'}
            </h2>

            <div className="onboarding-name-wrap">
              <input
                type="text"
                className="onboarding-name-input"
                placeholder={isTr ? 'Adın veya takma adın...' : 'Your name or nickname...'}
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                maxLength={20}
                autoFocus
                onKeyDown={e => e.key === 'Enter' && canProceed() && goNext()}
              />
              {nickname.trim().length >= 2 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="onboarding-name-check">
                  <Check size={16} />
                </motion.div>
              )}
            </div>

            {nickname.trim().length >= 2 && (
              <motion.p
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="onboarding-name-preview"
              >
                {isTr ? `Harika, ${nickname}!` : `Nice to meet you, ${nickname}!`}
              </motion.p>
            )}

            <div className="onboarding-actions">
              <Button
                variant="primary"
                size="lg"
                onClick={goNext}
                disabled={!canProceed()}
                icon={<ArrowRight size={18} />}
              >
                {isTr ? 'Devam Et' : 'Continue'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  // ── Step 2: Age group ─────────────────────────────────────────────────────

  const renderAgeGroup = () => (
    <motion.div
      key="age"
      custom={dir}
      variants={slide}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="onboarding-step"
    >
      <h2>{isTr ? `${nickname}, kaç yaşındasın?` : `${nickname}, how old are you?`}</h2>
      <p className="onboarding-step-sub">
        {isTr
          ? 'Yaş grubun mükemmel öğrenme yolunu belirler'
          : 'Your age group shapes your perfect learning path'
        }
      </p>

      <div className="onboarding-age-grid">
        {STUDENT_AGE_GROUPS.map((ag) => (
          <motion.button
            key={ag.value}
            type="button"
            className={`onboarding-age-card ${ageGroup === ag.value ? 'selected' : ''}`}
            onClick={() => setAgeGroup(ag.value)}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <span className="onboarding-age-icon-wrap">{AGE_GROUP_ICONS[ag.value]}</span>
            <span className="onboarding-age-range">{isTr ? ag.labelTr : ag.label}</span>
            <span className="onboarding-age-phase">{isTr ? ag.phaseTr : ag.phase}</span>
            <span className="onboarding-age-label">{isTr ? ag.descTr : ag.desc}</span>
            {ageGroup === ag.value && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="onboarding-age-check">
                <Check size={14} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      <div className="onboarding-actions">
        <Button variant="ghost" size="lg" onClick={goPrev} icon={<ArrowLeft size={18} />}>
          {isTr ? 'Geri' : 'Back'}
        </Button>
        <Button variant="primary" size="lg" onClick={handleAgeNext} disabled={!canProceed()} icon={<ArrowRight size={18} />}>
          {isTr ? 'Devam Et' : 'Continue'}
        </Button>
      </div>
    </motion.div>
  );

  // ── Step 3: Placement test ────────────────────────────────────────────────

  const renderPlacement = () => {
    if (placementDone) {
      const group = PHONICS_GROUPS[startingGroup - 1];
      return (
        <motion.div
          key="placement-done"
          custom={dir}
          variants={slide}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="onboarding-step"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300, delay: 0.1 }}
            className="onboarding-step-icon-large onboarding-step-icon-success"
          >
            <CheckCircle size={44} />
          </motion.div>
          <h2>{isTr ? 'Seviye Belirlendi!' : 'Level Found!'}</h2>
          <p className="onboarding-step-sub">
            {isTr
              ? <>Testine göre <strong>{group.name}</strong> ile başlamanı öneriyoruz.</>
              : <>Based on your test, we recommend starting at <strong>{group.name}</strong>.</>
            }
          </p>
          <div className="onboarding-phonics-result-card">
            <span className="onboarding-phonics-result-name">{group.name}</span>
            <span className="onboarding-phonics-result-sounds">{group.sounds}</span>
            <span className="onboarding-phonics-result-desc">{group.desc}</span>
          </div>
          <p className="onboarding-placement-explainer">
            {isTr
              ? 'Endişelenme! Öğrendikçe seviye atlarsın. Seviyeni istediğin zaman değiştirebilirsin.'
              : "Don't worry! You'll level up as you learn. You can always change your level later."
            }
          </p>
          <div className="onboarding-actions">
            <Button variant="ghost" size="lg" onClick={goPrev} icon={<ArrowLeft size={18} />}>
              {isTr ? 'Geri' : 'Back'}
            </Button>
            <Button variant="primary" size="lg" onClick={goNext} icon={<ArrowRight size={18} />}>
              {isTr ? 'Devam Et' : 'Continue'}
            </Button>
          </div>
        </motion.div>
      );
    }

    const q = activeQuestions[questionIdx];
    return (
      <motion.div
        key={`q-${questionIdx}`}
        custom={dir}
        variants={slide}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="onboarding-step"
      >
        <p className="onboarding-placement-label">
          {isTr ? 'Seviye Testi' : 'Placement Test'} · {questionIdx + 1}/{activeQuestions.length}
        </p>
        <h2 className="onboarding-placement-question">
          {isTr ? q.titleTr : q.title}
        </h2>

        <div className="onboarding-placement-dots">
          {activeQuestions.map((_, i) => (
            <div key={i} className={`onboarding-pdot ${i < questionIdx ? 'done' : ''} ${i === questionIdx ? 'active' : ''}`} />
          ))}
        </div>

        <div className="onboarding-placement-options">
          {q.options.map((opt) => {
            const selected = answers[q.id] === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                className={`onboarding-placement-option ${selected ? 'selected' : ''}`}
                onClick={() => handleAnswer(q.id, opt.value)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="onboarding-placement-option-indicator">
                  {selected ? <Check size={15} /> : null}
                </span>
                <span>{opt.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="onboarding-actions">
          <Button variant="ghost" size="lg" onClick={goPrev} icon={<ArrowLeft size={18} />}>
            {isTr ? 'Geri' : 'Back'}
          </Button>
          {/* FIX: "I don't know" skip option — treated as a wrong answer so
              the algorithm still gets a data point, but without forcing a guess. */}
          <Button
            variant="ghost"
            size="lg"
            onClick={() => handleAnswer(q.id, '__skip__')}
          >
            {isTr ? 'Bilmiyorum' : "I don't know"}
          </Button>
        </div>
      </motion.div>
    );
  };

  // ── Step 4: Learning path ─────────────────────────────────────────────────

  const renderLearningPath = () => {
    const phase = STUDENT_AGE_GROUPS.find(a => a.value === ageGroup);
    const group = PHONICS_GROUPS[startingGroup - 1];
    const next = PHONICS_GROUPS.slice(startingGroup, startingGroup + 2);

    return (
      <motion.div
        key="path"
        custom={dir}
        variants={slide}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="onboarding-step"
      >
        <div className="onboarding-step-icon-large onboarding-step-icon-primary">
          <Rocket size={36} />
        </div>
        <h2>{isTr ? `${nickname}, hazır mısın?` : `${nickname}, ready to fly?`}</h2>
        <p className="onboarding-step-sub">
          {isTr
            ? <>{phase?.phaseTr || 'İlk Adım'} aşamasından {group.name} ile başlıyoruz!</>
            : <>Starting in {phase?.phase || 'Phase 1'} with <strong>{group.name}</strong>!</>
          }
        </p>

        <div className="onboarding-path-units">
          <motion.div
            className="onboarding-path-unit current"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <span className="onboarding-path-unit-icon"><Volume2 size={20} /></span>
            <div className="onboarding-path-unit-info">
              <strong>{group.name}</strong>
              <span>{group.sounds}</span>
            </div>
            <span className="onboarding-path-unit-badge">{isTr ? 'Buradan Başla' : 'Start Here'}</span>
          </motion.div>
          {next.map((ng, i) => (
            <motion.div
              key={ng.id}
              className="onboarding-path-unit upcoming"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.15 + i * 0.08 }}
            >
              <span className="onboarding-path-unit-icon locked"><LockIcon size={18} /></span>
              <div className="onboarding-path-unit-info">
                <strong>{ng.name}</strong>
                <span>{ng.sounds}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* A/B test: reward_style — preview of the reward UI the user will see */}
        {rewardStyle === 'stars' && (
          <div className="onboarding-reward-preview">
            <Sparkles size={18} />
            <span>{isTr ? 'Yıldız kazan!' : 'Earn stars!'}</span>
          </div>
        )}
        {rewardStyle === 'xp_only' && (
          <div className="onboarding-reward-preview">
            <span>{isTr ? '+50 XP kazan!' : 'Earn +50 XP!'}</span>
          </div>
        )}
        {rewardStyle === 'badges' && (
          <div className="onboarding-reward-preview">
            <CheckCircle size={18} />
            <span>{isTr ? 'Rozet kazan!' : 'Earn a badge!'}</span>
          </div>
        )}

        <div className="onboarding-features-row">
          {[
            { icon: <Baby size={16} />, label: isTr ? 'Yaş uyumlu' : 'Age-adapted' },
            { icon: <Globe size={16} />, label: isTr ? 'Fonetik sistem' : 'Phonics-based' },
            { icon: <BookOpen size={16} />, label: isTr ? '16 oyun türü' : '16 game types' },
          ].map((f, i) => (
            <motion.div
              key={i}
              className="onboarding-feature-chip"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.07 }}
            >
              {f.icon}
              <span>{f.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="onboarding-actions">
          <Button variant="ghost" size="lg" onClick={goPrev} icon={<ArrowLeft size={18} />}>
            {isTr ? 'Geri' : 'Back'}
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinish}
            loading={isSubmitting}
            icon={<Rocket size={18} />}
          >
            {isSubmitting
              ? (isTr ? 'Hazırlanıyor...' : 'Preparing...')
              : (isTr ? 'Maceraya Başla!' : 'Begin Adventure!')
            }
          </Button>
        </div>
      </motion.div>
    );
  };

  // ── Progress bar ──────────────────────────────────────────────────────────

  const renderProgress = () => (
    <div className="onboarding-progress">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const s = i + 1;
        const done = step > s;
        const active = step === s;
        return (
          <div className="onboarding-progress-step" key={s}>
            {i > 0 && <div className={`onboarding-progress-line ${done ? 'active' : ''}`} />}
            <motion.div
              className={`onboarding-progress-dot ${active ? 'active' : ''} ${done ? 'completed' : ''}`}
              animate={active ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {done ? <Check size={13} /> : s}
            </motion.div>
          </div>
        );
      })}
    </div>
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="onboarding-page">
      <motion.div
        className="onboarding-card"
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Skip button — top-right corner, only on steps 1-3 */}
        {step < 4 && (
          <button
            type="button"
            className="onboarding-skip-btn"
            onClick={handleSkip}
            aria-label={isTr ? 'Kurulumu atla' : 'Skip setup'}
          >
            {isTr ? 'Atla' : 'Skip'}
          </button>
        )}

        {renderProgress()}

        <AnimatePresence mode="wait" custom={dir}>
          {step === 1 && renderWelcome()}
          {step === 2 && renderAgeGroup()}
          {step === 3 && renderPlacement()}
          {step === 4 && renderLearningPath()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
