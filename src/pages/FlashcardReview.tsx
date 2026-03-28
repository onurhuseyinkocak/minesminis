import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  updateWordProgress,
  loadAllProgress,
  getConfidenceLevel,
  type WordProgress,
} from '../data/spacedRepetition';
import { kidsWords as fallbackWords } from '../data/wordsData';
import { supabase } from '../config/supabase';
import { FlashcardDeck, type Flashcard, type FlashcardResult, type StudyDirection } from '../components/FlashcardDeck';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import './FlashcardReview.css';

// ── Helpers ────────────────────────────────────────────────────────────────────

interface RawWord {
  word: string;
  turkish: string;
  example?: string | null;
  exampleSentence?: string | null;
  exampleSentenceTr?: string | null;
}

function wordToFlashcard(wordProgress: WordProgress, wordMap: Map<string, RawWord>): Flashcard | null {
  const raw = wordMap.get(wordProgress.wordId.toLowerCase());
  if (!raw) return null;

  return {
    id: wordProgress.wordId,
    front: raw.word,
    back: raw.turkish,
    example: raw.example ?? raw.exampleSentence ?? undefined,
    exampleTr: raw.exampleSentenceTr ?? undefined,
  };
}

// ── Back arrow SVG (avoids raw ← character) ────────────────────────────────────

function BackArrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}

// ── Session-complete icon (star checkmark, no emoji) ────────────────────────────

function CompleteIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

// ── No-cards icon (book with check) ────────────────────────────────────────────

function AllDoneIcon() {
  return (
    <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <polyline points="9 11 11 13 15 9" />
    </svg>
  );
}

// ── Component ──────────────────────────────────────────────────────────────────

