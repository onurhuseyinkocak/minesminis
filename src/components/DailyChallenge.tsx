/**
 * DAILY CHALLENGE COMPONENT
 * Shows today's word challenge card
 */

import React, { useState, useEffect } from 'react';
import { Zap, CheckCircle, RefreshCw } from 'lucide-react';
import { useGamification } from '../contexts/GamificationContext';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { logActivity } from '../services/activityLogger';
import { activateBoost } from './XPBooster';

interface ChallengeData {
  id: string;
  word: string;
  hint: string;
  options: string[];
  correctIndex: number;
}

// Fallback challenges when API is unavailable
const FALLBACK_CHALLENGES: ChallengeData[] = [
  { id: 'f1', word: 'magnificent', hint: 'Very beautiful or impressive', options: ['boring', 'magnificent', 'tiny', 'slow'], correctIndex: 1 },
  { id: 'f2', word: 'adventure', hint: 'An exciting experience or journey', options: ['sleep', 'homework', 'adventure', 'chair'], correctIndex: 2 },
  { id: 'f3', word: 'curious', hint: 'Wanting to know or learn something', options: ['curious', 'angry', 'tired', 'quiet'], correctIndex: 0 },
  { id: 'f4', word: 'discover', hint: 'To find something for the first time', options: ['forget', 'hide', 'break', 'discover'], correctIndex: 3 },
  { id: 'f5', word: 'brilliant', hint: 'Very bright or very clever', options: ['dull', 'brilliant', 'cold', 'heavy'], correctIndex: 1 },
  { id: 'f6', word: 'courage', hint: 'Being brave when facing danger or difficulty', options: ['fear', 'sleep', 'courage', 'hunger'], correctIndex: 2 },
  { id: 'f7', word: 'explore', hint: 'To travel through an unfamiliar area to learn about it', options: ['explore', 'sit', 'eat', 'cry'], correctIndex: 0 },
];

const STORAGE_KEY = 'minesminis_daily_challenge';

function getTodayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDailyFallback(): ChallengeData {
  // Pick a consistent challenge per day using the date as seed
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  return FALLBACK_CHALLENGES[dayOfYear % FALLBACK_CHALLENGES.length];
}

