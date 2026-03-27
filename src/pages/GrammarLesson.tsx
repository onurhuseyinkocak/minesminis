/**
 * GrammarLesson — standalone grammar lesson page
 * Accessible from /grammar/:lessonId or from Dashboard quick actions
 */
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, ChevronRight, ChevronLeft } from 'lucide-react';
import { getGrammarLesson, grammarLessons } from '../data/grammarLessons';
import GrammarMiniLesson from '../components/GrammarMiniLesson';
import LottieCharacter from '../components/LottieCharacter';
import { useLanguage } from '../contexts/LanguageContext';
import { usePageTitle } from '../hooks/usePageTitle';
import './GrammarLesson.css';

export default function GrammarLessonPage() {
  usePageTitle('Gramer', 'Grammar');
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const isTr = lang === 'tr';

  // If no lessonId, show the grammar lesson list
  if (!lessonId) {
    return (
      <div className="grammar-page">
        <div className="grammar-page__header">
          <button onClick={() => navigate('/dashboard')} className="grammar-page__back">
            <ArrowLeft size={20} /> {isTr ? 'Dashboard' : 'Dashboard'}
          </button>
        </div>

        <motion.div
          className="grammar-page__hero"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <LottieCharacter state="wave" size={100} />
          <div className="grammar-page__hero-text">
            <h1 className="grammar-page__hero-title">
              {isTr ? 'Gramerle Tanış!' : 'Meet Grammar!'}
            </h1>
            <p className="grammar-page__hero-subtitle">
              {isTr
                ? "İngilizce'nin yapı taşlarını öğren"
                : "Learn the building blocks of English"}
            </p>
          </div>
        </motion.div>

        <div className="grammar-page__list">
          {grammarLessons.map((lesson, i) => {
            const previewNote = lesson.turkishNote.length > 60
              ? lesson.turkishNote.slice(0, 60) + '…'
              : lesson.turkishNote;
            const difficultyStars = Array.from({ length: 3 }, (_, idx) => idx < lesson.level);

            return (
              <motion.button
                key={lesson.id}
                className="grammar-page__item"
                onClick={() => navigate(`/grammar/${lesson.id}`)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="grammar-page__item-body">
                  <div className="grammar-page__item-top">
                    <span className="grammar-page__level">
                      {isTr ? `Seviye ${lesson.level}` : `Level ${lesson.level}`}
                    </span>
                    <span className="grammar-page__stars" aria-label={`Level ${lesson.level} of 3`}>
                      {difficultyStars.map((filled, idx) => (
                        <Star
                          key={idx}
                          size={12}
                          fill={filled ? 'currentColor' : 'none'}
                          aria-hidden="true"
                        />
                      ))}
                    </span>
                  </div>
                  <span className="grammar-page__topic">
                    {isTr ? lesson.topicTr : lesson.topic}
                  </span>
                  <span className="grammar-page__preview">{previewNote}</span>
                </div>
                <ChevronRight size={20} className="grammar-page__arrow" />
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  const lesson = getGrammarLesson(lessonId);

  if (!lesson) {
    return (
      <div className="grammar-page">
        <p>{isTr ? 'Ders bulunamadı.' : 'Lesson not found.'}</p>
        <button onClick={() => navigate('/grammar')}>
          {isTr ? 'Gramer Listesi' : 'Grammar List'}
        </button>
      </div>
    );
  }

  const currentIndex = grammarLessons.findIndex(l => l.id === lessonId);
  const total = grammarLessons.length;
  const progressPct = total > 0 ? Math.round(((currentIndex + 1) / total) * 100) : 0;
  const prevLesson = currentIndex > 0 ? grammarLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < total - 1 ? grammarLessons[currentIndex + 1] : null;

  return (
    <div className="grammar-page">
      <div className="grammar-page__header">
        <button onClick={() => navigate('/grammar')} className="grammar-page__back">
          <ArrowLeft size={20} /> {isTr ? 'Gramer' : 'Grammar'}
        </button>
        <h1 className="grammar-page__header-title">
          {isTr ? lesson.topicTr : lesson.topic}
        </h1>
      </div>

      {/* Progress indicator */}
      <div className="grammar-page__progress">
        <div className="grammar-page__progress-track">
          <div
            className="grammar-page__progress-fill"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <span className="grammar-page__progress-label">
          {isTr ? `Ders ${currentIndex + 1} / ${total}` : `Lesson ${currentIndex + 1} of ${total}`}
        </span>
      </div>

      <div className="grammar-page__content">
        <GrammarMiniLesson
          lesson={lesson}
          lang={lang as 'tr' | 'en'}
          onComplete={(_score) => {
            if (nextLesson) {
              setTimeout(() => navigate(`/grammar/${nextLesson.id}`), 1800);
            } else {
              setTimeout(() => navigate('/grammar'), 2000);
            }
          }}
        />
      </div>

      {/* Prev / Next lesson navigation */}
      <div className="grammar-page__lesson-nav">
        <button
          className="grammar-page__nav-btn"
          onClick={() => prevLesson && navigate(`/grammar/${prevLesson.id}`)}
          disabled={!prevLesson}
          aria-label={isTr ? 'Önceki ders' : 'Previous lesson'}
        >
          <ChevronLeft size={16} />
          {isTr ? 'Önceki' : 'Previous'}
        </button>

        <span className="grammar-page__nav-position">
          {currentIndex + 1} / {total}
          <span className="grammar-page__nav-position-label">{isTr ? 'ders' : 'lessons'}</span>
        </span>

        <button
          className="grammar-page__nav-btn grammar-page__nav-btn--next"
          onClick={() => nextLesson && navigate(`/grammar/${nextLesson.id}`)}
          disabled={!nextLesson}
          aria-label={isTr ? 'Sonraki ders' : 'Next lesson'}
        >
          {isTr ? 'Sonraki' : 'Next'}
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
