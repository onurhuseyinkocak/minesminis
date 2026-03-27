import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { WordIllustration } from '../components/WordIllustration';
import { SFX } from '../data/soundLibrary';
import { speak } from '../services/ttsService';
import { useLanguage } from '../contexts/LanguageContext';
import './FlashcardDeck.css';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface Flashcard {
  id: string;
  front: string;      // English word
  back: string;       // Turkish translation
  phonetic?: string;  // IPA
  example?: string;   // Example sentence in English
  exampleTr?: string; // Turkish translation of example
}

export interface FlashcardResult {
  cardId: string;
  knew: boolean;
}

/** Direction of study: EN→TR (show English, reveal Turkish) or TR→EN (show Turkish, reveal English). */
export type StudyDirection = 'en-tr' | 'tr-en';

export interface FlashcardDeckProps {
  cards: Flashcard[];
  onComplete: (results: FlashcardResult[]) => void;
  onCardResult?: (cardId: string, knew: boolean) => void;
  /** Default: 'en-tr' */
  direction?: StudyDirection;
}

// ── Constants ──────────────────────────────────────────────────────────────────

/** Maximum times a card can be re-queued before it's forced out */
const MAX_SEEN_COUNT = 3;

/** How many positions ahead to reinsert a "retry" card */
const RETRY_OFFSET = 3;

// ── Internal deck state ────────────────────────────────────────────────────────

interface DeckCard {
  card: Flashcard;
  seenCount: number;
}

function buildInitialDeck(cards: Flashcard[]): DeckCard[] {
  return cards.map((card) => ({ card, seenCount: 0 }));
}

// ── Component ──────────────────────────────────────────────────────────────────

