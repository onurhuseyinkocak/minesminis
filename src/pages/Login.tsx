import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus, Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import { analytics } from '../services/analytics';
import { useLanguage } from '../contexts/LanguageContext';
import LottieCharacter from '../components/LottieCharacter';

const content = {
  en: {
    title: 'Welcome Back',
    titleJoin: 'Create Account',
    sub: 'Sign in to continue your adventure.',
    subJoin: 'Join MinesMinis and start learning!',
    tabLogin: 'Sign In',
    tabJoin: 'Sign Up',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordHint: 'At least 8 characters',
    submitLogin: 'Sign In',
    submitJoin: 'Create Account',
    or: 'or',
    googleBtn: 'Continue with Google',
    hintLogin: "Don't have an account?",
    hintJoin: 'Already have an account?',
    signUp: 'Sign up',
    login: 'Sign in',
    errorPasswordMatch: 'Passwords do not match',
    errorAlreadyRegistered: 'This email is already registered. Please sign in.',
    errorInvalidLogin: 'Invalid email or password.',
    errorGeneric: 'An error occurred. Please try again.',
    forgotPassword: 'Forgot password?',
    resetSent: 'Password reset email sent!',
    resetEmailLabel: 'Enter your email',
    sendResetLink: 'Send Reset Link',
    backToLogin: 'Back to login',
    coppaConsent: 'I am a parent or guardian aged 18 or over, and I agree to create this account on behalf of my child.',
    errorCoppaConsent: 'You must confirm you are a parent or guardian aged 18 or over to create an account.',
  },
  tr: {
    title: 'Tekrar Hosgeldin',
    titleJoin: 'Hesap Olustur',
    sub: 'Macerana devam etmek icin giris yap.',
    subJoin: "MinesMinis'e katil ve ogrenmeye basla!",
    tabLogin: 'Giris Yap',
    tabJoin: 'Kayit Ol',
    email: 'E-posta',
    password: 'Sifre',
    confirmPassword: 'Sifre Tekrar',
    passwordHint: 'En az 8 karakter',
    submitLogin: 'Giris Yap',
    submitJoin: 'Hesap Olustur',
    or: 'veya',
    googleBtn: 'Google ile devam et',
    hintLogin: 'Hesabin yok mu?',
    hintJoin: 'Zaten hesabin var mi?',
    signUp: 'Kayit ol',
    login: 'Giris yap',
    errorPasswordMatch: 'Sifreler eslesmiyor',
    errorAlreadyRegistered: 'Bu e-posta zaten kayitli. Lutfen giris yapin.',
    errorInvalidLogin: 'Gecersiz e-posta veya sifre.',
    errorGeneric: 'Bir hata olustu. Lutfen tekrar deneyin.',
    forgotPassword: 'Sifremi unuttum?',
    resetSent: 'Sifre sifirlama e-postasi gonderildi!',
    resetEmailLabel: 'E-posta adresinizi girin',
    sendResetLink: 'Sifirlama Linki Gonder',
    backToLogin: 'Girise don',
    coppaConsent: '18 yasindan buyuk bir ebeveyn veya vasisiyim ve bu hesabi cocugum adina olusturmayi kabul ediyorum.',
    errorCoppaConsent: 'Hesap olusturmak icin 18 yasindan buyuk bir ebeveyn veya vasi oldugunuzu onaylamaniz gerekir.',
  },
};

