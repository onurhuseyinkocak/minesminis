/**
 * LEVEL UP MODAL
 * Celebration modal when user levels up
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './LevelUpModal.css';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarBurst, StreakFlame } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';
import { getGardenStats } from '../services/gardenService';
import { Star, Sprout, ChevronRight, X } from 'lucide-react';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, newLevel, dismissLevelUp, stats } = useGamification();
    const { t, lang } = useLanguage();
    const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);
    const [showStarBurst, setShowStarBurst] = useState(false);
    const starBurstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') dismissLevelUp();
    }, [dismissLevelUp]);

    useEffect(() => {
        if (showLevelUp) {
            // Generate confetti
            const colors = ['var(--accent-amber)', 'var(--accent-indigo)', 'var(--accent-green)', 'var(--accent-orange)', 'var(--accent-pink)', 'var(--accent-purple)'];
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
            setConfetti(pieces);

            // Trigger StarBurst + SFX
            setShowStarBurst(true);
            SFX.levelUp();
            starBurstTimerRef.current = setTimeout(() => setShowStarBurst(false), 1500);

            // Auto dismiss after 4 seconds
            const timer = setTimeout(() => {
                dismissLevelUp();
            }, 4000);

            // Focus the modal and listen for Escape
            modalRef.current?.focus();
            document.addEventListener('keydown', handleKeyDown);

            return () => {
                clearTimeout(timer);
                document.removeEventListener('keydown', handleKeyDown);
                if (starBurstTimerRef.current) {
                    clearTimeout(starBurstTimerRef.current);
                    starBurstTimerRef.current = null;
                }
            };
        }
    }, [showLevelUp, dismissLevelUp, handleKeyDown]);

    if (!showLevelUp) return null;

    return (
        <div
            className="level-up-overlay"
            onClick={dismissLevelUp}
            role="dialog"
            aria-modal="true"
            aria-label={lang === 'tr' ? 'Seviye atladın' : 'Level up'}
        >
            {/* StarBurst celebration */}
            {showStarBurst && <StarBurst count={16} />}

            {/* Confetti */}
            <div className="confetti-container">
                {confetti.map((piece) => (
                    <div
                        key={piece.id}
                        className="confetti-piece"
                        style={{
                            left: `${piece.left}%`,
                            animationDelay: `${piece.delay}s`,
                            backgroundColor: piece.color,
                        }}
                    />
                ))}
            </div>

            <div
                ref={modalRef}
                className="level-up-modal"
                onClick={(e) => e.stopPropagation()}
                tabIndex={-1}
            >
                <button
                    type="button"
                    className="level-up-close-btn"
                    onClick={dismissLevelUp}
                    aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
                >
                    <X size={20} />
                </button>
                <div className="level-up-glow" />

                <div className="level-up-content">
                    <div className="stars-container">
                        <span className="star star-1"><Star size={20} /></span>
                        <span className="star star-2"><Star size={20} /></span>
                        <span className="star star-3"><Star size={20} /></span>
                    </div>

                    <h2 className="level-up-title">{t('levelUp.title')}</h2>

                    <div className="new-level-display">
                        <span className="level-label">{t('levelUp.youReached')}</span>
                        <span className="level-number">{newLevel}</span>
                    </div>

                    {stats.streakDays >= 2 && (
                        <div className="level-up-streak-row">
                            <StreakFlame days={stats.streakDays} />
                            <span className="level-up-streak-text">{stats.streakDays} {t('dailyReward.dayStreak')}!</span>
                        </div>
                    )}

                    <p className="level-up-message">
                        {t('levelUp.message')}
                        {(() => {
                            const gardenStats = getGardenStats();
                            if (gardenStats.blooming > 0) {
                                return (
                                    <span className="level-up-garden-note">
                                        <Sprout size={20} /> {lang === 'tr'
                                            ? `Bahçende ${gardenStats.blooming} çiçek açmış bitkin var!`
                                            : `Your garden has ${gardenStats.blooming} blooming plant${gardenStats.blooming !== 1 ? 's' : ''}!`}
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </p>

                    <button type="button" className="continue-btn" onClick={dismissLevelUp}>
                        <span>{t('common.continue') || (lang === 'tr' ? 'Devam' : 'Continue')}</span>
                        <ChevronRight size={18} className="btn-arrow-icon" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;