export function FlashcardDeck({ cards, onComplete, onCardResult, direction = 'en-tr' }: FlashcardDeckProps) {
  const { lang } = useLanguage();

  // Working queue — mutated via state setter
  const [deck, setDeck] = useState<DeckCard[]>(() => buildInitialDeck(cards));
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState<FlashcardResult[]>([]);
  const [done, setDone] = useState(false);

  // Track which card we last auto-played TTS for (avoid replaying on re-render)
  const lastSpokenIdRef = useRef<string | null>(null);

  const total = cards.length;
  const current = deck[0] ?? null;

  // Progress: how many unique cards have been answered "Biliyorum"
  const knownCount = useMemo(
    () => results.filter((r) => r.knew).length,
    [results],
  );

  const answeredCount = useMemo(() => {
    const ids = new Set(results.map((r) => r.cardId));
    return ids.size;
  }, [results]);

  const progressPct = total > 0 ? Math.round((answeredCount / total) * 100) : 0;

  // ── Auto-play TTS when a new card appears on the front ──
  // For EN→TR mode: speak the English word.
  // For TR→EN mode: speak the Turkish word (browser TTS with tr-TR lang).
  useEffect(() => {
    if (!current || flipped || done) return;
    // Key on id + direction so a direction switch re-triggers speech
    const key = `${current.card.id}:${direction}`;
    if (lastSpokenIdRef.current === key) return;
    lastSpokenIdRef.current = key;
    if (direction === 'en-tr') {
      speak(current.card.front, { lang: 'en-US', rate: 0.8 });
    } else {
      speak(current.card.back, { lang: 'tr-TR', rate: 0.85 });
    }
  }, [current, flipped, done, direction]);

  // ── Flip ──

  const handleFlip = useCallback(() => {
    if (flipped) return;
    setFlipped(true);
    SFX.click();
  }, [flipped]);

  // ── Answer handlers ──

  const advance = useCallback(
    (knew: boolean) => {
      if (!current) return;
      const { card, seenCount } = current;

      onCardResult?.(card.id, knew);

      // Record result (latest answer wins for this card id)
      setResults((prev) => {
        const filtered = prev.filter((r) => r.cardId !== card.id);
        return [...filtered, { cardId: card.id, knew }];
      });

      setDeck((prev) => {
        const remaining = prev.slice(1); // drop current card from front

        if (!knew && seenCount + 1 < MAX_SEEN_COUNT) {
          // Reinsert at +RETRY_OFFSET position (or end if shorter)
          const insertAt = Math.min(RETRY_OFFSET, remaining.length);
          const requeued: DeckCard = { card, seenCount: seenCount + 1 };
          const updated = [
            ...remaining.slice(0, insertAt),
            requeued,
            ...remaining.slice(insertAt),
          ];
          return updated;
        }

        return remaining;
      });

      setFlipped(false);
    },
    [current, onCardResult],
  );

  const handleKnow = useCallback(() => {
    SFX.correct();
    advance(true);
  }, [advance]);

  const handleRetry = useCallback(() => {
    SFX.wrong();
    advance(false);
  }, [advance]);

  // Keyboard shortcuts: Space = flip, ArrowRight/ArrowLeft = know/retry
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (done || !current) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (!flipped) handleFlip();
      }
      if (flipped) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          handleKnow();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          handleRetry();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [done, current, flipped, handleFlip, handleKnow, handleRetry]);

  // ── Auto-detect completion when deck is exhausted ──
  useEffect(() => {
    if (deck.length === 0 && results.length > 0 && !done) {
      setDone(true);
    }
  }, [deck.length, results.length, done]);

  // ── Completion screen ──

  if (done) {
    const finalResults = results;
    const knownFinal = finalResults.filter((r) => r.knew).length;
    const pct = total > 0 ? Math.round((knownFinal / total) * 100) : 0;

    return (
      <div className="flashcard-complete">
        <div className="flashcard-complete__ratio">{pct}%</div>
        <div className="flashcard-complete__title">
          {lang === 'tr' ? 'Harika iş!' : 'Great job!'}
        </div>
        <p className="flashcard-complete__sub">
          {lang === 'tr'
            ? `${knownFinal} / ${total} kelimeyi bildin`
            : `You knew ${knownFinal} out of ${total} words`}
        </p>
        <button
          type="button"
          className="flashcard-complete__btn"
          onClick={() => onComplete(finalResults)}
        >
          {lang === 'tr' ? 'Bitir' : 'Finish'}
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div>
      {/* Progress bar */}
      <div className="flashcard-progress">
        <span className="flashcard-progress__label">
          {answeredCount}/{total}
        </span>
        <div className="flashcard-progress__bar-track">
          <div
            className="flashcard-progress__bar-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="flashcard-progress__label">{knownCount} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle'}}><path d="M20 6L9 17l-5-5"/></svg></span>
      </div>

      {/* 3-D card — direction-aware:
            EN→TR: front = English word, back = Turkish translation
            TR→EN: front = Turkish translation, back = English word */}
      <div className="flashcard-scene">
        <div
          className={`flashcard${flipped ? ' flipped' : ''}`}
          onClick={handleFlip}
          role="button"
          tabIndex={0}
          aria-label={
            direction === 'en-tr'
              ? (flipped ? `Turkish: ${current.card.back}` : `English: ${current.card.front}. Tap to flip.`)
              : (flipped ? `English: ${current.card.front}` : `Turkish: ${current.card.back}. Tap to flip.`)
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') handleFlip();
          }}
        >
          {/* Front face */}
          <div className="flashcard__face flashcard__front">
            {direction === 'en-tr' ? (
              <>
                <WordIllustration word={current.card.front} size={100} />
                <span className="flashcard__word">{current.card.front}</span>
              </>
            ) : (
              <>
                <WordIllustration word={current.card.front} size={80} />
                <span className="flashcard__word flashcard__word--tr">{current.card.back}</span>
                <span className="flashcard__front-dir-badge">TR</span>
              </>
            )}
            <span className="flashcard__front-hint">
              {lang === 'tr' ? 'Çevirmek için dokun' : 'Tap to flip'}
            </span>
          </div>

          {/* Back face */}
          <div className="flashcard__face flashcard__back">
            <WordIllustration word={current.card.front} size={72} />
            {direction === 'en-tr' ? (
              <>
                <span className="flashcard__word flashcard__word--back">{current.card.front}</span>
                <span className="flashcard__translation">{current.card.back}</span>
              </>
            ) : (
              <>
                <span className="flashcard__translation">{current.card.front}</span>
                <span className="flashcard__word flashcard__word--back flashcard__word--en-reveal">
                  {current.card.back}
                </span>
              </>
            )}
            {current.card.phonetic && direction === 'en-tr' && (
              <span className="flashcard__phonetic">/{current.card.phonetic}/</span>
            )}
            {current.card.example && (
              <div className="flashcard__example">
                <span className="flashcard__example-en">"{current.card.example}"</span>
                {current.card.exampleTr && (
                  <span className="flashcard__example-tr">"{current.card.exampleTr}"</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Keyboard shortcut hint */}
      <div className="flashcard-keyboard-hint" aria-hidden="true">
        {!flipped
          ? (lang === 'tr' ? 'Space = Cevir' : 'Space = Flip')
          : (lang === 'tr' ? '\u2190 Tekrar  \u2192 Biliyorum' : '\u2190 Retry  \u2192 I Know')}
      </div>

      {/* Action buttons — only after flip */}
      {flipped && (
        <div className="flashcard-actions">
          <button
            type="button"
            className="flashcard-action-btn flashcard-action-btn--retry"
            onClick={handleRetry}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></svg>
            {lang === 'tr' ? 'Tekrar Et' : 'Try Again'}
          </button>
          <button
            type="button"
            className="flashcard-action-btn flashcard-action-btn--know"
            onClick={handleKnow}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{display:'inline',verticalAlign:'middle',marginRight:4}}><path d="M20 6L9 17l-5-5"/></svg>{lang === 'tr' ? 'Biliyorum' : 'I Know It'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FlashcardDeck;
