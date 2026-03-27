import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import './NotFound.css';

// Deterministic star positions — no Math.random() in render
const STARS = [
    { top: '8%',  left: '7%',  size: 3, delay: 0 },
    { top: '14%', left: '82%', size: 5, delay: 0.4 },
    { top: '22%', left: '23%', size: 2, delay: 0.8 },
    { top: '18%', left: '61%', size: 4, delay: 0.2 },
    { top: '35%', left: '91%', size: 3, delay: 1.1 },
    { top: '42%', left: '4%',  size: 4, delay: 0.6 },
    { top: '55%', left: '74%', size: 2, delay: 1.5 },
    { top: '62%', left: '15%', size: 5, delay: 0.3 },
    { top: '72%', left: '88%', size: 3, delay: 0.9 },
    { top: '28%', left: '45%', size: 2, delay: 1.3 },
    { top: '80%', left: '38%', size: 4, delay: 0.7 },
    { top: '10%', left: '51%', size: 2, delay: 1.8 },
];

function NotFound() {
    const { t } = useLanguage();
    usePageTitle('Sayfa Bulunamadı', 'Page Not Found');
    const location = useLocation();

    return (
        <PublicLayout>
            <div className="not-found-page">

                {/* Scattered star decorations */}
                {STARS.map((star, i) => (
                    <span
                        key={i}
                        className="not-found-star"
                        style={{
                            top: star.top,
                            left: star.left,
                            width: star.size,
                            height: star.size,
                            animationDelay: `${star.delay}s`,
                        }}
                    />
                ))}

                {/* Subtle orbit ring behind the rocket */}
                <div className="not-found-orbit" />

                {/* Floating rocket */}
                <div className="not-found-rocket animate-float">
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 120 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        {/* Rocket body */}
                        <ellipse cx="60" cy="48" rx="20" ry="32" fill="#FF6B35" />
                        {/* Nose cone */}
                        <ellipse cx="60" cy="18" rx="20" ry="18" fill="#FF7B3A" />
                        {/* Window */}
                        <circle cx="60" cy="42" r="9" fill="#FFF8F0" />
                        <circle cx="60" cy="42" r="6" fill="#FFE6D5" />
                        <circle cx="57" cy="39" r="2" fill="white" opacity="0.7" />
                        {/* Left fin */}
                        <path d="M40 68 L34 88 L48 76 Z" fill="#C73A0A" />
                        {/* Right fin */}
                        <path d="M80 68 L86 88 L72 76 Z" fill="#C73A0A" />
                        {/* Exhaust flame outer */}
                        <ellipse cx="60" cy="88" rx="12" ry="16" fill="#FCD34D" opacity="0.9" />
                        {/* Exhaust flame inner */}
                        <ellipse cx="60" cy="86" rx="7" ry="10" fill="#F59E0B" />
                        {/* Exhaust core */}
                        <ellipse cx="60" cy="84" rx="4" ry="6" fill="white" opacity="0.8" />
                        {/* Sparkle top-left */}
                        <circle cx="28" cy="32" r="3" fill="#FF6B35" opacity="0.5" />
                        <circle cx="20" cy="52" r="2" fill="#FF6B35" opacity="0.3" />
                        {/* Sparkle top-right */}
                        <circle cx="93" cy="28" r="2" fill="#8B5CF6" opacity="0.4" />
                        <circle cx="100" cy="50" r="3" fill="#8B5CF6" opacity="0.3" />
                    </svg>
                </div>

                {/* 404 number */}
                <h1 className="not-found-code">
                    4<span className="not-found-code-accent">0</span>4
                </h1>

                {/* Main message */}
                <p className="not-found-message">
                    {t('notFoundPage.message')}
                </p>

                {/* Sub-message */}
                <p className="not-found-sub">
                    {t('notFoundPage.subMessage')}
                </p>

                {/* Lost path pill */}
                {location.pathname && location.pathname !== '/' && (
                    <div className="not-found-path-pill">
                        <span className="not-found-path-label">Kayıp yol:</span>
                        <code className="not-found-path-code">{location.pathname}</code>
                    </div>
                )}

                {/* CTA */}
                <Link
                    to="/"
                    className="not-found-cta"
                >
                    <Home size={20} />
                    {t('notFoundPage.backHome')}
                </Link>

            </div>
        </PublicLayout>
    );
}

export default NotFound;
