import { createContext, useContext, useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { translations, type Lang } from '../i18n';
import type { TranslationKeys } from '../i18n/en';

const STORAGE_KEY = 'mm_lang';

function detectDefaultLang(): Lang {
  // 1. Check localStorage
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'en' || stored === 'tr') return stored;

  // 2. Check browser language
  const browserLang = navigator.language?.toLowerCase() ?? '';
  if (browserLang.startsWith('tr')) return 'tr';

  // 3. Fallback
  return 'en';
}

/** Sync <html lang="..." dir="ltr"> with the active language. */
function applyLangToDocument(lang: Lang): void {
  document.documentElement.lang = lang;
  // MinesMinis supports only LTR languages (tr, en). RTL not planned.
  document.documentElement.dir = 'ltr';
}

/**
 * Resolve a dot-separated key path against a nested translations object.
 * e.g. getNestedValue(translations.en, 'dashboard.findLevel') => 'Find Your Level'
 */
function getNestedValue(obj: TranslationKeys, keyPath: string): string {
  const keys = keyPath.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return keyPath; // fallback: return the key itself
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : keyPath;
}

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectDefaultLang);

  // Apply initial lang to <html> on mount
  useEffect(() => {
    applyLangToDocument(lang);
  }, [lang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    try { localStorage.setItem(STORAGE_KEY, newLang); } catch { /* ignore */ }
    applyLangToDocument(newLang);
  }, []);

  const t = useCallback(
    (key: string): string => getNestedValue(translations[lang], key),
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}
