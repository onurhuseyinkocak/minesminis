import { Shield } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import './LegalPages.css';

const PrivacyPolicy: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PublicLayout>
      <div className="legal-page">
        <div className="legal-container">
          <h1><Shield size={28} /> {t('legal.privacyPolicy')}</h1>
          <p className="legal-updated">{t('legal.lastUpdated')}</p>

          <section>
            <h2>{t('legal.privacyIntroTitle')}</h2>
            <p>{t('legal.privacyIntroDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.privacyCollectTitle')}</h2>
            <p>{t('legal.privacyCollectDesc')}</p>
            <ul>
              <li>{t('legal.privacyCollectItem1')}</li>
              <li>{t('legal.privacyCollectItem2')}</li>
              <li>{t('legal.privacyCollectItem3')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.privacyUseTitle')}</h2>
            <p>{t('legal.privacyUseDesc')}</p>
            <ul>
              <li>{t('legal.privacyUseItem1')}</li>
              <li>{t('legal.privacyUseItem2')}</li>
              <li>{t('legal.privacyUseItem3')}</li>
              <li>{t('legal.privacyUseItem4')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.privacyChildrenTitle')}</h2>
            <p>{t('legal.privacyChildrenDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.privacySecurityTitle')}</h2>
            <p>{t('legal.privacySecurityDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.privacyContactTitle')}</h2>
            <p>{t('legal.privacyContactDesc')} <a href="mailto:privacy@minesminis.com">privacy@minesminis.com</a></p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default PrivacyPolicy;
