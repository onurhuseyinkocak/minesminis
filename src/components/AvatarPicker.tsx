/**
 * AVATAR PICKER COMPONENT
 * Modal overlay for selecting a letter-based colored avatar
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { userService } from '../services/userService';
import { errorLogger } from '../services/errorLogger';

interface AvatarPickerProps {
  onClose: () => void;
}

// Letter + color pairs — no emojis
const AVATAR_OPTIONS: Array<{ id: string; letter: string; bg: string; fg: string }> = [
  { id: 'a-indigo',  letter: 'A', bg: '#4F46E5', fg: '#fff' },
  { id: 'b-sky',     letter: 'B', bg: '#0EA5E9', fg: '#fff' },
  { id: 'c-emerald', letter: 'C', bg: '#10B981', fg: '#fff' },
  { id: 'd-amber',   letter: 'D', bg: '#F59E0B', fg: '#fff' },
  { id: 'e-rose',    letter: 'E', bg: '#F43F5E', fg: '#fff' },
  { id: 'f-purple',  letter: 'F', bg: '#A855F7', fg: '#fff' },
  { id: 'g-teal',    letter: 'G', bg: '#14B8A6', fg: '#fff' },
  { id: 'h-orange',  letter: 'H', bg: '#F97316', fg: '#fff' },
  { id: 'i-blue',    letter: 'I', bg: '#3B82F6', fg: '#fff' },
  { id: 'j-lime',    letter: 'J', bg: '#84CC16', fg: '#fff' },
  { id: 'k-fuchsia', letter: 'K', bg: '#D946EF', fg: '#fff' },
  { id: 'l-red',     letter: 'L', bg: '#EF4444', fg: '#fff' },
  { id: 'm-cyan',    letter: 'M', bg: '#06B6D4', fg: '#fff' },
  { id: 'n-violet',  letter: 'N', bg: '#8B5CF6', fg: '#fff' },
  { id: 'o-green',   letter: 'O', bg: '#22C55E', fg: '#fff' },
  { id: 'p-pink',    letter: 'P', bg: '#EC4899', fg: '#fff' },
  { id: 'q-yellow',  letter: 'Q', bg: '#EAB308', fg: '#1C2236' },
  { id: 'r-slate',   letter: 'R', bg: '#64748B', fg: '#fff' },
  { id: 's-dark',    letter: 'S', bg: '#1E293B', fg: '#fff' },
  { id: 't-stone',   letter: 'T', bg: '#78716C', fg: '#fff' },
  { id: 'u-sky2',    letter: 'U', bg: '#38BDF8', fg: '#fff' },
  { id: 'v-grape',   letter: 'V', bg: '#7C3AED', fg: '#fff' },
  { id: 'w-mint',    letter: 'W', bg: '#34D399', fg: '#fff' },
  { id: 'x-coral',   letter: 'X', bg: '#FB7185', fg: '#fff' },
  { id: 'y-gold',    letter: 'Y', bg: '#FBBF24', fg: '#1C2236' },
  { id: 'z-navy',    letter: 'Z', bg: '#1D4ED8', fg: '#fff' },
  { id: '1-dark2',   letter: '#', bg: '#0F172A', fg: '#fff' },
  { id: '2-warm',    letter: '&', bg: '#B45309', fg: '#fff' },
  { id: '3-cool',    letter: '@', bg: '#0369A1', fg: '#fff' },
  { id: '4-soft',    letter: '*', bg: '#BE185D', fg: '#fff' },
  { id: '5-grass',   letter: '+', bg: '#15803D', fg: '#fff' },
  { id: '6-fire',    letter: '!', bg: '#DC2626', fg: '#fff' },
];

const AvatarPicker: React.FC<AvatarPickerProps> = ({ onClose }) => {
  const { user, userProfile, setUserProfile } = useAuth();
  const { lang } = useLanguage();
  const [selected, setSelected] = useState<string>(userProfile?.avatar_url || '');
  const [saving, setSaving] = useState(false);

  const handleSelect = async (avatarId: string) => {
    if (!user?.uid) return;

    setSelected(avatarId);
    setSaving(true);

    try {
      await userService.updateUserProfile(user.uid, { avatar_url: avatarId });

      // Update local profile state
      if (userProfile) {
        setUserProfile({ ...userProfile, avatar_url: avatarId });
      }

      onClose();
    } catch (error) {
      errorLogger.log({ severity: 'high', message: 'Failed to update avatar', component: 'AvatarPicker', metadata: { error: String(error) } });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="avatar-picker-overlay" onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="avatar-picker-modal" onClick={(e) => e.stopPropagation()} style={{ background: 'var(--bg-main, #1C2236)', borderRadius: 24, padding: 28, width: '90%', maxWidth: 420, maxHeight: '80vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div className="picker-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main, #333)' }}>{lang === 'tr' ? 'Avatarını Seç' : 'Choose Your Avatar'}</h3>
          <button type="button" className="picker-close" onClick={onClose} aria-label={lang === 'tr' ? 'Kapat' : 'Close'} style={{ width: 36, height: 36, borderRadius: 12, border: 'none', background: 'var(--bg-soft, #f0f0f0)', color: 'var(--text-muted, #666)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={20} />
          </button>
        </div>

        <div className="picker-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(56px, 1fr))', gap: 10 }}>
          {AVATAR_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.id}
              className={`picker-item ${selected === opt.id ? 'selected' : ''}`}
              onClick={() => handleSelect(opt.id)}
              disabled={saving}
              aria-label={lang === 'tr' ? `${opt.letter} avatarını seç` : `Select ${opt.letter} avatar`}
              style={{ width: 56, height: 56, borderRadius: 16, border: selected === opt.id ? '2px solid var(--secondary)' : '2px solid transparent', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}
            >
              <span
                className="picker-letter-avatar"
                style={{ background: opt.bg, color: opt.fg, width: 48, height: 48, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 800, lineHeight: 1, userSelect: 'none' }}
              >
                {opt.letter}
              </span>
            </button>
          ))}
        </div>

        {saving && (
          <div className="picker-saving" style={{ textAlign: 'center', marginTop: 16, fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted, #666)' }}>{lang === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</div>
        )}

        {/* Global <style> tag removed — critical layout styles moved to inline style objects on elements above.
           Original CSS class names kept for any external stylesheet overrides. */}
      </div>
    </div>
  );
};

export default AvatarPicker;
