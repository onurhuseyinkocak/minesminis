/**
 * ChildHome — Simplified home screen for young learners (ages 3-6).
 * Mobile-first, light mode only, all Tailwind inline.
 */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import UnifiedMascot from '../components/UnifiedMascot';
import type { MascotState } from '../components/UnifiedMascot';
import ParentGate from '../components/ParentGate';
import { useGamification } from '../contexts/GamificationContext';
import { useHearts } from '../contexts/HeartsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import { SFX } from '../data/soundLibrary';
import { getSelectedMascotId } from '../services/mascotService';
import { isDailyLessonCompletedToday } from '../services/dailyLessonService';
import { getTodayXP, getDailyGoal } from '../services/psychGamification';

const MAX_STARS = 5;
const MAX_HEARTS = 5;

const ENCOURAGING_PHRASES: ReadonlyArray<{ tr: string; en: string }> = [
  { tr: 'Harika!', en: 'Amazing!' },
  { tr: 'Süpersin!', en: "You're super!" },
  { tr: 'Aferin sana!', en: 'Well done!' },
  { tr: 'Muhteşemsin!', en: "You're awesome!" },
  { tr: 'Bravo!', en: 'Bravo!' },
  { tr: 'Çok iyisin!', en: 'You did great!' },
  { tr: 'Devam et!', en: 'Keep going!' },
];

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="w-8 h-8" viewBox="0 0 36 36" aria-hidden="true">
      <polygon
        points="18,3 22.9,13.1 34,14.6 26,22.4 27.8,33.5 18,28.2 8.2,33.5 10,22.4 2,14.6 13.1,13.1"
        fill={filled ? '#FBBF24' : '#D1D5DB'}
        stroke={filled ? '#F59E0B' : 'transparent'}
        strokeWidth="1"
      />
    </svg>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="w-7 h-7" viewBox="0 0 28 28" aria-hidden="true">
      <path
        d="M14 24.5s-11-7-11-14a6 6 0 0 1 11-3.35A6 6 0 0 1 25 10.5c0 7-11 14-11 14z"
        fill={filled ? '#EF4444' : '#D1D5DB'}
      />
    </svg>
  );
}

function ProgressRing({ progress }: { progress: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="4" />
      <circle
        cx="22" cy="22" r={radius} fill="none" stroke="#22C55E" strokeWidth="4"
        strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

function GameIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2" y="8" width="24" height="14" rx="5" fill="rgba(255,255,255,0.25)" />
      <rect x="6" y="12" width="3" height="6" rx="1.5" fill="white" opacity="0.9" />
      <rect x="4" y="14" width="7" height="2" rx="1" fill="white" opacity="0.7" />
      <circle cx="20" cy="13.5" r="1.5" fill="white" opacity="0.9" />
      <circle cx="23" cy="16" r="1.5" fill="white" opacity="0.9" />
    </svg>
  );
}

function StoryIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="20" height="22" rx="3" fill="rgba(255,255,255,0.25)" />
      <rect x="8" y="9" width="12" height="2" rx="1" fill="white" opacity="0.9" />
      <rect x="8" y="13" width="10" height="2" rx="1" fill="white" opacity="0.8" />
      <rect x="8" y="17" width="8" height="2" rx="1" fill="white" opacity="0.7" />
    </svg>
  );
}

