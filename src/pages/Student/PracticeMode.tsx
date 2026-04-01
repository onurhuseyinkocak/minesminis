/**
 * PRACTICE MODE — Free Review & Spaced Repetition
 * Mobile-first, light mode only, all Tailwind inline.
 */
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, Zap, BookOpen, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type MasteryLevel = 'mastered' | 'reviewing' | 'learning' | 'new';

interface WordCard {
  id: string;
  english: string;
  turkish: string;
  mastery: MasteryLevel;
  world: string;
  confidence: number;
  exampleSentence: string;
  lastPracticed?: string;
  dueForReview?: boolean;
}

const MOCK_WORDS: WordCard[] = [
  { id: '1', english: 'Cat', turkish: 'Kedi', mastery: 'mastered', world: 'Animals', confidence: 95, exampleSentence: 'The cat is sleeping on the sofa.' },
  { id: '2', english: 'Dog', turkish: 'Köpek', mastery: 'mastered', world: 'Animals', confidence: 90, exampleSentence: 'My dog likes to play in the park.' },
  { id: '3', english: 'Bird', turkish: 'Kuş', mastery: 'reviewing', world: 'Animals', confidence: 70, exampleSentence: 'A bird is singing in the tree.', dueForReview: true },
  { id: '4', english: 'Fish', turkish: 'Balık', mastery: 'reviewing', world: 'Animals', confidence: 65, exampleSentence: 'The fish swims in the water.', dueForReview: true },
  { id: '5', english: 'Red', turkish: 'Kırmızı', mastery: 'mastered', world: 'Colors', confidence: 100, exampleSentence: 'The apple is red.' },
  { id: '6', english: 'Blue', turkish: 'Mavi', mastery: 'learning', world: 'Colors', confidence: 45, exampleSentence: 'The sky is blue today.' },
  { id: '7', english: 'Green', turkish: 'Yeşil', mastery: 'learning', world: 'Colors', confidence: 40, exampleSentence: 'The grass is green.' },
  { id: '8', english: 'Apple', turkish: 'Elma', mastery: 'reviewing', world: 'Food', confidence: 75, exampleSentence: 'I eat an apple every day.', dueForReview: true },
  { id: '9', english: 'Bread', turkish: 'Ekmek', mastery: 'new', world: 'Food', confidence: 10, exampleSentence: 'We have bread for breakfast.' },
  { id: '10', english: 'Water', turkish: 'Su', mastery: 'new', world: 'Food', confidence: 5, exampleSentence: 'Please drink your water.' },
  { id: '11', english: 'Mother', turkish: 'Anne', mastery: 'learning', world: 'Family', confidence: 50, exampleSentence: 'My mother makes delicious cakes.' },
  { id: '12', english: 'Father', turkish: 'Baba', mastery: 'learning', world: 'Family', confidence: 55, exampleSentence: 'My father reads me stories.' },
  { id: '13', english: 'One', turkish: 'Bir', mastery: 'mastered', world: 'Numbers', confidence: 100, exampleSentence: 'I have one pencil.' },
  { id: '14', english: 'Two', turkish: 'İki', mastery: 'mastered', world: 'Numbers', confidence: 98, exampleSentence: 'I have two hands.' },
  { id: '15', english: 'Horse', turkish: 'At', mastery: 'new', world: 'Animals', confidence: 0, exampleSentence: 'The horse runs very fast.' },
  { id: '16', english: 'Rabbit', turkish: 'Tavşan', mastery: 'new', world: 'Animals', confidence: 15, exampleSentence: 'The rabbit has long ears.' },
];

const WORLDS = ['All', 'Animals', 'Colors', 'Food', 'Family', 'Numbers'];

const FILTERS: { id: string; label: string }[] = [
  { id: 'all', label: 'Hepsi' },
  { id: 'mastered', label: 'Biliyorum' },
  { id: 'reviewing', label: 'Tekrar' },
  { id: 'learning', label: 'Ogreniyorum' },
  { id: 'new', label: 'Yeni' },
];

const MASTERY_COLORS: Record<MasteryLevel, string> = {
  mastered: '#22C55E',
  reviewing: '#3B82F6',
  learning: '#F59E0B',
  new: '#94A3B8',
};

