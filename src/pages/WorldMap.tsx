/**
 * WORLD MAP — World Selection Grid
 * MinesMinis v4.0
 *
 * Route: /worlds
 * Displays all 12 curriculum worlds in a responsive grid.
 * Uses real curriculum data and progress tracking.
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Check, ChevronRight, Sparkles } from 'lucide-react';
import { Card, ProgressBar } from '../components/ui';
import UnifiedMascot from '../components/UnifiedMascot';
import { useAuth } from '../contexts/AuthContext';
import { WORLDS } from '../data/curriculum';
import {
  isWorldUnlocked,
  getWorldCompletionCount,
  getCurrentLesson,
} from '../data/progressTracker';
import './WorldMap.css';

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
  const { user } = useAuth();
  const userId = user?.uid || 'guest';
  const currentLessonInfo = getCurrentLesson(userId);

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
          <UnifiedMascot id="mimi_dragon" state="waving" size={80} />
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
          const completed = getWorldCompletionCount(userId, world.id);
          const total = world.lessons.length;
          const unlocked = isWorldUnlocked(userId, world.id);
          const current = currentLessonInfo?.worldId === world.id;
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

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
                    progress={{ completed, total }}
                    pct={pct}
                    unlocked
                    current={current}
                  />
                </Link>
              ) : (
                <div className="world-card-link world-card-link--locked" aria-label={`${world.name} - Locked`}>
                  <WorldCard
                    world={world}
                    progress={{ completed, total }}
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
  world: (typeof WORLDS)[number];
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
        <span className="world-card__icon">{world.icon}</span>
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
