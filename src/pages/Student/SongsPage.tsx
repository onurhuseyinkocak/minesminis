import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Music, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import PhonicsKaraoke from '../../components/PhonicsKaraoke';
import { PHONICS_SONGS } from '../../data/phonicsSongs';
import { PHONICS_GROUPS } from '../../data/phonics';
import { getLyricsByGroup } from '../../data/phonicsSongLyrics';
import type { PhonicsSong } from '../../data/phonicsSongs';
import { LS_MASTERED_SOUNDS, LS_SONG_PLAYS } from '../../config/storageKeys';

// ─── Helpers ───────────────────────────────────────────────────────────────

// Returns a Tailwind background color class for each group (1-based)
const SONG_GROUP_COLORS = [
  '#FF6B35', // orange-500-ish
  '#7C3AED', // violet-600
  '#22C55E', // green-500
  '#3B82F6', // blue-500
  '#F59E0B', // amber-500
  '#EC4899', // pink-500
  '#14B8A6', // teal-500
];

function getSongColor(g: number): string {
  return SONG_GROUP_COLORS[(g - 1) % SONG_GROUP_COLORS.length];
}

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
  const [mode, setMode] = useState<'singalong' | 'karaoke'>('karaoke');
  const [playDataVersion, setPlayDataVersion] = useState(0);

  const mastered = useMemo(() => getMasteredSounds(), []);
  const unlockedGroups = useMemo(() => getUnlockedGroups(mastered), [mastered]);
  const playData = useMemo(() => getSongPlayData(), [playDataVersion]);

  const handleSongComplete = useCallback(() => {
    if (activeSong) {
      recordSongPlay(activeSong.id);
      setPlayDataVersion((v) => v + 1);
    }
    setActiveSong(null);
  }, [activeSong]);

  // ── Playing a song ──
  if (activeSong) {
    const karaokeData = getLyricsByGroup(activeSong.groupNumber);

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
          {/* Mode toggle */}
          <div style={styles.modeToggle}>
            <button
              type="button"
              style={{
                ...styles.modeBtn,
                ...(mode === 'karaoke' ? styles.modeBtnActive : {}),
              }}
              onClick={() => setMode('karaoke')}
            >
              Karaoke
            </button>
            <button
              type="button"
              style={{
                ...styles.modeBtn,
                ...(mode === 'singalong' ? styles.modeBtnActive : {}),
              }}
              onClick={() => setMode('singalong')}
            >
              Classic
            </button>
          </div>
        </div>

        {mode === 'karaoke' && karaokeData ? (
          <PhonicsKaraoke
            lyrics={karaokeData}
            onComplete={handleSongComplete}
          />
        ) : (
          <SongPlayer
            song={activeSong}
            mode="singalong"
            onComplete={handleSongComplete}
          />
        )}
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
          type="button"
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
          const starCount = data?.stars ?? 0;
          const plays = data?.playCount ?? 0;
          const groupData = PHONICS_GROUPS.find((g) => g.group === song.groupNumber);

          return (
            <motion.button
              type="button"
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
                  <Lock size={24} color="var(--text-muted, #999)" />
                </div>
              )}

              <div style={{ ...styles.songGroupBadge, background: getSongColor(song.groupNumber) }}>
                {song.groupNumber}
              </div>

              <div style={styles.songInfo}>
                <p style={styles.songTitle}>{song.title}</p>
                <p style={styles.songTitleTr}>{song.titleTr}</p>

                <div style={styles.songMeta}>
                  <Badge variant="info" size="sm">
                    Group {song.groupNumber}
                  </Badge>
                  <span style={styles.songStyle}>
                    {song.style}
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
                          color={n <= starCount ? '#E8A317' : 'var(--border, #d1d5db)'}
                        />
                      ))}
                    </div>
                    {plays > 0 && (
                      <span style={styles.playCount}>
                        &#9654; {plays}
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
          Songs unlock as you learn sounds in each group.
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
    gap: '1.5rem',
    padding: '1rem 1.5rem 2.5rem',
    maxWidth: 640,
    margin: '0 auto',
    background: 'var(--bg-page, #FFF8F2)',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  backBtn: {
    width: 44,
    height: 44,
    background: 'var(--accent-purple-pale, #EDE9FE)',
    border: '2px solid var(--accent-purple-light, #a78bfa)',
    borderRadius: '50%',
    cursor: 'pointer',
    color: 'var(--accent-purple, #8b5cf6)',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-display, Nunito, sans-serif)',
    fontSize: '1.6rem',
    fontWeight: 900,
    color: 'var(--text-primary, #1a1a2e)',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    fontSize: '0.85rem',
    color: 'var(--text-muted, #94A3B8)',
    margin: 0,
    fontWeight: 600,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
    gap: '1rem',
  },
  /* Album-cover style song cards */
  songCard: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1.1rem',
    borderRadius: 'var(--radius-lg, 16px)',
    border: '2px solid var(--border, #E2E8F0)',
    backgroundColor: 'var(--bg-card, #ffffff)',
    textAlign: 'left' as const,
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    fontFamily: 'var(--font-body, Inter, sans-serif)',
  },
  lockOverlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    background: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    padding: 4,
  },
  /* Album-cover badge — large, rounded square */
  songGroupBadge: {
    width: 58,
    height: 58,
    borderRadius: 'var(--radius-lg, 16px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    fontWeight: 900,
    fontFamily: 'var(--font-display, Nunito, sans-serif)',
    color: 'white',
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  songInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    flex: 1,
    minWidth: 0,
  },
  songTitle: {
    fontFamily: 'var(--font-display, Nunito, sans-serif)',
    fontSize: '1.05rem',
    fontWeight: 800,
    color: 'var(--text-primary, #1a1a2e)',
    margin: 0,
    lineHeight: 1.25,
  },
  songTitleTr: {
    fontSize: '0.78rem',
    color: 'var(--text-muted, #94A3B8)',
    fontStyle: 'italic',
    margin: 0,
  },
  songMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.3rem',
  },
  songStyle: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted, #94A3B8)',
    textTransform: 'capitalize' as const,
    background: 'var(--bg-muted, #F1F5F9)',
    padding: '2px 8px',
    borderRadius: 'var(--radius-full, 9999px)',
  },
  soundsList: {
    fontSize: '0.72rem',
    color: 'var(--accent-purple, #8b5cf6)',
    margin: 0,
    fontFamily: 'var(--font-mono, monospace)',
    fontWeight: 600,
  },
  songStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginTop: '0.35rem',
  },
  stars: {
    display: 'flex',
    gap: '2px',
  },
  playCount: {
    fontSize: '0.72rem',
    fontWeight: 700,
    color: 'var(--text-muted, #94A3B8)',
    fontFamily: 'var(--font-display, Nunito, sans-serif)',
  },
  playerWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '1rem 1.5rem 2.5rem',
    maxWidth: 540,
    margin: '0 auto',
    minHeight: '100vh',
    background: 'var(--bg-page, #FFF8F2)',
  },
  playerHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  modeToggle: {
    display: 'flex',
    background: 'var(--bg-muted, #F1F5F9)',
    borderRadius: 'var(--radius-full, 9999px)',
    padding: '3px',
    gap: '2px',
    marginLeft: 'auto',
    border: '1px solid var(--border, #E2E8F0)',
  },
  modeBtn: {
    padding: '6px 14px',
    border: 'none',
    background: 'transparent',
    borderRadius: 'var(--radius-full, 9999px)',
    fontSize: '0.78rem',
    fontWeight: 700,
    fontFamily: 'var(--font-display, Nunito, sans-serif)',
    color: 'var(--text-muted, #94A3B8)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    minHeight: 36,
  } as React.CSSProperties,
  modeBtnActive: {
    background: 'var(--bg-card, #fff)',
    color: 'var(--accent-purple, #8b5cf6)',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  } as React.CSSProperties,
  infoBox: {
    padding: '0.85rem 1.1rem',
    background: 'var(--accent-purple-pale, #EDE9FE)',
    borderRadius: 'var(--radius-md, 12px)',
    border: '1.5px solid rgba(139, 92, 246, 0.15)',
  },
  infoText: {
    fontFamily: 'var(--font-body, Inter, sans-serif)',
    fontSize: '0.82rem',
    color: 'var(--accent-purple, #8b5cf6)',
    margin: 0,
    lineHeight: 1.55,
    fontWeight: 600,
  },
};
