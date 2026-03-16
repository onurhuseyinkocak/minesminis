/**
 * WORLD DETAIL — Individual World Page
 * MinesMinis v4.0
 *
 * Route: /worlds/:worldId
 * Shows the world header, lesson list (10 lessons), and vocabulary preview.
 */
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Lock,
  Check,
  Play,
  Clock,
  Star,
  Music,
  Gamepad2,
  BookOpen,
  Layers,
  Mic,
  HelpCircle,
} from 'lucide-react';
import { Card, ProgressBar, Button, Badge } from '../components/ui';
import './WorldDetail.css';

// ============================================================
// INLINE DATA (will be replaced by curriculum data module)
// ============================================================

interface WorldData {
  id: string;
  name: string;
  emoji: string;
  color: string;
  theme: string;
}

interface LessonData {
  id: string;
  order: number;
  title: string;
  type: 'song' | 'game' | 'flashcard' | 'story' | 'practice' | 'quiz';
  duration: number; // minutes
  xp: number;
  status: 'completed' | 'available' | 'locked';
}

interface VocabPreview {
  word: string;
  emoji: string;
}

const WORLDS_MAP: Record<string, WorldData> = {
  w1:  { id: 'w1',  name: 'Hello World',     emoji: '\u{1F44B}', color: '#f59e0b', theme: 'Greetings & introductions' },
  w2:  { id: 'w2',  name: 'My Body',          emoji: '\u{1F9D2}', color: '#ef4444', theme: 'Body parts & senses' },
  w3:  { id: 'w3',  name: 'Colors & Shapes',  emoji: '\u{1F308}', color: '#8b5cf6', theme: 'Colors, shapes & patterns' },
  w4:  { id: 'w4',  name: 'Animals',          emoji: '\u{1F981}', color: '#10b981', theme: 'Farm, wild & pet animals' },
  w5:  { id: 'w5',  name: 'My Family',        emoji: '\u{1F46A}', color: '#ec4899', theme: 'Family members & relationships' },
  w6:  { id: 'w6',  name: 'Food & Drinks',    emoji: '\u{1F34E}', color: '#f97316', theme: 'Fruits, vegetables & meals' },
  w7:  { id: 'w7',  name: 'My Home',          emoji: '\u{1F3E0}', color: '#3b82f6', theme: 'Rooms, furniture & items' },
  w8:  { id: 'w8',  name: 'Clothes',          emoji: '\u{1F455}', color: '#14b8a6', theme: 'Clothing & weather dressing' },
  w9:  { id: 'w9',  name: 'Nature',           emoji: '\u{1F333}', color: '#22c55e', theme: 'Weather, seasons & plants' },
  w10: { id: 'w10', name: 'School',           emoji: '\u{1F3EB}', color: '#6366f1', theme: 'Classroom objects & school life' },
  w11: { id: 'w11', name: 'City & Transport', emoji: '\u{1F68C}', color: '#a855f7', theme: 'Vehicles, places & directions' },
  w12: { id: 'w12', name: 'Adventures',       emoji: '\u{1F30D}', color: '#d946ef', theme: 'Travel, countries & cultures' },
};

/** Generate 10 placeholder lessons for any world */
function getLessonsForWorld(worldId: string): LessonData[] {
  const types: LessonData['type'][] = [
    'song', 'flashcard', 'game', 'story', 'practice',
    'song', 'game', 'flashcard', 'quiz', 'practice',
  ];
  const titles: Record<string, string[]> = {
    w1: [
      'Say Hello!', 'What is Your Name?', 'Good Morning!', 'How Are You?',
      'Nice to Meet You', 'Hello Song', 'Greeting Match', 'Meet Mimi\'s Friends',
      'Greetings Quiz', 'Practice Time',
    ],
  };
  const defaultTitles = [
    'Introduction', 'New Words', 'Fun Match', 'Story Time', 'Practice',
    'Sing Along', 'Challenge', 'Flashcards', 'Quiz Time', 'Review',
  ];

  const lessonTitles = titles[worldId] || defaultTitles;

  return lessonTitles.map((title, i) => ({
    id: `${worldId}-l${i + 1}`,
    order: i + 1,
    title,
    type: types[i],
    duration: 10 + Math.floor(Math.random() * 8),
    xp: 50 + i * 10,
    status: i === 0 ? 'available' : 'locked',
  }));
}

