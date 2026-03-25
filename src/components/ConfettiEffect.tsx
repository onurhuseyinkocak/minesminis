import React, { useEffect, useState } from 'react';
import './ConfettiEffect.css';

interface ConfettiEffectProps {
  isActive?: boolean;
  trigger?: boolean;
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ isActive, trigger }) => {
  const active = isActive ?? trigger ?? true;
  const [particles, setParticles] = useState<Array<{id: number; x: number; delay: number; color: string}>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['var(--error-light)', 'var(--accent-teal)', 'var(--accent-amber)', 'var(--accent-indigo)', 'var(--accent-purple-light)', 'var(--accent-pink)'];
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      }));
      setParticles(newParticles);
    }
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: '-10px',
            width: '10px',
            height: '10px',
            backgroundColor: p.color,
            borderRadius: '50%',
            animation: `confetti-fall 3s ease-in-out ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect;
