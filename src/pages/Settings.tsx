/**
 * SETTINGS PAGE
 * Language, sound (+ TTS speed), notifications, data export, password change,
 * account deletion with real Firebase + Supabase cleanup.
 */
import { useState, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Globe,
  Volume2,
  VolumeX,
  Bell,
  BellOff,
  User,
  LogOut,
  ChevronRight,
  Shield,
  Download,
  Trash2,
  Lock,
  Gauge,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import './Settings.css';

// ── Constants ─────────────────────────────────────────────────────────────────

const LS_SOUND_KEY = 'mm_sound_enabled';
const LS_TTS_RATE_KEY = 'mm_tts_rate';

// ── Sound helpers ─────────────────────────────────────────────────────────────

function getSoundEnabled(): boolean {
  try {
    return localStorage.getItem(LS_SOUND_KEY) !== 'false';
  } catch {
    return true;
  }
}

function setSoundEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(LS_SOUND_KEY, String(enabled));
    window.dispatchEvent(new CustomEvent('mm-sound-toggle', { detail: { enabled } }));
  } catch {
    // storage unavailable
  }
}

// ── TTS speed helpers ─────────────────────────────────────────────────────────

type TtsSpeed = 'slow' | 'normal' | 'fast';

function getTtsSpeed(): TtsSpeed {
  try {
    const val = localStorage.getItem(LS_TTS_RATE_KEY);
    if (val === 'slow' || val === 'normal' || val === 'fast') return val;
  } catch { /* ignore */ }
  return 'normal';
}

function setTtsSpeedStorage(speed: TtsSpeed): void {
  try {
    localStorage.setItem(LS_TTS_RATE_KEY, speed);
    window.dispatchEvent(new CustomEvent('mm-tts-speed', { detail: { speed } }));
  } catch { /* ignore */ }
}

// ── Notification helper ────────────────────────────────────────────────────────

