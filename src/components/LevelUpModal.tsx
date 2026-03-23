/**
 * LEVEL UP MODAL
 * Celebration modal when user levels up
 */

import React, { useEffect, useRef, useState } from 'react';
import './LevelUpModal.css';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { StarBurst, StreakFlame } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';
import { getGardenStats } from '../services/gardenService';
import { Star, Sprout } from 'lucide-react';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, newLevel, dismissLevelUp, stats } = useGamification();
    const { t } = useLanguage();
    const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);
    const [showStarBurst, setShowStarBurst] = useState(false);
    const starBurstTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

            return () => {
                clearTimeout(timer);
                if (starBurstTimerRef.current) {
                    clearTimeout(starBurstTimerRef.current);
                    starBurstTimerRef.current = null;
                }
            };
        }
    }, [showLevelUp, dismissLevelUp]);

    if (!showLevelUp) return null;

    return (
        <div className="level-up-overlay" onClick={dismissLevelUp}>
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

            <div className="level-up-modal" onClick={(e) => e.stopPropagation()}>
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                            <StreakFlame days={stats.streakDays} />
                            <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{stats.streakDays} {t('dailyReward.dayStreak')}!</span>
                        </div>
                    )}

                    <p className="level-up-message">
                        {t('levelUp.message')}
                        {(() => {
                            const gardenStats = getGardenStats();
                            if (gardenStats.blooming > 0) {
                                return (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', marginTop: '0.3rem', fontSize: '0.85em' }}>
                                        <Sprout size={20} /> Your garden has {gardenStats.blooming} blooming plant{gardenStats.blooming !== 1 ? 's' : ''}!
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </p>

                    <button className="continue-btn" onClick={dismissLevelUp}>
                        <span>Continue</span>
                        <span className="btn-arrow">→</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LevelUpModal;
