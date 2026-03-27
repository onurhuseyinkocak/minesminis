/**
 * ChildHome — Radically simplified home screen for young learners (ages 3-6).
 *
 * Activated when: userProfile.settings.ageGroup === '3-5'
 *              OR localStorage 'mm_child_mode' === 'true'
 *
 * Rules:
 *  - MAX 3 tappable areas on screen at once (lesson, game, story)
 *  - All text ≥ 20px, all touch targets ≥ 80px tall
 *  - No nav bar — child cannot accidentally navigate away
 *  - Small "Parent" corner button → ParentGate → Dashboard
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
import './ChildHome.css';

// ─── Constants ───────────────────────────────────────────────────────────────

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

// ─── Star SVG (no emoji — policy) ────────────────────────────────────────────

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`child-home__star ${filled ? 'child-home__star--earned' : 'child-home__star--empty'}`}
      viewBox="0 0 36 36"
      aria-hidden="true"
    >
      <polygon
        points="18,3 22.9,13.1 34,14.6 26,22.4 27.8,33.5 18,28.2 8.2,33.5 10,22.4 2,14.6 13.1,13.1"
        fill={filled ? 'var(--warning)' : 'var(--text-muted)'}
        stroke={filled ? 'var(--warning-light)' : 'transparent'}
        strokeWidth="1"
      />
    </svg>
  );
}

// ─── Heart icon (no emoji — policy) ──────────────────────────────────────────

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className={`child-home__heart ${filled ? 'child-home__heart--full' : 'child-home__heart--empty'}`}
      viewBox="0 0 28 28"
      aria-hidden="true"
      width="28"
      height="28"
    >
      <path
        d="M14 24.5s-11-7-11-14a6 6 0 0 1 11-3.35A6 6 0 0 1 25 10.5c0 7-11 14-11 14z"
        fill={filled ? 'var(--error)' : 'var(--text-muted)'}
      />
    </svg>
  );
}

// ─── Progress ring ────────────────────────────────────────────────────────────

function ProgressRing({ progress }: { progress: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="child-home__progress-ring" aria-hidden="true">
      <svg className="child-home__ring-svg" width="44" height="44" viewBox="0 0 44 44">
        <circle className="child-home__ring-bg" cx="22" cy="22" r={radius} />
        <circle
          className="child-home__ring-fill"
          cx="22"
          cy="22"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}

// ─── Game icon SVG ────────────────────────────────────────────────────────────

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

// ─── Story icon SVG ───────────────────────────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

const ChildHome: React.FC = () => {
  const navigate = useNavigate();
  useGamification(); // keep context subscription alive for child mode
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

  // Today's stars: based on today's XP progress toward daily goal.
  // Each 20% of daily goal earns 1 star. Completing lesson = all 5.
  const uid = user?.uid ?? '';
  const childTodayXP = uid ? getTodayXP(uid) : 0;
  const childDailyGoal = getDailyGoal();
  const xpProgress = childDailyGoal > 0 ? childTodayXP / childDailyGoal : 0;
  const todayStars = Math.min(MAX_STARS, isDone ? 5 : Math.floor(xpProgress * MAX_STARS));
  const heartsToShow = Math.min(MAX_HEARTS, Math.max(0, hearts));

  // Lesson progress: maps XP progress to a percentage ring indicator
  const lessonProgress = isDone ? 100 : Math.min(90, Math.round(xpProgress * 100));

  // ── Mascot tap ─────────────────────────────────────────────────────────────

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

    popTimerRef.current = setTimeout(() => {
      setMascotState('idle');
      setMascotPop(false);
    }, 1200);

    bubbleTimerRef.current = setTimeout(() => {
      setBubbleFading(true);
      setTimeout(() => {
        setShowBubble(false);
        setBubbleFading(false);
      }, 400);
    }, 2000);
  }, [lang]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
      if (popTimerRef.current) clearTimeout(popTimerRef.current);
    };
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const handleLesson = useCallback(() => {
    SFX.click();
    navigate('/daily-lesson');
  }, [navigate]);

  const handleGame = useCallback(() => {
    SFX.click();
    navigate('/games');
  }, [navigate]);

  const handleStory = useCallback(() => {
    SFX.click();
    navigate('/stories');
  }, [navigate]);

  const handleParentClick = useCallback(() => {
    setShowParentGate(true);
  }, []);

  const handleParentSuccess = useCallback(() => {
    setShowParentGate(false);
    navigate('/dashboard');
  }, [navigate]);

  const handleParentCancel = useCallback(() => {
    setShowParentGate(false);
  }, []);

  const lessonLabel = lang === 'tr' ? 'BUGÜNÜN DERSİ' : "TODAY'S LESSON";
  const lessonSub = isDone
    ? lang === 'tr' ? 'Tamamlandı!' : 'Completed!'
    : lang === 'tr' ? 'Hadi başlayalım!' : "Let's start!";
  const gameLabel = lang === 'tr' ? 'OYUN' : 'PLAY';
  const storyLabel = lang === 'tr' ? 'HİKAYE' : 'STORY';
  const parentLabel = lang === 'tr' ? 'Ebeveyn' : 'Parent';

  return (
    <>
      <div className="child-home" role="main">

        {/* Parent gate button — small, corner */}
        <button
          type="button"
          className="child-home__parent-btn"
          onClick={handleParentClick}
          aria-label={parentLabel}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          {parentLabel}
        </button>

        {/* Mascot with speech bubble */}
        <div
          className="child-home__mascot-wrap"
          onClick={handleMascotTap}
          role="button"
          tabIndex={0}
          aria-label={lang === 'tr' ? 'Maskota dokun' : 'Tap the mascot'}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleMascotTap(); }}
        >
          {showBubble && (
            <div
              className={`child-home__bubble${bubbleFading ? ' child-home__bubble--fading' : ''}`}
              role="status"
              aria-live="polite"
            >
              {bubblePhrase}
            </div>
          )}
          <div className={`child-home__mascot-inner${mascotPop ? ' child-home__mascot-inner--pop' : ''}`}>
            <UnifiedMascot
              id={mascotId}
              state={mascotState}
              size={160}
            />
          </div>
        </div>

        {/* Greeting */}
        <p className="child-home__greeting">
          {lang === 'tr' ? 'Merhaba, ' : 'Hello, '}
          <strong>{displayName}</strong>!
        </p>

        {/* Primary lesson button */}
        <button
          type="button"
          className={`child-home__lesson-btn${isDone ? ' child-home__lesson-btn--done' : ''}`}
          onClick={handleLesson}
          aria-label={`${lessonLabel} — ${lessonSub}`}
        >
          <ProgressRing progress={lessonProgress} />
          <span className="child-home__lesson-label">{lessonLabel}</span>
          <span className="child-home__lesson-sub">{lessonSub}</span>
        </button>

        {/* Secondary buttons */}
        <div className="child-home__secondary-row">
          <button
            type="button"
            className="child-home__secondary-btn child-home__secondary-btn--game"
            onClick={handleGame}
            aria-label={gameLabel}
          >
            <span className="child-home__secondary-btn-icon" aria-hidden="true">
              <GameIcon />
            </span>
            {gameLabel}
          </button>

          <button
            type="button"
            className="child-home__secondary-btn child-home__secondary-btn--story"
            onClick={handleStory}
            aria-label={storyLabel}
          >
            <span className="child-home__secondary-btn-icon" aria-hidden="true">
              <StoryIcon />
            </span>
            {storyLabel}
          </button>
        </div>

        {/* Stars strip — today's progress */}
        <div
          className="child-home__stars"
          role="img"
          aria-label={
            lang === 'tr'
              ? `Bugün ${todayStars} yıldız`
              : `${todayStars} stars today`
          }
        >
          {Array.from({ length: MAX_STARS }, (_, i) => (
            <StarIcon key={i} filled={i < todayStars} />
          ))}
        </div>

        {/* Hearts strip */}
        <div
          className="child-home__hearts"
          role="img"
          aria-label={
            lang === 'tr'
              ? `${heartsToShow} can`
              : `${heartsToShow} hearts`
          }
        >
          {Array.from({ length: MAX_HEARTS }, (_, i) => (
            <HeartIcon key={i} filled={i < heartsToShow} />
          ))}
        </div>

      </div>

      {/* Parent gate modal */}
      {showParentGate && (
        <ParentGate
          onSuccess={handleParentSuccess}
          onCancel={handleParentCancel}
          reason={
            lang === 'tr'
              ? 'Tam panele geçmek için doğrulayın.'
              : 'Verify to access the full dashboard.'
          }
        />
      )}
    </>
  );
};

export default ChildHome;
