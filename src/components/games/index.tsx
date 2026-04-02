import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, ArrowLeft } from 'lucide-react';
import LottieCharacter from '../LottieCharacter';
import { useLanguage } from '../../contexts/LanguageContext';

// ── Type Definitions ─────────────────────────────────────────────────────────

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

type GameType =
  | 'word-match'
  | 'spelling-bee'
  | 'quick-quiz'
  | 'sentence-scramble'
  | 'listening-challenge'
  | 'pronunciation'
  | 'blending'
  | 'segmenting'
  | 'tpr'
  | 'sound-intro'
  | 'reading'
  | 'letter-tracing'
  | 'word-writing'
  | 'phonics-builder'
  | 'story-choices'
  | 'dialogue'
  | 'image-label'
  | 'say-it'
  | 'phonics-blend'
  | 'phoneme-manipulation'
  | 'syllable'
  | 'word-family'
  | 'rhyme'
  | 'phonetic-trap'
  | 'sentence-builder';

// Games accept either standard GameProps or specialized props via `extra`.
// React.lazy needs a single component type — we use a permissive but explicit signature
// so callers still see the prop shape rather than `unknown`.
type GameComponentProps = Record<string, unknown>;
type LazyGameComponent = React.LazyExoticComponent<React.ComponentType<GameComponentProps>>;

// ── Loading Skeleton ─────────────────────────────────────────────────────────

function GameLoadingSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      >
        <Gamepad2 size={48} className="text-primary-300" />
      </motion.div>
      <div className="space-y-3 w-full max-w-sm">
        <div className="h-4 bg-ink-100 rounded-full animate-pulse" />
        <div className="h-4 bg-ink-100 rounded-full animate-pulse w-3/4 mx-auto" />
        <div className="h-12 bg-ink-100 rounded-2xl animate-pulse mt-4" />
      </div>
    </div>
  );
}

// ── Game Not Found ───────────────────────────────────────────────────────────

function GameNotFound({ type, onGoBack }: { type: string; onGoBack?: () => void }) {
  const { lang } = useLanguage();
  const tr = lang === 'tr';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center"
    >
      <LottieCharacter state="sad" size={140} />
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-ink-900 font-display">
          {tr ? 'Hay aksi! Oyun bulunamadı' : 'Oops! Game not found'}
        </h3>
        <p className="text-ink-500 text-sm max-w-xs mx-auto">
          {tr
            ? <>Mimi <strong>&quot;{type}&quot;</strong> oyununu bulamadı. Taşınmış veya henüz hazır olmayabilir!</>
            : <>Mimi couldn&apos;t find the game <strong>&quot;{type}&quot;</strong>. It might have moved or isn&apos;t available yet!</>}
        </p>
      </div>
      {onGoBack && (
        <motion.button
          type="button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white font-display font-bold text-sm shadow-md hover:shadow-lg"
          onClick={onGoBack}
        >
          <ArrowLeft size={16} />
          {tr ? 'Geri Dön' : 'Go Back'}
        </motion.button>
      )}
    </motion.div>
  );
}

// ── Missing Data Fallback ────────────────────────────────────────────────────

function GameMissingData({ type }: { type: string }) {
  const { lang } = useLanguage();
  const tr = lang === 'tr';
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center"
    >
      <LottieCharacter state="thinking" size={120} />
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-ink-900 font-display">
          {tr ? 'Hmm, bir şeyler eksik...' : "Hmm, something's missing..."}
        </h3>
        <p className="text-ink-500 text-sm max-w-xs mx-auto">
          {tr
            ? <><strong>&quot;{type}&quot;</strong> oyunu için gerekli veriler sağlanmadı. Geri dönüp dersi tekrar başlatmayı deneyin.</>
            : <>The game <strong>&quot;{type}&quot;</strong> needs some data that wasn&apos;t provided. Try going back and starting the lesson again.</>}
        </p>
      </div>
    </motion.div>
  );
}

