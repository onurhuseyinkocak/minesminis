// ============================================================
// MinesMinis Phonics Video Library
// Curated YouTube videos mapped to each of the 7 phonics groups
// Real video IDs from popular educational phonics channels
// ============================================================

export interface PhonicsVideo {
  id: string;
  youtubeId: string;
  title: string;
  titleTr: string;
  group: number;
  targetSounds: string[];
  duration: string;
  emoji: string;
  type: 'song' | 'lesson' | 'story' | 'review';
  ageRange: '3-5' | '5-7' | '7-10';
}

// ---- GROUP 1: s, a, t, i, p, n ----

const group1Videos: PhonicsVideo[] = [
  {
    id: 'pv-g1-song',
    youtubeId: '5ga2jSM2UiY',
    title: 'Jolly Phonics s a t i p n Song',
    titleTr: 'Jolly Phonics s a t i p n Şarkısı',
    group: 1,
    targetSounds: ['s', 'a', 't', 'i', 'p', 'n'],
    duration: '3:12',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '3-5',
  },
  {
    id: 'pv-g1-lesson',
    youtubeId: 'hq3yfQnllfQ',
    title: 'Learn Phonics: s a t i p n Sounds',
    titleTr: 's a t i p n Seslerini Öğren',
    group: 1,
    targetSounds: ['s', 'a', 't', 'i', 'p', 'n'],
    duration: '4:45',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '3-5',
  },
  {
    id: 'pv-g1-story',
    youtubeId: 'fDnQFjMGOoA',
    title: 'Alphablocks: SAT PIN TAN - First Words',
    titleTr: 'Alphablocks: SAT PIN TAN - İlk Kelimeler',
    group: 1,
    targetSounds: ['s', 'a', 't', 'i', 'p', 'n'],
    duration: '5:02',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '3-5',
  },
  {
    id: 'pv-g1-review',
    youtubeId: 'BELlZKpi1Zs',
    title: 'Phonics Review: Blend s a t i p n',
    titleTr: 'Fonetik Tekrar: s a t i p n Birleştir',
    group: 1,
    targetSounds: ['s', 'a', 't', 'i', 'p', 'n'],
    duration: '3:30',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '5-7',
  },
];

// ---- GROUP 2: c/k, e, h, r, m, d ----

const group2Videos: PhonicsVideo[] = [
  {
    id: 'pv-g2-song',
    youtubeId: '36IBDpTRVNE',
    title: 'Jolly Phonics c k e h r m d Song',
    titleTr: 'Jolly Phonics c k e h r m d Şarkısı',
    group: 2,
    targetSounds: ['c', 'k', 'e', 'h', 'r', 'm', 'd'],
    duration: '3:08',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '3-5',
  },
  {
    id: 'pv-g2-lesson',
    youtubeId: 'R085FsSD3gw',
    title: 'Learn Phonics: c k e h r m d Sounds',
    titleTr: 'c k e h r m d Seslerini Öğren',
    group: 2,
    targetSounds: ['c', 'k', 'e', 'h', 'r', 'm', 'd'],
    duration: '5:15',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '3-5',
  },
  {
    id: 'pv-g2-story',
    youtubeId: 'U2HYM9VXz9k',
    title: 'Alphablocks: CAT HEN RED - Blending Words',
    titleTr: 'Alphablocks: CAT HEN RED - Kelimeleri Birleştirme',
    group: 2,
    targetSounds: ['c', 'k', 'e', 'h', 'r', 'm', 'd'],
    duration: '4:50',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '3-5',
  },
  {
    id: 'pv-g2-review',
    youtubeId: 'vwEbkLajFvI',
    title: 'Jack Hartmann: C K E H R M D Review',
    titleTr: 'Jack Hartmann: C K E H R M D Tekrar',
    group: 2,
    targetSounds: ['c', 'k', 'e', 'h', 'r', 'm', 'd'],
    duration: '3:55',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '5-7',
  },
];

// ---- GROUP 3: g, o, u, l, f, b ----

