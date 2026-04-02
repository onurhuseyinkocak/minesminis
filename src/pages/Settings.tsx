/**
 * SETTINGS PAGE -- Simplified kid-friendly UI
 */
import { useState, useCallback, useId } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronLeft, Globe, Volume2, VolumeX, Bell, BellOff,
  User, LogOut, ChevronRight, Shield, Download, Trash2,
  Lock, Gauge, Eye, EyeOff,
} from 'lucide-react';
import {
  updatePassword, reauthenticateWithCredential, EmailAuthProvider, deleteUser,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { supabase } from '../config/supabase';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

// ── Helpers ─────────────────────────────────────────────────────────────────

const LS_SOUND_KEY = 'mm_sound_enabled';
const LS_TTS_RATE_KEY = 'mm_tts_rate';

function getSoundEnabled(): boolean {
  try { return localStorage.getItem(LS_SOUND_KEY) !== 'false'; } catch { return true; }
}
function setSoundEnabled(enabled: boolean): void {
  try { localStorage.setItem(LS_SOUND_KEY, String(enabled)); window.dispatchEvent(new CustomEvent('mm-sound-toggle', { detail: { enabled } })); } catch {}
}

type TtsSpeed = 'slow' | 'normal' | 'fast';
function getTtsSpeed(): TtsSpeed {
  try { const v = localStorage.getItem(LS_TTS_RATE_KEY); if (v === 'slow' || v === 'normal' || v === 'fast') return v; } catch {} return 'normal';
}
function setTtsSpeedStorage(speed: TtsSpeed): void {
  try { localStorage.setItem(LS_TTS_RATE_KEY, speed); window.dispatchEvent(new CustomEvent('mm-tts-speed', { detail: { speed } })); } catch {}
}
function getNotificationsEnabled(): boolean {
  if (typeof Notification === 'undefined') return false;
  return Notification.permission === 'granted';
}

// ── Toggle ──────────────────────────────────────────────────────────────────

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  const id = useId();
  return (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div className={`w-12 h-7 rounded-full transition-colors ${checked ? 'bg-emerald-400' : 'bg-gray-200'}`}>
        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform mt-1 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
      </div>
    </label>
  );
}

// ── Row component ───────────────────────────────────────────────────────────

