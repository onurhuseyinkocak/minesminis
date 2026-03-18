import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Lock, Music, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import { PHONICS_SONGS } from '../../data/phonicsSongs';
import { PHONICS_GROUPS } from '../../data/phonics';
import type { PhonicsSong } from '../../data/phonicsSongs';
import { LS_MASTERED_SOUNDS, LS_SONG_PLAYS } from '../../config/storageKeys';

// ─── Helpers ───────────────────────────────────────────────────────────────

function getMasteredSounds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[];
  } catch {
    return [];
  }
}

function getUnlockedGroups(mastered: string[]): Set<number> {
  const unlocked = new Set<number>();
  // Group 1 is always unlocked
  unlocked.add(1);

  for (const group of PHONICS_GROUPS) {
    const groupSoundIds = group.sounds.map((s) => s.id);
    const allMastered = groupSoundIds.every((id) => mastered.includes(id));
    if (allMastered) {
      // Unlock this group's song and the next group
      unlocked.add(group.group);
      if (group.group + 1 <= 7) unlocked.add(group.group + 1);
    } else if (groupSoundIds.some((id) => mastered.includes(id))) {
      // Partially mastered — unlock this group
      unlocked.add(group.group);
    }
  }

  return unlocked;
}

function getSongPlayData(): Record<string, { playCount: number; stars: number }> {
  try {
    return JSON.parse(localStorage.getItem(LS_SONG_PLAYS) || '{}') as Record<string, { playCount: number; stars: number }>;
  } catch {
    return {};
  }
}

function recordSongPlay(songId: string) {
  try {
    const data = getSongPlayData();
    if (!data[songId]) {
      data[songId] = { playCount: 0, stars: 0 };
    }
    data[songId].playCount += 1;
    // Award stars based on play count
    if (data[songId].playCount >= 5) data[songId].stars = 3;
    else if (data[songId].playCount >= 3) data[songId].stars = 2;
    else if (data[songId].playCount >= 1) data[songId].stars = 1;

    localStorage.setItem(LS_SONG_PLAYS, JSON.stringify(data));
  } catch {
    // ignore
  }
}