export default function FlashcardReview() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  usePageTitle('Kelime Kartları', 'Flashcards');

  const [wordMap, setWordMap] = useState<Map<string, RawWord>>(() => {
    const m = new Map<string, RawWord>();
    for (const w of fallbackWords) {
      m.set(w.word.toLowerCase(), w);
    }
    return m;
  });

  const [dueWords, setDueWords] = useState<WordProgress[]>([]);
  const [sessionDone, setSessionDone] = useState(false);
  const [lastResults, setLastResults] = useState<FlashcardResult[]>([]);

  // Derived stats for the session: review-due vs new
  const [reviewCount, setReviewCount] = useState(0);
  const [newCount, setNewCount] = useState(0);

  // Study direction toggle (EN→TR default, can switch to TR→EN)
  const [direction, setDirection] = useState<StudyDirection>('en-tr');

  // Confirm modal state for reset-progress
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Load remote word list to enrich translations/examples
  useEffect(() => {
    supabase
      .from('words')
      .select('word,turkish,example,exampleSentence:example_sentence,exampleSentenceTr:example_sentence_tr')
      .then(({ data, error }) => {
        if (error) {
          // Silently fall back to local word data
          return;
        }
        if (data && data.length > 0) {
          const m = new Map<string, RawWord>();
          for (const w of data as RawWord[]) {
            if (w.word) m.set(w.word.toLowerCase(), w);
          }
          setWordMap(m);
        }
      });
  }, []);

  // Load due words on mount (and after a session reset).
  // Priority: review-due cards always come first; new cards fill the remaining slots.
  // Daily new-card limit: max 10 new cards per session to prevent overload.
  useEffect(() => {
    if (!sessionDone) {
      const MAX_REVIEWS = 20;
      const MAX_NEW = 10;

      const allProgress = loadAllProgress();
      const now = new Date();

      // Cards that are already in the SR system and due for review
      const reviewDue = allProgress
        .filter((p) => p.correctCount > 0 || p.incorrectCount > 0) // seen before
        .filter((p) => new Date(p.nextReview) <= now)
        .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
        .slice(0, MAX_REVIEWS);

      // Truly new cards (never seen — correctCount and incorrectCount both 0 AND nextReview <= now)
      const newDue = allProgress
        .filter((p) => p.correctCount === 0 && p.incorrectCount === 0)
        .filter((p) => new Date(p.nextReview) <= now)
        .slice(0, Math.max(0, MAX_NEW - reviewDue.length));

      // Combine: reviews first, then new cards
      const combined = [...reviewDue, ...newDue];

      setReviewCount(reviewDue.length);
      setNewCount(newDue.length);
      setDueWords(combined);
    }
  }, [sessionDone]);

  const flashcards = useMemo<Flashcard[]>(() => {
    const cards: Flashcard[] = [];
    for (const wp of dueWords) {
      const card = wordToFlashcard(wp, wordMap);
      if (card) cards.push(card);
    }
    return cards;
  }, [dueWords, wordMap]);

  // ── Handlers ──

  const handleCardResult = (cardId: string, knew: boolean) => {
    updateWordProgress(cardId, knew);
  };

  const handleComplete = (results: FlashcardResult[]) => {
    // onCardResult already persists each card as answered.
    // We do NOT re-write here — that would overwrite the per-card result
    // with the final deck state and could mark "retry" cards as correct.
    setLastResults(results);
    setSessionDone(true);
  };

  const handleRestart = () => {
    setSessionDone(false);
    setLastResults([]);
  };

  // ── Reset all progress handler ──

  const doResetProgress = useCallback(() => {
    // Clear the scoped localStorage key used by the SR engine
    try {
      const keysToDelete: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('mimi_spaced_repetition')) keysToDelete.push(k);
      }
      keysToDelete.forEach((k) => localStorage.removeItem(k));
    } catch {
      // ignore storage errors
    }

    setSessionDone(false);
    setLastResults([]);
    setReviewCount(0);
    setNewCount(0);
    setShowResetConfirm(false);
  }, []);

  const handleResetProgress = () => {
    setShowResetConfirm(true);
  };

  // ── Labels ──

  const title = lang === 'tr' ? 'Kelime Kartları' : 'Flashcard Review';
  const noCardsTitle = lang === 'tr' ? 'Hepsi tamam!' : 'All caught up!';
  const noCardsSub =
    lang === 'tr'
      ? 'Şu an tekrar edilecek kelime yok. Yeni kelimeler öğrenmeye devam et!'
      : 'No words due for review right now. Keep learning new words!';

  const knownCount = lastResults.filter((r) => r.knew).length;
  const totalCount = lastResults.length;

  // ── Summary screen (after session) ──

  if (sessionDone) {
    return (
      <div className="flashcard-review">
        <div className="flashcard-review__header">
          <button
            type="button"
            className="flashcard-review__back-btn"
            onClick={() => navigate('/words')}
            aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
          >
            <BackArrow />
          </button>
          <h1 className="flashcard-review__title">{title}</h1>
        </div>

        <div className="flashcard-review__body">
          <div className="flashcard-review__empty">
            <div className="flashcard-review__empty-icon flashcard-review__empty-icon--celebration" aria-hidden="true">
              <CompleteIcon />
            </div>
            <h2 className="flashcard-review__empty-title">
              {lang === 'tr' ? 'Oturum tamamlandı!' : 'Session complete!'}
            </h2>
            <p className="flashcard-review__empty-score">
              {totalCount > 0 ? Math.round((knownCount / totalCount) * 100) : 0}%
            </p>
            <p className="flashcard-review__empty-sub">
              {lang === 'tr'
                ? `${knownCount} / ${totalCount} kelimeyi bildin`
                : `You knew ${knownCount} out of ${totalCount} words`}
            </p>
            <button type="button" className="flashcard-review__empty-btn" onClick={handleRestart}>
              {lang === 'tr' ? 'Tekrar Başlat' : 'Start Again'}
            </button>
            <button
              type="button"
              className="flashcard-review__reset-btn"
              onClick={handleResetProgress}
            >
              {lang === 'tr' ? 'İlerlemeyi Sıfırla' : 'Reset Progress'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Empty: no due words ──

  if (flashcards.length === 0) {
    return (
      <div className="flashcard-review">
        <div className="flashcard-review__header">
          <button
            type="button"
            className="flashcard-review__back-btn"
            onClick={() => navigate('/words')}
            aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
          >
            <BackArrow />
          </button>
          <h1 className="flashcard-review__title">{title}</h1>
        </div>

        <div className="flashcard-review__body">
          <div className="flashcard-review__empty">
            <div className="flashcard-review__empty-icon" aria-hidden="true">
              <AllDoneIcon />
            </div>
            <h2 className="flashcard-review__empty-title">{noCardsTitle}</h2>
            <p className="flashcard-review__empty-sub">{noCardsSub}</p>
            <button
              type="button"
              className="flashcard-review__empty-btn"
              onClick={() => navigate('/words')}
            >
              {lang === 'tr' ? 'Kelimeler' : 'Browse Words'}
            </button>
            <button
              type="button"
              className="flashcard-review__reset-btn"
              onClick={handleResetProgress}
            >
              {lang === 'tr' ? 'İlerlemeyi Sıfırla' : 'Reset Progress'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Active session ──

  return (
    <div className="flashcard-review">
      <div className="flashcard-review__header">
        <button
          type="button"
          className="flashcard-review__back-btn"
          onClick={() => navigate('/words')}
          aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
        >
          <BackArrow />
        </button>
        <h1 className="flashcard-review__title">{title}</h1>
        {/* Progress pill: X / Y */}
        <span className="flashcard-review__progress-badge" aria-label={lang === 'tr' ? `${flashcards.length} kart` : `${flashcards.length} cards`}>
          {reviewCount + newCount > 0 ? `${reviewCount + newCount}` : flashcards.length}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', flexShrink: 0 }}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        </span>
        {/* Direction toggle: EN→TR / TR→EN */}
        <button
          type="button"
          className="flashcard-review__dir-btn"
          onClick={() => setDirection((d) => (d === 'en-tr' ? 'tr-en' : 'en-tr'))}
          title={lang === 'tr' ? 'Yön değiştir' : 'Toggle direction'}
          aria-label={direction === 'en-tr'
            ? (lang === 'tr' ? 'TR→EN yönüne geç' : 'Switch to TR→EN')
            : (lang === 'tr' ? 'EN→TR yönüne geç' : 'Switch to EN→TR')}
        >
          {direction === 'en-tr' ? 'EN→TR' : 'TR→EN'}
        </button>
      </div>

      <div className="flashcard-review__body">
        {/* Stats strip: shows review-due vs new breakdown */}
        <div className="flashcard-review__stats">
          <div className="flashcard-review__stat">
            <span className="flashcard-review__stat-value">{reviewCount}</span>
            <span className="flashcard-review__stat-label">
              {lang === 'tr' ? 'Tekrar' : 'Review'}
            </span>
          </div>
          <div className="flashcard-review__stat">
            <span className="flashcard-review__stat-value">{newCount}</span>
            <span className="flashcard-review__stat-label">
              {lang === 'tr' ? 'Yeni' : 'New'}
            </span>
          </div>
          <div className="flashcard-review__stat">
            <span className="flashcard-review__stat-value">
              {loadAllProgress().filter((p) => getConfidenceLevel(p.confidenceScore) === 'mastered').length}
            </span>
            <span className="flashcard-review__stat-label">
              {lang === 'tr' ? 'Öğrenildi' : 'Mastered'}
            </span>
          </div>
        </div>

        <FlashcardDeck
          cards={flashcards}
          onComplete={handleComplete}
          onCardResult={handleCardResult}
          direction={direction}
        />
      </div>

      <ConfirmModal
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={doResetProgress}
        title={lang === 'tr' ? 'İlerlemeyi Sıfırla' : 'Reset Progress'}
        message={
          lang === 'tr'
            ? 'Tüm flashcard ilerlemenizi sıfırlamak istediğinizden emin misiniz? Bu işlem geri alınamaz.'
            : 'Are you sure you want to reset all flashcard progress? This cannot be undone.'
        }
        confirmLabel={lang === 'tr' ? 'Evet, Sıfırla' : 'Yes, Reset'}
        variant="danger"
      />
    </div>
  );
}