const DailyChallenge: React.FC = () => {
  const { addXP, trackActivity } = useGamification();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [challenge, setChallenge] = useState<ChallengeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    // Check localStorage for today's completion
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === getTodayKey()) {
          setAlreadyCompleted(true);
          setChallenge(parsed.challenge);
          setLoading(false);
          return;
        }
      } catch {
        // ignore parse errors
      }
    }

    // Fetch from API, fallback to local data
    fetchChallenge();
  }, []);

  const fetchChallenge = async () => {
    try {
      const res = await fetch('/api/daily-challenge');
      if (res.ok) {
        const data: ChallengeData = await res.json();
        setChallenge(data);
      } else {
        throw new Error('API not available');
      }
    } catch {
      // Use deterministic fallback based on day
      setChallenge(getDailyFallback());
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || !challenge) return;

    setSelectedAnswer(index);
    const correct = index === challenge.correctIndex;
    setIsCorrect(correct);

    if (correct) {
      // Save completion
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ date: getTodayKey(), challenge })
        );
      } catch { /* QuotaExceededError — ignore */ }
      setAlreadyCompleted(true);

      // Activate 2x XP boost for 30 minutes
      activateBoost(2, 30 * 60 * 1000, 'daily_challenge');

      // Award XP
      await addXP(25, 'daily_challenge');
      await trackActivity('daily_challenge');

      // Log for parent dashboard analytics
      logActivity({
        type: 'challenge',
        title: `Daily Challenge: ${challenge.word}`,
        duration: 30, // ~30 seconds for a challenge
        accuracy: 100,
        xpEarned: 25,
      }, user?.uid);
    }
  };

  if (loading) {
    return (
      <div className="daily-challenge loading-state">
        <RefreshCw className="spin-icon" size={20} />
        <span>{t('dailyChallenge.loading')}</span>
        <style>{dailyChallengeStyles}</style>
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className={`daily-challenge ${alreadyCompleted ? 'completed' : ''}`}>
      <div className="challenge-header">
        <div className="challenge-title-row">
          <Zap size={20} className="zap-icon" />
          <h3>{t('dailyChallenge.title')}</h3>
        </div>
        {alreadyCompleted && (
          <div className="completed-badge">
            <CheckCircle size={16} />
            <span>{t('dailyChallenge.done')}</span>
          </div>
        )}
      </div>

      {/* Reward preview — always visible before completion */}
      {!alreadyCompleted && (
        <div className="challenge-reward-preview">
          <Zap size={14} className="reward-zap" aria-hidden="true" />
          <span className="reward-amount">+25 XP</span>
          <span className="reward-boost">{t('dailyChallenge.boostLabel') || '+ 2× XP boost'}</span>
        </div>
      )}

      <div className="challenge-card">
        <p className="challenge-hint">{challenge.hint}</p>

        {alreadyCompleted ? (
          <div className="challenge-result success">
            <span className="result-word">{challenge.word}</span>
            <span className="result-label">{t('dailyChallenge.xpEarnedToday')}</span>
          </div>
        ) : (
          <div className="challenge-options">
            {challenge.options.map((option, index) => (
              <button
                key={index}
                type="button"
                className={`option-btn ${
                  selectedAnswer === index
                    ? index === challenge.correctIndex
                      ? 'correct'
                      : 'wrong'
                    : selectedAnswer !== null && index === challenge.correctIndex
                      ? 'correct'
                      : ''
                }`}
                onClick={() => handleAnswer(index)}
                disabled={selectedAnswer !== null}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {selectedAnswer !== null && !alreadyCompleted && (
          <div className={`feedback-row ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <span>{t('dailyChallenge.correct')}</span>
            ) : (
              <span>{t('dailyChallenge.wrongPrefix')} <strong>{challenge.word}</strong>{t('dailyChallenge.wrongSuffix')}</span>
            )}
          </div>
        )}
      </div>

      <style>{dailyChallengeStyles}</style>
    </div>
  );
};

const dailyChallengeStyles = `
  .daily-challenge {
    background: var(--glass-bg, rgba(255,255,255,0.8));
    backdrop-filter: blur(12px);
    border: 1px solid var(--glass-border, rgba(0,0,0,0.08));
    border-radius: 20px;
    padding: 20px 24px;
    margin-bottom: 20px;
  }

  .daily-challenge.loading-state {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--text-muted, #888);
    font-size: 0.9rem;
    font-weight: 600;
  }

  .spin-icon {
    animation: spin 1.5s linear infinite;
    color: #E8A317;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .daily-challenge.completed {
    border-color: rgba(26, 107, 90, 0.2);
    background: linear-gradient(135deg, rgba(26, 107, 90, 0.04), var(--glass-bg, rgba(255,255,255,0.8)));
  }

  .challenge-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .challenge-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .challenge-title-row h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: var(--text-main, #333);
  }

  .zap-icon {
    color: #E8A317;
    filter: drop-shadow(0 0 4px rgba(232, 163, 23, 0.3));
  }

  .completed-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(26, 107, 90, 0.1);
    color: #1A6B5A;
    font-size: 0.75rem;
    font-weight: 800;
    padding: 4px 12px;
    border-radius: 20px;
  }

  .challenge-card {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .challenge-hint {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-main, #333);
    margin: 0;
    font-style: italic;
    line-height: 1.5;
  }

  .challenge-reward-preview {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 12px;
    padding: 6px 12px;
    background: rgba(232, 163, 23, 0.08);
    border-radius: 20px;
    width: fit-content;
  }

  .reward-zap {
    color: #E8A317;
  }

  .reward-amount {
    font-size: 0.85rem;
    font-weight: 900;
    color: #E8A317;
  }

  .reward-boost {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted, #888);
  }

  .challenge-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .option-btn {
    /* 52px minimum height for primary CTA buttons */
    min-height: 52px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 2px solid var(--glass-border, rgba(0,0,0,0.08));
    background: var(--bg-soft, #f5f5f5);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text-main, #333);
    cursor: pointer;
    transition: all 0.2s;
    text-transform: capitalize;
  }

  .option-btn:hover:not(:disabled) {
    border-color: #E8A317;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(232, 163, 23, 0.15);
  }

  .option-btn:disabled {
    cursor: default;
  }

  .option-btn.correct {
    border-color: #1A6B5A;
    background: rgba(26, 107, 90, 0.1);
    color: #1A6B5A;
  }

  .option-btn.wrong {
    border-color: #E53E3E;
    background: rgba(229, 62, 62, 0.08);
    color: #E53E3E;
    opacity: 0.7;
  }

  .feedback-row {
    font-size: 0.85rem;
    font-weight: 600;
    padding: 10px 14px;
    border-radius: 12px;
  }

  .feedback-row.correct {
    color: #1A6B5A;
    background: rgba(26, 107, 90, 0.08);
  }

  .feedback-row.wrong {
    color: #C53030;
    background: rgba(229, 62, 62, 0.06);
  }

  .challenge-result {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 16px;
    border-radius: 16px;
    background: rgba(26, 107, 90, 0.06);
  }

  .result-word {
    font-size: 1.4rem;
    font-weight: 900;
    color: #1A6B5A;
    text-transform: capitalize;
  }

  .result-label {
    font-size: 0.75rem;
    font-weight: 700;
    color: #E8A317;
  }
`;

export default DailyChallenge;
