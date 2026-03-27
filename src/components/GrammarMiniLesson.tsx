/**
 * GrammarMiniLesson — bite-size grammar explanation + exercises
 * Embedded into DailyLesson Phase 2 (See) or as standalone mini-lesson
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ChevronRight } from 'lucide-react';
import { speak } from '../services/ttsService';
import type { GrammarLesson } from '../data/grammarLessons';
import './GrammarMiniLesson.css';

interface GrammarMiniLessonProps {
  lesson: GrammarLesson;
  lang?: 'tr' | 'en';
  onComplete?: (score: number) => void;
}

export default function GrammarMiniLesson({ lesson, lang = 'tr', onComplete }: GrammarMiniLessonProps) {
  const [phase, setPhase] = useState<'intro' | 'examples' | 'exercises' | 'done'>('intro');
  const [exIdx, setExIdx] = useState(0);
  const [exerciseIdx, setExerciseIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const isTr = lang === 'tr';

  const currentExercise = lesson.exercises[exerciseIdx];
  const totalExercises = lesson.exercises.length;

  const handleAnswer = (option: string) => {
    if (revealed) return;
    setSelected(option);
    setRevealed(true);
    const correct = option === currentExercise.answer;
    if (correct) setScore(s => s + 1);
    speak(correct ? 'Great job!' : currentExercise.answer);
  };

  const handleNext = () => {
    if (exerciseIdx < totalExercises - 1) {
      setExerciseIdx(i => i + 1);
      setSelected(null);
      setRevealed(false);
    } else {
      setPhase('done');
      onComplete?.(score + (selected === currentExercise.answer ? 1 : 0));
    }
  };

  return (
    <div className="grammar-mini-lesson">
      <AnimatePresence mode="wait">

        {phase === 'intro' && (
          <motion.div key="intro" className="gml-intro"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="gml-topic-badge">
              {isTr ? 'Gramer' : 'Grammar'}
            </div>
            <h2 className="gml-title">{isTr ? lesson.topicTr : lesson.topic}</h2>
            <div className="gml-pattern-box">
              <code>{lesson.pattern}</code>
            </div>
            <p className="gml-turkish-note">
              {lesson.turkishNote}
            </p>
            <button className="gml-btn gml-btn--primary" onClick={() => setPhase('examples')}>
              {isTr ? 'Örneklere Bak' : 'See Examples'} <ChevronRight size={16} />
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
                  {isTr ? 'Sonraki' : 'Next'} <ChevronRight size={16} />
                </button>
              ) : (
                <button className="gml-btn gml-btn--primary" onClick={() => setPhase('exercises')}>
                  {isTr ? 'Alıştırmalara Geç' : 'Try Exercises'} <ChevronRight size={16} />
                </button>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'exercises' && currentExercise && (
          <motion.div key={`q-${exerciseIdx}`} className="gml-exercise"
            initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
            <p className="gml-ex-counter">{exerciseIdx + 1}/{totalExercises}</p>
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
                  {exerciseIdx < totalExercises - 1 ? (isTr ? 'Sonraki' : 'Next') : (isTr ? 'Bitti!' : 'Done!')} <ChevronRight size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'done' && (
          <motion.div key="done" className="gml-done"
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="gml-done-stars">
              {[1, 2, 3].map(s => (
                <motion.span key={s} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: s * 0.1 }}>
                  {score >= s ? '★' : '☆'}
                </motion.span>
              ))}
            </div>
            <h2>{score === totalExercises ? (isTr ? 'Mükemmel!' : 'Perfect!') : score > 0 ? (isTr ? 'Aferin!' : 'Well done!') : (isTr ? 'Tekrar dene!' : 'Try again!')}</h2>
            <p>{score}/{totalExercises} {isTr ? 'doğru' : 'correct'}</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
