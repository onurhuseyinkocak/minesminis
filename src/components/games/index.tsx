import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Error Boundary ────────────────────────────────────────────────────────────
interface ErrorBoundaryState { hasError: boolean; }
class GameErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Something went wrong in this game.</p>
          <button
            type="button"
            style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'var(--primary)', color: 'var(--text-on-primary, #fff)', border: 'none', fontFamily: 'var(--font-display)', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem' }}
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export { WordMatch } from './WordMatch';
export { SpellingBee } from './SpellingBee';
export { QuickQuiz } from './QuickQuiz';
export { SentenceScramble } from './SentenceScramble';
export { ListeningChallenge } from './ListeningChallenge';
export { DialogueGame } from './DialogueGame';
export type { DialogueLine, DialogueOption, DialogueGameProps } from './DialogueGame';
export { ImageLabelGame } from './ImageLabelGame';
export type { LabelQuestion, ImageLabelGameProps } from './ImageLabelGame';
export { SayItGame } from './SayItGame';
export type { SayItQuestion, SayItGameProps } from './SayItGame';
export { PhonicsBlendGame } from './PhonicsBlendGame';
export type { BlendQuestion, PhonicsBlendGameProps } from './PhonicsBlendGame';
export { PhonemeManipulationGame } from './PhonemeManipulationGame';
export type {
  ManipulationType,
  PhonemeManipulationQuestion,
  PhonemeManipulationGameProps,
} from './PhonemeManipulationGame';
export { SyllableGame } from './SyllableGame';
export type { SyllableQuestion, SyllableGameProps } from './SyllableGame';
export { WordFamilyGame } from './WordFamilyGame';
export type { WordFamily, WordFamilyGameProps } from './WordFamilyGame';
export { RhymeGame } from './RhymeGame';
export type { RhymeTaskType, RhymeQuestion, RhymeGameProps } from './RhymeGame';
export { default as PhoneticTrapGame } from './PhoneticTrapGame';
export type { PhoneticTrapGameProps } from './PhoneticTrapGame';

interface WordItem {
  english: string;
  turkish: string;
  emoji: string;
}

export interface GameProps {
  words: WordItem[];
  onComplete: (score: number, totalPossible: number) => void;
  onXpEarned?: (xp: number) => void;
  onWrongAnswer?: () => void;
}

type GameType = 'word-match' | 'spelling-bee' | 'quick-quiz' | 'sentence-scramble' | 'listening-challenge' | 'pronunciation' | 'blending' | 'segmenting' | 'tpr' | 'sound-intro' | 'reading' | 'letter-tracing' | 'word-writing' | 'phonics-builder' | 'story-choices' | 'dialogue' | 'image-label' | 'say-it' | 'phonics-blend' | 'phoneme-manipulation' | 'syllable' | 'word-family' | 'rhyme' | 'phonetic-trap' | 'sentence-builder';

// Games that accept standard GameProps (words: WordItem[]) or phonics-specific props.
// React.lazy requires a unified component type; GameProps is the common denominator.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyGameComponent = React.FC<any>;

// Lazy imports to keep bundle size down
const gameComponents: Record<GameType, React.LazyExoticComponent<AnyGameComponent>> = {
  'word-match': React.lazy(() => import('./WordMatch').then((m) => ({ default: m.WordMatch }))),
  'spelling-bee': React.lazy(() => import('./SpellingBee').then((m) => ({ default: m.SpellingBee }))),
  'quick-quiz': React.lazy(() => import('./QuickQuiz').then((m) => ({ default: m.QuickQuiz }))),
  'sentence-scramble': React.lazy(() => import('./SentenceScramble').then((m) => ({ default: m.SentenceScramble }))),
  'listening-challenge': React.lazy(() => import('./ListeningChallenge').then((m) => ({ default: m.ListeningChallenge }))),
  'pronunciation': React.lazy(() => import('./PronunciationGame').then((m) => ({ default: m.PronunciationGame }))),
  'blending': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: m.BlendingBoard }))),
  'segmenting': React.lazy(() => import('../phonics/SegmentingBoard').then((m) => ({ default: m.SegmentingBoard }))),
  'tpr': React.lazy(() => import('../phonics/TPRActivity').then((m) => ({ default: m.TPRActivity }))),
  'sound-intro': React.lazy(() => import('../phonics/SoundCard').then((m) => ({ default: m.SoundCard }))),
  'reading': React.lazy(() => import('../phonics/DecodableReader').then((m) => ({ default: m.DecodableReader }))),
  'letter-tracing': React.lazy(() => import('../phonics/LetterTracing').then((m) => ({ default: m.LetterTracing }))),
  'word-writing': React.lazy(() => import('../phonics/WordWriting').then((m) => ({ default: m.WordWriting }))),
  'phonics-builder': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: m.BlendingBoard }))),
  'story-choices': React.lazy(() => import('./StoryChoicesGame').then((m) => ({ default: m.StoryChoicesGame }))),
  'dialogue': React.lazy(() => import('./DialogueGame').then((m) => ({ default: m.DialogueGame }))),
  'image-label': React.lazy(() => import('./ImageLabelGame').then((m) => ({ default: m.ImageLabelGame }))),
  'say-it': React.lazy(() => import('./SayItGame').then((m) => ({ default: m.SayItGame }))),
  'phonics-blend': React.lazy(() => import('./PhonicsBlendGame').then((m) => ({ default: m.PhonicsBlendGame }))),
  'phoneme-manipulation': React.lazy(() => import('./PhonemeManipulationGame').then((m) => ({ default: m.PhonemeManipulationGame }))),
  'syllable': React.lazy(() => import('./SyllableGame').then((m) => ({ default: m.SyllableGame }))),
  'word-family': React.lazy(() => import('./WordFamilyGame').then((m) => ({ default: m.WordFamilyGame }))),
  'rhyme': React.lazy(() => import('./RhymeGame').then((m) => ({ default: m.RhymeGame }))),
  'phonetic-trap': React.lazy(() => import('./PhoneticTrapGame').then((m) => ({ default: m.default }))),
  'sentence-builder': React.lazy(() => import('./SentenceBuilder')),
};

