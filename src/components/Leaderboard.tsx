/**
 * LEADERBOARD COMPONENT
 * Weekly top students display
 * TODO: Connect to Supabase for real data when users accumulate XP
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Leaderboard.css';

const Leaderboard: React.FC = () => {
    const { userProfile } = useAuth();

    // Leaderboard will be populated when users start earning XP
    // For now, show a motivational message instead of fake data

    return (
        <div className="leaderboard-card premium-card">
            <div className="leaderboard-header">
                <h3>🏆 Top Students</h3>
                <span className="week-label">This Week</span>
            </div>

            <div className="leaderboard-empty">
                <div className="empty-icon">🌟</div>
                <p className="empty-title">Be a Star Student!</p>
                <p className="empty-text">
                    Play games, watch videos, and learn words to earn XP and appear on the leaderboard!
                </p>
            </div>

            {userProfile && (
                <div className="user-position-row your-stats">
                    <div className="leader-avatar">{userProfile.avatar_url || '👤'}</div>
                    <div className="leader-info">
                        <span className="leader-name">{userProfile.display_name || 'You'}</span>
                        <span className="leader-points">{userProfile.points || 0} XP</span>
                    </div>
                    <div className="position-diff">Keep learning! 🚀</div>
                </div>
            )}
        </div>
    );
};

export default Leaderboard;
