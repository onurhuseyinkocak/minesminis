import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { LS_COOKIE_CONSENT } from '../config/storageKeys';
import './CookieBanner.css';

type ConsentValue = 'accepted' | 'declined';

function readConsent(): ConsentValue | null {
  try {
    const val = localStorage.getItem(LS_COOKIE_CONSENT);
    if (val === 'accepted' || val === 'declined') return val;
  } catch {
    // Private browsing / storage blocked — treat as no consent
  }
  return null;
}

function writeConsent(val: ConsentValue) {
  try {
    localStorage.setItem(LS_COOKIE_CONSENT, val);
  } catch {
    // ignore
  }
}

const SLIDE_VARIANTS = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

export default function CookieBanner() {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if no decision has been stored yet
    if (readConsent() === null) {
      // Small delay so the UI is fully rendered before the banner pops in
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const handleAccept = () => {
    writeConsent('accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    writeConsent('declined');
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cookie-banner"
          role="dialog"
          aria-modal="false"
          aria-label={lang === 'tr' ? 'Çerez onayı' : 'Cookie consent'}
          variants={SLIDE_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="cookie-banner__inner">
            <p className="cookie-banner__text">
              {lang === 'tr' ? (
                <>
                  MinesMinis, deneyiminizi iyileştirmek ve KVKK ile GDPR kapsamındaki analitik amaçlarla
                  çerezler kullanmaktadır.{' '}
                  <Link to="/cookies" className="cookie-banner__link">
                    Çerez Politikası
                  </Link>
                </>
              ) : (
                <>
                  MinesMinis uses cookies to improve your experience and for analytics purposes under GDPR &amp; KVKK.{' '}
                  <Link to="/cookies" className="cookie-banner__link">
                    Cookie Policy
                  </Link>
                </>
              )}
            </p>
            <div className="cookie-banner__actions">
              <button
                className="cookie-banner__btn cookie-banner__btn--decline"
                onClick={handleDecline}
                type="button"
              >
                {lang === 'tr' ? 'Reddet' : 'Decline'}
              </button>
              <button
                className="cookie-banner__btn cookie-banner__btn--accept"
                onClick={handleAccept}
                type="button"
              >
                {lang === 'tr' ? 'Kabul Et' : 'Accept All'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
