import { useState, useEffect } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";
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
    <div className="install-banner" role="banner" aria-label="Uygulama kurulum bildirimi">
      <div className="install-banner__icon" aria-hidden="true">
        MM
      </div>

      <div className="install-banner__content">
        {isIOS ? (
          <>
            <span className="install-banner__title">Uygulamayı Yükle</span>
            <span className="install-banner__subtitle">
              <ShareIcon />
              Paylaş &rsaquo; Ana Ekrana Ekle
            </span>
          </>
        ) : (
          <>
            <span className="install-banner__title">Uygulamayı Yükle</span>
            <span className="install-banner__subtitle">Ana ekrana ekle, hızlıca aç</span>
          </>
        )}
      </div>

      {!isIOS && (
        <button
          className="install-banner__install-btn"
          onClick={handleInstall}
          disabled={installing}
          aria-label="Uygulamayı yükle"
        >
          {installing ? "..." : "Yükle"}
        </button>
      )}

      <button
        className="install-banner__dismiss-btn"
        onClick={handleDismiss}
        aria-label="Bildirimi kapat"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
