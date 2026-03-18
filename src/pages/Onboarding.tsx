import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { userService } from '../services/userService';
import { createClassroom } from '../services/classroomService';
import toast from 'react-hot-toast';
import { LS_PLACEMENT_RESULT } from '../config/storageKeys';
import {
  ArrowLeft, ArrowRight, Rocket, Check, Plus, Trash2,
  GraduationCap, Users, Heart,
  Baby, User, BookOpen, Globe,
  Volume2, Lock as LockIcon, CheckCircle, MapPin, Settings, UserPlus,
} from 'lucide-react';
import { Button } from '../components/ui';
import MimiMascot from '../components/MimiMascot';
import './Onboarding.css';

// ── Types ──────────────────────────────────────────────────────────────────────
type UserRole = 'student' | 'teacher' | 'parent';

interface ChildEntry {
  name: string;
  age: string;
  avatar: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const ROLE_CARDS: { value: UserRole; icon: React.ReactNode; title: string; subtitle: string; detail: string; color: string }[] = [
  { value: 'student', icon: <GraduationCap size={28} />, title: 'Student', subtitle: "I'm learning English", detail: 'Ages 3-10', color: 'var(--primary)' },
  { value: 'teacher', icon: <Users size={28} />, title: 'Teacher', subtitle: 'I teach English', detail: 'Classroom tools', color: 'var(--secondary, var(--primary))' },
  { value: 'parent', icon: <Heart size={28} />, title: 'Parent', subtitle: 'My child is learning', detail: 'Track progress', color: 'var(--accent, var(--primary))' },
];

const STUDENT_AGE_GROUPS: { value: string; label: string; phase: string; icon: React.ReactNode; color: string }[] = [
  { value: '3-5', label: 'Ages 3-5', phase: 'Little Ears', icon: <Baby size={24} />, color: 'var(--primary)' },
  { value: '5-7', label: 'Ages 5-7', phase: 'Word Builders', icon: <User size={24} />, color: 'var(--primary)' },
  { value: '7-9', label: 'Ages 7-9', phase: 'Story Makers', icon: <BookOpen size={24} />, color: 'var(--primary)' },
  { value: '9-10', label: 'Ages 9-10', phase: 'Young Explorers', icon: <Globe size={24} />, color: 'var(--primary)' },
];

const PLACEMENT_QUESTIONS = [
  {
    id: 1,
    title: 'Can you hear the first sound?',
    instruction: 'What sound does "Ball" start with?',
    options: [
      { label: 'B', value: 'correct' },
      { label: 'D', value: 'wrong1' },
      { label: 'P', value: 'wrong2' },
    ],
    correct: 'correct',
    skill: 'phoneme_awareness',
  },
  {
    id: 2,
    title: 'What does this letter say?',
    instruction: 'The letter "S" makes the sound...',
    options: [
      { label: '"sss" like a snake', value: 'correct' },
      { label: '"mmm" like humming', value: 'wrong1' },
      { label: '"zzz" like a bee', value: 'wrong2' },
    ],
    correct: 'correct',
    skill: 'letter_sound',
  },
  {
    id: 3,
    title: 'Blend these sounds!',
    instruction: 's - a - t  =  ?',
    options: [
      { label: 'sat', value: 'correct' },
      { label: 'set', value: 'wrong1' },
      { label: 'sit', value: 'wrong2' },
    ],
    correct: 'correct',
    skill: 'blending',
  },
  {
    id: 4,
    title: 'Read this word',
    instruction: 'What does "cat" mean?',
    options: [
      { label: 'A small furry animal', value: 'correct' },
      { label: 'A loyal pet that barks', value: 'wrong1' },
      { label: 'A creature that flies', value: 'wrong2' },
    ],
    correct: 'correct',
    skill: 'decoding',
  },
  {
    id: 5,
    title: 'Read this sentence',
    instruction: '"The sun is hot." -- Is this TRUE or FALSE?',
    options: [
      { label: 'True', value: 'correct' },
      { label: 'False', value: 'wrong1' },
    ],
    correct: 'correct',
    skill: 'comprehension',
  },
];

const PHONICS_GROUPS = [
  { id: 1, name: 'Group 1', sounds: 's, a, t, p', description: 'First letter sounds and simple CVC words' },
  { id: 2, name: 'Group 2', sounds: 'i, n, m, d', description: 'More consonants and short vowel words' },
  { id: 3, name: 'Group 3', sounds: 'g, o, c, k', description: 'Hard sounds and word families' },
  { id: 4, name: 'Group 4', sounds: 'e, u, r, b', description: 'All short vowels and blends' },
  { id: 5, name: 'Group 5', sounds: 'h, f, l, ss', description: 'Consonant digraphs and doubles' },
  { id: 6, name: 'Group 6', sounds: 'j, v, w, x', description: 'Less common consonants' },
  { id: 7, name: 'Group 7', sounds: 'y, z, qu, ch', description: 'Advanced digraphs and trigraphs' },
];

const GRADE_LEVELS = ['Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade'];
const STUDENT_RANGES = ['1-10', '11-25', '26-40', '40+'];

const CHILD_AVATAR_COLORS = [
  'var(--primary)', 'var(--secondary, #14b8a6)', 'var(--accent, #f59e0b)',
  'var(--error, #ef4444)', 'var(--info, #3b82f6)', 'var(--warning, #8b5cf6)',
];

const CHILD_AVATAR_INITIALS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M'];

// ── Helpers ────────────────────────────────────────────────────────────────────

function computePhonicsGroup(score: number, ageGroup: string): number {
  if (score <= 1) return 1;
  if (score === 2) return ageGroup === '3-5' ? 1 : 2;
  if (score === 3) return ageGroup === '9-10' ? 4 : 3;
  if (score === 4) return ageGroup === '9-10' ? 5 : 4;
  const ageMap: Record<string, number> = { '3-5': 3, '5-7': 4, '7-9': 5, '9-10': 6 };
  return ageMap[ageGroup] ?? 5;
}

function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

function recommendedPhonicsGroup(gradeLevels: string[]): number {
  if (gradeLevels.includes('Pre-K') || gradeLevels.includes('Kindergarten')) return 1;
  if (gradeLevels.includes('1st Grade')) return 3;
  if (gradeLevels.includes('2nd Grade')) return 4;
  if (gradeLevels.includes('3rd Grade')) return 5;
  if (gradeLevels.includes('4th Grade')) return 6;
  return 1;
}

// ── Slide animation variants ───────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 280 : -280, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -280 : 280, opacity: 0 }),
};

