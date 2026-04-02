import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import ParentGate from '../components/ParentGate';
import { supabase } from '../config/supabase';
import { Settings, Trophy, Star, X, Flame, BookOpen, Gamepad2 } from 'lucide-react';
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
  return <div className="w-[calc(50%-8px)] h-36 rounded-[24px] bg-gray-100 animate-pulse" />;
}

const STAT_CONFIGS = [
  {
    key: 'xp',
    icon: <Star size={28} className="text-yellow-500" />,
    gradient: 'from-yellow-200 via-yellow-100 to-amber-50',
    border: 'border-yellow-300',
    iconBg: 'bg-yellow-300/40',
  },
  {
    key: 'streak',
    icon: <Flame size={28} className="text-red-500" />,
    gradient: 'from-red-200 via-red-100 to-orange-50',
    border: 'border-red-300',
    iconBg: 'bg-red-300/40',
  },
  {
    key: 'words',
    icon: <BookOpen size={28} className="text-blue-500" />,
    gradient: 'from-blue-200 via-blue-100 to-cyan-50',
    border: 'border-blue-300',
    iconBg: 'bg-blue-300/40',
  },
  {
    key: 'games',
    icon: <Gamepad2 size={28} className="text-purple-500" />,
    gradient: 'from-purple-200 via-purple-100 to-pink-50',
    border: 'border-purple-300',
    iconBg: 'bg-purple-300/40',
  },
];

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
    <div className="min-h-screen kid-bg flex flex-col items-center justify-center px-6 text-center gap-4">
      <p className="text-gray-600 text-lg font-bold">{isTr ? 'Giris yap!' : 'Please sign in!'}</p>
      <Link to="/login" className="h-14 px-8 rounded-[20px] bg-purple-500 text-white font-extrabold text-lg flex items-center shadow-lg">
        {isTr ? 'Giris Yap' : 'Sign In'}
      </Link>
    </div>
  );

  if (gamificationLoading) return (
    <div className="min-h-screen kid-bg pb-24">
      <div className="pt-8">
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-28 h-28 rounded-full bg-gray-100 animate-pulse" />
          <div className="h-7 w-36 rounded-xl bg-gray-100 animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-4">
          {[1, 2, 3, 4].map(i => <StatCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );

  const STATS_DATA = [
    { ...STAT_CONFIGS[0], value: stats.xp, label: 'XP' },
    { ...STAT_CONFIGS[1], value: stats.streakDays || 0, label: isTr ? 'Gun Serisi' : 'Streak' },
    { ...STAT_CONFIGS[2], value: stats.wordsLearned || 0, label: isTr ? 'Kelime' : 'Words' },
    { ...STAT_CONFIGS[3], value: stats.gamesPlayed || 0, label: isTr ? 'Oyun' : 'Games' },
  ];

  return (
    <div className="min-h-screen kid-bg pb-24">
      <div className="pt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={spring}
        >
          {/* Avatar + Name — Big, centered, colorful ring */}
          <div className="flex flex-col items-center gap-4 mb-8">
            <Link to="/avatar" className="active:scale-95 transition-transform">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ ...spring, delay: 0.1 }}
                className="relative"
              >
                {/* Colorful ring around avatar */}
                <div
                  className="absolute -inset-2 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, #FF6B6B, #FFD93D, #6BCB77, #4D96FF, #9B59B6, #FF6B6B)',
                    padding: 4,
                    borderRadius: '9999px',
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white" />
                </div>
                <div className="relative z-10">
                  <AvatarDisplay
                    config={getAvatarConfig(user.uid)}
                    letter={userProfile?.display_name ?? user.displayName ?? '?'}
                    size={112}
                    animated
                  />
                </div>
              </motion.div>
            </Link>

            <div className="text-center">
              <h1 className="text-2xl font-black text-gray-800">
                {userProfile?.display_name || (isTr ? 'Kasif' : 'Explorer')}
              </h1>

              {/* Level badge as colorful star */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ ...spring, delay: 0.2 }}
                className="flex items-center justify-center gap-2 mt-2"
              >
                <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full px-4 py-1.5 shadow-md">
                  <Star size={18} fill="#fff" stroke="#fff" />
                  <span className="text-sm font-extrabold text-white">
                    {isTr ? 'Seviye' : 'Level'} {stats.level}
                  </span>
                </div>
              </motion.div>
            </div>

            <button
              type="button"
              onClick={() => setShowEditModal(true)}
              className="h-10 px-5 rounded-full bg-white border-2 border-gray-200 text-gray-600 text-sm font-bold flex items-center gap-2 active:scale-95 transition-transform shadow-sm hover:border-purple-300 hover:text-purple-600"
            >
              <Settings size={16} /> {isTr ? 'Duzenle' : 'Edit'}
            </button>
          </div>

          {/* XP Bar */}
          <div className="mb-6 bg-white rounded-[24px] p-5 border-2 border-amber-200 shadow-md">
            <XPBar />
          </div>

          {/* Stats — Big colorful icon cards */}
          <div className="flex flex-wrap gap-4 mb-6">
            {STATS_DATA.map((stat, idx) => (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ ...spring, delay: idx * 0.1 }}
                className={`w-[calc(50%-8px)] rounded-[24px] bg-gradient-to-br ${stat.gradient} border-2 ${stat.border} p-5 flex flex-col items-center justify-center gap-2 shadow-md`}
              >
                <div className={`w-14 h-14 rounded-full ${stat.iconBg} flex items-center justify-center`}>
                  {stat.icon}
                </div>
                <span className="text-3xl font-black text-gray-800">{stat.value}</span>
                <span className="text-sm font-extrabold text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <Link to="/achievements" className="w-full h-16 rounded-[20px] bg-white border-2 border-yellow-200 shadow-md flex items-center px-5 gap-4 active:scale-[0.97] transition-transform hover:border-yellow-300">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Trophy size={22} className="text-yellow-500" />
              </div>
              <span className="text-base font-extrabold text-gray-800 flex-1">{isTr ? 'Rozetlerim' : 'My Badges'}</span>
              <span className="text-sm font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{(stats.badges || []).length}</span>
            </Link>
            <Link to="/mascots" className="w-full h-16 rounded-[20px] bg-white border-2 border-purple-200 shadow-md flex items-center px-5 gap-4 active:scale-[0.97] transition-transform hover:border-purple-300">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Star size={22} className="text-purple-500" />
              </div>
              <span className="text-base font-extrabold text-gray-800 flex-1">{isTr ? 'Maskotlarim' : 'My Mascots'}</span>
            </Link>
            <button
              type="button"
              onClick={handleChildModeToggle}
              className="w-full h-16 rounded-[20px] bg-white border-2 border-green-200 shadow-md flex items-center px-5 gap-4 active:scale-[0.97] transition-transform hover:border-green-300"
            >
              <div className={`w-12 h-7 rounded-full flex items-center px-0.5 transition-colors ${childMode ? 'bg-green-400 justify-end' : 'bg-gray-200 justify-start'}`}>
                <div className="w-6 h-6 rounded-full bg-white shadow-sm" />
              </div>
              <span className="text-base font-extrabold text-gray-800 flex-1 text-left">{isTr ? 'Cocuk Modu' : 'Child Mode'}</span>
            </button>
            <Link to="/settings" className="w-full h-16 rounded-[20px] bg-white border-2 border-gray-200 shadow-md flex items-center px-5 gap-4 active:scale-[0.97] transition-transform hover:border-gray-300">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <Settings size={22} className="text-gray-400" />
              </div>
              <span className="text-base font-extrabold text-gray-800 flex-1">{isTr ? 'Ayarlar' : 'Settings'}</span>
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
              <h2 className="text-xl font-black text-gray-800">{isTr ? 'Profil Duzenle' : 'Edit Profile'}</h2>
              <button type="button" onClick={() => setShowEditModal(false)} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>
            <label className="text-sm font-bold text-gray-600 mb-2 block">{isTr ? 'Sana ne diyelim?' : 'What should we call you?'}</label>
            <input
              ref={editModalInputRef}
              type="text"
              value={editDisplayName}
              onChange={(e) => setEditDisplayName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleUpdateProfile(); }}
              placeholder={isTr ? 'Kasif adini gir' : 'Enter your name'}
              maxLength={30}
              className="w-full h-16 rounded-[20px] border-2 border-gray-200 px-5 text-lg font-bold focus:border-purple-400 focus:outline-none transition-colors"
            />
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 h-14 rounded-[20px] bg-gray-100 text-gray-600 font-extrabold text-base active:scale-95 transition-transform">
                {isTr ? 'Vazgec' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex-1 h-14 rounded-[20px] bg-purple-500 text-white font-extrabold text-base active:scale-95 transition-transform disabled:opacity-50 shadow-lg"
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