// ── Error Boundary ───────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class GameErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center"
        >
          <LottieCharacter state="sad" size={140} />
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-ink-900 font-display">
              Oops! Something went wrong
            </h3>
            <p className="text-ink-500 text-sm max-w-xs mx-auto">
              Don&apos;t worry, Mimi is on it! Let&apos;s try that again.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-display font-bold text-sm shadow-md hover:shadow-lg"
              onClick={this.handleRetry}
            >
              Tekrar Dene / Try Again
            </motion.button>
            <button
              type="button"
              className="px-4 py-2.5 rounded-full text-ink-500 hover:text-ink-700 font-display font-semibold text-sm transition-colors"
              onClick={() => window.history.back()}
            >
              Geri Dön / Go Back
            </button>
          </div>
        </motion.div>
      );
    }
    return this.props.children;
  }
}

// ── Lazy Game Components ─────────────────────────────────────────────────────

// Helper: safely wrap a component with heterogeneous props into our unified lazy type.
// Each game has different props (GameProps, DialogueGameProps, etc.), but React.lazy
// needs a single type. We cast through unknown at the boundary — the actual prop
// correctness is guaranteed by GameSelector which builds the right prop object.
function asGameComponent<T>(component: React.ComponentType<T>): React.ComponentType<GameComponentProps> {
  return component as unknown as React.ComponentType<GameComponentProps>;
}

const gameComponents: Record<GameType, LazyGameComponent> = {
  'word-match': React.lazy(() => import('./WordMatch').then((m) => ({ default: asGameComponent(m.WordMatch) }))),
  'spelling-bee': React.lazy(() => import('./SpellingBee').then((m) => ({ default: asGameComponent(m.SpellingBee) }))),
  'quick-quiz': React.lazy(() => import('./QuickQuiz').then((m) => ({ default: asGameComponent(m.QuickQuiz) }))),
  'sentence-scramble': React.lazy(() => import('./SentenceScramble').then((m) => ({ default: asGameComponent(m.SentenceScramble) }))),
  'listening-challenge': React.lazy(() => import('./ListeningChallenge').then((m) => ({ default: asGameComponent(m.ListeningChallenge) }))),
  'pronunciation': React.lazy(() => import('./PronunciationGame').then((m) => ({ default: asGameComponent(m.PronunciationGame) }))),
  'blending': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: asGameComponent(m.BlendingBoard) }))),
  'segmenting': React.lazy(() => import('../phonics/SegmentingBoard').then((m) => ({ default: asGameComponent(m.SegmentingBoard) }))),
  'tpr': React.lazy(() => import('../phonics/TPRActivity').then((m) => ({ default: asGameComponent(m.TPRActivity) }))),
  'sound-intro': React.lazy(() => import('../phonics/SoundCard').then((m) => ({ default: asGameComponent(m.SoundCard) }))),
  'reading': React.lazy(() => import('../phonics/DecodableReader').then((m) => ({ default: asGameComponent(m.DecodableReader) }))),
  'letter-tracing': React.lazy(() => import('../phonics/LetterTracing').then((m) => ({ default: asGameComponent(m.LetterTracing) }))),
  'word-writing': React.lazy(() => import('../phonics/WordWriting').then((m) => ({ default: asGameComponent(m.WordWriting) }))),
  'phonics-builder': React.lazy(() => import('../phonics/BlendingBoard').then((m) => ({ default: asGameComponent(m.BlendingBoard) }))),
  'story-choices': React.lazy(() => import('./StoryChoicesGame').then((m) => ({ default: asGameComponent(m.StoryChoicesGame) }))),
  'dialogue': React.lazy(() => import('./DialogueGame').then((m) => ({ default: asGameComponent(m.DialogueGame) }))),
  'image-label': React.lazy(() => import('./ImageLabelGame').then((m) => ({ default: asGameComponent(m.ImageLabelGame) }))),
  'say-it': React.lazy(() => import('./SayItGame').then((m) => ({ default: asGameComponent(m.SayItGame) }))),
  'phonics-blend': React.lazy(() => import('./PhonicsBlendGame').then((m) => ({ default: asGameComponent(m.PhonicsBlendGame) }))),
  'phoneme-manipulation': React.lazy(() => import('./PhonemeManipulationGame').then((m) => ({ default: asGameComponent(m.PhonemeManipulationGame) }))),
  'syllable': React.lazy(() => import('./SyllableGame').then((m) => ({ default: asGameComponent(m.SyllableGame) }))),
  'word-family': React.lazy(() => import('./WordFamilyGame').then((m) => ({ default: asGameComponent(m.WordFamilyGame) }))),
  'rhyme': React.lazy(() => import('./RhymeGame').then((m) => ({ default: asGameComponent(m.RhymeGame) }))),
  'phonetic-trap': React.lazy(() => import('./PhoneticTrapGame').then((m) => ({ default: asGameComponent(m.default) }))),
  'sentence-builder': React.lazy(() => import('./SentenceBuilder').then((m) => ({ default: asGameComponent(m.default) }))),
};

