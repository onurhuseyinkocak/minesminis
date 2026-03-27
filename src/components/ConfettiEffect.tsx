import React, { useEffect, useState } from 'react';
import './ConfettiEffect.css';

interface ConfettiEffectProps {
  isActive?: boolean;
  trigger?: boolean;
}

const CONFETTI_COLORS = [
  'var(--error-light)',
  'var(--accent-teal)',
  'var(--accent-amber)',
  'var(--accent-indigo)',
  'var(--accent-purple-light)',
  'var(--accent-pink)',
];

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isActive, trigger }) => {
  const active = isActive ?? trigger ?? true;
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; delay: number; color: string }>
  >([]);

  useEffect(() => {
    if (active) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div className="confetti-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiEffect;
