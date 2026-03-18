/**
 * LEVEL UP MODAL
 * Celebration modal when user levels up
 */

import React, { useEffect, useState } from 'react';
import './LevelUpModal.css';
import { useGamification } from '../contexts/GamificationContext';
import { StarBurst, StreakFlame } from './ui/Celebrations';
import { SFX } from '../data/soundLibrary';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, newLevel, dismissLevelUp, stats } = useGamification();
    const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);
    const [showStarBurst, setShowStarBurst] = useState(false);

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
            setTimeout(() => setShowStarBurst(false), 1500);

            // Auto dismiss after 4 seconds
            const timer = setTimeout(() => {
                dismissLevelUp();
            }, 4000);

            return () => clearTimeout(timer);
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
                        <span className="star star-1">⭐</span>
                        <span className="star star-2">⭐</span>
                        <span className="star star-3">⭐</span>
                    </div>

                    <h2 className="level-up-title">LEVEL UP!</h2>

                    <div className="new-level-display">
                        <span className="level-label">You reached</span>
                        <span className="level-number">{newLevel}</span>
                    </div>

                    {stats.streakDays >= 2 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' }}>
                            <StreakFlame days={stats.streakDays} />
                            <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>{stats.streakDays} Day Streak!</span>
                        </div>
                    )}

                    <p className="level-up-message">
                        Amazing work! Keep learning to unlock more rewards! 🎉
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