// ── Specialized Game Types ───────────────────────────────────────────────────

const SPECIALIZED_GAME_TYPES = new Set<GameType>([
  'dialogue',              // needs: lines: DialogueLine[]
  'image-label',           // needs: questions: LabelQuestion[]
  'say-it',                // needs: questions: SayItQuestion[]
  'phonics-blend',         // needs: questions: BlendQuestion[]
  'phoneme-manipulation',  // needs: questions: PhonemeManipulationQuestion[]
  'syllable',              // needs: questions: SyllableQuestion[]
  'word-family',           // needs: families: WordFamily[]
  'rhyme',                 // needs: questions: RhymeQuestion[]
  'phonetic-trap',         // needs: trap: PhoneticTrap
  'tpr',                   // needs: commands: string[]
  'sound-intro',           // needs: sound: PhonicsSound
  'reading',               // needs: text, highlightSounds
  'letter-tracing',        // needs: letter: string
  'word-writing',          // needs: word: string
]);

// ── Game Type Alias Map (90+ aliases) ────────────────────────────────────────

const GAME_TYPE_MAP: Record<string, GameType> = {
  // word-match
  'word-match': 'word-match',
  'wordmatch': 'word-match',
  'WordMatch': 'word-match',
  // spelling-bee
  'spelling-bee': 'spelling-bee',
  'spellingbee': 'spelling-bee',
  'SpellingBee': 'spelling-bee',
  // quick-quiz
  'quick-quiz': 'quick-quiz',
  'quickquiz': 'quick-quiz',
  'QuickQuiz': 'quick-quiz',
  // sentence-scramble
  'sentence-scramble': 'sentence-scramble',
  'sentencescramble': 'sentence-scramble',
  'SentenceScramble': 'sentence-scramble',
  // listening-challenge
  'listening-challenge': 'listening-challenge',
  'listeningchallenge': 'listening-challenge',
  'ListeningChallenge': 'listening-challenge',
  'listening': 'listening-challenge',
  'Listening': 'listening-challenge',
  // pronunciation
  'pronunciation': 'pronunciation',
  'Pronunciation': 'pronunciation',
  'PronunciationGame': 'pronunciation',
  // blending
  'blending': 'blending',
  'Blending': 'blending',
  'BlendingBoard': 'blending',
  // segmenting
  'segmenting': 'segmenting',
  'Segmenting': 'segmenting',
  'SegmentingBoard': 'segmenting',
  // tpr
  'tpr': 'tpr',
  'TPR': 'tpr',
  'TPRActivity': 'tpr',
  // sound-intro
  'sound-intro': 'sound-intro',
  'soundintro': 'sound-intro',
  'SoundCard': 'sound-intro',
  // reading
  'reading': 'reading',
  'Reading': 'reading',
  'DecodableReader': 'reading',
  // letter-tracing
  'letter-tracing': 'letter-tracing',
  'lettertracing': 'letter-tracing',
  'LetterTracing': 'letter-tracing',
  // word-writing
  'word-writing': 'word-writing',
  'wordwriting': 'word-writing',
  'WordWriting': 'word-writing',
  // phonics-builder
  'phonics-builder': 'phonics-builder',
  'phonicsbuilder': 'phonics-builder',
  'PhonicsBuilder': 'phonics-builder',
  // story-choices
  'story-choices': 'story-choices',
  'storychoices': 'story-choices',
  'StoryChoices': 'story-choices',
  // dialogue
  'dialogue': 'dialogue',
  'Dialogue': 'dialogue',
  'DialogueGame': 'dialogue',
  'dialogue-game': 'dialogue',
  // image-label
  'image-label': 'image-label',
  'imagelabel': 'image-label',
  'ImageLabel': 'image-label',
  'ImageLabelGame': 'image-label',
  // say-it
  'say-it': 'say-it',
  'sayit': 'say-it',
  'SayIt': 'say-it',
  'SayItGame': 'say-it',
  // phonics-blend
  'phonics-blend': 'phonics-blend',
  'phonicsblend': 'phonics-blend',
  'PhonicsBlend': 'phonics-blend',
  'PhonicsBlendGame': 'phonics-blend',
  // phoneme-manipulation
  'phoneme-manipulation': 'phoneme-manipulation',
  'phonememanipulation': 'phoneme-manipulation',
  'PhonemeManipulation': 'phoneme-manipulation',
  'PhonemeManipulationGame': 'phoneme-manipulation',
  // syllable
  'syllable': 'syllable',
  'SyllableGame': 'syllable',
  'syllable-game': 'syllable',
  // word-family
  'word-family': 'word-family',
  'wordfamily': 'word-family',
  'WordFamily': 'word-family',
  'WordFamilyGame': 'word-family',
  'word-family-game': 'word-family',
  // rhyme
  'rhyme': 'rhyme',
  'RhymeGame': 'rhyme',
  'rhyme-game': 'rhyme',
  // phonetic-trap
  'phonetic-trap': 'phonetic-trap',
  'phonetictrap': 'phonetic-trap',
  'PhoneticTrap': 'phonetic-trap',
  'PhoneticTrapGame': 'phonetic-trap',
  'phonetic-trap-game': 'phonetic-trap',
  // sentence-builder
  'sentence-builder': 'sentence-builder',
  'sentencebuilder': 'sentence-builder',
  'SentenceBuilder': 'sentence-builder',
  'sentence-builder-game': 'sentence-builder',
};

