import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import AvatarDisplay from '../components/AvatarDisplay';
import {
  getAvatarConfig,
  saveAvatarConfig,
  isItemUnlocked,
  getUnlockHint,
} from '../services/avatarService';
import type { AvatarConfig } from '../services/avatarService';
import { AVATAR_ITEMS } from '../data/avatarItems';
import type { AvatarItemCategory } from '../data/avatarItems';
import toast from 'react-hot-toast';
import './AvatarCustomizer.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

interface TabDef {
  category: AvatarItemCategory;
  label: string;
}

const TABS_TR: TabDef[] = [
  { category: 'color',      label: 'Renk'     },
  { category: 'hat',        label: 'Şapka'    },
  { category: 'accessory',  label: 'Aksesuar' },
  { category: 'background', label: 'Arka Plan' },
];

const TABS_EN: TabDef[] = [
  { category: 'color',      label: 'Color'      },
  { category: 'hat',        label: 'Hat'         },
  { category: 'accessory',  label: 'Accessory'   },
  { category: 'background', label: 'Background'  },
];

// Parse a simple CSS gradient/color string into something we can use as a background-color.
// For linear-gradient strings we use them directly; plain hex we use directly too.
function colorToCSSBackground(color: string | undefined): string {
  if (!color) return 'var(--border)';
  return color;
}

// ── SVG mini-previews rendered for hat/accessory items ────────────────────────

function ItemSVGPreview({ svgPath }: { svgPath: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
      dangerouslySetInnerHTML={{ __html: svgPath }}
    />
  );
}

// ── Lock SVG icon ─────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

// ── Check icon ────────────────────────────────────────────────────────────────

function CheckIcon() {
  return (
    <svg className="avatar-item-card__check-icon" viewBox="0 0 12 12" aria-hidden="true">
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

const AvatarCustomizer: React.FC = () => {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const { stats } = useGamification();
  const { isPremium } = usePremium();
  const { lang } = useLanguage();
  usePageTitle('Avatar Özelleştir', 'Customize Avatar');
  const isTr = lang === 'tr';

  const userId = user?.uid ?? 'guest';
  const letter = (userProfile?.display_name ?? user?.displayName ?? '?').charAt(0);

  const TABS = isTr ? TABS_TR : TABS_EN;

  const unlockStats = useMemo(() => ({
    xp: stats.xp,
    streak: stats.streakDays,
    badges: stats.badges,
    level: stats.level,
    isPremium,
  }), [stats.xp, stats.streakDays, stats.badges, stats.level, isPremium]);

  const [activeTab, setActiveTab] = useState<AvatarItemCategory>('color');
  const [config, setConfig] = useState<AvatarConfig>(() => getAvatarConfig(userId));
  const [dirty, setDirty] = useState(false);

  const tabItems = AVATAR_ITEMS.filter((item) => item.category === activeTab);

  const getSelected = useCallback((category: AvatarItemCategory): string | null => {
    switch (category) {
      case 'color':      return config.color;
      case 'hat':        return config.hat;
      case 'accessory':  return config.accessory;
      case 'background': return config.background;
      case 'frame':      return config.frame;
    }
  }, [config]);

  const handleSelect = useCallback((itemId: string, category: AvatarItemCategory) => {
    const item = AVATAR_ITEMS.find((i) => i.id === itemId);
    if (!item) return;
    if (!isItemUnlocked(item, unlockStats)) return;

    setConfig((prev) => {
      const next = { ...prev };
      switch (category) {
        case 'color':
          next.color = itemId;
          break;
        case 'hat':
          next.hat = next.hat === itemId ? null : itemId;
          break;
        case 'accessory':
          next.accessory = next.accessory === itemId ? null : itemId;
          break;
        case 'background':
          next.background = next.background === itemId ? null : itemId;
          break;
        case 'frame':
          next.frame = next.frame === itemId ? null : itemId;
          break;
      }
      return next;
    });
    setDirty(true);
  }, [unlockStats]);

  const handleSave = useCallback(() => {
    saveAvatarConfig(userId, config);
    setDirty(false);
    toast.success(isTr ? 'Avatar kaydedildi!' : 'Avatar saved!');
  }, [userId, config, isTr]);

  return (
    <div className="avatar-customizer">
      {/* ── Header ── */}
      <header className="avatar-customizer__header">
        <button
          type="button"
          className="avatar-customizer__back-btn"
          onClick={() => navigate(-1)}
          aria-label={isTr ? 'Geri' : 'Back'}
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
        <h1 className="avatar-customizer__title">{isTr ? 'Avatarını Tasarla' : 'Design Your Avatar'}</h1>
      </header>

      {/* ── Live preview ── */}
      <section className="avatar-customizer__preview">
        <span className="avatar-customizer__preview-label">{isTr ? 'Önizleme' : 'Preview'}</span>
        <div className="avatar-customizer__preview-ring">
          <AvatarDisplay
            config={config}
            letter={letter}
            size={120}
            animated
          />
        </div>
        <button
          type="button"
          className="avatar-customizer__save-btn"
          onClick={handleSave}
          disabled={!dirty}
        >
          {isTr ? 'Kaydet' : 'Save'}
        </button>
      </section>

      {/* ── Category tabs ── */}
      <nav className="avatar-customizer__tabs" role="tablist" aria-label={isTr ? 'Avatar kategorileri' : 'Avatar categories'}>
        {TABS.map((tab) => (
          <button
            key={tab.category}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.category}
            className={`avatar-customizer__tab${activeTab === tab.category ? ' avatar-customizer__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.category)}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* ── Item grid ── */}
      <div className="avatar-customizer__grid" role="tabpanel">
        {tabItems.map((item) => {
          const unlocked  = isItemUnlocked(item, unlockStats);
          const selected  = getSelected(item.category) === item.id;
          const hint      = getUnlockHint(item);
          const isColor   = item.category === 'color' || item.category === 'background';

          return (
            <button
              key={item.id}
              type="button"
              title={unlocked ? (isTr ? item.nameTr : item.name) : hint}
              aria-pressed={selected}
              onClick={() => handleSelect(item.id, item.category)}
              className={[
                'avatar-item-card',
                selected ? 'avatar-item-card--selected' : '',
                !unlocked ? 'avatar-item-card--locked' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* Visual preview */}
              {isColor ? (
                <div
                  className="avatar-item-card__swatch"
                  style={{ background: colorToCSSBackground(item.color) }}
                  aria-hidden="true"
                />
              ) : item.svgPath ? (
                <div className="avatar-item-card__svg-preview" aria-hidden="true">
                  <ItemSVGPreview svgPath={item.svgPath} />
                </div>
              ) : (
                <div className="avatar-item-card__swatch" style={{ background: 'var(--border)' }} aria-hidden="true" />
              )}

              <span className="avatar-item-card__name">{isTr ? item.nameTr : item.name}</span>

              {/* Selected checkmark */}
              {selected && (
                <span className="avatar-item-card__check" aria-hidden="true">
                  <CheckIcon />
                </span>
              )}

              {/* Lock overlay */}
              {!unlocked && (
                <div className="avatar-item-card__lock" aria-hidden="true">
                  <span className="avatar-item-card__lock-icon"><LockIcon /></span>
                  {hint && <span className="avatar-item-card__lock-hint">{hint}</span>}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AvatarCustomizer;
