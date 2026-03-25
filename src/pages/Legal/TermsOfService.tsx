import { FileText } from 'lucide-react';
import PublicLayout from '../../components/layout/PublicLayout';
import { useLanguage } from '../../contexts/LanguageContext';
import './LegalPages.css';

const TermsOfService: React.FC = () => {
  const { t } = useLanguage();

  return (
    <PublicLayout>
      <div className="legal-page">
        <div className="legal-container">
          <h1><FileText size={28} /> {t('legal.termsOfService')}</h1>
          <p className="legal-updated">{t('legal.lastUpdated')}</p>

          <section>
            <h2>{t('legal.termsAcceptTitle')}</h2>
            <p>{t('legal.termsAcceptDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.termsUseTitle')}</h2>
            <p>{t('legal.termsUseDesc')}</p>
            <ul>
              <li>{t('legal.termsUseItem1')}</li>
              <li>{t('legal.termsUseItem2')}</li>
              <li>{t('legal.termsUseItem3')}</li>
            </ul>
          </section>

          <section>
            <h2>{t('legal.termsIPTitle')}</h2>
            <p>{t('legal.termsIPDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.termsPremiumTitle')}</h2>
            <p>{t('legal.termsPremiumDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.termsLiabilityTitle')}</h2>
            <p>{t('legal.termsLiabilityDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.termsChangesTitle')}</h2>
            <p>{t('legal.termsChangesDesc')}</p>
          </section>

          <section>
            <h2>{t('legal.termsContactTitle')}</h2>
            <p>{t('legal.termsContactDesc')} <a href="mailto:legal@minesminis.com">legal@minesminis.com</a></p>
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default TermsOfService;
