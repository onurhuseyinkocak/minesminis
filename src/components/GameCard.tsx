import { motion } from 'framer-motion';
import {
  Layers, Zap, PenTool, Music, Type, Shuffle, Hash, Users, Merge, Mic, Mic2,
  Headphones, MessageCircle, Image, Scissors, AlertTriangle, BookOpen,
  Star, Lock, Play,
} from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import type { GameMeta } from '../data/miniGamesData';
import { useLanguage } from '../contexts/LanguageContext';

export interface GameCardProps {
  game: GameMeta;
  isLocked: boolean;
  userLevel: number;
  bestScore?: number;
  isNew?: boolean;
  activeTopic?: string;
  isRecommended?: boolean;
  onPlay: (game: GameMeta) => void;
}

/* ── Icon Mapping ── */
const GAME_ICONS: Record<string, React.ComponentType<LucideProps>> = {
  'word-match': Layers,
  'quick-quiz': Zap,
  'spelling-bee': PenTool,
  'rhyme': Music,
  'sentence-builder': Type,
  'sentence-scramble': Shuffle,
  'syllable': Hash,
  'word-family': Users,
  'phonics-blend': Merge,
  'pronunciation': Mic,
  'say-it': Mic2,
  'listening': Headphones,
  'dialogue': MessageCircle,
  'image-label': Image,
  'phoneme-manipulation': Scissors,
  'phonetic-trap': AlertTriangle,
  'story-choices': BookOpen,
};

/* ── Category Colors ── */
const CATEGORY_COLORS: Record<string, {
  bg: string; text: string; border: string; gradient: string;
  stripe: string; iconBg: string;
}> = {
  vocabulary: {
    bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200',
    gradient: 'from-blue-400 to-cyan-500', stripe: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    iconBg: 'bg-blue-50',
  },
  phonics: {
    bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200',
    gradient: 'from-purple-400 to-violet-500', stripe: 'bg-gradient-to-r from-purple-400 to-violet-500',
    iconBg: 'bg-purple-50',
  },
  reading: {
    bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200',
    gradient: 'from-emerald-400 to-green-500', stripe: 'bg-gradient-to-r from-emerald-400 to-green-500',
    iconBg: 'bg-emerald-50',
  },
  speaking: {
    bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200',
    gradient: 'from-orange-400 to-amber-500', stripe: 'bg-gradient-to-r from-orange-400 to-amber-500',
    iconBg: 'bg-orange-50',
  },
};

const CATEGORY_LABELS: Record<string, { en: string; tr: string }> = {
  vocabulary: { en: 'Vocab', tr: 'Kelime' },
  phonics: { en: 'Phonics', tr: 'Fonetik' },
  reading: { en: 'Reading', tr: 'Okuma' },
  speaking: { en: 'Speaking', tr: 'Konusma' },
};

/* ── Difficulty Stars ── */
function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`Difficulty: ${level} out of 3`}>
      {[1, 2, 3].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= level ? 'text-amber-400' : 'text-gray-200'}
          fill={n <= level ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  );
}

/* ── GameCard ── */
export function GameCard({
  game,
  isLocked,
  userLevel: _userLevel,
  bestScore,
  isNew,
  activeTopic: _activeTopic,
  isRecommended = false,
  onPlay,
}: GameCardProps) {
  const { t: _t, lang } = useLanguage();

  const colors = CATEGORY_COLORS[game.category] ?? CATEGORY_COLORS.vocabulary;
  const catLabel = CATEGORY_LABELS[game.category];
  const IconComponent = GAME_ICONS[game.type] ?? Play;
  const displayName = lang === 'tr' ? game.nameTr : game.name;

  return (
    <motion.div
      className={[
        'relative flex flex-col bg-white rounded-3xl shadow-sm border overflow-hidden min-h-[220px] cursor-pointer select-none',
        'transition-shadow duration-200',
        isLocked ? 'opacity-80 cursor-not-allowed border-gray-200' : 'border-gray-100 hover:shadow-md',
        isRecommended ? 'ring-2 ring-offset-2 ring-amber-400 animate-pulse-slow' : '',
      ].join(' ')}
      whileHover={isLocked ? undefined : { scale: 1.02 }}
      whileTap={isLocked ? undefined : { scale: 0.97 }}
      role={isLocked ? 'article' : 'button'}
      tabIndex={isLocked ? -1 : 0}
      aria-label={
        isLocked
          ? `${displayName} - Level ${game.minLevel} required`
          : `Play ${displayName}`
      }
      onClick={() => { if (!isLocked) onPlay(game); }}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPlay(game);
        }
      }}
    >
      {/* Category stripe */}
      <div className={`h-1 w-full ${colors.stripe} rounded-t-3xl`} />

      {/* Card content */}
      <div className="flex flex-col items-center gap-3 px-4 pt-5 pb-4 flex-1">
        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl ${colors.iconBg} flex items-center justify-center`}>
          <IconComponent size={32} className={colors.text} />
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-gray-800 text-center leading-tight line-clamp-2">
          {displayName}
        </h3>

        {/* Category badge */}
        {catLabel && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
            {lang === 'tr' ? catLabel.tr : catLabel.en}
          </span>
        )}

        {/* Difficulty */}
        <DifficultyStars level={game.difficulty} />

        {/* Bottom badges row */}
        <div className="flex items-center gap-2 mt-auto">
          {isNew && (
            <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold uppercase tracking-wide shadow-sm">
              {lang === 'tr' ? 'Yeni' : 'New'}
            </span>
          )}
          {bestScore !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[11px] font-semibold border border-amber-200">
              <Star size={10} fill="currentColor" />
              {bestScore}
            </span>
          )}
        </div>
      </div>

      {/* Recommended glow label */}
      {isRecommended && (
        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold uppercase tracking-wider shadow">
          {lang === 'tr' ? 'Onerilen' : 'Recommended'}
        </div>
      )}

      {/* Locked overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-gray-500/40 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center gap-2 z-10">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Lock size={24} className="text-gray-500" />
          </div>
          <span className="text-xs font-bold text-white drop-shadow-md">
            Level {game.minLevel}
          </span>
        </div>
      )}
    </motion.div>
  );
}

export default GameCard;
