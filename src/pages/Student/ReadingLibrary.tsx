import React, { useState, useCallback, useMemo } from 'react';
import './ReadingLibrary.css';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, Lock, ArrowLeft, Star } from 'lucide-react';
import { READING_LIBRARY, getBookById } from '../../data/readingLibrary';
import type { DecodableBook } from '../../data/readingLibrary';
import { BookReader } from '../../components/phonics/BookReader';
import { useGamification } from '../../contexts/GamificationContext';
import { LS_READ_BOOKS, LS_PHONICS_MASTERY } from '../../config/storageKeys';

// --- LOCAL STORAGE ---

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
    // Only update if new stars are higher
    if (!existing || stars > existing.stars) {
      records[bookId] = {
        stars,
        completedAt: new Date().toISOString(),
      };
    }
    localStorage.setItem(LS_READ_BOOKS, JSON.stringify(records));
  } catch {
    // ignore
  }
}

function getMasteredGroup(): number {
  try {
    const raw = localStorage.getItem(LS_PHONICS_MASTERY);
    if (!raw) return 1; // Default: group 1 is always available
    const mastery = JSON.parse(raw) as Record<string, { mastery: number }>;

    // Check which groups are fully mastered
    // A group is available if the previous group's sounds are all >= 80 mastery
    // Group 1 is always available
    let highestAvailable = 1;

    // Group IDs follow pattern g{N}_{letter}
    for (let g = 1; g <= 7; g++) {
      const groupSoundIds = Object.keys(mastery).filter((id) => id.startsWith(`g${g}_`));
      if (groupSoundIds.length === 0 && g > 1) break;

      const allMastered = groupSoundIds.length > 0 &&
        groupSoundIds.every((id) => mastery[id]?.mastery >= 80);

      if (allMastered) {
        highestAvailable = Math.min(g + 1, 7);
      } else if (groupSoundIds.length > 0) {
        // If any sound in the group has been started, that group is available
        highestAvailable = Math.max(highestAvailable, g);
      }
    }

    return highestAvailable;
  } catch {
    return 1;
  }
}

// --- GROUP NAMES ---

const GROUP_NAMES: Record<number, { en: string; tr: string; sounds: string }> = {
  1: { en: 'First Sounds', tr: 'Ilk Sesler', sounds: 's, a, t, i, p, n' },
  2: { en: 'More Letters', tr: 'Daha Fazla Harf', sounds: 'c/k, e, h, r, m, d' },
  3: { en: 'Growing Letters', tr: 'Buyuyen Harfler', sounds: 'g, o, u, l, f, b' },
  4: { en: 'Long Vowels', tr: 'Uzun Sesli Harfler', sounds: 'ai, j, oa, ie, ee, or' },
  5: { en: 'Tricky Sounds', tr: 'Zor Sesler', sounds: 'z, w, ng, v, oo' },
  6: { en: 'Special Sounds', tr: 'Ozel Sesler', sounds: 'y, x, ch, sh, th' },
  7: { en: 'Final Sounds', tr: 'Son Sesler', sounds: 'qu, ou, oi, ue, er, ar' },
};

// Shelf wood colors as CSS custom properties / Tailwind-compatible hex values
// Using warm-brown palette mapped to Tailwind amber/stone tones
const SHELF_COLORS = [
  '#92400E', // amber-800
  '#78350F', // amber-900
  '#9A3412', // orange-800  (closest warm brown)
  '#7C2D12', // orange-900
  '#92400E',
  '#78350F',
  '#9A3412',
];

// Book spine colors as Tailwind color values
const BOOK_SPINE_COLORS = [
  '#EF4444', // red-500
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
  '#F97316', // orange-500
  '#6366F1', // indigo-500
  '#84CC16', // lime-500
  '#E11D48', // rose-600
  '#0EA5E9', // sky-500
  '#A855F7', // purple-500
  '#22C55E', // green-500
];

// --- MAIN COMPONENT ---

