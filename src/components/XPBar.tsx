/**
 * XP BAR COMPONENT
 * Visual XP progress bar with level display
 */

import React from 'react';
import './XPBar.css';
import { useGamification, getTotalXPForLevel } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Flame, Star } from 'lucide-react';

interface XPBarProps {
    compact?: boolean;
}

const XPBar: React.FC<XPBarProps> = ({ compact = false }) => {
    const { stats, getXPProgress, getXPForNextLevel, getStreakBonus } = useGamification();
    const { lang } = useLanguage();

    const progress = getXPProgress();
    const xpNeeded = getXPForNextLevel(); // XP span of the current level
    const levelStartXP = getTotalXPForLevel(stats.level); // cumulative XP at start of current level
    const xpIntoLevel = Math.max(0, stats.xp - levelStartXP); // XP earned within this level
    const streakBonus = getStreakBonus();

    if (compact) {
        return (
            <div className="xp-bar-compact">
                <div className="xp-level-badge">
                    <Star size={14} fill="var(--warning)" color="var(--warning)" className="level-icon" />
                    <span className="level-num">{stats.level}</span>
                </div>
                <div className="xp-mini-bar">
                    <div className="xp-mini-fill" style={{ width: `${progress}%` }} />
                </div>
                {stats.streakDays > 0 && (
                    <div className="streak-badge-mini">
                        <Flame size={14} className="streak-flame-icon" />
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
                    <span className="level-label">{lang === 'tr' ? 'Seviye' : 'Level'}</span>
                    <span className="level-number">{stats.level}</span>
                </div>
                <div className="xp-info">
                    <span className="xp-current">{xpIntoLevel} XP</span>
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
                        <Flame size={16} className="streak-icon streak-flame-icon" />
                        <span className="streak-days">
                            {lang === 'tr'
                                ? `${stats.streakDays} günlük seri`
                                : `${stats.streakDays} day streak`}
                        </span>
                        {streakBonus > 0 && (
                            <span className="streak-bonus">+{streakBonus}% XP bonus</span>
                        )}
                    </div>
                )}
                <div className="next-level-info">
                    {lang === 'tr'
                        ? `Seviye ${stats.level + 1} için ${xpIntoLevel}/${xpNeeded} XP`
                        : `${xpIntoLevel}/${xpNeeded} XP to Level ${stats.level + 1}`}
                </div>
            </div>
        </div>
    );
};

export default XPBar;
