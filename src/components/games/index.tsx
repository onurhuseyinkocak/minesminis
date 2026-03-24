import React from 'react';

export { WordMatch } from './WordMatch';
export { SpellingBee } from './SpellingBee';
export { QuickQuiz } from './QuickQuiz';
export { SentenceScramble } from './SentenceScramble';
export { ListeningChallenge } from './ListeningChallenge';
export { PronunciationGame } from './PronunciationGame';

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

type GameType = 'word-match' | 'spelling-bee' | 'quick-quiz' | 'sentence-scramble' | 'listening-challenge' | 'pronunciation' | 'blending' | 'segmenting' | 'tpr' | 'sound-intro' | 'reading' | 'letter-tracing' | 'word-writing' | 'phonics-builder' | 'story-choices';

// Lazy imports to keep bundle size down
const gameComponents: Record<GameType, React.LazyExoticComponent<React.FC<GameProps>>> = {
  'word-match': React.lazy(() => import('./WordMatch').then((m) => ({ default: m.WordMatch }))),
  'spelling-bee': React.lazy(() => import('./SpellingBee').then((m) => ({ default: m.SpellingBee }))),
  'quick-quiz': React.lazy(() => import('./QuickQuiz').then((m) => ({ default: m.QuickQuiz }))),
  'sentence-scramble': React.lazy(() => import('./SentenceScramble').then((m) => ({ default: m.SentenceScramble }))),
  'listening-challenge': React.lazy(() => import('./ListeningChallenge').then((m) => ({ default: m.ListeningChallenge }))),
  'pronunciation': React.lazy(() => import('./PronunciationGame').then((m) => ({ default: m.PronunciationGame }))),
  'blending': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: m.BlendingBoard as unknown as React.FC<GameProps> }))),
  'segmenting': React.lazy(() => import('../phonics/SegmentingBoard').then((m) => ({ default: m.SegmentingBoard as unknown as React.FC<GameProps> }))),
  'tpr': React.lazy(() => import('../phonics/TPRActivity').then((m) => ({ default: m.TPRActivity as unknown as React.FC<GameProps> }))),
  'sound-intro': React.lazy(() => import('../phonics/SoundCard').then((m) => ({ default: m.SoundCard as unknown as React.FC<GameProps> }))),
  'reading': React.lazy(() => import('../phonics/DecodableReader').then((m) => ({ default: m.DecodableReader as unknown as React.FC<GameProps> }))),
  'letter-tracing': React.lazy(() => import('../phonics/LetterTracing').then((m) => ({ default: m.LetterTracing as unknown as React.FC<GameProps> }))),
  'word-writing': React.lazy(() => import('../phonics/WordWriting').then((m) => ({ default: m.WordWriting as unknown as React.FC<GameProps> }))),
  'phonics-builder': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: m.BlendingBoard as unknown as React.FC<GameProps> }))),
  'story-choices': React.lazy(() => import('./StoryChoicesGame').then((m) => ({ default: m.StoryChoicesGame }))),
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
  'pronunciation': 'pronunciation',
  'Pronunciation': 'pronunciation',
  'PronunciationGame': 'pronunciation',
  'blending': 'blending',
  'Blending': 'blending',
  'BlendingBoard': 'blending',
  'segmenting': 'segmenting',
  'Segmenting': 'segmenting',
  'SegmentingBoard': 'segmenting',
  'tpr': 'tpr',
  'TPR': 'tpr',
  'TPRActivity': 'tpr',
  'sound-intro': 'sound-intro',
  'soundintro': 'sound-intro',
  'SoundCard': 'sound-intro',
  'reading': 'reading',
  'Reading': 'reading',
  'DecodableReader': 'reading',
  'letter-tracing': 'letter-tracing',
  'lettertracing': 'letter-tracing',
  'LetterTracing': 'letter-tracing',
  'word-writing': 'word-writing',
  'wordwriting': 'word-writing',
  'WordWriting': 'word-writing',
  'phonics-builder': 'phonics-builder',
  'phonicsbuilder': 'phonics-builder',
  'PhonicsBuilder': 'phonics-builder',
  'story-choices': 'story-choices',
  'storychoices': 'story-choices',
  'StoryChoices': 'story-choices',
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
          Loading game...
        </div>
      }
    >
      <GameComponent {...props} />
    </React.Suspense>
  );
}

GameSelector.displayName = 'GameSelector';
