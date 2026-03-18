import React, { useState, useEffect } from 'react';
import './Leaderboard.css';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Trophy, Crown, Star, ChevronRight, Clock } from 'lucide-react';

interface LeaderboardEntry {
    id: string;
    display_name: string;
    avatar_url: string | null;
    settings: Record<string, unknown> | null;
    level: number;
}

const Leaderboard: React.FC = () => {
    const { userProfile, user } = useAuth();
    const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        fetchLeaderboard();

        // Timer for weekly reset (Monday 00:00)
        const updateTimer = () => {
            const now = new Date();
            const nextMonday = new Date();
            const day = now.getDay();
            const diff = (day === 0 ? 1 : 8 - day); // Days until next Monday
            nextMonday.setDate(now.getDate() + diff);
            nextMonday.setHours(0, 0, 0, 0);

            const totalSeconds = Math.floor((nextMonday.getTime() - now.getTime()) / 1000);
            const d = Math.floor(totalSeconds / (3600 * 24));
            const h = Math.floor((totalSeconds % (3600 * 24)) / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);

            setTimeLeft(`${d}d ${h}h ${m}m`);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 60000);
        return () => clearInterval(timer);
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('users')
                .select('id, display_name, avatar_url, settings, level')
                .order('weekly_xp', { ascending: false })
                .limit(5);

            if (error) throw error;
            setLeaders(data || []);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="leaderboard-premium">
            <div className="leader-header">
                <div className="header-title">
                    <Trophy className="trophy-gold" size={24} />
                    <h3>Weekly <span>Mimi</span></h3>
                </div>
                <div className="prize-pill">
                    <Crown size={14} />
                    <span>WIN 1 WEEK PREMIUM</span>
                </div>
            </div>

            <div className="reset-timer">
                <Clock size={14} />
                <span>Resets in: {timeLeft}</span>
            </div>

            <div className="leader-list">
                {loading ? (
                    <div className="loading-state">Finding the stars...</div>
                ) : leaders.length > 0 ? (
                    leaders.map((entry, index) => (
                        <div
                            key={entry.id}
                            className={`leader-row ${entry.id === user?.uid ? 'is-me' : ''} ${index === 0 ? 'rank-1' : ''}`}
                        >
                            <div className="rank-badge">{index + 1}</div>
                            <div className="avatar-mini">
                                {entry.avatar_url ? (
                                    <img src={entry.avatar_url} alt={entry.display_name} />
                                ) : (
                                    <div className="avatar-placeholder">{entry.display_name?.[0] || '?'}</div>
                                )}
                                {index === 0 && <Crown className="crown-icon" size={14} />}
                            </div>
                            <div className="leader-name-group">
                                <span className="leader-name">{entry.display_name || 'Anonymous Student'}</span>
                                <span className="leader-lvl">Level {entry.level}</span>
                            </div>
                            <div className="leader-xp">
                                <strong>{(entry.settings?.weekly_xp as number) || 0}</strong>
                                <span>XP</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <Star className="star-bounce" />
                        <p>No champions yet this week. Be the first!</p>
                    </div>
                )}
            </div>

            {userProfile && (
                <div className="user-context-action">
                    <div className="status-box">
                        <Star size={16} />
                        <span>You have <strong>{(userProfile.settings as Record<string, unknown>)?.weekly_xp as number || 0}</strong> XP this week</span>
                    </div>
                    <ChevronRight size={18} />
                </div>
            )}

            <style>{`
                .leaderboard-premium {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 24px;
                    color: var(--text-main);
                }

                .leader-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .header-title {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .header-title h3 {
                    margin: 0;
                    font-size: 1.2rem;
                    font-weight: 800;
                }

                .header-title span { color: var(--primary); }

                .trophy-gold { color: var(--accent-amber); filter: drop-shadow(0 0 8px rgba(251, 191, 36, 0.4)); }

                .prize-pill {
                    background: linear-gradient(135deg, var(--accent-indigo), var(--accent-indigo));
                    color: white;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
                }

                .reset-timer {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.75rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    margin-bottom: 20px;
                }

                .leader-list {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 20px;
                }

                .leader-row {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    background: var(--bg-soft);
                    border-radius: 16px;
                    border: 1px solid transparent;
                    transition: all 0.3s ease;
                }

                .leader-row.is-me {
                    border-color: var(--primary);
                    background: rgba(99, 102, 241, 0.05);
                }

                .leader-row.rank-1 {
                    background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), var(--bg-soft));
                }

                .rank-badge {
                    width: 24px;
                    font-weight: 900;
                    font-size: 0.9rem;
                    color: var(--text-muted);
                }

                .rank-1 .rank-badge { color: var(--accent-amber); }

                .avatar-mini {
                    position: relative;
                    width: 36px;
                    height: 36px;
                    margin: 0 12px;
                }

                .avatar-mini img, .avatar-placeholder {
                    width: 100%;
                    height: 100%;
                    border-radius: 10px;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                }

                .crown-icon {
                    position: absolute;
                    top: -8px;
                    right: -5px;
                    color: var(--accent-amber);
                    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
                }

                .leader-name-group {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }

                .leader-name {
                    font-size: 0.9rem;
                    font-weight: 700;
                }

                .leader-lvl {
                    font-size: 0.7rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }

                .leader-xp {
                    text-align: right;
                    display: flex;
                    flex-direction: column;
                }

                .leader-xp strong {
                    font-size: 1rem;
                    font-weight: 800;
                    color: var(--primary);
                }

                .leader-xp span {
                    font-size: 0.6rem;
                    font-weight: 700;
                    color: var(--text-muted);
                }

                .user-context-action {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: var(--bg-soft);
                    padding: 14px 20px;
                    border-radius: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .user-context-action:hover {
                    background: var(--bg-soft);
                }

                .status-box {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 0.85rem;
                }

                .status-box strong { color: var(--primary); }

                @keyframes starBounce {
                    0%, 100% { transform: translateY(0) scale(1.1); }
                    50% { transform: translateY(-5px) scale(1.2); }
                }

                .star-bounce {
                    color: var(--accent-amber);
                    margin-bottom: 12px;
                    animation: starBounce 2s infinite ease-in-out;
                }

                .empty-state {
                    text-align: center;
                    padding: 20px;
                }

                .empty-state p {
                    font-size: 0.9rem;
                    color: var(--text-muted);
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default Leaderboard;