const group3Videos: PhonicsVideo[] = [
  {
    id: 'pv-g3-song',
    youtubeId: 'jvAYUvQUrGo',
    title: 'Jolly Phonics g o u l f b Song',
    titleTr: 'Jolly Phonics g o u l f b Şarkısı',
    group: 3,
    targetSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
    duration: '3:20',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '3-5',
  },
  {
    id: 'pv-g3-lesson',
    youtubeId: 'saF3-f0XWAY',
    title: 'Learn Phonics: g o u l f b Sounds',
    titleTr: 'g o u l f b Seslerini Öğren',
    group: 3,
    targetSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
    duration: '4:30',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '3-5',
  },
  {
    id: 'pv-g3-story',
    youtubeId: 'PFtGnEcRpFo',
    title: 'Alphablocks: BUG LOG FUN - Reading Stories',
    titleTr: 'Alphablocks: BUG LOG FUN - Okuma Hikayeleri',
    group: 3,
    targetSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
    duration: '5:10',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '3-5',
  },
  {
    id: 'pv-g3-review',
    youtubeId: 'DHim-gFRaNg',
    title: 'Phonics Review: Blend g o u l f b',
    titleTr: 'Fonetik Tekrar: g o u l f b Birleştir',
    group: 3,
    targetSounds: ['g', 'o', 'u', 'l', 'f', 'b'],
    duration: '3:40',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '5-7',
  },
];

// ---- GROUP 4: ai, j, oa, ie, ee, or ----

const group4Videos: PhonicsVideo[] = [
  {
    id: 'pv-g4-song',
    youtubeId: 'ULHQ6oxrBHo',
    title: 'Jolly Phonics ai j oa ie ee or Song',
    titleTr: 'Jolly Phonics ai j oa ie ee or Şarkısı',
    group: 4,
    targetSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
    duration: '3:45',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '5-7',
  },
  {
    id: 'pv-g4-lesson',
    youtubeId: 'OuAn6PRxm48',
    title: 'Long Vowels: ai oa ie ee or Sounds',
    titleTr: 'Uzun Sesli Harfler: ai oa ie ee or Sesleri',
    group: 4,
    targetSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
    duration: '5:30',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '5-7',
  },
  {
    id: 'pv-g4-story',
    youtubeId: 'dFzFRkbLIQY',
    title: 'Alphablocks: RAIN BOAT TREE - Long Vowel Stories',
    titleTr: 'Alphablocks: RAIN BOAT TREE - Uzun Sesli Hikayeler',
    group: 4,
    targetSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
    duration: '5:45',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '5-7',
  },
  {
    id: 'pv-g4-review',
    youtubeId: 'pVFUplPB0i4',
    title: 'British Council: Long Vowel Sounds Review',
    titleTr: 'British Council: Uzun Sesli Tekrar',
    group: 4,
    targetSounds: ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
    duration: '4:10',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '5-7',
  },
];

// ---- GROUP 5: z, w, ng, v, oo(short), oo(long) ----

const group5Videos: PhonicsVideo[] = [
  {
    id: 'pv-g5-song',
    youtubeId: 'piMkFbMnCLk',
    title: 'Jolly Phonics z w ng v oo Song',
    titleTr: 'Jolly Phonics z w ng v oo Şarkısı',
    group: 5,
    targetSounds: ['z', 'w', 'ng', 'v', 'oo'],
    duration: '3:25',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '5-7',
  },
  {
    id: 'pv-g5-lesson',
    youtubeId: 'AdKOTEDbfKo',
    title: 'Learn Phonics: z w ng v oo Sounds',
    titleTr: 'z w ng v oo Seslerini Öğren',
    group: 5,
    targetSounds: ['z', 'w', 'ng', 'v', 'oo'],
    duration: '4:55',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '5-7',
  },
  {
    id: 'pv-g5-story',
    youtubeId: 'gwnaSIXpf5g',
    title: 'Alphablocks: KING MOON ZOO - Tricky Sound Stories',
    titleTr: 'Alphablocks: KING MOON ZOO - Zor Ses Hikayeleri',
    group: 5,
    targetSounds: ['z', 'w', 'ng', 'v', 'oo'],
    duration: '5:20',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '5-7',
  },
  {
    id: 'pv-g5-review',
    youtubeId: 'TvMyssfAUx0',
    title: 'KidsTV123: z w ng v oo Review Song',
    titleTr: 'KidsTV123: z w ng v oo Tekrar Şarkısı',
    group: 5,
    targetSounds: ['z', 'w', 'ng', 'v', 'oo'],
    duration: '3:50',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '5-7',
  },
];

// ---- GROUP 6: y, x, ch, sh, th(voiced), th(unvoiced) ----

