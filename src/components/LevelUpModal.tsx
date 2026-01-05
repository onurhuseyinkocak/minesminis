/**
 * LEVEL UP MODAL
 * Celebration modal when user levels up
 */

import React, { useEffect, useState } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import './LevelUpModal.css';

const LevelUpModal: React.FC = () => {
    const { showLevelUp, newLevel, dismissLevelUp } = useGamification();
    const [confetti, setConfetti] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

    useEffect(() => {
        if (showLevelUp) {
            // Generate confetti
            const colors = ['#fbbf24', '#6366f1', '#22c55e', '#f97316', '#ec4899', '#8b5cf6'];
            const pieces = Array.from({ length: 50 }, (_, i) => ({
                id: i,
                left: Math.random() * 100,
                delay: Math.random() * 0.5,
                color: colors[Math.floor(Math.random() * colors.length)],
            }));
            setConfetti(pieces);

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
