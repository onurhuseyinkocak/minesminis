import { useRef, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import './OfflineBanner.css';

// Wifi-off icon
function IconOffline() {
  return (
    <svg
      className="offline-banner__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
      <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
      <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
      <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

// Wifi icon
function IconOnline() {
  return (
    <svg
      className="offline-banner__icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" />
    </svg>
  );
}

const SLIDE_VARIANTS = {
  hidden: { y: '-100%', opacity: 0 },
  visible: { y: 0, opacity: 1 },
  exit: { y: '-100%', opacity: 0 },
};

const TRANSITION = { duration: 0.3, ease: 'easeInOut' };

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const wasOffline = useRef(false);
  const [showBackOnline, setShowBackOnline] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStatusChange = useCallback((online: boolean) => {
    if (online && wasOffline.current) {
      setShowBackOnline(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowBackOnline(false), 3000);
    }
    wasOffline.current = !online;
  }, []);

  useEffect(() => {
    handleStatusChange(isOnline);
  }, [isOnline, handleStatusChange]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const showBanner = !isOnline || showBackOnline;

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          key={showBackOnline ? 'back-online' : 'offline'}
          className={`offline-banner ${showBackOnline ? 'offline-banner--online' : 'offline-banner--offline'}`}
          role="status"
          aria-live="polite"
          variants={SLIDE_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={TRANSITION}
        >
          {showBackOnline ? (
            <>
              <IconOnline />
              <span>Back online!</span>
            </>
          ) : (
            <>
              <IconOffline />
              <span>Çevrimdışısın — bazı özellikler çalışmayabilir</span>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
