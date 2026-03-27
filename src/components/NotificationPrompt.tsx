import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import './NotificationPrompt.css';

// ─── Bell SVG ─────────────────────────────────────────────────────────────────

function BellIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface NotificationPromptProps {
  onAccept: () => void;
  onDecline: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function NotificationPrompt({ onAccept, onDecline }: NotificationPromptProps) {
  const { lang } = useLanguage();

  return (
    <AnimatePresence>
      <motion.div
        className="notif-prompt-sheet"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notif-prompt-title"
      >
        {/* Drag handle (cosmetic) */}
        <div className="notif-prompt-handle" aria-hidden="true" />

        {/* Close button — 44px touch target, always dismissible */}
        <button
          type="button"
          className="notif-prompt-close"
          onClick={onDecline}
          aria-label={lang === 'tr' ? 'Kapat' : 'Close'}
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="notif-prompt-body">
          <div className="notif-prompt-icon">
            <BellIcon />
          </div>

          <div className="notif-prompt-text">
            <p id="notif-prompt-title" className="notif-prompt-title">
              {lang === 'tr' ? 'Streak hatırlatıcılarını aç' : 'Enable streak reminders'}
            </p>
            <p className="notif-prompt-subtitle">
              {lang === 'tr' ? 'Her gün 20:00\'de hatırlatırız' : 'We\'ll remind you daily at 8 PM'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="notif-prompt-actions">
          <button
            className="notif-prompt-btn notif-prompt-btn--primary"
            onClick={onAccept}
            type="button"
          >
            {lang === 'tr' ? 'Evet, aç' : 'Yes, enable'}
          </button>
          <button
            className="notif-prompt-btn notif-prompt-btn--ghost"
            onClick={onDecline}
            type="button"
          >
            {lang === 'tr' ? 'Hayır' : 'No, thanks'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
