/**
 * LottieCharacter — Zubulig mascot (local Lottie JSON files)
 * Files located in /public/mascot/zubulig_*.json
 */
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const STATE_MAP: Record<string, string> = {
  idle:        '/mascot/zubulig_idle.json',
  happy:       '/mascot/zubulig_happy.json',
  sad:         '/mascot/zubulig_sad.json',
  sit:         '/mascot/zubulig_sit.json',
  talk:        '/mascot/zubulig_talk.json',
  walk:        '/mascot/zubulig_walk.json',
  wave:        '/mascot/zubulig_wave.json',
  // aliases
  celebrating: '/mascot/zubulig_happy.json',
  thinking:    '/mascot/zubulig_sit.json',
  sleeping:    '/mascot/zubulig_sit.json',
  star:        '/mascot/zubulig_happy.json',
  waving:      '/mascot/zubulig_wave.json',
  excited:     '/mascot/zubulig_happy.json',
  cool:        '/mascot/zubulig_idle.json',
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
      }}>Z</div>
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
