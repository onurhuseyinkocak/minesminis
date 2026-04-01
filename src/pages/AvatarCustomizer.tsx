/**
 * AvatarCustomizer — Simple avatar preview + option grids.
 * Mobile-first, light mode only, all Tailwind inline.
 */
import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Lock, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useGamification } from '../contexts/GamificationContext';
import { usePremium } from '../contexts/PremiumContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import AvatarDisplay from '../components/AvatarDisplay';
import { getAvatarConfig, saveAvatarConfig, isItemUnlocked, getUnlockHint } from '../services/avatarService';
import type { AvatarConfig } from '../services/avatarService';
import { AVATAR_ITEMS } from '../data/avatarItems';
import type { AvatarItemCategory } from '../data/avatarItems';
import toast from 'react-hot-toast';

interface TabDef { category: AvatarItemCategory; label: string; }

const TABS_TR: TabDef[] = [
  { category: 'color', label: 'Renk' },
  { category: 'hat', label: 'Sapka' },
  { category: 'accessory', label: 'Aksesuar' },
  { category: 'background', label: 'Arka Plan' },
];

const TABS_EN: TabDef[] = [
  { category: 'color', label: 'Color' },
  { category: 'hat', label: 'Hat' },
  { category: 'accessory', label: 'Accessory' },
  { category: 'background', label: 'Background' },
];

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
    xp: stats.xp, streak: stats.streakDays, badges: stats.badges, level: stats.level, isPremium,
  }), [stats.xp, stats.streakDays, stats.badges, stats.level, isPremium]);

  const [activeTab, setActiveTab] = useState<AvatarItemCategory>('color');
  const [config, setConfig] = useState<AvatarConfig>(() => getAvatarConfig(userId));
  const [dirty, setDirty] = useState(false);

  const tabItems = AVATAR_ITEMS.filter((item) => item.category === activeTab);

  const getSelected = useCallback((category: AvatarItemCategory): string | null => {
    switch (category) {
      case 'color': return config.color;
      case 'hat': return config.hat;
      case 'accessory': return config.accessory;
      case 'background': return config.background;
      case 'frame': return config.frame;
    }
  }, [config]);

  const handleSelect = useCallback((itemId: string, category: AvatarItemCategory) => {
    const item = AVATAR_ITEMS.find((i) => i.id === itemId);
    if (!item || !isItemUnlocked(item, unlockStats)) return;
    setConfig((prev) => {
      const next = { ...prev };
      switch (category) {
        case 'color': next.color = itemId; break;
        case 'hat': next.hat = next.hat === itemId ? null : itemId; break;
        case 'accessory': next.accessory = next.accessory === itemId ? null : itemId; break;
        case 'background': next.background = next.background === itemId ? null : itemId; break;
        case 'frame': next.frame = next.frame === itemId ? null : itemId; break;
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
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white px-4 py-6">
      {/* Header */}
      <header className="flex items-center gap-3 mb-4 max-w-md mx-auto">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label={isTr ? 'Geri' : 'Back'}
          className="w-12 h-12 rounded-3xl bg-white shadow-sm border border-gray-100 flex items-center justify-center"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-extrabold text-gray-900">{isTr ? 'Avatarini Tasarla' : 'Design Your Avatar'}</h1>
      </header>

      <div className="max-w-md mx-auto">
        {/* Preview */}
        <section className="flex flex-col items-center mb-6">
          <span className="text-xs font-semibold text-gray-400 mb-2">{isTr ? 'Onizleme' : 'Preview'}</span>
          <div className="w-32 h-32 rounded-full bg-white shadow-lg border-4 border-violet-200 flex items-center justify-center mb-3">
            <AvatarDisplay config={config} letter={letter} size={120} animated />
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={!dirty}
            className={`min-h-[48px] px-8 rounded-3xl font-bold text-sm transition-all ${dirty ? 'bg-violet-500 text-white shadow-md active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {isTr ? 'Kaydet' : 'Save'}
          </button>
        </section>

        {/* Tabs */}
        <nav className="flex gap-2 mb-4 overflow-x-auto" role="tablist" aria-label={isTr ? 'Avatar kategorileri' : 'Avatar categories'}>
          {TABS.map((tab) => (
            <button
              key={tab.category}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.category}
              onClick={() => setActiveTab(tab.category)}
              className={`min-h-[48px] px-4 rounded-3xl text-sm font-bold whitespace-nowrap transition-all ${
                activeTab === tab.category ? 'bg-violet-500 text-white shadow-sm' : 'bg-white text-gray-600 border border-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Item Grid */}
        <div className="grid grid-cols-3 gap-3" role="tabpanel">
          {tabItems.map((item) => {
            const unlocked = isItemUnlocked(item, unlockStats);
            const selected = getSelected(item.category) === item.id;
            const hint = getUnlockHint(item);
            const isColor = item.category === 'color' || item.category === 'background';

            return (
              <button
                key={item.id}
                type="button"
                title={unlocked ? (isTr ? item.nameTr : item.name) : hint}
                aria-pressed={selected}
                onClick={() => handleSelect(item.id, item.category)}
                className={`relative rounded-3xl p-3 flex flex-col items-center gap-2 border-2 min-h-[80px] transition-all ${
                  selected ? 'border-violet-500 bg-violet-50 shadow-sm' :
                  !unlocked ? 'border-gray-100 bg-gray-50 opacity-50' :
                  'border-gray-100 bg-white active:scale-95'
                }`}
              >
                {isColor ? (
                  <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm" style={{ background: item.color || 'var(--border)' }} aria-hidden="true" />
                ) : item.svgPath ? (
                  <svg width="40" height="40" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ overflow: 'visible' }} dangerouslySetInnerHTML={{ __html: item.svgPath }} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200" aria-hidden="true" />
                )}
                <span className="text-[11px] font-semibold text-gray-700 text-center leading-tight">{isTr ? item.nameTr : item.name}</span>

                {selected && (
                  <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </span>
                )}

                {!unlocked && (
                  <div className="absolute inset-0 rounded-3xl bg-white/60 flex flex-col items-center justify-center">
                    <Lock size={16} className="text-gray-400" />
                    {hint && <span className="text-[9px] text-gray-400 mt-1 px-1 text-center">{hint}</span>}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AvatarCustomizer;
