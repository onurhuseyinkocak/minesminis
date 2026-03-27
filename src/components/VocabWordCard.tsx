/**
 * VocabWordCard — displays a vocabulary word with Lottie animation (if available)
 * or falls back to emoji + CSS bounce animation.
 * Used in DailyLesson phases 1 (Listen) and 2 (See).
 */
import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import type { KidsWord } from '../data/wordsData';
import './VocabWordCard.css';

// Mapping of word → local Lottie file path
const WORD_LOTTIE_MAP: Record<string, string> = {
  apple:  '/lottie/vocab/apple.json',
  dog:    '/lottie/vocab/dog.json',
  cat:    '/lottie/vocab/cat.json',
  fish:   '/lottie/vocab/fish.json',
  bird:   '/lottie/vocab/bird.json',
  frog:   '/lottie/vocab/frog.json',
  sun:    '/lottie/vocab/sun.json',
  moon:   '/lottie/vocab/moon.json',
  star:   '/lottie/vocab/star.json',
  rain:   '/lottie/vocab/rain.json',
  tree:   '/lottie/vocab/tree.json',
  flower: '/lottie/vocab/flower.json',
  bee:    '/lottie/vocab/bee.json',
  duck:   '/lottie/vocab/duck.json',
  pig:    '/lottie/vocab/pig.json',
  cow:    '/lottie/vocab/cow.json',
  hen:    '/lottie/vocab/hen.json',
  bus:    '/lottie/vocab/bus.json',
  car:    '/lottie/vocab/car.json',
  train:  '/lottie/vocab/train.json',
  cake:   '/lottie/vocab/cake.json',
  heart:  '/lottie/vocab/heart.json',
  book:   '/lottie/vocab/book.json',
  ball:   '/lottie/vocab/ball.json',
  house:  '/lottie/vocab/house.json',
};

interface VocabWordCardProps {
  word: KidsWord;
  size?: 'sm' | 'md' | 'lg';
  showWord?: boolean;
  showTurkish?: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

export default function VocabWordCard({
  word,
  size = 'md',
  showWord = true,
  showTurkish = true,
  onClick,
  isActive = false,
}: VocabWordCardProps) {
  const [lottieData, setLottieData] = useState<unknown>(null);
  const [lottieLoaded, setLottieLoaded] = useState(false);
  const lottieUrl = WORD_LOTTIE_MAP[word.word.toLowerCase()];

  useEffect(() => {
    if (!lottieUrl) return;
    setLottieData(null);
    setLottieLoaded(false);
    fetch(lottieUrl)
      .then(r => {
        if (!r.ok) throw new Error('not found');
        return r.json();
      })
      .then(data => {
        setLottieData(data);
        setLottieLoaded(true);
      })
      .catch(() => {
        // Fallback to emoji — this is fine
        setLottieLoaded(false);
      });
  }, [lottieUrl]);

  const sizeMap = { sm: 80, md: 120, lg: 160 };
  const lottieSize = sizeMap[size];
  const emojiFontSize = size === 'sm' ? '2.5rem' : size === 'md' ? '3.5rem' : '5rem';

  return (
    <div
      className={`vocab-card vocab-card--${size} ${isActive ? 'vocab-card--active' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter') onClick(); } : undefined}
    >
      {/* Animation or emoji */}
      <div className="vocab-card__visual">
        {lottieLoaded && lottieData ? (
          <Lottie
            animationData={lottieData}
            loop
            autoplay
            style={{ width: lottieSize, height: lottieSize }}
          />
        ) : (
          <span
            className="vocab-card__emoji"
            style={{ fontSize: emojiFontSize }}
            aria-hidden="true"
          >
            {word.emoji}
          </span>
        )}
      </div>

      {/* Word text */}
      {showWord && (
        <p className="vocab-card__word">{word.word}</p>
      )}

      {/* Turkish translation */}
      {showTurkish && (
        <p className="vocab-card__turkish">{word.turkish}</p>
      )}
    </div>
  );
}
