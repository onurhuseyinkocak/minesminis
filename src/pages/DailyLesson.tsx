/**
 * DAILY LESSON — Digital Montessori 6-phase learning flow
 * MinesMinis — Self-paced, self-correcting, multi-sensory vocabulary acquisition
 *
 * Montessori Principles Applied:
 * - Self-paced: Free phase navigation after Phase 1 unlocks
 * - Concrete before abstract: Hear → See → Read → Match → Speak → Review → Story
 * - Self-correcting: Wrong answers reveal correct one (no "Wrong!" label)
 * - Prepared environment: Clean, uncluttered, focused
 * - Repetition freedom: Every phase has a "repeat" option
 * - Sensorial: hear + see + touch + say on every interaction
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Mic, MicOff, Volume2, Check, RotateCcw } from 'lucide-react';

import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useGamification } from '../contexts/GamificationContext';
import { speak } from '../services/ttsService';
import { SFX } from '../data/soundLibrary';
import {
  getTodayLesson,
  completeDailyLesson,
  getTodayPhonicsSound,
  type DailyLessonPlan,
} from '../services/dailyLessonService';
import type { KidsWord } from '../data/wordsData';
import './DailyLesson.css';

// ─── Constants ────────────────────────────────────────────────────────────────

// Subtitles follow Montessori Three-Period Lesson naming:
// Period 1 (Listen): "This is..." — teacher names
// Period 2 (Play): "Show me..." — child identifies
// Period 3 (Speak): "What is this?" — child recalls

const PHASES_EN = [
  { id: 1, key: 'listen', title: 'New Words!',    subtitle: 'This is SAT. This is SIT. Tap to hear!', icon: '👂' },
  { id: 2, key: 'see',    title: 'Watch & Learn!', subtitle: 'See each word in a sentence', icon: '👀' },
  { id: 3, key: 'play',   title: "Let's Play!",    subtitle: 'Show me which one is SAT', icon: '🎮' },
  { id: 4, key: 'speak',  title: 'Say It!',        subtitle: 'What is this word? Say it!', icon: '🎤' },
  { id: 5, key: 'review', title: 'Remember?',      subtitle: 'Test what you learned', icon: '🧠' },
  { id: 6, key: 'story',  title: 'Mini Story!',    subtitle: 'See the words in a story', icon: '📖' },
];

const PHASES_TR = [
  { id: 1, key: 'listen', title: 'Yeni Kelimeler!',    subtitle: 'Bu SAT. Bu SIT. Duymak için dokun!', icon: '👂' },
  { id: 2, key: 'see',    title: 'İzle ve Öğren!',     subtitle: 'Her kelimeyi cümlede gör', icon: '👀' },
  { id: 3, key: 'play',   title: 'Hadi Oynayalım!',    subtitle: 'Hangisi SAT? Göster bana!', icon: '🎮' },
  { id: 4, key: 'speak',  title: 'Söyle!',             subtitle: 'Bu kelime ne? Söyle!', icon: '🎤' },
  { id: 5, key: 'review', title: 'Hatırlıyor musun?',  subtitle: 'Öğrendiklerini test et', icon: '🧠' },
  { id: 6, key: 'story',  title: 'Mini Hikaye!',       subtitle: 'Kelimeleri hikayede gör', icon: '📖' },
];

const TOTAL_PHASES = PHASES_EN.length; // 6

const REVIEW_CHOICES = 3;

// Simple example sentences for context. Keyed by word, fallback generated.
const EXAMPLE_SENTENCES: Record<string, { en: string; tr: string; highlight: string }> = {
  cat:    { en: 'The CAT sits on the mat.',           tr: 'KEDİ paspasın üzerinde oturuyor.',  highlight: 'CAT' },
  dog:    { en: 'The DOG runs in the park.',          tr: 'KÖPEK parkta koşuyor.',             highlight: 'DOG' },
  apple:  { en: 'I eat an APPLE every day.',          tr: 'Her gün bir ELMA yerim.',            highlight: 'APPLE' },
  milk:   { en: 'She drinks MILK at night.',          tr: 'Geceleri SÜT içiyor.',              highlight: 'MILK' },
  sun:    { en: 'The SUN is bright today.',           tr: 'Bugün GÜNEŞ parlak.',               highlight: 'SUN' },
  red:    { en: 'RED is a warm colour.',              tr: 'KIRMIZI sıcak bir renk.',           highlight: 'RED' },
  run:    { en: 'I love to RUN fast!',                tr: 'Hızlı KOŞMAYI seviyorum!',          highlight: 'RUN' },
  hat:    { en: 'Wear a HAT in the sun.',             tr: 'Güneşte ŞAPKA tak.',               highlight: 'HAT' },
  cup:    { en: 'Fill the CUP with tea.',             tr: 'FİNCANı çayla doldur.',             highlight: 'CUP' },
  map:    { en: 'Look at the MAP.',                   tr: 'Haritaya bak.',                     highlight: 'MAP' },
  sat:    { en: 'The boy SAT on the chair.',          tr: 'Çocuk sandalyeye OTURDU.',          highlight: 'SAT' },
  sit:    { en: 'Please SIT down here.',              tr: 'Lütfen buraya OTUR.',               highlight: 'SIT' },
  sip:    { en: 'She took a small SIP of water.',     tr: 'Küçük bir YUDUM su aldı.',          highlight: 'SIP' },
  tip:    { en: 'Be careful not to TIP over!',        tr: 'Devrilmemeye dikkat et!',           highlight: 'TIP' },
  tap:    { en: 'TAP the screen to start.',           tr: 'Başlamak için ekrana DOKUN.',       highlight: 'TAP' },
  pin:    { en: 'Put the PIN on the board.',          tr: 'İğneyi tahtaya TAK.',               highlight: 'PIN' },
  pan:    { en: 'Cook in the PAN.',                   tr: 'Tavada pişir.',                     highlight: 'PAN' },
  tin:    { en: 'Open the TIN can.',                  tr: 'Teneke kutuyu aç.',                 highlight: 'TIN' },
  net:    { en: 'Catch with a NET.',                  tr: 'Ağ ile yakala.',                    highlight: 'NET' },
  pen:    { en: 'Write with a PEN.',                  tr: 'Kalem ile yaz.',                    highlight: 'PEN' },
  mat:    { en: 'Wipe your feet on the MAT.',         tr: 'Ayaklarını paspasta sil.',          highlight: 'MAT' },
};

const VERB_SUFFIXES = ['ed', 'ing', 'run', 'sit', 'sat', 'sip', 'tap', 'tip', 'hop', 'cut', 'let', 'put'];

function looksLikeVerb(w: string): boolean {
  const lower = w.toLowerCase();
  return VERB_SUFFIXES.includes(lower) || lower.endsWith('ed') || lower.endsWith('ing');
}

function getSentence(word: KidsWord): { en: string; tr: string; highlight: string } {
  const lower = word.word.toLowerCase();
  if (EXAMPLE_SENTENCES[lower]) return EXAMPLE_SENTENCES[lower];
  const upper = word.word.toUpperCase();
  if (looksLikeVerb(lower)) {
    return {
      en: `The boy can ${upper}.`,
      tr: `Çocuk ${word.turkish}.`,
      highlight: upper,
    };
  }
  return {
    en: `Look! A big ${upper}.`,
    tr: `Bak! Büyük bir ${word.turkish}.`,
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

function PhaseDots({
  current,
  total,
  completedPhases,
}: {
  current: number;
  total: number;
  completedPhases: Set<number>;
}) {
  return (
    <div className="dl-dots">
      {Array.from({ length: total }, (_, i) => {
        const phaseNum = i + 1;
        let cls = 'dl-dot';
        if (phaseNum === current) cls += ' dl-dot--active';
        else if (completedPhases.has(phaseNum)) cls += ' dl-dot--done';
        return <div key={i} className={cls} />;
      })}
    </div>
  );
}

// ─── Montessori Phase Nav Bar ─────────────────────────────────────────────────

type PhaseInfo = { id: number; key: string; title: string; subtitle: string; icon: string };

function MontessoriNav({
  phases,
  currentPhase,
  completedPhases,
  phaseProgress,
  wordCount,
  onSelectPhase,
}: {
  phases: PhaseInfo[];
  currentPhase: number;
  completedPhases: Set<number>;
  phaseProgress: Record<number, number>;
  wordCount: number;
  onSelectPhase: (id: number) => void;
}) {
  const unlocked = completedPhases.has(1);

  function getProgressLabel(phaseId: number): string | null {
    const p = phaseProgress[phaseId] ?? 0;
    if (completedPhases.has(phaseId)) {
      if (phaseId === 5) return `${p}%`;
      return 'Done';
    }
    if (phaseId === 1 || phaseId === 2 || phaseId === 4) {
      if (p === 0) return null;
      return `${Math.min(p, wordCount)}/${wordCount}`;
    }
    return null;
  }

  return (
    <div className="dl-montessori-nav" role="navigation" aria-label="Lesson phases">
      {phases.map((p) => {
        const isActive = currentPhase === p.id;
        const isDone = completedPhases.has(p.id);
        const isLocked = p.id !== 1 && !unlocked;
        const progressLabel = getProgressLabel(p.id);

        let cls = 'dl-phase-btn';
        if (isActive) cls += ' dl-phase-btn--active';
        if (isDone) cls += ' dl-phase-btn--done';
        if (isLocked) cls += ' dl-phase-btn--locked';

        return (
          <button
            key={p.id}
            className={cls}
            onClick={() => !isLocked && onSelectPhase(p.id)}
            disabled={isLocked}
            aria-label={`${p.title}${isDone ? ' (completed)' : ''}${isLocked ? ' (locked)' : ''}`}
            aria-current={isActive ? 'step' : undefined}
          >
            <span className="dl-phase-btn__icon">{p.icon}</span>
            <span className="dl-phase-btn__label">{p.title}</span>
            {progressLabel && (
              <span className="dl-phase-btn__progress">{progressLabel}</span>
            )}
            {isDone && <Check size={12} className="dl-phase-btn__check" />}
            {isLocked && <span className="dl-phase-btn__lock">🔒</span>}
          </button>
        );
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
    <div className={`dl-feedback${sad ? ' dl-feedback--reveal' : ''}`}>
      {message}
    </div>
  );
}

// ─── Phase 1: LISTEN ──────────────────────────────────────────────────────────

function PhaseListenStep({
  word,
  index,
  total,
  lang,
  onNext,
}: {
  word: KidsWord;
  index: number;
  total: number;
  lang: string;
  onNext: () => void;
}) {
  const [entering, setEntering] = useState(true);

  useEffect(() => {
    setEntering(true);
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
          {lang === 'tr' ? 'Tekrar duymak için dokun' : 'Tap to hear again'}
        </span>
      </div>

      <div className="dl-nav">
        <button className="dl-btn dl-btn--primary" onClick={onNext}>
          {index < total - 1 ? (
            <>{lang === 'tr' ? 'İleri' : 'Next'} <ChevronRight size={20} /></>
          ) : (
            <>{lang === 'tr' ? 'Tamam' : 'Done'} <Check size={20} /></>
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
  lang,
  onNext,
  onPrev,
}: {
  word: KidsWord;
  index: number;
  total: number;
  lang: string;
  onNext: () => void;
  onPrev: () => void;
}) {
  const sentence = getSentence(word);

  const parts = sentence.en.split(sentence.highlight);

  const handleReadAgain = useCallback(() => {
    speak(sentence.en).catch(() => {});
  }, [sentence.en]);

  // Auto-play sentence TTS when card loads
  useEffect(() => {
    speak(sentence.en).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word.word]);

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

        {/* Montessori: Read Again button for repetition freedom */}
        <button
          className="dl-btn dl-btn--ghost"
          onClick={handleReadAgain}
          style={{ minHeight: 40, fontSize: 14 }}
        >
          <Volume2 size={16} />
          {lang === 'tr' ? 'Tekrar Dinle' : 'Read Again'}
        </button>
      </div>

      <div className="dl-nav">
        {index > 0 && (
          <button className="dl-btn dl-btn--secondary" onClick={onPrev}>
            <ChevronLeft size={20} />
          </button>
        )}
        <button className="dl-btn dl-btn--primary" onClick={onNext}>
          {index < total - 1 ? (
            <>{lang === 'tr' ? 'İleri' : 'Next'} <ChevronRight size={20} /></>
          ) : (
            <>{lang === 'tr' ? 'Tamam' : 'Done'} <Check size={20} /></>
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
  lang,
  onComplete,
}: {
  words: KidsWord[];
  lang: string;
  onComplete: (score: number) => void;
}) {
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
    for (let i = turkish.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [turkish[i], turkish[j]] = [turkish[j], turkish[i]];
    }
    return [...english, ...turkish];
  }, [words]);

  const [tiles, setTiles] = useState<MatchItem[]>(buildTiles);
  const [selectedEn, setSelectedEn] = useState<MatchItem | null>(null);
  const [selectedTr, setSelectedTr] = useState<MatchItem | null>(null);
  const [revealCorrect, setRevealCorrect] = useState<string | null>(null); // id of the correct tile to briefly highlight
  const [matchedCount, setMatchedCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);
  const [allDone, setAllDone] = useState(false);

  const showFeedbackMsg = (msg: string, sad?: boolean) => {
    setShowFeedback({ msg, sad });
    setTimeout(() => setShowFeedback(null), 1400);
  };

  // Montessori: tap English tile → play TTS
  const handleTile = (tile: MatchItem) => {
    if (tile.matched) return;
    if (tile.type === 'english') {
      speak(tile.text.toLowerCase()).catch(() => {});
      setSelectedEn((prev) => (prev?.id === tile.id ? null : tile));
    } else {
      setSelectedTr((prev) => (prev?.id === tile.id ? null : tile));
    }
  };

  useEffect(() => {
    if (!selectedEn || !selectedTr) return;
    const isMatch = selectedEn.wordIndex === selectedTr.wordIndex;

    if (isMatch) {
      SFX.correct();
      setTiles((prev) =>
        prev.map((t) =>
          t.id === selectedEn.id || t.id === selectedTr.id
            ? { ...t, matched: true }
            : t
        )
      );
      setMatchedCount((c) => c + 1);
      showFeedbackMsg(lang === 'tr' ? 'Harika eşleşme! ✨' : 'Great match! ✨');  // i18n: Great match!
    } else {
      // Montessori self-correcting: show the correct Turkish tile gently
      SFX.wrong();
      // Find the correct Turkish tile for the selected English word
      const correctTrId = `tr-${selectedEn.wordIndex}`;
      setRevealCorrect(correctTrId);
      showFeedbackMsg(
        lang === 'tr' ? 'Neredeyse! İşte doğrusu:' : 'Almost! Here it is:',
        true
      );
      setTimeout(() => setRevealCorrect(null), 1200);
    }

    setTimeout(() => {
      setSelectedEn(null);
      setSelectedTr(null);
    }, 300);
  }, [selectedEn, selectedTr, lang]);

  useEffect(() => {
    if (matchedCount === words.length) {
      setTimeout(() => setAllDone(true), 600);
    }
  }, [matchedCount, words.length]);

  const handlePlayAgain = useCallback(() => {
    setTiles(buildTiles());
    setSelectedEn(null);
    setSelectedTr(null);
    setRevealCorrect(null);
    setMatchedCount(0);
    setAllDone(false);
    setShowFeedback(null);
  }, [buildTiles]);

  const englishTiles = tiles.filter((t) => t.type === 'english');
  const turkishTiles = tiles.filter((t) => t.type === 'turkish');

  if (allDone) {
    return (
      <div className="dl-phase-complete">
        <div className="dl-phase-complete__icon">🎉</div>
        <p className="dl-phase-complete__msg">
          {lang === 'tr' ? 'Tüm eşleşmeleri buldun!' : 'All matched!'}
        </p>
        <div className="dl-nav" style={{ flexDirection: 'column', gap: 10 }}>
          {/* Montessori: Play Again for repetition freedom */}
          <button className="dl-btn dl-btn--ghost" onClick={handlePlayAgain}>
            <RotateCcw size={18} />
            {lang === 'tr' ? 'Tekrar Oyna' : 'Play Again'}
          </button>
          <button className="dl-btn dl-btn--primary" onClick={() => onComplete(100)}>
            {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

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
              let cls = 'dl-match-tile';
              if (tile.matched) cls += ' dl-match-tile--correct';
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
              const isRevealed = revealCorrect === tile.id;
              let cls = 'dl-match-tile';
              if (tile.matched) cls += ' dl-match-tile--correct';
              else if (isRevealed) cls += ' dl-match-tile--reveal'; // Montessori gentle reveal
              else if (isSelected) cls += ' dl-match-tile--selected';
              return (
                <button key={tile.id} className={cls} onClick={() => handleTile(tile)}>
                  {tile.matched && <Check size={14} />}
                  {isRevealed && <span style={{ fontSize: 12 }}>✓</span>}
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

function PhaseSpeak({
  words,
  lang,
  onComplete,
}: {
  words: KidsWord[];
  lang: string;
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
      setFeedback({ msg: lang === 'tr' ? 'İyi deneme!' : 'Good try!', good: true });
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
        setFeedback({ msg: lang === 'tr' ? 'Mükemmel! 🌟' : 'Perfect! 🌟', good: true });
      } else {
        // Montessori: no "wrong" — gentle encouragement
        setFeedback({ msg: lang === 'tr' ? 'İyi deneme! 🎤' : 'Good try! 🎤', good: true });
      }
    };

    recognition.onerror = () => {
      setListening(false);
      setFeedback({ msg: lang === 'tr' ? 'İyi deneme!' : 'Good try!', good: true });
    };

    recognition.start();
  }, [currentWord.word, lang]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  // Montessori: Try Again — doesn't count as wrong, just resets feedback
  const handleTryAgain = useCallback(() => {
    setFeedback(null);
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
        {lang === 'tr' ? 'Bitti! Devam ediyoruz...' : 'Done! Moving on...'}
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
          className="dl-btn dl-btn--ghost"
          onClick={speakCurrent}
          style={{ minHeight: 44, padding: '0 20px', fontSize: 14 }}
        >
          <Volume2 size={16} /> {lang === 'tr' ? 'Dinle' : 'Hear it'}
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
            {lang === 'tr' ? 'Dinleniyor...' : 'Listening...'}
          </span>
        )}

        {feedback && (
          <span
            className={`dl-speak-feedback ${feedback.good ? 'dl-speak-feedback--good' : 'dl-speak-feedback--good'}`}
          >
            {feedback.msg}
          </span>
        )}

        {/* Montessori: Try Again without penalty */}
        {feedback && (
          <button
            className="dl-btn dl-btn--ghost"
            onClick={handleTryAgain}
            style={{ fontSize: 13, minHeight: 36 }}
          >
            <RotateCcw size={14} />
            {lang === 'tr' ? 'Tekrar Dene' : 'Try Again'}
          </button>
        )}
      </div>

      <div className="dl-nav">
        <button
          className="dl-btn dl-btn--primary"
          onClick={handleNext}
          disabled={listening}
        >
          {index < words.length - 1 ? (
            <>{lang === 'tr' ? 'Sonraki kelime' : 'Next word'} <ChevronRight size={20} /></>
          ) : (
            <>{lang === 'tr' ? 'Bitir' : 'Finish'} <Check size={20} /></>
          )}
        </button>
      </div>
    </>
  );
}

// ─── Phase 5: REVIEW ──────────────────────────────────────────────────────────

interface ReviewQuestion {
  prompt: string;
  promptWord: string;
  choices: string[];
  correct: string;
  questionType: 'en-to-tr' | 'tr-to-en';
}

function buildReviewQuestions(allWords: KidsWord[], lang: string): ReviewQuestion[] {
  return allWords.map((word, i) => {
    if (i % 2 === 0) {
      const correct = word.turkish;
      const distractors = allWords
        .filter((w) => w.turkish !== correct)
        .sort(() => Math.random() - 0.5)
        .slice(0, REVIEW_CHOICES - 1)
        .map((w) => w.turkish);
      return {
        prompt: lang === 'tr' ? 'Bu ne demek?' : 'What does this mean?',
        promptWord: word.word.toUpperCase(),
        choices: [...distractors, correct].sort(() => Math.random() - 0.5),
        correct,
        questionType: 'en-to-tr' as const,
      };
    } else {
      const correct = word.word.toUpperCase();
      const distractors = allWords
        .filter((w) => w.word !== word.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, REVIEW_CHOICES - 1)
        .map((w) => w.word.toUpperCase());
      return {
        prompt: lang === 'tr' ? 'Hangi İngilizce kelime şu anlama gelir:' : 'Which English word means:',
        promptWord: word.turkish,
        choices: [...distractors, correct].sort(() => Math.random() - 0.5),
        correct,
        questionType: 'tr-to-en' as const,
      };
    }
  });
}

function PhaseReview({
  newWords,
  reviewWords,
  lang,
  onComplete,
}: {
  newWords: KidsWord[];
  reviewWords: KidsWord[];
  lang: string;
  onComplete: (score: number) => void;
}) {
  const allWords = [...newWords, ...reviewWords].slice(0, 8);
  const [questions, setQuestions] = useState(() => buildReviewQuestions(allWords, lang));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [allReviewDone, setAllReviewDone] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState<{ msg: string; sad?: boolean } | null>(null);

  const q = questions[qIndex];

  const handleChoice = useCallback(
    (choice: string) => {
      if (answered) return;
      setSelected(choice);
      setAnswered(true);

      if (choice === q.correct) {
        SFX.correct();
        setScore((s) => s + 1);
        setShowFeedback({ msg: lang === 'tr' ? 'Doğru! ✨' : 'Correct! ✨' });
      } else {
        SFX.wrong();
        // Montessori: self-correcting — show correct answer, no "wrong" label
        setShowFeedback({
          msg: lang === 'tr'
            ? `Neredeyse! İşte doğrusu: "${q.correct}"`
            : `Almost! Here it is: "${q.correct}"`,
          sad: true,
        });
      }

      setTimeout(() => {
        setShowFeedback(null);
        if (qIndex >= questions.length - 1) {
          const pct = Math.round(((score + (choice === q.correct ? 1 : 0)) / questions.length) * 100);
          setFinalScore(pct);
          setAllReviewDone(true);
        } else {
          setQIndex((i) => i + 1);
          setSelected(null);
          setAnswered(false);
        }
      }, 1300);
    },
    [answered, q, qIndex, questions.length, score, lang]
  );

  const handlePracticeMore = useCallback(() => {
    setQuestions(buildReviewQuestions(allWords, lang));
    setQIndex(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAllReviewDone(false);
    setFinalScore(0);
  }, [allWords, lang]);

  if (allReviewDone) {
    return (
      <div className="dl-phase-complete">
        <div className="dl-phase-complete__icon">🧠</div>
        <p className="dl-phase-complete__msg">
          {lang === 'tr' ? `${finalScore}% doğru!` : `${finalScore}% correct!`}
        </p>
        <div className="dl-nav" style={{ flexDirection: 'column', gap: 10 }}>
          {/* Montessori: Practice More for repetition freedom */}
          <button className="dl-btn dl-btn--ghost" onClick={handlePracticeMore}>
            <RotateCcw size={18} />
            {lang === 'tr' ? 'Daha Fazla Pratik' : 'Practice More'}
          </button>
          <button className="dl-btn dl-btn--primary" onClick={() => onComplete(finalScore)}>
            {lang === 'tr' ? 'Devam Et' : 'Continue'} <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  const progress = Math.round((qIndex / questions.length) * 100);

  // Speak the prompt word in Review — phonics: hear the word, not just read it
  const handleHearPrompt = useCallback(() => {
    speak(q.promptWord).catch(() => {});
  }, [q.promptWord]);

  return (
    <>
      <div className="dl-progress-bar">
        <div className="dl-progress-bar__fill" style={{ width: `${progress}%` }} />
      </div>

      <p className="dl-review-question">
        {q.prompt}
      </p>

      {/* Prompt word with speaker button — Tekrar Dinle / Hear Again */}
      <div className="dl-review-prompt-row">
        <p className="dl-review-prompt-word">
          {q.promptWord}
        </p>
        {q.questionType === 'en-to-tr' && (
          <button
            className="dl-btn--icon"
            onClick={handleHearPrompt}
            aria-label={lang === 'tr' ? 'Tekrar Dinle' : 'Hear Again'}
            title={lang === 'tr' ? 'Tekrar Dinle' : 'Hear Again'}
          >
            <Volume2 size={20} />
          </button>
        )}
      </div>

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
            // Montessori: wrong choice → "reveal" class (not "wrong"), correct one shown green
            else if (choice === selected) cls += ' dl-choice-btn--reveal';
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

function StarRating({ score }: { score: number }) {
  const stars = score >= 80 ? 3 : score >= 50 ? 2 : 1;
  return (
    <div className="dl-star-rating" aria-label={`${stars} out of 3 stars`}>
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
  );
}

function CelebrationScreen({
  wordsLearned,
  score,
  wordList,
  onDone,
}: {
  wordsLearned: number;
  score: number;
  wordList: KidsWord[];
  onDone: () => void;
}) {
  const title = score >= 80 ? 'Amazing work!' : score >= 60 ? 'Well done!' : 'Great effort!';

  useEffect(() => {
    SFX.celebration();
  }, []);

  return (
    <div className="dl-celebration">
      <Confetti />

      <StarRating score={score} />

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

      {wordList.length > 0 && (
        <div className="dl-celebration__wordlist">
          <p className="dl-celebration__wordlist-label">You learned today:</p>
          <div className="dl-celebration__wordlist-grid">
            {wordList.map((w) => (
              <button
                key={w.word}
                className="dl-celebration__word-chip"
                onClick={() => speak(w.word).catch(() => {})}
                aria-label={`Hear ${w.word}`}
              >
                <span>{w.emoji}</span>
                <span>{w.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="dl-celebration__parent-share">
        <span>Show mom &amp; dad what you learned today!</span>
      </div>

      <button className="dl-btn dl-btn--primary" onClick={onDone} style={{ minWidth: 180 }}>
        Back to Dashboard
      </button>
    </div>
  );
}

// ─── Phase 5.5: STORY ─────────────────────────────────────────────────────────

interface StoryPart {
  text: string;
  isWord: boolean;
}

interface StorySentence {
  parts: StoryPart[];
}

interface MiniStory {
  sentences: StorySentence[];
  translation: string;
}

const STORY_TEMPLATES: Array<{ en: string; tr: string }> = [
  {
    en: 'In the morning, I see a {0}. The {1} is next to the {2}. I feel {3} because the {4} is beautiful!',
    tr: 'Sabahleyin bir {0} görüyorum. {1}, {2} yanında duruyor. {3} hissediyorum çünkü {4} çok güzel!',
  },
  {
    en: 'One day, {0} found a {1} near the {2}. The {3} was very happy. What a {4} adventure!',
    tr: 'Bir gün, {0} {2} yakınında bir {1} buldu. {3} çok mutluydu. Ne {4} bir macera!',
  },
  {
    en: 'The little {0} and the {1} went to find a {2}. They found a beautiful {3} and felt so {4}!',
    tr: 'Küçük {0} ve {1} bir {2} aramaya gitti. Güzel bir {3} buldular ve çok {4} hissettiler!',
  },
  {
    en: '{0} loves {1}. Every morning, {0} looks outside and sees a {2}. Today there is a {3} and everything is {4}!',
    tr: '{0} {1} sever. Her sabah {0} dışarı bakar ve bir {2} görür. Bugün bir {3} var ve her şey {4}!',
  },
  {
    en: 'Deep in the forest lived a {0}. The {0} had a friend called {1}. Together they searched for a {2}, a {3}, and a {4}.',
    tr: 'Ormanın derinliklerinde bir {0} yaşıyordu. {0}\'un {1} adında bir dostu vardı. Birlikte bir {2}, {3} ve {4} aradılar.',
  },
  {
    en: 'My favourite thing is {0}. I also like {1} very much. One sunny day I saw a {2}, a {3}, and a {4} all together!',
    tr: 'En sevdiğim şey {0}. {1}\'ı da çok seviyorum. Güneşli bir günde bir {2}, {3} ve {4}\'ü birlikte gördüm!',
  },
  {
    en: 'There was once a {0} who loved {1}. It lived near a big {2}. Every day it saw a {3} and felt {4}.',
    tr: 'Bir zamanlar {1}\'ı seven bir {0} varmış. Büyük bir {2}\'ın yanında yaşıyordu. Her gün bir {3} görür ve {4} hissederdi.',
  },
  {
    en: 'Look! A {0} is sitting on the {1}. Behind it you can see a {2}. The {3} is watching and feels {4}.',
    tr: 'Bak! Bir {0} {1}\'ın üstünde oturuyor. Arkasında bir {2} görünüyor. {3} izliyor ve {4} hissediyor.',
  },
  {
    en: 'The story begins with a {0} and a {1}. They walk past a {2} and meet a {3}. The end is {4}!',
    tr: 'Hikaye bir {0} ve {1} ile başlar. Bir {2}\'ın yanından geçerler ve bir {3} ile karşılaşırlar. Son {4}!',
  },
  {
    en: 'Imagine a world where {0} is magic. You find a {1} inside a {2}. A tiny {3} whispers something {4}.',
    tr: '{0}\'ın sihirli olduğu bir dünya hayal et. Bir {2} içinde {1} bulursun. Minik bir {3} sana {4} bir şey fısıldar.',
  },
  {
    en: 'On a rainy day, {0} stayed inside with {1}. They looked out the window and spotted a {2}. Then they saw a {3} and felt {4}.',
    tr: 'Yağmurlu bir günde {0}, {1} ile içeride kaldı. Pencereden baktılar ve bir {2} fark ettiler. Sonra bir {3} gördüler ve {4} hissettiler.',
  },
  {
    en: 'The brave {0} climbed to the top of a {1}. From there it could see a {2} and a {3}. The view was {4}!',
    tr: 'Cesur {0} bir {1}\'ın tepesine tırmandı. Oradan bir {2} ve {3} görebildi. Manzara {4} idi!',
  },
];

function generateMiniStory(words: KidsWord[]): MiniStory {
  const template = STORY_TEMPLATES[Math.floor(Math.random() * STORY_TEMPLATES.length)];

  let enText = template.en;
  let trText = template.tr;
  words.forEach((w, i) => {
    enText = enText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.word);
    trText = trText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.turkish);
  });

  const wordList = words.map((w) => w.word);

  const rawSentences = enText.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const sentences: StorySentence[] = rawSentences.map((sentence) => {
    const parts: StoryPart[] = [];
    let remaining = sentence;

    while (remaining.length > 0) {
      let matched = false;
      for (const w of wordList) {
        const idx = remaining.toLowerCase().indexOf(w.toLowerCase());
        if (idx === 0) {
          parts.push({ text: remaining.slice(0, w.length), isWord: true });
          remaining = remaining.slice(w.length);
          matched = true;
          break;
        } else if (idx > 0) {
          const earliestIdx = wordList.reduce<number>((best, ww) => {
            const i = remaining.toLowerCase().indexOf(ww.toLowerCase());
            return i !== -1 && i < best ? i : best;
          }, remaining.length);

          parts.push({ text: remaining.slice(0, earliestIdx), isWord: false });
          remaining = remaining.slice(earliestIdx);
          matched = true;
          break;
        }
      }
      if (!matched) {
        parts.push({ text: remaining, isWord: false });
        remaining = '';
      }
    }

    return { parts };
  });

  return { sentences, translation: trText };
}

function PhaseStory({
  words,
  lang,
  onComplete,
}: {
  words: KidsWord[];
  lang: string;
  onComplete: () => void;
}) {
  const [story] = useState<MiniStory>(() => generateMiniStory(words));

  return (
    <div className="dl-story">
      <div className="dl-story__text">
        {story.sentences.map((sentence, i) => (
          <p key={i} className="dl-story__sentence">
            {sentence.parts.map((part, j) =>
              part.isWord ? (
                <span
                  key={j}
                  className="dl-story__highlight"
                  onClick={() => speak(part.text).catch(() => {})}
                  role="button"
                  tabIndex={0}
                  aria-label={`Hear ${part.text}`}
                >
                  {part.text}
                </span>
              ) : (
                <span key={j}>{part.text}</span>
              )
            )}
          </p>
        ))}
      </div>

      <p className="dl-story__translation">{story.translation}</p>

      <div className="dl-nav">
        <button className="dl-btn dl-btn--primary" onClick={onComplete}>
          {lang === 'tr' ? 'Devam Et →' : 'Continue →'}
        </button>
      </div>
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
  const { t, lang } = useLanguage();
  const { addXP, trackActivity } = useGamification();
  const navigate = useNavigate();

  const userId = user?.uid || 'guest';

  const [plan] = useState<DailyLessonPlan>(() => getTodayLesson(userId));

  // Phonics: Sound of the Day
  const [todaySound] = useState(() => getTodayPhonicsSound(userId));

  // Current active phase
  const [phase, setPhase] = useState(1);

  // Montessori: track which phases have been completed at least once
  const [completedPhases, setCompletedPhases] = useState<Set<number>>(new Set());

  // Sub-step indices within phases
  const [listenIndex, setListenIndex] = useState(0);
  const [seeIndex, setSeeIndex] = useState(0);

  // Phase progress tracking (for MontessoriNav mini-progress display)
  // Keys: 1=listen cards seen, 2=see cards read, 3=play done, 4=speak done, 5=review score, 6=story done
  const [phaseProgress, setPhaseProgress] = useState<Record<number, number>>({
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0,
  });

  // Celebration state
  const [celebrated, setCelebrated] = useState(false);

  // Accumulated scores per phase
  const scoresRef = useRef<Record<number, number>>({ 3: 0, 4: 0, 5: 0 });

  const PHASES = lang === 'tr' ? PHASES_TR : PHASES_EN;

  // ── Montessori: mark a phase as completed ──────────────────────────────────

  const markPhaseComplete = useCallback((phaseId: number) => {
    setCompletedPhases((prev) => {
      const next = new Set(prev);
      next.add(phaseId);
      return next;
    });
  }, []);

  // ── Navigation: select a phase from nav bar ────────────────────────────────

  const handleSelectPhase = useCallback((phaseId: number) => {
    // Reset sub-indices when jumping to a phase
    if (phaseId === 1) setListenIndex(0);
    if (phaseId === 2) setSeeIndex(0);
    setPhase(phaseId);
  }, []);

  // ── Phase 1: LISTEN ────────────────────────────────────────────────────────

  const handleListenNext = useCallback(() => {
    const nextIndex = listenIndex + 1;
    setPhaseProgress((prev) => ({ ...prev, 1: nextIndex }));
    if (listenIndex < plan.newWords.length - 1) {
      setListenIndex(nextIndex);
    } else {
      // Phase 1 complete — unlock all other phases
      markPhaseComplete(1);
      setPhase(2); // natural progression by default
    }
  }, [listenIndex, plan.newWords.length, markPhaseComplete]);

  // ── Phase 2: SEE ───────────────────────────────────────────────────────────

  const handleSeeNext = useCallback(() => {
    const nextIndex = seeIndex + 1;
    setPhaseProgress((prev) => ({ ...prev, 2: nextIndex }));
    if (seeIndex < plan.newWords.length - 1) {
      setSeeIndex(nextIndex);
    } else {
      markPhaseComplete(2);
      setPhase(3);
    }
  }, [seeIndex, plan.newWords.length, markPhaseComplete]);

  const handleSeePrev = useCallback(() => {
    setSeeIndex((i) => Math.max(0, i - 1));
  }, []);

  // ── Phase 3/4/5 complete callbacks ────────────────────────────────────────

  const handlePhaseComplete = useCallback(
    (phaseNum: number) => (score: number) => {
      scoresRef.current[phaseNum] = score;
      markPhaseComplete(phaseNum);
      // Store score as progress (phases 3=100 done, 4=100 done, 5=score%)
      setPhaseProgress((prev) => ({ ...prev, [phaseNum]: score }));
      // Natural progression
      setPhase(phaseNum + 1);
    },
    [markPhaseComplete]
  );

  // ── Phase 6 (Story) complete ──────────────────────────────────────────────

  const handleStoryComplete = useCallback(() => {
    markPhaseComplete(6);
    setPhaseProgress((prev) => ({ ...prev, 6: 100 }));
  }, [markPhaseComplete]);

  // ── Check if ALL 6 phases done → celebration ──────────────────────────────

  useEffect(() => {
    if (completedPhases.size === TOTAL_PHASES && !celebrated) {
      setCelebrated(true);

      const avgScore = Math.round(
        (scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3
      );

      completeDailyLesson(userId, plan, avgScore);

      const xpEarned = 50 + Math.round((avgScore / 100) * 50);
      addXP(xpEarned, 'daily_lesson_complete').catch(() => {});
      trackActivity('daily_lesson', { score: avgScore, words: plan.newWords.length }).catch(() => {});
    }
  }, [completedPhases, celebrated, userId, plan, addXP, trackActivity]);

  const currentPhaseInfo = PHASES[Math.min(phase, TOTAL_PHASES) - 1];

  // ── Keyboard shortcuts ─────────────────────────────────────────────────────

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      switch (e.key) {
        case 'Escape':
          navigate('/dashboard');
          break;
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (phase === 1) handleListenNext();
          else if (phase === 2) handleSeeNext();
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (phase === 1) handleListenNext();
          else if (phase === 2) handleSeeNext();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (phase === 2) handleSeePrev();
          else if (phase === 1 && listenIndex > 0) setListenIndex((i) => i - 1);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, navigate, handleListenNext, handleSeeNext, handleSeePrev, listenIndex]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (celebrated) {
    const avgScore = Math.round(
      (scoresRef.current[3] + scoresRef.current[4] + scoresRef.current[5]) / 3
    );
    return (
      <div className="dl">
        <CelebrationScreen
          wordsLearned={plan.newWords.length}
          score={avgScore}
          wordList={plan.newWords}
          onDone={() => navigate('/dashboard')}
        />
      </div>
    );
  }

  // Suppress unused translation warning
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

        <PhaseDots current={phase} total={TOTAL_PHASES} completedPhases={completedPhases} />

        <span className="dl-phase-label">{phase}/{TOTAL_PHASES}</span>
      </div>

      {/* ── Montessori Nav Bar (appears after Phase 1 is done) ── */}
      <MontessoriNav
        phases={PHASES}
        currentPhase={phase}
        completedPhases={completedPhases}
        phaseProgress={phaseProgress}
        wordCount={plan.newWords.length}
        onSelectPhase={handleSelectPhase}
      />

      {/* ── Phase title ── */}
      <div className="dl-content">
        <div style={{ textAlign: 'center' }}>
          <p className="dl-phase-title">
            {currentPhaseInfo.title}
          </p>
          <p className="dl-phase-subtitle">{currentPhaseInfo.subtitle}</p>
        </div>

        {/* ── Phase 1: LISTEN ── */}
        {phase === 1 && listenIndex === 0 && todaySound && (
          <div className="dl-phonics-card">
            <div className="dl-phonics-card__sound">{todaySound.grapheme}</div>
            <div className="dl-phonics-card__phoneme">{todaySound.phoneme}</div>
            <div className="dl-phonics-card__keyword">{todaySound.emoji} {todaySound.keyword}</div>
            <button
              className="dl-btn dl-btn--ghost"
              onClick={() => speak(todaySound.grapheme).catch(() => {})}
              style={{ minHeight: 40, fontSize: 14 }}
            >
              <Volume2 size={16} />
              {lang === 'tr' ? 'Sesi duy' : 'Hear the sound'}
            </button>
          </div>
        )}

        {phase === 1 && (
          <PhaseListenStep
            word={plan.newWords[listenIndex]}
            index={listenIndex}
            total={plan.newWords.length}
            lang={lang}
            onNext={handleListenNext}
          />
        )}

        {/* ── Phase 2: SEE ── */}
        {phase === 2 && (
          <PhaseSeeStep
            word={plan.newWords[seeIndex]}
            index={seeIndex}
            total={plan.newWords.length}
            lang={lang}
            onNext={handleSeeNext}
            onPrev={handleSeePrev}
          />
        )}

        {/* ── Phase 3: PLAY ── */}
        {phase === 3 && (
          <PhasePlay
            words={plan.newWords}
            lang={lang}
            onComplete={handlePhaseComplete(3)}
          />
        )}

        {/* ── Phase 4: SPEAK ── */}
        {phase === 4 && (
          <PhaseSpeak
            words={plan.newWords.slice(0, 3)}
            lang={lang}
            onComplete={handlePhaseComplete(4)}
          />
        )}

        {/* ── Phase 5: REVIEW ── */}
        {phase === 5 && (
          <PhaseReview
            newWords={plan.newWords}
            reviewWords={plan.reviewWords}
            lang={lang}
            onComplete={handlePhaseComplete(5)}
          />
        )}

        {/* ── Phase 6: STORY ── */}
        {phase === 6 && (
          <PhaseStory
            words={plan.newWords}
            lang={lang}
            onComplete={handleStoryComplete}
          />
        )}
      </div>
    </div>
  );
}