function getVocabPreview(worldId: string): VocabPreview[] {
  const vocabMap: Record<string, VocabPreview[]> = {
    w1: [
      { word: 'Hello', emoji: '\u{1F44B}' },
      { word: 'Goodbye', emoji: '\u{1F44B}' },
      { word: 'Name', emoji: '\u{1F4DB}' },
      { word: 'Friend', emoji: '\u{1F91D}' },
      { word: 'Morning', emoji: '\u{1F305}' },
      { word: 'Night', emoji: '\u{1F303}' },
      { word: 'Please', emoji: '\u{1F64F}' },
      { word: 'Thank you', emoji: '\u{1F60A}' },
    ],
    w2: [
      { word: 'Head', emoji: '\u{1F9D1}' },
      { word: 'Hand', emoji: '\u{270B}' },
      { word: 'Eye', emoji: '\u{1F441}' },
      { word: 'Ear', emoji: '\u{1F442}' },
      { word: 'Nose', emoji: '\u{1F443}' },
      { word: 'Mouth', emoji: '\u{1F444}' },
    ],
    w4: [
      { word: 'Cat', emoji: '\u{1F431}' },
      { word: 'Dog', emoji: '\u{1F436}' },
      { word: 'Bird', emoji: '\u{1F426}' },
      { word: 'Fish', emoji: '\u{1F41F}' },
      { word: 'Lion', emoji: '\u{1F981}' },
      { word: 'Elephant', emoji: '\u{1F418}' },
    ],
  };

  return vocabMap[worldId] || [
    { word: 'Word 1', emoji: '\u{2B50}' },
    { word: 'Word 2', emoji: '\u{2B50}' },
    { word: 'Word 3', emoji: '\u{2B50}' },
    { word: 'Word 4', emoji: '\u{2B50}' },
    { word: 'Word 5', emoji: '\u{2B50}' },
  ];
}

// ============================================================
// TYPE BADGE CONFIG
// ============================================================

const TYPE_CONFIG: Record<LessonData['type'], { icon: typeof Play; label: string; variant: string }> = {
  song:      { icon: Music,      label: 'Song',      variant: 'info' },
  game:      { icon: Gamepad2,   label: 'Game',      variant: 'success' },
  flashcard: { icon: Layers,     label: 'Flashcard', variant: 'warning' },
  story:     { icon: BookOpen,   label: 'Story',     variant: 'premium' },
  practice:  { icon: Mic,        label: 'Practice',  variant: 'default' },
  quiz:      { icon: HelpCircle, label: 'Quiz',      variant: 'error' },
};

// ============================================================
// ANIMATION
// ============================================================

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

// ============================================================
// COMPONENT
// ============================================================