// ── Component ──────────────────────────────────────────────────────────────────

const Onboarding: React.FC = () => {
  const { user, refreshUserProfile, setHasSkippedSetup } = useAuth();
  const navigate = useNavigate();

  // Shared state
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [role, setRole] = useState<UserRole | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Student state
  const [ageGroup, setAgeGroup] = useState('');
  const [placementAnswers, setPlacementAnswers] = useState<Record<number, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [placementDone, setPlacementDone] = useState(false);
  const [startingPhonicsGroup, setStartingPhonicsGroup] = useState(1);

  // Teacher state
  const [schoolName, setSchoolName] = useState('');
  const [teacherGrades, setTeacherGrades] = useState<string[]>([]);
  const [studentCount, setStudentCount] = useState('');
  const [classroomName, setClassroomName] = useState('');
  const [classroomGrade, setClassroomGrade] = useState('');
  const [joinCode] = useState(() => generateJoinCode());
  const [selectedPhonicsGroup, setSelectedPhonicsGroup] = useState(1);

  // Parent state
  const [children, setChildren] = useState<ChildEntry[]>([{ name: '', age: '', avatar: 'A' }]);
  const [dailyTimeLimit, setDailyTimeLimit] = useState(30);
  const [weeklyEmails, setWeeklyEmails] = useState(true);

  // ── Step calculations ──────────────────────────────────────────────────────
  const totalSteps = role === 'student' ? 5 : role === 'teacher' ? 4 : role === 'parent' ? 3 : 1;

  const handleSkip = () => {
    setHasSkippedSetup(true);
    navigate('/games');
  };

  const nextStep = useCallback(() => {
    setDirection(1);
    setStep((s) => Math.min(s + 1, totalSteps));
  }, [totalSteps]);

  const prevStep = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  // ── Placement test logic ───────────────────────────────────────────────────
  const handlePlacementAnswer = (questionId: number, answer: string) => {
    const updated = { ...placementAnswers, [questionId]: answer };
    setPlacementAnswers(updated);

    if (currentQuestion < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQuestion((c) => c + 1);
    } else {
      let score = 0;
      PLACEMENT_QUESTIONS.forEach((q) => {
        if (updated[q.id] === q.correct) score++;
      });
      const group = computePhonicsGroup(score, ageGroup);
      setStartingPhonicsGroup(group);
      setPlacementDone(true);
    }
  };

  // ── Teacher grade toggle ───────────────────────────────────────────────────
  const toggleGrade = (grade: string) => {
    setTeacherGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    );
  };

  // ── Parent child management ────────────────────────────────────────────────
  const updateChild = (index: number, field: keyof ChildEntry, value: string) => {
    setChildren((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  };

  const addChild = () => {
    if (children.length < 4) {
      setChildren((prev) => [...prev, { name: '', age: '', avatar: 'A' }]);
    }
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // ── Can proceed check ─────────────────────────────────────────────────────
  const canProceed = (): boolean => {
    if (step === 1) return !!role;

    if (role === 'student') {
      if (step === 2) return !!ageGroup;
      if (step === 3) return placementDone;
      if (step === 4) return true;
      if (step === 5) return true;
    }

    if (role === 'teacher') {
      if (step === 2) return teacherGrades.length > 0 && !!studentCount;
      if (step === 3) return !!classroomName && !!classroomGrade;
      if (step === 4) return true;
    }

    if (role === 'parent') {
      if (step === 2) return children.every((c) => c.name.trim() !== '' && c.age !== '');
      if (step === 3) return true;
    }

    return true;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }

    setIsSubmitting(true);
    try {
      if (role === 'student') {
        const gradeMap: Record<string, string> = {
          '3-5': 'primary',
          '5-7': 'primary',
          '7-9': 'grade2',
          '9-10': 'grade4',
        };
        await userService.createOrUpdateUserProfile(user, {
          role: 'student',
          displayName: user.displayName || 'Explorer',
          grade: gradeMap[ageGroup] || 'primary',
          avatar_emoji: 'A',
          mascotId: 'mimi_dragon',
        });

        const userId = user.uid ?? (user as unknown as { id?: string }).id;
        if (userId) {
          await userService.updateUserProfile(userId, {
            settings: {
              setup_completed: true,
              setup_date: new Date().toISOString(),
              avatar_emoji: 'A',
              mascotId: 'mimi_dragon',
              startingPhonicsGroup,
              ageGroup,
              placementScore: Object.values(placementAnswers).filter(
                (a, i) => a === PLACEMENT_QUESTIONS[i]?.correct
              ).length,
            },
          });
        }

        localStorage.setItem(LS_PLACEMENT_RESULT, String(startingPhonicsGroup));

        const { createPet } = await import('../services/petService');
        await createPet(user.uid, 'mimi_dragon', user.displayName || 'Explorer');
      }

      if (role === 'teacher') {
        await userService.createOrUpdateUserProfile(user, {
          role: 'teacher',
          displayName: user.displayName || 'Teacher',
          grade: teacherGrades.join(', '),
        });

        const userId = user.uid ?? (user as unknown as { id?: string }).id;
        if (userId) {
          await userService.updateUserProfile(userId, {
            settings: {
              setup_completed: true,
              setup_date: new Date().toISOString(),
              schoolName,
              teacherGrades,
              studentCount,
              classroomName,
              classroomGrade,
              joinCode,
              selectedPhonicsGroup,
            },
          });
        }

        if (classroomName && classroomGrade) {
          const teacherUid = user.uid ?? (user as unknown as { id?: string }).id;
          if (teacherUid) {
            createClassroom(teacherUid, classroomName, classroomGrade);
          }
        }
      }

      if (role === 'parent') {
        await userService.createOrUpdateUserProfile(user, {
          role: 'parent',
          displayName: user.displayName || 'Parent',
        });

        const userId = user.uid ?? (user as unknown as { id?: string }).id;
        if (userId) {
          await userService.updateUserProfile(userId, {
            settings: {
              setup_completed: true,
              setup_date: new Date().toISOString(),
              children,
              dailyTimeLimit,
              weeklyEmails,
            },
          });
        }
      }

      await refreshUserProfile();
      toast.success('Welcome to MinesMinis!');
      navigate(role === 'parent' ? '/parent' : role === 'teacher' ? '/teacher' : '/dashboard');
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Please try again.';
      toast.error(`Oops! ${msg}`, { duration: 6000 });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Render helpers ─────────────────────────────────────────────────────────

  const renderProgressBar = () => (
    <div className="onboarding-progress">
      {Array.from({ length: totalSteps }, (_, i) => {
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
              animate={isActive ? { scale: [1, 1.08, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {isCompleted ? <Check size={14} /> : s}
            </motion.div>
          </div>
        );
      })}
    </div>
  );

  const renderNavActions = (opts?: { showBack?: boolean; nextLabel?: string; onNext?: () => void; isLast?: boolean }) => {
    const { showBack = true, nextLabel = 'Continue', onNext, isLast = false } = opts || {};
    return (
      <div className="onboarding-actions">
        {showBack && (
          <Button variant="ghost" size="lg" onClick={prevStep} icon={<ArrowLeft size={18} />}>
            Back
          </Button>
        )}
        <Button
          variant="primary"
          size="lg"
          onClick={isLast ? handleSubmit : (onNext || nextStep)}
          disabled={!canProceed()}
          loading={isLast ? isSubmitting : false}
          icon={isLast ? <Rocket size={18} /> : <ArrowRight size={18} />}
        >
          {isLast ? (isSubmitting ? 'Preparing...' : nextLabel) : nextLabel}
        </Button>
      </div>
    );
  };

  // ── Step 1: Role Selection ────────────────────────────────────────────────

  const renderRoleSelection = () => (
    <motion.div
      key="step-role"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <h2>How will you use MinesMinis?</h2>
      <p className="onboarding-step-sub">Choose your role to get a personalized experience</p>

      <div className="onboarding-role-grid">
        {ROLE_CARDS.map((r) => (
          <motion.button
            key={r.value}
            type="button"
            className={`onboarding-role-card ${role === r.value ? 'selected' : ''}`}
            onClick={() => setRole(r.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="onboarding-role-icon-wrap" style={{ background: role === r.value ? 'var(--primary)' : 'var(--bg-muted)' }}>
              <span style={{ color: role === r.value ? 'var(--text-on-primary)' : 'var(--primary)' }}>{r.icon}</span>
            </span>
            <div className="onboarding-role-text">
              <span className="onboarding-role-title">{r.title}</span>
              <span className="onboarding-role-subtitle">{r.subtitle}</span>
              <span className="onboarding-role-detail">{r.detail}</span>
            </div>
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
          Continue
        </Button>
      </div>

      <div className="onboarding-skip">
        <button type="button" onClick={handleSkip}>Skip for now</button>
      </div>
    </motion.div>
  );

  // ── STUDENT PATH ───────────────────────────────────────────────────────────

  const renderStudentAge = () => (
    <motion.div
      key="student-age"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <h2>What's your age group?</h2>
      <p className="onboarding-step-sub">This helps us pick the perfect learning phase for you</p>

      <div className="onboarding-age-grid">
        {STUDENT_AGE_GROUPS.map((ag) => (
          <motion.button
            key={ag.value}
            type="button"
            className={`onboarding-age-card ${ageGroup === ag.value ? 'selected' : ''}`}
            onClick={() => setAgeGroup(ag.value)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="onboarding-age-icon-wrap">
              {ag.icon}
            </span>
            <span className="onboarding-age-range">{ag.label}</span>
            <span className="onboarding-age-label">{ag.phase}</span>
          </motion.button>
        ))}
      </div>

      {renderNavActions({ nextLabel: 'Continue' })}
    </motion.div>
  );

  const renderPlacementTest = () => {
    if (placementDone) {
      return (
        <motion.div
          key="placement-done"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="onboarding-step"
        >
          <div className="onboarding-step-icon-large onboarding-step-icon-success">
            <CheckCircle size={40} />
          </div>
          <h2>Great job!</h2>
          <p className="onboarding-step-sub">
            Based on your answers, we recommend starting at <strong>Phonics {PHONICS_GROUPS[startingPhonicsGroup - 1].name}</strong>
          </p>
          <div className="onboarding-placement-result">
            <div className="onboarding-phonics-result-card">
              <span className="onboarding-phonics-result-name">{PHONICS_GROUPS[startingPhonicsGroup - 1].name}</span>
              <span className="onboarding-phonics-result-sounds">{PHONICS_GROUPS[startingPhonicsGroup - 1].sounds}</span>
              <span className="onboarding-phonics-result-desc">{PHONICS_GROUPS[startingPhonicsGroup - 1].description}</span>
            </div>
          </div>
          {renderNavActions({ nextLabel: 'Continue' })}
        </motion.div>
      );
    }

    const q = PLACEMENT_QUESTIONS[currentQuestion];
    return (
      <motion.div
        key={`placement-q${currentQuestion}`}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="onboarding-step"
      >
        <h2>{q.title}</h2>
        <p className="onboarding-step-sub onboarding-step-sub-large">{q.instruction}</p>

        <div className="onboarding-placement-progress">
          {PLACEMENT_QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={`onboarding-placement-dot ${i === currentQuestion ? 'active' : ''} ${i < currentQuestion ? 'done' : ''}`}
            />
          ))}
        </div>

        <div className="onboarding-placement-options">
          {q.options.map((opt) => {
            const isSelected = placementAnswers[q.id] === opt.value;
            return (
              <motion.button
                key={opt.value}
                type="button"
                className={`onboarding-placement-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handlePlacementAnswer(q.id, opt.value)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span className="onboarding-placement-option-indicator">
                  {isSelected ? <Check size={16} /> : null}
                </span>
                <span>{opt.label}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="onboarding-actions">
          <Button variant="ghost" size="lg" onClick={prevStep} icon={<ArrowLeft size={18} />}>
            Back
          </Button>
          <span className="onboarding-question-counter">
            {currentQuestion + 1} / {PLACEMENT_QUESTIONS.length}
          </span>
        </div>
      </motion.div>
    );
  };

  const renderMeetMimi = () => (
    <motion.div
      key="meet-mimi"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <h2>Meet Mimi!</h2>
      <p className="onboarding-step-sub">Your friendly dragon guide on this learning adventure</p>

      <div className="onboarding-mimi-intro">
        <motion.div
          className="onboarding-mimi-large"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <MimiMascot size={160} mood="waving" />
        </motion.div>

        <div className="onboarding-mimi-speech">
          Hi there! I&apos;m Mimi, your dragon friend! I&apos;ll help you learn English through fun games,
          exciting stories, and magical adventures. Ready to explore?
          <div className="onboarding-mimi-facts">
            <span className="onboarding-mimi-fact"><Volume2 size={14} /> Dragon Fire</span>
            <span className="onboarding-mimi-fact"><Check size={14} /> +20% Stars</span>
            <span className="onboarding-mimi-fact"><Heart size={14} /> Always Friendly</span>
          </div>
        </div>
      </div>

      {renderNavActions({ nextLabel: "Let's Go!" })}
    </motion.div>
  );

  const renderLearningPath = () => {
    const phase = STUDENT_AGE_GROUPS.find((a) => a.value === ageGroup);
    const group = PHONICS_GROUPS[startingPhonicsGroup - 1];
    const nextGroups = PHONICS_GROUPS.slice(startingPhonicsGroup, startingPhonicsGroup + 2);

    return (
      <motion.div
        key="learning-path"
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="onboarding-step"
      >
        <div className="onboarding-step-icon-large">
          <MapPin size={32} />
        </div>
        <h2>Your Learning Path</h2>
        <p className="onboarding-step-sub">
          Starting in {phase?.phase || 'Phase 1'} with {group.name}
        </p>

        <div className="onboarding-path-units">
          <div className="onboarding-path-unit current">
            <span className="onboarding-path-unit-icon"><Volume2 size={20} /></span>
            <div className="onboarding-path-unit-info">
              <strong>{group.name}</strong>
              <span>{group.sounds}</span>
            </div>
            <span className="onboarding-path-unit-badge">Start Here</span>
          </div>
          {nextGroups.map((ng) => (
            <div key={ng.id} className="onboarding-path-unit upcoming">
              <span className="onboarding-path-unit-icon"><LockIcon size={20} /></span>
              <div className="onboarding-path-unit-info">
                <strong>{ng.name}</strong>
                <span>{ng.sounds}</span>
              </div>
            </div>
          ))}
        </div>

        {renderNavActions({ nextLabel: 'Begin Learning', isLast: true })}
      </motion.div>
    );
  };

  // ── TEACHER PATH ───────────────────────────────────────────────────────────

  const renderTeacherAbout = () => (
    <motion.div
      key="teacher-about"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <div className="onboarding-step-icon-large">
        <UserPlus size={32} />
      </div>
      <h2>About You</h2>
      <p className="onboarding-step-sub">Tell us a bit about your teaching</p>

      <div className="onboarding-form-group">
        <label className="onboarding-label">School / Institution (optional)</label>
        <input
          type="text"
          className="onboarding-input"
          placeholder="e.g. Sunshine Primary School"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
      </div>

      <div className="onboarding-form-group">
        <label className="onboarding-label">Grade levels you teach</label>
        <div className="onboarding-chip-grid">
          {GRADE_LEVELS.map((gl) => (
            <button
              key={gl}
              type="button"
              className={`onboarding-chip ${teacherGrades.includes(gl) ? 'selected' : ''}`}
              onClick={() => toggleGrade(gl)}
            >
              {teacherGrades.includes(gl) && <Check size={14} />}
              {gl}
            </button>
          ))}
        </div>
      </div>

      <div className="onboarding-form-group">
        <label className="onboarding-label">How many students?</label>
        <div className="onboarding-chip-grid">
          {STUDENT_RANGES.map((sr) => (
            <button
              key={sr}
              type="button"
              className={`onboarding-chip ${studentCount === sr ? 'selected' : ''}`}
              onClick={() => setStudentCount(sr)}
            >
              {studentCount === sr && <Check size={14} />}
              {sr}
            </button>
          ))}
        </div>
      </div>

      {renderNavActions({ nextLabel: 'Continue' })}
    </motion.div>
  );

  const renderCreateClassroom = () => (
    <motion.div
      key="teacher-classroom"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <div className="onboarding-step-icon-large">
        <Users size={32} />
      </div>
      <h2>Create First Classroom</h2>
      <p className="onboarding-step-sub">Set up a classroom so students can join</p>

      <div className="onboarding-form-group">
        <label className="onboarding-label">Classroom Name</label>
        <input
          type="text"
          className="onboarding-input"
          placeholder='e.g. "3-A Sinifi" or "Grade 3 Class A"'
          value={classroomName}
          onChange={(e) => setClassroomName(e.target.value)}
        />
      </div>

      <div className="onboarding-form-group">
        <label className="onboarding-label">Grade Level</label>
        <select
          className="onboarding-select"
          value={classroomGrade}
          onChange={(e) => setClassroomGrade(e.target.value)}
        >
          <option value="">Select grade...</option>
          {GRADE_LEVELS.map((gl) => (
            <option key={gl} value={gl}>{gl}</option>
          ))}
        </select>
      </div>

      <div className="onboarding-join-code-box">
        <label className="onboarding-label">Share this code with your students</label>
        <div className="onboarding-join-code">{joinCode}</div>
        <p className="onboarding-join-code-hint">Students enter this code to join your classroom</p>
      </div>

      {renderNavActions({ nextLabel: 'Continue' })}
    </motion.div>
  );

  const renderChooseStarting = () => {
    const recommended = recommendedPhonicsGroup(teacherGrades);
    return (
      <motion.div
        key="teacher-starting"
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="onboarding-step"
      >
        <div className="onboarding-step-icon-large">
          <BookOpen size={32} />
        </div>
        <h2>Choose Starting Point</h2>
        <p className="onboarding-step-sub">Select which Phonics Group your class should start with. You can change this anytime.</p>

        <div className="onboarding-phonics-list">
          {PHONICS_GROUPS.map((pg) => (
            <motion.button
              key={pg.id}
              type="button"
              className={`onboarding-phonics-item ${selectedPhonicsGroup === pg.id ? 'selected' : ''}`}
              onClick={() => setSelectedPhonicsGroup(pg.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="onboarding-phonics-item-header">
                <span className="onboarding-phonics-item-check">
                  {selectedPhonicsGroup === pg.id ? <Check size={16} /> : null}
                </span>
                <strong>{pg.name}</strong>
                <span className="onboarding-phonics-item-sounds">{pg.sounds}</span>
                {pg.id === recommended && (
                  <span className="onboarding-phonics-recommended">Recommended</span>
                )}
              </div>
              <span className="onboarding-phonics-item-desc">{pg.description}</span>
            </motion.button>
          ))}
        </div>

        {renderNavActions({ nextLabel: "Let's Start!", isLast: true })}
      </motion.div>
    );
  };

  // ── PARENT PATH ────────────────────────────────────────────────────────────

  const renderAddChild = () => (
    <motion.div
      key="parent-child"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <div className="onboarding-step-icon-large">
        <Heart size={32} />
      </div>
      <h2>Add Your Child</h2>
      <p className="onboarding-step-sub">Tell us about your child (up to 4)</p>

      <div className="onboarding-children-list">
        {children.map((child, idx) => (
          <div key={idx} className="onboarding-child-card">
            <div className="onboarding-child-header">
              <span className="onboarding-child-number">Child {idx + 1}</span>
              {children.length > 1 && (
                <button type="button" className="onboarding-child-remove" onClick={() => removeChild(idx)}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="onboarding-form-group">
              <input
                type="text"
                className="onboarding-input"
                placeholder="Child's name"
                value={child.name}
                onChange={(e) => updateChild(idx, 'name', e.target.value)}
              />
            </div>

            <div className="onboarding-form-group">
              <select
                className="onboarding-select"
                value={child.age}
                onChange={(e) => updateChild(idx, 'age', e.target.value)}
              >
                <option value="">Age...</option>
                {[3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
                  <option key={a} value={String(a)}>{a} years old</option>
                ))}
              </select>
            </div>

            <div className="onboarding-child-avatars">
              {CHILD_AVATAR_INITIALS.map((initial, i) => {
                const bgColor = CHILD_AVATAR_COLORS[i % CHILD_AVATAR_COLORS.length];
                return (
                  <button
                    key={initial}
                    type="button"
                    className={`onboarding-child-avatar-btn ${child.avatar === initial ? 'selected' : ''}`}
                    onClick={() => updateChild(idx, 'avatar', initial)}
                    style={{
                      background: child.avatar === initial ? bgColor : 'var(--bg-card)',
                      color: child.avatar === initial ? 'var(--text-on-primary)' : 'var(--text-secondary)',
                    }}
                  >
                    {initial}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {children.length < 4 && (
        <button type="button" className="onboarding-add-child-btn" onClick={addChild}>
          <Plus size={16} /> Add Another Child
        </button>
      )}

      {renderNavActions({ nextLabel: 'Continue' })}
    </motion.div>
  );

  const renderParentPreferences = () => (
    <motion.div
      key="parent-prefs"
      custom={direction}
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="onboarding-step"
    >
      <div className="onboarding-step-icon-large">
        <Settings size={32} />
      </div>
      <h2>Preferences</h2>
      <p className="onboarding-step-sub">Set up daily limits and notifications</p>

      <div className="onboarding-form-group">
        <label className="onboarding-label">
          Daily time limit: <strong>{dailyTimeLimit} min</strong>
        </label>
        <input
          type="range"
          className="onboarding-slider"
          min={15}
          max={60}
          step={5}
          value={dailyTimeLimit}
          onChange={(e) => setDailyTimeLimit(Number(e.target.value))}
        />
        <div className="onboarding-slider-labels">
          <span>15 min</span>
          <span>60 min</span>
        </div>
      </div>

      <div className="onboarding-form-group">
        <label className="onboarding-toggle-row">
          <span>Get weekly progress emails</span>
          <button
            type="button"
            className={`onboarding-toggle ${weeklyEmails ? 'on' : ''}`}
            onClick={() => setWeeklyEmails(!weeklyEmails)}
          >
            <span className="onboarding-toggle-knob" />
          </button>
        </label>
      </div>

      <div className="onboarding-ready-banner">
        <CheckCircle size={20} />
        <span>Your dashboard is ready!</span>
      </div>

      {renderNavActions({ nextLabel: "Let's Start!", isLast: true })}
    </motion.div>
  );

  // ── Step router ────────────────────────────────────────────────────────────

  const renderCurrentStep = () => {
    if (step === 1) return renderRoleSelection();

    if (role === 'student') {
      if (step === 2) return renderStudentAge();
      if (step === 3) return renderPlacementTest();
      if (step === 4) return renderMeetMimi();
      if (step === 5) return renderLearningPath();
    }

    if (role === 'teacher') {
      if (step === 2) return renderTeacherAbout();
      if (step === 3) return renderCreateClassroom();
      if (step === 4) return renderChooseStarting();
    }

    if (role === 'parent') {
      if (step === 2) return renderAddChild();
      if (step === 3) return renderParentPreferences();
    }

    return null;
  };

  // ── Main render ────────────────────────────────────────────────────────────

  return (
    <div className="onboarding-page">
      <motion.div
        className="onboarding-card"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {renderProgressBar()}

        <AnimatePresence mode="wait" custom={direction}>
          {renderCurrentStep()}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Onboarding;