const Login: React.FC = () => {
  const { lang, setLang } = useLanguage();
  const t = content[lang];
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    document.title = lang === 'tr' ? 'Giris Yap -- MinesMinis' : 'Login -- MinesMinis';
    return () => { document.title = 'MinesMinis'; };
  }, [lang]);

  const [isLogin, setIsLogin] = useState(() => searchParams.get('tab') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [coppaConsent, setCoppaConsent] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handlePasswordReset = async () => {
    if (loading) return;
    if (!resetEmail.trim()) { toast.error(lang === 'tr' ? 'Email adresi giriniz' : 'Please enter your email'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail.trim())) { toast.error(lang === 'tr' ? 'Gecersiz e-posta adresi' : 'Invalid email address'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success(t.resetSent);
      setResetMode(false); setResetEmail('');
    } catch { toast.error(t.errorGeneric); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    if (loading) return;
    setError(''); setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        const code = (error as { code?: string }).code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') { /* ignore */ }
        else if (code === 'auth/network-request-failed') setError(lang === 'en' ? 'Network error.' : 'Ag hatasi.');
        else setError(t.errorGeneric);
      } else { analytics.login('google'); }
    } catch { setError(t.errorGeneric); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    if (!isLogin && password !== confirmPassword) { setError(t.errorPasswordMatch); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) { setError(lang === 'en' ? 'Invalid email address.' : 'Gecersiz e-posta adresi.'); return; }
    if (!isLogin && password.length < 8) { setError(lang === 'en' ? 'Password must be at least 8 characters.' : 'Sifre en az 8 karakter olmalidir.'); return; }
    if (!isLogin && !coppaConsent) { setError(t.errorCoppaConsent); return; }

    setLoading(true);
    try {
      const { error } = isLogin ? await signIn(email, password) : await signUp(email, password);
      if (!error) {
        if (isLogin) analytics.login('email'); else analytics.signup('email');
      } else {
        const code = (error as { code?: string }).code ?? '';
        const msg = error.message ?? '';
        if (code === 'auth/email-already-in-use' || msg.includes('already registered') || msg.includes('already exists')) {
          setError(t.errorAlreadyRegistered); setIsLogin(true);
        } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found' || msg.includes('Invalid login credentials')) {
          setError(t.errorInvalidLogin);
        } else if (code === 'auth/too-many-requests') {
          setError(lang === 'en' ? 'Too many attempts. Please try again later.' : 'Cok fazla deneme.');
        } else if (code === 'auth/weak-password') {
          setError(lang === 'en' ? 'Password is too weak.' : 'Sifre cok zayif.');
        } else { setError(msg || t.errorGeneric); }
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use' || (err instanceof Error && err.message?.includes('already registered'))) {
        setError(t.errorAlreadyRegistered); setIsLogin(true);
      } else { setError(t.errorGeneric); }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex flex-col items-center px-4 py-6">
      {/* Top bar */}
      <div className="w-full max-w-sm flex items-center justify-between mb-6">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 min-h-[48px]">
          <ArrowLeft size={18} />
          <span>{lang === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
        </Link>
        <div className="flex bg-white rounded-full p-1 shadow-sm">
          <button
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            type="button"
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${lang === 'tr' ? 'bg-orange-500 text-white' : 'text-gray-500'}`}
            onClick={() => setLang('tr')}
          >TR</button>
        </div>
      </div>

      {/* Mimi mascot */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="mb-4"
      >
        <LottieCharacter state="wave" size={100} />
      </motion.div>

      {/* Card */}
      <motion.div
        className="w-full max-w-sm bg-white rounded-3xl shadow-lg p-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', damping: 20, stiffness: 250 }}
      >
        {/* Title */}
        <AnimatePresence mode="wait">
          <motion.div key={isLogin ? 'login' : 'signup'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center mb-5">
            <h2 className="text-xl font-bold text-gray-800">{isLogin ? t.title : t.titleJoin}</h2>
            <p className="text-sm text-gray-500 mt-1">{isLogin ? t.sub : t.subJoin}</p>
          </motion.div>
        </AnimatePresence>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-3xl p-1 mb-5">
          <button
            type="button"
            className={`flex-1 min-h-[48px] rounded-3xl text-sm font-bold transition-all ${isLogin ? 'bg-orange-500 text-white shadow' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >{t.tabLogin}</button>
          <button
            type="button"
            className={`flex-1 min-h-[48px] rounded-3xl text-sm font-bold transition-all ${!isLogin ? 'bg-orange-500 text-white shadow' : 'text-gray-500'}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >{t.tabJoin}</button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Email */}
          <div className="relative">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email" name="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" required disabled={loading} autoComplete="email"
              className="w-full min-h-[48px] pl-11 pr-4 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-orange-400 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'} name="password" value={password}
              onChange={e => setPassword(e.target.value)} placeholder="********"
              required disabled={loading} minLength={8}
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              className="w-full min-h-[48px] pl-11 pr-12 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-orange-400 focus:outline-none"
            />
            <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8 flex items-center justify-center" onClick={() => setShowPassword(v => !v)}>
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Forgot password */}
          {isLogin && !resetMode && (
            <button type="button" className="text-xs text-orange-500 font-medium text-right" onClick={() => { setResetMode(true); setResetEmail(email); setError(''); }}>
              {t.forgotPassword}
            </button>
          )}

          {/* Reset mode */}
          {resetMode && (
            <div className="bg-orange-50 rounded-2xl p-4 flex flex-col gap-2">
              <input
                type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                placeholder="you@example.com" required disabled={loading}
                className="w-full min-h-[48px] px-4 bg-white rounded-2xl text-sm border border-gray-200 focus:border-orange-400 focus:outline-none"
              />
              <button type="button" className="min-h-[48px] bg-orange-500 text-white text-sm font-bold rounded-2xl" onClick={handlePasswordReset} disabled={loading}>
                {t.sendResetLink}
              </button>
              <button type="button" className="text-xs text-gray-500" onClick={() => setResetMode(false)}>
                {t.backToLogin}
              </button>
            </div>
          )}

          {/* Confirm password + COPPA */}
          {!isLogin && (
            <>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'} name="confirm-password"
                  value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="********" required disabled={loading} minLength={8} autoComplete="new-password"
                  className="w-full min-h-[48px] pl-11 pr-12 bg-gray-50 rounded-2xl text-sm border border-gray-200 focus:border-orange-400 focus:outline-none"
                />
                <button type="button" aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-8 h-8 flex items-center justify-center" onClick={() => setShowConfirmPassword(v => !v)}>
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-[11px] text-gray-400">{t.passwordHint}</p>
              <label className="flex items-start gap-2.5 cursor-pointer text-[12px] text-gray-500 leading-relaxed">
                <input
                  type="checkbox" checked={coppaConsent} onChange={e => setCoppaConsent(e.target.checked)}
                  disabled={loading} required className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0"
                />
                <span>{t.coppaConsent}</span>
              </label>
            </>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 text-red-600 text-xs rounded-2xl p-3" role="alert">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="min-h-[48px] bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>{isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}</>
            )}
            {isLogin ? t.submitLogin : t.submitJoin}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">{t.or}</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Google */}
        <button
          type="button" onClick={handleGoogleLogin} disabled={loading}
          className="w-full min-h-[48px] flex items-center justify-center gap-2 bg-white border border-gray-200 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t.googleBtn}
        </button>

        {/* Toggle */}
        <p className="text-center text-xs text-gray-500 mt-4">
          {isLogin ? (
            <>{t.hintLogin}{' '}<button type="button" className="text-orange-500 font-bold" onClick={() => { setIsLogin(false); setError(''); }}>{t.signUp}</button></>
          ) : (
            <>{t.hintJoin}{' '}<button type="button" className="text-orange-500 font-bold" onClick={() => { setIsLogin(true); setError(''); }}>{t.login}</button></>
          )}
        </p>

        {/* Legal */}
        <p className="text-center text-[10px] text-gray-400 mt-3 leading-relaxed">
          {lang === 'tr' ? (
            <>Kayit olarak, <Link to="/terms" className="underline">Kullanim Sartlari</Link> ve <Link to="/privacy" className="underline">Gizlilik Politikasi</Link>'ni kabul etmis olursunuz.</>
          ) : (
            <>By signing up, you agree to our <Link to="/terms" className="underline">Terms</Link> and <Link to="/privacy" className="underline">Privacy Policy</Link>.</>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
