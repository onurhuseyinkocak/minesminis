/**
 * ComboDisplay
 * In-game combo counter with multiplier tiers.
 * Shown in game components when consecutive correct answers build.
 * Duolingo-style variable reward: 3x = 1.5x, 5x = 2x, 10x = 3x XP.
 */
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getComboTier } from '../services/psychGamification';
import './ComboDisplay.css';

interface ComboDisplayProps {
  combo: number;
  lang?: 'tr' | 'en';
}

export function ComboDisplay({ combo, lang = 'tr' }: ComboDisplayProps) {
  const tier = getComboTier(combo);
  const prevCombo = useRef(0);

  // Track if combo just increased
  const justIncreased = combo > prevCombo.current;
  useEffect(() => {
    prevCombo.current = combo;
  });

  if (combo < 2) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={combo}
        className={`combo${tier ? ' combo--tier' : ''}`}
        style={tier ? { '--combo-color': tier.color } as React.CSSProperties : undefined}
        initial={{ scale: justIncreased ? 1.4 : 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
      >
        <Zap size={18} className="combo__icon" />
        <span className="combo__count">{combo}×</span>
        {tier && (
          <span className="combo__label">
            {lang === 'tr' ? tier.labelTr : tier.label}
          </span>
        )}
        {tier && (
          <span className="combo__mult">
            {tier.multiplier}× XP
          </span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default ComboDisplay;
