import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import ParentGate from '../components/ParentGate';
import { supabase } from '../config/supabase';
import { Settings, Trophy, Star, X, Zap, Flame } from 'lucide-react';
import AvatarDisplay from '../components/AvatarDisplay';
import { getAvatarConfig } from '../services/avatarService';
import { motion } from 'framer-motion';
import { useGamification } from '../contexts/GamificationContext';
import XPBar from '../components/XPBar';
import toast from 'react-hot-toast';
import MimiGuide from '../components/MimiGuide';

const LS_CHILD_MODE = 'mm_child_mode';
function readChildMode(): boolean {
  try { return localStorage.getItem(LS_CHILD_MODE) === 'true'; } catch { return false; }
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 24 };

function StatCardSkeleton() {
  return <div className="w-[calc(50%-6px)] h-28 rounded-3xl bg-gray-100 animate-pulse" />;
}

const Profile: React.FC = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { lang } = useLanguage();
  usePageTitle('Profilim', 'My Profile');
  const { stats, loading: gamificationLoading } = useGamification();
  const isTr = lang === 'tr';

  const [showEditModal, setShowEditModal] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [childMode, setChildMode] = useState<boolean>(readChildMode);
  const [showParentGateForDisable, setShowParentGateForDisable] = useState(false);
  const [saving, setSaving] = useState(false);
  const editModalInputRef = useRef<HTMLInputElement>(null);

  const handleChildModeToggle = useCallback(() => {
    if (!childMode) {
      try { localStorage.setItem(LS_CHILD_MODE, 'true'); } catch { /* */ }
      setChildMode(true);
    } else {
      setShowParentGateForDisable(true);
    }
  }, [childMode]);

  useEffect(() => { if (userProfile?.display_name) setEditDisplayName(userProfile.display_name); }, [userProfile]);
  useEffect(() => { if (showEditModal) setTimeout(() => editModalInputRef.current?.focus(), 50); }, [showEditModal]);

  const handleUpdateProfile = async () => {
    if (!user || saving) return;
    const trimmed = editDisplayName.trim();
    if (!trimmed || trimmed.length < 2) { toast.error(isTr ? 'Ad en az 2 karakter olmali' : 'Name must be at least 2 characters'); return; }
    if (trimmed === (userProfile?.display_name ?? '').trim()) { setShowEditModal(false); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('users').update({ display_name: trimmed }).eq('id', user.uid);
      if (error) throw error;
      await refreshUserProfile();
      toast.success(isTr ? 'Profil guncellendi!' : 'Profile updated!');
      setShowEditModal(false);
    } catch { toast.error(isTr ? 'Profil guncellenemedi' : 'Could not update profile'); }
    finally { setSaving(false); }
  };

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex flex-col items-center justify-center px-6 text-center gap-4">
      <p className="text-gray-600">{isTr ? 'Giris yap!' : 'Please sign in!'}</p>
      <Link to="/login" className="h-12 px-6 rounded-2xl bg-purple-500 text-white font-bold flex items-center">
        {isTr ? 'Giris Yap' : 'Sign In'}
      </Link>
    </div>
  );

  if (gamificationLoading) return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-6 w-32 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-3">
          {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  const STATS = [
    { icon: <Star size={20} className="text-yellow-500" />, value: stats.xp, label: 'XP', color: 'from-yellow-50 to-yellow-100' },
    { icon: <Flame size={20} className="text-red-500" />, value: stats.streakDays || 0, label: isTr ? 'Gun Serisi' : 'Streak', color: 'from-red-50 to-red-100' },
    { icon: <Zap size={20} className="text-blue-500" />, value: stats.wordsLearned || 0, label: isTr ? 'Kelime' : 'Words', color: 'from-blue-50 to-blue-100' },
    { icon: <Trophy size={20} className="text-purple-500" />, value: stats.gamesPlayed || 0, label: isTr ? 'Oyun' : 'Games', color: 'from-purple-50 to-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white pb-24">
      <div className="max-w-lg mx-auto px-4 pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {/* Avatar + Name */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <Link to="/avatar" className="active:scale-95 transition-transform">
              <AvatarDisplay
                config={getAvatarConfig(user.uid)}
                letter={userProfile?.display_name ?? user.displayName ?? '?'}
                size={96}
                animated
              />
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-black text-gray-800">
                {userProfile?.display_name || (isTr ? 'Kasif' : 'Explorer')}
              </h1>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Trophy size={14} className="text-yellow-500" />
                <span className="text-sm font-semibold text-gray-500">{isTr ? 'Seviye' : 'Level'} {stats.level}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="h-9 px-4 rounded-2xl bg-gray-100 text-gray-600 text-sm font-medium flex items-center gap-1.5 active:scale-95 transition-transform"
            >
              <Settings size={14} /> {isTr ? 'Duzenle' : 'Edit'}
            </button>
          </div>

          {/* XP Bar */}
          <div className="mb-6 bg-white rounded-3xl p-4 border-2 border-gray-100 shadow-sm">
            <XPBar />
          </div>

          {/* Stats grid */}
          <div className="flex flex-wrap gap-3 mb-6">
            {STATS.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: idx * 0.08 }}
                className={`w-[calc(50%-6px)] rounded-3xl bg-gradient-to-br ${stat.color} p-4 flex flex-col items-center justify-center gap-1`}
              >
                {stat.icon}
                <span className="text-2xl font-black text-gray-800">{stat.value}</span>
                <span className="text-xs font-semibold text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <Link to="/achievements" className="w-full h-14 rounded-3xl bg-white border-2 border-gray-100 shadow-sm flex items-center px-4 gap-3 active:scale-[0.97] transition-transform">
              <Trophy size={20} className="text-yellow-500" />
              <span className="text-sm font-bold text-gray-800 flex-1">{isTr ? 'Rozetlerim' : 'My Badges'}</span>
              <span className="text-xs text-gray-400">{(stats.badges || []).length}</span>
            </Link>
            <Link to="/mascots" className="w-full h-14 rounded-3xl bg-white border-2 border-gray-100 shadow-sm flex items-center px-4 gap-3 active:scale-[0.97] transition-transform">
              <Star size={20} className="text-purple-500" />
              <span className="text-sm font-bold text-gray-800 flex-1">{isTr ? 'Maskotlarim' : 'My Mascots'}</span>
            </Link>
            <button
              type="button"
              onClick={handleChildModeToggle}
              className="w-full h-14 rounded-3xl bg-white border-2 border-gray-100 shadow-sm flex items-center px-4 gap-3 active:scale-[0.97] transition-transform"
            >
              <div className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${childMode ? 'bg-green-400 justify-end' : 'bg-gray-200 justify-start'}`}>
                <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
              </div>
              <span className="text-sm font-bold text-gray-800 flex-1 text-left">{isTr ? 'Cocuk Modu' : 'Child Mode'}</span>
            </button>
            <Link to="/settings" className="w-full h-14 rounded-3xl bg-white border-2 border-gray-100 shadow-sm flex items-center px-4 gap-3 active:scale-[0.97] transition-transform">
              <Settings size={20} className="text-gray-400" />
              <span className="text-sm font-bold text-gray-800 flex-1">{isTr ? 'Ayarlar' : 'Settings'}</span>
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Edit modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-end justify-center" onClick={() => setShowEditModal(false)}>
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={spring}
            className="w-full max-w-lg bg-white rounded-t-[2rem] p-6 pb-10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">{isTr ? 'Profil Duzenle' : 'Edit Profile'}</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <label className="text-sm font-medium text-gray-600 mb-2 block">{isTr ? 'Sana ne diyelim?' : 'What should we call you?'}</label>
            <input
              ref={editModalInputRef}
              type="text"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateProfile(); }}
              placeholder={isTr ? 'Kasif adini gir' : 'Enter your name'}
              maxLength={30}
              className="w-full h-14 rounded-2xl border-2 border-gray-200 px-4 text-lg font-medium focus:border-purple-400 focus:outline-none transition-colors"
            />
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 h-14 rounded-2xl bg-gray-100 text-gray-600 font-bold active:scale-95 transition-transform">
                {isTr ? 'Vazgec' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1 h-14 rounded-2xl bg-purple-500 text-white font-bold active:scale-95 transition-transform disabled:opacity-50"
              >
                {saving ? '...' : (isTr ? 'Kaydet' : 'Save')}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <MimiGuide
        message="This is your profile! Tap the avatar to customize!"
        messageTr="Bu senin profilin! Avatarina dokunarak degistir!"
        showOnce="mimi_guide_profile"
        position="bottom-left"
      />

      {showParentGateForDisable && (
        <ParentGate
          onSuccess={() => { try { localStorage.removeItem(LS_CHILD_MODE); } catch { /* */ } setChildMode(false); setShowParentGateForDisable(false); }}
          onCancel={() => setShowParentGateForDisable(false)}
          reason={isTr ? 'Cocuk Modunu devre disi birakmak icin dogrulayin.' : 'Verify to disable Child Mode.'}
        />
      )}
    </div>
  );
};

export default Profile;
