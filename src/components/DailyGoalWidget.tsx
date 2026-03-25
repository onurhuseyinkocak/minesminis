/**
 * DailyGoalWidget
 * Circular SVG progress arc showing today's XP vs daily goal.
 * Clicking opens goal selector (Casual / Normal / Serious / Intense).
 * Duolingo-style commitment device — shown prominently in Dashboard.
 */
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import {
  getDailyGoal,
  setDailyGoal,
  getTodayXP,
  isDailyGoalMet,
  DAILY_GOAL_OPTIONS,
  type DailyGoalLevel,
} from '../services/psychGamification';
import './DailyGoalWidget.css';

interface DailyGoalWidgetProps {
  uid: string;
  lang?: 'tr' | 'en';
}

const CIRCLE_R = 34;
const CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

export function DailyGoalWidget({ uid, lang = 'tr' }: DailyGoalWidgetProps) {
  const [goal, setGoalState] = useState<DailyGoalLevel>(getDailyGoal);
  const [todayXP] = useState(() => getTodayXP(uid));
  const [showSelector, setShowSelector] = useState(false);

  const isMet = isDailyGoalMet(uid);
  const progress = Math.min(todayXP / goal, 1);
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const handleGoalChange = (newGoal: DailyGoalLevel) => {
    setDailyGoal(newGoal);
    setGoalState(newGoal);
    setShowSelector(false);
  };

  const currentOption = DAILY_GOAL_OPTIONS.find(o => o.xp === goal)!;

  return (
    <div className="dgw">
      <button
        type="button"
        className="dgw__ring-btn"
        onClick={() => setShowSelector(true)}
        aria-label={lang === 'tr' ? 'Günlük hedefi değiştir' : 'Change daily goal'}
      >
        {/* SVG circular progress */}
        <svg className="dgw__svg" viewBox="0 0 80 80" aria-hidden="true">
          {/* Track */}
          <circle
            cx="40" cy="40" r={CIRCLE_R}
            fill="none"
            strokeWidth="7"
            className="dgw__track"
          />
          {/* Progress */}
          <motion.circle
            cx="40" cy="40" r={CIRCLE_R}
            fill="none"
            strokeWidth="7"
            className={`dgw__progress${isMet ? ' dgw__progress--done' : ''}`}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            initial={{ strokeDashoffset: CIRCUMFERENCE }}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </svg>

        {/* Center content */}
        <div className="dgw__center">
          {isMet ? (
            <Check size={20} className="dgw__check" />
          ) : (
            <>
              <span className="dgw__xp">{todayXP}</span>
              <span className="dgw__goal">/{goal}</span>
            </>
          )}
        </div>
      </button>

      {/* Label */}
      <div className="dgw__label">
        <span className="dgw__label-title">
          {lang === 'tr' ? 'Günlük Hedef' : 'Daily Goal'}
        </span>
        <span className="dgw__label-sub">
          {lang === 'tr' ? currentOption.labelTr : currentOption.label} XP
        </span>
      </div>

      {/* Goal Selector Modal */}
      <AnimatePresence>
        {showSelector && (
          <motion.div
            className="dgw__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSelector(false)}
          >
            <motion.div
              className="dgw__selector"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
              onClick={e => e.stopPropagation()}
            >
              <h3 className="dgw__selector-title">
                {lang === 'tr' ? 'Günlük Hedefinizi Seçin' : 'Choose Your Daily Goal'}
              </h3>
              <p className="dgw__selector-sub">
                {lang === 'tr'
                  ? 'Her gün bu kadar XP kazanmayı hedefleyin'
                  : 'Aim to earn this much XP every day'}
              </p>
              <div className="dgw__options">
                {DAILY_GOAL_OPTIONS.map(opt => (
                  <button
                    key={opt.xp}
                    type="button"
                    className={`dgw__option${goal === opt.xp ? ' dgw__option--active' : ''}`}
                    onClick={() => handleGoalChange(opt.xp)}
                  >
                    <span className="dgw__option-xp">{opt.xp} XP</span>
                    <span className="dgw__option-label">
                      {lang === 'tr' ? opt.labelTr : opt.label}
                    </span>
                    {goal === opt.xp && <Check size={14} className="dgw__option-check" />}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DailyGoalWidget;
