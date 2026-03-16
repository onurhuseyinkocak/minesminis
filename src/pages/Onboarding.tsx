import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Rocket, Check } from 'lucide-react';
import { Button } from '../components/ui';
import './Onboarding.css';

const AGE_GROUPS = [
  { value: 'toddler', range: '1-3', emoji: '🧒', label: 'Toddler', labelTr: 'Bebek' },
  { value: 'preschool', range: '4-6', emoji: '🧒', label: 'Preschool', labelTr: 'Okul Oncesi' },
  { value: 'early_primary', range: '7-8', emoji: '👧', label: 'Early Primary', labelTr: 'Ilk Okul' },
  { value: 'late_primary', range: '9-10', emoji: '👦', label: 'Late Primary', labelTr: 'Ilk Okul+' },
];

const AVATARS = [
  { emoji: '🦊', name: 'Fox' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🐰', name: 'Bunny' },
  { emoji: '🦄', name: 'Unicorn' },
  { emoji: '🐸', name: 'Frog' },
  { emoji: '🦋', name: 'Butterfly' },
  { emoji: '🐱', name: 'Cat' },
  { emoji: '🐶', name: 'Dog' },
  { emoji: '🐻', name: 'Bear' },
  { emoji: '🦉', name: 'Owl' },
  { emoji: '🐙', name: 'Octopus' },
];

const WORLD_TOPICS_EN = ['Greetings', 'Colors', 'Numbers', 'Animals', 'Family'];
const WORLD_TOPICS_TR = ['Selamlasmalar', 'Renkler', 'Sayilar', 'Hayvanlar', 'Aile'];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
};

const TOTAL_STEPS = 4;

