import { Link } from 'react-router-dom';
import { Rocket, Home } from 'lucide-react';
import PublicLayout from '../components/layout/PublicLayout';
import { useLanguage } from '../contexts/LanguageContext';

function NotFound() {
    const { t } = useLanguage();

    return (
        <PublicLayout>
            <div className="min-h-[70vh] flex flex-col items-center justify-center bg-cream-100 px-6 text-center">
                <div className="animate-float mb-4">
                    <Rocket
                        size={96}
                        className="text-primary-500"
                        strokeWidth={1.5}
                    />
                </div>

                <h1 className="font-display font-black text-ink-900 text-6xl sm:text-8xl mb-4 tracking-tight">
                    4<span className="text-primary-500">0</span>4
                </h1>

                <p className="font-display font-semibold text-ink-500 text-lg sm:text-xl max-w-sm mb-8">
                    {t('notFoundPage.message')}
                </p>

                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-display font-bold text-base px-8 py-4 rounded-2xl shadow-primary hover:shadow-primary-lg transition-all duration-200 hover:scale-105 active:scale-95"
                >
                    <Home size={20} />
                    {t('notFoundPage.backHome')}
                </Link>
            </div>
        </PublicLayout>
    );
}

export default NotFound;
