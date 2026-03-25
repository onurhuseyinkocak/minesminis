import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ALL_MASCOTS,
  isMascotUnlocked,
  getUnlockProgress,
} from '../data/mascotRegistry';
import { getSelectedMascotId, setSelectedMascotId } from '../services/mascotService';
import UnifiedMascot from '../components/UnifiedMascot';
import './MascotSelector.css';

const MascotSelector: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useGamification();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';

  const userStats = {
    level: stats.level,
    streakDays: stats.streakDays,
    wordsLearned: stats.wordsLearned,
    worldsCompleted: 0,
  };

  const [selectedId, setSelectedId] = useState<string>(getSelectedMascotId());

  const handleSelect = (id: string) => {
    const mascot = ALL_MASCOTS.find((m) => m.id === id);
    if (!mascot || !isMascotUnlocked(mascot, userStats)) return;

    setSelectedMascotId(id);
    setSelectedId(id);

    // Play a brief celebration sound using Web Audio API if available
    try {
      const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);   // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // Audio not available — silently skip
    }
  };

  return (
    <div className="mascot-selector-page">
      <div className="mascot-selector-content">
        <header className="mascot-selector-header">
          <button
            type="button"
            className="mascot-selector-back-btn"
            onClick={() => navigate(-1)}
            aria-label={isTr ? 'Geri' : 'Back'}
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="mascot-selector-title">
              {isTr ? 'Maskotlarım' : 'My Mascots'}
            </h1>
            <p className="mascot-selector-subtitle">
              {isTr
                ? 'Sana eşlik edecek maskotu seç!'
                : 'Choose your learning companion!'}
            </p>
          </div>
        </header>

        <div className="mascot-grid">
          {ALL_MASCOTS.map((mascot) => {
            const unlocked = isMascotUnlocked(mascot, userStats);
            const selected = selectedId === mascot.id;
            const progress = getUnlockProgress(mascot, userStats);

            let cardClass = 'mascot-card';
            if (!unlocked) cardClass += ' mascot-card--locked';
            else if (selected) cardClass += ' mascot-card--selected';
            else cardClass += ' mascot-card--unlocked';

            return (
              <motion.div
                key={mascot.id}
                className={cardClass}
                onClick={() => handleSelect(mascot.id)}
                tabIndex={unlocked ? 0 : -1}
                role={unlocked ? 'button' : undefined}
                aria-pressed={unlocked ? selected : undefined}
                onKeyDown={(e) => {
                  if (unlocked && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    handleSelect(mascot.id);
                  }
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: ALL_MASCOTS.indexOf(mascot) * 0.07 }}
              >
                <div className="mascot-card-avatar">
                  <UnifiedMascot
                    id={mascot.id}
                    state={selected ? 'celebrating' : unlocked ? 'idle' : 'sleeping'}
                    size={72}
                  />
                  {!unlocked && (
                    <span className="mascot-lock-icon" aria-hidden="true">
                      <Lock size={14} />
                    </span>
                  )}
                </div>

                <p className="mascot-card-name">
                  {isTr ? mascot.nameTr : mascot.name}
                </p>

                <p className="mascot-card-description">
                  {isTr ? mascot.descriptionTr : mascot.description}
                </p>

                {selected && unlocked && (
                  <span className="mascot-selected-badge">
                    <CheckCircle size={12} />
                    {isTr ? 'Seçildi' : 'Selected'}
                  </span>
                )}

                {!unlocked && (
                  <div className="mascot-unlock-requirement">
                    <p className="mascot-unlock-label">
                      {isTr
                        ? mascot.unlockRequirement.descriptionTr
                        : mascot.unlockRequirement.description}
                    </p>
                    <div
                      className="mascot-progress-bar-track"
                      role="progressbar"
                      aria-valuenow={progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <div
                        className="mascot-progress-bar-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className="mascot-progress-text">{progress}%</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MascotSelector;
