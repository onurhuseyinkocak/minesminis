/**
 * LottieCharacter — New mascot system using Google Noto Emoji Lottie animations
 * Apache 2.0 License — free for commercial use
 * Source: https://googlefonts.github.io/noto-emoji-animation/
 */
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

// State → Google Noto Emoji CDN URL mapping
// All Apache 2.0 licensed — free commercial use
const NOTO_BASE = 'https://fonts.gstatic.com/s/e/notoemoji/latest';

const STATE_URLS: Record<string, string> = {
  idle:        `${NOTO_BASE}/1f43c/lottie.json`,   // panda
  happy:       `${NOTO_BASE}/1f60a/lottie.json`,   // smiling
  celebrating: `${NOTO_BASE}/1f389/lottie.json`,   // party
  star:        `${NOTO_BASE}/1f929/lottie.json`,   // star-eyes
  waving:      `${NOTO_BASE}/1f44b/lottie.json`,   // waving
  sleeping:    `${NOTO_BASE}/1f634/lottie.json`,   // sleeping
  thinking:    `${NOTO_BASE}/1f914/lottie.json`,   // thinking
  love:        `${NOTO_BASE}/1f970/lottie.json`,   // loving
  surprised:   `${NOTO_BASE}/1f632/lottie.json`,   // surprised
  cool:        `${NOTO_BASE}/1f60e/lottie.json`,   // cool
};

export type CharacterState = keyof typeof STATE_URLS;

interface LottieCharacterProps {
  state?: CharacterState;
  size?: number;
  loop?: boolean;
  autoplay?: boolean;
}

export default function LottieCharacter({
  state = 'idle',
  size = 120,
  loop = true,
  autoplay = true,
}: LottieCharacterProps) {
  const [animData, setAnimData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);

  const url = STATE_URLS[state] ?? STATE_URLS.idle;

  useEffect(() => {
    setLoading(true);
    setAnimData(null);
    fetch(url)
      .then(r => r.json())
      .then(data => {
        setAnimData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (loading || !animData) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #FF6B35, #F04B10)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: 900,
        color: '#fff',
        fontFamily: 'Nunito, sans-serif',
      }}>M</div>
    );
  }

  return (
    <Lottie
      animationData={animData}
      loop={loop}
      autoplay={autoplay}
      style={{ width: size, height: size }}
    />
  );
}
