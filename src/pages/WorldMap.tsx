/**
 * WORLD MAP — World Selection Grid
 * MinesMinis v4.0
 *
 * Route: /worlds
 * Displays all 12 curriculum worlds in a responsive grid.
 * World 1 is always unlocked; the rest are locked.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Card, ProgressBar } from '../components/ui';
import './WorldMap.css';

// ============================================================
// WORLDS DATA (inline — mirrors AdminCurriculumManager worlds)
// ============================================================

interface WorldInfo {
  id: string;
  order: number;
  name: string;
  emoji: string;
  color: string;
  theme: string;
  lessonTotal: number;
}

const WORLDS: WorldInfo[] = [
  { id: 'w1',  order: 1,  name: 'Hello World',       emoji: '\u{1F44B}', color: 'var(--primary)', theme: 'Greetings & introductions',          lessonTotal: 10 },
  { id: 'w2',  order: 2,  name: 'My Body',            emoji: '\u{1F9D2}', color: 'var(--error)', theme: 'Body parts & senses',                lessonTotal: 10 },
  { id: 'w3',  order: 3,  name: 'Colors & Shapes',    emoji: '\u{1F308}', color: 'var(--accent-purple)', theme: 'Colors, shapes & patterns',          lessonTotal: 10 },
  { id: 'w4',  order: 4,  name: 'Animals',            emoji: '\u{1F981}', color: 'var(--accent-emerald)', theme: 'Farm, wild & pet animals',            lessonTotal: 10 },
  { id: 'w5',  order: 5,  name: 'My Family',          emoji: '\u{1F46A}', color: 'var(--accent-pink)', theme: 'Family members & relationships',      lessonTotal: 10 },
  { id: 'w6',  order: 6,  name: 'Food & Drinks',      emoji: '\u{1F34E}', color: 'var(--accent-orange)', theme: 'Fruits, vegetables & meals',          lessonTotal: 10 },
  { id: 'w7',  order: 7,  name: 'My Home',            emoji: '\u{1F3E0}', color: 'var(--accent-blue)', theme: 'Rooms, furniture & items',            lessonTotal: 10 },
  { id: 'w8',  order: 8,  name: 'Clothes',            emoji: '\u{1F455}', color: 'var(--accent-teal)', theme: 'Clothing & weather dressing',         lessonTotal: 10 },
  { id: 'w9',  order: 9,  name: 'Nature',             emoji: '\u{1F333}', color: 'var(--accent-green)', theme: 'Weather, seasons & plants',           lessonTotal: 10 },
  { id: 'w10', order: 10, name: 'School',             emoji: '\u{1F3EB}', color: 'var(--accent-indigo)', theme: 'Classroom objects & school life',     lessonTotal: 10 },
  { id: 'w11', order: 11, name: 'City & Transport',   emoji: '\u{1F68C}', color: 'var(--accent-violet)', theme: 'Vehicles, places & directions',       lessonTotal: 10 },
  { id: 'w12', order: 12, name: 'Adventures',         emoji: '\u{1F30D}', color: 'var(--accent-fuchsia)', theme: 'Travel, countries & cultures',        lessonTotal: 10 },
];

// Placeholder progress (World 1: 30%, rest: 0%)
function getWorldProgress(worldId: string): { completed: number; total: number } {
  if (worldId === 'w1') return { completed: 3, total: 10 };
  return { completed: 0, total: 10 };
}

function isWorldUnlocked(worldId: string): boolean {
  return worldId === 'w1';
}

function isCurrentWorld(worldId: string): boolean {
  return worldId === 'w1';
}

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 20 },
  },
};

// ============================================================
// COMPONENT
// ============================================================

const WorldMap = () => {
  return (
    <div className="world-map-page">
      {/* Header */}
      <div className="world-map-header">
        <div className="world-map-header__text">
          <h1 className="world-map-title">Choose Your World</h1>
          <p className="world-map-subtitle">
            <Sparkles size={18} />
            Mimi is waiting for you! Pick a world and start learning.
          </p>
        </div>
        <div className="world-map-mimi">
          <span className="world-map-mimi__avatar" aria-hidden="true">
            🐉
          </span>
        </div>
      </div>

      {/* Grid */}
      <motion.div
        className="world-map-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {WORLDS.map((world) => {
          const progress = getWorldProgress(world.id);
          const unlocked = isWorldUnlocked(world.id);
          const current = isCurrentWorld(world.id);
          const pct = Math.round((progress.completed / progress.total) * 100);

          return (
            <motion.div key={world.id} variants={cardVariants}>
              {unlocked ? (
                <Link
                  to={`/worlds/${world.id}`}
                  className="world-card-link"
                  aria-label={`${world.name} - ${pct}% complete`}
                >
                  <WorldCard
                    world={world}
                    progress={progress}
                    pct={pct}
                    unlocked
                    current={current}
                  />
                </Link>
              ) : (
                <div className="world-card-link world-card-link--locked" aria-label={`${world.name} - Locked`}>
                  <WorldCard
                    world={world}
                    progress={progress}
                    pct={pct}
                    unlocked={false}
                    current={false}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

// ============================================================
// WORLD CARD
// ============================================================

interface WorldCardProps {
  world: WorldInfo;
  progress: { completed: number; total: number };
  pct: number;
  unlocked: boolean;
  current: boolean;
}

function WorldCard({ world, progress, pct, unlocked, current }: WorldCardProps) {
  return (
    <Card
      variant={unlocked ? 'interactive' : 'default'}
      padding="none"
      className={[
        'world-card',
        !unlocked && 'world-card--locked',
        current && 'world-card--current',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Gradient Top */}
      <div
        className="world-card__top"
        style={{
          background: unlocked
            ? `linear-gradient(135deg, ${world.color}, ${world.color}cc)`
            : 'var(--bg-muted)',
        }}
      >
        <span className="world-card__icon">{world.emoji}</span>
        {!unlocked && (
          <span className="world-card__lock-overlay">
            <Lock size={28} />
          </span>
        )}
        {current && (
          <span className="world-card__current-badge">
            <Sparkles size={14} /> Current
          </span>
        )}
        {pct === 100 && unlocked && (
          <span className="world-card__complete-badge">
            <Check size={14} /> Done
          </span>
        )}
      </div>

      {/* Body */}
      <div className="world-card__body">
        <h3 className="world-card__name">{world.name}</h3>
        <p className="world-card__theme">{world.theme}</p>

        <div className="world-card__progress-row">
          <ProgressBar
            value={pct}
            size="sm"
            variant={pct === 100 ? 'success' : 'default'}
            animated={current}
          />
          <span className="world-card__lesson-count">
            {progress.completed}/{progress.total} lessons
          </span>
        </div>

        {unlocked && (
          <span className="world-card__go">
            {current ? 'Continue' : 'Start'} <ChevronRight size={16} />
          </span>
        )}
      </div>
    </Card>
  );
}

export default WorldMap;
