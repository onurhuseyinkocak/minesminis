import React, { useState, useCallback, useMemo } from 'react';
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

const SHELF_COLORS = [
  '#8B5E3C', '#7A5230', '#9B6B4A', '#6E4528',
  '#8B5E3C', '#7A5230', '#9B6B4A',
];

const BOOK_SPINE_COLORS = [
  '#EF4444', '#3B82F6', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
  '#6366F1', '#84CC16', '#E11D48', '#0EA5E9',
  '#A855F7', '#22C55E',
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
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={styles.title}>Reading Library</h1>
          <p style={styles.subtitle}>Decodable books for your level</p>
        </div>
        <div style={styles.counter}>
          <BookOpen size={18} />
          <span>{totalBooksRead} read</span>
        </div>
      </div>

      {/* Bookshelf */}
      <div style={styles.shelves}>
        {[1, 2, 3, 4, 5, 6, 7].map((group) => {
          const books = booksByGroup[group] || [];
          const isLocked = group > masteredGroup;
          const groupInfo = GROUP_NAMES[group];

          return (
            <div key={group} style={styles.shelfSection}>
              {/* Shelf label */}
              <div style={styles.shelfLabel}>
                <span style={styles.shelfGroupNum}>Group {group}</span>
                <span style={styles.shelfGroupName}>{groupInfo.en}</span>
                <span style={styles.shelfSounds}>{groupInfo.sounds}</span>
                {isLocked && <Lock size={14} style={{ color: '#9CA3AF', marginLeft: 4 }} />}
              </div>

              {/* Shelf with books */}
              <div style={{
                ...styles.shelf,
                borderBottomColor: SHELF_COLORS[group - 1],
              }}>
                <div style={styles.booksRow}>
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
                        style={{
                          ...styles.bookSpine,
                          backgroundColor: isLocked ? '#D1D5DB' : spineColor,
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          opacity: isLocked ? 0.5 : 1,
                        }}
                        disabled={isLocked}
                        aria-label={isLocked ? `${book.title} (locked)` : book.title}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>{book.title.charAt(0).toUpperCase()}</div>
                        <span style={styles.bookSpineTitle}>{book.title}</span>
                        {bookStars > 0 && (
                          <div style={styles.bookStars}>
                            {[1, 2, 3].map((s) => (
                              <Star
                                key={s}
                                size={12}
                                fill={s <= bookStars ? '#F59E0B' : 'none'}
                                stroke={s <= bookStars ? '#F59E0B' : '#D1D5DB'}
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
                <div style={{
                  ...styles.woodShelf,
                  backgroundColor: SHELF_COLORS[group - 1],
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReadingLibrary;

// --- STYLES ---

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Nunito, sans-serif',
    paddingBottom: 80,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '16px 20px',
    backgroundColor: '#F8F9FA',
    borderBottom: '1px solid #E5E7EB',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    border: '1px solid #E5E7EB',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
  },
  title: {
    fontSize: 22,
    fontWeight: 900,
    color: '#1a1a2e',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 600,
    color: '#64748B',
    margin: 0,
  },
  counter: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    color: '#1A6B5A',
    fontSize: 14,
    fontWeight: 700,
  },
  shelves: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
  shelfSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  shelfLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  shelfGroupNum: {
    fontSize: 12,
    fontWeight: 800,
    color: '#ffffff',
    backgroundColor: '#1A6B5A',
    padding: '2px 8px',
    borderRadius: 8,
  },
  shelfGroupName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#334155',
  },
  shelfSounds: {
    fontSize: 12,
    fontWeight: 600,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  shelf: {
    position: 'relative',
    minHeight: 160,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: '12px 12px 0',
    boxShadow: 'inset 0 -2px 8px rgba(0,0,0,0.04)',
  },
  booksRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    paddingBottom: 6,
  },
  woodShelf: {
    height: 8,
    borderRadius: '0 0 8px 8px',
    marginLeft: -12,
    marginRight: -12,
    marginBottom: 0,
    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
  },
  bookSpine: {
    width: 90,
    minHeight: 120,
    borderRadius: '4px 4px 0 0',
    border: 'none',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '12px 6px',
    boxShadow: '2px 0 4px rgba(0,0,0,0.15), -1px 0 2px rgba(0,0,0,0.08)',
    fontFamily: 'Nunito, sans-serif',
    transition: 'transform 0.2s ease',
  },
  bookSpineEmoji: {
    fontSize: 28,
  },
  bookSpineTitle: {
    fontSize: 10,
    fontWeight: 800,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 1.2,
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  bookStars: {
    display: 'flex',
    gap: 2,
  },
};
