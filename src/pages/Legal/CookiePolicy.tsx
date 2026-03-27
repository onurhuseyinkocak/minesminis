import React from 'react';
import { Cookie, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicLayout from '../../components/layout/PublicLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import './LegalPages.css';

const CookiePolicy: React.FC = () => {
  const { t, lang } = useLanguage();
  usePageTitle('Çerez Politikası', 'Cookie Policy');

  return (
    <PublicLayout>
      <div className="legal-page">
        <div className="legal-container">
          <Link to="/" className="legal-back" aria-label={lang === 'tr' ? 'Geri dön' : 'Go back'}>
            <ChevronLeft size={20} aria-hidden="true" />
            {lang === 'tr' ? 'Geri' : 'Back'}
          </Link>
          <h1><Cookie size={28} /> {t('legal.cookiePolicy')}</h1>
          <p className="legal-updated">{t('legal.lastUpdated')}</p>

          <section>
            <h2>{t('legal.cookieWhatTitle')}</h2>
            <p>{t('legal.cookieWhatDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.cookieWeUseTitle')}</h2>
            <ul>
              <li><strong>{t('legal.cookieEssentialLabel')}</strong> {t('legal.cookieEssential')}</li>
              <li><strong>{t('legal.cookiePreferencesLabel')}</strong> {t('legal.cookiePreferences')}</li>
              <li><strong>{t('legal.cookieAnalyticsLabel')}</strong> {t('legal.cookieAnalytics')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.cookieThirdPartyTitle')}</h2>
            <p>{t('legal.cookieThirdPartyDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.cookieManageTitle')}</h2>
            <p>{t('legal.cookieManageDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.cookieContactTitle')}</h2>
            <p>{t('legal.cookieContactDesc')} <a href="mailto:privacy@minesminis.com">privacy@minesminis.com</a></p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default CookiePolicy;
