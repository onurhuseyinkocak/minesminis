/**
 * SETTINGS PAGE
 * Language, sound, notifications, account management
 */
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Globe,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  User,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// ── Sound setting ────────────────────────────────────────────────────────────

const LS_SOUND_KEY = 'mm_sound_enabled';

function getSoundEnabled(): boolean {
  try {
    const val = localStorage.getItem(LS_SOUND_KEY);
    return val !== 'false'; // default on
  } catch {
    return true;
  }
}

function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(LS_SOUND_KEY, String(enabled));
    // Dispatch custom event so SFX module picks it up
    window.dispatchEvent(new CustomEvent('mm-sound-toggle', { detail: { enabled } }));
  } catch {
    // storage unavailable
  }
}

// ── Notification setting ─────────────────────────────────────────────────────

function getNotificationsEnabled(): boolean {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

// ── Component ────────────────────────────────────────────────────────────────

export default function Settings() {
  const { lang, setLang } = useLanguage();
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const isTr = lang === 'tr';

  const [soundOn, setSoundOn] = useState(getSoundEnabled);
  const [notifOn] = useState(getNotificationsEnabled);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    toast.success(
      next
        ? (isTr ? 'Sesler acildi' : 'Sound enabled')
        : (isTr ? 'Sesler kapatildi' : 'Sound disabled'),
      { duration: 2000 }
    );
  }, [soundOn, isTr]);

  const toggleLang = useCallback(() => {
    const next = lang === 'tr' ? 'en' : 'tr';
    setLang(next as 'en' | 'tr');
    toast.success(
      next === 'tr' ? 'Dil Turkce olarak ayarlandi' : 'Language set to English',
      { duration: 2000 }
    );
  }, [lang, setLang]);

  const handleNotifToggle = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      toast.error(isTr ? 'Bu tarayici bildirimleri desteklemiyor' : 'This browser does not support notifications');
      return;
    }
    if (Notification.permission === 'granted') {
      toast(isTr ? 'Bildirimleri tarayici ayarlarindan kapatabilirsin' : 'Disable notifications in browser settings', { duration: 3000 });
      return;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      toast.success(isTr ? 'Bildirimler acildi!' : 'Notifications enabled!');
    } else {
      toast.error(isTr ? 'Bildirim izni reddedildi' : 'Notification permission denied');
    }
  }, [isTr]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/login');
  }, [signOut, navigate]);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-cream-100 to-white"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link
            to="/dashboard"
            className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-ink-500 hover:text-primary-500 transition-colors"
            aria-label={isTr ? 'Geri' : 'Back'}
          >
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-display font-extrabold text-2xl text-ink-900">
            {isTr ? 'Ayarlar' : 'Settings'}
          </h1>
        </div>

        {/* User info card */}
        {user && (
          <div className="bg-white rounded-2xl shadow-card p-4 mb-4 flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white font-display font-bold text-lg">
              {(userProfile?.display_name || user.displayName || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-ink-900 truncate">
                {userProfile?.display_name || user.displayName || 'Adventurer'}
              </p>
              <p className="text-sm text-ink-400 truncate">{user.email}</p>
            </div>
            <Link
              to="/profile"
              className="text-primary-500 hover:text-primary-600 transition-colors"
              aria-label={isTr ? 'Profili duzenle' : 'Edit profile'}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        )}

        {/* Settings sections */}
        <div className="space-y-3">

          {/* Language */}
          <button
            type="button"
            onClick={toggleLang}
            className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <Globe size={20} />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ink-900">
                {isTr ? 'Dil' : 'Language'}
              </p>
              <p className="text-sm text-ink-400">
                {lang === 'tr' ? 'Turkce' : 'English'}
              </p>
            </div>
            <span className="text-sm font-display font-bold text-primary-500 bg-primary-50 px-3 py-1 rounded-full">
              {lang === 'tr' ? 'TR' : 'EN'}
            </span>
          </button>

          {/* Sound */}
          <button
            type="button"
            onClick={toggleSound}
            className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${soundOn ? 'bg-green-50 text-green-500' : 'bg-ink-100 text-ink-400'}`}>
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ink-900">
                {isTr ? 'Ses Efektleri' : 'Sound Effects'}
              </p>
              <p className="text-sm text-ink-400">
                {soundOn ? (isTr ? 'Acik' : 'On') : (isTr ? 'Kapali' : 'Off')}
              </p>
            </div>
            <div className={`w-12 h-7 rounded-full relative transition-colors duration-200 ${soundOn ? 'bg-green-500' : 'bg-ink-200'}`}>
              <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${soundOn ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={handleNotifToggle}
            className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors text-left"
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notifOn ? 'bg-amber-50 text-amber-500' : 'bg-ink-100 text-ink-400'}`}>
              {notifOn ? <Bell size={20} /> : <BellOff size={20} />}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ink-900">
                {isTr ? 'Bildirimler' : 'Notifications'}
              </p>
              <p className="text-sm text-ink-400">
                {notifOn ? (isTr ? 'Acik' : 'Enabled') : (isTr ? 'Kapali' : 'Disabled')}
              </p>
            </div>
            <ChevronRight size={18} className="text-ink-300" />
          </button>

          {/* Profile link */}
          <Link
            to="/profile"
            className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors"
          >
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-ink-900">
                {isTr ? 'Profil' : 'Profile'}
              </p>
              <p className="text-sm text-ink-400">
                {isTr ? 'Adini ve avatarini duzenle' : 'Edit name and avatar'}
              </p>
            </div>
            <ChevronRight size={18} className="text-ink-300" />
          </Link>

          {/* Legal links */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
            <Link
              to="/privacy"
              className="w-full p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors border-b border-ink-100"
            >
              <div className="w-10 h-10 bg-ink-50 rounded-xl flex items-center justify-center text-ink-500">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-ink-900">
                  {isTr ? 'Gizlilik Politikasi' : 'Privacy Policy'}
                </p>
              </div>
              <ChevronRight size={18} className="text-ink-300" />
            </Link>
            <Link
              to="/terms"
              className="w-full p-4 flex items-center gap-3 hover:bg-ink-50 transition-colors"
            >
              <div className="w-10 h-10 bg-ink-50 rounded-xl flex items-center justify-center text-ink-500">
                <Shield size={20} />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-ink-900">
                  {isTr ? 'Kullanim Kosullari' : 'Terms of Service'}
                </p>
              </div>
              <ChevronRight size={18} className="text-ink-300" />
            </Link>
          </div>

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 hover:bg-red-50 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
              <LogOut size={20} />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-red-600">
                {isTr ? 'Cikis Yap' : 'Sign Out'}
              </p>
            </div>
          </button>

          {/* Delete account (dangerous) */}
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-center text-sm text-ink-300 hover:text-red-400 transition-colors py-4 font-display font-semibold"
            >
              {isTr ? 'Hesabimi Sil' : 'Delete My Account'}
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center space-y-3">
              <p className="font-display font-bold text-red-700 text-sm">
                {isTr
                  ? 'Hesabini silmek istediginden emin misin? Bu islem geri alinamaz.'
                  : 'Are you sure you want to delete your account? This cannot be undone.'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-white border border-ink-200 rounded-xl text-sm font-display font-bold text-ink-600 hover:bg-ink-50 transition-colors"
                >
                  {isTr ? 'Vazgec' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.error(
                      isTr
                        ? 'Hesap silme icin destek@minesminis.com adresine yazin.'
                        : 'To delete your account, email support@minesminis.com'
                    );
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-display font-bold hover:bg-red-600 transition-colors"
                >
                  {isTr ? 'Hesabimi Sil' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
