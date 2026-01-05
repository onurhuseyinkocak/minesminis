/**
 * PARENT DASHBOARD PAGE
 * Allows parents to track their child's progress
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useGamification } from '../../contexts/GamificationContext';
import { Clock, Settings, Download } from 'lucide-react';
import './ParentDashboard.css';

const ParentDashboard: React.FC = () => {
    const { userProfile } = useAuth();
    const { stats } = useGamification();

    const childStats = [
        { label: 'Words Learned', value: stats.wordsLearned, icon: '📖', color: '#6366f1' },
        { label: 'Games Played', value: stats.gamesPlayed, icon: '🎮', color: '#10b981' },
        { label: 'Videos Watched', value: stats.videosWatched, icon: '🎬', color: '#f59e0b' },
        { label: 'Weekly Activities', value: 12, icon: '📅', color: '#ec4899' },
    ];

    return (
        <div className="parent-dashboard">
            <div className="parent-header">
                <div className="header-info">
                    <h1>Welcome, Parent! 👋</h1>
                    <p>Tracking progress for <strong>{userProfile?.display_name || 'your child'}</strong></p>
                </div>
                <div className="header-actions">
                    <button className="parent-action-btn primary">
                        <Download size={18} /> Download Weekly Report
                    </button>
                    <button className="parent-action-btn secondary">
                        <Settings size={18} /> Controls
                    </button>
                </div>
            </div>

            <div className="parent-stats-grid">
                {childStats.map((stat, index) => (
                    <div key={index} className="parent-stat-card premium-card">
                        <div className="p-stat-icon" style={{ background: `${stat.color}15`, color: stat.color }}>
                            <span>{stat.icon}</span>
                        </div>
                        <div className="p-stat-info">
                            <span className="p-stat-value">{stat.value}</span>
                            <span className="p-stat-label">{stat.label}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="parent-main-grid">
                <div className="recent-activity-section premium-card">
                    <div className="section-header">
                        <h3><Clock size={20} /> Recent Activity</h3>
                    </div>
                    <div className="activity-list">
                        <div className="activity-item">
                            <div className="activity-bubble">📖</div>
                            <div className="activity-details">
                                <span className="activity-title">Learned "Animals" vocabulary</span>
                                <span className="activity-time">2 hours ago</span>
                            </div>
                            <div className="activity-reward">+20 XP</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-bubble">🎮</div>
                            <div className="activity-details">
                                <span className="activity-title">Played "Memory Match" Game</span>
                                <span className="activity-time">3 hours ago</span>
                            </div>
                            <div className="activity-reward">+15 XP</div>
                        </div>
                        <div className="activity-item">
                            <div className="activity-bubble">🏅</div>
                            <div className="activity-details">
                                <span className="activity-title">Earned "Fast Learner" Badge</span>
                                <span className="activity-time">Yesterday</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="parent-sidebar">
                    <div className="parental-tips premium-card">
                        <h3>💡 Parent Tip</h3>
                        <p>Try asking "{userProfile?.display_name}" about the animals they learned today to reinforce their memory!</p>
                    </div>

                    <div className="safety-controls premium-card">
                        <h3>🛡️ Safety & Controls</h3>
                        <div className="control-item">
                            <span>Screen Time Limit</span>
                            <span className="control-status">2h / Day</span>
                        </div>
                        <div className="control-item">
                            <span>Teacher Messaging</span>
                            <span className="control-status enabled">Enabled</span>
                        </div>
                        <div className="control-item">
                            <span>Multiplayer Access</span>
                            <span className="control-status restricted">Restricted</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParentDashboard;