// Games that require specialized props (not standard GameProps with words[]).
// These need their own data passed via the `extra` prop on GameSelectorProps.
const SPECIALIZED_GAME_TYPES = new Set<GameType>([
  'dialogue',        // needs: lines: DialogueLine[]
  'image-label',     // needs: questions: LabelQuestion[]
  'say-it',          // needs: questions: SayItQuestion[]
  'phonics-blend',   // needs: questions: BlendQuestion[]
  'phoneme-manipulation', // needs: questions: PhonemeManipulationQuestion[]
  'syllable',        // needs: questions: SyllableQuestion[]
  'word-family',     // needs: families: WordFamily[]
  'rhyme',           // needs: questions: RhymeQuestion[]
  'phonetic-trap',   // needs: trap: PhoneticTrap
  'tpr',             // needs: commands: string[]
  'sound-intro',     // needs: sound: PhonicsSound
  'reading',         // needs: text, highlightSounds
  'letter-tracing',  // needs: letter: string
  'word-writing',    // needs: word: string
]);

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
  'listening': 'listening-challenge',
  'Listening': 'listening-challenge',
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
  'dialogue': 'dialogue',
  'Dialogue': 'dialogue',
  'DialogueGame': 'dialogue',
  'dialogue-game': 'dialogue',
  'image-label': 'image-label',
  'imagelabel': 'image-label',
  'ImageLabel': 'image-label',
  'ImageLabelGame': 'image-label',
  'say-it': 'say-it',
  'sayit': 'say-it',
  'SayIt': 'say-it',
  'SayItGame': 'say-it',
  'phonics-blend': 'phonics-blend',
  'phonicsblend': 'phonics-blend',
  'PhonicsBlend': 'phonics-blend',
  'PhonicsBlendGame': 'phonics-blend',
  'phoneme-manipulation': 'phoneme-manipulation',
  'phonememanipulation': 'phoneme-manipulation',
  'PhonemeManipulation': 'phoneme-manipulation',
  'PhonemeManipulationGame': 'phoneme-manipulation',
  'syllable': 'syllable',
  'SyllableGame': 'syllable',
  'syllable-game': 'syllable',
  'word-family': 'word-family',
  'wordfamily': 'word-family',
  'WordFamily': 'word-family',
  'WordFamilyGame': 'word-family',
  'word-family-game': 'word-family',
  'rhyme': 'rhyme',
  'RhymeGame': 'rhyme',
  'rhyme-game': 'rhyme',
  'phonetic-trap': 'phonetic-trap',
  'phonetictrap': 'phonetic-trap',
  'PhoneticTrap': 'phonetic-trap',
  'PhoneticTrapGame': 'phonetic-trap',
  'phonetic-trap-game': 'phonetic-trap',
  'sentence-builder': 'sentence-builder',
  'sentencebuilder': 'sentence-builder',
  'SentenceBuilder': 'sentence-builder',
  'sentence-builder-game': 'sentence-builder',
};

export interface GameSelectorProps extends GameProps {
  type: string;
  /** Extra props for specialized games (e.g. lines, questions, trap, etc.) */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra?: Record<string, any>;
  /** Real-time difficulty multiplier from adaptive engine (0.5–2.0, default 1.0) */
  difficultyMultiplier?: number;
}

export function GameSelector({ type, extra, difficultyMultiplier = 1.0, ...props }: GameSelectorProps) {
  const { t } = useLanguage();
  const resolvedType = GAME_TYPE_MAP[type];

  if (!resolvedType) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>{t('games.loadingGame')}: {type}</p>
      </div>
    );
  }

  // Guard: specialized games require their own props via `extra`
  if (SPECIALIZED_GAME_TYPES.has(resolvedType) && !extra) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>{t('games.loadingGame')}: {type}</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Bu oyun için gerekli veri bulunamadı.
        </p>
      </div>
    );
  }

  const GameComponent = gameComponents[resolvedType];

  if (!GameComponent) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Oyun bulunamadı: {resolvedType}</p>
      </div>
    );
  }

  // For specialized games, pass extra props; for standard games, pass words-based props
  const gameProps = SPECIALIZED_GAME_TYPES.has(resolvedType)
    ? { onComplete: props.onComplete, onWrongAnswer: props.onWrongAnswer, difficultyMultiplier, ...extra }
    : { ...props, difficultyMultiplier };

  return (
    <GameErrorBoundary>
      <React.Suspense
        fallback={
          <div style={{ textAlign: 'center', padding: '2rem', fontSize: '1.5rem' }}>
            {t('games.loadingGame')}
          </div>
        }
      >
        <GameComponent {...(gameProps as Record<string, unknown>)} />
      </React.Suspense>
    </GameErrorBoundary>
  );
}

GameSelector.displayName = 'GameSelector';
