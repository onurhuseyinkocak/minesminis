/**
 * Gerçekçi evcil hayvan görünümü: kedi, köpek, kuş.
 * Lottie animasyonu kullanır; yüklenemezse CSS fallback.
 */
import React, { useState, useRef, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import type { PetType } from '../services/petService';
import { PET_TYPES } from '../services/petService';

type PetState = 'idle' | 'play' | 'eating' | 'sleeping';

interface RealisticPetViewProps {
  type: PetType;
  state?: PetState;
  size?: number;
  className?: string;
}

const RealisticPetView: React.FC<RealisticPetViewProps> = ({
  type,
  state = 'idle',
  size = 120,
  className = '',
}) => {
  const [lottieError, setLottieError] = useState(false);
  const playerRef = useRef<Player>(null);
  const petConfig = PET_TYPES.find(p => p.type === type);
  const src = state === 'play' ? petConfig?.lottiePlay : petConfig?.lottieIdle;

  useEffect(() => {
    setLottieError(false);
  }, [type, src]);

  if (!petConfig) return null;

  if (lottieError || !src) {
    return (
      <div
        className={`realistic-pet-fallback realistic-pet-fallback--${type} ${className}`}
        style={{ width: size, height: size }}
        aria-hidden
      >
        <div className="realistic-pet-fallback-inner" style={{ width: size * 0.8, height: size * 0.8 }}>
          <span className="realistic-pet-fallback-emoji" role="img" aria-label={type}>
            {type === 'cat' ? '🐱' : type === 'dog' ? '🐕' : '🐦'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`realistic-pet-view ${className}`} style={{ width: size, height: size }}>
      <Player
        ref={playerRef}
        src={src}
        loop
        autoplay
        style={{ width: size, height: size }}
        onEvent={(e) => {
          if (e === 'error') setLottieError(true);
        }}
      />
    </div>
  );
};

export default RealisticPetView;
