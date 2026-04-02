/**
 * Onboarding -- MinesMinis
 * Student-only flow: Welcome -> Age group -> Placement test -> Learning path
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
import { savePlacementResult } from '../services/placementService';
import type { AgeGroup } from '../types/progress';
import type { PlacementLevel } from '../services/placementService';
import { useABTest } from '../hooks/useABTest';
import { analytics } from '../services/analytics';
import {
  ArrowLeft, ArrowRight, Rocket, Check, CheckCircle,
  Baby, BookOpen, Globe, Volume2, Lock as LockIcon, Sparkles, Feather,
} from 'lucide-react';
import LottieCharacter from '../components/LottieCharacter';

// ── Constants ───────────────────────────────────────────────────────────────

const STUDENT_AGE_GROUPS: {
  value: string; label: string; labelTr: string;
  phase: string; phaseTr: string;
  desc: string; descTr: string;
  color: string;
}[] = [
  { value: '3-5', label: 'Ages 3-5', labelTr: '3-5 Yas', phase: 'Little Ears', phaseTr: 'Kucuk Kulaklar', desc: 'First sounds & letters', descTr: 'Ilk sesler ve harfler', color: '#ec4899' },
  { value: '5-7', label: 'Ages 5-7', labelTr: '5-7 Yas', phase: 'Word Builders', phaseTr: 'Kelime Ustalari', desc: 'Reading first words', descTr: 'Ilk kelimeleri okuma', color: '#8b5cf6' },
  { value: '7-9', label: 'Ages 7-9', labelTr: '7-9 Yas', phase: 'Story Makers', phaseTr: 'Hikaye Yazarlari', desc: 'Fluency & stories', descTr: 'Akicilik ve hikayeler', color: '#3b82f6' },
  { value: '9-10', label: 'Ages 9-10', labelTr: '9-10 Yas', phase: 'Young Explorers', phaseTr: 'Genc Kasifler', desc: 'Advanced phonics', descTr: 'Ileri fonetik', color: '#10b981' },
];

const AGE_GROUP_ICONS: Record<string, React.ReactNode> = {
  '3-5': <Baby size={28} />,
  '5-7': <BookOpen size={28} />,
  '7-9': <Feather size={28} />,
  '9-10': <Rocket size={28} />,
};

const PLACEMENT_QUESTIONS = [
  { id: 1, level: 1, title: 'Apple starts with which letter?', titleTr: 'Elma hangi harfle baslar?', options: [{ label: 'A', value: 'correct' }, { label: 'B', value: 'wrong1' }, { label: 'C', value: 'wrong2' }], correct: 'correct' },
  { id: 2, level: 1, title: 'Cat starts with which letter?', titleTr: 'Cat (kedi) hangi harfle baslar?', options: [{ label: 'C', value: 'correct' }, { label: 'K', value: 'wrong1' }, { label: 'T', value: 'wrong2' }], correct: 'correct' },
  { id: 3, level: 2, title: 'The letter "S" makes which sound?', titleTr: '"S" harfi hangi sesi cikarir?', options: [{ label: '"sss" like a snake', value: 'correct' }, { label: '"mmm" like humming', value: 'wrong1' }, { label: '"rrr" like a lion', value: 'wrong2' }], correct: 'correct' },
  { id: 4, level: 2, title: 'Which word starts with the M sound?', titleTr: 'Hangi kelime M sesiyle baslar?', options: [{ label: 'Moon', value: 'correct' }, { label: 'Sun', value: 'wrong1' }, { label: 'Dog', value: 'wrong2' }], correct: 'correct' },
  { id: 5, level: 3, title: 's - a - t = ?', titleTr: 's - a - t = ?', options: [{ label: 'sat', value: 'correct' }, { label: 'set', value: 'wrong1' }, { label: 'sit', value: 'wrong2' }], correct: 'correct' },
  { id: 6, level: 3, title: 'p - i - g = ?', titleTr: 'p - i - g = ?', options: [{ label: 'pig', value: 'correct' }, { label: 'bag', value: 'wrong1' }, { label: 'big', value: 'wrong2' }], correct: 'correct' },
  { id: 7, level: 4, title: 'What does "apple" mean?', titleTr: '"apple" ne demek?', options: [{ label: 'Elma', value: 'correct' }, { label: 'Armut', value: 'wrong1' }, { label: 'Cilek', value: 'wrong2' }], correct: 'correct' },
  { id: 8, level: 4, title: 'What is the color RED in Turkish?', titleTr: 'RED rengi Turkcede ne demektir?', options: [{ label: 'Kirmizi', value: 'correct' }, { label: 'Mavi', value: 'wrong1' }, { label: 'Yesil', value: 'wrong2' }], correct: 'correct' },
  { id: 9, level: 5, title: '"The cat ___ on the mat."', titleTr: '"The cat ___ on the mat."', options: [{ label: 'sits', value: 'correct' }, { label: 'run', value: 'wrong1' }, { label: 'happy', value: 'wrong2' }], correct: 'correct' },
  { id: 10, level: 5, title: 'Which is correct?', titleTr: 'Hangisi dogru?', options: [{ label: 'I have a dog.', value: 'correct' }, { label: 'I has a dog.', value: 'wrong1' }, { label: 'I am a dog.', value: 'wrong2' }], correct: 'correct' },
  { id: 11, level: 6, title: '"She is happy" = ?', titleTr: '"She is happy" = ?', options: [{ label: 'O mutlu.', value: 'correct' }, { label: 'O uzgun.', value: 'wrong1' }, { label: 'O mesgul.', value: 'wrong2' }], correct: 'correct' },
  { id: 12, level: 6, title: 'Which is an ADJECTIVE?', titleTr: 'Hangisi bir sifat?', options: [{ label: 'beautiful', value: 'correct' }, { label: 'run', value: 'wrong1' }, { label: 'table', value: 'wrong2' }], correct: 'correct' },
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

// ── Helpers ─────────────────────────────────────────────────────────────────

function computePhonicsGroup(score: number, ageGroup: string, questionsAnswered: number = 3): number {
  const MIN_QUESTIONS_FOR_FULL_RANGE = 3;
  const thinDataCap = questionsAnswered < MIN_QUESTIONS_FOR_FULL_RANGE ? 3 : 7;
  const percentage = questionsAnswered > 0 ? (score / questionsAnswered) * 100 : 0;
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

const slide = {
  enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
};

const TOTAL_STEPS = 4;

// ── Component ───────────────────────────────────────────────────────────────

const Onboarding: React.FC = () => {
  usePageTitle('Kurulum', 'Setup');
  const { user, refreshUserProfile, setHasSkippedSetup } = useAuth();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const navigate = useNavigate();
  const handleSkip = useCallback(() => { setHasSkippedSetup(true); navigate('/dashboard', { replace: true }); }, [setHasSkippedSetup, navigate]);
  const { variant: rewardStyle } = useABTest('reward_style');

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nickname, setNickname] = useState(user?.displayName?.split(' ')[0] || '');
  const [ageGroup, setAgeGroup] = useState('');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [placementDone, setPlacementDone] = useState(false);
  const [startingGroup, setStartingGroup] = useState(1);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [welcomeStage, setWelcomeStage] = useState<'greeting' | 'name'>('greeting');

  const activeQuestions = useMemo(() => {
    if (ageGroup === '5-7') return PLACEMENT_QUESTIONS.filter(q => q.level <= 2);
    if (ageGroup === '7-9') return PLACEMENT_QUESTIONS.filter(q => q.level <= 4);
    return PLACEMENT_QUESTIONS;
  }, [ageGroup]);

  const goNext = useCallback(() => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); }, []);
  const handleAgeNext = useCallback(() => {
    if (ageGroup === '3-5') { setStartingGroup(1); setPlacementDone(true); setDir(1); setStep(4); }
    else goNext();
  }, [ageGroup, goNext]);
  const goPrev = useCallback(() => {
    setDir(-1);
    setStep(s => {
      const prev = Math.max(s - 1, 1);
      if (s === 3) { setAnswers({}); setQuestionIdx(0); setPlacementDone(false); setStartingGroup(1); setConsecutiveWrong(0); }
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
    const shouldStop = newConsecutiveWrong >= 3 || questionIdx >= activeQuestions.length - 1;
    if (shouldStop) {
      const score = activeQuestions.filter(q => updated[q.id] === q.correct).length;
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
      const gradeMap: Record<string, string> = { '3-5': 'primary', '5-7': 'primary', '7-9': 'grade2', '9-10': 'grade4' };
      const uid = user.uid;
      const placementScore = activeQuestions.filter(q => answers[q.id] === q.correct).length;
      await userService.createOrUpdateUserProfile(user, {
        role: 'student', displayName: nickname.trim() || user.displayName || 'Explorer',
        grade: gradeMap[ageGroup] || 'primary', avatar_emoji: 'A', mascotId: 'mimi_cat',
      });
      if (uid) {
        const existing = await userService.getUserProfile(uid);
        const base = (existing?.settings as Record<string, unknown>) ?? {};
        await userService.updateUserProfile(uid, {
          settings: { ...base, setup_completed: true, setup_date: new Date().toISOString(), avatar_emoji: 'A', mascotId: 'mimi_cat', startingPhonicsGroup: startingGroup, ageGroup, placementScore },
        });
      }
      localStorage.setItem(LS_PLACEMENT_RESULT, String(startingGroup));
      const phaseFromGroup = startingGroup <= 2 ? 1 : startingGroup <= 4 ? 2 : startingGroup <= 6 ? 3 : 4;
      localStorage.setItem('mimi_placement_detail', JSON.stringify({ phase: phaseFromGroup, group: startingGroup, phaseLabel: `Phase ${phaseFromGroup}`, ageGroup }));
      const ageGroupMap: Record<string, AgeGroup> = { '3-5': 'little-ears', '5-7': 'word-builders', '7-9': 'story-makers', '9-10': 'young-explorers' };
      const mappedAgeGroup: AgeGroup = ageGroupMap[ageGroup] ?? 'word-builders';
      savePlacementResult({
        phonicsGroup: startingGroup as PlacementLevel, ageGroup: mappedAgeGroup,
        startUnitId: `s${startingGroup}-u1`, phaseId: '',
        accuracy: activeQuestions.length > 0 ? Math.round((placementScore / activeQuestions.length) * 100) : 0,
        questionsAnswered: Object.keys(answers).length, determinedAt: new Date().toISOString(),
      });
      const { createPet } = await import('../services/petService');
      await createPet(user.uid, 'mimi_cat', nickname.trim() || user.displayName || 'Explorer');
      analytics.placementTestComplete(placementScore, activeQuestions.length, startingGroup);
      analytics.onboardingComplete(ageGroup, placementScore, startingGroup);
      await refreshUserProfile();
      toast.success(isTr ? `Hos geldin, ${nickname}! Macera basliyor!` : `Welcome, ${nickname}! Adventure starts!`);
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Please try again.';
      toast.error(`Oops! ${msg}`, { duration: 6000 });
    } finally { setIsSubmitting(false); }
  };

  // ── Progress dots ─────────────────────────────────────────────────────────

  const ProgressDots = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const s = i + 1;
        const done = step > s;
        const active = step === s;
        return (
          <motion.div
            key={s}
            className={`w-3 h-3 rounded-full transition-all ${
              done ? 'bg-emerald-400' : active ? 'bg-orange-500 scale-125' : 'bg-gray-200'
            }`}
            animate={active ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        );
      })}
    </div>
  );

  // ── Step 1: Welcome ───────────────────────────────────────────────────────

  const renderWelcome = () => (
    <motion.div key="welcome" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="flex flex-col items-center"
    >
      {welcomeStage === 'greeting' ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
            className="mb-4"
            onClick={() => { speak(isTr ? 'Merhaba!' : 'Hello!'); }}
            role="button" tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); speak(isTr ? 'Merhaba!' : 'Hello!'); } }}
          >
            <LottieCharacter state="wave" size={120} />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-2xl font-bold text-gray-800 text-center mb-2"
          >
            {isTr ? "MinesMinis'e Hos Geldin!" : 'Welcome to MinesMinis!'}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-sm text-gray-500 text-center mb-6"
          >
            {isTr ? 'Mimi ile Ingilizce ogrenmek cok eglenceli!' : 'Learning English with Mimi is super fun!'}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="min-h-[48px] px-8 bg-orange-500 text-white text-base font-bold rounded-3xl flex items-center gap-2 shadow-lg shadow-orange-200"
            onClick={() => setWelcomeStage('name')}
          >
            {isTr ? 'Baslayalim!' : "Let's Go!"}
            <ArrowRight size={18} />
          </motion.button>
        </>
      ) : (
        <>
          <LottieCharacter state="happy" size={80} />
          <h2 className="text-xl font-bold text-gray-800 text-center mt-3 mb-1">
            {isTr ? 'Sana nasil seslenelim?' : 'What should we call you?'}
          </h2>
          <div className="w-full max-w-xs relative mt-4 mb-3">
            <input
              type="text"
              className="w-full min-h-[56px] px-5 text-center text-lg font-bold bg-gray-50 border-2 border-gray-200 rounded-3xl focus:border-orange-400 focus:outline-none"
              placeholder={isTr ? 'Adin...' : 'Your name...'}
              value={nickname} onChange={e => setNickname(e.target.value)}
              maxLength={20} autoFocus
              onKeyDown={e => e.key === 'Enter' && canProceed() && goNext()}
            />
            {nickname.trim().length >= 2 && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-emerald-400 rounded-full flex items-center justify-center">
                <Check size={14} className="text-white" />
              </motion.div>
            )}
          </div>
          {nickname.trim().length >= 2 && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-orange-500 font-medium mb-4">
              {isTr ? `Harika, ${nickname}!` : `Nice to meet you, ${nickname}!`}
            </motion.p>
          )}
          <button
            className="min-h-[48px] px-8 bg-orange-500 text-white text-base font-bold rounded-3xl flex items-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-40"
            onClick={goNext} disabled={!canProceed()}
          >
            {isTr ? 'Devam Et' : 'Continue'} <ArrowRight size={18} />
          </button>
        </>
      )}
    </motion.div>
  );

  // ── Step 2: Age group ─────────────────────────────────────────────────────

  const renderAgeGroup = () => (
    <motion.div key="age" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
      transition={{ type: 'spring', damping: 26, stiffness: 220 }}
      className="flex flex-col items-center"
    >
      <h2 className="text-xl font-bold text-gray-800 text-center mb-1">
        {isTr ? `${nickname}, kac yasindasin?` : `${nickname}, how old are you?`}
      </h2>
      <p className="text-sm text-gray-500 text-center mb-5">
        {isTr ? 'Yas grubunu sec' : 'Choose your age group'}
      </p>
      <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
        {STUDENT_AGE_GROUPS.map((ag) => (
          <motion.button
            key={ag.value} type="button"
            whileTap={{ scale: 0.95 }}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-3xl border-2 transition-all min-h-[120px] ${
              ageGroup === ag.value
                ? 'border-orange-400 bg-orange-50 shadow-lg shadow-orange-100'
                : 'border-gray-100 bg-white'
            }`}
            onClick={() => setAgeGroup(ag.value)}
          >
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: ag.color }}>
              {AGE_GROUP_ICONS[ag.value]}
            </div>
            <span className="text-base font-bold text-gray-800">{isTr ? ag.labelTr : ag.label}</span>
            <span className="text-[11px] text-gray-500">{isTr ? ag.phaseTr : ag.phase}</span>
            {ageGroup === ag.value && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      <div className="flex gap-3">
        <button className="min-h-[48px] px-5 bg-gray-100 text-gray-600 text-sm font-bold rounded-3xl flex items-center gap-1" onClick={goPrev}>
          <ArrowLeft size={16} /> {isTr ? 'Geri' : 'Back'}
        </button>
        <button className="min-h-[48px] px-8 bg-orange-500 text-white text-sm font-bold rounded-3xl flex items-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-40" onClick={handleAgeNext} disabled={!canProceed()}>
          {isTr ? 'Devam Et' : 'Continue'} <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );

  // ── Step 3: Placement ─────────────────────────────────────────────────────

  const renderPlacement = () => {
    if (placementDone) {
      const group = PHONICS_GROUPS[startingGroup - 1];
      return (
        <motion.div key="placement-done" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
          transition={{ type: 'spring', damping: 26, stiffness: 220 }}
          className="flex flex-col items-center"
        >
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 12 }}
            className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4"
          >
            <CheckCircle size={36} className="text-emerald-500" />
          </motion.div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{isTr ? 'Seviye Belirlendi!' : 'Level Found!'}</h2>
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-4 w-full max-w-xs text-center mb-4">
            <p className="text-lg font-bold text-orange-600">{group.name}</p>
            <p className="text-sm text-gray-600 mt-1">{group.sounds}</p>
            <p className="text-xs text-gray-500 mt-1">{group.desc}</p>
          </div>
          <p className="text-xs text-gray-500 text-center mb-6 max-w-xs">
            {isTr ? 'Endiselenme! Ogrendikce seviye atlarsin.' : "Don't worry! You'll level up as you learn."}
          </p>
          <div className="flex gap-3">
            <button className="min-h-[48px] px-5 bg-gray-100 text-gray-600 text-sm font-bold rounded-3xl flex items-center gap-1" onClick={goPrev}>
              <ArrowLeft size={16} /> {isTr ? 'Geri' : 'Back'}
            </button>
            <button className="min-h-[48px] px-8 bg-orange-500 text-white text-sm font-bold rounded-3xl flex items-center gap-2" onClick={goNext}>
              {isTr ? 'Devam Et' : 'Continue'} <ArrowRight size={18} />
            </button>
          </div>
        </motion.div>
      );
    }

    const q = activeQuestions[questionIdx];
    return (
      <motion.div key={`q-${questionIdx}`} custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="flex flex-col items-center w-full"
      >
        <p className="text-xs text-gray-400 font-bold mb-2">
          {questionIdx + 1}/{activeQuestions.length}
        </p>
        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5">
          {activeQuestions.map((_, i) => (
            <div key={i} className={`w-2.5 h-2.5 rounded-full ${i < questionIdx ? 'bg-emerald-400' : i === questionIdx ? 'bg-orange-500' : 'bg-gray-200'}`} />
          ))}
        </div>
        <div className="flex items-center justify-center gap-2 mb-5 max-w-xs">
          <h2 className="text-lg font-bold text-gray-800 text-center">
            {isTr ? q.titleTr : q.title}
          </h2>
          <button
            type="button"
            aria-label={isTr ? 'Soruyu dinle' : 'Listen to question'}
            className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center hover:bg-blue-100 transition-colors"
            onClick={() => speak(q.title)}
          >
            <Volume2 size={18} />
          </button>
        </div>
        <div className="flex flex-col gap-2.5 w-full max-w-xs mb-6">
          {q.options.map((opt) => {
            const selected = answers[q.id] === opt.value;
            return (
              <motion.button
                key={opt.value} type="button"
                whileTap={{ scale: 0.97 }}
                className={`min-h-[56px] px-5 rounded-3xl text-left text-base font-medium border-2 transition-all flex items-center gap-3 ${
                  selected ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-white'
                }`}
                onClick={() => handleAnswer(q.id, opt.value)}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                  selected ? 'bg-orange-500' : 'bg-gray-100'
                }`}>
                  {selected && <Check size={14} className="text-white" />}
                </div>
                <span>{opt.label}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <button className="min-h-[48px] px-5 bg-gray-100 text-gray-600 text-sm font-bold rounded-3xl flex items-center gap-1" onClick={goPrev}>
            <ArrowLeft size={16} /> {isTr ? 'Geri' : 'Back'}
          </button>
          <button className="min-h-[48px] px-5 text-gray-400 text-sm font-medium rounded-3xl" onClick={() => handleAnswer(q.id, '__skip__')}>
            {isTr ? 'Bilmiyorum' : "I don't know"}
          </button>
        </div>
      </motion.div>
    );
  };

  // ── Step 4: Ready ─────────────────────────────────────────────────────────

  const renderLearningPath = () => {
    const phase = STUDENT_AGE_GROUPS.find(a => a.value === ageGroup);
    const group = PHONICS_GROUPS[startingGroup - 1];
    const next = PHONICS_GROUPS.slice(startingGroup, startingGroup + 2);
    return (
      <motion.div key="path" custom={dir} variants={slide} initial="enter" animate="center" exit="exit"
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="flex flex-col items-center"
      >
        <motion.div initial={{ scale: 0, rotate: -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', damping: 12 }}
          className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4"
        >
          <Rocket size={32} className="text-orange-500" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          {isTr ? `${nickname}, hazir misin?` : `${nickname}, ready to fly?`}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5">
          {isTr
            ? <>{phase?.phaseTr || 'Ilk Adim'} - {group.name}</>
            : <>Starting with <strong>{group.name}</strong></>}
        </p>

        {/* Path cards */}
        <div className="w-full max-w-xs flex flex-col gap-2.5 mb-6">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }}
            className="bg-orange-50 border border-orange-200 rounded-3xl p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center flex-shrink-0">
              <Volume2 size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{group.name}</p>
              <p className="text-xs text-gray-500">{group.sounds}</p>
            </div>
            <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full whitespace-nowrap">
              {isTr ? 'Baslangic' : 'Start'}
            </span>
          </motion.div>
          {next.map((ng, i) => (
            <motion.div key={ng.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 + i * 0.08 }}
              className="bg-gray-50 border border-gray-100 rounded-3xl p-4 flex items-center gap-3 opacity-60"
            >
              <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center flex-shrink-0">
                <LockIcon size={18} className="text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-600">{ng.name}</p>
                <p className="text-xs text-gray-400">{ng.sounds}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feature chips */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {[
            { icon: <Baby size={14} />, label: isTr ? 'Yas uyumlu' : 'Age-adapted' },
            { icon: <Globe size={14} />, label: isTr ? 'Fonetik' : 'Phonics' },
            { icon: <BookOpen size={14} />, label: isTr ? '16 oyun' : '16 games' },
          ].map((f, i) => (
            <motion.span key={i} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-center gap-1.5 text-[11px] font-medium text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full"
            >
              {f.icon} {f.label}
            </motion.span>
          ))}
        </div>

        {/* Reward preview */}
        {rewardStyle === 'stars' && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-4"><Sparkles size={14} /> {isTr ? 'Yildiz kazan!' : 'Earn stars!'}</div>
        )}
        {rewardStyle === 'xp_only' && (
          <div className="text-xs text-amber-600 mb-4">{isTr ? '+50 XP kazan!' : 'Earn +50 XP!'}</div>
        )}
        {rewardStyle === 'badges' && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 mb-4"><CheckCircle size={14} /> {isTr ? 'Rozet kazan!' : 'Earn a badge!'}</div>
        )}

        <div className="flex gap-3">
          <button className="min-h-[48px] px-5 bg-gray-100 text-gray-600 text-sm font-bold rounded-3xl flex items-center gap-1" onClick={goPrev}>
            <ArrowLeft size={16} /> {isTr ? 'Geri' : 'Back'}
          </button>
          <button
            className="min-h-[56px] px-8 bg-orange-500 text-white text-base font-bold rounded-3xl flex items-center gap-2 shadow-lg shadow-orange-200 disabled:opacity-60"
            onClick={handleFinish} disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Rocket size={20} />}
            {isSubmitting ? (isTr ? 'Hazirlaniyor...' : 'Preparing...') : (isTr ? 'Maceraya Basla!' : 'Begin Adventure!')}
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center px-4 py-8">
      {/* Skip */}
      {step < 4 && (
        <button type="button" className="self-end text-xs text-gray-400 font-medium mb-2 min-h-[48px] px-4" onClick={handleSkip}>
          {isTr ? 'Atla' : 'Skip'}
        </button>
      )}

      {/* Card */}
      <motion.div
        className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6"
        initial={{ scale: 0.94, opacity: 0, y: 24 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      >
        <ProgressDots />
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
