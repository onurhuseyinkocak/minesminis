import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Lock, ArrowLeft, Star, Zap } from 'lucide-react';
import { READING_LIBRARY, getBookById } from '../../data/readingLibrary';
import type { DecodableBook, CompQuestion } from '../../data/readingLibrary';
import { BookReader } from '../../components/phonics/BookReader';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { LS_READ_BOOKS, LS_PHONICS_MASTERY } from '../../config/storageKeys';
import ReadingPlayer from '../../components/ReadingPlayer';
import LottieCharacter from '../../components/LottieCharacter';
import type { ReadingStats, ComprehensionQuestion } from '../../components/ReadingPlayer';
import {
  saveReadingRecord,
  hasCompletedContent,
  getBestWPMForContent,
} from '../../services/readingProgressService';

// ── LocalStorage helpers ────────────────────────────────────────────────────

interface ReadBookRecord {
  stars: number;
  completedAt: string;
}

function getReadBooks(): Record<string, ReadBookRecord> {
  try {
    const raw = localStorage.getItem(LS_READ_BOOKS);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, ReadBookRecord>;
  } catch {
    return {};
  }
}

function saveReadBook(bookId: string, stars: number): void {
  try {
    const records = getReadBooks();
    const existing = records[bookId];
    if (!existing || stars > existing.stars) {
      records[bookId] = { stars, completedAt: new Date().toISOString() };
    }
    localStorage.setItem(LS_READ_BOOKS, JSON.stringify(records));
  } catch {
    // ignore
  }
}

function getMasteredGroup(): number {
  try {
    const raw = localStorage.getItem(LS_PHONICS_MASTERY);
    if (!raw) return 1;
    const mastery = JSON.parse(raw) as Record<string, { mastery: number }>;
    let highestAvailable = 1;
    for (let g = 1; g <= 7; g++) {
      const groupSoundIds = Object.keys(mastery).filter((id) => id.startsWith(`g${g}_`));
      if (groupSoundIds.length === 0 && g > 1) break;
      const allMastered =
        groupSoundIds.length > 0 && groupSoundIds.every((id) => mastery[id]?.mastery >= 80);
      if (allMastered) {
        highestAvailable = Math.min(g + 1, 7);
      } else if (groupSoundIds.length > 0) {
        highestAvailable = Math.max(highestAvailable, g);
      }
    }
    return highestAvailable;
  } catch {
    return 1;
  }
}

// ── Reading player format helpers ───────────────────────────────────────────

function levelFromGroup(group: number): 'beginner' | 'intermediate' | 'advanced' {
  if (group <= 2) return 'beginner';
  if (group <= 5) return 'intermediate';
  return 'advanced';
}

function compQuestionsToPlayerFormat(questions: CompQuestion[]): ComprehensionQuestion[] {
  return questions.map((q, qi) => ({
    id: `q-${qi}`,
    question: q.question,
    questionTr: q.questionTr,
    options: q.options.map((opt, oi) => ({
      id: `q-${qi}-o-${oi}`,
      text: opt,
      correct: oi === q.correctIndex,
    })),
  }));
}

// ── Shelf config ────────────────────────────────────────────────────────────

const GROUP_GRADIENTS = [
  'from-rose-400 to-pink-500',
  'from-orange-400 to-amber-500',
  'from-yellow-400 to-lime-500',
  'from-emerald-400 to-green-500',
  'from-cyan-400 to-blue-500',
  'from-blue-400 to-indigo-500',
  'from-purple-400 to-violet-500',
];

const GROUP_SHELF_BG = [
  'bg-rose-100/80',
  'bg-amber-100/80',
  'bg-lime-100/80',
  'bg-emerald-100/80',
  'bg-blue-100/80',
  'bg-indigo-100/80',
  'bg-violet-100/80',
];

const GROUP_SHELF_BORDER = [
  'border-rose-300',
  'border-amber-300',
  'border-lime-300',
  'border-emerald-300',
  'border-blue-300',
  'border-indigo-300',
  'border-violet-300',
];

const GROUP_LABEL_COLOR = [
  'text-rose-600',
  'text-amber-600',
  'text-lime-600',
  'text-emerald-600',
  'text-blue-600',
  'text-indigo-600',
  'text-violet-600',
];

const GROUP_NAMES: Record<number, { en: string; tr: string; sounds: string }> = {
  1: { en: 'First Sounds', tr: 'Ilk Sesler', sounds: 's, a, t, i, p, n' },
  2: { en: 'More Letters', tr: 'Daha Fazla Harf', sounds: 'c/k, e, h, r, m, d' },
  3: { en: 'Growing Letters', tr: 'Buyuyen Harfler', sounds: 'g, o, u, l, f, b' },
  4: { en: 'Long Vowels', tr: 'Uzun Sesli Harfler', sounds: 'ai, j, oa, ie, ee, or' },
  5: { en: 'Tricky Sounds', tr: 'Zor Sesler', sounds: 'z, w, ng, v, oo' },
  6: { en: 'Special Sounds', tr: 'Ozel Sesler', sounds: 'y, x, ch, sh, th' },
  7: { en: 'Final Sounds', tr: 'Son Sesler', sounds: 'qu, ou, oi, ue, er, ar' },
};

