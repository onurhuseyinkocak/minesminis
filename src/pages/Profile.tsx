import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../config/supabase';
import {
  Settings,
  Trophy,
  Star,
  Clock,
  UserCircle,
  X,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import { KidIcon } from '../components/ui/KidIcon';
import type { KidIconName } from '../components/ui/KidIcon';
import XPBar from '../components/XPBar';
import toast from 'react-hot-toast';
import LottieCharacter from '../components/LottieCharacter';
import MimiGuide from '../components/MimiGuide';
import './Profile.css';

const Profile: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { t } = useLanguage();
  const { stats, allBadges } = useGamification();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');

  const explorerBadges = allBadges.filter(b => (stats.badges || []).includes(b.id));

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
          <div className="profile-avatar-large">
            <UserCircle size={100} className="avatar-vector" />
          </div>

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
        </section>

        <section className="profile-badges-section">
          <div className="section-header">
            <h3>{t('profile.myBadges')}</h3>
            <Trophy size={24} color="var(--warning)" />
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
    </div>
  );
};

export default Profile;
