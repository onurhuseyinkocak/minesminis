import { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useHearts } from '../../contexts/HeartsContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { SFX } from '../../data/soundLibrary';
import UnifiedMascot from '../UnifiedMascot';
import type { PhoneticTrap } from '../../data/turkishPhoneticTraps';
import './PhoneticTrapGame.css';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PhoneticTrapGameProps {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  onBack: () => void;
}

type TabId = 'learn' | 'practice' | 'challenge';

interface ChallengeQuestion {
  word: string;
  meaning: string;
  meaningTr: string;
  options: Array<{ word: string; meaning: string; meaningTr: string; isCorrect: boolean }>;
}

// ─── Mouth SVG diagrams ───────────────────────────────────────────────────────

function MouthDiagramTH() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for TH sound">
      {/* Outer lips */}
      <ellipse cx="45" cy="44" rx="38" ry="22" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      {/* Upper lip line */}
      <path d="M 15 40 Q 30 32 45 36 Q 60 32 75 40" stroke="#C0504D" strokeWidth="1.5" fill="none" />
      {/* Teeth upper */}
      <rect x="22" y="38" width="46" height="10" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      {/* Teeth lower */}
      <rect x="22" y="50" width="46" height="10" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      {/* Tongue between teeth */}
      <ellipse cx="45" cy="48" rx="20" ry="5" fill="#E57373" opacity="0.9" />
      {/* Arrow showing tongue out */}
      <path d="M 62 48 L 74 48" stroke="#7C3AED" strokeWidth="2" markerEnd="url(#arr)" />
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#7C3AED" />
        </marker>
      </defs>
      {/* Label */}
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#7C3AED">tongue out</text>
    </svg>
  );
}

function MouthDiagramW() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for W sound">
      {/* Outer lips — rounded/puckered */}
      <ellipse cx="45" cy="44" rx="22" ry="18" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      {/* Inner opening small */}
      <ellipse cx="45" cy="46" rx="10" ry="8" fill="#4A1942" />
      {/* Lip roundness indicator */}
      <path d="M 26 38 Q 35 26 45 28 Q 55 26 64 38" stroke="#C0504D" strokeWidth="1.5" fill="none" />
      {/* Label */}
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#2563EB">round lips</text>
      {/* Arrow showing lip shape */}
      <path d="M 23 44 L 10 44" stroke="#2563EB" strokeWidth="2" markerEnd="url(#arrW)" />
      <defs>
        <marker id="arrW" markerWidth="6" markerHeight="6" refX="0" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill="#2563EB" />
        </marker>
      </defs>
    </svg>
  );
}

function MouthDiagramR() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for English R sound">
      {/* Outer lips */}
      <ellipse cx="45" cy="44" rx="34" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      {/* Upper row teeth */}
      <rect x="24" y="38" width="42" height="9" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      {/* Lower row teeth */}
      <rect x="24" y="49" width="42" height="9" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      {/* Tongue curled back */}
      <path d="M 28 52 Q 40 44 55 50 Q 62 46 65 38" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Arrow showing curl direction */}
      <path d="M 60 36 Q 68 30 72 36" stroke="#0891B2" strokeWidth="1.5" fill="none" markerEnd="url(#arrR)" />
      <defs>
        <marker id="arrR" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#0891B2" />
        </marker>
      </defs>
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0891B2">curl back</text>
    </svg>
  );
}

function MouthDiagramNG() {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth position for NG sound">
      {/* Outer lips — slightly open */}
      <ellipse cx="45" cy="44" rx="36" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      {/* Teeth */}
      <rect x="22" y="38" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="22" y="48" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      {/* Back of tongue rises */}
      <path d="M 22 56 Q 36 52 55 46 Q 65 42 68 40" stroke="#E57373" strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Palate */}
      <path d="M 28 36 Q 45 28 62 36" stroke="#FBBCB0" strokeWidth="8" fill="none" />
      <path d="M 28 36 Q 45 28 62 36" stroke="#E57373" strokeWidth="1.5" fill="none" />
      {/* Contact point marker */}
      <circle cx="58" cy="38" r="4" fill="#BE185D" opacity="0.85" />
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill="#BE185D">back tongue up</text>
    </svg>
  );
}

function MouthDiagramDefault({ color }: { color: string }) {
  return (
    <svg width="90" height="72" viewBox="0 0 90 72" fill="none" aria-label="Mouth diagram">
      <ellipse cx="45" cy="44" rx="36" ry="20" fill="#FBBCB0" stroke="#E57373" strokeWidth="1.5" />
      <rect x="22" y="38" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <rect x="22" y="49" width="46" height="8" rx="2" fill="#FFFDE7" stroke="#E0E0E0" strokeWidth="0.8" />
      <ellipse cx="45" cy="56" rx="18" ry="6" fill="#E57373" opacity="0.8" />
      <text x="45" y="14" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>mouth position</text>
    </svg>
  );
}

