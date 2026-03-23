/**
 * DAILY LESSON — "I do, We do, You do" 8-phase English teaching flow
 * MinesMinis — Real English teaching for Turkish kids ages 6-11
 *
 * Phase 1: WARM-UP       — Review 3 words from yesterday
 * Phase 2: NEW SOUNDS    — Today's phonics sound with mouth position
 * Phase 3: NEW WORDS     — 5 themed words with image + sentence + TTS
 * Phase 4: LISTEN & UNDERSTAND — Comprehension question in English
 * Phase 5: SPEAK & CORRECT — Pronunciation with honest feedback
 * Phase 6: READ & BLEND  — CVC letter-by-letter blending
 * Phase 7: MINI GRAMMAR  — One grammar pattern per day
 * Phase 8: CHALLENGE     — 3 mixed questions testing everything
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  ChevronRight,
  Volume2,
  Check,
  RotateCcw,
  Mic,
  MicOff,
} from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { speak } from '../services/ttsService';
import { SFX } from '../data/soundLibrary';
import {
  getTodayLesson,
  completeDailyLesson,
  getTodayPhonicsSound,
  getTodayCVCWords,
  getYesterdayWords,
  THEMED_WORD_GROUPS,
  type DailyLessonPlan,
  type KidsWord,
  type CVCWord,
  type GrammarPattern,
} from '../services/dailyLessonService';
import './DailyLesson.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_PHASES = 8;

const PHASE_META: Array<{ id: number; icon: string; titleEn: string; titleTr: string }> = [
  { id: 1, icon: '🌅', titleEn: 'Warm-Up',            titleTr: 'Isınma' },
  { id: 2, icon: '🔤', titleEn: 'New Sound',           titleTr: 'Yeni Ses' },
  { id: 3, icon: '📚', titleEn: 'New Words',           titleTr: 'Yeni Kelimeler' },
  { id: 4, icon: '👂', titleEn: 'Listen & Understand', titleTr: 'Dinle & Anla' },
  { id: 5, icon: '🎤', titleEn: 'Speak & Correct',     titleTr: 'Söyle & Düzelt' },
  { id: 6, icon: '🔡', titleEn: 'Read & Blend',        titleTr: 'Oku & Birleştir' },
  { id: 7, icon: '📝', titleEn: 'Mini Grammar',        titleTr: 'Mini Gramer' },
  { id: 8, icon: '🏆', titleEn: 'Challenge',           titleTr: 'Meydan Okuma' },
];

// ─── Progress persistence helpers ────────────────────────────────────────────

interface LessonProgress {
  completedPhases: number[];
  scores: Record<number, number>;
  phase: number;
}

function getProgressKey(userId: string, date: string) {
  return `mm_lesson_progress_${userId}_${date}`;
}

function saveProgress(userId: string, date: string, progress: LessonProgress) {
  try {
    localStorage.setItem(getProgressKey(userId, date), JSON.stringify(progress));
  } catch {
    // ignore storage errors
  }
}

function loadProgress(userId: string, date: string): LessonProgress | null {
  try {
    const raw = localStorage.getItem(getProgressKey(userId, date));
    if (!raw) return null;
    return JSON.parse(raw) as LessonProgress;
  } catch {
    return null;
  }
}

function clearProgress(userId: string, date: string) {
  try {
    localStorage.removeItem(getProgressKey(userId, date));
  } catch {
    // ignore
  }
}

// ─── Levenshtein helper ────────────────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];

function Confetti() {
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    delay: Math.random() * 0.8,
    x: Math.random() * 100,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  }));
  return (
    <div className="dl-confetti" aria-hidden>
      {pieces.map((p) => (
        <div
          key={p.id}
          className="dl-confetti__piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            animationDuration: `${1.2 + Math.random() * 1.5}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ─── Phase Success Flash (800ms green checkmark between phases) ───────────────

function PhaseSuccessFlash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="dl-phase-success" aria-hidden>
      <div className="dl-phase-success__check">✓</div>
    </div>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function LessonProgressBar({ phase, total }: { phase: number; total: number }) {
  const pct = Math.round(((phase - 1) / total) * 100);
  return (
    <div className="dl-lesson-progress">
      <div className="dl-lesson-progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

// ─── Phase Header ─────────────────────────────────────────────────────────────

function PhaseHeader({ phase, lang }: { phase: number; lang: string }) {
  const meta = PHASE_META[phase - 1];
  if (!meta) return null;
  const title = lang === 'tr' ? meta.titleTr : meta.titleEn;
  return (
    <div className="dl-phase-header">
      <span className="dl-phase-header__icon">{meta.icon}</span>
      <div className="dl-phase-header__text">
        <span className="dl-phase-header__num">
          {lang === 'tr' ? `Aşama ${phase}/${TOTAL_PHASES}` : `Phase ${phase}/${TOTAL_PHASES}`}
        </span>
        <span className="dl-phase-header__title">{title}</span>
      </div>
    </div>
  );
}

// ─── Feedback Banner ─────────────────────────────────────────────────────────

function FeedbackBanner({
  type,
  message,
}: {
  type: 'correct' | 'tryagain' | 'info';
  message: string;
}) {
  return (
    <div className={`dl-feedback-banner dl-feedback-banner--${type}`}>
      {type === 'correct' && <span className="dl-feedback-banner__icon">✓</span>}
      {type === 'tryagain' && <span className="dl-feedback-banner__icon">↻</span>}
      {message}
    </div>
  );
}

// ─── Phase 1: WARM-UP ─────────────────────────────────────────────────────────

function PhaseWarmup({
  words,
  lang,
  streakDays,
  onComplete,
}: {
  words: KidsWord[];
  lang: string;
  streakDays: number;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const word = words[index];

  useEffect(() => {
    setRevealed(false);
    if (word) speak(word.word).catch(() => {});
  }, [index, word]);

  if (words.length === 0) {
    return (
      <div className="dl-phase-content dl-phase-content--center">
        {streakDays >= 2 && (
          <div className="dl-streak-banner">
            <span className="dl-streak-banner__fire">🔥</span>
            <span className="dl-streak-banner__text">
              {lang === 'tr'
                ? `${streakDays} günlük seri! Devam et!`
                : `Day ${streakDays} streak! Keep going!`}
            </span>
          </div>
        )}
        <div className="dl-empty-state">
          <span className="dl-empty-state__emoji">👋</span>
          <p className="dl-empty-state__text">
            {lang === 'tr'
              ? "Bu ilk dersin! Hadi başlayalım."
              : "This is your first lesson! Let's get started."}
          </p>
          <button className="dl-btn dl-btn--primary" onClick={onComplete}>
            {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const handleReveal = () => {
    setRevealed(true);
    speak(word.word).catch(() => {});
  };

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="dl-phase-content">
      {streakDays >= 2 && (
        <div className="dl-streak-banner">
          <span className="dl-streak-banner__fire">🔥</span>
          <span className="dl-streak-banner__text">
            {lang === 'tr'
              ? `${streakDays} günlük seri! Devam et!`
              : `Day ${streakDays} streak! Keep going!`}
          </span>
        </div>
      )}

      <p className="dl-instruction">
        {lang === 'tr' ? 'Dünkü kelimeleri hatırlıyor musun?' : 'Do you remember these words?'}
      </p>

      <div className="dl-warmup-counter">
        {words.map((_, i) => (
          <div
            key={i}
            className={`dl-warmup-dot ${i === index ? 'dl-warmup-dot--active' : i < index ? 'dl-warmup-dot--done' : ''}`}
          />
        ))}
      </div>

      <div
        className="dl-word-card dl-word-card--warmup"
        role="button"
        tabIndex={0}
        onClick={revealed ? undefined : handleReveal}
        aria-label={revealed ? word.word : (lang === 'tr' ? 'Görmek için dokun' : 'Tap to reveal')}
      >
        <span className="dl-word-card__emoji">{word.emoji}</span>
        {revealed ? (
          <>
            <span className="dl-word-card__word">{word.word.toUpperCase()}</span>
            <span className="dl-word-card__tr">{word.turkish}</span>
            <button
              className="dl-btn dl-btn--ghost dl-btn--small"
              onClick={(e) => { e.stopPropagation(); speak(word.word).catch(() => {}); }}
            >
              <Volume2 size={16} />
              {lang === 'tr' ? 'Tekrar Dinle' : 'Hear Again'}
            </button>
          </>
        ) : (
          <div className="dl-word-card__tap-hint">
            {lang === 'tr' ? 'Hatırladın mı? Dokunarak gör!' : 'Remember it? Tap to reveal!'}
          </div>
        )}
      </div>

      {revealed && (
        <div className="dl-warmup-check">
          <p className="dl-instruction">
            {lang === 'tr' ? 'Hatırladın mı?' : 'Did you remember?'}
          </p>
          <div className="dl-warmup-btns">
            <button className="dl-btn dl-btn--correct" onClick={handleNext}>
              <Check size={18} />
              {lang === 'tr' ? 'Evet!' : 'Yes!'}
            </button>
            <button className="dl-btn dl-btn--ghost" onClick={handleNext}>
              {lang === 'tr' ? 'Hayır, geç' : 'Not quite, skip'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Phase 2: NEW SOUNDS ──────────────────────────────────────────────────────

function PhaseNewSounds({
  sound,
  lang,
  onComplete,
}: {
  sound: { grapheme: string; phoneme: string; keyword: string; emoji: string; exampleWords: string[] } | null;
  lang: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<'intro' | 'examples' | 'try'>('intro');
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'tryagain' | null>(null);
  const [attempts, setAttempts] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  if (!sound) {
    return (
      <div className="dl-phase-content dl-phase-content--center">
        <div className="dl-empty-state">
          <span className="dl-empty-state__emoji">🎉</span>
          <p className="dl-empty-state__text">
            {lang === 'tr'
              ? 'Tüm sesleri öğrendin! Harikasın!'
              : 'You have learned all sounds! Amazing!'}
          </p>
          <button className="dl-btn dl-btn--primary" onClick={onComplete}>
            {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setFeedback('correct');
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcripts = Array.from(event.results[0]).map((r) =>
        r.transcript.trim().toLowerCase()
      );
      const target = sound.grapheme.toLowerCase();
      const ok = transcripts.some(
        (t) =>
          t === target ||
          t.startsWith(target) ||
          target.startsWith(t[0]) ||
          levenshtein(t.replace(/[^a-z]/g, ''), target) <= 1
      );
      if (ok) {
        SFX.correct();
        setFeedback('correct');
      } else {
        SFX.wrong();
        setAttempts((a) => a + 1);
        setFeedback('tryagain');
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setFeedback('tryagain');
      setAttempts((a) => a + 1);
    };
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="dl-phase-content">
      <div className="dl-phonics-card-new">
        <div className="dl-phonics-card-new__grapheme">{sound.grapheme}</div>
        <div className="dl-phonics-card-new__phoneme">[{sound.phoneme}]</div>
        <div className="dl-phonics-card-new__mouth">
          {lang === 'tr'
            ? `Ağzını açık tut ve "${sound.phoneme}" sesini çıkar`
            : `Open your mouth and make the "${sound.phoneme}" sound`}
        </div>
        <button
          className="dl-btn dl-btn--ghost dl-btn--small"
          onClick={() => speak(sound.grapheme).catch(() => {})}
        >
          <Volume2 size={16} />
          {lang === 'tr' ? 'Sesi Duy' : 'Hear Sound'}
        </button>
      </div>

      {(step === 'intro' || step === 'examples') && (
        <>
          <div className="dl-sound-examples">
            <p className="dl-instruction">
              {lang === 'tr'
                ? `"${sound.grapheme}" sesi olan kelimeler:`
                : `Words with the "${sound.grapheme}" sound:`}
            </p>
            <div className="dl-sound-words">
              {sound.exampleWords.map((w) => (
                <button
                  key={w}
                  className="dl-sound-word-chip"
                  onClick={() => speak(w).catch(() => {})}
                >
                  <Volume2 size={14} />
                  {w}
                </button>
              ))}
            </div>
          </div>

          <button
            className="dl-btn dl-btn--primary"
            onClick={() => setStep('try')}
          >
            {lang === 'tr' ? 'Şimdi Sen Dene!' : 'Now You Try!'} <ChevronRight size={20} />
          </button>
        </>
      )}

      {step === 'try' && (
        <div className="dl-speak-section">
          <p className="dl-instruction dl-instruction--big">
            {lang === 'tr'
              ? `"${sound.grapheme}" sesini söyle!`
              : `Say the "${sound.grapheme}" sound!`}
          </p>

          {feedback === 'correct' ? (
            <>
              <FeedbackBanner type="correct" message={lang === 'tr' ? 'Mükemmel telaffuz!' : 'Perfect pronunciation!'} />
              <button className="dl-btn dl-btn--primary" onClick={onComplete}>
                {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
              </button>
            </>
          ) : (
            <>
              {feedback === 'tryagain' && attempts < 3 && (
                <FeedbackBanner
                  type="tryagain"
                  message={
                    lang === 'tr'
                      ? `Doğru ses: [${sound.phoneme}]. Tekrar dene!`
                      : `Correct sound: [${sound.phoneme}]. Try again!`
                  }
                />
              )}
              {attempts >= 3 && (
                <>
                  <FeedbackBanner
                    type="info"
                    message={lang === 'tr' ? 'Bir daha dinle...' : 'Listen one more time...'}
                  />
                  <button className="dl-btn dl-btn--primary" onClick={onComplete} style={{ marginTop: 8 }}>
                    {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
                  </button>
                </>
              )}

              {attempts < 3 && (
                <button
                  className={`dl-mic-btn${listening ? ' dl-mic-btn--listening' : ''}`}
                  onClick={listening ? stopListening : startListening}
                  aria-label={listening ? (lang === 'tr' ? 'Durdur' : 'Stop') : (lang === 'tr' ? 'Söyle' : 'Speak')}
                >
                  {listening ? <MicOff size={28} /> : <Mic size={28} />}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Phase 3: NEW WORDS ───────────────────────────────────────────────────────

function PhaseNewWords({
  words,
  themeName,
  themeEmoji,
  lang,
  onComplete,
}: {
  words: KidsWord[];
  themeName: string;
  themeEmoji: string;
  lang: string;
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const word = words[index];

  // Bilingual theme name
  const themeGroup = THEMED_WORD_GROUPS.find((g) => g.name === themeName);
  const themeNameDisplay = lang === 'tr' && themeGroup ? themeGroup.nameTr : themeName;

  useEffect(() => {
    setAnimating(true);
    speak(word.word).catch(() => {});
    const t = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(t);
  }, [index, word.word]);

  const handleNext = () => {
    if (index < words.length - 1) {
      setIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="dl-phase-content">
      {/* Today's Theme — prominent display */}
      <div className="dl-today-theme">
        <span className="dl-today-theme__emoji">{themeEmoji}</span>
        <div className="dl-today-theme__labels">
          <span className="dl-today-theme__eyebrow">
            {lang === 'tr' ? 'Bugünün Konusu' : "Today's Theme"}
          </span>
          <span className="dl-today-theme__name">{themeNameDisplay}</span>
        </div>
      </div>

      <div className="dl-word-counter">
        {words.map((_, i) => (
          <div
            key={i}
            className={`dl-word-dot ${i === index ? 'dl-word-dot--active' : i < index ? 'dl-word-dot--done' : ''}`}
          />
        ))}
      </div>

      <div
        className={`dl-word-card dl-word-card--new ${animating ? 'dl-word-card--entering' : ''}`}
        role="button"
        tabIndex={0}
        onClick={() => speak(word.word).catch(() => {})}
        aria-label={`${word.word} — ${lang === 'tr' ? 'duymak için dokun' : 'tap to hear'}`}
      >
        <span className="dl-word-card__emoji">{word.emoji}</span>
        <span className="dl-word-card__word">{word.word.toUpperCase()}</span>
        <span className="dl-word-card__tr">{word.turkish}</span>
        <div className="dl-word-card__sentence">
          <span className="dl-word-card__sentence-en">{word.exampleSentence}</span>
          <span className="dl-word-card__sentence-tr">{word.exampleSentenceTr}</span>
        </div>
        <span className="dl-word-card__tap-hint">
          <Volume2 size={12} style={{ display: 'inline', marginRight: 4 }} />
          {lang === 'tr' ? 'Tekrar duymak için dokun' : 'Tap to hear again'}
        </span>
      </div>

      <div className="dl-nav">
        <button
          className="dl-btn dl-btn--ghost dl-btn--small"
          onClick={() => speak(word.exampleSentence ?? word.word).catch(() => {})}
        >
          <Volume2 size={16} />
          {lang === 'tr' ? 'Cümleyi Dinle' : 'Hear Sentence'}
        </button>
        <button className="dl-btn dl-btn--primary" onClick={handleNext}>
          {index < words.length - 1 ? (
            <>{lang === 'tr' ? 'İleri' : 'Next'} <ChevronRight size={20} /></>
          ) : (
            <>{lang === 'tr' ? 'Tamam!' : 'Done!'} <Check size={20} /></>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Phase 4: LISTEN & UNDERSTAND ────────────────────────────────────────────

interface ComprehensionQuestion {
  audio: string;
  audioTr: string;
  question: string;
  questionTr: string;
  choices: string[];
  answer: string;
}

function buildComprehensionQuestions(
  phrasePair: { english: string; turkish: string },
  words: KidsWord[],
): ComprehensionQuestion[] {
  const primary: ComprehensionQuestion = {
    audio: phrasePair.english,
    audioTr: phrasePair.turkish,
    question: 'What did you hear?',
    questionTr: 'Ne duydun?',
    choices: [
      phrasePair.english,
      ...words
        .slice(0, 2)
        .map((w) => w.exampleSentence ?? w.word)
        .filter((s) => s !== phrasePair.english),
    ]
      .slice(0, 3)
      .sort(() => Math.random() - 0.5),
    answer: phrasePair.english,
  };

  return [primary];
}

function PhaseListenUnderstand({
  phrasePair,
  words,
  lang,
  onComplete,
}: {
  phrasePair: { english: string; turkish: string };
  words: KidsWord[];
  lang: string;
  onComplete: (score: number) => void;
}) {
  const [questions] = useState(() => buildComprehensionQuestions(phrasePair, words));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[qIndex];

  useEffect(() => {
    const t = setTimeout(() => {
      speak(q.audio).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [q.audio]);

  const handleChoice = (choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    if (choice === q.answer) {
      SFX.correct();
      setScore((s) => s + 1);
    } else {
      SFX.wrong();
    }

    setTimeout(() => {
      if (qIndex >= questions.length - 1) {
        onComplete(score + (choice === q.answer ? 1 : 0) === questions.length ? 100 : 50);
      } else {
        setQIndex((i) => i + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 1400);
  };

  return (
    <div className="dl-phase-content">
      <p className="dl-instruction">
        {lang === 'tr'
          ? 'İngilizce cümleyi dinle ve cevaplaaa:'
          : 'Listen to the English sentence and answer:'}
      </p>

      <div className="dl-listen-card">
        <button
          className="dl-listen-play-btn"
          onClick={() => speak(q.audio).catch(() => {})}
          aria-label={lang === 'tr' ? 'Cümleyi çal' : 'Play sentence'}
        >
          <Volume2 size={32} />
          <span>{lang === 'tr' ? 'Dinle' : 'Listen'}</span>
        </button>
        <p className="dl-listen-card__audio-text">{q.audio}</p>
        <p className="dl-listen-card__tr">{q.audioTr}</p>
      </div>

      <p className="dl-question-prompt">{lang === 'tr' ? q.questionTr : q.question}</p>

      <div className="dl-choices">
        {q.choices.map((choice) => {
          let cls = 'dl-choice-btn';
          if (answered) {
            if (choice === q.answer) cls += ' dl-choice-btn--correct';
            else if (choice === selected) cls += ' dl-choice-btn--wrong';
            else cls += ' dl-choice-btn--disabled';
          }
          return (
            <button key={choice} className={cls} onClick={() => handleChoice(choice)}>
              {answered && choice === q.answer && <Check size={16} />}
              <span>{choice}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Phase 5: SPEAK & CORRECT ────────────────────────────────────────────────

type SpeakFeedback =
  | { type: 'correct'; message: string }
  | { type: 'wrong'; message: string; diff: string }
  | null;

function PhaseSpeakCorrect({
  words,
  lang,
  onComplete,
}: {
  words: KidsWord[];
  lang: string;
  onComplete: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<SpeakFeedback>(null);
  const [listening, setListening] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const word = words[index];

  useEffect(() => {
    setFeedback(null);
    setAttempts(0);
    speak(word.word).catch(() => {});
  }, [index, word.word]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setCorrectCount((c) => c + 1);
      setFeedback({ type: 'correct', message: lang === 'tr' ? 'Mükemmel telaffuz!' : 'Perfect pronunciation!' });
      return;
    }

    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 5;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const transcripts = Array.from(event.results[0]).map((r) =>
        r.transcript.trim().toLowerCase()
      );
      const expected = word.word.toLowerCase();
      const best = transcripts[0] ?? '';
      const isCorrect = transcripts.some(
        (t) =>
          t === expected ||
          t.includes(expected) ||
          expected.includes(t) ||
          levenshtein(t, expected) <= 1
      );

      if (isCorrect) {
        SFX.correct();
        setCorrectCount((c) => c + 1);
        setFeedback({
          type: 'correct',
          message: lang === 'tr' ? 'Mükemmel telaffuz!' : 'Perfect pronunciation!',
        });
      } else {
        SFX.wrong();
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        if (newAttempts >= 3) {
          setFeedback({
            type: 'wrong',
            message:
              lang === 'tr'
                ? `3 deneme bitti. Bir daha dinle...`
                : `3 attempts used. Listen one more time...`,
            diff: lang === 'tr'
              ? `Sen: "${best}" — Doğrusu: "${expected}"`
              : `You said: "${best}" — Correct: "${expected}"`,
          });
        } else {
          setFeedback({
            type: 'wrong',
            message:
              lang === 'tr'
                ? `Sen: "${best}" — Doğrusu: "${expected}". Tekrar dene!`
                : `You said: "${best}" — correct is "${expected}". Try again!`,
            diff:
              lang === 'tr'
                ? `Deneme: ${newAttempts}/3`
                : `Attempt: ${newAttempts}/3`,
          });
        }
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setAttempts((a) => {
        const n = a + 1;
        setFeedback({
          type: 'wrong',
          message: lang === 'tr' ? 'Ses algılanamadı. Tekrar dene!' : "Couldn't hear you. Try again!",
          diff: lang === 'tr' ? `Deneme: ${n}/3` : `Attempt: ${n}/3`,
        });
        return n;
      });
    };

    recognition.start();
  }, [word.word, lang, attempts]);

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const handleNext = useCallback(() => {
    if (index >= words.length - 1) {
      const pct = Math.round((correctCount / words.length) * 100);
      onComplete(pct);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, words.length, correctCount, onComplete]);

  const canProceed = feedback?.type === 'correct' || attempts >= 3;

  return (
    <div className="dl-phase-content">
      <div className="dl-word-counter">
        {words.map((_, i) => (
          <div
            key={i}
            className={`dl-word-dot ${i === index ? 'dl-word-dot--active' : i < index ? 'dl-word-dot--done' : ''}`}
          />
        ))}
      </div>

      <div className="dl-speak-card">
        <span className="dl-speak-card__emoji">{word.emoji}</span>
        <span className="dl-speak-card__word">{word.word.toUpperCase()}</span>
        <span className="dl-speak-card__tr">{word.turkish}</span>

        <button
          className="dl-btn dl-btn--ghost dl-btn--small"
          onClick={() => speak(word.word).catch(() => {})}
        >
          <Volume2 size={16} />
          {lang === 'tr' ? 'Doğru sesi duy' : 'Hear correct sound'}
        </button>
      </div>

      {feedback && (
        <div className={`dl-speak-feedback dl-speak-feedback--${feedback.type}`}>
          <p className="dl-speak-feedback__msg">{feedback.message}</p>
          {'diff' in feedback && (
            <p className="dl-speak-feedback__diff">{feedback.diff}</p>
          )}
        </div>
      )}

      <div className="dl-nav">
        {!canProceed && (
          <button
            className={`dl-mic-btn${listening ? ' dl-mic-btn--listening' : ''}`}
            onClick={listening ? stopListening : startListening}
            disabled={listening && false}
            aria-label={listening ? (lang === 'tr' ? 'Durdur' : 'Stop') : (lang === 'tr' ? 'Söyle' : 'Speak')}
          >
            {listening ? <MicOff size={28} /> : <Mic size={28} />}
          </button>
        )}

        {canProceed && (
          <button className="dl-btn dl-btn--primary" onClick={handleNext}>
            {index < words.length - 1 ? (
              <>{lang === 'tr' ? 'Sonraki kelime' : 'Next word'} <ChevronRight size={20} /></>
            ) : (
              <>{lang === 'tr' ? 'Bitir' : 'Finish'} <Check size={20} /></>
            )}
          </button>
        )}
      </div>

      {listening && (
        <p className="dl-listening-label">
          {lang === 'tr' ? 'Dinleniyor...' : 'Listening...'}
        </p>
      )}
    </div>
  );
}

// ─── Phase 6: READ & BLEND ────────────────────────────────────────────────────

function PhaseReadBlend({
  cvcWords,
  lang,
  onComplete,
}: {
  cvcWords: CVCWord[];
  lang: string;
  onComplete: () => void;
}) {
  const [wordIndex, setWordIndex] = useState(0);
  const [tappedLetters, setTappedLetters] = useState<Set<number>>(new Set());
  const [blended, setBlended] = useState(false);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'tryagain' | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const cvc = cvcWords[wordIndex];

  useEffect(() => {
    setTappedLetters(new Set());
    setBlended(false);
    setFeedback(null);
  }, [wordIndex]);

  const handleLetterTap = (i: number) => {
    setTappedLetters((prev) => new Set([...prev, i]));
    speak(cvc.letters[i]).catch(() => {});
  };

  const handleBlend = () => {
    setBlended(true);
    speak(cvc.word).catch(() => {});
  };

  const handleSpeak = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setFeedback('correct');
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcripts = Array.from(event.results[0]).map((r) =>
        r.transcript.trim().toLowerCase()
      );
      const ok = transcripts.some(
        (t) =>
          t === cvc.word ||
          t.includes(cvc.word) ||
          levenshtein(t, cvc.word) <= 1
      );
      if (ok) {
        SFX.correct();
        setFeedback('correct');
      } else {
        SFX.wrong();
        setFeedback('tryagain');
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setFeedback('tryagain');
    };
    recognition.start();
  };

  const handleNext = () => {
    if (wordIndex < cvcWords.length - 1) {
      setWordIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="dl-phase-content">
      <p className="dl-instruction">
        {lang === 'tr'
          ? 'Her harfe dokun, sesi duy, sonra kelimeyi söyle!'
          : 'Tap each letter to hear its sound, then say the whole word!'}
      </p>

      <div className="dl-word-counter">
        {cvcWords.map((_, i) => (
          <div
            key={i}
            className={`dl-word-dot ${i === wordIndex ? 'dl-word-dot--active' : i < wordIndex ? 'dl-word-dot--done' : ''}`}
          />
        ))}
      </div>

      <div className="dl-blend-card">
        <div className="dl-blend-letters">
          {cvc.letters.map((letter, i) => (
            <button
              key={i}
              className={`dl-blend-letter ${tappedLetters.has(i) ? 'dl-blend-letter--tapped' : ''}`}
              onClick={() => handleLetterTap(i)}
            >
              {letter}
            </button>
          ))}
        </div>

        <div className="dl-blend-arrow">→</div>

        <button
          className={`dl-blend-whole ${blended ? 'dl-blend-whole--active' : ''}`}
          onClick={handleBlend}
          disabled={tappedLetters.size < cvc.letters.length}
        >
          {cvc.word.toUpperCase()}
        </button>

        {blended && (
          <p className="dl-blend-instruction">
            {lang === 'tr' ? 'Şimdi bütün kelimeyi söyle!' : 'Now say the whole word!'}
          </p>
        )}
      </div>

      {blended && feedback === null && (
        <button
          className={`dl-mic-btn${listening ? ' dl-mic-btn--listening' : ''}`}
          onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : handleSpeak}
          aria-label={listening ? (lang === 'tr' ? 'Durdur' : 'Stop') : (lang === 'tr' ? 'Söyle' : 'Speak')}
        >
          {listening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>
      )}

      {feedback === 'correct' && (
        <>
          <FeedbackBanner type="correct" message={lang === 'tr' ? 'Harika okudun!' : 'Great reading!'} />
          <button className="dl-btn dl-btn--primary" onClick={handleNext}>
            {wordIndex < cvcWords.length - 1 ? (
              <>{lang === 'tr' ? 'Sonraki kelime' : 'Next word'} <ChevronRight size={20} /></>
            ) : (
              <>{lang === 'tr' ? 'Bitir' : 'Finish'} <Check size={20} /></>
            )}
          </button>
        </>
      )}

      {feedback === 'tryagain' && (
        <>
          <FeedbackBanner type="tryagain" message={lang === 'tr' ? 'Bir daha dene!' : 'Try again!'} />
          <div className="dl-nav">
            <button
              className="dl-btn dl-btn--ghost"
              onClick={() => { setFeedback(null); speak(cvc.word).catch(() => {}); }}
            >
              <RotateCcw size={16} />
              {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
            </button>
            <button className="dl-btn dl-btn--primary" onClick={handleNext}>
              {lang === 'tr' ? 'Geç' : 'Skip'} <ChevronRight size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Phase 7: MINI GRAMMAR ────────────────────────────────────────────────────

function PhaseMiniGrammar({
  pattern,
  lang,
  onComplete,
}: {
  pattern: GrammarPattern;
  lang: string;
  onComplete: () => void;
}) {
  const [step, setStep] = useState<'learn' | 'practice'>('learn');
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  // Split template around "___" for the enhanced dashed-box blank
  const templateParts = pattern.blankTemplate.split('___');
  const beforeBlank = templateParts[0] ?? '';
  const afterBlank = templateParts[1] ?? '';

  const handleChoice = (choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    if (choice === pattern.blankAnswer) {
      SFX.correct();
      setSlideIn(true);
    } else {
      SFX.wrong();
    }
    setTimeout(() => onComplete(), 1500);
  };

  if (step === 'learn') {
    return (
      <div className="dl-phase-content">
        <div className="dl-grammar-card">
          <div className="dl-grammar-card__pattern">{pattern.pattern}</div>
          <div className="dl-grammar-card__desc">{pattern.patternTr}</div>
          <div className="dl-grammar-examples">
            {pattern.examples.map((ex, i) => (
              <div key={i} className="dl-grammar-example">
                <button
                  className="dl-grammar-example__en"
                  onClick={() => speak(ex.sentence).catch(() => {})}
                >
                  <Volume2 size={14} />
                  {ex.sentence}
                </button>
                <span className="dl-grammar-example__tr">{ex.sentenceTr}</span>
              </div>
            ))}
          </div>
        </div>

        <button className="dl-btn dl-btn--primary" onClick={() => setStep('practice')}>
          {lang === 'tr' ? 'Şimdi Doldur!' : 'Fill the Blank!'} <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  return (
    <div className="dl-phase-content">
      <div className="dl-grammar-fill">
        {/* Enhanced fill-in-blank with amber dashed box */}
        <div className="dl-grammar-fill__sentence">
          <span className="dl-grammar-fill__part">{beforeBlank}</span>
          <span
            className={[
              'dl-grammar-fill__blank',
              answered && selected === pattern.blankAnswer ? 'dl-grammar-fill__blank--filled' : '',
              answered && selected !== pattern.blankAnswer ? 'dl-grammar-fill__blank--wrong-fill' : '',
            ].filter(Boolean).join(' ')}
          >
            {answered ? (
              <span className={slideIn ? 'dl-grammar-fill__answer-slide' : ''}>
                {pattern.blankAnswer}
              </span>
            ) : (
              <span className="dl-grammar-fill__blank-placeholder">___</span>
            )}
          </span>
          <span className="dl-grammar-fill__part">{afterBlank}</span>
        </div>
        <p className="dl-instruction">
          {lang === 'tr' ? 'Boşluğu doldur:' : 'Fill in the blank:'}
        </p>
      </div>

      <div className="dl-choices">
        {pattern.blankChoices.map((choice) => {
          let cls = 'dl-choice-btn';
          if (answered) {
            if (choice === pattern.blankAnswer) cls += ' dl-choice-btn--correct';
            else if (choice === selected) cls += ' dl-choice-btn--wrong';
            else cls += ' dl-choice-btn--disabled';
          }
          return (
            <button key={choice} className={cls} onClick={() => handleChoice(choice)}>
              {answered && choice === pattern.blankAnswer && <Check size={16} />}
              <span>{choice}</span>
            </button>
          );
        })}
      </div>

      {answered && selected !== pattern.blankAnswer && (
        <FeedbackBanner
          type="tryagain"
          message={
            lang === 'tr'
              ? `Doğrusu: "${pattern.blankAnswer}"`
              : `Correct answer: "${pattern.blankAnswer}"`
          }
        />
      )}
    </div>
  );
}

// ─── Phase 8: CHALLENGE ───────────────────────────────────────────────────────

interface ChallengeQuestion {
  type: 'vocab' | 'listening' | 'speaking';
  prompt: string;
  audioSrc?: string;
  choices?: string[];
  answer?: string;
  speakWord?: string;
}

function buildChallengeQuestions(plan: DailyLessonPlan, lang: string): ChallengeQuestion[] {
  const words = plan.newWords;
  const w0 = words[0];
  const w1 = words[Math.min(1, words.length - 1)];
  const w2 = words[Math.min(2, words.length - 1)];

  const vocabChoices = [w0.turkish, ...words.slice(1, 3).map((w) => w.turkish)]
    .slice(0, 3)
    .sort(() => Math.random() - 0.5);

  return [
    {
      type: 'vocab',
      prompt: lang === 'tr'
        ? `"${w0.word}" ne demek?`
        : `What does "${w0.word}" mean?`,
      choices: vocabChoices,
      answer: w0.turkish,
    },
    {
      type: 'listening',
      prompt: lang === 'tr'
        ? `Dinle: "${w1.exampleSentence}" — Bu ${w1.word} mu yoksa ${w2.word} mu?`
        : `Listen: "${w1.exampleSentence}" — Is this about ${w1.word} or ${w2.word}?`,
      audioSrc: w1.exampleSentence,
      choices: [w1.word, w2.word].sort(() => Math.random() - 0.5),
      answer: w1.word,
    },
    {
      type: 'speaking',
      prompt: lang === 'tr'
        ? `Şunu söyle: "${plan.grammarPattern?.examples[0]?.sentence ?? w0.word}"`
        : `Say: "${plan.grammarPattern?.examples[0]?.sentence ?? w0.word}"`,
      speakWord: (plan.grammarPattern?.examples[0]?.sentence ?? w0.word)
        .split(' ').slice(-1)[0].replace(/[^a-z]/gi, ''),
    },
  ];
}

function PhaseChallenge({
  plan,
  lang,
  onComplete,
}: {
  plan: DailyLessonPlan;
  lang: string;
  onComplete: (score: number) => void;
}) {
  const [questions] = useState(() => buildChallengeQuestions(plan, lang));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [listening, setListening] = useState(false);
  const [speakFeedback, setSpeakFeedback] = useState<'correct' | 'tryagain' | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const q = questions[qIndex];

  useEffect(() => {
    if (q.type === 'listening' && q.audioSrc) {
      setTimeout(() => speak(q.audioSrc!).catch(() => {}), 400);
    }
  }, [q]);

  const advance = (wasCorrect: boolean) => {
    const newScore = score + (wasCorrect ? 1 : 0);
    setTimeout(() => {
      if (qIndex >= questions.length - 1) {
        onComplete(Math.round((newScore / questions.length) * 100));
      } else {
        setQIndex((i) => i + 1);
        setSelected(null);
        setAnswered(false);
        setSpeakFeedback(null);
      }
    }, 1200);
    setScore(newScore);
  };

  const handleChoice = (choice: string) => {
    if (answered) return;
    setSelected(choice);
    setAnswered(true);
    const correct = choice === q.answer;
    if (correct) SFX.correct();
    else SFX.wrong();
    advance(correct);
  };

  const handleSpeak = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSpeakFeedback('correct');
      advance(true);
      return;
    }
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcripts = Array.from(event.results[0]).map((r) =>
        r.transcript.trim().toLowerCase()
      );
      const target = (q.speakWord ?? '').toLowerCase();
      const ok = transcripts.some(
        (t) => t.includes(target) || levenshtein(t, target) <= 2
      );
      if (ok) {
        SFX.correct();
        setSpeakFeedback('correct');
        advance(true);
      } else {
        SFX.wrong();
        setSpeakFeedback('tryagain');
        advance(false);
      }
    };
    recognition.onerror = () => {
      setListening(false);
      setSpeakFeedback('tryagain');
      advance(false);
    };
    recognition.start();
  };

  return (
    <div className="dl-phase-content">
      <div className="dl-challenge-progress">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`dl-challenge-dot ${i === qIndex ? 'dl-challenge-dot--active' : i < qIndex ? 'dl-challenge-dot--done' : ''}`}
          />
        ))}
      </div>

      <div className="dl-challenge-type">
        {q.type === 'vocab' && (lang === 'tr' ? 'Kelime' : 'Vocabulary')}
        {q.type === 'listening' && (lang === 'tr' ? 'Dinleme' : 'Listening')}
        {q.type === 'speaking' && (lang === 'tr' ? 'Konuşma' : 'Speaking')}
      </div>

      <div className="dl-challenge-card">
        <p className="dl-challenge-prompt">{q.prompt}</p>

        {q.type === 'listening' && q.audioSrc && (
          <button
            className="dl-listen-play-btn dl-listen-play-btn--small"
            onClick={() => speak(q.audioSrc!).catch(() => {})}
          >
            <Volume2 size={24} />
            {lang === 'tr' ? 'Tekrar Dinle' : 'Hear Again'}
          </button>
        )}
      </div>

      {(q.type === 'vocab' || q.type === 'listening') && q.choices && (
        <div className="dl-choices">
          {q.choices.map((choice) => {
            let cls = 'dl-choice-btn';
            if (answered) {
              if (choice === q.answer) cls += ' dl-choice-btn--correct';
              else if (choice === selected) cls += ' dl-choice-btn--wrong';
              else cls += ' dl-choice-btn--disabled';
            }
            return (
              <button key={choice} className={cls} onClick={() => handleChoice(choice)}>
                {answered && choice === q.answer && <Check size={16} />}
                <span>{choice}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'speaking' && (
        <div className="dl-speak-section">
          {speakFeedback === 'correct' && (
            <FeedbackBanner type="correct" message={lang === 'tr' ? 'Harika!' : 'Great!'} />
          )}
          {speakFeedback === 'tryagain' && (
            <FeedbackBanner type="tryagain" message={lang === 'tr' ? 'Duyamadım, geçiyoruz.' : "Couldn't hear you, moving on."} />
          )}
          {speakFeedback === null && (
            <button
              className={`dl-mic-btn${listening ? ' dl-mic-btn--listening' : ''}`}
              onClick={listening ? () => { recognitionRef.current?.stop(); setListening(false); } : handleSpeak}
              aria-label={listening ? (lang === 'tr' ? 'Durdur' : 'Stop') : (lang === 'tr' ? 'Söyle' : 'Speak')}
            >
              {listening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── End-of-Lesson Summary / Celebration Screen ───────────────────────────────

function CelebrationScreen({
  plan,
  score,
  xpEarned,
  lang,
  onDone,
}: {
  plan: DailyLessonPlan;
  score: number;
  xpEarned: number;
  lang: string;
  onDone: () => void;
}) {
  const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
  const title = score >= 80
    ? (lang === 'tr' ? 'Harika iş!' : 'Amazing work!')
    : score >= 50
    ? (lang === 'tr' ? 'Aferin!' : 'Well done!')
    : (lang === 'tr' ? 'Devam et!' : 'Keep going!');

  // Next theme preview
  const currentThemeIdx = THEMED_WORD_GROUPS.findIndex((g) => g.name === (plan.themeName ?? ''));
  const nextThemeGroup = THEMED_WORD_GROUPS[(currentThemeIdx < 0 ? 0 : currentThemeIdx + 1) % THEMED_WORD_GROUPS.length];

  // Phonics hint from first word
  const phoneticSound = plan.newWords[0]?.word.charAt(0).toUpperCase() ?? '?';

  useEffect(() => { SFX.celebration(); }, []);

  return (
    <div className="dl-celebration">
      <Confetti />

      <div className="dl-star-rating" aria-label={`${stars} ${lang === 'tr' ? 'üzerinden 3 yıldız' : 'out of 3 stars'}`}>
        {[1, 2, 3].map((s) => (
          <span
            key={s}
            className={`dl-star ${s <= stars ? 'dl-star--filled' : 'dl-star--empty'}`}
            style={{ animationDelay: `${(s - 1) * 0.15}s` }}
          >
            ★
          </span>
        ))}
      </div>

      <h1 className="dl-celebration__title">{title}</h1>
      <p className="dl-celebration__subtitle">
        {lang === 'tr' ? 'Bugünkü ders tamamlandı!' : "Today's lesson complete!"}
      </p>

      {/* XP earned badge */}
      <div className="dl-celebration__xp-badge">
        <span className="dl-celebration__xp-icon">⚡</span>
        <span className="dl-celebration__xp-value">+{xpEarned} XP</span>
      </div>

      {/* Stats */}
      <div className="dl-celebration__stats">
        <div className="dl-stat-card">
          <span className="dl-stat-card__value">{plan.newWords.length}</span>
          <span className="dl-stat-card__label">{lang === 'tr' ? 'Kelime' : 'Words'}</span>
        </div>
        <div className="dl-stat-card">
          <span className="dl-stat-card__value">{score}%</span>
          <span className="dl-stat-card__label">{lang === 'tr' ? 'Puan' : 'Score'}</span>
        </div>
      </div>

      {/* Words learned today */}
      <div className="dl-celebration__wordlist">
        <p className="dl-celebration__wordlist-label">
          {lang === 'tr' ? 'Bugün öğrendiklerin:' : 'You learned today:'}
        </p>
        <div className="dl-celebration__wordlist-grid">
          {plan.newWords.map((w) => (
            <button
              key={w.word}
              className="dl-celebration__word-chip"
              onClick={() => speak(w.word).catch(() => {})}
              aria-label={lang === 'tr' ? `${w.word} kelimesini duy` : `Hear ${w.word}`}
            >
              <span>{w.emoji}</span>
              <span>{w.word}</span>
              <span className="dl-celebration__word-chip__tr">{w.turkish}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grammar pattern + phonics summary */}
      <div className="dl-celebration__learned-summary">
        <div className="dl-celebration__summary-item">
          <span className="dl-celebration__summary-icon">📝</span>
          <div>
            <span className="dl-celebration__summary-label">
              {lang === 'tr' ? 'Gramer:' : 'Grammar:'}
            </span>
            <span className="dl-celebration__summary-value">{plan.grammarPattern?.pattern ?? '—'}</span>
          </div>
        </div>
        <div className="dl-celebration__summary-item">
          <span className="dl-celebration__summary-icon">🔤</span>
          <div>
            <span className="dl-celebration__summary-label">
              {lang === 'tr' ? 'Ses:' : 'Sound:'}
            </span>
            <span className="dl-celebration__summary-value">
              {lang === 'tr' ? `"${phoneticSound}" sesi` : `"${phoneticSound}" sound`}
            </span>
          </div>
        </div>
      </div>

      {/* Tomorrow's theme preview */}
      {nextThemeGroup && (
        <div className="dl-celebration__next-theme">
          <span className="dl-celebration__next-theme__label">
            {lang === 'tr' ? 'Yarın:' : "Tomorrow's theme:"}
          </span>
          <span className="dl-celebration__next-theme__content">
            {nextThemeGroup.emoji}{' '}
            {lang === 'tr' ? nextThemeGroup.nameTr : nextThemeGroup.name}!
          </span>
        </div>
      )}

      {/* Share with parents nudge */}
      <div className="dl-celebration__parent-share">
        <span>
          {lang === 'tr'
            ? 'Bugün ne öğrendiğini anne babana göster!'
            : 'Show mom & dad what you learned today!'}
        </span>
      </div>

      <button className="dl-btn dl-btn--primary" onClick={onDone} style={{ minWidth: 200 }}>
        {lang === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Dashboard'}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DailyLesson() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const { addXP, trackActivity, stats } = useGamification();
  const navigate = useNavigate();

  const userId = user?.uid || 'guest';
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const [plan] = useState<DailyLessonPlan>(() => getTodayLesson(userId));
  const [yesterdayWords] = useState<KidsWord[]>(() => getYesterdayWords(userId));
  const [todaySound] = useState(() => getTodayPhonicsSound(userId));
  const [cvcWords] = useState<CVCWord[]>(() => getTodayCVCWords());

  // Theme emoji for Phase 3
  const themeGroup = plan.themeName
    ? THEMED_WORD_GROUPS.find((g) => g.name === plan.themeName)
    : undefined;
  const themeEmoji = themeGroup?.emoji ?? '📖';

  // ── Progress persistence — resume from last incomplete phase on mount ──

  const [phase, setPhase] = useState<number>(() => {
    const saved = loadProgress(userId, today);
    if (saved && saved.phase >= 1 && saved.phase <= TOTAL_PHASES) return saved.phase;
    return 1;
  });

  const [celebrated, setCelebrated] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showSuccessFlash, setShowSuccessFlash] = useState(false);
  const [pendingPhase, setPendingPhase] = useState<number | null>(null);

  const savedScores = loadProgress(userId, today)?.scores ?? { 4: 0, 5: 0, 8: 0 };
  const scoresRef = useRef<Record<number, number>>(savedScores);

  // Persist progress whenever phase changes
  const persistProgress = useCallback((currentPhase: number, scores: Record<number, number>) => {
    const completed: number[] = [];
    for (let i = 1; i < currentPhase; i++) completed.push(i);
    saveProgress(userId, today, { completedPhases: completed, scores, phase: currentPhase });
  }, [userId, today]);

  // ── Phase complete handler ──

  const handlePhaseComplete = useCallback(
    (phaseNum: number, score = 100) => {
      scoresRef.current[phaseNum] = score;

      if (phaseNum === TOTAL_PHASES) {
        const avgScore = Math.round(
          (scoresRef.current[4] + scoresRef.current[5] + scoresRef.current[8]) / 3
        );
        completeDailyLesson(userId, plan, avgScore);
        const earned = 50 + Math.round((avgScore / 100) * 50);
        addXP(earned, 'daily_lesson_complete').catch(() => {});
        trackActivity('daily_lesson', { score: avgScore, words: plan.newWords.length }).catch(() => {});
        setXpEarned(earned);
        clearProgress(userId, today);
        setShowSuccessFlash(true);
        setPendingPhase(null);
        setTimeout(() => {
          setShowSuccessFlash(false);
          setCelebrated(true);
        }, 800);
      } else {
        const nextPhase = phaseNum + 1;
        persistProgress(nextPhase, scoresRef.current);
        setShowSuccessFlash(true);
        setPendingPhase(nextPhase);
      }
    },
    [userId, plan, today, addXP, trackActivity, persistProgress]
  );

  // When flash finishes, advance to next phase
  const handleFlashDone = useCallback(() => {
    setShowSuccessFlash(false);
    if (pendingPhase !== null) {
      setPhase(pendingPhase);
      setPendingPhase(null);
    }
  }, [pendingPhase]);

  // ── Keyboard shortcuts ──

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') navigate('/dashboard');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // ── Celebration ──

  if (celebrated) {
    const avgScore = Math.round(
      (scoresRef.current[4] + scoresRef.current[5] + scoresRef.current[8]) / 3
    );
    return (
      <div className="dl">
        <CelebrationScreen
          plan={plan}
          score={avgScore}
          xpEarned={xpEarned}
          lang={lang}
          onDone={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // ── Render ──

  return (
    <div className="dl">
      {/* Phase success flash overlay */}
      {showSuccessFlash && <PhaseSuccessFlash onDone={handleFlashDone} />}

      {/* Header */}
      <div className="dl-header">
        <button
          className="dl-header__close"
          onClick={() => navigate('/dashboard')}
          aria-label={lang === 'tr' ? 'Dersi kapat' : 'Close lesson'}
        >
          <X size={20} />
        </button>

        <LessonProgressBar phase={phase} total={TOTAL_PHASES} />

        <span className="dl-phase-label">{phase}/{TOTAL_PHASES}</span>
      </div>

      {/* Phase header */}
      <PhaseHeader phase={phase} lang={lang} />

      {/* Phase content */}
      <div className="dl-content">
        {phase === 1 && (
          <PhaseWarmup
            words={yesterdayWords}
            lang={lang}
            streakDays={stats.streakDays}
            onComplete={() => handlePhaseComplete(1)}
          />
        )}

        {phase === 2 && (
          <PhaseNewSounds
            sound={todaySound}
            lang={lang}
            onComplete={() => handlePhaseComplete(2)}
          />
        )}

        {phase === 3 && (
          <PhaseNewWords
            words={plan.newWords}
            themeName={plan.themeName ?? ''}
            themeEmoji={themeEmoji}
            lang={lang}
            onComplete={() => handlePhaseComplete(3)}
          />
        )}

        {phase === 4 && (
          <PhaseListenUnderstand
            phrasePair={plan.phrasePair ?? { english: 'I see a cat.', turkish: 'Bir kedi görüyorum.' }}
            words={plan.newWords}
            lang={lang}
            onComplete={(score) => handlePhaseComplete(4, score)}
          />
        )}

        {phase === 5 && (
          <PhaseSpeakCorrect
            words={plan.newWords.slice(0, 3)}
            lang={lang}
            onComplete={(score) => handlePhaseComplete(5, score)}
          />
        )}

        {phase === 6 && (
          <PhaseReadBlend
            cvcWords={cvcWords}
            lang={lang}
            onComplete={() => handlePhaseComplete(6)}
          />
        )}

        {phase === 7 && plan.grammarPattern && (
          <PhaseMiniGrammar
            pattern={plan.grammarPattern}
            lang={lang}
            onComplete={() => handlePhaseComplete(7)}
          />
        )}
        {phase === 7 && !plan.grammarPattern && (
          <div className="dl-phase-content dl-phase-content--center">
            <button className="dl-btn dl-btn--primary" onClick={() => handlePhaseComplete(7)}>
              {lang === 'tr' ? 'İleri' : 'Next'} <ChevronRight size={20} />
            </button>
          </div>
        )}

        {phase === 8 && (
          <PhaseChallenge
            plan={plan}
            lang={lang}
            onComplete={(score) => handlePhaseComplete(8, score)}
          />
        )}
      </div>
    </div>
  );
}