function getNotificationsEnabled(): boolean {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

// ── Toggle component ───────────────────────────────────────────────────────────

function SettingsToggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  // useId: avoids SSR/hydration mismatch from hardcoded ids like "sound-toggle"
  const id = useId();
  return (
    <label className="settings-toggle" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        aria-checked={checked}
      />
      <span className="settings-toggle-track">
        <span className="settings-toggle-thumb" />
      </span>
    </label>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function Settings() {
  const { lang, setLang } = useLanguage();
  usePageTitle('Ayarlar', 'Settings');
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const isTr = lang === 'tr';

  // ── Preferences state ──
  const [soundOn, setSoundOn] = useState(getSoundEnabled);
  const [notifOn, setNotifOn] = useState(getNotificationsEnabled);
  const [ttsSpeed, setTtsSpeedState] = useState<TtsSpeed>(getTtsSpeed);

  // ── Password change state ──
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // ── Delete account state ──
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'deleting'>('idle');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // ── Data export state ──
  const [exportLoading, setExportLoading] = useState(false);

  // ── Classroom join state ──
  const [classroomCode, setClassroomCode] = useState('');
  const [classroomJoining, setClassroomJoining] = useState(false);
  const [classroomMembership, setClassroomMembership] = useState<string | null>(() => {
    try {
      const raw = localStorage.getItem('mimi_my_classroom');
      if (!raw) return null;
      const parsed = JSON.parse(raw) as { classroomName?: string };
      return parsed.classroomName ?? null;
    } catch { return null; }
  });

  // ── Preferences handlers ─────────────────────────────────────────────────────

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    toast.success(
      next
        ? (isTr ? 'Sesler açıldı' : 'Sound enabled')
        : (isTr ? 'Sesler kapatıldı' : 'Sound disabled'),
      { duration: 2000 }
    );
  }, [soundOn, isTr]);

  const toggleLang = useCallback(() => {
    const next = lang === 'tr' ? 'en' : 'tr';
    setLang(next as 'en' | 'tr');
    toast.success(
      next === 'tr' ? 'Dil Türkçe olarak ayarlandı' : 'Language set to English',
      { duration: 2000 }
    );
  }, [lang, setLang]);

  const handleNotifToggle = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      toast.error(isTr ? 'Bu tarayıcı bildirimleri desteklemiyor' : 'This browser does not support notifications');
      return;
    }
    if (Notification.permission === 'granted') {
      toast(isTr ? 'Bildirimleri tarayıcı ayarlarından kapatabilirsin' : 'Disable notifications in browser settings', { duration: 3000 });
      return;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      setNotifOn(true);
      toast.success(isTr ? 'Bildirimler açıldı!' : 'Notifications enabled!');
    } else {
      toast.error(isTr ? 'Bildirim izni reddedildi' : 'Notification permission denied');
    }
  }, [isTr]);

  const handleTtsSpeed = useCallback((speed: TtsSpeed) => {
    setTtsSpeedState(speed);
    setTtsSpeedStorage(speed);
    const label = isTr
      ? speed === 'slow' ? 'Yavaş' : speed === 'fast' ? 'Hızlı' : 'Normal'
      : speed === 'slow' ? 'Slow' : speed === 'fast' ? 'Fast' : 'Normal';
    toast.success(`${isTr ? 'TTS hızı:' : 'TTS speed:'} ${label}`, { duration: 2000 });
  }, [isTr]);

  // ── Sign out ─────────────────────────────────────────────────────────────────

  const handleSignOut = useCallback(async () => {
    await signOut();
    navigate('/login');
  }, [signOut, navigate]);

  // ── Password change ───────────────────────────────────────────────────────────

  const handlePasswordChange = useCallback(async () => {
    if (!user || !user.email) {
      toast.error(isTr ? 'Kullanıcı bulunamadı' : 'User not found');
      return;
    }
    if (newPw.length < 6) {
      toast.error(isTr ? 'Yeni şifre en az 6 karakter olmalı' : 'New password must be at least 6 characters');
      return;
    }
    if (newPw !== confirmPw) {
      toast.error(isTr ? 'Şifreler eşleşmiyor' : 'Passwords do not match');
      return;
    }

    setPwLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No current user');
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPw);

      toast.success(isTr ? 'Şifre başarıyla değiştirildi!' : 'Password updated successfully!');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setShowPwForm(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        toast.error(isTr ? 'Mevcut şifre hatalı' : 'Current password is incorrect');
      } else if (code === 'auth/too-many-requests') {
        toast.error(isTr ? 'Çok fazla deneme. Lütfen bekleyin.' : 'Too many attempts. Please wait.');
      } else {
        toast.error(isTr ? 'Şifre değiştirilemedi. Tekrar deneyin.' : 'Could not update password. Try again.');
      }
    } finally {
      setPwLoading(false);
    }
  }, [user, currentPw, newPw, confirmPw, isTr]);

  // ── Data export ───────────────────────────────────────────────────────────────

  const handleExportData = useCallback(async () => {
    if (!user) return;
    setExportLoading(true);
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.uid)
        .maybeSingle();

      const { data: lessonProgress } = await supabase
        .from('curriculum_progress')
        .select('*')
        .eq('user_id', user.uid);

      const localData: Record<string, string> = {};
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('mm_')) {
            const val = localStorage.getItem(key);
            if (val !== null) localData[key] = val;
          }
        }
      } catch { /* ignore */ }

      const exportPayload = {
        exported_at: new Date().toISOString(),
        user: {
          id: user.uid,
          email: user.email,
          display_name: profile?.display_name ?? null,
          role: profile?.role ?? null,
          xp: profile?.xp ?? 0,
          points: profile?.points ?? 0,
          streak_days: profile?.streak_days ?? 0,
          level: profile?.level ?? 1,
          badges: profile?.badges ?? [],
          created_at: profile?.created_at ?? null,
        },
        lesson_progress: lessonProgress ?? [],
        local_settings: localData,
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `minesminis-data-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(isTr ? 'Verileriniz indirildi!' : 'Your data has been downloaded!');
    } catch {
      toast.error(isTr ? 'Dışa aktarma başarısız oldu' : 'Export failed. Please try again.');
    } finally {
      setExportLoading(false);
    }
  }, [user, isTr]);

  // ── Classroom join ────────────────────────────────────────────────────────────

  const handleJoinClassroom = useCallback(async () => {
    if (!user || !classroomCode.trim()) return;
    setClassroomJoining(true);
    try {
      const { joinClassroom: joinCls } = await import('../services/classroomService');
      const result = joinCls(classroomCode.trim(), {
        id: user.uid,
        name: userProfile?.display_name || user.displayName || user.email || 'Student',
        avatar: 'default',
      });
      if (result.success && result.classroomName) {
        setClassroomMembership(result.classroomName);
        setClassroomCode('');
        toast.success(
          isTr
            ? `"${result.classroomName}" sınıfına katıldın!`
            : `Joined "${result.classroomName}" successfully!`,
        );
      } else {
        toast.error(result.error ?? (isTr ? 'Geçersiz katılım kodu.' : 'Invalid join code.'));
      }
    } catch {
      toast.error(isTr ? 'Bir hata oluştu. Tekrar deneyin.' : 'An error occurred. Please try again.');
    }
    setClassroomJoining(false);
  }, [user, userProfile, classroomCode, isTr]);

  // ── Account deletion ──────────────────────────────────────────────────────────

  const handleDeleteAccount = useCallback(async () => {
    if (!user) return;
    const expected = isTr ? 'SİL' : 'DELETE';
    if (deleteConfirmText.trim().toUpperCase() !== expected) {
      toast.error(isTr ? `"${expected}" yazmanız gerekiyor` : `Please type "${expected}" to confirm`);
      return;
    }

    setDeleteStep('deleting');
    try {
      const uid = user.uid;

      // 1. Delete all Supabase rows for this user (before Firebase user is gone)
      // Run independent deletes in parallel for speed
      await Promise.all([
        supabase.from('user_activities').delete().eq('user_id', uid),
        supabase.from('user_achievements').delete().eq('user_id', uid),
        supabase.from('user_subscriptions').delete().eq('user_id', uid),
        supabase.from('daily_streaks').delete().eq('user_id', uid),
        supabase.from('game_scores').delete().eq('user_id', uid),
        supabase.from('garden_plants').delete().eq('user_id', uid),
        supabase.from('story_progress').delete().eq('user_id', uid),
        supabase.from('friends').delete().eq('user_id', uid),
        supabase.from('friends').delete().eq('friend_id', uid),
        supabase.from('follows').delete().eq('follower_id', uid),
        supabase.from('follows').delete().eq('following_id', uid),
        supabase.from('favorites').delete().eq('user_id', uid),
        supabase.from('user_progress').delete().eq('user_id', uid),
        supabase.from('parent_children').delete().eq('parent_id', uid),
        supabase.from('parent_children').delete().eq('child_id', uid),
        supabase.from('posts').delete().eq('author_id', uid),
      ]);

      // Delete pets by user id (pets.id = user id per schema)
      await supabase.from('pets').delete().eq('id', uid);

      // Delete profiles and users last (other tables may FK to them)
      await supabase.from('profiles').delete().eq('id', uid);
      await supabase.from('users').delete().eq('id', uid);

      // 2. Delete Firebase Auth user
      const currentUser = auth.currentUser;
      if (currentUser) {
        await deleteUser(currentUser);
      }

      // 3. Clear local storage — both mm_ and mimi_ prefixed keys
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && (key.startsWith('mm_') || key.startsWith('mimi_'))) keysToRemove.push(key);
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch { /* ignore */ }

      toast.success(isTr ? 'Hesabınız silindi.' : 'Your account has been deleted.');
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/requires-recent-login') {
        toast.error(
          isTr
            ? 'Hesabı silmek için yeniden giriş yapmanız gerekiyor. Çıkış yapıp tekrar giriş yapın.'
            : 'Please sign out and sign back in before deleting your account.',
          { duration: 6000 }
        );
      } else {
        toast.error(isTr ? 'Hesap silinemedi. Tekrar deneyin.' : 'Could not delete account. Please try again.');
      }
      setDeleteStep('idle');
      setDeleteConfirmText('');
    }
  }, [user, deleteConfirmText, isTr, navigate]);

  // ── Render ────────────────────────────────────────────────────────────────────

  const isEmailUser = user?.providerData?.some((p) => p.providerId === 'password') ?? false;

  return (
    <motion.div
      className="settings-container"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
    >
      <div className="settings-content">

        {/* Header */}
        <div className="settings-header">
          <Link
            to="/dashboard"
            className="settings-back-btn"
            aria-label={isTr ? 'Geri' : 'Back'}
          >
            <ChevronLeft size={20} />
          </Link>
          <h1 className="settings-page-title">
            {isTr ? 'Ayarlar' : 'Settings'}
          </h1>
        </div>

        {/* User info card */}
        {user && (
          <div className="settings-section" style={{ marginBottom: 'var(--space-lg)' }}>
            <div className="settings-user-card">
              <div className="settings-user-avatar">
                {(userProfile?.display_name || user.displayName || '?').charAt(0).toUpperCase()}
              </div>
              <div className="settings-user-info">
                <p className="settings-user-name">
                  {userProfile?.display_name || user.displayName || 'Adventurer'}
                </p>
                <p className="settings-user-email">{user.email}</p>
              </div>
              <Link
                to="/profile"
                className="settings-user-edit"
                aria-label={isTr ? 'Profili düzenle' : 'Edit profile'}
              >
                <ChevronRight size={20} />
              </Link>
            </div>
          </div>
        )}

        {/* ── PREFERENCES ─────────────────────────────────────────── */}
        <p className="settings-section-title">{isTr ? 'Tercihler' : 'Preferences'}</p>
        <div className="settings-section">

          {/* Language */}
          <div className="settings-row">
            <div className="settings-row-icon settings-row-icon--blue">
              <Globe size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">{isTr ? 'Dil' : 'Language'}</p>
              <p className="settings-row-sublabel">{lang === 'tr' ? 'Türkçe' : 'English'}</p>
            </div>
            <div className="settings-lang-toggle">
              <button
                type="button"
                className={`settings-lang-btn ${lang === 'tr' ? 'active' : ''}`}
                onClick={() => { if (lang !== 'tr') toggleLang(); }}
                aria-pressed={lang === 'tr'}
                aria-label="Türkçe'ye geç"
              >
                TR
              </button>
              <button
                type="button"
                className={`settings-lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => { if (lang !== 'en') toggleLang(); }}
                aria-pressed={lang === 'en'}
                aria-label="Switch to English"
              >
                EN
              </button>
            </div>
          </div>

          {/* Sound */}
          <div className="settings-row">
            <div className={`settings-row-icon ${soundOn ? 'settings-row-icon--green' : ''}`}>
              {soundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">{isTr ? 'Ses Efektleri' : 'Sound Effects'}</p>
              <p className="settings-row-sublabel">
                {soundOn ? (isTr ? 'Açık' : 'On') : (isTr ? 'Kapalı' : 'Off')}
              </p>
            </div>
            <SettingsToggle checked={soundOn} onChange={toggleSound} />
          </div>

          {/* TTS Speed */}
          <div className="settings-row">
            <div className="settings-row-icon settings-row-icon--blue">
              <Gauge size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">{isTr ? 'Sesli Okuma Hızı' : 'TTS Speed'}</p>
              <p className="settings-row-sublabel">
                {isTr
                  ? ttsSpeed === 'slow' ? 'Yavaş' : ttsSpeed === 'fast' ? 'Hızlı' : 'Normal'
                  : ttsSpeed === 'slow' ? 'Slow' : ttsSpeed === 'fast' ? 'Fast' : 'Normal'}
              </p>
            </div>
            <div className="settings-lang-toggle">
              {(['slow', 'normal', 'fast'] as TtsSpeed[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`settings-lang-btn ${ttsSpeed === s ? 'active' : ''}`}
                  onClick={() => handleTtsSpeed(s)}
                  aria-pressed={ttsSpeed === s}
                >
                  {isTr
                    ? s === 'slow' ? 'Yavaş' : s === 'fast' ? 'Hızlı' : 'Normal'
                    : s === 'slow' ? 'Slow' : s === 'fast' ? 'Fast' : 'Normal'}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-row">
            <div className={`settings-row-icon ${notifOn ? 'settings-row-icon--amber' : ''}`}>
              {notifOn ? <Bell size={20} /> : <BellOff size={20} />}
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">{isTr ? 'Bildirimler' : 'Notifications'}</p>
              <p className="settings-row-sublabel">
                {notifOn ? (isTr ? 'Açık' : 'Enabled') : (isTr ? 'Kapalı' : 'Disabled')}
              </p>
            </div>
            <SettingsToggle checked={notifOn} onChange={handleNotifToggle} />
          </div>

        </div>

        {/* ── CLASSROOM ─────────────────────────────────────────────── */}
        <p className="settings-section-title">{isTr ? 'Sınıf' : 'Classroom'}</p>
        <div className="settings-section" style={{ marginBottom: 'var(--space-lg)' }}>
          {classroomMembership ? (
            <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                {isTr ? 'Aktif Sınıf' : 'Active Classroom'}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
                {classroomMembership}
              </p>
            </div>
          ) : (
            <div style={{ padding: 'var(--space-md) var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)' }}>
                {isTr
                  ? 'Öğretmeninizin verdiği 6 haneli katılım kodunu girerek sınıfa katılın.'
                  : 'Enter the 6-character join code from your teacher to join a classroom.'}
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={classroomCode}
                  onChange={(e) => setClassroomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder={isTr ? 'Katılım kodu (ör. AB3X7K)' : 'Join code (e.g. AB3X7K)'}
                  maxLength={6}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: 14,
                    fontFamily: 'monospace',
                    letterSpacing: '0.1em',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    background: 'var(--bg-input, var(--bg-card))',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
                <button
                  type="button"
                  onClick={handleJoinClassroom}
                  disabled={classroomJoining || classroomCode.length < 6}
                  style={{
                    padding: '8px 16px',
                    fontSize: 13,
                    fontWeight: 700,
                    background: 'var(--primary)',
                    color: 'var(--color-white, #fff)',
                    border: 'none',
                    borderRadius: 8,
                    cursor: classroomJoining || classroomCode.length < 6 ? 'not-allowed' : 'pointer',
                    opacity: classroomJoining || classroomCode.length < 6 ? 0.6 : 1,
                  }}
                >
                  {classroomJoining
                    ? '...'
                    : (isTr ? 'Katıl' : 'Join')}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── ACCOUNT ──────────────────────────────────────────────── */}
        <p className="settings-section-title">{isTr ? 'Hesap' : 'Account'}</p>
        <div className="settings-section">

          {/* Profile link */}
          <Link to="/profile" className="settings-link-row">
            <div className="settings-row-icon settings-row-icon--purple">
              <User size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">{isTr ? 'Profil' : 'Profile'}</p>
              <p className="settings-row-sublabel">
                {isTr ? 'Adını ve avatarını düzenle' : 'Edit name and avatar'}
              </p>
            </div>
            <ChevronRight size={18} className="settings-link-row-chevron" />
          </Link>

          {/* Password change — only for email/password users */}
          {isEmailUser && (
            <>
              <button
                type="button"
                className="settings-link-row"
                onClick={() => setShowPwForm((v) => !v)}
                style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent', textAlign: 'left', borderTop: '1px solid var(--border)' }}
              >
                <div className="settings-row-icon settings-row-icon--blue">
                  <Lock size={20} />
                </div>
                <div className="settings-row-body">
                  <p className="settings-row-label">{isTr ? 'Şifre Değiştir' : 'Change Password'}</p>
                  <p className="settings-row-sublabel">
                    {isTr ? 'Mevcut şifrenle doğrula' : 'Verify with current password'}
                  </p>
                </div>
                <ChevronRight
                  size={18}
                  className="settings-link-row-chevron"
                  style={{ transform: showPwForm ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
                />
              </button>

              {showPwForm && (
                <div className="settings-pw-form">
                  <div className="settings-pw-field">
                    <label className="settings-pw-label">
                      {isTr ? 'Mevcut Şifre' : 'Current Password'}
                    </label>
                    <div className="settings-pw-input-wrap">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        className="settings-pw-input"
                        value={currentPw}
                        onChange={(e) => setCurrentPw(e.target.value)}
                        placeholder={isTr ? 'Mevcut şifreniz' : 'Your current password'}
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="settings-pw-eye"
                        onClick={() => setShowCurrentPw((v) => !v)}
                        aria-label={showCurrentPw ? 'Hide' : 'Show'}
                      >
                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="settings-pw-field">
                    <label className="settings-pw-label">
                      {isTr ? 'Yeni Şifre' : 'New Password'}
                    </label>
                    <div className="settings-pw-input-wrap">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        className="settings-pw-input"
                        value={newPw}
                        onChange={(e) => setNewPw(e.target.value)}
                        placeholder={isTr ? 'En az 6 karakter' : 'At least 6 characters'}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="settings-pw-eye"
                        onClick={() => setShowNewPw((v) => !v)}
                        aria-label={showNewPw ? 'Hide' : 'Show'}
                      >
                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div className="settings-pw-field">
                    <label className="settings-pw-label">
                      {isTr ? 'Yeni Şifre (Tekrar)' : 'Confirm New Password'}
                    </label>
                    <input
                      type="password"
                      className="settings-pw-input"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      placeholder={isTr ? 'Şifreyi tekrar girin' : 'Re-enter new password'}
                      autoComplete="new-password"
                    />
                  </div>
                  <button
                    type="button"
                    className="settings-pw-submit"
                    onClick={handlePasswordChange}
                    disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                  >
                    {pwLoading
                      ? (isTr ? 'Değiştiriliyor...' : 'Updating...')
                      : (isTr ? 'Şifreyi Güncelle' : 'Update Password')}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Sign out */}
          <button
            type="button"
            onClick={handleSignOut}
            className="settings-signout-btn"
          >
            <div className="settings-signout-icon">
              <LogOut size={20} />
            </div>
            <span className="settings-signout-label">
              {isTr ? 'Çıkış Yap' : 'Sign Out'}
            </span>
          </button>
        </div>

        {/* ── DATA MANAGEMENT (GDPR / KVKK) ───────────────────────── */}
        <p className="settings-section-title">{isTr ? 'Veri Yönetimi' : 'Data Management'}</p>
        <div className="settings-section">
          <button
            type="button"
            className="settings-link-row"
            onClick={handleExportData}
            disabled={exportLoading}
            style={{ width: '100%', border: 'none', cursor: exportLoading ? 'wait' : 'pointer', background: 'transparent', textAlign: 'left' }}
          >
            <div className="settings-row-icon settings-row-icon--green">
              <Download size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">
                {exportLoading
                  ? (isTr ? 'Hazırlanıyor...' : 'Preparing...')
                  : (isTr ? 'Verilerimi İndir' : 'Export My Data')}
              </p>
              <p className="settings-row-sublabel">
                {isTr
                  ? 'XP, streak, dersler — JSON formatında'
                  : 'XP, streak, lessons — JSON format'}
              </p>
            </div>
            <ChevronRight size={18} className="settings-link-row-chevron" />
          </button>
        </div>

        {/* ── LEGAL ────────────────────────────────────────────────── */}
        <p className="settings-section-title">{isTr ? 'Yasal' : 'Legal'}</p>
        <div className="settings-section">
          <Link to="/privacy" className="settings-link-row">
            <div className="settings-row-icon">
              <Shield size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">
                {isTr ? 'Gizlilik Politikası' : 'Privacy Policy'}
              </p>
            </div>
            <ChevronRight size={18} className="settings-link-row-chevron" />
          </Link>
          <Link to="/terms" className="settings-link-row">
            <div className="settings-row-icon">
              <Shield size={20} />
            </div>
            <div className="settings-row-body">
              <p className="settings-row-label">
                {isTr ? 'Kullanım Koşulları' : 'Terms of Service'}
              </p>
            </div>
            <ChevronRight size={18} className="settings-link-row-chevron" />
          </Link>
        </div>

        {/* ── DANGER ZONE ──────────────────────────────────────────── */}
        {deleteStep === 'idle' && (
          <button
            type="button"
            onClick={() => setDeleteStep('confirm')}
            className="settings-delete-trigger"
          >
            <Trash2 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />
            {isTr ? 'Hesabımı Sil' : 'Delete My Account'}
          </button>
        )}

        {(deleteStep === 'confirm' || deleteStep === 'deleting') && (
          <div className="settings-delete-confirm">
            <p className="settings-delete-confirm-text">
              {isTr
                ? 'Hesabın ve tüm verilerin kalıcı olarak silinecek. Onaylamak için "SİL" yazın.'
                : 'Your account and all data will be permanently deleted. Type "DELETE" to confirm.'}
            </p>
            <input
              type="text"
              className="settings-delete-input"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder={isTr ? 'SİL' : 'DELETE'}
              disabled={deleteStep === 'deleting'}
              aria-label={isTr ? 'Silmek için SİL yazın' : 'Type DELETE to confirm'}
            />
            <div className="settings-delete-confirm-actions">
              <button
                type="button"
                onClick={() => { setDeleteStep('idle'); setDeleteConfirmText(''); }}
                className="settings-delete-cancel-btn"
                disabled={deleteStep === 'deleting'}
              >
                {isTr ? 'Vazgeç' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="settings-delete-confirm-btn"
                disabled={deleteStep === 'deleting'}
              >
                {deleteStep === 'deleting'
                  ? (isTr ? 'Siliniyor...' : 'Deleting...')
                  : (isTr ? 'Hesabımı Sil' : 'Delete Account')}
              </button>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
