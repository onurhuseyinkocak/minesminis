import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const APP_NAME = 'MinesMinis';

export function usePageTitle(titleTR: string, titleEN?: string) {
  const { lang } = useLanguage();
  useEffect(() => {
    const title = lang === 'tr' ? titleTR : (titleEN ?? titleTR);
    document.title = `${title} — ${APP_NAME}`;
    return () => { document.title = APP_NAME; };
  }, [titleTR, titleEN, lang]);
}
