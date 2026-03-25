import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Check, LogIn, UserPlus, Mail, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button, Input, Tabs } from '../components/ui';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import './Login.css';

type Lang = 'en' | 'tr';

const content = {
  en: {
    title: 'Welcome Back',
    titleJoin: 'Create Account',
    sub: 'Sign in to continue your adventure.',
    subJoin: 'Join MinesMinis and start learning!',
    tabLogin: 'Sign In',
    tabJoin: 'Create Account',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    passwordHint: 'At least 6 characters',
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
    sideTagline: 'English learning that works',
    featurePhonics: '42 phonics sounds',
    featureMethod: 'Research-backed method',
    featureFree: 'Free to start',
  },
  tr: {
    title: 'Tekrar Hoşgeldin',
    titleJoin: 'Hesap Oluştur',
    sub: 'Macerana devam etmek için giriş yap.',
    subJoin: "MinesMinis'e katıl ve öğrenmeye başla!",
    tabLogin: 'Giriş Yap',
    tabJoin: 'Kayıt Ol',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Tekrar',
    passwordHint: 'En az 6 karakter',
    submitLogin: 'Giriş Yap',
    submitJoin: 'Hesap Oluştur',
    or: 'veya',
    googleBtn: 'Google ile devam et',
    hintLogin: 'Hesabın yok mu?',
    hintJoin: 'Zaten hesabın var mı?',
    signUp: 'Kayıt ol',
    login: 'Giriş yap',
    errorPasswordMatch: 'Şifreler eşleşmiyor',
    errorAlreadyRegistered: 'Bu e-posta zaten kayıtlı. Lütfen giriş yapın.',
    errorInvalidLogin: 'Geçersiz e-posta veya şifre.',
    errorGeneric: 'Bir hata oluştu. Lütfen tekrar deneyin.',
    forgotPassword: 'Şifremi unuttum?',
    resetSent: 'Şifre sıfırlama e-postası gönderildi!',
    resetEmailLabel: 'E-posta adresinizi girin',
    sendResetLink: 'Sıfırlama Linki Gönder',
    backToLogin: 'Girişe dön',
    sideTagline: 'İşe yarayan İngilizce eğitimi',
    featurePhonics: '42 fonetik ses',
    featureMethod: 'Araştırmaya dayalı yöntem',
    featureFree: 'Ücretsiz başlangıç',
  },
};

