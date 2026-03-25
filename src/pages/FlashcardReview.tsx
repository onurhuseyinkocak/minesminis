import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getDueWords,
  updateWordProgress,
  type WordProgress,
} from '../data/spacedRepetition';
import { kidsWords as fallbackWords } from '../data/wordsData';
import { supabase } from '../config/supabase';
import { FlashcardDeck, type Flashcard, type FlashcardResult } from '../components/FlashcardDeck';
import { useLanguage } from '../contexts/LanguageContext';
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

// ── Component ──────────────────────────────────────────────────────────────────

export default function FlashcardReview() {
  const navigate = useNavigate();
  const { lang } = useLanguage();

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

  // Load remote word list to enrich translations/examples
  useEffect(() => {
    supabase
      .from('words')
      .select('word,turkish,example,exampleSentence:example_sentence,exampleSentenceTr:example_sentence_tr')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const m = new Map<string, RawWord>();
          for (const w of data as RawWord[]) {
            if (w.word) m.set(w.word.toLowerCase(), w);
          }
          setWordMap(m);
        }
      });
  }, []);

  // Load due words on mount (and after a session reset)
  useEffect(() => {
    if (!sessionDone) {
      setDueWords(getDueWords(20));
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
    // Persist any results that weren't already saved via onCardResult
    // (belt-and-suspenders: onCardResult fires per-card, this catches edge cases)
    for (const r of results) {
      updateWordProgress(r.cardId, r.knew);
    }
    setLastResults(results);
    setSessionDone(true);
  };

  const handleRestart = () => {
    setSessionDone(false);
    setLastResults([]);
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
            className="flashcard-review__back-btn"
            onClick={() => navigate('/words')}
            aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
          >
            ←
          </button>
          <h1 className="flashcard-review__title">{title}</h1>
        </div>

        <div className="flashcard-review__body">
          <div className="flashcard-review__empty">
            <div className="flashcard-review__empty-icon">
              {knownCount === totalCount ? '🏆' : '⭐'}
            </div>
            <h2 className="flashcard-review__empty-title">
              {lang === 'tr' ? 'Oturum tamamlandı!' : 'Session complete!'}
            </h2>
            <p className="flashcard-review__empty-sub">
              {lang === 'tr'
                ? `${knownCount} / ${totalCount} kelimeyi bildin`
                : `You knew ${knownCount} out of ${totalCount} words`}
            </p>
            <button className="flashcard-review__empty-btn" onClick={handleRestart}>
              {lang === 'tr' ? 'Tekrar Başlat' : 'Start Again'}
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
            className="flashcard-review__back-btn"
            onClick={() => navigate('/words')}
            aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
          >
            ←
          </button>
          <h1 className="flashcard-review__title">{title}</h1>
        </div>

        <div className="flashcard-review__body">
          <div className="flashcard-review__empty">
            <div className="flashcard-review__empty-icon">✅</div>
            <h2 className="flashcard-review__empty-title">{noCardsTitle}</h2>
            <p className="flashcard-review__empty-sub">{noCardsSub}</p>
            <button
              className="flashcard-review__empty-btn"
              onClick={() => navigate('/words')}
            >
              {lang === 'tr' ? 'Kelimeler' : 'Browse Words'}
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
          className="flashcard-review__back-btn"
          onClick={() => navigate('/words')}
          aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}
        >
          ←
        </button>
        <h1 className="flashcard-review__title">{title}</h1>
      </div>

      <div className="flashcard-review__body">
        {/* Stats strip */}
        <div className="flashcard-review__stats">
          <div className="flashcard-review__stat">
            <span className="flashcard-review__stat-value">{flashcards.length}</span>
            <span className="flashcard-review__stat-label">
              {lang === 'tr' ? 'Kart' : 'Cards'}
            </span>
          </div>
          <div className="flashcard-review__stat">
            <span className="flashcard-review__stat-value">
              {dueWords[0]?.correctCount ?? 0 > 0 ? dueWords[0].correctCount : '-'}
            </span>
            <span className="flashcard-review__stat-label">
              {lang === 'tr' ? 'Tekrar' : 'Retries'}
            </span>
          </div>
        </div>

        <FlashcardDeck
          cards={flashcards}
          onComplete={handleComplete}
          onCardResult={handleCardResult}
        />
      </div>
    </div>
  );
}