const PracticeMode = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedWorld, setSelectedWorld] = useState('All');
  const [selectedWord, setSelectedWord] = useState<WordCard | null>(null);

  const filteredWords = useMemo(() => {
    let words = [...MOCK_WORDS];
    if (selectedWorld !== 'All') words = words.filter(w => w.world === selectedWorld);
    if (activeFilter !== 'all') words = words.filter(w => w.mastery === activeFilter);
    return words;
  }, [activeFilter, selectedWorld]);

  const stats = useMemo(() => {
    const total = MOCK_WORDS.length;
    const mastered = MOCK_WORDS.filter(w => w.mastery === 'mastered').length;
    return { total, mastered, pct: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  }, []);

  const handlePronounce = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Demo banner */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl px-4 py-3 mb-4 flex items-center gap-2">
          <BookOpen size={16} className="text-amber-600 shrink-0" />
          <span className="text-xs font-medium text-amber-700">
            Pratik Modu -- yakinda. Asagidaki veriler onizlemedir.
          </span>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-gray-900">Pratik Zamani!</h1>
          <button
            type="button"
            onClick={() => navigate('/games')}
            className="min-h-[48px] px-4 rounded-3xl bg-orange-500 text-white font-bold text-sm flex items-center gap-2 shadow-md active:scale-95 transition-transform"
          >
            <Zap size={16} /> Hizli Test
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
          {FILTERS.map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              className={`min-h-[48px] px-4 rounded-3xl text-sm font-bold whitespace-nowrap transition-all ${
                activeFilter === f.id ? 'bg-orange-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* World filter */}
        <select
          value={selectedWorld}
          onChange={(e) => setSelectedWorld(e.target.value)}
          aria-label="Konuya gore filtrele"
          className="w-full min-h-[48px] rounded-3xl border-2 border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 mb-4"
        >
          {WORLDS.map(w => <option key={w} value={w}>{w === 'All' ? 'Tum Konular' : w}</option>)}
        </select>

        {/* Word Grid */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-12">
            <RotateCcw size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Burada kelime bulunamadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {filteredWords.map((word, i) => (
              <motion.button
                key={word.id}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedWord(word)}
                className="rounded-3xl bg-white border-2 border-gray-100 p-4 flex flex-col items-start gap-1 shadow-sm active:scale-95 transition-transform text-left"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: MASTERY_COLORS[word.mastery] }}>
                  {word.english.charAt(0)}
                </div>
                <span className="text-base font-extrabold text-gray-900">{word.english}</span>
                <span className="text-xs text-gray-500">{word.turkish}</span>
                <div className="w-full h-1.5 rounded-full bg-gray-100 mt-1">
                  <div className="h-full rounded-full transition-all" style={{ width: `${word.confidence}%`, background: MASTERY_COLORS[word.mastery] }} />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Progress summary */}
        <div className="rounded-3xl bg-white border-2 border-gray-100 p-4 shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-800 mb-2">Ilerlemen</h3>
          <div className="w-full h-2 rounded-full bg-gray-100 mb-2">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${stats.pct}%` }} />
          </div>
          <p className="text-xs text-gray-500">{stats.total} kelimeden {stats.mastered} tanesi ogrenildi (%{stats.pct})</p>
        </div>
      </div>

      {/* Word Detail Modal */}
      <AnimatePresence>
        {selectedWord && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setSelectedWord(null)}
              role="button" tabIndex={0} aria-label="Close"
              onKeyDown={(e) => { if (e.key === 'Escape') setSelectedWord(null); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-white rounded-3xl p-6 shadow-xl z-50"
            >
              <button type="button" onClick={() => setSelectedWord(null)} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} className="text-gray-500" />
              </button>

              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold" style={{ background: MASTERY_COLORS[selectedWord.mastery] }}>
                  {selectedWord.english.charAt(0)}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900">{selectedWord.english}</h2>
                <p className="text-base text-gray-500">{selectedWord.turkish}</p>

                <button
                  type="button"
                  onClick={() => handlePronounce(selectedWord.english)}
                  className="min-h-[48px] px-6 rounded-3xl bg-sky-100 text-sky-700 font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Volume2 size={18} /> Telaffuzu dinle
                </button>

                <div className="w-full rounded-2xl bg-gray-50 p-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">Ornek:</span>
                  <p className="text-sm text-gray-700 mt-1">{selectedWord.exampleSentence}</p>
                </div>

                <div className="w-full">
                  <div className="w-full h-2 rounded-full bg-gray-100">
                    <div className="h-full rounded-full transition-all" style={{ width: `${selectedWord.confidence}%`, background: MASTERY_COLORS[selectedWord.mastery] }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-center">{selectedWord.confidence}% ustalik</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PracticeMode;
