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

const GROUP_COLORS = [
  'from-red-300 to-rose-400',
  'from-orange-300 to-amber-400',
  'from-yellow-300 to-lime-400',
  'from-green-300 to-emerald-400',
  'from-cyan-300 to-blue-400',
  'from-blue-300 to-indigo-400',
  'from-purple-300 to-violet-400',
];

const GROUP_BORDER_COLORS = [
  'border-rose-400',
  'border-amber-400',
  'border-lime-400',
  'border-emerald-400',
  'border-blue-400',
  'border-indigo-400',
  'border-violet-400',
];

const GROUP_BG_COLORS = [
  'bg-rose-50',
  'bg-amber-50',
  'bg-lime-50',
  'bg-emerald-50',
  'bg-blue-50',
  'bg-indigo-50',
  'bg-violet-50',
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
    <div className="min-h-[calc(100dvh-64px)] bg-gradient-to-b from-sky-50 via-amber-50/30 to-orange-50/20 px-4 py-6 overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springGentle}
        className="flex items-center justify-between max-w-4xl mx-auto mb-8"
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center justify-center w-14 h-14 rounded-3xl bg-white/80 shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft size={22} className="text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={28} className="text-amber-500" />
            <h1 className="text-2xl font-bold text-slate-700 tracking-tight">
              {lang === 'tr' ? 'Kutuphanem' : 'Library'}
            </h1>
          </div>
        </div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ ...springBounce, delay: 0.2 }}
          className="flex items-center gap-2 bg-white/80 rounded-3xl px-4 py-2 shadow-sm"
        >
          <BookOpen size={16} className="text-emerald-500" />
          <span className="text-sm font-semibold text-slate-600">
            {totalBooksRead} {lang === 'tr' ? 'okundu' : 'read'}
          </span>
        </motion.div>
      </motion.div>

      {/* Shelves */}
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        {[1, 2, 3, 4, 5, 6, 7].map((group) => {
          const books = booksByGroup[group] || [];
          const isLocked = group > masteredGroup;
          const groupInfo = GROUP_NAMES[group];
          const colorIdx = group - 1;

          return (
            <motion.div
              key={group}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springGentle, delay: group * 0.08 }}
              className={`rounded-3xl ${GROUP_BG_COLORS[colorIdx]} border-l-4 ${GROUP_BORDER_COLORS[colorIdx]} p-4 ${isLocked ? 'opacity-60' : ''}`}
            >
              {/* Shelf label */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-sm font-bold text-slate-600">
                  {lang === 'tr' ? `Raf ${group}` : `Shelf ${group}`}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  {lang === 'tr' ? groupInfo.tr : groupInfo.en}
                </span>
                <span className="text-[10px] text-slate-300 ml-auto font-mono">
                  {groupInfo.sounds}
                </span>
                {isLocked && <Lock size={14} className="text-slate-400" />}
              </div>

              {/* Horizontal scrollable books row */}
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {books.map((book, i) => {
                  const record = readBooks[book.id];
                  const bookStars = record?.stars || 0;
                  const bestWpm = getBestWPMForContent(userId, book.id);
                  const isCompleted = hasCompletedContent(userId, book.id);

                  return (
                    <motion.button
                      type="button"
                      key={book.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ ...springBounce, delay: group * 0.08 + i * 0.05 }}
                      whileHover={
                        !isLocked
                          ? { scale: 1.06, rotate: [-1, 1, -1, 0], y: -4 }
                          : {}
                      }
                      whileTap={!isLocked ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (!isLocked) {
                          setSelectedBook(book);
                          setUseReadingPlayerMode(true);
                        }
                      }}
                      disabled={isLocked}
                      aria-label={
                        isLocked
                          ? `${book.title} (${lang === 'tr' ? 'kilitli' : 'locked'})`
                          : book.title
                      }
                      className={`
                        relative flex-shrink-0 flex flex-col items-center justify-center
                        w-40 min-h-[160px] rounded-3xl shadow-md
                        bg-gradient-to-br ${GROUP_COLORS[colorIdx]}
                        ${isLocked ? 'cursor-not-allowed grayscale' : 'cursor-pointer hover:shadow-lg'}
                        transition-shadow p-4 gap-2
                      `}
                    >
                      {/* Book initial circle */}
                      <div className="w-14 h-14 rounded-full bg-white/30 flex items-center justify-center">
                        <span className="text-2xl font-black text-white leading-none">
                          {book.title.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <span className="text-sm font-bold text-white text-center leading-tight line-clamp-2">
                        {book.title}
                      </span>

                      {/* Completion stars */}
                      {bookStars > 0 && (
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              fill={s <= bookStars ? '#FDE047' : 'transparent'}
                              stroke={s <= bookStars ? '#FACC15' : 'rgba(255,255,255,0.4)'}
                              strokeWidth={2}
                            />
                          ))}
                        </div>
                      )}

                      {/* Best WPM badge */}
                      {bestWpm !== null && (
                        <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-white/30 rounded-full px-2 py-0.5">
                          <Zap size={10} className="text-yellow-100" />
                          <span className="text-[10px] font-bold text-white">{bestWpm}</span>
                        </div>
                      )}

                      {/* Completed check */}
                      {isCompleted && !bestWpm && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                          <Star size={12} fill="#FDE047" stroke="#FACC15" />
                        </div>
                      )}

                      {/* Lock overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 rounded-3xl bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                          <Lock size={28} className="text-slate-400" />
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
