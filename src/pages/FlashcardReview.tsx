import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw } from 'lucide-react';
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

interface RawWord {
  word: string;
  turkish: string;
  example?: string | null;
  exampleSentence?: string | null;
  exampleSentenceTr?: string | null;
}

function wordToFlashcard(wp: WordProgress, wordMap: Map<string, RawWord>): Flashcard | null {
  const raw = wordMap.get(wp.wordId.toLowerCase());
  if (!raw) return null;
  return {
    id: wp.wordId,
    front: raw.word,
    back: raw.turkish,
    example: raw.example ?? raw.exampleSentence ?? undefined,
    exampleTr: raw.exampleSentenceTr ?? undefined,
  };
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

function CardSkeleton() {
  return <div className="w-full max-w-sm aspect-[3/4] rounded-3xl bg-gray-100 animate-pulse mx-auto" />;
}

export default function FlashcardReview() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  usePageTitle('Kelime Kartlari', 'Flashcards');
  const isTr = lang === 'tr';

  const [wordMap, setWordMap] = useState<Map<string, RawWord>>(() => {
    const m = new Map<string, RawWord>();
    for (const w of fallbackWords) m.set(w.word.toLowerCase(), w);
    return m;
  });

  const [dueWords, setDueWords] = useState<WordProgress[]>([]);
  const [sessionDone, setSessionDone] = useState(false);
  const [lastResults, setLastResults] = useState<FlashcardResult[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [newCount, setNewCount] = useState(0);
  const [direction, setDirection] = useState<StudyDirection>('en-tr');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [wordsLoading, setWordsLoading] = useState(true);

  // Load remote word list
  useEffect(() => {
    supabase
      .from('words')
      .select('word,turkish,example,exampleSentence:example_sentence,exampleSentenceTr:example_sentence_tr')
      .then(({ data }) => {
        if (data && data.length > 0) {
          const m = new Map<string, RawWord>();
          for (const w of data as RawWord[]) { if (w.word) m.set(w.word.toLowerCase(), w); }
          setWordMap(m);
        }
        setWordsLoading(false);
      })
      .catch(() => {
        setWordsLoading(false);
      });
  }, []);

  // Load due words
  useEffect(() => {
    if (!sessionDone) {
      const MAX_REVIEWS = 20;
      const MAX_NEW = 10;
      const allProgress = loadAllProgress();
      const now = new Date();
      const reviewDue = allProgress
        .filter(p => p.correctCount > 0 || p.incorrectCount > 0)
        .filter(p => new Date(p.nextReview) <= now)
        .sort((a, b) => new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime())
        .slice(0, MAX_REVIEWS);
      const newDue = allProgress
        .filter(p => p.correctCount === 0 && p.incorrectCount === 0)
        .filter(p => new Date(p.nextReview) <= now)
        .slice(0, Math.max(0, MAX_NEW - reviewDue.length));
      setReviewCount(reviewDue.length);
      setNewCount(newDue.length);
      setDueWords([...reviewDue, ...newDue]);
    }
  }, [sessionDone]);

  const flashcards = useMemo<Flashcard[]>(() => {
    return dueWords.map(wp => wordToFlashcard(wp, wordMap)).filter(Boolean) as Flashcard[];
  }, [dueWords, wordMap]);

  const handleCardResult = (cardId: string, knew: boolean) => updateWordProgress(cardId, knew);
  const handleComplete = (results: FlashcardResult[]) => { setLastResults(results); setSessionDone(true); };
  const handleRestart = () => { setSessionDone(false); setLastResults([]); };

  const doResetProgress = useCallback(() => {
    try {
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k?.startsWith('mimi_spaced_repetition')) keys.push(k); }
      keys.forEach(k => localStorage.removeItem(k));
    } catch { /* */ }
    setSessionDone(false); setLastResults([]); setReviewCount(0); setNewCount(0); setShowResetConfirm(false);
  }, []);

  const knownCount = lastResults.filter(r => r.knew).length;
  const totalCount = lastResults.length;
  const pct = totalCount > 0 ? Math.round((knownCount / totalCount) * 100) : 0;

  // Session complete
  if (sessionDone) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
        <Header isTr={isTr} onBack={() => navigate('/words')} direction={direction} onToggleDirection={() => setDirection(d => d === 'en-tr' ? 'tr-en' : 'en-tr')} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={spring}
            className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center"
          >
            <span className="text-3xl font-black text-green-600">{pct}%</span>
          </motion.div>
          <h2 className="text-xl font-black text-gray-800">{isTr ? 'Oturum tamamlandi!' : 'Session complete!'}</h2>
          <p className="text-sm text-gray-500">{isTr ? `${knownCount}/${totalCount} kelimeyi bildin` : `You knew ${knownCount}/${totalCount} words`}</p>
          <button type="button" onClick={handleRestart} className="h-14 px-8 rounded-2xl bg-indigo-500 text-white font-bold active:scale-95 transition-transform">
            {isTr ? 'Tekrar Baslat' : 'Start Again'}
          </button>
          <button type="button" onClick={() => setShowResetConfirm(true)} className="text-sm text-gray-400 underline mt-2">
            {isTr ? 'Ilerlemeyi Sifirla' : 'Reset Progress'}
          </button>
        </div>
        <ConfirmModal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} onConfirm={doResetProgress}
          title={isTr ? 'Ilerlemeyi Sifirla' : 'Reset Progress'}
          message={isTr ? 'Tum flashcard ilerlemenizi sifirlamak istediginizden emin misiniz?' : 'Reset all flashcard progress? This cannot be undone.'}
          confirmLabel={isTr ? 'Evet, Sifirla' : 'Yes, Reset'} variant="danger" />
      </div>
    );
  }

  // No cards
  if (!wordsLoading && flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
        <Header isTr={isTr} onBack={() => navigate('/words')} direction={direction} onToggleDirection={() => setDirection(d => d === 'en-tr' ? 'tr-en' : 'en-tr')} />
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
            <RotateCcw size={28} className="text-indigo-400" />
          </div>
          <h2 className="text-xl font-black text-gray-800">{isTr ? 'Hepsi tamam!' : 'All caught up!'}</h2>
          <p className="text-sm text-gray-500 max-w-xs">{isTr ? 'Su an tekrar edilecek kelime yok.' : 'No words due for review right now.'}</p>
          <button type="button" onClick={() => navigate('/words')} className="h-14 px-8 rounded-2xl bg-indigo-500 text-white font-bold active:scale-95 transition-transform">
            {isTr ? 'Kelimeler' : 'Browse Words'}
          </button>
          <button type="button" onClick={() => setShowResetConfirm(true)} className="text-sm text-gray-400 underline mt-2">
            {isTr ? 'Ilerlemeyi Sifirla' : 'Reset Progress'}
          </button>
        </div>
        <ConfirmModal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} onConfirm={doResetProgress}
          title={isTr ? 'Ilerlemeyi Sifirla' : 'Reset Progress'}
          message={isTr ? 'Tum ilerlemenizi sifirlamak istediginizden emin misiniz?' : 'Reset all progress? This cannot be undone.'}
          confirmLabel={isTr ? 'Evet, Sifirla' : 'Yes, Reset'} variant="danger" />
      </div>
    );
  }

  // Active session
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col">
      <Header isTr={isTr} onBack={() => navigate('/words')} direction={direction} onToggleDirection={() => setDirection(d => d === 'en-tr' ? 'tr-en' : 'en-tr')} cardCount={flashcards.length} />

      <div className="flex-1 flex flex-col px-4 pt-2">
        {/* Mini stats */}
        <div className="flex justify-center gap-6 mb-4">
          <div className="text-center">
            <span className="text-lg font-black text-indigo-600">{reviewCount}</span>
            <span className="block text-[10px] font-bold text-gray-400">{isTr ? 'Tekrar' : 'Review'}</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-black text-green-600">{newCount}</span>
            <span className="block text-[10px] font-bold text-gray-400">{isTr ? 'Yeni' : 'New'}</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-black text-yellow-600">
              {loadAllProgress().filter(p => getConfidenceLevel(p.confidenceScore) === 'mastered').length}
            </span>
            <span className="block text-[10px] font-bold text-gray-400">{isTr ? 'Ogrenildi' : 'Mastered'}</span>
          </div>
        </div>

        {wordsLoading ? <CardSkeleton /> : (
          <FlashcardDeck cards={flashcards} onComplete={handleComplete} onCardResult={handleCardResult} direction={direction} />
        )}
      </div>

      <ConfirmModal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} onConfirm={doResetProgress}
        title={isTr ? 'Ilerlemeyi Sifirla' : 'Reset Progress'}
        message={isTr ? 'Tum ilerlemenizi sifirlamak istediginizden emin misiniz?' : 'Reset all progress? This cannot be undone.'}
        confirmLabel={isTr ? 'Evet, Sifirla' : 'Yes, Reset'} variant="danger" />
    </div>
  );
}

// Shared header component
function Header({ isTr, onBack, direction, onToggleDirection, cardCount }: {
  isTr: boolean;
  onBack: () => void;
  direction: StudyDirection;
  onToggleDirection: () => void;
  cardCount?: number;
}) {
  return (
    <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-indigo-100 px-4 py-3">
      <div className="flex items-center gap-3">
        <button type="button" onClick={onBack} className="w-10 h-10 rounded-2xl bg-gray-100 flex items-center justify-center active:scale-90 transition-transform" aria-label={isTr ? 'Geri' : 'Back'}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-lg font-bold text-gray-800 flex-1">{isTr ? 'Kelime Kartlari' : 'Flashcards'}</h1>
        {cardCount !== undefined && (
          <span className="text-xs font-bold text-indigo-500 bg-indigo-50 h-7 px-3 rounded-full flex items-center">{cardCount}</span>
        )}
        <button type="button" onClick={onToggleDirection} className="h-7 px-3 rounded-full bg-gray-100 text-xs font-bold text-gray-600 active:scale-90 transition-transform">
          {direction === 'en-tr' ? 'EN→TR' : 'TR→EN'}
        </button>
      </div>
    </div>
  );
}
