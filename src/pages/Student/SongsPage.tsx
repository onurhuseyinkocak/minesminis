/**
 * SongsPage — Big song cards with play buttons.
 * Mobile-first, light mode only, all Tailwind inline.
 */
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Music, Play, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SongPlayer } from '../../components/phonics/SongPlayer';
import PhonicsKaraoke from '../../components/PhonicsKaraoke';
import { PHONICS_SONGS } from '../../data/phonicsSongs';
import { PHONICS_GROUPS } from '../../data/phonics';
import { getLyricsByGroup } from '../../data/phonicsSongLyrics';
import type { PhonicsSong } from '../../data/phonicsSongs';
import { LS_MASTERED_SOUNDS, LS_SONG_PLAYS } from '../../config/storageKeys';
import { useGamification } from '../../contexts/GamificationContext';

const SONG_COLORS = ['#FF6B35', '#7C3AED', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#14B8A6'];

function getSongColor(g: number): string { return SONG_COLORS[(g - 1) % SONG_COLORS.length]; }

function getMasteredSounds(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_MASTERED_SOUNDS) || '[]') as string[]; } catch { return []; }
}

function getUnlockedGroups(mastered: string[]): Set<number> {
  const unlocked = new Set<number>([1]);
  for (const group of PHONICS_GROUPS) {
    const ids = group.sounds.map((s) => s.id);
    if (ids.every((id) => mastered.includes(id))) { unlocked.add(group.group); if (group.group + 1 <= 7) unlocked.add(group.group + 1); }
    else if (ids.some((id) => mastered.includes(id))) { unlocked.add(group.group); }
  }
  return unlocked;
}

function getSongPlayData(): Record<string, { playCount: number; stars: number }> {
  try { return JSON.parse(localStorage.getItem(LS_SONG_PLAYS) || '{}') as Record<string, { playCount: number; stars: number }>; } catch { return {}; }
}

function recordSongPlay(songId: string) {
  try {
    const data = getSongPlayData();
    if (!data[songId]) data[songId] = { playCount: 0, stars: 0 };
    data[songId].playCount += 1;
    if (data[songId].playCount >= 5) data[songId].stars = 3;
    else if (data[songId].playCount >= 3) data[songId].stars = 2;
    else if (data[songId].playCount >= 1) data[songId].stars = 1;
    localStorage.setItem(LS_SONG_PLAYS, JSON.stringify(data));
  } catch { /* ignore */ }
}

export default function SongsPage() {
  const navigate = useNavigate();
  const [activeSong, setActiveSong] = useState<PhonicsSong | null>(null);
  const [mode, setMode] = useState<'singalong' | 'karaoke'>('karaoke');
  const [playDataVersion, setPlayDataVersion] = useState(0);
  const { addXP } = useGamification();

  const mastered = useMemo(() => getMasteredSounds(), []);
  const unlockedGroups = useMemo(() => getUnlockedGroups(mastered), [mastered]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const playData = useMemo(() => getSongPlayData(), [playDataVersion]);

  const handleSongComplete = useCallback(async () => {
    if (activeSong) {
      const data = getSongPlayData();
      const isFirstPlay = !data[activeSong.id] || data[activeSong.id].playCount === 0;
      recordSongPlay(activeSong.id);
      setPlayDataVersion((v) => v + 1);
      try {
        const xp = isFirstPlay ? 25 : 10;
        await addXP(xp, isFirstPlay ? 'Completed phonics song' : 'Replayed phonics song', { songId: activeSong.id, group: activeSong.groupNumber });
      } catch { /* XP failed silently */ }
    }
    setActiveSong(null);
  }, [activeSong, addXP]);

  // Playing a song
  if (activeSong) {
    const karaokeData = getLyricsByGroup(activeSong.groupNumber);
    return (
      <div className="min-h-screen bg-white px-4 py-4">
        <div className="flex items-center gap-3 mb-4">
          <button type="button" onClick={() => setActiveSong(null)} className="w-12 h-12 rounded-3xl bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div className="flex gap-2">
            <button type="button" onClick={() => setMode('karaoke')} className={`min-h-[48px] px-4 rounded-3xl text-sm font-bold ${mode === 'karaoke' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Karaoke</button>
            <button type="button" onClick={() => setMode('singalong')} className={`min-h-[48px] px-4 rounded-3xl text-sm font-bold ${mode === 'singalong' ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-600'}`}>Classic</button>
          </div>
        </div>
        {mode === 'karaoke' && karaokeData ? (
          <PhonicsKaraoke lyrics={karaokeData} onComplete={handleSongComplete} />
        ) : (
          <SongPlayer song={activeSong} mode="singalong" onComplete={handleSongComplete} />
        )}
      </div>
    );
  }

  // Song library
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button type="button" onClick={() => navigate('/dashboard')} aria-label="Back to dashboard" className="w-12 h-12 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
              <Music size={22} className="text-violet-500" /> Phonics Songs
            </h1>
            <p className="text-sm text-gray-500">Sing and learn your sounds!</p>
          </div>
        </div>

        {/* Song Grid */}
        <div className="flex flex-col gap-3 mb-6">
          {PHONICS_SONGS.length === 0 && (
            <div className="text-center py-12">
              <Music size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No songs available yet</p>
            </div>
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
                whileTap={isUnlocked ? { scale: 0.97 } : {}}
                onClick={() => { if (isUnlocked) setActiveSong(song); }}
                className={`relative rounded-3xl p-4 flex items-center gap-4 border-2 text-left transition-all ${isUnlocked ? 'bg-white border-gray-100 shadow-sm active:scale-[0.98]' : 'bg-gray-50 border-gray-100 opacity-50'}`}
                aria-label={`${song.title}${isUnlocked ? '' : ' (locked)'}`}
              >
                {!isUnlocked && (
                  <div className="absolute inset-0 rounded-3xl flex items-center justify-center z-10">
                    <Lock size={24} className="text-gray-400" />
                  </div>
                )}

                {/* Group badge */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 relative" style={{ background: getSongColor(song.groupNumber) }}>
                  <span className="text-white font-extrabold text-lg">{song.groupNumber}</span>
                  {isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                      <Play size={14} className="text-gray-700" fill="currentColor" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-gray-900 truncate">{song.title}</p>
                  <p className="text-xs text-gray-500 truncate">{song.titleTr}</p>
                  {groupData && (
                    <p className="text-[10px] text-gray-400 mt-1 truncate">{groupData.sounds.map((s) => s.grapheme).join(', ')}</p>
                  )}
                  {isUnlocked && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex">
                        {[1, 2, 3].map((n) => (
                          <Star key={n} size={12} fill={n <= starCount ? '#E8A317' : 'none'} color={n <= starCount ? '#E8A317' : '#D1D5DB'} />
                        ))}
                      </div>
                      {plays > 0 && <span className="text-[10px] text-gray-400">{plays}x</span>}
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Info */}
        <div className="rounded-3xl bg-sky-50 border border-sky-100 p-4 text-center">
          <p className="text-xs text-sky-700 font-medium">Songs unlock as you learn sounds. Sing 5 times to earn 3 stars!</p>
        </div>
      </div>
    </div>
  );
}