const ReadingLibrary: React.FC = () => {
  const navigate = useNavigate();
  const { bookId } = useParams<{ bookId?: string }>();
  const { addXP } = useGamification();

  const [selectedBook, setSelectedBook] = useState<DecodableBook | null>(() => {
    if (bookId) {
      return getBookById(bookId) || null;
    }
    return null;
  });

  const readBooks = useMemo(() => getReadBooks(), []);
  const masteredGroup = useMemo(() => getMasteredGroup(), []);

  const totalBooksRead = useMemo(() => {
    return Object.keys(readBooks).length;
  }, [readBooks]);

  const handleBookComplete = useCallback((correctCount: number) => {
    if (!selectedBook) return;

    const totalQs = selectedBook.comprehensionQuestions.length;
    const ratio = totalQs > 0 ? correctCount / totalQs : 0;
    let stars = 1;
    if (ratio >= 0.9) stars = 3;
    else if (ratio >= 0.6) stars = 2;

    saveReadBook(selectedBook.id, stars);
    addXP(stars * 10, 'Reading completion');

    setSelectedBook(null);
    if (bookId) {
      navigate('/reading', { replace: true });
    }
  }, [selectedBook, addXP, bookId, navigate]);

  const handleCloseReader = useCallback(() => {
    setSelectedBook(null);
    if (bookId) {
      navigate('/reading', { replace: true });
    }
  }, [bookId, navigate]);

  // If a book is selected, show the reader
  if (selectedBook) {
    return (
      <BookReader
        book={selectedBook}
        onComplete={handleBookComplete}
        onClose={handleCloseReader}
      />
    );
  }

  // Group books by required group
  const booksByGroup: Record<number, DecodableBook[]> = {};
  for (const book of READING_LIBRARY) {
    if (!booksByGroup[book.requiredGroup]) {
      booksByGroup[book.requiredGroup] = [];
    }
    booksByGroup[book.requiredGroup].push(book);
  }

  return (
    <div className="rl-page">
      {/* Header */}
      <div className="rl-header">
        <button type="button" onClick={() => navigate('/dashboard')} className="rl-backBtn">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="rl-title">Reading Library</h1>
          <p className="rl-subtitle">Decodable books for your level</p>
        </div>
        <div className="rl-counter">
          <BookOpen size={18} />
          <span>{totalBooksRead} read</span>
        </div>
      </div>

      {/* Bookshelf */}
      <div className="rl-shelves">
        {[1, 2, 3, 4, 5, 6, 7].map((group) => {
          const books = booksByGroup[group] || [];
          const isLocked = group > masteredGroup;
          const groupInfo = GROUP_NAMES[group];

          return (
            <div key={group} className="rl-shelfSection">
              {/* Shelf label */}
              <div className="rl-shelfLabel">
                <span className="rl-shelfGroupNum">Group {group}</span>
                <span className="rl-shelfGroupName">{groupInfo.en}</span>
                <span className="rl-shelfSounds">{groupInfo.sounds}</span>
                {isLocked && <Lock size={14} style={{ color: 'var(--text-muted, #9CA3AF)', marginLeft: 4 }} />}
              </div>

              {/* Shelf with books */}
              <div
                className="rl-shelf"
                style={{
                  borderBottomColor: SHELF_COLORS[group - 1],
                }}
              >
                <div className="rl-booksRow">
                  {books.map((book, i) => {
                    const record = readBooks[book.id];
                    const bookStars = record?.stars || 0;
                    const spineColor = BOOK_SPINE_COLORS[(group - 1) * 2 + i] || '#6B7280';

                    return (
                      <motion.button
                        key={book.id}
                        whileHover={!isLocked ? { y: -8, scale: 1.05 } : {}}
                        whileTap={!isLocked ? { scale: 0.95 } : {}}
                        onClick={() => {
                          if (!isLocked) setSelectedBook(book);
                        }}
                        className="rl-bookSpine"
                        style={{
                          backgroundColor: isLocked ? '#D1D5DB' : spineColor,
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          opacity: isLocked ? 0.5 : 1,
                        }}
                        disabled={isLocked}
                        aria-label={isLocked ? `${book.title} (locked)` : book.title}
                      >
                        <div style={{
                          width: 32,
                          height: 32,
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 900,
                          color: '#fff',
                        }}>
                          {book.title.charAt(0).toUpperCase()}
                        </div>
                        <span className="rl-bookSpineTitle">{book.title}</span>
                        {bookStars > 0 && (
                          <div className="rl-bookStars">
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={s <= bookStars ? '#F59E0B' : 'none'}
                                stroke={s <= bookStars ? '#F59E0B' : 'var(--border-light, #D1D5DB)'}
                              />
                            ))}
                          </div>
                        )}
                        {isLocked && (
                          <Lock size={16} style={{ color: '#F1F5F9', marginTop: 4 }} />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Wood shelf bottom */}
                <div
                  className="rl-woodShelf"
                  style={{ backgroundColor: SHELF_COLORS[group - 1] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingLibrary;

