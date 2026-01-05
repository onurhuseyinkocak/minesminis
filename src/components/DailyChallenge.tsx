/**
 * DAILY CHALLENGE COMPONENT
 * Random daily task for bonus XP
 */

import React, { useState, useEffect } from 'react';
import { useGamification } from '../contexts/GamificationContext';
import './DailyChallenge.css';

interface Challenge {
    id: string;
    title: string;
    description: string;
    target: number;
    type: 'words' | 'games' | 'videos' | 'worksheets';
    rewardXP: number;
    icon: string;
}

const CHALLENGES: Challenge[] = [
    { id: '1', title: 'Word Explorer', description: 'Learn 5 new words today', target: 5, type: 'words', rewardXP: 50, icon: '📖' },
    { id: '2', title: 'Game Master', description: 'Play 3 different games', target: 3, type: 'games', rewardXP: 40, icon: '🎮' },
    { id: '3', title: 'Video Fan', description: 'Watch 2 learning videos', target: 2, type: 'videos', rewardXP: 30, icon: '🎬' },
    { id: '4', title: 'Writing Star', description: 'Complete 1 worksheet', target: 1, type: 'worksheets', rewardXP: 60, icon: '✏️' },
    { id: '5', title: 'Super Learner', description: 'Learn 10 new words', target: 10, type: 'words', rewardXP: 100, icon: '🌟' },
];

const DailyChallenge: React.FC = () => {
    const { stats, addXP, trackActivity } = useGamification();
    const [challenge, setChallenge] = useState<Challenge | null>(null);
    const [progress, setProgress] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        // Generate daily challenge based on date
        const today = new Date().toDateString();
        const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const index = seed % CHALLENGES.length;
        const selected = CHALLENGES[index];
        setChallenge(selected);

        // Load progress from stats
        let currentProgress = 0;
        switch (selected.type) {
            case 'words': currentProgress = stats.wordsLearned % selected.target; break;
            case 'games': currentProgress = stats.gamesPlayed % selected.target; break;
            case 'videos': currentProgress = stats.videosWatched % selected.target; break;
            case 'worksheets': currentProgress = stats.worksheetsCompleted % selected.target; break;
        }

        // For demo purposes, we'll use a mocked progress if it's 0
        // In real app, this would track since the start of the day
        setProgress(currentProgress);

        // Timer calculation
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
    }, [stats]);

    const handleComplete = async () => {
        if (completed || !challenge) return;

        setCompleted(true);
        await addXP(challenge.rewardXP, 'daily_challenge_complete');
        await trackActivity('daily_challenge');
    };

    // Mock progress button for demo
    const incrementProgress = () => {
        if (!challenge || completed) return;
        const next = progress + 1;
        setProgress(next);
        if (next >= challenge.target) {
            handleComplete();
        }
    };

    if (!challenge) return null;

    const percentage = Math.min(100, (progress / challenge.target) * 100);

    return (
        <div className={`daily-challenge-card ${completed ? 'completed' : ''}`}>
            <div className="challenge-badge">DAILY CHALLENGE</div>

            <div className="challenge-main">
                <div className="challenge-icon-box">
                    <span className="challenge-icon">{challenge.icon}</span>
                </div>

                <div className="challenge-info">
                    <h4>{challenge.title}</h4>
                    <p>{challenge.description}</p>
                </div>

                <div className="challenge-reward">
                    <span className="reward-label">Reward</span>
                    <span className="reward-amount">+{challenge.rewardXP} XP</span>
                </div>
            </div>

            <div className="challenge-progress-section">
                <div className="progress-text">
                    <span>{progress} / {challenge.target} completed</span>
                    <span className="percentage">{Math.floor(percentage)}%</span>
                </div>

                <div className="challenge-progress-bar">
                    <div
                        className="challenge-progress-fill"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            <div className="challenge-footer">
                <div className="challenge-timer">
                    <span className="timer-icon">⏳</span>
                    <span>Time left: {timeLeft}</span>
                </div>

                {completed ? (
                    <div className="completed-tag">✓ COMPLETED</div>
                ) : (
                    <button className="do-it-btn" onClick={incrementProgress}>
                        Go! 🚀
                    </button>
                )}
            </div>
        </div>
    );
};

export default DailyChallenge;
