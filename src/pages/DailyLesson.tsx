/**
 * DAILY LESSON — Full-screen 5-phase structured learning flow
 * MinesMinis — 15-minute daily lesson for vocabulary acquisition
 *
 * Phase 1: LISTEN  — See & hear each word card (TTS auto-play)
 * Phase 2: SEE     — Word in context sentence
 * Phase 3: PLAY    — Word-match mini game
 * Phase 4: SPEAK   — Speech recognition pronunciation check
 * Phase 5: REVIEW  — Spaced-repetition multiple-choice quiz
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Mic, MicOff, Volume2, Check } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { speak } from '../services/ttsService';
import {
  getTodayLesson,
  completeDailyLesson,
  type DailyLessonPlan,
} from '../services/dailyLessonService';
import type { KidsWord } from '../data/wordsData';
import './DailyLesson.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES = [
  { id: 1, key: 'listen', emoji: '👂', title: 'New Words!',    subtitle: 'Tap a card to hear it again' },
  { id: 2, key: 'see',    emoji: '👀', title: 'Watch & Learn!', subtitle: 'See how each word is used' },
  { id: 3, key: 'play',   emoji: '🎮', title: "Let's Play!",    subtitle: 'Match words to their meanings' },
  { id: 4, key: 'speak',  emoji: '🎤', title: 'Say It!',        subtitle: 'Press the mic and say the word' },
  { id: 5, key: 'review', emoji: '🧠', title: 'Remember?',      subtitle: 'Test what you learned today' },
];

const REVIEW_CHOICES = 3; // number of options per review question

// Simple example sentences for context. Keyed by word, fallback generated.
const EXAMPLE_SENTENCES: Record<string, { en: string; tr: string; highlight: string }> = {
  cat:    { en: 'The CAT sits on the mat.',    tr: 'KEDİ paspasın üzerinde oturuyor.', highlight: 'CAT' },
  dog:    { en: 'The DOG runs in the park.',   tr: 'KÖPEK parkta koşuyor.',            highlight: 'DOG' },
  apple:  { en: 'I eat an APPLE every day.',   tr: 'Her gün bir ELMA yerim.',           highlight: 'APPLE' },
  milk:   { en: 'She drinks MILK at night.',   tr: 'Geceleri SÜT içiyor.',             highlight: 'MILK' },
  sun:    { en: 'The SUN is very bright.',     tr: 'GÜNEŞ çok parlıyor.',              highlight: 'SUN' },
  red:    { en: 'RED is a warm colour.',       tr: 'KIRMIZI sıcak bir renk.',          highlight: 'RED' },
  run:    { en: 'I love to RUN outside.',      tr: 'Dışarıda KOŞMAYI seviyorum.',      highlight: 'RUN' },
  hat:    { en: 'She wears a big HAT.',        tr: 'Büyük bir ŞAPKA takıyor.',         highlight: 'HAT' },
  cup:    { en: 'Fill the CUP with tea.',      tr: 'FİNCANı çayla doldur.',            highlight: 'CUP' },
  map:    { en: 'Look at the MAP carefully.',  tr: 'HARİTAya dikkatle bak.',           highlight: 'MAP' },
};

function getSentence(word: KidsWord): { en: string; tr: string; highlight: string } {
  const lower = word.word.toLowerCase();
  if (EXAMPLE_SENTENCES[lower]) return EXAMPLE_SENTENCES[lower];
  const upper = word.word.toUpperCase();
  return {
    en: `This is a ${upper}.`,
    tr: `Bu bir ${word.turkish}.`,
    highlight: upper,
  };
}

// ─── Confetti ─────────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#f59e0b', '#22c55e', '#3b82f6', '#ec4899', '#8b5cf6'];

function ConfettiPiece({ delay, x, color }: { delay: number; x: number; color: string }) {
  return (
    <div
      className="dl-confetti__piece"
      style={{
        left: `${x}%`,
        backgroundColor: color,
        animationDuration: `${1.2 + Math.random() * 1.5}s`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

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
        <ConfettiPiece key={p.id} delay={p.delay} x={p.x} color={p.color} />
      ))}
    </div>
  );
}

// ─── Phase dot indicator ──────────────────────────────────────────────────────

function PhaseDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="dl-dots">
      {Array.from({ length: total }, (_, i) => {
        const phaseNum = i + 1;
        let cls = 'dl-dot';
        if (phaseNum === current) cls += ' dl-dot--active';
        else if (phaseNum < current) cls += ' dl-dot--done';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}

// ─── Card counter dots ────────────────────────────────────────────────────────

function CardDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="dl-counter">
      {Array.from({ length: total }, (_, i) => {
        let cls = 'dl-counter__dot';
        if (i < current) cls += ' dl-counter__dot--done';
        else if (i === current) cls += ' dl-counter__dot--current';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}

// ─── Feedback toast ────────────────────────────────────────────────────────────

function FeedbackToast({ message, sad }: { message: string; sad?: boolean }) {
  return (
    <div className={`dl-feedback${sad ? ' dl-feedback--sad' : ''}`}>
      {message}
    </div>
  );
}

// ─── Phase 1: LISTEN ──────────────────────────────────────────────────────────

function PhaseListenStep({
  word,
  index,
  total,
  onNext,
}: {
  word: KidsWord;
  index: number;
  total: number;
  onNext: () => void;
}) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    setEntering(true);
    // Auto-play TTS when card shows
    speak(word.word).catch(() => {});
    const t = setTimeout(() => setEntering(false), 400);
    return () => clearTimeout(t);
  }, [word.word]);

  const handleTap = useCallback(() => {
    speak(word.word).catch(() => {});
  }, [word.word]);

  return (
    <>
      <CardDots current={index} total={total} />

      <div
        className={`dl-card ${entering ? 'dl-card--entering' : ''}`}
        onClick={handleTap}
        role="button"
        tabIndex={0}
        aria-label={`${word.word} — tap to hear`}
      >
        <span className="dl-card__emoji">{word.emoji}</span>
        <span className="dl-card__word">{word.word.toUpperCase()}</span>
        <span className="dl-card__tr">{word.turkish}</span>
        <span className="dl-card__tap-hint">
          <Volume2 size={12} style={{ display: 'inline', marginRight: 4 }} />
          Tap to hear again
        </span>
      </div>

      <div className="dl-nav">
        <button className="dl-btn dl-btn--primary" onClick={onNext}>
          {index < total - 1 ? (
            <>Next <ChevronRight size={20} /></>
          ) : (
            <>Done <Check size={20} /></>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Phase 2: SEE ─────────────────────────────────────────────────────────────

function PhaseSeeStep({
  word,
  index,
  total,
  onNext,
  onPrev,
}: {
  word: KidsWord;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}) {
  const sentence = getSentence(word);

  // Split sentence to highlight the key word
  const parts = sentence.en.split(sentence.highlight);

  return (
    <>
      <CardDots current={index} total={total} />

      <div className="dl-sentence-card">
        <span className="dl-sentence-card__emoji">{word.emoji}</span>
        <p className="dl-sentence">
          {parts[0]}
          <span className="dl-sentence__highlight">{sentence.highlight}</span>
          {parts[1]}
        </p>
        <p className="dl-sentence__tr">{sentence.tr}</p>
      </div>

      <div className="dl-nav">
        {index > 0 && (
          <button className="dl-btn dl-btn--secondary" onClick={onPrev}>
            <ChevronLeft size={20} />
          </button>
        )}
        <button className="dl-btn dl-btn--primary" onClick={onNext}>
          {index < total - 1 ? (
            <>Next <ChevronRight size={20} /></>
          ) : (
            <>Done <Check size={20} /></>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Phase 3: PLAY (Word Match) ───────────────────────────────────────────────

interface MatchItem {
  id: string;
  text: string;
  type: 'english' | 'turkish';
  wordIndex: number;
  matched: boolean;
}

function PhasePlay({
  words,
  onComplete,
}: {
  words: KidsWord[];
  onComplete: (score: number) => void;
}) {
  // Build shuffled english + turkish tiles
  const buildTiles = useCallback((): MatchItem[] => {
    const english: MatchItem[] = words.map((w, i) => ({
      id: `en-${i}`,
      text: w.word.toUpperCase(),
      type: 'english',
      wordIndex: i,
      matched: false,
    }));
    const turkish: MatchItem[] = words.map((w, i) => ({
      id: `tr-${i}`,
      text: w.turkish,
      type: 'turkish',
      wordIndex: i,
      matched: false,
    }));
    // Shuffle turkish side
    for (let i = turkish.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [turkish[i], turkish[j]] = [turkish[j], turkish[i]];
    }
    return [...english, ...turkish];
  }, [words]);

  const [tiles, setTiles] = useState<MatchItem[]>(buildTiles);
  const [selectedEn, setSelectedEn] = useState<MatchItem | null>(null);
  const [selectedTr, setSelectedTr] = useState<MatchItem | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [matchedCount, setMatchedCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);

  const showFeedbackMsg = (msg: string, sad?: boolean) => {
    setShowFeedback({ msg, sad });
    setTimeout(() => setShowFeedback(null), 1200);
  };

  // Check match when both sides selected
  useEffect(() => {
    if (!selectedEn || !selectedTr) return;
    const isMatch = selectedEn.wordIndex === selectedTr.wordIndex;

    if (isMatch) {
      setTiles((prev) =>
        prev.map((t) =>
          t.id === selectedEn.id || t.id === selectedTr.id
            ? { ...t, matched: true }
            : t
        )
      );
      setMatchedCount((c) => c + 1);
      showFeedbackMsg('Great match! 🎉');
    } else {
      setWrongPair([selectedEn.id, selectedTr.id]);
      showFeedbackMsg('Try again! 💪', true);
      setTimeout(() => setWrongPair(null), 600);
    }

    setTimeout(() => {
      setSelectedEn(null);
      setSelectedTr(null);
    }, 300);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEn, selectedTr]);

  useEffect(() => {
    if (matchedCount === words.length) {
      setTimeout(() => onComplete(100), 800);
    }
  }, [matchedCount, words.length, onComplete]);

  const handleTile = (tile: MatchItem) => {
    if (tile.matched) return;
    if (tile.type === 'english') {
      setSelectedEn((prev) => (prev?.id === tile.id ? null : tile));
    } else {
      setSelectedTr((prev) => (prev?.id === tile.id ? null : tile));
    }
  };

  const englishTiles = tiles.filter((t) => t.type === 'english');
  const turkishTiles = tiles.filter((t) => t.type === 'turkish');

  return (
    <>
      <div className="dl-score-strip">
        <div className="dl-score-chip">
          <Check size={14} />
          {matchedCount}/{words.length}
        </div>
      </div>

      <div className="dl-game-section">
        <div className="dl-match-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {englishTiles.map((tile) => {
              const isSelected = selectedEn?.id === tile.id;
              const isWrong = wrongPair?.includes(tile.id);
              let cls = 'dl-match-tile';
              if (tile.matched) cls += ' dl-match-tile--correct';
              else if (isWrong) cls += ' dl-match-tile--wrong';
              else if (isSelected) cls += ' dl-match-tile--selected';
              return (
                <button key={tile.id} className={cls} onClick={() => handleTile(tile)}>
                  {tile.matched && <Check size={14} />}
                  {tile.text}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {turkishTiles.map((tile) => {
              const isSelected = selectedTr?.id === tile.id;
              const isWrong = wrongPair?.includes(tile.id);
              let cls = 'dl-match-tile';
              if (tile.matched) cls += ' dl-match-tile--correct';
              else if (isWrong) cls += ' dl-match-tile--wrong';
              else if (isSelected) cls += ' dl-match-tile--selected';
              return (
                <button key={tile.id} className={cls} onClick={() => handleTile(tile)}>
                  {tile.matched && <Check size={14} />}
                  {tile.text}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {showFeedback && <FeedbackToast message={showFeedback.msg} sad={showFeedback.sad} />}
    </>
  );
}

// ─── Phase 4: SPEAK ───────────────────────────────────────────────────────────

// SpeechRecognition type augmentation handled by existing global types

function PhaseSpeak({
  words,
  onComplete,
}: {
  words: KidsWord[];
  onComplete: (score: number) => void;
}) {
  const [index, setIndex] = useState(0);
  const [listening, setListening] = useState(false);
  const [feedback, setFeedback] = useState<{ msg: string; good: boolean } | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const currentWord = words[index];

  const speakCurrent = useCallback(() => {
    speak(currentWord.word).catch(() => {});
  }, [currentWord.word]);

  useEffect(() => {
    speakCurrent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startListening = useCallback(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setFeedback({ msg: 'Great effort! 👏', good: true });
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
      const expected = currentWord.word.toLowerCase();
      const isClose = transcripts.some(
        (t) =>
          t === expected ||
          t.includes(expected) ||
          expected.includes(t) ||
          levenshtein(t, expected) <= 1
      );

      if (isClose) {
        setCorrectCount((c) => c + 1);
        setFeedback({ msg: 'Perfect! 🌟', good: true });
      } else {
        setFeedback({ msg: 'Good try! 💪', good: false });
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setFeedback({ msg: 'Great effort! 👏', good: true });
    };

    recognition.start();
  }, [currentWord.word]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const handleNext = useCallback(() => {
    setFeedback(null);
    if (index >= words.length - 1) {
      setDone(true);
      const score = Math.round((correctCount / words.length) * 100);
      setTimeout(() => onComplete(score), 400);
    } else {
      setIndex((i) => i + 1);
    }
  }, [index, words.length, correctCount, onComplete]);

  if (done) {
    return (
      <div className="dl-phase-subtitle" style={{ marginTop: 40 }}>
        Done! Moving on...
      </div>
    );
  }

  return (
    <>
      <CardDots current={index} total={words.length} />

      <div className="dl-speak-card">
        <span className="dl-card__emoji">{currentWord.emoji}</span>
        <span className="dl-speak-word">{currentWord.word.toUpperCase()}</span>
        <span className="dl-card__tr">{currentWord.turkish}</span>

        <button
          className="dl-btn dl-btn--secondary"
          onClick={speakCurrent}
          style={{ minHeight: 44, padding: '0 20px', fontSize: 14 }}
        >
          <Volume2 size={16} /> Hear it
        </button>

        <button
          className={`dl-mic-btn${listening ? ' dl-mic-btn--listening' : ''}`}
          onClick={listening ? stopListening : startListening}
          aria-label={listening ? 'Stop listening' : 'Start speaking'}
        >
          {listening ? <MicOff size={28} /> : <Mic size={28} />}
        </button>

        {listening && (
          <span className="dl-phase-subtitle" style={{ fontSize: 13 }}>
            Listening...
          </span>
        )}

        {feedback && (
          <span
            className={`dl-speak-feedback ${feedback.good ? 'dl-speak-feedback--good' : 'dl-speak-feedback--meh'}`}
          >
            {feedback.msg}
          </span>
        )}
      </div>

      <div className="dl-nav">
        <button
          className="dl-btn dl-btn--primary"
          onClick={handleNext}
          disabled={listening}
        >
          {index < words.length - 1 ? (
            <>Next word <ChevronRight size={20} /></>
          ) : (
            <>Finish <Check size={20} /></>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Phase 5: REVIEW ──────────────────────────────────────────────────────────

interface ReviewQuestion {
  word: KidsWord;       // the word being tested
  choices: string[];    // translated choices (Turkish)
  correct: string;      // correct Turkish word
}

function buildReviewQuestions(allWords: KidsWord[]): ReviewQuestion[] {
  return allWords.map((word) => {
    const correct = word.turkish;
    const distractors = allWords
      .filter((w) => w.turkish !== correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, REVIEW_CHOICES - 1)
      .map((w) => w.turkish);
    const choices = [...distractors, correct].sort(() => Math.random() - 0.5);
    return { word, choices, correct };
  });
}

function PhaseReview({
  newWords,
  reviewWords,
  onComplete,
}: {
  newWords: KidsWord[];
  reviewWords: KidsWord[];
  onComplete: (score: number) => void;
}) {
  const allWords = [...newWords, ...reviewWords].slice(0, 8);
  const [questions] = useState(() => buildReviewQuestions(allWords));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);

  const q = questions[qIndex];

  const handleChoice = useCallback(
    (choice: string) => {
      if (answered) return;
      setSelected(choice);
      setAnswered(true);

      if (choice === q.correct) {
        setScore((s) => s + 1);
        setShowFeedback({ msg: 'Correct! 🎉' });
      } else {
        setShowFeedback({ msg: `It's "${q.correct}" 💙`, sad: true });
      }

      setTimeout(() => {
        setShowFeedback(null);
        if (qIndex >= questions.length - 1) {
          const pct = Math.round(((score + (choice === q.correct ? 1 : 0)) / questions.length) * 100);
          onComplete(pct);
        } else {
          setQIndex((i) => i + 1);
          setSelected(null);
          setAnswered(false);
        }
      }, 1100);
    },
    [answered, q, qIndex, questions.length, score, onComplete]
  );

  const progress = Math.round((qIndex / questions.length) * 100);

  return (
    <>
      <div className="dl-progress-bar">
        <div className="dl-progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="dl-review-question">
        Which one is &quot;{q.word.turkish}&quot;?
      </p>

      <div className="dl-score-strip">
        <div className="dl-score-chip">
          {qIndex + 1}/{questions.length}
        </div>
      </div>

      <div className="dl-review-choices">
        {q.choices.map((choice) => {
          let cls = 'dl-choice-btn';
          if (answered) {
            if (choice === q.correct) cls += ' dl-choice-btn--correct';
            else if (choice === selected) cls += ' dl-choice-btn--wrong';
            else cls += ' dl-choice-btn--disabled';
          }
          return (
            <button key={choice} className={cls} onClick={() => handleChoice(choice)}>
              {answered && choice === q.correct && <Check size={18} />}
              {choice}
            </button>
          );
        })}
      </div>

      {showFeedback && <FeedbackToast message={showFeedback.msg} sad={showFeedback.sad} />}
    </>
  );
}

// ─── Celebration screen ────────────────────────────────────────────────────────

function CelebrationScreen({
  wordsLearned,
  score,
  onDone,
}: {
  wordsLearned: number;
  score: number;
  onDone: () => void;
}) {
  const emoji = score >= 80 ? '🏆' : score >= 60 ? '⭐' : '🌟';
  const title = score >= 80 ? 'Amazing work!' : score >= 60 ? 'Well done!' : 'Great effort!';

  return (
    <div className="dl-celebration">
      <Confetti />
      <div className="dl-celebration__icon">{emoji}</div>
      <h1 className="dl-celebration__title">{title}</h1>
      <p className="dl-celebration__subtitle">Today&apos;s lesson complete!</p>

      <div className="dl-celebration__stats">
        <div className="dl-stat-card">
          <span className="dl-stat-card__value">{wordsLearned}</span>
          <span className="dl-stat-card__label">Words</span>
        </div>
        <div className="dl-stat-card">
          <span className="dl-stat-card__value">{score}%</span>
          <span className="dl-stat-card__label">Score</span>
        </div>
      </div>

      <button className="dl-btn dl-btn--primary" onClick={onDone} style={{ minWidth: 180 }}>
        Back to Dashboard
      </button>
    </div>
  );
}

// ─── Levenshtein distance helper ─────────────────────────────────────────────

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
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

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DailyLesson() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { addXP, trackActivity } = useGamification();
  const navigate = useNavigate();

  const userId = user?.uid || 'guest';

  // Load lesson plan once
  const [plan] = useState<DailyLessonPlan>(() => getTodayLesson(userId));

  // Phase state (1-5) + sub-step within phase
  const [phase, setPhase] = useState(1);
  const [listenIndex, setListenIndex] = useState(0);
  const [seeIndex, setSeeIndex] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  // Accumulated scores per phase
  const scoresRef = useRef<Record<number, number>>({ 3: 0, 4: 0, 5: 0 });

  // ── Navigation helpers ──────────────────────────────────────────────────────

  const advancePhase = useCallback(() => {
    setPhase((p) => Math.min(p + 1, 5));
  }, []);

  // Phase 1 next
  const handleListenNext = useCallback(() => {
    if (listenIndex < plan.newWords.length - 1) {
      setListenIndex((i) => i + 1);
    } else {
      advancePhase();
    }
  }, [listenIndex, plan.newWords.length, advancePhase]);

  // Phase 2 nav
  const handleSeeNext = useCallback(() => {
    if (seeIndex < plan.newWords.length - 1) {
      setSeeIndex((i) => i + 1);
    } else {
      advancePhase();
    }
  }, [seeIndex, plan.newWords.length, advancePhase]);

  const handleSeePrev = useCallback(() => {
    setSeeIndex((i) => Math.max(0, i - 1));
  }, []);

  // Phase 3/4/5 complete
  const handlePhaseComplete = useCallback(
    (phaseNum: number) => (score: number) => {
      scoresRef.current[phaseNum] = score;
      advancePhase();
    },
    [advancePhase]
  );

  // Final completion
  useEffect(() => {
    if (phase > 5 && !celebrated) {
      setCelebrated(true);

      const avgScore = Math.round(
        (scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3
      );

      completeDailyLesson(userId, plan, avgScore);

      // Award XP: base 50 + up to 50 bonus for score
      const xpEarned = 50 + Math.round((avgScore / 100) * 50);
      addXP(xpEarned, 'daily_lesson_complete').catch(() => {});
      trackActivity('daily_lesson', { score: avgScore, words: plan.newWords.length }).catch(() => {});
    }
  }, [phase, celebrated, userId, plan, addXP, trackActivity]);

  const currentPhaseInfo = PHASES[Math.min(phase, 5) - 1];

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase > 5 && celebrated) {
    const avgScore = Math.round(
      (scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3
    );
    return (
      <div className="dl">
        <CelebrationScreen
          wordsLearned={plan.newWords.length}
          score={avgScore}
          onDone={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // Suppress unused translation warning — kept for future use
  void t;

  return (
    <div className="dl">
      {/* ── Header ── */}
      <div className="dl-header">
        <button
          className="dl-header__close"
          onClick={() => navigate('/dashboard')}
          aria-label="Close lesson"
        >
          <X size={20} />
        </button>

        <PhaseDots current={phase} total={5} />

        <span className="dl-phase-label">{phase}/5</span>
      </div>

      {/* ── Phase title ── */}
      <div className="dl-content">
        <div style={{ textAlign: 'center' }}>
          <p className="dl-phase-title">
            {currentPhaseInfo.emoji} {currentPhaseInfo.title}
          </p>
          <p className="dl-phase-subtitle">{currentPhaseInfo.subtitle}</p>
        </div>

        {/* ── Phase 1: LISTEN ── */}
        {phase === 1 && (
          <PhaseListenStep
            word={plan.newWords[listenIndex]}
            index={listenIndex}
            total={plan.newWords.length}
            onNext={handleListenNext}
          />
        )}

        {/* ── Phase 2: SEE ── */}
        {phase === 2 && (
          <PhaseSeeStep
            word={plan.newWords[seeIndex]}
            index={seeIndex}
            total={plan.newWords.length}
            onNext={handleSeeNext}
            onPrev={handleSeePrev}
          />
        )}

        {/* ── Phase 3: PLAY ── */}
        {phase === 3 && (
          <PhasePlay
            words={plan.newWords}
            onComplete={handlePhaseComplete(3)}
          />
        )}

        {/* ── Phase 4: SPEAK ── */}
        {phase === 4 && (
          <PhaseSpeak
            words={plan.newWords.slice(0, 3)}
            onComplete={handlePhaseComplete(4)}
          />
        )}

        {/* ── Phase 5: REVIEW ── */}
        {phase === 5 && (
          <PhaseReview
            newWords={plan.newWords}
            reviewWords={plan.reviewWords}
            onComplete={handlePhaseComplete(5)}
          />
        )}
      </div>
    </div>
  );
}
