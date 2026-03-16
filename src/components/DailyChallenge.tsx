import React, { useState, useEffect } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Timer, Trophy, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    type: 'words' | 'games' | 'videos' | 'worksheets';
    rewardXP: number;
    icon: string;
}

const getApiBase = () => (import.meta.env.VITE_BACKEND_URL || '').replace(/\/$/, '');

const DailyChallenge: React.FC = () => {
    const { user } = useAuth();
    const { addXP, trackActivity } = useGamification();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            initChallenge();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional: run when user is available only
    }, [user]);

    const initChallenge = async () => {
        try {
            setLoading(true);
            const dateStr = new Date().toISOString().slice(0, 10);
            const base = getApiBase();
            const res = await fetch(`${base}/api/daily-challenge?date=${dateStr}`).catch(() => null);
            const selected: Challenge | null = res?.ok ? await res.json() : null;
            const fallback: Challenge = {
                id: `daily_${dateStr}`,
                title: 'Daily Challenge',
                description: 'Learn 5 new words today',
                target: 5,
                type: 'words',
                rewardXP: 50,
                icon: '📖'
            };
            const chosen = selected || fallback;
            setChallenge(chosen);

            const { data } = await supabase
                .from('user_daily_challenges')
                .select('progress, completed')
                .eq('user_id', user?.uid)
                .eq('challenge_id', chosen.id)
                .maybeSingle();

            if (data) {
                setProgress(data.progress || 0);
                setCompleted(data.completed || false);
            }
        } catch (error) {
            console.error('Error loading daily challenge:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const updateTimer = () => {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);
            const diff = endOfDay.getTime() - now.getTime();

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${h}h ${m}m ${s}s`);
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleClaim = async () => {
        if (!challenge || completed || progress < challenge.target) return;

        try {
            await addXP(challenge.rewardXP, 'daily_challenge_complete');
            await trackActivity('daily_challenge');

            const { error } = await supabase
                .from('user_daily_challenges')
                .update({ completed: true })
                .eq('user_id', user?.uid)
                .eq('challenge_id', challenge.id);

            if (error) throw error;
            setCompleted(true);
            toast.success(`Awesome! You earned ${challenge.rewardXP} XP! 🌟`);
        } catch {
            toast.error('Failed to claim reward.');
        }
    };

    if (loading || !challenge) return <div className="challenge-skeleton">Loading challenge...</div>;

    const percentage = Math.min(100, (progress / challenge.target) * 100);
    const isReadyToClaim = progress >= challenge.target && !completed;

    return (
        <div className={`challenge-container ${completed ? 'is-completed' : ''}`}>
            <div className="challenge-glass-card">
                <div className="card-top">
                    <div className="type-badge">DAILY CHALLENGE</div>
                    <div className="timer-pill">
                        <Timer size={14} />
                        <span>{timeLeft}</span>
                    </div>
                </div>

                <div className="card-middle">
                    <div className="challenge-icon-container">
                        <span className="main-icon">{challenge.icon}</span>
                        <div className="icon-glow"></div>
                    </div>

                    <div className="challenge-text">
                        <h3>{challenge.title}</h3>
                        <p>{challenge.description}</p>
                    </div>

                    <div className="reward-badge-modern">
                        <Trophy size={16} className="trophy-icon" />
                        <span>+{challenge.rewardXP} XP</span>
                    </div>
                </div>

                <div className="card-bottom">
                    <div className="progress-header">
                        <span className="progress-label">YOUR PROGRESS</span>
                        <span className="progress-count">{progress}/{challenge.target}</span>
                    </div>

                    <div className="progress-bar-premium">
                        <div
                            className={`progress-fill-premium ${isReadyToClaim ? 'ready' : ''} ${completed ? 'done' : ''}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>

                    {completed ? (
                        <div className="completion-status">
                            <CheckCircle2 size={18} />
                            <span>REWARD CLAIMED</span>
                        </div>
                    ) : (
                        <button
                            className={`claim-btn ${isReadyToClaim ? 'pulse' : 'disabled'}`}
                            onClick={handleClaim}
                            disabled={!isReadyToClaim}
                        >
                            {isReadyToClaim ? 'CLAIM REWARD! 🎁' : 'KEEP GOING! 🚀'}
                        </button>
                    )}
                </div>
            </div>

            <style>{`
                .challenge-container {
                    margin-bottom: 24px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .challenge-glass-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    border: 1px solid var(--glass-border);
                    border-radius: 24px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                }

                .card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .type-badge {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--primary);
                    font-size: 0.7rem;
                    font-weight: 800;
                    padding: 4px 12px;
                    border-radius: 20px;
                    letter-spacing: 0.05em;
                    border: 1px solid rgba(99, 102, 241, 0.2);
                }

                .timer-pill {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: var(--text-muted);
                    background: var(--bg-soft);
                    padding: 4px 12px;
                    border-radius: 20px;
                }

                .card-middle {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .challenge-icon-container {
                    position: relative;
                    width: 60px;
                    height: 60px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .main-icon {
                    font-size: 2.5rem;
                    z-index: 1;
                }

                .icon-glow {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    background: var(--primary);
                    filter: blur(20px);
                    opacity: 0.2;
                    border-radius: 50%;
                }

                .challenge-text {
                    flex: 1;
                }

                .challenge-text h3 {
                    margin: 0 0 4px 0;
                    font-size: 1.3rem;
                    font-weight: 800;
                }

                .challenge-text p {
                    margin: 0;
                    color: var(--text-muted);
                    font-size: 0.9rem;
                    line-height: 1.4;
                }

                .reward-badge-modern {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    background: linear-gradient(135deg, var(--accent-amber), var(--warning));
                    color: white;
                    padding: 10px 14px;
                    border-radius: 16px;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.2);
                }

                .trophy-icon { filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1)); }

                .reward-badge-modern span {
                    font-size: 0.8rem;
                    font-weight: 800;
                }

                .progress-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }

                .progress-label {
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: var(--text-muted);
                    letter-spacing: 0.05em;
                }

                .progress-count {
                    font-size: 0.8rem;
                    font-weight: 700;
                }

                .progress-bar-premium {
                    height: 12px;
                    background: var(--bg-soft);
                    border-radius: 20px;
                    border: 1px solid var(--glass-border);
                    margin-bottom: 20px;
                    overflow: hidden;
                }

                .progress-fill-premium {
                    height: 100%;
                    background: var(--gradient-primary);
                    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
                    position: relative;
                }

                .progress-fill-premium.ready {
                    background: linear-gradient(90deg, var(--accent-emerald), var(--success));
                    box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
                }

                .progress-fill-premium.done {
                    background: var(--slate);
                }

                .claim-btn {
                    width: 100%;
                    padding: 16px;
                    border-radius: 16px;
                    border: none;
                    background: linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-violet) 50%, var(--accent-pink) 100%);
                    background-size: 200% auto;
                    color: white;
                    font-weight: 800;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .claim-btn:hover:not(.disabled) {
                    background-position: right center;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
                }

                .claim-btn:active:not(.disabled) {
                    transform: translateY(0);
                }

                .claim-btn.disabled {
                    background: var(--bg-soft);
                    color: var(--navbar-text);
                    border: 2px solid var(--border-light);
                    font-weight: 700;
                    cursor: not-allowed;
                    box-shadow: none;
                    opacity: 0.8;
                    text-transform: none; /* Navbar buttons are not all-caps */
                    letter-spacing: normal;
                }

                .claim-btn.pulse {
                    background: linear-gradient(135deg, var(--accent-emerald), var(--success));
                    animation: subtlePulse 2s infinite;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }

                @keyframes subtlePulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
                    70% { transform: scale(1.02); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }

                .completion-status {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    color: var(--accent-emerald);
                    font-weight: 800;
                    padding: 12px;
                }
            `}</style>
        </div>
    );
};

export default DailyChallenge;
