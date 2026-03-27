/**
 * LottieCharacter — Mimi mascot (local Lottie JSON files)
 * Files located in /public/mascot/mimi_*.json
 */
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const STATE_MAP: Record<string, string> = {
  idle:        '/mascot/cat_idle.json',
  happy:       '/mascot/cat_happy.json',
  sad:         '/mascot/cat_idle.json',
  sit:         '/mascot/cat_idle.json',
  talk:        '/mascot/cat_idle.json',
  walk:        '/mascot/cat_walk.json',
  wave:        '/mascot/cat_wave.json',
  // aliases
  celebrating: '/mascot/cat_happy.json',
  thinking:    '/mascot/cat_idle.json',
  sleeping:    '/mascot/cat_sleeping.json',
  star:        '/mascot/cat_happy.json',
  waving:      '/mascot/cat_wave.json',
  excited:     '/mascot/cat_happy.json',
  cool:        '/mascot/cat_idle.json',
};

export type CharacterState = keyof typeof STATE_MAP;

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

  const path = STATE_MAP[state] ?? STATE_MAP.idle;

  useEffect(() => {
    setAnimData(null);
    fetch(path)
      .then(r => r.json())
      .then(data => setAnimData(data))
      .catch(() => { /* fallback stays null */ });
  }, [path]);

  if (!animData) {
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
