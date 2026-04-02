/**
 * LEVEL UP TOAST
 * Compact notification toast when user levels up
 * Appears from the top of the screen near the navbar
 * Auto-dismisses after 4 seconds or on click
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './LevelUpModal.css';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { SFX } from '../data/soundLibrary';
import { Star, X } from 'lucide-react';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, newLevel, dismissLevelUp, stats } = useGamification();
    const { t, lang } = useLanguage();
    const [isExiting, setIsExiting] = useState(false);
    const toastRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDismiss = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            setIsExiting(false);
            dismissLevelUp();
        }, 300);
    }, [dismissLevelUp]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') handleDismiss();
    }, [handleDismiss]);

    useEffect(() => {
        if (showLevelUp) {
            SFX.levelUp();

            // Auto dismiss after 4 seconds
            timerRef.current = setTimeout(() => {
                handleDismiss();
            }, 4000);

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                if (timerRef.current) clearTimeout(timerRef.current);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [showLevelUp, handleDismiss, handleKeyDown]);

    if (!showLevelUp) return null;

    return (
        <div
            ref={toastRef}
            className={`levelup-toast ${isExiting ? 'levelup-toast--exit' : ''}`}
            onClick={handleDismiss}
            role="status"
            aria-live="polite"
            aria-label={lang === 'tr' ? 'Seviye atladın' : 'Level up'}
        >
            {/* Progress bar that shrinks over 4s */}
            <div className="levelup-toast__progress" />

            {/* Glowing level badge */}
            <div className="levelup-toast__badge">
                <Star size={14} className="levelup-toast__star" />
                <span className="levelup-toast__level">{newLevel}</span>
            </div>

            {/* Text content */}
            <div className="levelup-toast__content">
                <span className="levelup-toast__title">{t('levelUp.title')}</span>
                <span className="levelup-toast__subtitle">
                    {t('levelUp.youReached')} {newLevel}
                    {stats.streakDays >= 2 && (
                        <> &middot; {stats.streakDays} {t('dailyReward.dayStreak')}</>
                    )}
                </span>
            </div>

            {/* Close button */}
            <button
                type="button"
                className="levelup-toast__close"
                onClick={(e) => { e.stopPropagation(); handleDismiss(); }}
                aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
            >
                <X size={14} />
            </button>
        </div>
    );
};

export default LevelUpModal;