// ─── Animations ────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function SongsPage() {
  const navigate = useNavigate();
  const [activeSong, setActiveSong] = useState<PhonicsSong | null>(null);

  const mastered = useMemo(() => getMasteredSounds(), []);
  const unlockedGroups = useMemo(() => getUnlockedGroups(mastered), [mastered]);
  const playData = useMemo(() => getSongPlayData(), []);

  const handleSongComplete = () => {
    if (activeSong) {
      recordSongPlay(activeSong.id);
    }
    setActiveSong(null);
  };

  // ── Playing a song ──
  if (activeSong) {
    return (
      <div style={styles.playerWrapper}>
        <div style={styles.playerHeader}>
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => setActiveSong(null)}
          >
            Back
          </Button>
        </div>
        <SongPlayer
          song={activeSong}
          mode="singalong"
          onComplete={handleSongComplete}
        />
      </div>
    );
  }

  // ── Song library ──
  return (
    <motion.div
      style={styles.page}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div style={styles.header} variants={itemVariants}>
        <button
          onClick={() => navigate('/dashboard')}
          style={styles.backBtn}
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 style={styles.title}>
            <Music size={24} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            Phonics Songs
          </h1>
          <p style={styles.subtitle}>Sing and learn your sounds!</p>
        </div>
      </motion.div>

      {/* Song Grid */}
      <motion.div style={styles.grid} variants={containerVariants}>
        {PHONICS_SONGS.map((song) => {
          const isUnlocked = unlockedGroups.has(song.groupNumber);
          const data = playData[song.id];
          const starCount = data?.stars || 0;
          const plays = data?.playCount || 0;
          const groupData = PHONICS_GROUPS.find((g) => g.group === song.groupNumber);

          return (
            <motion.button
              key={song.id}
              variants={itemVariants}
              whileTap={isUnlocked ? { scale: 0.95 } : {}}
              onClick={() => {
                if (isUnlocked) setActiveSong(song);
              }}
              style={{
                ...styles.songCard,
                opacity: isUnlocked ? 1 : 0.5,
                cursor: isUnlocked ? 'pointer' : 'not-allowed',
              }}
            >
              {!isUnlocked && (
                <div style={styles.lockOverlay}>
                  <Lock size={24} color="#999" />
                </div>
              )}

              <span style={styles.songEmoji}>{song.emoji}</span>

              <div style={styles.songInfo}>
                <p style={styles.songTitle}>{song.title}</p>
                <p style={styles.songTitleTr}>{song.titleTr}</p>

                <div style={styles.songMeta}>
                  <Badge variant="info" size="sm">
                    Group {song.groupNumber}
                  </Badge>
                  <span style={styles.songStyle}>
                    {song.style === 'nursery' && '\u{1F3B6}'}
                    {song.style === 'chant' && '\u{1F44F}'}
                    {song.style === 'rap' && '\u{1F3A4}'}
                    {song.style === 'lullaby' && '\u{1F31C}'}
                    {' '}{song.style}
                  </span>
                </div>

                {groupData && (
                  <p style={styles.soundsList}>
                    {groupData.sounds.map((s) => s.grapheme).join(', ')}
                  </p>
                )}

                {isUnlocked && (
                  <div style={styles.songStats}>
                    <div style={styles.stars}>
                      {[1, 2, 3].map((n) => (
                        <Star
                          key={n}
                          size={14}
                          fill={n <= starCount ? '#E8A317' : 'none'}
                          color={n <= starCount ? '#E8A317' : '#d1d5db'}
                        />
                      ))}
                    </div>
                    {plays > 0 && (
                      <span style={styles.playCount}>
                        {'\u{25B6}'} {plays}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Info */}
      <motion.div style={styles.infoBox} variants={itemVariants}>
        <p style={styles.infoText}>
          {'\u{1F4A1}'} Songs unlock as you learn sounds in each group.
          Sing songs 5 times to earn 3 stars!
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    padding: '1rem 1.5rem 2rem',
    maxWidth: 600,
    margin: '0 auto',
    fontFamily: 'Nunito, sans-serif',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#1A6B5A',
    padding: '0.25rem',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.85rem',
    color: '#888',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '1rem',
  },
  songCard: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    padding: '1rem',
    borderRadius: '1rem',
    border: '2px solid #e5e7eb',
    backgroundColor: '#fff',
    textAlign: 'left' as const,
    fontFamily: 'Nunito, sans-serif',
    transition: 'all 0.2s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  lockOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  songEmoji: {
    fontSize: '2.5rem',
    flexShrink: 0,
  },
  songInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    flex: 1,
    minWidth: 0,
  },
  songTitle: {
    fontSize: '1rem',
    fontWeight: 800,
    color: '#1A6B5A',
    margin: 0,
  },
  songTitleTr: {
    fontSize: '0.75rem',
    color: '#999',
    fontStyle: 'italic',
    margin: 0,
  },
  songMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  songStyle: {
    fontSize: '0.75rem',
    color: '#888',
    textTransform: 'capitalize' as const,
  },
  soundsList: {
    fontSize: '0.75rem',
    color: '#aaa',
    margin: 0,
    fontFamily: 'monospace',
  },
  songStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.25rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  playCount: {
    fontSize: '0.7rem',
    color: '#999',
  },
  playerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem 1.5rem 2rem',
    maxWidth: 540,
    margin: '0 auto',
    minHeight: '100vh',
    fontFamily: 'Nunito, sans-serif',
  },
  playerHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  infoBox: {
    padding: '0.75rem 1rem',
    background: '#f0fdf4',
    borderRadius: '0.75rem',
    border: '1px solid #d1fae5',
  },
  infoText: {
    fontSize: '0.8rem',
    color: '#555',
    margin: 0,
    lineHeight: 1.5,
  },
};
