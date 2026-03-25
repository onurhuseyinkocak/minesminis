/**
 * PerfectLessonBanner
 * Shown in LessonCompleteScreen when user makes zero mistakes.
 * 2× XP bonus + special animation. Duolingo-style perfect lesson reward.
 */
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { SFX } from '../data/soundLibrary';
import './PerfectLessonBanner.css';

interface PerfectLessonBannerProps {
  bonusXP: number;
  lang?: 'tr' | 'en';
}

export function PerfectLessonBanner({ bonusXP, lang = 'tr' }: PerfectLessonBannerProps) {
  useEffect(() => {
    SFX.streak();
  }, []);

  return (
    <motion.div
      className="plb"
      initial={{ scale: 0, rotate: -8 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 360, damping: 18, delay: 0.5 }}
    >
      <div className="plb__stars" aria-hidden="true">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6 + i * 0.1, type: 'spring', stiffness: 400 }}
          >
            <Star size={14} fill="currentColor" />
          </motion.span>
        ))}
      </div>
      <span className="plb__label">
        {lang === 'tr' ? 'Mükemmel Ders!' : 'Perfect Lesson!'}
      </span>
      <span className="plb__bonus">+{bonusXP} bonus XP</span>
    </motion.div>
  );
}

export default PerfectLessonBanner;
