import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Music, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button, Badge } from '../../components/ui';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import PhonicsKaraoke from '../../components/PhonicsKaraoke';
import { PHONICS_SONGS } from '../../data/phonicsSongs';
import { PHONICS_GROUPS } from '../../data/phonics';
import { getLyricsByGroup } from '../../data/phonicsSongLyrics';
import type { PhonicsSong } from '../../data/phonicsSongs';
import { LS_MASTERED_SOUNDS, LS_SONG_PLAYS } from '../../config/storageKeys';
import { useGamification } from '../../contexts/GamificationContext';
import './SongsPage.css';

// ─── Helpers ───────────────────────────────────────────────────────────────

const SONG_GROUP_COLORS = [
  '#FF6B35',
  '#7C3AED',
  '#22C55E',
  '#3B82F6',
  '#F59E0B',
  '#EC4899',
  '#14B8A6',
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
  unlocked.add(1);

  for (const group of PHONICS_GROUPS) {
    const groupSoundIds = group.sounds.map((s) => s.id);
    const allMastered = groupSoundIds.every((id) => mastered.includes(id));
    if (allMastered) {
      unlocked.add(group.group);
      if (group.group + 1 <= 7) unlocked.add(group.group + 1);
    } else if (groupSoundIds.some((id) => mastered.includes(id))) {
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
  const { addXP } = useGamification();

  const mastered = useMemo(() => getMasteredSounds(), []);
  const unlockedGroups = useMemo(() => getUnlockedGroups(mastered), [mastered]);
  // playDataVersion is a manual refresh token — intentionally used as a dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playData = useMemo(() => getSongPlayData(), [playDataVersion]);

  const handleSongComplete = useCallback(async () => {
    if (activeSong) {
      const data = getSongPlayData();
      const isFirstPlay = !data[activeSong.id] || data[activeSong.id].playCount === 0;
      recordSongPlay(activeSong.id);
      setPlayDataVersion((v) => v + 1);
      // Grant XP: 25 XP first completion, 10 XP for repeat plays
      try {
        const xpAmount = isFirstPlay ? 25 : 10;
        await addXP(xpAmount, isFirstPlay ? 'Completed phonics song' : 'Replayed phonics song', {
          songId: activeSong.id,
          group: activeSong.groupNumber,
        });
      } catch {
        // XP award failed silently — progress already saved to localStorage
      }
    }
    setActiveSong(null);
  }, [activeSong, addXP]);

  // ── Playing a song ──
  if (activeSong) {
    const karaokeData = getLyricsByGroup(activeSong.groupNumber);

    return (
      <div className="songs-player-wrapper">
        <div className="songs-player-header">
          <Button
            variant="secondary"
            size="sm"
            icon={<ArrowLeft size={16} />}
            onClick={() => setActiveSong(null)}
          >
            Back
          </Button>
          <div className="songs-mode-toggle">
            <button
              type="button"
              className={`songs-mode-btn${mode === 'karaoke' ? ' songs-mode-btn--active' : ''}`}
              onClick={() => setMode('karaoke')}
            >
              Karaoke
            </button>
            <button
              type="button"
              className={`songs-mode-btn${mode === 'singalong' ? ' songs-mode-btn--active' : ''}`}
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
      className="songs-page"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="songs-header" variants={itemVariants}>
        <button
          type="button"
          onClick={() => navigate('/dashboard')}
          className="songs-back-btn"
          aria-label="Back to dashboard"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="songs-title">
            <Music size={24} />
            Phonics Songs
          </h1>
          <p className="songs-subtitle">Sing and learn your sounds!</p>
        </div>
      </motion.div>

      {/* Song Grid */}
      <motion.div className="songs-grid" variants={containerVariants}>
        {PHONICS_SONGS.length === 0 && (
          <motion.div
            variants={itemVariants}
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '3rem 1rem',
              color: 'var(--text-muted, #9ca3af)',
            }}
          >
            <Music size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem' }}>
              No songs available yet
            </p>
            <p style={{ fontSize: '0.9rem', margin: 0 }}>
              Keep learning sounds — songs unlock as you progress!
            </p>
          </motion.div>
        )}
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
              whileTap={isUnlocked ? { scale: 0.97 } : {}}
              onClick={() => {
                if (isUnlocked) setActiveSong(song);
              }}
              className={`songs-card${isUnlocked ? '' : ' songs-card--locked'}`}
              aria-label={`${song.title}${isUnlocked ? '' : ' (locked)'}`}
            >
              {!isUnlocked && (
                <div className="songs-lock-overlay">
                  <Lock size={24} color="var(--text-muted, #999)" />
                </div>
              )}

              {/* Album cover badge with always-visible play icon */}
              <div
                className="songs-group-badge"
                style={{ background: getSongColor(song.groupNumber) }}
              >
                <span>{song.groupNumber}</span>
                {isUnlocked && (
                  <div className="songs-play-btn" aria-hidden="true">
                    <Play size={22} color="#fff" fill="#fff" />
                  </div>
                )}
              </div>

              <div className="songs-info">
                <p className="songs-song-title">{song.title}</p>
                <p className="songs-song-title-tr">{song.titleTr}</p>

                <div className="songs-meta">
                  <Badge variant="info" size="sm">
                    Group {song.groupNumber}
                  </Badge>
                  <span className="songs-style-pill">
                    {song.style}
                  </span>
                </div>

                {groupData && (
                  <p className="songs-sounds-list">
                    {groupData.sounds.map((s) => s.grapheme).join(', ')}
                  </p>
                )}

                {isUnlocked && (
                  <div className="songs-stats">
                    <div className="songs-stars">
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
                      <span className="songs-play-count">
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
      <motion.div className="songs-info-box" variants={itemVariants}>
        <p className="songs-info-text">
          Songs unlock as you learn sounds in each group.
          Sing songs 5 times to earn 3 stars!
        </p>
      </motion.div>
    </motion.div>
  );
}