const WorldDetail = () => {
  const { worldId } = useParams<{ worldId: string }>();
  const world = WORLDS_MAP[worldId || ''];

  if (!world) {
    return (
      <div className="world-detail-page world-detail-page--not-found">
        <h2>World not found</h2>
        <Link to="/worlds">
          <Button variant="secondary" icon={<ArrowLeft size={16} />}>Back to Worlds</Button>
        </Link>
      </div>
    );
  }

  const lessons = getLessonsForWorld(world.id);
  const vocab = getVocabPreview(world.id);
  const completedCount = lessons.filter((l) => l.status === 'completed').length;
  const progressPct = Math.round((completedCount / lessons.length) * 100);

  return (
    <div className="world-detail-page">
      {/* Back */}
      <Link to="/worlds" className="world-detail-back">
        <ArrowLeft size={18} />
        All Worlds
      </Link>

      {/* World Header */}
      <motion.div
        className="world-detail-header"
        style={{
          background: `linear-gradient(135deg, ${world.color}, ${world.color}cc)`,
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="world-detail-header__icon">{world.emoji}</span>
        <div className="world-detail-header__info">
          <h1 className="world-detail-header__name">{world.name}</h1>
          <p className="world-detail-header__theme">{world.theme}</p>
          <div className="world-detail-header__progress">
            <ProgressBar value={progressPct} size="sm" variant="default" showLabel />
            <span className="world-detail-header__count">
              {completedCount}/{lessons.length} lessons completed
            </span>
          </div>
        </div>
      </motion.div>

      {/* Vocabulary Preview */}
      <section className="world-detail-vocab">
        <h2 className="world-detail-section-title">Vocabulary Preview</h2>
        <div className="world-detail-vocab__scroll">
          {vocab.map((v, i) => (
            <div key={i} className="vocab-preview-card">
              <span className="vocab-preview-card__emoji">{v.emoji}</span>
              <span className="vocab-preview-card__word">{v.word}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Lesson List */}
      <section className="world-detail-lessons">
        <h2 className="world-detail-section-title">Lessons</h2>
        <motion.div
          className="world-detail-lessons__list"
          variants={listVariants}
          initial="hidden"
          animate="visible"
        >
          {lessons.map((lesson) => {
            const cfg = TYPE_CONFIG[lesson.type];
            const TypeIcon = cfg.icon;
            const isAvailable = lesson.status === 'available';
            const isCompleted = lesson.status === 'completed';
            const isLocked = lesson.status === 'locked';

            return (
              <motion.div key={lesson.id} variants={itemVariants}>
                {isAvailable ? (
                  <Link
                    to={`/worlds/${world.id}/lessons/${lesson.id}`}
                    className="lesson-card-link"
                  >
                    <LessonCard
                      lesson={lesson}
                      cfg={cfg}
                      TypeIcon={TypeIcon}
                      isAvailable={isAvailable}
                      isCompleted={isCompleted}
                      isLocked={isLocked}
                    />
                  </Link>
                ) : (
                  <div className={`lesson-card-link ${isLocked ? 'lesson-card-link--locked' : ''}`}>
                    <LessonCard
                      lesson={lesson}
                      cfg={cfg}
                      TypeIcon={TypeIcon}
                      isAvailable={isAvailable}
                      isCompleted={isCompleted}
                      isLocked={isLocked}
                    />
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </section>
    </div>
  );
};

// ============================================================
// LESSON CARD
// ============================================================

interface LessonCardProps {
  lesson: LessonData;
  cfg: (typeof TYPE_CONFIG)[LessonData['type']];
  TypeIcon: typeof Play;
  isAvailable: boolean;
  isCompleted: boolean;
  isLocked: boolean;
}

function LessonCard({ lesson, cfg, TypeIcon, isAvailable, isCompleted, isLocked }: LessonCardProps) {
  return (
    <Card
      variant={isAvailable ? 'interactive' : 'default'}
      padding="md"
      className={[
        'lesson-card',
        isCompleted && 'lesson-card--completed',
        isLocked && 'lesson-card--locked',
        isAvailable && 'lesson-card--available',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Number */}
      <div className={`lesson-card__number ${isCompleted ? 'lesson-card__number--done' : ''}`}>
        {isCompleted ? <Check size={18} /> : isLocked ? <Lock size={16} /> : lesson.order}
      </div>

      {/* Info */}
      <div className="lesson-card__info">
        <h3 className="lesson-card__title">{lesson.title}</h3>
        <div className="lesson-card__meta">
          <Badge
            variant={cfg.variant as 'default' | 'success' | 'warning' | 'error' | 'info' | 'premium'}
            size="sm"
            icon={<TypeIcon size={12} />}
          >
            {cfg.label}
          </Badge>
          <span className="lesson-card__duration">
            <Clock size={12} /> {lesson.duration} min
          </span>
          <span className="lesson-card__xp">
            <Star size={12} /> {lesson.xp} XP
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="lesson-card__status">
        {isAvailable && (
          <Button variant="primary" size="sm" icon={<Play size={14} />}>
            Start
          </Button>
        )}
        {isCompleted && (
          <span className="lesson-card__done-badge">
            <Check size={14} /> Done
          </span>
        )}
        {isLocked && (
          <Lock size={18} className="lesson-card__lock-icon" />
        )}
      </div>
    </Card>
  );
}

export default WorldDetail;
