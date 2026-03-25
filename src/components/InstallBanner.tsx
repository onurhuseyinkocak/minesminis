import { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
import { useLanguage } from "../contexts/LanguageContext";
import "./InstallBanner.css";

const LS_KEY = "mm_install_dismissed";
const DISMISS_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ENGAGEMENT_DELAY_MS = 60 * 1000; // 60 seconds

function isDismissed(): boolean {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return false;
    const ts = parseInt(raw, 10);
    if (isNaN(ts)) return false;
    return Date.now() - ts < DISMISS_COOLDOWN_MS;
  } catch {
    return false;
  }
}

function saveDismiss(): void {
  try {
    localStorage.setItem(LS_KEY, String(Date.now()));
  } catch {
    // storage not available — silently ignore
  }
}

// Share icon SVG for iOS instructions
function ShareIcon() {
  return (
    <svg
      className="install-banner__share-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

export default function InstallBanner() {
  const { canInstall, isInstalled, isIOS, promptInstall } = usePWAInstall();
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [installing, setInstalling] = useState(false);

  const shouldShow = !isInstalled && !isDismissed() && (canInstall || isIOS);

  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, ENGAGEMENT_DELAY_MS);

    return () => clearTimeout(timer);
  }, [shouldShow]);

  const handleDismiss = () => {
    setVisible(false);
    saveDismiss();
  };

  const handleInstall = async () => {
    if (isIOS) return; // iOS: banner is informational only
    setInstalling(true);
    await promptInstall();
    setInstalling(false);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="install-banner" role="banner" aria-label={lang === 'tr' ? 'Uygulama kurulum bildirimi' : 'App install notification'}>
      <div className="install-banner__icon" aria-hidden="true">
        MM
      </div>

      <div className="install-banner__content">
        {isIOS ? (
          <>
            <span className="install-banner__title">
              {lang === 'tr' ? 'Uygulamayı Yükle' : 'Install App'}
            </span>
            <span className="install-banner__subtitle">
              <ShareIcon />
              {lang === 'tr' ? 'Paylaş > Ana Ekrana Ekle' : 'Share > Add to Home Screen'}
            </span>
          </>
        ) : (
          <>
            <span className="install-banner__title">
              {lang === 'tr' ? 'Uygulamayı Yükle' : 'Install App'}
            </span>
            <span className="install-banner__subtitle">
              {lang === 'tr' ? 'Ana ekrana ekle, hızlıca aç' : 'Add to home screen for quick access'}
            </span>
          </>
        )}
      </div>

      {!isIOS && (
        <button
          type="button"
          className="install-banner__install-btn"
          onClick={handleInstall}
          disabled={installing}
          aria-label={lang === 'tr' ? 'Uygulamayı yükle' : 'Install app'}
        >
          {installing ? '...' : (lang === 'tr' ? 'Yükle' : 'Install')}
        </button>
      )}

      <button
        type="button"
        className="install-banner__dismiss-btn"
        onClick={handleDismiss}
        aria-label={lang === 'tr' ? 'Bildirimi kapat' : 'Dismiss notification'}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
