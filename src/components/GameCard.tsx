import { Link, Play, Zap, Bug, Mic, Puzzle, Headphones, BookOpen, MessageSquare, Tag, Volume2, Layers, Star, Lock, BookMarked } from 'lucide-react';
import type { GameMeta } from '../data/miniGamesData';
import './GameCard.css';

export interface GameCardProps {
  game: GameMeta;
  isLocked: boolean;
  userLevel: number;
  bestScore?: number;
  isNew?: boolean;
  isTr?: boolean;
  onPlay: () => void;
}

const GAME_ICONS: Record<string, React.ReactNode> = {
  'word-match': <Link size={36} />,
  'quick-quiz': <Zap size={36} />,
  'sentence-scramble': <Puzzle size={36} />,
  'spelling-bee': <Bug size={36} />,
  'listening-challenge': <Headphones size={36} />,
  'pronunciation': <Mic size={36} />,
  'story-choices': <BookOpen size={36} />,
  'dialogue': <MessageSquare size={36} />,
  'image-label': <Tag size={36} />,
  'say-it': <Volume2 size={36} />,
  'phonics-blend': <Layers size={36} />,
};

function DifficultyStars({ level }: { level: 1 | 2 | 3 }) {
  return (
    <div className="game-card__stars" aria-label={`Difficulty: ${level} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={`game-card__star${n <= level ? ' game-card__star--filled' : ''}`}>
          <Star size={13} fill={n <= level ? 'currentColor' : 'none'} />
        </span>
      ))}
    </div>
  );
}

const CATEGORY_LABELS: Record<string, { en: string; tr: string }> = {
  vocabulary: { en: 'Vocab', tr: 'Kelime' },
  phonics: { en: 'Phonics', tr: 'Fonetik' },
  reading: { en: 'Reading', tr: 'Okuma' },
  speaking: { en: 'Speaking', tr: 'Konuşma' },
};

export function GameCard({ game, isLocked, bestScore, isNew, isTr = false, onPlay }: GameCardProps) {
  const icon = GAME_ICONS[game.type] ?? <Play size={36} />;
  const displayName = isTr ? game.nameTr : game.name;
  const displayDesc = isTr ? game.descriptionTr : game.description;
  const categoryLabel = CATEGORY_LABELS[game.category];

  return (
    <div
      className={`game-card${isLocked ? ' game-card--locked' : ''}`}
      style={{ '--gc-color': game.color } as React.CSSProperties}
      role={isLocked ? 'article' : 'button'}
      tabIndex={isLocked ? -1 : 0}
      aria-label={isLocked
        ? (isTr ? `${displayName} — seviye ${game.minLevel} gerekli` : `${displayName} — requires level ${game.minLevel}`)
        : (isTr ? `${displayName} oyna` : `Play ${displayName}`)}
      onKeyDown={(e) => {
        if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onPlay();
        }
      }}
    >
      {isLocked && (
        <div className="game-card__locked-overlay" aria-hidden="true">
          <span className="game-card__lock-icon"><Lock size={32} /></span>
          <span className="game-card__lock-label">
            {isTr ? `Seviye ${game.minLevel} gerekli` : `Level ${game.minLevel} required`}
          </span>
        </div>
      )}

      <div className="game-card__stripe" />

      <div className="game-card__icon-wrap">
        <span className="game-card__icon">{icon}</span>
        {categoryLabel && (
          <span className="game-card__category-badge">
            <BookMarked size={10} />
            {isTr ? categoryLabel.tr : categoryLabel.en}
          </span>
        )}
      </div>

      <div className="game-card__body">
        <div className="game-card__header">
          <h3 className="game-card__name">{displayName}</h3>
          <div className="game-card__badges">
            {isNew && <span className="game-card__badge--new">New</span>}
            {bestScore !== undefined && (
              <span className="game-card__badge--score">
                <Star size={10} fill="currentColor" />
                {bestScore}
              </span>
            )}
          </div>
        </div>

        <p className="game-card__desc">{displayDesc}</p>

        <DifficultyStars level={game.difficulty} />
      </div>

      {!isLocked && (
        <div className="game-card__footer">
          <button
            type="button"
            className="game-card__play-btn"
            onClick={onPlay}
            aria-label={isTr ? `${displayName} oyna` : `Play ${displayName}`}
          >
            <Play size={16} fill="white" />
            {isTr ? 'Oyna!' : 'Play!'}
          </button>
        </div>
      )}
    </div>
  );
}
