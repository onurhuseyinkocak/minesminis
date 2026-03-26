/**
 * Onboarding — MinesMinis
 * Student-only flow: Welcome → Age group → Placement test → Learning path
 */
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import { LS_PLACEMENT_RESULT } from '../config/storageKeys';
import {
  ArrowLeft, ArrowRight, Rocket, Check, CheckCircle,
  Baby, BookOpen, Globe, Volume2, Lock as LockIcon, Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui';
import './Onboarding.css';

// ── Types ─────────────────────────────────────────────────────────────────────

// ── Constants ─────────────────────────────────────────────────────────────────

const STUDENT_AGE_GROUPS: {
  value: string; label: string; labelTr: string;
  phase: string; phaseTr: string; emoji: string;
  desc: string; descTr: string;
}[] = [
  {
    value: '3-5', label: 'Ages 3–5', labelTr: '3–5 Yaş',
    phase: 'Little Ears', phaseTr: 'Küçük Kulaklar',
    emoji: '🌱',
    desc: 'First sounds & letters', descTr: 'İlk sesler ve harfler',
  },
  {
    value: '5-7', label: 'Ages 5–7', labelTr: '5–7 Yaş',
    phase: 'Word Builders', phaseTr: 'Kelime Ustaları',
    emoji: '📖',
    desc: 'Reading first words', descTr: 'İlk kelimeleri okuma',
  },
  {
    value: '7-9', label: 'Ages 7–9', labelTr: '7–9 Yaş',
    phase: 'Story Makers', phaseTr: 'Hikaye Yazarları',
    emoji: '✍️',
    desc: 'Fluency & stories', descTr: 'Akıcılık ve hikayeler',
  },
  {
    value: '9-10', label: 'Ages 9–10', labelTr: '9–10 Yaş',
    phase: 'Young Explorers', phaseTr: 'Genç Kaşifler',
    emoji: '🚀',
    desc: 'Advanced phonics', descTr: 'İleri fonetik',
  },
];

const PLACEMENT_QUESTIONS = [
  {
    id: 1,
    title: 'What sound does "Ball" start with?',
    titleTr: '"Ball" hangi sesle başlar?',
    options: [
      { label: 'B', value: 'correct' },
      { label: 'D', value: 'wrong1' },
      { label: 'P', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 2,
    title: 'The letter "S" makes which sound?',
    titleTr: '"S" harfi hangi sesi çıkarır?',
    options: [
      { label: '"sss" — like a snake', value: 'correct' },
      { label: '"mmm" — humming', value: 'wrong1' },
      { label: '"zzz" — like a bee', value: 'wrong2' },
    ],
    correct: 'correct',
  },
  {
    id: 3,
    title: 's – a – t = ?',
    titleTr: 's – a – t = ?',
    options: [
      { label: 'sat', value: 'correct' },
      { label: 'set', value: 'wrong1' },
      { label: 'sit', value: 'wrong2' },
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

function computePhonicsGroup(score: number, ageGroup: string): number {
  if (score <= 1) return 1;
  if (score === 2) return ageGroup === '3-5' ? 1 : 2;
  if (score === 3) return ageGroup === '9-10' ? 4 : 3;
  const ageMap: Record<string, number> = { '3-5': 3, '5-7': 4, '7-9': 5, '9-10': 6 };
  return ageMap[ageGroup] ?? 3;
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
  const { user, refreshUserProfile } = useAuth();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';
  const navigate = useNavigate();

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

  const goNext = useCallback(() => { setDir(1); setStep(s => Math.min(s + 1, TOTAL_STEPS)); }, []);
  const goPrev = useCallback(() => { setDir(-1); setStep(s => Math.max(s - 1, 1)); }, []);

  const canProceed = (): boolean => {
    if (step === 1) return nickname.trim().length >= 2;
    if (step === 2) return !!ageGroup;
    if (step === 3) return placementDone;
    return true;
  };

  const handleAnswer = (questionId: number, value: string) => {
    const updated = { ...answers, [questionId]: value };
    setAnswers(updated);
    if (questionIdx < PLACEMENT_QUESTIONS.length - 1) {
      setTimeout(() => setQuestionIdx(i => i + 1), 350);
    } else {
      const score = PLACEMENT_QUESTIONS.filter(q => updated[q.id] === q.correct).length;
      const group = computePhonicsGroup(score, ageGroup);
      setStartingGroup(group);
      setTimeout(() => setPlacementDone(true), 350);
    }
  };

  const handleFinish = async () => {
    if (!user) { navigate('/login'); return; }
    setIsSubmitting(true);
    try {
      const gradeMap: Record<string, string> = {
        '3-5': 'primary', '5-7': 'primary', '7-9': 'grade2', '9-10': 'grade4',
      };
      const uid = user.uid ?? (user as unknown as { id?: string }).id;
      const placementScore = PLACEMENT_QUESTIONS.filter(q => answers[q.id] === q.correct).length;

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

      const { createPet } = await import('../services/petService');
      await createPet(user.uid, 'mimi_cat', nickname.trim() || user.displayName || 'Explorer');

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

  // ── Step 1: Welcome ───────────────────────────────────────────────────────

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
      {/* Hero mascot */}
      <div className="onboarding-mascot-wrap">
        <div className="onboarding-mascot-ring">
          <span className="onboarding-mascot-emoji">🐉</span>
        </div>
        <div className="onboarding-mascot-sparkles">
          {[...Array(5)].map((_, i) => (
            <motion.span
              key={i}
              className="onboarding-sparkle"
              style={{ '--i': i } as React.CSSProperties}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.4 }}
            >
              <Sparkles size={10} />
            </motion.span>
          ))}
        </div>
      </div>

      <h2 className="onboarding-welcome-title">
        {isTr ? 'MinesMinis\'e Hoş Geldin!' : 'Welcome to MinesMinis!'}
      </h2>
      <p className="onboarding-step-sub">
        {isTr
          ? 'Ben Mimi! Seninle İngilizce öğreneceğim. Sana nasıl hitap edeyim?'
          : "I'm Mimi! I'll be learning English with you. What should I call you?"
        }
      </p>

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="onboarding-name-check"
          >
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
          {isTr ? `Merhaba, ${nickname}!` : `Hello, ${nickname}!`}
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
            <span className="onboarding-age-emoji">{ag.emoji}</span>
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
        <Button variant="primary" size="lg" onClick={goNext} disabled={!canProceed()} icon={<ArrowRight size={18} />}>
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
          <h2>{isTr ? 'Harika!' : 'Great job!'}</h2>
          <p className="onboarding-step-sub">
            {isTr
              ? <><strong>{group.name}</strong>'den başlamanı öneriyoruz</>
              : <>We recommend starting at <strong>{group.name}</strong></>
            }
          </p>
          <div className="onboarding-phonics-result-card">
            <span className="onboarding-phonics-result-name">{group.name}</span>
            <span className="onboarding-phonics-result-sounds">{group.sounds}</span>
            <span className="onboarding-phonics-result-desc">{group.desc}</span>
          </div>
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

    const q = PLACEMENT_QUESTIONS[questionIdx];
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
          {isTr ? 'Hızlı Test' : 'Quick Check'} · {questionIdx + 1}/{PLACEMENT_QUESTIONS.length}
        </p>
        <h2 className="onboarding-placement-question">
          {isTr ? q.titleTr : q.title}
        </h2>

        <div className="onboarding-placement-dots">
          {PLACEMENT_QUESTIONS.map((_, i) => (
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
            {i > 0 && <div className={`onboarding-progress-line ${done || active ? 'active' : ''}`} />}
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