function MouthDiagram({ trapId, color }: { trapId: string; color: string }) {
  if (trapId === 'th-voiceless' || trapId === 'th-voiced') return <MouthDiagramTH />;
  if (trapId === 'w-vs-v') return <MouthDiagramW />;
  if (trapId === 'english-r') return <MouthDiagramR />;
  if (trapId === 'ng-sound') return <MouthDiagramNG />;
  return <MouthDiagramDefault color={color} />;
}

// ─── Build challenge questions from minimal pairs ─────────────────────────────

function buildChallengeQuestions(trap: PhoneticTrap): ChallengeQuestion[] {
  const pairs = [...trap.minimalPairs];
  // Use up to 5 pairs; shuffle lightly by reversing every other
  const selected = pairs.slice(0, 5);
  return selected.map((pair) => {
    const isCorrectFirst = Math.random() > 0.5;
    const correctOpt = { word: pair.english, meaning: pair.meaning, meaningTr: pair.meaningTr, isCorrect: true };
    const wrongOpt = { word: pair.errorVersion, meaning: `"${pair.errorVersion}" (Yanlış)`, meaningTr: `"${pair.errorVersion}" (Hata)`, isCorrect: false };
    return {
      word: pair.english,
      meaning: pair.meaning,
      meaningTr: pair.meaningTr,
      options: isCorrectFirst ? [correctOpt, wrongOpt] : [wrongOpt, correctOpt],
    };
  });
}

// ─── Learn Tab ────────────────────────────────────────────────────────────────

