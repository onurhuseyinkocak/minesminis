/**
 * LottieCharacter — Mimi mascot (local Lottie JSON files)
 * Files located in /public/mascot/mimi_*.json
 */
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const STATE_MAP: Record<string, string> = {
  idle:        '/mascot/mimi_idle.json',
  happy:       '/mascot/mimi_happy.json',
  sad:         '/mascot/mimi_sad.json',
  sit:         '/mascot/mimi_sit.json',
  talk:        '/mascot/mimi_talk.json',
  walk:        '/mascot/mimi_walk.json',
  wave:        '/mascot/mimi_wave.json',
  // aliases
  celebrating: '/mascot/mimi_happy.json',
  thinking:    '/mascot/mimi_sit.json',
  sleeping:    '/mascot/mimi_sit.json',
  star:        '/mascot/mimi_happy.json',
  waving:      '/mascot/mimi_wave.json',
  excited:     '/mascot/mimi_happy.json',
  cool:        '/mascot/mimi_idle.json',
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