// ── Public Exports (named re-exports for direct imports) ─────────────────────

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

// ── GameSelector ─────────────────────────────────────────────────────────────

export interface GameSelectorProps extends GameProps {
  type: string;
  /** Extra props for specialized games (e.g. lines, questions, trap, etc.) */
  extra?: Record<string, unknown>;
  /** Real-time difficulty multiplier from adaptive engine (0.5-2.0, default 1.0) */
  difficultyMultiplier?: number;
  /** Age group string for age-based difficulty adjustments */
  ageGroup?: string;
}

export function GameSelector({ type, extra, difficultyMultiplier = 1.0, ageGroup, ...props }: GameSelectorProps) {
  useLanguage(); // context subscription for re-renders on language change
  const normalizedType = GAME_TYPE_MAP[type];

  // Unknown game type — show kid-friendly "not found" screen
  if (!normalizedType) {
    return <GameNotFound type={type} onGoBack={() => window.history.back()} />;
  }

  // Specialized game is missing its required data
  if (SPECIALIZED_GAME_TYPES.has(normalizedType) && !extra) {
    return <GameMissingData type={type} />;
  }

  const GameComponent = gameComponents[normalizedType];

  if (!GameComponent) {
    return <GameNotFound type={type} onGoBack={() => window.history.back()} />;
  }

  // For specialized games, pass extra props; for standard games, pass words-based props
  const gameProps: GameComponentProps = SPECIALIZED_GAME_TYPES.has(normalizedType)
    ? { onComplete: props.onComplete, onWrongAnswer: props.onWrongAnswer, onXpEarned: props.onXpEarned, difficultyMultiplier, ageGroup, ...extra }
    : { ...props, difficultyMultiplier, ageGroup };

  return (
    <GameErrorBoundary>
      <React.Suspense fallback={<GameLoadingSkeleton />}>
        <AnimatePresence mode="wait">
          <motion.div
            key={normalizedType}
            className="h-full max-h-full overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <GameComponent {...gameProps} />
          </motion.div>
        </AnimatePresence>
      </React.Suspense>
    </GameErrorBoundary>
  );
}

GameSelector.displayName = 'GameSelector';