const ChildHome: React.FC = () => {
  const navigate = useNavigate();
  useGamification();
  const { hearts } = useHearts();
  const { lang } = useLanguage();
  usePageTitle('Öğrenmeye Başla', 'Start Learning');
  const { user, userProfile } = useAuth();

  const [mascotState, setMascotState] = useState<MascotState>('idle');
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleFading, setBubbleFading] = useState(false);
  const [bubblePhrase, setBubblePhrase] = useState('');
  const [showParentGate, setShowParentGate] = useState(false);
  const [mascotPop, setMascotPop] = useState(false);

  const bubbleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const popTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const mascotId = getSelectedMascotId();
  const displayName = userProfile?.display_name ?? (lang === 'tr' ? 'Kahraman' : 'Hero');
  const isDone = user ? isDailyLessonCompletedToday(user.uid ?? '') : false;

  const uid = user?.uid ?? '';
  const childTodayXP = uid ? getTodayXP(uid) : 0;
  const childDailyGoal = getDailyGoal();
  const xpProgress = childDailyGoal > 0 ? childTodayXP / childDailyGoal : 0;
  const todayStars = Math.min(MAX_STARS, isDone ? 5 : Math.floor(xpProgress * MAX_STARS));
  const heartsToShow = Math.min(MAX_HEARTS, Math.max(0, hearts));
  const lessonProgress = isDone ? 100 : Math.min(90, Math.round(xpProgress * 100));

  const handleMascotTap = useCallback(() => {
    if (popTimerRef.current) clearTimeout(popTimerRef.current);
    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    SFX.correct();
    setMascotState('celebrating');
    setMascotPop(true);
    const phrase = ENCOURAGING_PHRASES[Math.floor(Math.random() * ENCOURAGING_PHRASES.length)];
    setBubblePhrase(lang === 'tr' ? phrase.tr : phrase.en);
    setShowBubble(true);
    setBubbleFading(false);
    popTimerRef.current = setTimeout(() => { setMascotState('idle'); setMascotPop(false); }, 1200);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleFading(true);
      setTimeout(() => { setShowBubble(false); setBubbleFading(false); }, 400);
    }, 2000);
  }, [lang]);

  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  const handleLesson = useCallback(() => { SFX.click(); navigate('/daily-lesson'); }, [navigate]);
  const handleGame = useCallback(() => { SFX.click(); navigate('/games'); }, [navigate]);
  const handleStory = useCallback(() => { SFX.click(); navigate('/stories'); }, [navigate]);
  const handleParentClick = useCallback(() => setShowParentGate(true), []);
  const handleParentSuccess = useCallback(() => { setShowParentGate(false); navigate('/dashboard'); }, [navigate]);
  const handleParentCancel = useCallback(() => setShowParentGate(false), []);

  const lessonLabel = lang === 'tr' ? 'BUGÜNÜN DERSİ' : "TODAY'S LESSON";
  const lessonSub = isDone ? (lang === 'tr' ? 'Tamamlandı!' : 'Completed!') : (lang === 'tr' ? 'Hadi başlayalım!' : "Let's start!");
  const gameLabel = lang === 'tr' ? 'OYUN' : 'PLAY';
  const storyLabel = lang === 'tr' ? 'HİKAYE' : 'STORY';
  const parentLabel = lang === 'tr' ? 'Ebeveyn' : 'Parent';

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-sky-50 flex flex-col items-center px-4 pt-4 pb-8 relative" role="main">
        {/* Parent gate button */}
        <button
          type="button"
          onClick={handleParentClick}
          aria-label={parentLabel}
          className="absolute top-3 right-3 flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/70 text-xs font-semibold text-gray-500 border border-gray-200"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {parentLabel}
        </button>

        {/* Mascot */}
        <div
          className="relative mt-6 mb-2 cursor-pointer"
          onClick={handleMascotTap}
          role="button"
          tabIndex={0}
          aria-label={lang === 'tr' ? 'Maskota dokun' : 'Tap the mascot'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleMascotTap(); }}
        >
          {showBubble && (
            <div
              className={`absolute -top-10 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg text-sm font-bold text-gray-800 whitespace-nowrap transition-opacity duration-300 ${bubbleFading ? 'opacity-0' : 'opacity-100'}`}
              role="status"
              aria-live="polite"
            >
              {bubblePhrase}
            </div>
          )}
          <div className={`transition-transform duration-200 ${mascotPop ? 'scale-110' : 'scale-100'}`}>
            <UnifiedMascot id={mascotId} state={mascotState} size={160} />
          </div>
        </div>

        {/* Greeting */}
        <p className="text-xl font-bold text-gray-800 mb-4">
          {lang === 'tr' ? 'Merhaba, ' : 'Hello, '}
          <strong className="text-orange-500">{displayName}</strong>!
        </p>

        {/* Primary lesson button */}
        <button
          type="button"
          onClick={handleLesson}
          aria-label={`${lessonLabel} — ${lessonSub}`}
          className={`w-full max-w-xs min-h-[96px] rounded-3xl flex items-center gap-4 px-6 py-4 shadow-lg transition-transform active:scale-95 ${isDone ? 'bg-emerald-500' : 'bg-orange-500'} text-white mb-4`}
        >
          <ProgressRing progress={lessonProgress} />
          <div className="flex flex-col items-start">
            <span className="text-lg font-extrabold tracking-wide">{lessonLabel}</span>
            <span className="text-sm font-medium opacity-90">{lessonSub}</span>
          </div>
        </button>

        {/* Secondary buttons */}
        <div className="flex gap-3 w-full max-w-xs mb-6">
          <button
            type="button"
            onClick={handleGame}
            aria-label={gameLabel}
            className="flex-1 min-h-[80px] rounded-3xl bg-violet-500 text-white flex flex-col items-center justify-center gap-1 shadow-md transition-transform active:scale-95"
          >
            <GameIcon />
            <span className="text-sm font-extrabold tracking-wide">{gameLabel}</span>
          </button>
          <button
            type="button"
            onClick={handleStory}
            aria-label={storyLabel}
            className="flex-1 min-h-[80px] rounded-3xl bg-sky-500 text-white flex flex-col items-center justify-center gap-1 shadow-md transition-transform active:scale-95"
          >
            <StoryIcon />
            <span className="text-sm font-extrabold tracking-wide">{storyLabel}</span>
          </button>
        </div>

        {/* Stars */}
        <div className="flex gap-1 mb-2" role="img" aria-label={lang === 'tr' ? `Bugün ${todayStars} yıldız` : `${todayStars} stars today`}>
          {Array.from({ length: MAX_STARS }, (_, i) => <StarIcon key={i} filled={i < todayStars} />)}
        </div>

        {/* Hearts */}
        <div className="flex gap-1" role="img" aria-label={lang === 'tr' ? `${heartsToShow} can` : `${heartsToShow} hearts`}>
          {Array.from({ length: MAX_HEARTS }, (_, i) => <HeartIcon key={i} filled={i < heartsToShow} />)}
        </div>
      </div>

      {showParentGate && (
        <ParentGate
          onSuccess={handleParentSuccess}
          onCancel={handleParentCancel}
          reason={lang === 'tr' ? 'Tam panele geçmek için doğrulayın.' : 'Verify to access the full dashboard.'}
        />
      )}
    </>
  );
};

export default ChildHome;
