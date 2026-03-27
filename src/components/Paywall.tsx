/**
 * Paywall — shown when a free user hits a premium-gated feature.
 * No emoji — Lucide icons only.
 */
import { useNavigate } from 'react-router-dom';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PaywallProps {
  /** Human-readable feature name, e.g. "unlimited lessons" */
  feature: string;
}

export default function Paywall({ feature }: PaywallProps) {
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const title = lang === 'tr'
    ? 'Premium Özellik'
    : 'Premium Feature';

  const description = lang === 'tr'
    ? `"${feature}" özelliğine erişim için Premium'a yükselt.`
    : `Upgrade to Premium to unlock "${feature}".`;

  const ctaText = lang === 'tr'
    ? 'Planları Gör'
    : 'See Plans';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
        background: 'var(--bg-card, #fff)',
        border: '1.5px solid var(--border, #e5e7eb)',
        borderRadius: 'var(--radius-xl, 1rem)',
        textAlign: 'center',
        maxWidth: '380px',
        margin: '1rem auto',
        gap: '1rem',
        boxShadow: 'var(--shadow-md, 0 4px 6px rgba(0,0,0,0.07))',
      }}
    >
      {/* Lock icon */}
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'var(--primary-pale, #fff7ed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Lock size={28} style={{ color: 'var(--primary, #f97316)' }} />
      </div>

      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Crown size={20} style={{ color: 'var(--primary, #f97316)' }} />
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '18px',
            fontWeight: 700,
            color: 'var(--text-primary, #1e293b)',
            margin: 0,
          }}
        >
          {title}
        </h3>
      </div>

      {/* Description */}
      <p
        style={{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--text-secondary, #64748b)',
          margin: 0,
          lineHeight: 1.5,
        }}
      >
        {description}
      </p>

      {/* CTA button */}
      <button
        type="button"
        onClick={() => navigate('/pricing')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          border: 'none',
          borderRadius: 'var(--radius-full, 9999px)',
          background: 'var(--gradient-primary, linear-gradient(135deg, #f97316, #ea580c))',
          color: 'var(--text-on-primary, #fff)',
          fontFamily: 'var(--font-display)',
          fontSize: '15px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: 'var(--shadow-button, 0 2px 8px rgba(249,115,22,0.3))',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
        }}
      >
        {ctaText}
        <ArrowRight size={16} />
      </button>

      {/* Trust badges */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          fontSize: '11px',
          color: 'var(--text-muted, #94a3b8)',
          fontFamily: 'var(--font-body)',
          marginTop: '0.25rem',
        }}
      >
        <span>{lang === 'tr' ? 'SSL Güvenli' : 'SSL Secure'}</span>
        <span>{lang === 'tr' ? 'İptal Kolayca' : 'Cancel Anytime'}</span>
      </div>
    </div>
  );
}