const Onboarding: React.FC = () => {
  const { user, refreshUserProfile, setHasSkippedSetup } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [ageGroup, setAgeGroup] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lang: 'en' | 'tr' = 'en'; // Can be extended with language toggle

  const handleSkip = () => {
    setHasSkippedSetup(true);
    navigate('/games');
  };

  const nextStep = () => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  };

  const canProceed = () => {
    if (step === 1) return !!ageGroup;
    if (step === 2) return true; // Mimi intro, always can proceed
    if (step === 3) return !!selectedAvatar;
    return true;
  };

  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }

    setIsSubmitting(true);
    try {
      // Map age group to grade for backwards compatibility
      const gradeMap: Record<string, string> = {
        toddler: 'primary',
        preschool: 'primary',
        early_primary: 'grade2',
        late_primary: 'grade4',
      };

      await userService.createOrUpdateUserProfile(user, {
        role: 'student',
        displayName: user.displayName || 'Explorer',
        grade: gradeMap[ageGroup] || 'primary',
        avatar_emoji: selectedAvatar || '🦊',
        mascotId: 'mimi_dragon',
      });

      const { createPet } = await import('../services/petService');
      await createPet(user.uid, 'mimi_dragon', user.displayName || 'Explorer');

      await refreshUserProfile();
      toast.success(lang === 'en' ? 'Welcome to MinesMinis!' : "MinesMinis'e hosgeldin!");
      navigate('/dashboard');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Please try again.';
      toast.error(`Oops! ${msg}`, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="onboarding-page">
      <motion.div
        className="onboarding-card"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Progress Bar */}
        <div className="onboarding-progress">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => {
            const s = i + 1;
            const isActive = step === s;
            const isCompleted = step > s;
            return (
              <div className="onboarding-progress-step" key={s}>
                {i > 0 && (
                  <div className={`onboarding-progress-line ${isCompleted || isActive ? 'active' : ''}`} />
                )}
                <motion.div
                  className={`onboarding-progress-dot ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                  animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  {isCompleted ? <Check size={16} /> : s}
                </motion.div>
              </div>
            );
          })}
        </div>

        <AnimatePresence mode="wait" custom={direction}>
          {/* Step 1: Age Group */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="onboarding-step"
            >
              <div className="onboarding-step-emoji">🎂</div>
              <h2>{lang === 'en' ? 'How old are you?' : 'Kac yasindasin?'}</h2>
              <p className="onboarding-step-sub">
                {lang === 'en'
                  ? 'This helps us pick the perfect content for you!'
                  : 'Bu, senin icin en uygun icerikleri secmemize yardimci olur!'}
              </p>

              <div className="onboarding-age-grid">
                {AGE_GROUPS.map((ag) => (
                  <motion.button
                    key={ag.value}
                    type="button"
                    className={`onboarding-age-card ${ageGroup === ag.value ? 'selected' : ''}`}
                    onClick={() => setAgeGroup(ag.value)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="onboarding-age-emoji">{ag.emoji}</span>
                    <span className="onboarding-age-range">{ag.range}</span>
                    <span className="onboarding-age-label">
                      {lang === 'en' ? ag.label : ag.labelTr}
                    </span>
                  </motion.button>
                ))}
              </div>

              <div className="onboarding-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  icon={<ArrowRight size={18} />}
                >
                  {lang === 'en' ? 'Continue' : 'Devam Et'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Meet Mimi */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="onboarding-step"
            >
              <h2>{lang === 'en' ? 'Meet Mimi!' : 'Mimi ile Tanis!'}</h2>
              <p className="onboarding-step-sub">
                {lang === 'en'
                  ? 'Your friendly dragon guide on this learning adventure'
                  : 'Ogrenme macerandaki sevimli ejderha rehberin'}
              </p>

              <div className="onboarding-mimi-intro">
                <motion.div
                  className="onboarding-mimi-large"
                  animate={{ y: [0, -10, 0], rotate: [0, 2, -2, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                >
                  🐉
                </motion.div>

                <div className="onboarding-mimi-speech">
                  {lang === 'en'
                    ? "Hi there! I'm Mimi, your dragon friend! I'll help you learn English through fun games, exciting stories, and magical adventures. Ready to explore?"
                    : "Merhaba! Ben Mimi, ejderha arkadasin! Eglenceli oyunlar, heyecan verici hikayeler ve sihirli maceralarla Ingilizce ogrenmene yardim edecegim. Kesfetmeye hazir misin?"}
                  <div className="onboarding-mimi-facts">
                    <span className="onboarding-mimi-fact">🔥 {lang === 'en' ? 'Dragon Fire' : 'Ejderha Atesi'}</span>
                    <span className="onboarding-mimi-fact">⭐ {lang === 'en' ? '+20% Stars' : '+20% Yildiz'}</span>
                    <span className="onboarding-mimi-fact">💚 {lang === 'en' ? 'Always Friendly' : 'Her Zaman Sevimli'}</span>
                  </div>
                </div>
              </div>

              <div className="onboarding-actions">
                <Button variant="ghost" size="lg" onClick={prevStep} icon={<ArrowLeft size={18} />}>
                  {lang === 'en' ? 'Back' : 'Geri'}
                </Button>
                <Button variant="primary" size="lg" onClick={nextStep} icon={<ArrowRight size={18} />}>
                  {lang === 'en' ? "Let's Go!" : 'Haydi!'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Avatar Picker */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="onboarding-step"
            >
              <div className="onboarding-step-emoji">🎨</div>
              <h2>{lang === 'en' ? 'Choose Your Avatar' : 'Avatarini Sec'}</h2>
              <p className="onboarding-step-sub">
                {lang === 'en'
                  ? 'Pick a fun animal friend to represent you!'
                  : 'Seni temsil edecek eglenceli bir hayvan arkadas sec!'}
              </p>

              <div className="onboarding-avatar-grid">
                {AVATARS.map((a) => (
                  <motion.button
                    key={a.emoji}
                    type="button"
                    className={`onboarding-avatar-btn ${selectedAvatar === a.emoji ? 'selected' : ''}`}
                    onClick={() => setSelectedAvatar(a.emoji)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                  >
                    <span className="avatar-emoji">{a.emoji}</span>
                    <span className="avatar-name">{a.name}</span>
                  </motion.button>
                ))}
              </div>

              <div className="onboarding-actions">
                <Button variant="ghost" size="lg" onClick={prevStep} icon={<ArrowLeft size={18} />}>
                  {lang === 'en' ? 'Back' : 'Geri'}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  icon={<ArrowRight size={18} />}
                >
                  {lang === 'en' ? 'Continue' : 'Devam Et'}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Your First World Awaits */}
          {step === 4 && (
            <motion.div
              key="step4"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="onboarding-step"
            >
              <h2>{lang === 'en' ? 'Your First World Awaits!' : 'Ilk Dunyan Seni Bekliyor!'}</h2>
              <p className="onboarding-step-sub">
                {lang === 'en'
                  ? "Here's a sneak peek of what you'll explore first"
                  : 'Ilk kesfedeceklerinin bir onizlemesi'}
              </p>

              {/* User summary */}
              {selectedAvatar && (
                <div className="onboarding-user-summary">
                  <span className="onboarding-user-summary-emoji">{selectedAvatar}</span>
                  <div className="onboarding-user-summary-info">
                    <p className="onboarding-user-summary-name">
                      {user?.displayName || (lang === 'en' ? 'Explorer' : 'Kasif')}
                    </p>
                    <p className="onboarding-user-summary-detail">
                      🐉 Mimi &middot; {AGE_GROUPS.find(g => g.value === ageGroup)?.range || ''} {lang === 'en' ? 'years' : 'yas'}
                    </p>
                  </div>
                </div>
              )}

              {/* World 1 Preview */}
              <div className="onboarding-world-preview">
                <div className="onboarding-world-card">
                  <div className="onboarding-world-visual">
                    <motion.span
                      className="onboarding-world-emoji"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    >
                      🌍
                    </motion.span>
                    <span className="onboarding-world-badge">World 1</span>
                  </div>
                  <div className="onboarding-world-info">
                    <h3 className="onboarding-world-name">
                      {lang === 'en' ? 'Hello World' : 'Merhaba Dunya'}
                    </h3>
                    <p className="onboarding-world-desc">
                      {lang === 'en'
                        ? 'Start your English adventure with basic greetings, colors, numbers, and everyday words. Mimi will guide you every step of the way!'
                        : 'Temel selamlasmalar, renkler, sayilar ve gunluk kelimelerle Ingilizce macerana basla. Mimi her adimda sana rehberlik edecek!'}
                    </p>
                    <div className="onboarding-world-topics">
                      {(lang === 'en' ? WORLD_TOPICS_EN : WORLD_TOPICS_TR).map((topic) => (
                        <span key={topic} className="onboarding-world-topic">{topic}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="onboarding-actions">
                <Button variant="ghost" size="lg" onClick={prevStep} icon={<ArrowLeft size={18} />}>
                  {lang === 'en' ? 'Back' : 'Geri'}
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleSubmit}
                  loading={isSubmitting}
                  icon={<Rocket size={18} />}
                >
                  {isSubmitting
                    ? (lang === 'en' ? 'Preparing...' : 'Hazirlaniyor...')
                    : (lang === 'en' ? "Let's Start!" : 'Haydi Baslayalim!')}
                </Button>
              </div>

              <div className="onboarding-skip">
                <button type="button" onClick={handleSkip}>
                  {lang === 'en' ? 'Skip for now' : 'Simdilik atla'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