function LearnTab({ trap }: { trap: PhoneticTrap }) {
  const { lang: language } = useLanguage();
  const isTr = language === 'tr';

  return (
    <div className="ptg__panel">
      {/* Error description */}
      <div className="ptg__error-card" style={{ '--trap-color': trap.color } as React.CSSProperties}>
        <p className="ptg__error-label">Common Mistake</p>
        <p className="ptg__error-text">{trap.commonError}</p>
        <p className="ptg__error-text--tr">{trap.commonErrorTr}</p>
      </div>

      {/* Mouth position diagram */}
      <div className="ptg__mouth-section">
        <p className="ptg__mouth-title">
          How to make this sound:
        </p>
        <div className="ptg__mouth-diagram">
          <div className="ptg__mouth-svg-wrap">
            <MouthDiagram trapId={trap.id} color={trap.color} />
          </div>
          <div className="ptg__mouth-instructions">
            <p className="ptg__mouth-en">{trap.mouthPosition}</p>
            {isTr && <p className="ptg__mouth-tr">{trap.mouthPositionTr}</p>}
          </div>
        </div>
      </div>

      {/* Minimal pairs */}
      <div>
        <p className="ptg__pairs-title">Correct vs. Common Error:</p>
        <div className="ptg__pairs-list">
          {trap.minimalPairs.map((pair) => (
            <div key={pair.english} className="ptg__pair">
              <div className="ptg__pair-correct">
                <span className="ptg__pair-word" style={{ color: trap.color }}>{pair.english}</span>
                <span className="ptg__pair-meaning">{pair.meaning}</span>
                {isTr && <span className="ptg__pair-meaning">{pair.meaningTr}</span>}
              </div>
              <span className="ptg__pair-divider">vs</span>
              <div className="ptg__pair-wrong">
                <span className="ptg__pair-word--wrong">{pair.errorVersion}</span>
                <span className="ptg__pair-label">Common error</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Practice Tab ─────────────────────────────────────────────────────────────

function PracticeTab({
  trap,
  onComplete,
  onWrongAnswer,
  loseHeart,
}: {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  loseHeart: () => void;
}) {
  const { lang: language } = useLanguage();
  const isTr = language === 'tr';
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const exercise = trap.exercises[exerciseIndex];

  const handleSelect = useCallback(
    (option: string) => {
      if (selected !== null) return;
      setSelected(option);
      const isCorrect = option === exercise.correctOption;
      if (isCorrect) {
        SFX.correct();
        setCorrectCount((c) => c + 1);
      } else {
        SFX.wrong?.();
        loseHeart();
        onWrongAnswer?.();
      }
    },
    [selected, exercise.correctOption, onWrongAnswer, loseHeart],
  );

  const handleNext = useCallback(() => {
    if (exerciseIndex + 1 >= trap.exercises.length) {
      const score = Math.round((correctCount / trap.exercises.length) * 100);
      setDone(true);
      onComplete(score);
    } else {
      setExerciseIndex((i) => i + 1);
      setSelected(null);
    }
  }, [exerciseIndex, trap.exercises.length, correctCount, onComplete]);

  if (done) {
    return (
      <div className="ptg__panel">
        <div className="ptg__complete">
          <div className="ptg__complete-mascot">
            <UnifiedMascot state="celebrating" size={100} />
          </div>
          <h3 className="ptg__complete-title">Practice done!</h3>
          <p className="ptg__complete-score">
            {correctCount}/{trap.exercises.length} correct
          </p>
        </div>
      </div>
    );
  }

  const progress = ((exerciseIndex) / trap.exercises.length) * 100;

  return (
    <div className="ptg__panel">
      <div className="ptg__exercise-counter">
        <span className="ptg__exercise-label">
          Question {exerciseIndex + 1} of {trap.exercises.length}
        </span>
      </div>

      <div className="ptg__progress-bar-track">
        <div className="ptg__progress-bar-fill" style={{ width: `${progress}%`, ['--trap-color' as string]: trap.color }} />
      </div>

      <div className="ptg__prompt-card">
        <p className="ptg__prompt-en">{exercise.prompt}</p>
        {isTr && <p className="ptg__prompt-tr">{exercise.promptTr}</p>}
      </div>

      <div className="ptg__options">
        {(exercise.options ?? []).map((option) => {
          let optClass = 'ptg__option';
          if (selected !== null) {
            if (option === exercise.correctOption) optClass += ' ptg__option--correct';
            else if (option === selected) optClass += ' ptg__option--wrong';
          }
          return (
            <button
              type="button"
              key={option}
              className={optClass}
              onClick={() => handleSelect(option)}
              disabled={selected !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <>
          <div className={`ptg__feedback ${selected === exercise.correctOption ? 'ptg__feedback--correct' : 'ptg__feedback--wrong'}`}>
            {selected === exercise.correctOption
              ? 'Correct! Great pronunciation awareness!'
              : `The right answer is "${exercise.correctOption}"`}
          </div>
          <button type="button" className="ptg__next-btn" style={{ '--trap-color': trap.color } as React.CSSProperties} onClick={handleNext}>
            {exerciseIndex + 1 >= trap.exercises.length ? 'Finish Practice' : 'Next Question'}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Challenge Tab ────────────────────────────────────────────────────────────

function ChallengeTab({
  trap,
  onComplete,
  onWrongAnswer,
  loseHeart,
}: {
  trap: PhoneticTrap;
  onComplete: (score: number) => void;
  onWrongAnswer?: () => void;
  loseHeart: () => void;
}) {
  const { lang: language } = useLanguage();
  const isTr = language === 'tr';
  const [questions] = useState<ChallengeQuestion[]>(() => buildChallengeQuestions(trap));
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const question = questions[questionIndex];

  const handleSelect = useCallback(
    (word: string, isCorrect: boolean) => {
      if (selected !== null) return;
      setSelected(word);
      if (isCorrect) {
        SFX.correct();
        setCorrectCount((c) => c + 1);
        // Auto-advance after 900ms
        setTimeout(() => {
          if (questionIndex + 1 >= questions.length) {
            const score = Math.round(((correctCount + 1) / questions.length) * 100);
            setDone(true);
            onComplete(score);
          } else {
            setQuestionIndex((i) => i + 1);
            setSelected(null);
          }
        }, 900);
      } else {
        SFX.wrong?.();
        loseHeart();
        onWrongAnswer?.();
        setTimeout(() => {
          if (questionIndex + 1 >= questions.length) {
            const score = Math.round((correctCount / questions.length) * 100);
            setDone(true);
            onComplete(score);
          } else {
            setQuestionIndex((i) => i + 1);
            setSelected(null);
          }
        }, 1200);
      }
    },
    [selected, questionIndex, questions.length, correctCount, onComplete, onWrongAnswer, loseHeart],
  );

  if (done) {
    const finalScore = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="ptg__panel">
        <div className="ptg__complete">
          <div className="ptg__complete-mascot">
            <UnifiedMascot state={finalScore >= 60 ? 'celebrating' : 'waving'} size={100} />
          </div>
          <h3 className="ptg__complete-title">Challenge Complete!</h3>
          <p className="ptg__complete-score">
            Score: {correctCount}/{questions.length} — {finalScore}%
          </p>
        </div>
      </div>
    );
  }

  const progress = (questionIndex / questions.length) * 100;

  return (
    <div className="ptg__panel">
      <div className="ptg__challenge">
        <div className="ptg__challenge-header">
          <h3 className="ptg__challenge-title">Speed Challenge</h3>
          <p className="ptg__challenge-subtitle">
            {isTr
              ? 'Doğru İngilizce kelimeye bas!'
              : 'Tap the correct English word!'}
          </p>
        </div>

        <div className="ptg__progress-bar-track" style={{ width: '100%' }}>
          <div className="ptg__progress-bar-fill" style={{ width: `${progress}%`, ['--trap-color' as string]: trap.color }} />
        </div>

        <span className="ptg__challenge-score">
          {questionIndex + 1} / {questions.length}
        </span>

        <div key={question.word} className="ptg__challenge-word" style={{ color: trap.color }}>
          {question.word}
        </div>

        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>
          {isTr ? question.meaningTr : question.meaning}
        </p>

        <div className="ptg__challenge-options">
          {question.options.map((opt) => {
            let cls = 'ptg__challenge-option';
            if (selected === opt.word) {
              cls += opt.isCorrect ? ' ptg__challenge-option--correct' : ' ptg__challenge-option--wrong';
            }
            return (
              <button
                type="button"
                key={opt.word}
                className={cls}
                onClick={() => handleSelect(opt.word, opt.isCorrect)}
                disabled={selected !== null}
              >
                <span className="ptg__challenge-option-word">{opt.word}</span>
                <span className="ptg__challenge-option-meaning">
                  {isTr ? opt.meaningTr : opt.meaning}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PhoneticTrapGame({
  trap,
  onComplete,
  onWrongAnswer,
  onBack,
}: PhoneticTrapGameProps) {
  const { loseHeart } = useHearts();
  const [activeTab, setActiveTab] = useState<TabId>('learn');
  const [practiceScore, setPracticeScore] = useState<number | null>(null);
  const [challengeScore, setChallengeScore] = useState<number | null>(null);

  const handlePracticeComplete = useCallback(
    (score: number) => {
      setPracticeScore(score);
      if (challengeScore !== null) {
        onComplete(Math.round((score + challengeScore) / 2));
      }
    },
    [challengeScore, onComplete],
  );

  const handleChallengeComplete = useCallback(
    (score: number) => {
      setChallengeScore(score);
      const combined = practiceScore !== null
        ? Math.round((practiceScore + score) / 2)
        : score;
      onComplete(combined);
    },
    [practiceScore, onComplete],
  );

  const cssVars = { '--trap-color': trap.color } as React.CSSProperties;

  return (
    <div className="ptg" style={cssVars}>
      {/* Header */}
      <div className="ptg__header">
        <button type="button" className="ptg__back-btn" onClick={onBack} aria-label="Back to trap list">
          <ArrowLeft size={20} />
        </button>
        <div className="ptg__sound-badge">
          <span className="ptg__ipa" style={{ color: trap.color }}>{trap.targetSoundIPA}</span>
          <span className="ptg__sound-name">{trap.targetSound}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="ptg__tabs">
        <button
          type="button"
          className={`ptg__tab${activeTab === 'learn' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('learn')}
        >
          <span className="ptg__tab-icon">&#128218;</span>
          <span className="ptg__tab-label">Learn</span>
        </button>
        <button
          type="button"
          className={`ptg__tab${activeTab === 'practice' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="ptg__tab-icon">&#9997;</span>
          <span className="ptg__tab-label">Practice</span>
          {practiceScore !== null && <span style={{ fontSize: '0.65rem', color: 'var(--success, #10B981)' }}>{practiceScore}%</span>}
        </button>
        <button
          type="button"
          className={`ptg__tab${activeTab === 'challenge' ? ' ptg__tab--active' : ''}`}
          onClick={() => setActiveTab('challenge')}
        >
          <span className="ptg__tab-icon">&#9889;</span>
          <span className="ptg__tab-label">Challenge</span>
          {challengeScore !== null && <span style={{ fontSize: '0.65rem', color: 'var(--success, #10B981)' }}>{challengeScore}%</span>}
        </button>
      </div>

      {/* Tab content */}
      {activeTab === 'learn' && <LearnTab trap={trap} />}
      {activeTab === 'practice' && (
        <PracticeTab
          trap={trap}
          onComplete={handlePracticeComplete}
          onWrongAnswer={onWrongAnswer}
          loseHeart={loseHeart}
        />
      )}
      {activeTab === 'challenge' && (
        <ChallengeTab
          trap={trap}
          onComplete={handleChallengeComplete}
          onWrongAnswer={onWrongAnswer}
          loseHeart={loseHeart}
        />
      )}
    </div>
  );
}