// ── Spring animation presets ────────────────────────────────────────────────

const springBounce = { type: 'spring' as const, stiffness: 300, damping: 20 };
const springGentle = { type: 'spring' as const, stiffness: 200, damping: 25 };

// ── Main component ──────────────────────────────────────────────────────────

const ReadingLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId?: string }>();
  const { addXP } = useGamification();
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [selectedBook, setSelectedBook] = useState<DecodableBook | null>(() => {
    if (bookId) return getBookById(bookId) || null;
    return null;
  });
  const [useReadingPlayerMode, setUseReadingPlayerMode] = useState(false);
  const [readBooksVersion, setReadBooksVersion] = useState(0);

  const readBooks = useMemo(() => getReadBooks(), [readBooksVersion]);
  const masteredGroup = useMemo(() => getMasteredGroup(), []);
  const userId = user?.uid ?? 'guest';
  const totalBooksRead = useMemo(() => Object.keys(readBooks).length, [readBooks]);

  // ── Book completion handlers ────────────────────────────────────────────

  const handleBookComplete = useCallback(
    (correctCount: number) => {
      if (!selectedBook) return;
      const totalQs = selectedBook.comprehensionQuestions.length;
      const ratio = totalQs > 0 ? correctCount / totalQs : 0;
      let stars = 1;
      if (ratio >= 0.9) stars = 3;
      else if (ratio >= 0.6) stars = 2;
      saveReadBook(selectedBook.id, stars);
      addXP(stars * 10, 'Reading completion');
      setReadBooksVersion((v) => v + 1);
      setSelectedBook(null);
      if (bookId) navigate('/reading', { replace: true });
    },
    [selectedBook, addXP, bookId, navigate],
  );

  const handleCloseReader = useCallback(() => {
    setSelectedBook(null);
    setUseReadingPlayerMode(false);
    if (bookId) navigate('/reading', { replace: true });
  }, [bookId, navigate]);

  const handleReadingPlayerComplete = useCallback(
    (stats: ReadingStats) => {
      if (!selectedBook) return;
      saveReadingRecord(userId, {
        contentId: selectedBook.id,
        completedAt: new Date().toISOString(),
        wpm: stats.wpm,
        quizScore: stats.quizScore,
      });
      const quizRatio =
        stats.quizTotal && stats.quizTotal > 0 ? (stats.quizScore ?? 0) / 100 : 0;
      let stars = 1;
      if (quizRatio >= 0.9) stars = 3;
      else if (quizRatio >= 0.6) stars = 2;
      saveReadBook(selectedBook.id, stars);
      addXP(stars * 10 + 5, 'Reading completion');
      setReadBooksVersion((v) => v + 1);
      setSelectedBook(null);
      setUseReadingPlayerMode(false);
      if (bookId) navigate('/reading', { replace: true });
    },
    [selectedBook, userId, addXP, bookId, navigate],
  );

  // ── Reading mode ──────────────────────────────────────────────────────────

  if (selectedBook) {
    if (useReadingPlayerMode) {
      const playerContent = {
        id: selectedBook.id,
        title: selectedBook.title,
        text: selectedBook.pages.map((p) => p.text).join('\n\n'),
        wordCount: selectedBook.wordCount,
        level: levelFromGroup(selectedBook.requiredGroup),
        comprehensionQuiz: compQuestionsToPlayerFormat(selectedBook.comprehensionQuestions),
      };
      return (
        <ReadingPlayer
          content={playerContent}
          onComplete={handleReadingPlayerComplete}
          onClose={handleCloseReader}
        />
      );
    }
    return (
      <BookReader
        book={selectedBook}
        onComplete={handleBookComplete}
        onClose={handleCloseReader}
      />
    );
  }

  // ── Group books by shelf ──────────────────────────────────────────────────

  const booksByGroup: Record<number, DecodableBook[]> = {};
  for (const book of READING_LIBRARY) {
    if (!booksByGroup[book.requiredGroup]) booksByGroup[book.requiredGroup] = [];
    booksByGroup[book.requiredGroup].push(book);
  }

  // ── Library view ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100dvh-64px)] kid-bg px-4 py-6 overflow-y-auto">
      {/* Mimi Header with Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springGentle}
        className="max-w-4xl mx-auto mb-6"
      >
        {/* Back button */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-14 h-14 rounded-[20px] bg-white/90 shadow-md border-2 border-orange-200 hover:shadow-lg hover:border-orange-300 transition-all active:scale-95"
          >
            <ArrowLeft size={24} className="text-orange-500" />
          </button>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ ...springBounce, delay: 0.2 }}
            className="flex items-center gap-2 bg-white/90 rounded-full px-5 py-2.5 shadow-md border-2 border-amber-200"
          >
            <BookOpen size={20} className="text-amber-500" />
            <span className="text-base font-extrabold text-amber-600">
              {totalBooksRead} {lang === 'tr' ? 'okundu' : 'read'}
            </span>
          </motion.div>
        </div>

        {/* Mimi + Speech Bubble */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...springBounce, delay: 0.15 }}
          className="flex items-end gap-3 mb-2"
        >
          {/* Mimi mascot */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            className="flex-shrink-0"
          >
            <LottieCharacter state="waving" size={72} />
          </motion.div>

          {/* Speech bubble */}
          <div className="relative bg-white rounded-[20px] px-5 py-3 shadow-lg border-2 border-purple-200 flex-1 max-w-sm">
            <p className="text-base font-extrabold text-purple-700 leading-snug">
              {lang === 'tr' ? 'Bir kitap secelim!' : "Let's pick a book!"}
            </p>
            {/* Bubble tail */}
            <div
              className="absolute -left-2 bottom-3 w-4 h-4 bg-white border-l-2 border-b-2 border-purple-200"
              style={{ transform: 'rotate(45deg)' }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Shelves */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6 pb-8">
        {[1, 2, 3, 4, 5, 6, 7].map((group) => {
          const books = booksByGroup[group] || [];
          const isLocked = group > masteredGroup;
          const groupInfo = GROUP_NAMES[group];
          const idx = group - 1;

          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springGentle, delay: group * 0.08 }}
              className={`rounded-[24px] ${GROUP_SHELF_BG[idx]} border-2 ${GROUP_SHELF_BORDER[idx]} p-5 ${isLocked ? 'opacity-50' : ''}`}
            >
              {/* Shelf label */}
              <div className="flex items-center gap-2 mb-4 px-1">
                <span className={`text-base font-extrabold ${GROUP_LABEL_COLOR[idx]}`}>
                  {lang === 'tr' ? `Raf ${group}` : `Shelf ${group}`}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {lang === 'tr' ? groupInfo.tr : groupInfo.en}
                </span>
                <span className="text-xs text-slate-300 ml-auto font-mono">
                  {groupInfo.sounds}
                </span>
                {isLocked && <Lock size={18} className="text-slate-400" />}
              </div>

              {/* Horizontal scrollable books row */}
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {books.map((book, i) => {
                  const record = readBooks[book.id];
                  const bookStars = record?.stars || 0;
                  const bestWpm = getBestWPMForContent(userId, book.id);
                  const isCompleted = hasCompletedContent(userId, book.id);

                  if (isLocked) {
                    // Locked cards: gray, big lock icon, no blur
                    return (
                      <div
                        key={book.id}
                        className="relative flex-shrink-0 flex flex-col items-center justify-center w-44 min-h-[160px] rounded-[28px] bg-gray-200 border-2 border-gray-300 p-4 gap-3"
                      >
                        <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
                          <Lock size={28} className="text-gray-400" />
                        </div>
                        <span className="text-sm font-bold text-gray-400 text-center leading-tight line-clamp-2">
                          {book.title}
                        </span>
                      </div>
                    );
                  }

                  return (
                    <motion.button
                      type="button"
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springBounce, delay: group * 0.08 + i * 0.05 }}
                      whileHover={{ scale: 1.06, y: -6 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        setSelectedBook(book);
                        setUseReadingPlayerMode(true);
                      }}
                      aria-label={book.title}
                      className={`
                        relative flex-shrink-0 flex flex-col items-center justify-center
                        w-44 min-h-[160px] rounded-[28px] shadow-lg
                        bg-gradient-to-br ${GROUP_GRADIENTS[idx]}
                        cursor-pointer hover:shadow-xl
                        transition-shadow p-4 gap-3 border-2 border-white/30
                      `}
                    >
                      {/* Completed star badge overlay */}
                      {(isCompleted || bookStars > 0) && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={springBounce}
                          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 border-3 border-white shadow-lg flex items-center justify-center z-10"
                        >
                          <Star size={20} fill="#fff" stroke="#fff" />
                        </motion.div>
                      )}

                      {/* Book initial circle — big, white, 56px */}
                      <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-md">
                        <span className="text-2xl font-black leading-none" style={{ color: 'inherit', filter: 'brightness(0.7) saturate(1.5)' }}>
                          {book.title.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Title — bold */}
                      <span className="text-sm font-extrabold text-white text-center leading-tight line-clamp-2 drop-shadow-sm">
                        {book.title}
                      </span>

                      {/* Completion stars row */}
                      {bookStars > 0 && (
                        <div className="flex gap-1">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={16}
                              fill={s <= bookStars ? '#FDE047' : 'transparent'}
                              stroke={s <= bookStars ? '#FACC15' : 'rgba(255,255,255,0.5)'}
                              strokeWidth={2.5}
                            />
                          ))}
                        </div>
                      )}

                      {/* Best WPM badge */}
                      {bestWpm !== null && (
                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/40 rounded-full px-2.5 py-1">
                          <Zap size={12} className="text-yellow-100" />
                          <span className="text-xs font-extrabold text-white">{bestWpm}</span>
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingLibrary;
