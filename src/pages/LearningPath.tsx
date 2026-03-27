/**
 * LearningPath — Visual curriculum journey page
 * Cat-themed skill tree showing phonics phases and units
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Check, BookOpen, Play, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { PHONICS_CURRICULUM_PHASES } from '../data/phoneticsCurriculum';
import './LearningPath.css';

// ─── Phase / Unit data ────────────────────────────────────────────────────────

interface UnitDef {
  id: string;
  name: string;
  nameEn: string;
  sounds: string;
  lessons: number;
}

interface PhaseDef {
  id: number;
  name: string;
  nameEn: string;
  color: string;
  textColor: string;
  emoji: string;
  units: UnitDef[];
}

// Map new curriculum phases to display format
const PHASES: PhaseDef[] = PHONICS_CURRICULUM_PHASES.map((phase) => ({
  id: phase.number,
  name: phase.nameTr,
  nameEn: phase.name,
  color: phase.color,
  textColor: '#fff',
  emoji: phase.icon,
  units: phase.units.map((unit) => ({
    id: unit.id,
    name: unit.titleTr,
    nameEn: unit.title,
    sounds: unit.phonicsFocus.length > 0
      ? unit.phonicsFocus.join(' · ')
      : unit.vocabularyTheme,
    lessons: unit.activities.length,
  })),
}));

// ─── Progress helpers ─────────────────────────────────────────────────────────

function getUnitProgress(unitId: string): number {
  try {
    const raw = localStorage.getItem(`mm_unit_${unitId}_progress`);
    const val = parseInt(raw ?? '0', 10);
    return isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
  } catch {
    return 0;
  }
}

function getCurrentUnitId(): string {
  try {
    return localStorage.getItem('mm_current_unit') ?? 's1-u1';
  } catch {
    return 's1-u1';
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

const LearningPath: React.FC = () => {
  usePageTitle('Öğrenme Yolum', 'Learning Path');
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const isTr = navigator.language.startsWith('tr');

  const [currentUnitId, setCurrentUnitId] = useState<string>(getCurrentUnitId);

  useEffect(() => {
    const settings = (userProfile?.settings as Record<string, unknown>) ?? {};
    const startGroup = Number(settings.startingPhonicsGroup ?? 1);
    // Map Jolly Phonics group to new curriculum unit IDs
    const unitMap: Record<number, string> = {
      1: 's2-u1', 2: 's2-u3', 3: 's2-u5', 4: 's2-u7', 5: 's3-u1', 6: 's3-u3', 7: 's3-u5',
    };
    const unitId = unitMap[startGroup] ?? 's1-u1';
    setCurrentUnitId(unitId);
    try {
      localStorage.setItem('mm_current_unit', unitId);
    } catch {
      // ignore
    }
  }, [userProfile]);

  const allUnitIds = PHASES.flatMap((p) => p.units.map((u) => u.id));
  const currentIdx = allUnitIds.indexOf(currentUnitId);

  const isUnitUnlocked = (unitId: string) =>
    allUnitIds.indexOf(unitId) <= currentIdx;

  const isUnitCompleted = (unitId: string) =>
    getUnitProgress(unitId) >= 100;

  return (
    <div className="lp-page">
      {/* Header */}
      <div className="lp-header">
        <button
          type="button"
          className="lp-back-btn"
          onClick={() => navigate('/dashboard')}
          aria-label={isTr ? 'Geri' : 'Back'}
        >
          <ArrowLeft size={18} aria-hidden="true" />
        </button>
        <h1 className="lp-title">
          {isTr ? 'Öğrenme Yolun' : 'Your Learning Path'}
        </h1>
        <div className="lp-header-badge" aria-hidden="true">
          <Star size={18} />
        </div>
      </div>

      {/* Subtitle */}
      <p className="lp-subtitle">
        {isTr
          ? 'Fonetikten hikaye anlatımına uzanan yolculuğun'
          : 'Your journey from phonics to storytelling'}
      </p>

      {/* Phases */}
      <div className="lp-phases">
        {PHASES.map((phase, phaseIdx) => {
          const phaseFirstUnitIdx = allUnitIds.indexOf(phase.units[0].id);
          const phaseUnlocked = phaseFirstUnitIdx <= currentIdx;

          return (
            <motion.div
              key={phase.id}
              className={`lp-phase${phaseUnlocked ? '' : ' lp-phase--locked'}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phaseIdx * 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Phase header strip */}
              <div
                className="lp-phase-header"
                style={{ background: phaseUnlocked ? phase.color : '#94a3b8' }}
              >
                <span className="lp-phase-emoji" aria-hidden="true">{phase.emoji}</span>
                <div className="lp-phase-header-text">
                  <span className="lp-phase-num">
                    {isTr ? `Faz ${phase.id}` : `Phase ${phase.id}`}
                  </span>
                  <h2 className="lp-phase-name">
                    {isTr ? phase.name : phase.nameEn}
                  </h2>
                </div>
                {!phaseUnlocked && (
                  <div className="lp-phase-lock-icon" aria-label={isTr ? 'Kilitli' : 'Locked'}>
                    <Lock size={16} />
                  </div>
                )}
              </div>

              {/* Units list */}
              <div className="lp-units">
                {phase.units.map((unit, unitIdx) => {
                  const unlocked = isUnitUnlocked(unit.id);
                  const completed = isUnitCompleted(unit.id);
                  const isCurrent = unit.id === currentUnitId;
                  const progress = getUnitProgress(unit.id);

                  return (
                    <React.Fragment key={unit.id}>
                      {unitIdx > 0 && (
                        <div
                          className={`lp-connector${unlocked ? ' lp-connector--active' : ''}`}
                          style={unlocked ? { background: phase.color } : undefined}
                          aria-hidden="true"
                        />
                      )}

                      <motion.div
                        className={[
                          'lp-unit',
                          unlocked ? 'lp-unit--unlocked' : 'lp-unit--locked',
                          isCurrent ? 'lp-unit--current' : '',
                          completed ? 'lp-unit--completed' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        whileHover={unlocked ? { scale: 1.015, y: -2 } : {}}
                        whileTap={unlocked ? { scale: 0.98 } : {}}
                        onClick={unlocked ? () => navigate(`/worlds/${unit.id}/lessons/start`) : undefined}
                        role={unlocked ? 'button' : undefined}
                        tabIndex={unlocked ? 0 : undefined}
                        onKeyDown={unlocked ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/worlds/${unit.id}/lessons/start`); } } : undefined}
                        aria-label={
                          unlocked
                            ? `${isTr ? unit.name : unit.nameEn}${completed ? (isTr ? ' — Tamamlandı' : ' — Completed') : isCurrent ? (isTr ? ' — Şu an aktif' : ' — Current') : ''}`
                            : `${isTr ? unit.name : unit.nameEn} — ${isTr ? 'Kilitli' : 'Locked'}`
                        }
                        aria-disabled={!unlocked}
                        style={
                          isCurrent
                            ? ({ '--unit-accent': phase.color } as React.CSSProperties)
                            : undefined
                        }
                      >
                        {/* Status icon */}
                        <div
                          className="lp-unit-icon"
                          style={
                            unlocked
                              ? { background: phase.color, color: phase.textColor }
                              : undefined
                          }
                          aria-hidden="true"
                        >
                          {!unlocked ? (
                            <Lock size={16} />
                          ) : completed ? (
                            <Check size={16} />
                          ) : isCurrent ? (
                            <Play size={16} />
                          ) : (
                            <Star size={16} />
                          )}
                        </div>

                        {/* Unit info */}
                        <div className="lp-unit-info">
                          <h3 className="lp-unit-name">
                            {isTr ? unit.name : unit.nameEn}
                          </h3>
                          <p className="lp-unit-sounds">{unit.sounds}</p>
                          {unlocked && progress > 0 && (
                            <div className="lp-unit-progress-track" aria-label={`${progress}% complete`}>
                              <div
                                className="lp-unit-progress-fill"
                                style={{ width: `${progress}%`, background: phase.color }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Right meta */}
                        <div className="lp-unit-meta">
                          <span className="lp-unit-lessons-count">
                            <BookOpen size={11} />
                            {unit.lessons}
                          </span>
                          {isCurrent && (
                            <span
                              className="lp-unit-now-badge"
                              style={{ background: phase.color, color: phase.textColor }}
                            >
                              {isTr ? 'Şimdi' : 'Now'}
                            </span>
                          )}
                          {completed && (
                            <span className="lp-unit-done-badge">
                              {isTr ? 'Tamam' : 'Done'}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </React.Fragment>
                  );
                })}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer hint */}
      <p className="lp-footer-hint">
        {isTr
          ? 'Bir üniteye dokun ve bugünün dersine başla!'
          : "Tap a unit to start today's lesson!"}
      </p>
    </div>
  );
};

export default LearningPath;
