import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useHearts } from '../../contexts/HeartsContext';
import { PHONETIC_TRAPS, TRAP_STORAGE_KEY } from '../../data/turkishPhoneticTraps';
import type { PhoneticTrap } from '../../data/turkishPhoneticTraps';
import PhoneticTrapGame from '../../components/games/PhoneticTrapGame';
import UnifiedMascot from '../../components/UnifiedMascot';
import './PhoneticsTrapTrainer.css';

// ─── Storage helpers ──────────────────────────────────────────────────────────

function getMasteryKey(userId: string | undefined): string {
  return `${TRAP_STORAGE_KEY}_${userId ?? 'guest'}`;
}

function loadMastery(userId: string | undefined): Record<string, number> {
  try {
    const raw = localStorage.getItem(getMasteryKey(userId));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, number>;
    }
    return {};
  } catch {
    return {};
  }
}

function saveMastery(userId: string | undefined, data: Record<string, number>): void {
  try {
    localStorage.setItem(getMasteryKey(userId), JSON.stringify(data));
  } catch {
    // Storage not available — silently ignore
  }
}

// ─── Score badge ──────────────────────────────────────────────────────────────

function ScoreBadge({ score }: { score: number | undefined }) {
  if (score === undefined) {
    return <span className="ptt__card-score-badge ptt__card-score-badge--none">Not started</span>;
  }
  if (score >= 80) {
    return <span className="ptt__card-score-badge ptt__card-score-badge--mastered">Mastered {score}%</span>;
  }
  return <span className="ptt__card-score-badge ptt__card-score-badge--partial">{score}% done</span>;
}

// ─── Trap card ────────────────────────────────────────────────────────────────

function TrapCard({
  trap,
  score,
  onSelect,
}: {
  trap: PhoneticTrap;
  score: number | undefined;
  onSelect: (trap: PhoneticTrap) => void;
}) {
  const isMastered = score !== undefined && score >= 80;
  const cssVars = { '--trap-color': trap.color } as React.CSSProperties;

  return (
    <button
      className={`ptt__card${isMastered ? ' ptt__card--mastered' : ''}`}
      style={{ ...cssVars, borderColor: isMastered ? 'var(--success, #10B981)' : `${trap.color}44` }}
      onClick={() => onSelect(trap)}
      aria-label={`Open trainer for ${trap.targetSound}`}
    >
      <div className="ptt__card-top">
        <div
          className="ptt__card-ipa-badge"
          style={{ background: trap.color }}
        >
          {trap.targetSoundIPA}
        </div>
        <div className="ptt__card-meta">
          <p className="ptt__card-name">{trap.targetSound}</p>
          <p className="ptt__card-ipa">{trap.turkishEquivalent} → confused with Turkish</p>
          <div className="ptt__card-difficulty" aria-label={`Difficulty: ${trap.difficulty} of 3`}>
            {[1, 2, 3].map((d) => (
              <span
                key={d}
                className={`ptt__dot${d <= trap.difficulty ? ' ptt__dot--filled' : ''}`}
              />
            ))}
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>

      <p className="ptt__card-error">{trap.commonError}</p>

      <div className="ptt__card-pairs-row">
        {trap.minimalPairs.slice(0, 3).map((pair) => (
          <span key={pair.english} className="ptt__pair-chip">
            <span className="ptt__pair-chip-correct">{pair.english}</span>
            <span className="ptt__pair-chip-sep">vs</span>
            <span className="ptt__pair-chip-wrong">{pair.errorVersion}</span>
          </span>
        ))}
      </div>

      <div className="ptt__card-cta">
        <span className="ptt__start-btn" style={{ '--trap-color': trap.color } as React.CSSProperties}>
          {score !== undefined ? 'Practice Again' : 'Start'}
        </span>
      </div>
    </button>
  );
}

// ─── Master progress bar ──────────────────────────────────────────────────────

function MasterProgress({ mastery }: { mastery: Record<string, number> }) {
  const masteredCount = PHONETIC_TRAPS.filter((t) => (mastery[t.id] ?? 0) >= 80).length;
  const totalCount = PHONETIC_TRAPS.length;
  const pct = Math.round((masteredCount / totalCount) * 100);

  return (
    <div className="ptt__master-progress">
      <div className="ptt__master-row">
        <p className="ptt__master-label">Master All Traps</p>
        <span className="ptt__master-value">{masteredCount}/{totalCount} mastered</span>
      </div>
      <div className="ptt__master-bar-track">
        <div className="ptt__master-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PhoneticsTrapTrainer() {
  const { user } = useAuth();
  useHearts(); // available for hearts system integration

  const [mastery, setMastery] = useState<Record<string, number>>(() =>
    loadMastery(user?.uid),
  );
  const [activeTrap, setActiveTrap] = useState<PhoneticTrap | null>(null);

  // Reload mastery if user changes
  useEffect(() => {
    setMastery(loadMastery(user?.uid));
  }, [user?.uid]);

  const handleSelectTrap = useCallback((trap: PhoneticTrap) => {
    setActiveTrap(trap);
  }, []);

  const handleGameComplete = useCallback(
    (score: number) => {
      if (!activeTrap) return;
      setMastery((prev) => {
        const existing = prev[activeTrap.id] ?? 0;
        const updated = { ...prev, [activeTrap.id]: Math.max(existing, score) };
        saveMastery(user?.uid, updated);
        return updated;
      });
    },
    [activeTrap, user?.uid],
  );

  const handleBack = useCallback(() => {
    setActiveTrap(null);
  }, []);

  if (activeTrap) {
    return (
      <div className="ptt__game-overlay">
        <PhoneticTrapGame
          trap={activeTrap}
          onComplete={handleGameComplete}
          onBack={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="ptt">
      {/* Page header */}
      <div className="ptt__page-header">
        <div className="ptt__title-row">
          <h1 className="ptt__page-title">Turkish Pronunciation Traps</h1>
        </div>
        <p className="ptt__page-subtitle">
          As a Turkish speaker, these 8 English sounds are the hardest for you.
          Each trainer shows exactly why — and how to fix it.
          <br />
          <em>Türkçe konuşanlar için bu 8 İngilizce ses en zordur.</em>
        </p>
      </div>

      {/* Master all progress */}
      <MasterProgress mastery={mastery} />

      {/* Mascot intro */}
      <div className="ptt__intro-mascot">
        <UnifiedMascot state="waving" size={80} />
        <div className="ptt__intro-text">
          <p className="ptt__intro-title">These sounds don't exist in Turkish!</p>
          <p className="ptt__intro-body">
            Your brain automatically replaces them with similar Turkish sounds. Tap
            each card to learn the exact mouth position and train your ear to hear
            the difference.
          </p>
        </div>
      </div>

      {/* Trap cards grid */}
      <div className="ptt__grid">
        {PHONETIC_TRAPS.map((trap) => (
          <TrapCard
            key={trap.id}
            trap={trap}
            score={mastery[trap.id]}
            onSelect={handleSelectTrap}
          />
        ))}
      </div>
    </div>
  );
}
