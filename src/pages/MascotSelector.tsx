/**
 * MascotSelector — Grid of mascot cards, tap to select.
 * Mobile-first, light mode only, all Tailwind inline.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ALL_MASCOTS, isMascotUnlocked, getUnlockProgress } from '../data/mascotRegistry';
import { getSelectedMascotId, setSelectedMascotId } from '../services/mascotService';
import UnifiedMascot from '../components/UnifiedMascot';

const MascotSelector: React.FC = () => {
  const navigate = useNavigate();
  const { stats } = useGamification();
  const { lang } = useLanguage();
  usePageTitle('Maskot Seç', 'Choose Mascot');
  const isTr = lang === 'tr';

  const userStats = { level: stats.level, streakDays: stats.streakDays, wordsLearned: stats.wordsLearned, worldsCompleted: 0 };
  const [selectedId, setSelectedId] = useState<string>(getSelectedMascotId());

  const handleSelect = (id: string) => {
    const mascot = ALL_MASCOTS.find((m) => m.id === id);
    if (!mascot || !isMascotUnlocked(mascot, userStats)) return;
    setSelectedMascotId(id);
    setSelectedId(id);
    try {
      const AudioCtx = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
      }
    } catch { /* Audio not available */ }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white px-4 py-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <header className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={isTr ? 'Geri' : 'Back'}
            className="w-12 h-12 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">{isTr ? 'Maskotlarım' : 'My Mascots'}</h1>
            <p className="text-sm text-gray-500">{isTr ? 'Sana eşlik edecek maskotu seç!' : 'Choose your learning companion!'}</p>
          </div>
        </header>

        {/* Mascot Grid */}
        <div className="grid grid-cols-2 gap-3">
          {ALL_MASCOTS.map((mascot) => {
            const unlocked = isMascotUnlocked(mascot, userStats);
            const selected = selectedId === mascot.id;
            const progress = getUnlockProgress(mascot, userStats);

            return (
              <motion.div
                key={mascot.id}
                onClick={() => handleSelect(mascot.id)}
                tabIndex={unlocked ? 0 : -1}
                role={unlocked ? 'button' : undefined}
                aria-pressed={unlocked ? selected : undefined}
                onKeyDown={(e) => { if (unlocked && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); handleSelect(mascot.id); } }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: ALL_MASCOTS.indexOf(mascot) * 0.07 }}
                className={`relative rounded-3xl p-4 flex flex-col items-center gap-2 border-2 transition-all ${
                  !unlocked ? 'bg-gray-50 border-gray-100 opacity-60' :
                  selected ? 'bg-orange-50 border-orange-400 shadow-md' :
                  'bg-white border-gray-100 shadow-sm cursor-pointer active:scale-95'
                }`}
              >
                <div className="relative">
                  <UnifiedMascot
                    id={mascot.id}
                    state={selected ? 'celebrating' : unlocked ? 'idle' : 'sleeping'}
                    size={72}
                  />
                  {!unlocked && (
                    <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                      <Lock size={12} className="text-white" />
                    </span>
                  )}
                </div>

                <p className="text-sm font-bold text-gray-800 text-center">{isTr ? mascot.nameTr : mascot.name}</p>
                <p className="text-xs text-gray-500 text-center leading-tight">{isTr ? mascot.descriptionTr : mascot.description}</p>

                {selected && unlocked && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                    <CheckCircle size={12} />
                    {isTr ? 'Seçildi' : 'Selected'}
                  </span>
                )}

                {!unlocked && (
                  <div className="w-full">
                    <p className="text-[10px] text-gray-400 text-center mb-1">
                      {isTr ? mascot.unlockRequirement.descriptionTr : mascot.unlockRequirement.description}
                    </p>
                    <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                      <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 text-center mt-0.5">{progress}%</p>
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
