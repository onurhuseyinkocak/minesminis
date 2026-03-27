/**
 * GrammarMiniLesson — bite-size grammar explanation + exercises
 * Embedded into DailyLesson Phase 2 (See) or as standalone mini-lesson
 */
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight } from 'lucide-react';
import { speak } from '../services/ttsService';
import { useLanguage } from '../contexts/LanguageContext';
import type { GrammarLesson } from '../data/grammarLessons';
import './GrammarMiniLesson.css';

interface GrammarMiniLessonProps {
  lesson: GrammarLesson;
  lang?: 'tr' | 'en';
  onComplete?: (score: number) => void;
}

export default function GrammarMiniLesson({ lesson, lang = 'tr', onComplete }: GrammarMiniLessonProps) {
  const { t } = useLanguage();
  const [phase, setPhase] = useState<'intro' | 'examples' | 'exercises' | 'done'>('intro');
  const [exIdx, setExIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  // scoreRef keeps a sync copy of score so handleNext can read the final value
  // without depending on stale state from async setState
  const scoreRef = useRef(0);
  const isTr = lang === 'tr';

  const currentExercise = lesson.exercises[exerciseIdx];
  const totalExercises = lesson.exercises.length;

  const handleAnswer = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === currentExercise.answer;
    if (correct) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
    speak(correct ? 'Great job!' : currentExercise.answer);
  };

  const handleNext = () => {
    if (exerciseIdx < totalExercises - 1) {
      setExerciseIdx(i => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setPhase('done');
      onComplete?.(scoreRef.current);
    }
  };

  return (
    <div className="grammar-mini-lesson">
      <AnimatePresence mode="wait">

        {phase === 'intro' && (
          <motion.div key="intro" className="gml-intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="gml-topic-badge">
              {t('games.grammarLabel')}
            </div>
            <h2 className="gml-title">{isTr ? lesson.topicTr : lesson.topic}</h2>
            {/* Turkish note first — context before the rule */}
            <p className="gml-turkish-note">
              {lesson.turkishNote}
            </p>
            {/* Pattern shown after the context note, before examples */}
            <div className="gml-pattern-box">
              <code>{isTr ? lesson.patternTr : lesson.pattern}</code>
            </div>
            <button className="gml-btn gml-btn--primary" onClick={() => setPhase('examples')}>
              {t('games.grammarSeeExamples')} <ChevronRight size={16} />
            </button>
          </motion.div>
        )}

        {phase === 'examples' && (
          <motion.div key={`ex-${exIdx}`} className="gml-examples"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="gml-ex-counter">{exIdx + 1}/{lesson.examples.length}</p>
            <div className="gml-example-card" onClick={() => speak(lesson.examples[exIdx].en)}>
              <p className="gml-example-en">
                {lesson.examples[exIdx].en.split(lesson.examples[exIdx].highlight).map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <strong className="gml-highlight">{lesson.examples[exIdx].highlight}</strong>
                    )}
                  </span>
                ))}
              </p>
              <p className="gml-example-tr">{lesson.examples[exIdx].tr}</p>
            </div>
            <div className="gml-nav">
              {exIdx < lesson.examples.length - 1 ? (
                <button className="gml-btn gml-btn--primary" onClick={() => setExIdx(i => i + 1)}>
                  {t('games.grammarNext')} <ChevronRight size={16} />
                </button>
              ) : (
                <button className="gml-btn gml-btn--primary" onClick={() => setPhase('exercises')}>
                  {t('games.grammarTryExercises')} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'exercises' && currentExercise && (
          <motion.div key={`q-${exerciseIdx}`} className="gml-exercise"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="gml-ex-counter">{exerciseIdx + 1}/{totalExercises}</p>
            <div className="gml-step-dots" aria-hidden="true">
              {lesson.exercises.map((_, i) => (
                <span
                  key={i}
                  className={`gml-step-dot${i === exerciseIdx ? ' gml-step-dot--active' : i < exerciseIdx ? ' gml-step-dot--done' : ''}`}
                />
              ))}
            </div>
            <h3 className="gml-question">{isTr ? currentExercise.questionTr : currentExercise.question}</h3>
            <div className="gml-options">
              {currentExercise.options?.map(opt => {
                const isSelected = selected === opt;
                const isCorrect = opt === currentExercise.answer;
                let cls = 'gml-option';
                if (revealed) {
                  if (isCorrect) cls += ' gml-option--correct';
                  else if (isSelected && !isCorrect) cls += ' gml-option--wrong';
                }
                return (
                  <button key={opt} className={cls} onClick={() => handleAnswer(opt)} disabled={revealed}>
                    <span className="gml-option-icon">
                      {revealed && isCorrect ? <Check size={16} /> : revealed && isSelected && !isCorrect ? <X size={16} /> : null}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>
            {revealed && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="gml-explanation">
                <p>{isTr ? currentExercise.explanationTr : currentExercise.explanation}</p>
                <button className="gml-btn gml-btn--primary" onClick={handleNext}>
                  {exerciseIdx < totalExercises - 1 ? t('games.grammarNext') : t('games.grammarDone')} <ChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" className="gml-done"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="gml-done-stars">
              {(() => {
                // 3 stars = perfect, 2 stars = >50%, 1 star = any correct, 0 stars = all wrong
                const earnedStars = score === totalExercises ? 3 : score >= Math.ceil(totalExercises / 2) ? 2 : score > 0 ? 1 : 0;
                return [1, 2, 3].map(s => (
                  <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s * 0.15 }}>
                    {s <= earnedStars ? '★' : '☆'}
                  </motion.span>
                ));
              })()}
            </div>
            <h2>{score === totalExercises ? t('games.grammarPerfect') : score > 0 ? t('games.grammarWellDone') : t('games.grammarTryAgain')}</h2>
            <div className="gml-score-pill">
              {score}/{totalExercises} {t('games.grammarCorrect')}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
