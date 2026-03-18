import React from 'react';

export { WordMatch } from './WordMatch';
export { SpellingBee } from './SpellingBee';
export { QuickQuiz } from './QuickQuiz';
export { SentenceScramble } from './SentenceScramble';
export { ListeningChallenge } from './ListeningChallenge';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
  onWrongAnswer?: () => void;
}

type GameType = 'word-match' | 'spelling-bee' | 'quick-quiz' | 'sentence-scramble' | 'listening-challenge';

// Lazy imports to keep bundle size down
const gameComponents: Record<GameType, React.LazyExoticComponent<React.FC<GameProps>>> = {
  'word-match': React.lazy(() => import('./WordMatch').then((m) => ({ default: m.WordMatch }))),
  'spelling-bee': React.lazy(() => import('./SpellingBee').then((m) => ({ default: m.SpellingBee }))),
  'quick-quiz': React.lazy(() => import('./QuickQuiz').then((m) => ({ default: m.QuickQuiz }))),
  'sentence-scramble': React.lazy(() => import('./SentenceScramble').then((m) => ({ default: m.SentenceScramble }))),
  'listening-challenge': React.lazy(() => import('./ListeningChallenge').then((m) => ({ default: m.ListeningChallenge }))),
};

const GAME_TYPE_MAP: Record<string, GameType> = {
  'word-match': 'word-match',
  'wordmatch': 'word-match',
  'WordMatch': 'word-match',
  'spelling-bee': 'spelling-bee',
  'spellingbee': 'spelling-bee',
  'SpellingBee': 'spelling-bee',
  'quick-quiz': 'quick-quiz',
  'quickquiz': 'quick-quiz',
  'QuickQuiz': 'quick-quiz',
  'sentence-scramble': 'sentence-scramble',
  'sentencescramble': 'sentence-scramble',
  'SentenceScramble': 'sentence-scramble',
  'listening-challenge': 'listening-challenge',
  'listeningchallenge': 'listening-challenge',
  'ListeningChallenge': 'listening-challenge',
};

export interface GameSelectorProps extends GameProps {
  type: string;
}

export function GameSelector({ type, ...props }: GameSelectorProps) {
  const resolvedType = GAME_TYPE_MAP[type];

  if (!resolvedType) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Unknown game type: {type}</p>
      </div>
    );
  }

  const GameComponent = gameComponents[resolvedType];

  return (
    <React.Suspense
      fallback={
        <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.5rem' }}>
          Loading game... 🎮
        </div>
      }
    >
      <GameComponent {...props} />
    </React.Suspense>
  );
}

GameSelector.displayName = 'GameSelector';
