import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import ParentGate from '../components/ParentGate';
import { supabase } from '../config/supabase';
import {
  Settings,
  Trophy,
  Star,
  Clock,
  X,
  Palette,
  Zap
} from 'lucide-react';
import AvatarDisplay from '../components/AvatarDisplay';
import { getAvatarConfig } from '../services/avatarService';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import { KidIcon } from '../components/ui/KidIcon';
import type { KidIconName } from '../components/ui/KidIcon';
import XPBar from '../components/XPBar';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import MimiGuide from '../components/MimiGuide';
import { getAverageWPM } from '../services/readingProgressService';
import './Profile.css';

const LS_CHILD_MODE = 'mm_child_mode';

function readChildMode(): boolean {
  try {
    return localStorage.getItem(LS_CHILD_MODE) === 'true';
  } catch {
    return false;
  }
}

const Profile: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { t, lang } = useLanguage();
  const { stats, allBadges } = useGamification();
  const avgWpm = user ? getAverageWPM(user.uid) : 0;
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [childMode, setChildMode] = useState<boolean>(readChildMode);
  const [showParentGateForDisable, setShowParentGateForDisable] = useState(false);

  const explorerBadges = allBadges.filter(b => (stats.badges || []).includes(b.id));

  // ── Child mode handlers ─────────────────────────────────────────────────────

  const handleChildModeToggle = useCallback(() => {
    if (!childMode) {
      // Enabling child mode — no gate needed, parent is already here
      try { localStorage.setItem(LS_CHILD_MODE, 'true'); } catch { /* storage unavailable */ }
      setChildMode(true);
    } else {
      // Disabling requires parent verification
      setShowParentGateForDisable(true);
    }
  }, [childMode]);

  const handleDisableChildModeSuccess = useCallback(() => {
    try { localStorage.removeItem(LS_CHILD_MODE); } catch { /* storage unavailable */ }
    setChildMode(false);
    setShowParentGateForDisable(false);
  }, []);

  const handleDisableChildModeCancel = useCallback(() => {
    setShowParentGateForDisable(false);
  }, []);

  useEffect(() => {
    if (userProfile?.display_name) {
      setEditDisplayName(userProfile.display_name);
    }
  }, [userProfile]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('users')
        .update({ display_name: editDisplayName })
        .eq('id', user.uid);

      if (error) throw error;
      await refreshUserProfile();
      toast.success('Profil güncellendi!');
      setShowEditModal(false);
    } catch {
      toast.error('Profil güncellenemedi');
    }
  };

  if (!user) return (
    <div className="profile-loading text-center px-4 py-12">
      <p className="text-[1.2rem] mb-4">Please sign in to view your backpack!</p>
      <Link
        to="/login"
        className="inline-block px-8 py-3 bg-primary-500 text-white rounded-xl no-underline font-semibold text-base"
      >
        Sign In
      </Link>
    </div>
  );

  return (
    <div className="profile-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="profile-content"
      >
        <header className="profile-hero">
          <Link to="/avatar" className="profile-avatar-large" title="Avatarını düzenle">
            <AvatarDisplay
              config={getAvatarConfig(user.uid)}
              letter={userProfile?.display_name ?? user.displayName ?? '?'}
              size={100}
              animated
            />
          </Link>

          <div className="profile-main-info">
            <div className="name-row">
              <h1>{userProfile?.display_name || 'My Space'}</h1>
              <button
                className="edit-profile-btn"
                onClick={() => setShowEditModal(true)}
              >
                <Settings size={20} />
                <span>{t('profile.editProfile')}</span>
              </button>
            </div>

            <div className="level-badge">
              <Trophy size={20} />
              <span>Level {stats.level}</span>
            </div>
          </div>
        </header>

        <section className="profile-stats-grid">
          <div className="stat-card xp-focused">
            <div className="stat-header">
              <h3>{t('profile.myXpProgress')}</h3>
              <Star size={20} fill="var(--warning)" color="var(--warning)" />
            </div>
            <div className="xp-details">
              <XPBar />
              <p className="xp-text">{stats.xp} XP</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-header">
              <h3>{t('profile.myTrophies')}</h3>
              <Clock size={20} color="var(--accent-indigo)" />
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <span className="activity-dot"></span>
                <span className="activity-desc">{t('profile.wordsLearned')}: {stats.wordsLearned || 0}</span>
              </div>
              <div className="activity-item">
                <span className="activity-dot"></span>
                <span className="activity-desc">{t('profile.gamesPlayed')}: {stats.gamesPlayed || 0}</span>
              </div>
              <div className="activity-item">
                <span className="activity-dot"></span>
                <span className="activity-desc">{t('profile.videosWatched')}: {stats.videosWatched || 0}</span>
              </div>
            </div>
          </div>

          <div className="stat-card profile-reading-speed-card">
            <div className="stat-header">
              <h3>Okuma Hızı</h3>
              <Zap size={20} color="var(--warning)" />
            </div>
            <div className="profile-wpm-display">
              <span className="profile-wpm-value">{avgWpm > 0 ? avgWpm : '—'}</span>
              <span className="profile-wpm-unit">kelime/dk</span>
            </div>
            {avgWpm === 0 && (
              <p className="profile-wpm-hint">Okuma bitirince burada WPM görünür!</p>
            )}
          </div>
        </section>

        <section className="profile-mascot-link-section">
          <Link to="/mascots" className="mascot-link-btn">
            <span className="mascot-link-icon" aria-hidden="true">
              <Star size={20} fill="var(--primary)" color="var(--primary)" />
            </span>
            <span className="mascot-link-text">
              <strong>Maskotlarım</strong>
              <span className="mascot-link-sub">My Mascots</span>
            </span>
          </Link>
        </section>

        {/* ── Child Mode toggle ─────────────────────────────────────────── */}
        <section className="profile-child-mode-section" style={{ width: '100%', marginBottom: '1.5rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'var(--bg-elevated, #fff)',
              border: '1.5px solid var(--border-color, #e2e8f0)',
              borderRadius: '16px',
              padding: '16px 20px',
              gap: '16px',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: '16px', color: 'var(--text-primary)', fontFamily: 'Nunito, sans-serif' }}>
                {lang === 'tr' ? 'Çocuk Modu' : 'Child Mode'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary, #64748b)', marginTop: '3px', fontFamily: 'Nunito, sans-serif' }}>
                {lang === 'tr'
                  ? 'Küçük öğrenciler için sade ekran (3-6 yaş)'
                  : 'Simple screen for young learners (ages 3-6)'}
              </div>
              {childMode && (
                <div style={{ fontSize: '12px', color: 'var(--warning, #f59e0b)', marginTop: '4px', fontWeight: 700 }}>
                  {lang === 'tr' ? 'Devre dışı bırakmak için ebeveyn doğrulaması gerekir.' : 'Parent verification required to disable.'}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleChildModeToggle}
              aria-pressed={childMode}
              aria-label={lang === 'tr' ? 'Çocuk Modu' : 'Child Mode'}
              style={{
                width: '52px',
                height: '30px',
                borderRadius: '15px',
                border: 'none',
                background: childMode ? 'var(--primary)' : 'var(--border-color, #e2e8f0)',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  top: '3px',
                  left: childMode ? '25px' : '3px',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: '#fff',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
                  transition: 'left 0.2s',
                  display: 'block',
                }}
              />
            </button>
          </div>
        </section>

        <section className="profile-badges-section">
          <div className="section-header">
            <h3>{t('profile.myBadges')}</h3>
            <div className="badges-header-right">
              <Link to="/achievements" className="view-achievements-btn">
                Rozetlerim
              </Link>
              <Trophy size={24} color="var(--warning)" />
            </div>
          </div>
          <div className="badges-grid">
            {explorerBadges.length > 0 ? (
              explorerBadges.map((badge, i) => (
                <div key={i} className="badge-item">
                  <div className="badge-circle">
                    <KidIcon name={badge.icon as KidIconName} size={28} />
                  </div>
                  <span>{badge.name}</span>
                </div>
              ))
            ) : (
              <div className="no-badges">
                <span className="no-badges-emoji"><LottieCharacter state="happy" size={48} /></span>
                <p>Rozet kazanmak için keşfetmeye devam et!</p>
              </div>
            )}
          </div>
        </section>
      </motion.div>

      {showEditModal && (
        <div className="edit-modal-overlay">
          <div className="edit-modal">
            <div className="edit-modal-header">
              <h2><Palette size={20} style={{ verticalAlign: 'middle', marginRight: '0.4rem' }} />Profil Düzenle</h2>
              <button type="button" onClick={() => setShowEditModal(false)} aria-label="Close"><X size={24} /></button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-field">
                <label>Sana ne diyelim?</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  placeholder="Kaşif adını gir"
                  maxLength={30}
                />
              </div>
            </div>
            <div className="edit-modal-footer">
              <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>{t('common.back')}</button>
              <button type="button" className="save-btn" onClick={handleUpdateProfile}>Kaydet</button>
            </div>
          </div>
        </div>
      )}

      <MimiGuide
        message="This is your profile! You can change your avatar here!"
        messageTr="Bu senin profilin! Avatarını buradan değiştirebilirsin!"
        showOnce="mimi_guide_profile"
        position="bottom-left"
      />

      {showParentGateForDisable && (
        <ParentGate
          onSuccess={handleDisableChildModeSuccess}
          onCancel={handleDisableChildModeCancel}
          reason={
            lang === 'tr'
              ? 'Çocuk Modunu devre dışı bırakmak için doğrulayın.'
              : 'Verify to disable Child Mode.'
          }
        />
      )}
    </div>
  );
};

export default Profile;
