/**
 * ParentGate — adult verification modal for MinesMinis
 *
 * Shows a random addition problem (each operand 3–12, sum 13–24).
 * 3 wrong attempts → 10-second lockout.
 * On success the result is stored in sessionStorage so the gate
 * is skipped for the rest of the browser session.
 */
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import './ParentGate.css';

// ─── Session key ────────────────────────────────────────────────────────────
const SESSION_KEY = 'mm_parent_gate_passed';
const SESSION_TIMEOUT_KEY = 'mm_parent_gate_ts';

/** How long (ms) the parent gate pass is valid before auto-expiring back to child mode. */
const PARENT_SESSION_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes

/** Returns true if the gate was already passed and the 5-minute window has not expired. */
export function hasParentGatePassed(): boolean {
  if (sessionStorage.getItem(SESSION_KEY) !== '1') return false;
  try {
    const ts = parseInt(sessionStorage.getItem(SESSION_TIMEOUT_KEY) ?? '0', 10);
    if (!ts || Date.now() - ts > PARENT_SESSION_TIMEOUT_MS) {
      // Timeout expired — clear and force re-verification
      sessionStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_TIMEOUT_KEY);
      return false;
    }
  } catch {
    return false;
  }
  return true;
}

/** Clears the parent gate pass, forcing re-verification on next access. */
export function clearParentGatePass(): void {
  sessionStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_TIMEOUT_KEY);
}

// ─── Math problem helpers ────────────────────────────────────────────────────

interface MathProblem {
  a: number;
  b: number;
  answer: number;
}

function generateProblem(): MathProblem {
  // Each operand: 3–12. Guarantee sum 13–24.
  let a: number;
  let b: number;
  do {
    a = Math.floor(Math.random() * 10) + 3; // 3–12
    b = Math.floor(Math.random() * 10) + 3; // 3–12
  } while (a + b < 13 || a + b > 24);
  return { a, b, answer: a + b };
}

// ─── Component ───────────────────────────────────────────────────────────────

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 10;

export interface ParentGateProps {
  onSuccess: () => void;
  onCancel: () => void;
  /** Short description of what requires verification, shown to the user. */
  reason?: string;
}

export default function ParentGate({
  onSuccess,
  onCancel,
  reason,
}: ParentGateProps): React.ReactElement {
  const { lang } = useLanguage();

  const problem = useMemo(() => generateProblem(), []);

  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [lockSecondsLeft, setLockSecondsLeft] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLocked = lockSecondsLeft > 0;

  // Autofocus on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Countdown timer when locked
  useEffect(() => {
    if (lockSecondsLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setLockSecondsLeft(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Reset for a new attempt round
          setAttempts(0);
          setErrorMsg('');
          setValue('');
          setTimeout(() => inputRef.current?.focus(), 50);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockSecondsLeft]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (isLocked) return;

      const entered = parseInt(value, 10);

      if (isNaN(entered)) {
        setErrorMsg(
          lang === 'tr' ? 'Lütfen bir sayı girin.' : 'Please enter a number.'
        );
        return;
      }

      if (entered === problem.answer) {
        // Correct — store in session with timestamp and fire callback
        sessionStorage.setItem(SESSION_KEY, '1');
        sessionStorage.setItem(SESSION_TIMEOUT_KEY, String(Date.now()));
        onSuccess();
        return;
      }

      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setValue('');

      if (newAttempts >= MAX_ATTEMPTS) {
        setErrorMsg('');
        setLockSecondsLeft(LOCK_SECONDS);
      } else {
        const remaining = MAX_ATTEMPTS - newAttempts;
        setErrorMsg(
          lang === 'tr'
            ? `Yanlış cevap. ${remaining} deneme hakkın kaldı.`
            : `Wrong answer. ${remaining} attempt${remaining !== 1 ? 's' : ''} left.`
        );
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    },
    [attempts, isLocked, lang, onSuccess, problem.answer, value]
  );

  // ── Labels (bilingual, no hook key needed for these short strings) ──────
  const labels = {
    title:      lang === 'tr' ? 'Ebeveyn Doğrulaması'     : 'Parent Check',
    subtitle:   lang === 'tr' ? 'Ebeveyne sor!'            : 'Ask a grown-up!',
    mathLabel:  lang === 'tr' ? 'Bu soruyu cevapla:'       : 'Answer this question:',
    inputLabel: lang === 'tr' ? 'Cevabınız'                : 'Your answer',
    submit:     lang === 'tr' ? 'Doğrula'                  : 'Verify',
    cancel:     lang === 'tr' ? 'Vazgeç'                   : 'Cancel',
    locked:     lang === 'tr'
      ? `Çok fazla deneme. ${lockSecondsLeft} saniye bekle...`
      : `Too many attempts. Wait ${lockSecondsLeft}s...`,
    attemptsLeft: lang === 'tr'
      ? `${MAX_ATTEMPTS - attempts} deneme hakkı`
      : `${MAX_ATTEMPTS - attempts} attempt${MAX_ATTEMPTS - attempts !== 1 ? 's' : ''} remaining`,
  };

  return (
    <div
      className="parent-gate-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
    >
      <div className="parent-gate-card">

        {/* Lock icon (SVG inline — no emoji, no external dep) */}
        <div className="parent-gate-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="parent-gate-title">{labels.title}</h2>
        <p className="parent-gate-subtitle">{labels.subtitle}</p>

        {reason && (
          <p className="parent-gate-reason">{reason}</p>
        )}

        {/* Math problem */}
        <div className="parent-gate-math">
          <p className="parent-gate-math-label">{labels.mathLabel}</p>
          <p className="parent-gate-math-problem">
            {problem.a} + {problem.b} = ?
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Input */}
          {!isLocked && (
            <div className="parent-gate-input-wrap">
              <label htmlFor="pg-answer" className="sr-only">
                {labels.inputLabel}
              </label>
              <input
                id="pg-answer"
                ref={inputRef}
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                className={`parent-gate-input${errorMsg ? ' parent-gate-input--error' : ''}`}
                value={value}
                onChange={e => { setValue(e.target.value); setErrorMsg(''); }}
                placeholder="?"
                autoComplete="off"
                aria-describedby={errorMsg ? 'pg-error' : undefined}
              />
            </div>
          )}

          {/* Error */}
          {!isLocked && errorMsg && (
            <p id="pg-error" className="parent-gate-error" role="alert">
              {errorMsg}
            </p>
          )}

          {/* Locked state */}
          {isLocked && (
            <p className="parent-gate-locked" role="alert">
              {labels.locked}
            </p>
          )}

          {/* Attempt counter (only visible before any wrong attempt but not locked) */}
          {!isLocked && attempts === 0 && (
            <p className="parent-gate-attempts">{labels.attemptsLeft}</p>
          )}

          {/* Actions */}
          <div className="parent-gate-actions">
            <button
              type="button"
              className="parent-gate-btn parent-gate-btn--cancel"
              onClick={onCancel}
            >
              {labels.cancel}
            </button>
            <button
              type="submit"
              className="parent-gate-btn parent-gate-btn--submit"
              disabled={isLocked || value.trim() === ''}
            >
              {labels.submit}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