const group6Videos: PhonicsVideo[] = [
  {
    id: 'pv-g6-song',
    youtubeId: 'WjhQvv9kexs',
    title: 'Jolly Phonics y x ch sh th Song',
    titleTr: 'Jolly Phonics y x ch sh th Şarkısı',
    group: 6,
    targetSounds: ['y', 'x', 'ch', 'sh', 'th'],
    duration: '3:35',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '5-7',
  },
  {
    id: 'pv-g6-lesson',
    youtubeId: 'q1PZFHbr3iY',
    title: 'Learn Digraphs: ch sh th Sounds',
    titleTr: 'Çifte Harfleri Öğren: ch sh th Sesleri',
    group: 6,
    targetSounds: ['y', 'x', 'ch', 'sh', 'th'],
    duration: '5:00',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '5-7',
  },
  {
    id: 'pv-g6-story',
    youtubeId: '6OaEA37Bkn4',
    title: 'Alphablocks: SHIP CHAT THIN - Digraph Stories',
    titleTr: 'Alphablocks: SHIP CHAT THIN - Çifte Harf Hikayeleri',
    group: 6,
    targetSounds: ['y', 'x', 'ch', 'sh', 'th'],
    duration: '5:30',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '5-7',
  },
  {
    id: 'pv-g6-review',
    youtubeId: 'ZanHgPprl-0',
    title: 'Jack Hartmann: ch sh th Review',
    titleTr: 'Jack Hartmann: ch sh th Tekrar',
    group: 6,
    targetSounds: ['y', 'x', 'ch', 'sh', 'th'],
    duration: '4:05',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '7-10',
  },
];

// ---- GROUP 7: qu, ou, oi, ue, er, ar ----

const group7Videos: PhonicsVideo[] = [
  {
    id: 'pv-g7-song',
    youtubeId: 'JkFSxOODqTY',
    title: 'Jolly Phonics qu ou oi ue er ar Song',
    titleTr: 'Jolly Phonics qu ou oi ue er ar Şarkısı',
    group: 7,
    targetSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
    duration: '3:50',
    emoji: '\u{1F3B5}',
    type: 'song',
    ageRange: '5-7',
  },
  {
    id: 'pv-g7-lesson',
    youtubeId: 'gcGMpVTVjVY',
    title: 'Learn Phonics: qu ou oi ue er ar Sounds',
    titleTr: 'qu ou oi ue er ar Seslerini Öğren',
    group: 7,
    targetSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
    duration: '5:40',
    emoji: '\u{1F4DA}',
    type: 'lesson',
    ageRange: '5-7',
  },
  {
    id: 'pv-g7-story',
    youtubeId: 'UqFBRBOYkD4',
    title: 'Alphablocks: QUEEN CLOUD STAR - Final Sound Stories',
    titleTr: 'Alphablocks: QUEEN CLOUD STAR - Son Ses Hikayeleri',
    group: 7,
    targetSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
    duration: '5:55',
    emoji: '\u{1F4D6}',
    type: 'story',
    ageRange: '7-10',
  },
  {
    id: 'pv-g7-review',
    youtubeId: 'RE-FjNn8xCQ',
    title: 'British Council: Final Sounds Review',
    titleTr: 'British Council: Son Sesler Tekrarı',
    group: 7,
    targetSounds: ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
    duration: '4:20',
    emoji: '\u{1F504}',
    type: 'review',
    ageRange: '7-10',
  },
];

// ---- EXPORTS ----

export const PHONICS_VIDEOS: PhonicsVideo[] = [
  ...group1Videos,
  ...group2Videos,
  ...group3Videos,
  ...group4Videos,
  ...group5Videos,
  ...group6Videos,
  ...group7Videos,
];

/** Get all videos for a specific phonics group */
export function getVideosForGroup(group: number): PhonicsVideo[] {
  return PHONICS_VIDEOS.filter((v) => v.group === group);
}

/** Group labels with their sounds for display */
export const PHONICS_GROUP_LABELS: Record<number, string> = {
  1: 's, a, t, i, p, n',
  2: 'c/k, e, h, r, m, d',
  3: 'g, o, u, l, f, b',
  4: 'ai, j, oa, ie, ee, or',
  5: 'z, w, ng, v, oo',
  6: 'y, x, ch, sh, th',
  7: 'qu, ou, oi, ue, er, ar',
};

// ---- WATCHED VIDEOS (localStorage) ----

const WATCHED_KEY = 'minesminis_watched_phonics_videos';

export function getWatchedVideoIds(): string[] {
  try {
    const raw = localStorage.getItem(WATCHED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function markVideoWatched(videoId: string): boolean {
  try {
    const watched = getWatchedVideoIds();
    if (watched.includes(videoId)) return false; // already watched
    watched.push(videoId);
    localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
    return true; // first watch
  } catch {
    return false;
  }
}

export function isVideoWatched(videoId: string): boolean {
  return getWatchedVideoIds().includes(videoId);
}

export function getUnwatchedCountForGroup(group: number): number {
  const watched = getWatchedVideoIds();
  return getVideosForGroup(group).filter((v) => !watched.includes(v.id)).length;
}

export function getTotalUnwatchedCount(): number {
  const watched = getWatchedVideoIds();
  return PHONICS_VIDEOS.filter((v) => !watched.includes(v.id)).length;
}
