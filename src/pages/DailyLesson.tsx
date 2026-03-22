/**
 * DAILY LESSON — Full-screen 6-phase structured learning flow
 * MinesMinis — 15-minute daily lesson for vocabulary acquisition
 *
 * Phase 1: LISTEN  — See & hear each word card (TTS auto-play)
 * Phase 2: SEE     — Word in context sentence
 * Phase 3: PLAY    — Word-match mini game
 * Phase 4: SPEAK   — Speech recognition pronunciation check
 * Phase 5: REVIEW  — Spaced-repetition multiple-choice quiz
 * Phase 5.5: STORY — Mini story using today's words (before celebration)
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

const PHASES_EN = [
  { id: 1, key: 'listen', emoji: '👂', title: 'New Words!',    subtitle: 'Tap a card to hear it again' },
  { id: 2, key: 'see',    emoji: '👀', title: 'Watch & Learn!', subtitle: 'See how each word is used' },
  { id: 3, key: 'play',   emoji: '🎮', title: "Let's Play!",    subtitle: 'Match words to their meanings' },
  { id: 4, key: 'speak',  emoji: '🎤', title: 'Say It!',        subtitle: 'Press the mic and say the word' },
  { id: 5, key: 'review', emoji: '🧠', title: 'Remember?',      subtitle: 'Test what you learned today' },
  { id: 6, key: 'story',  emoji: '📖', title: 'Mini Story!',    subtitle: 'See the words in a story' },
];

const PHASES_TR = [
  { id: 1, key: 'listen', emoji: '👂', title: 'Yeni Kelimeler!',    subtitle: 'Tekrar duymak için karta dokun' },
  { id: 2, key: 'see',    emoji: '👀', title: 'İzle ve Öğren!',     subtitle: 'Her kelimenin nasıl kullanıldığını gör' },
  { id: 3, key: 'play',   emoji: '🎮', title: 'Hadi Oynayalım!',    subtitle: 'Kelimeleri anlamlarıyla eşleştir' },
  { id: 4, key: 'speak',  emoji: '🎤', title: 'Söyle!',             subtitle: 'Mikrofona bas ve kelimeyi söyle' },
  { id: 5, key: 'review', emoji: '🧠', title: 'Hatırlıyor musun?',  subtitle: 'Bugün öğrendiklerini test et' },
  { id: 6, key: 'story',  emoji: '📖', title: 'Mini Hikaye!',       subtitle: 'Kelimeleri bir hikayede gör' },
];

const TOTAL_PHASES = PHASES_EN.length; // 6

const REVIEW_CHOICES = 3; // number of options per review question

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

function getSentence(word: KidsWord): { en: string; tr: string; highlight: string } {
  const lower = word.word.toLowerCase();
  if (EXAMPLE_SENTENCES[lower]) return EXAMPLE_SENTENCES[lower];
  const upper = word.word.toUpperCase();
  return {
    en: `I can see a ${upper}.`,
    tr: `Bir ${word.turkish} görüyorum.`,
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
          className="dl-btn dl-btn--secondary"
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

  // Build English and Turkish text by substituting word slots
  let enText = template.en;
  let trText = template.tr;
  words.forEach((w, i) => {
    enText = enText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.word);
    trText = trText.replace(new RegExp(`\\{${i}\\}`, 'g'), w.turkish);
  });

  const wordList = words.map((w) => w.word);

  // Split English text into sentences, then parse each into highlight parts
  const rawSentences = enText.split(/(?<=[.!?])\s+/).filter((s) => s.trim());
  const sentences: StorySentence[] = rawSentences.map((sentence) => {
    const parts: StoryPart[] = [];
    let remaining = sentence;

    // Greedy left-to-right match for word highlights
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
          // Find the earliest match
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

  // Load lesson plan once
  const [plan] = useState<DailyLessonPlan>(() => getTodayLesson(userId));

  // Phase state (1-6) + sub-step within phase
  const [phase, setPhase] = useState(1);
  const [listenIndex, setListenIndex] = useState(0);
  const [seeIndex, setSeeIndex] = useState(0);
  const [celebrated, setCelebrated] = useState(false);

  // Accumulated scores per phase
  const scoresRef = useRef<Record<number, number>>({ 3: 0, 4: 0, 5: 0 });

  // ── Navigation helpers ──────────────────────────────────────────────────────

  const advancePhase = useCallback(() => {
    setPhase((p) => Math.min(p + 1, TOTAL_PHASES));
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

  // Final completion — triggers after Story phase (phase 6) completes
  useEffect(() => {
    if (phase > TOTAL_PHASES && !celebrated) {
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

  const PHASES = lang === 'tr' ? PHASES_TR : PHASES_EN;
  const currentPhaseInfo = PHASES[Math.min(phase, TOTAL_PHASES) - 1];

  // ── Render ─────────────────────────────────────────────────────────────────

  if (phase > TOTAL_PHASES && celebrated) {
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

        <PhaseDots current={phase} total={TOTAL_PHASES} />

        <span className="dl-phase-label">{phase}/{TOTAL_PHASES}</span>
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
            onComplete={handlePhaseComplete(5)}
          />
        )}

        {/* ── Phase 6: STORY ── */}
        {phase === 6 && (
          <PhaseStory
            words={plan.newWords}
            lang={lang}
            onComplete={advancePhase}
          />
        )}
      </div>
    </div>
  );
}