const Login: React.FC = () => {
  const [lang, setLang] = useState<Lang>('tr');
  const t = content[lang];
  const [searchParams] = useSearchParams();

  const [isLogin, setIsLogin] = useState(() => searchParams.get('tab') !== 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast.error(lang === 'tr' ? 'Email adresi giriniz' : 'Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      toast.success(t.resetSent);
      setResetMode(false);
      setResetEmail('');
    } catch {
      toast.error(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        const code = (error as { code?: string }).code;
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          // User closed popup, silently ignore
        } else if (code === 'auth/network-request-failed') {
          setError(lang === 'en' ? 'Network error. Check your internet connection.' : 'Ağ hatası. İnternet bağlantınızı kontrol edin.');
        } else if (code === 'auth/user-disabled') {
          setError(lang === 'en' ? 'This account has been disabled. Contact support.' : 'Bu hesap devre dışı bırakıldı. Destekle iletişime geçin.');
        } else {
          setError(t.errorGeneric);
        }
      }
    } catch {
      setError(t.errorGeneric);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError(t.errorPasswordMatch);
      return;
    }

    setLoading(true);
    try {
      const { error } = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        const code = (error as { code?: string }).code ?? '';
        const msg = error.message ?? '';
        if (
          code === 'auth/email-already-in-use' ||
          msg.includes('already registered') ||
          msg.includes('already exists')
        ) {
          setError(t.errorAlreadyRegistered);
          setIsLogin(true);
        } else if (
          code === 'auth/invalid-credential' ||
          code === 'auth/wrong-password' ||
          code === 'auth/user-not-found' ||
          msg.includes('Invalid login credentials')
        ) {
          setError(t.errorInvalidLogin);
        } else if (code === 'auth/too-many-requests') {
          setError(lang === 'en' ? 'Too many attempts. Please try again later.' : 'Çok fazla deneme. Lütfen daha sonra tekrar deneyin.');
        } else if (code === 'auth/weak-password') {
          setError(lang === 'en' ? 'Password is too weak. Use at least 6 characters.' : 'Şifre çok zayıf. En az 6 karakter kullanın.');
        } else if (code === 'auth/invalid-email') {
          setError(lang === 'en' ? 'Invalid email address.' : 'Geçersiz e-posta adresi.');
        } else if (code === 'auth/network-request-failed') {
          setError(lang === 'en' ? 'Network error. Check your internet connection.' : 'Ağ hatası. İnternet bağlantınızı kontrol edin.');
        } else if (code === 'auth/user-disabled') {
          setError(lang === 'en' ? 'This account has been disabled. Contact support.' : 'Bu hesap devre dışı bırakıldı. Destekle iletişime geçin.');
        } else {
          setError(msg || t.errorGeneric);
        }
      }
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? '';
      if (code === 'auth/email-already-in-use' || (err instanceof Error && err.message?.includes('already registered'))) {
        setError(t.errorAlreadyRegistered);
        setIsLogin(true);
      } else {
        setError(t.errorGeneric);
      }
    } finally {
      setLoading(false);
    }
  };

  const activeTab = isLogin ? 'login' : 'signup';
  const tabs = [
    { id: 'login', label: t.tabLogin },
    { id: 'signup', label: t.tabJoin },
  ];

  const features = [
    t.featurePhonics,
    t.featureMethod,
    t.featureFree,
  ];

  return (
    <div className="login-page">
      {/* Back to landing */}
      <Link to="/" className="login-back-btn">
        <ArrowLeft size={18} />
        <span>{lang === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
      </Link>

      {/* Language toggle */}
      <div className="login-lang-toggle">
        <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
        <span className="login-lang-divider" />
        <button type="button" className={lang === 'tr' ? 'active' : ''} onClick={() => setLang('tr')}>TR</button>
      </div>

      <motion.div
        className="login-container"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Side Panel */}
        <div className="login-side">
          <div className="login-side-content">
            <h1 className="login-side-brand">MinesMinis</h1>
            <p className="login-side-tagline">{t.sideTagline}</p>
            <ul className="login-side-features">
              {features.map((feat, i) => (
                <li key={i} className="login-side-feature">
                  <span className="login-side-feature-icon">
                    <Check size={16} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Form Panel */}
        <div className="login-form-panel">
          <div className="login-header">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h2>{isLogin ? t.title : t.titleJoin}</h2>
                <p>{isLogin ? t.sub : t.subJoin}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="login-tabs">
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              onChange={(id) => {
                setIsLogin(id === 'login');
                setError('');
              }}
              variant="underline"
            />
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <Input
              label={t.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              icon={<Mail size={18} />}
              size="lg"
              autoComplete="email"
            />

            <Input
              label={t.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
              minLength={6}
              icon={<Lock size={18} />}
              size="lg"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />

            {isLogin && !resetMode && (
              <button
                type="button"
                className="login-forgot-link"
                onClick={() => { setResetMode(true); setResetEmail(email); setError(''); }}
              >
                {t.forgotPassword}
              </button>
            )}

            {resetMode && (
              <div className="login-reset-box">
                <Input
                  label={t.resetEmailLabel}
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={loading}
                  icon={<Mail size={18} />}
                  size="lg"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  onClick={handlePasswordReset}
                >
                  {t.sendResetLink}
                </Button>
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={() => setResetMode(false)}
                >
                  {t.backToLogin}
                </button>
              </div>
            )}

            {!isLogin && (
              <>
                <Input
                  label={t.confirmPassword}
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                  icon={<Lock size={18} />}
                  size="lg"
                  autoComplete="new-password"
                />
                <span className="login-password-hint">{t.passwordHint}</span>
              </>
            )}

            {error && (
              <div className="login-error" role="alert">
                <AlertCircle size={16} className="login-error-icon" />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              icon={isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            >
              {isLogin ? t.submitLogin : t.submitJoin}
            </Button>

            <div className="login-divider"><span>{t.or}</span></div>

            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="login-google-spinner" aria-hidden="true" style={{
                  display: 'inline-block', width: 20, height: 20, border: '2px solid #ccc',
                  borderTopColor: '#4285F4', borderRadius: '50%',
                  animation: 'spin 0.6s linear infinite',
                }} />
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden>
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {t.googleBtn}
            </button>

            <p className="login-toggle">
              {isLogin ? (
                <>{t.hintLogin}{' '}<button type="button" onClick={() => { setIsLogin(false); setError(''); }}>{t.signUp}</button></>
              ) : (
                <>{t.hintJoin}{' '}<button type="button" onClick={() => { setIsLogin(true); setError(''); }}>{t.login}</button></>
              )}
            </p>
          </form>

          <p style={{ fontSize: '12px', color: 'var(--text-muted, #888)', textAlign: 'center', marginTop: '16px', lineHeight: 1.5 }}>
            {lang === 'tr' ? (
              <>Kayıt olarak, <Link to="/terms" style={{ color: 'var(--text-muted, #888)', textDecoration: 'underline' }}>Kullanım Şartları</Link> ve <Link to="/privacy" style={{ color: 'var(--text-muted, #888)', textDecoration: 'underline' }}>Gizlilik Politikası</Link>'nı kabul etmiş olursunuz.</>
            ) : (
              <>By signing up, you agree to our <Link to="/terms" style={{ color: 'var(--text-muted, #888)', textDecoration: 'underline' }}>Terms of Service</Link> and <Link to="/privacy" style={{ color: 'var(--text-muted, #888)', textDecoration: 'underline' }}>Privacy Policy</Link>.</>
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