function SettingRow({ icon, iconColor, label, sub, right }: {
  icon: React.ReactNode; iconColor?: string; label: string; sub?: string; right: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
      <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconColor || 'bg-gray-100 text-gray-500'}`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800">{label}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function Settings() {
  const { lang, setLang } = useLanguage();
  usePageTitle('Ayarlar', 'Settings');
  const { user, signOut, userProfile } = useAuth();
  const navigate = useNavigate();
  const isTr = lang === 'tr';

  const [soundOn, setSoundOn] = useState(getSoundEnabled);
  const [notifOn, setNotifOn] = useState(getNotificationsEnabled);
  const [ttsSpeed, setTtsSpeedState] = useState<TtsSpeed>(getTtsSpeed);
  const [showPwForm, setShowPwForm] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [deleteStep, setDeleteStep] = useState<'idle' | 'confirm' | 'deleting'>('idle');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [classroomCode, setClassroomCode] = useState('');
  const [classroomJoining, setClassroomJoining] = useState(false);
  const [classroomMembership, setClassroomMembership] = useState<string | null>(() => {
    try { const raw = localStorage.getItem('mimi_my_classroom'); if (!raw) return null; return (JSON.parse(raw) as { classroomName?: string }).classroomName ?? null; } catch { return null; }
  });

  const toggleSound = useCallback(() => { const next = !soundOn; setSoundOn(next); setSoundEnabled(next); toast.success(next ? (isTr ? 'Sesler acildi' : 'Sound enabled') : (isTr ? 'Sesler kapatildi' : 'Sound disabled'), { duration: 2000 }); }, [soundOn, isTr]);
  const toggleLang = useCallback(() => { const next = lang === 'tr' ? 'en' : 'tr'; setLang(next as 'en' | 'tr'); toast.success(next === 'tr' ? 'Dil Turkce olarak ayarlandi' : 'Language set to English', { duration: 2000 }); }, [lang, setLang]);

  const handleNotifToggle = useCallback(async () => {
    if (typeof Notification === 'undefined') { toast.error(isTr ? 'Bu tarayici bildirimleri desteklemiyor' : 'This browser does not support notifications'); return; }
    if (Notification.permission === 'granted') { toast(isTr ? 'Bildirimleri tarayici ayarlarindan kapatabilirsin' : 'Disable notifications in browser settings', { duration: 3000 }); return; }
    const result = await Notification.requestPermission();
    if (result === 'granted') { setNotifOn(true); toast.success(isTr ? 'Bildirimler acildi!' : 'Notifications enabled!'); }
    else toast.error(isTr ? 'Bildirim izni reddedildi' : 'Notification permission denied');
  }, [isTr]);

  const handleTtsSpeed = useCallback((speed: TtsSpeed) => {
    setTtsSpeedState(speed); setTtsSpeedStorage(speed);
    const label = isTr ? (speed === 'slow' ? 'Yavas' : speed === 'fast' ? 'Hizli' : 'Normal') : (speed === 'slow' ? 'Slow' : speed === 'fast' ? 'Fast' : 'Normal');
    toast.success(`${isTr ? 'TTS hizi:' : 'TTS speed:'} ${label}`, { duration: 2000 });
  }, [isTr]);

  const handleSignOut = useCallback(async () => { await signOut(); navigate('/login'); }, [signOut, navigate]);

  const handlePasswordChange = useCallback(async () => {
    if (!user || !user.email) { toast.error(isTr ? 'Kullanici bulunamadi' : 'User not found'); return; }
    if (newPw.length < 6) { toast.error(isTr ? 'Yeni sifre en az 6 karakter olmali' : 'New password must be at least 6 characters'); return; }
    if (newPw !== confirmPw) { toast.error(isTr ? 'Sifreler eslesmiyor' : 'Passwords do not match'); return; }
    setPwLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw);
      const currentUser = auth.currentUser; if (!currentUser) throw new Error('No current user');
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPw);
      toast.success(isTr ? 'Sifre basariyla degistirildi!' : 'Password updated successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw(''); setShowPwForm(false);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') toast.error(isTr ? 'Mevcut sifre hatali' : 'Current password is incorrect');
      else if (code === 'auth/too-many-requests') toast.error(isTr ? 'Cok fazla deneme.' : 'Too many attempts.');
      else toast.error(isTr ? 'Sifre degistirilemedi.' : 'Could not update password.');
    } finally { setPwLoading(false); }
  }, [user, currentPw, newPw, confirmPw, isTr]);

  const handleExportData = useCallback(async () => {
    if (!user) return;
    setExportLoading(true);
    try {
      const { data: profile } = await supabase.from('users').select('*').eq('id', user.uid).maybeSingle();
      const { data: lessonProgress } = await supabase.from('curriculum_progress').select('*').eq('user_id', user.uid);
      const localData: Record<string, string> = {};
      try { for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key?.startsWith('mm_')) { const val = localStorage.getItem(key); if (val !== null) localData[key] = val; } } } catch {}
      const payload = {
        exported_at: new Date().toISOString(),
        user: { id: user.uid, email: user.email, display_name: profile?.display_name ?? null, role: profile?.role ?? null, xp: profile?.xp ?? 0, points: profile?.points ?? 0, streak_days: profile?.streak_days ?? 0, level: profile?.level ?? 1, badges: profile?.badges ?? [], created_at: profile?.created_at ?? null },
        lesson_progress: lessonProgress ?? [], local_settings: localData,
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `minesminis-data-${new Date().toISOString().slice(0, 10)}.json`; a.click();
      URL.revokeObjectURL(url);
      toast.success(isTr ? 'Verileriniz indirildi!' : 'Your data has been downloaded!');
    } catch { toast.error(isTr ? 'Disa aktarma basarisiz oldu' : 'Export failed.'); }
    finally { setExportLoading(false); }
  }, [user, isTr]);

  const handleJoinClassroom = useCallback(async () => {
    if (!user || !classroomCode.trim()) return;
    setClassroomJoining(true);
    try {
      const { joinClassroom: joinCls } = await import('../services/classroomService');
      const result = joinCls(classroomCode.trim(), { id: user.uid, name: userProfile?.display_name || user.displayName || user.email || 'Student', avatar: 'default' });
      if (result.success && result.classroomName) {
        setClassroomMembership(result.classroomName); setClassroomCode('');
        toast.success(isTr ? `"${result.classroomName}" sinifina katildin!` : `Joined "${result.classroomName}" successfully!`);
      } else { toast.error(result.error ?? (isTr ? 'Gecersiz katilim kodu.' : 'Invalid join code.')); }
    } catch { toast.error(isTr ? 'Bir hata olustu.' : 'An error occurred.'); }
    setClassroomJoining(false);
  }, [user, userProfile, classroomCode, isTr]);

  const handleDeleteAccount = useCallback(async () => {
    if (!user) return;
    const expected = isTr ? 'SIL' : 'DELETE';
    if (deleteConfirmText.trim().toUpperCase() !== expected) { toast.error(isTr ? `"${expected}" yazmaniz gerekiyor` : `Please type "${expected}" to confirm`); return; }
    setDeleteStep('deleting');
    try {
      const uid = user.uid;
      await Promise.all([
        supabase.from('user_activities').delete().eq('user_id', uid), supabase.from('user_achievements').delete().eq('user_id', uid),
        supabase.from('user_subscriptions').delete().eq('user_id', uid), supabase.from('daily_streaks').delete().eq('user_id', uid),
        supabase.from('game_scores').delete().eq('user_id', uid), supabase.from('garden_plants').delete().eq('user_id', uid),
        supabase.from('story_progress').delete().eq('user_id', uid), supabase.from('friends').delete().eq('user_id', uid),
        supabase.from('friends').delete().eq('friend_id', uid), supabase.from('follows').delete().eq('follower_id', uid),
        supabase.from('follows').delete().eq('following_id', uid), supabase.from('favorites').delete().eq('user_id', uid),
        supabase.from('user_progress').delete().eq('user_id', uid), supabase.from('parent_children').delete().eq('parent_id', uid),
        supabase.from('parent_children').delete().eq('child_id', uid), supabase.from('posts').delete().eq('author_id', uid),
      ]);
      await supabase.from('pets').delete().eq('id', uid);
      await supabase.from('profiles').delete().eq('id', uid);
      await supabase.from('users').delete().eq('id', uid);
      const currentUser = auth.currentUser; if (currentUser) await deleteUser(currentUser);
      try { const keys: string[] = []; for (let i = 0; i < localStorage.length; i++) { const key = localStorage.key(i); if (key && (key.startsWith('mm_') || key.startsWith('mimi_'))) keys.push(key); } keys.forEach(k => localStorage.removeItem(k)); } catch {}
      toast.success(isTr ? 'Hesabiniz silindi.' : 'Your account has been deleted.');
      navigate('/');
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === 'auth/requires-recent-login') toast.error(isTr ? 'Hesabi silmek icin yeniden giris yapin.' : 'Please sign out and sign back in.', { duration: 6000 });
      else toast.error(isTr ? 'Hesap silinemedi.' : 'Could not delete account.');
      setDeleteStep('idle'); setDeleteConfirmText('');
    }
  }, [user, deleteConfirmText, isTr, navigate]);

  const isEmailUser = user?.providerData?.some(p => p.providerId === 'password') ?? false;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-50 pb-24"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 20, stiffness: 250 }}
    >
      <div className="py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/dashboard" className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white shadow-sm" aria-label={isTr ? 'Geri' : 'Back'}>
            <ChevronLeft size={20} className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">{isTr ? 'Ayarlar' : 'Settings'}</h1>
        </div>

        {/* User card */}
        {user && (
          <Link to="/profile" className="flex items-center gap-3 bg-white rounded-3xl p-4 mb-6 shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-lg font-bold text-orange-600">
              {(userProfile?.display_name || user.displayName || '?').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800 truncate">{userProfile?.display_name || user.displayName || 'Adventurer'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
        )}

        {/* Sound & Language */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
          {isTr ? 'Tercihler' : 'Preferences'}
        </p>
        <div className="bg-white rounded-3xl shadow-sm mb-5 divide-y divide-gray-50">
          <SettingRow icon={<Globe size={18} />} iconColor="bg-blue-100 text-blue-500" label={isTr ? 'Dil' : 'Language'} sub={lang === 'tr' ? 'Turkce' : 'English'}
            right={
              <div className="flex bg-gray-100 rounded-full p-0.5">
                <button type="button" aria-label="Turkce dil secimi" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'tr' ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => { if (lang !== 'tr') toggleLang(); }}>TR</button>
                <button type="button" aria-label="English language selection" className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => { if (lang !== 'en') toggleLang(); }}>EN</button>
              </div>
            }
          />
          <SettingRow icon={soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />} iconColor={soundOn ? 'bg-emerald-100 text-emerald-500' : 'bg-gray-100 text-gray-400'} label={isTr ? 'Ses' : 'Sound'} sub={soundOn ? (isTr ? 'Acik' : 'On') : (isTr ? 'Kapali' : 'Off')}
            right={<Toggle checked={soundOn} onChange={toggleSound} />}
          />
          <SettingRow icon={<Gauge size={18} />} iconColor="bg-blue-100 text-blue-500" label={isTr ? 'Okuma Hizi' : 'TTS Speed'}
            right={
              <div className="flex bg-gray-100 rounded-full p-0.5">
                {(['slow', 'normal', 'fast'] as TtsSpeed[]).map(s => (
                  <button key={s} type="button" aria-label={`TTS speed: ${s}`} className={`px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${ttsSpeed === s ? 'bg-blue-500 text-white' : 'text-gray-500'}`} onClick={() => handleTtsSpeed(s)}>
                    {isTr ? (s === 'slow' ? 'Yavas' : s === 'fast' ? 'Hizli' : 'Normal') : (s === 'slow' ? 'Slow' : s === 'fast' ? 'Fast' : 'Normal')}
                  </button>
                ))}
              </div>
            }
          />
          <SettingRow icon={notifOn ? <Bell size={18} /> : <BellOff size={18} />} iconColor={notifOn ? 'bg-amber-100 text-amber-500' : 'bg-gray-100 text-gray-400'} label={isTr ? 'Bildirimler' : 'Notifications'}
            right={<Toggle checked={notifOn} onChange={handleNotifToggle} />}
          />
        </div>

        {/* Classroom */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{isTr ? 'Sinif' : 'Classroom'}</p>
        <div className="bg-white rounded-3xl shadow-sm mb-5 p-4">
          {classroomMembership ? (
            <div>
              <p className="text-sm font-bold text-gray-800">{isTr ? 'Aktif Sinif' : 'Active Classroom'}</p>
              <p className="text-xs text-gray-500 mt-1">{classroomMembership}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-gray-500">{isTr ? 'Ogretmeninizin verdigi kodu girin.' : 'Enter your teacher\'s join code.'}</p>
              <div className="flex gap-2">
                <input type="text" value={classroomCode} onChange={e => setClassroomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="AB3X7K" maxLength={6}
                  className="flex-1 min-h-[48px] px-3 text-sm font-mono tracking-widest bg-gray-50 border border-gray-200 rounded-2xl focus:border-blue-400 focus:outline-none"
                />
                <button type="button" onClick={handleJoinClassroom} disabled={classroomJoining || classroomCode.length < 6}
                  className="min-h-[48px] px-4 bg-blue-500 text-white text-sm font-bold rounded-2xl disabled:opacity-40"
                >{classroomJoining ? '...' : (isTr ? 'Katil' : 'Join')}</button>
              </div>
            </div>
          )}
        </div>

        {/* Account */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{isTr ? 'Hesap' : 'Account'}</p>
        <div className="bg-white rounded-3xl shadow-sm mb-5 divide-y divide-gray-50">
          <Link to="/profile" className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
            <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-500 flex items-center justify-center"><User size={18} /></div>
            <p className="flex-1 text-sm font-semibold text-gray-800">{isTr ? 'Profil' : 'Profile'}</p>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>

          {isEmailUser && (
            <>
              <button type="button" aria-label={isTr ? 'Sifre degistir' : 'Change password'} onClick={() => setShowPwForm(v => !v)} className="flex items-center gap-3 px-4 py-3 min-h-[56px] w-full text-left">
                <div className="w-9 h-9 rounded-2xl bg-blue-100 text-blue-500 flex items-center justify-center"><Lock size={18} /></div>
                <p className="flex-1 text-sm font-semibold text-gray-800">{isTr ? 'Sifre Degistir' : 'Change Password'}</p>
                <ChevronRight size={18} className={`text-gray-300 transition-transform ${showPwForm ? 'rotate-90' : ''}`} />
              </button>
              {showPwForm && (
                <div className="px-4 py-3 flex flex-col gap-2">
                  <div className="relative">
                    <input type={showCurrentPw ? 'text' : 'password'} value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder={isTr ? 'Mevcut sifre' : 'Current password'} autoComplete="current-password"
                      className="w-full min-h-[48px] px-4 pr-10 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-blue-400 focus:outline-none" />
                    <button type="button" aria-label={showCurrentPw ? (isTr ? 'Sifreyi gizle' : 'Hide password') : (isTr ? 'Sifreyi goster' : 'Show password')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowCurrentPw(v => !v)}>{showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <div className="relative">
                    <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} placeholder={isTr ? 'Yeni sifre (6+ karakter)' : 'New password (6+ chars)'} autoComplete="new-password"
                      className="w-full min-h-[48px] px-4 pr-10 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-blue-400 focus:outline-none" />
                    <button type="button" aria-label={showNewPw ? (isTr ? 'Sifreyi gizle' : 'Hide password') : (isTr ? 'Sifreyi goster' : 'Show password')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" onClick={() => setShowNewPw(v => !v)}>{showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                  </div>
                  <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder={isTr ? 'Sifre tekrar' : 'Confirm password'} autoComplete="new-password"
                    className="w-full min-h-[48px] px-4 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-blue-400 focus:outline-none" />
                  <button type="button" aria-label={isTr ? 'Sifreyi guncelle' : 'Update password'} onClick={handlePasswordChange} disabled={pwLoading || !currentPw || !newPw || !confirmPw}
                    className="min-h-[48px] bg-blue-500 text-white text-sm font-bold rounded-2xl disabled:opacity-40">
                    {pwLoading ? (isTr ? 'Degistiriliyor...' : 'Updating...') : (isTr ? 'Sifreyi Guncelle' : 'Update Password')}
                  </button>
                </div>
              )}
            </>
          )}

          <button type="button" aria-label={isTr ? 'Cikis yap' : 'Sign out'} onClick={handleSignOut} className="flex items-center gap-3 px-4 py-3 min-h-[56px] w-full text-left">
            <div className="w-9 h-9 rounded-2xl bg-red-100 text-red-500 flex items-center justify-center"><LogOut size={18} /></div>
            <p className="flex-1 text-sm font-semibold text-red-500">{isTr ? 'Cikis Yap' : 'Sign Out'}</p>
          </button>
        </div>

        {/* Data & Legal */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{isTr ? 'Veri ve Yasal' : 'Data & Legal'}</p>
        <div className="bg-white rounded-3xl shadow-sm mb-5 divide-y divide-gray-50">
          <button type="button" aria-label={isTr ? 'Verilerimi indir' : 'Export my data'} onClick={handleExportData} disabled={exportLoading} className="flex items-center gap-3 px-4 py-3 min-h-[56px] w-full text-left">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-500 flex items-center justify-center"><Download size={18} /></div>
            <p className="flex-1 text-sm font-semibold text-gray-800">{exportLoading ? (isTr ? 'Hazirlaniyor...' : 'Preparing...') : (isTr ? 'Verilerimi Indir' : 'Export My Data')}</p>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
          <Link to="/privacy" className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
            <div className="w-9 h-9 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center"><Shield size={18} /></div>
            <p className="flex-1 text-sm font-semibold text-gray-800">{isTr ? 'Gizlilik Politikasi' : 'Privacy Policy'}</p>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
          <Link to="/terms" className="flex items-center gap-3 px-4 py-3 min-h-[56px]">
            <div className="w-9 h-9 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center"><Shield size={18} /></div>
            <p className="flex-1 text-sm font-semibold text-gray-800">{isTr ? 'Kullanim Kosullari' : 'Terms of Service'}</p>
            <ChevronRight size={18} className="text-gray-300" />
          </Link>
        </div>

        {/* Delete */}
        {deleteStep === 'idle' && (
          <button type="button" aria-label={isTr ? 'Hesabimi sil' : 'Delete my account'} onClick={() => setDeleteStep('confirm')} className="w-full text-center text-xs text-red-400 min-h-[48px]">
            <Trash2 size={12} className="inline mr-1" /> {isTr ? 'Hesabimi Sil' : 'Delete My Account'}
          </button>
        )}
        {(deleteStep === 'confirm' || deleteStep === 'deleting') && (
          <div className="bg-red-50 rounded-3xl p-4 flex flex-col gap-2">
            <p className="text-xs text-red-600">{isTr ? 'Hesabiniz kalici olarak silinecek. Onaylamak icin "SIL" yazin.' : 'Type "DELETE" to confirm permanent deletion.'}</p>
            <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder={isTr ? 'SIL' : 'DELETE'} disabled={deleteStep === 'deleting'}
              className="min-h-[48px] px-4 bg-white rounded-2xl text-sm border border-red-200 focus:border-red-400 focus:outline-none" />
            <div className="flex gap-2">
              <button type="button" aria-label={isTr ? 'Vazgec' : 'Cancel'} onClick={() => { setDeleteStep('idle'); setDeleteConfirmText(''); }} disabled={deleteStep === 'deleting'}
                className="flex-1 min-h-[48px] bg-gray-100 text-gray-600 text-sm font-bold rounded-2xl">{isTr ? 'Vazgec' : 'Cancel'}</button>
              <button type="button" aria-label={isTr ? 'Hesabi sil' : 'Delete account'} onClick={handleDeleteAccount} disabled={deleteStep === 'deleting'}
                className="flex-1 min-h-[48px] bg-red-500 text-white text-sm font-bold rounded-2xl">
                {deleteStep === 'deleting' ? (isTr ? 'Siliniyor...' : 'Deleting...') : (isTr ? 'Sil' : 'Delete')}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
