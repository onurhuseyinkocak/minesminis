/**
 * XP BAR COMPONENT
 * Visual XP progress bar with level display
 */

import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import './XPBar.css';

interface XPBarProps {
    compact?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ compact = false }) => {
    const { stats, getXPProgress, getXPForNextLevel, getStreakBonus } = useGamification();

    const progress = getXPProgress();
    const xpNeeded = getXPForNextLevel();
    const streakBonus = getStreakBonus();

    if (compact) {
        return (
            <div className="xp-bar-compact">
                <div className="xp-level-badge">
                    <span className="level-icon">⭐</span>
                    <span className="level-num">{stats.level}</span>
                </div>
                <div className="xp-mini-bar">
                    <div className="xp-mini-fill" style={{ width: `${progress}%` }} />
                </div>
                {stats.streakDays > 0 && (
                    <div className="streak-badge-mini">
                        <span>🔥</span>
                        <span>{stats.streakDays}</span>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="xp-bar-container">
            <div className="xp-bar-header">
                <div className="xp-level">
                    <span className="level-label">Level</span>
                    <span className="level-number">{stats.level}</span>
                </div>
                <div className="xp-info">
                    <span className="xp-current">{stats.xp} XP</span>
                    <span className="xp-divider">/</span>
                    <span className="xp-needed">{xpNeeded} XP</span>
                </div>
            </div>

            <div className="xp-bar">
                <div
                    className="xp-bar-fill"
                    style={{ width: `${progress}%` }}
                >
                    <div className="xp-bar-shine" />
                </div>
            </div>

            <div className="xp-bar-footer">
                {stats.streakDays > 0 && (
                    <div className="streak-info">
                        <span className="streak-icon">🔥</span>
                        <span className="streak-days">{stats.streakDays} day streak</span>
                        {streakBonus > 0 && (
                            <span className="streak-bonus">+{streakBonus}% XP bonus</span>
                        )}
                    </div>
                )}
                <div className="next-level-info">
                    {100 - progress}% to Level {stats.level + 1}
                </div>
            </div>
        </div>
    );
};

export default XPBar;
