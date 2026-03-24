/**
 * LOTTIE ICON — Centralized animated icon system
 * Replaces static emojis with smooth Lottie animations
 * Falls back to emoji if animation fails to load
 */
import React, { memo, useState } from 'react';
import Lottie from 'lottie-react';

export type LottieIconName =
  | 'star' | 'fire' | 'trophy' | 'gift' | 'dragon'
  | 'book' | 'music' | 'gamepad' | 'rocket' | 'plant'
  | 'flower' | 'heart' | 'check' | 'sparkle' | 'ear'
  | 'eye' | 'mic' | 'brain' | 'celebration' | 'wave';

// Fallback emojis
const EMOJI: Record<LottieIconName, string> = {
  star: '⭐', fire: '🔥', trophy: '🏆', gift: '🎁', dragon: '🐲',
  book: '📚', music: '🎵', gamepad: '🎮', rocket: '🚀', plant: '🌱',
  flower: '🌸', heart: '❤️', check: '✅', sparkle: '✨', ear: '👂',
  eye: '👀', mic: '🎤', brain: '🧠', celebration: '🎉', wave: '👋',
};

// Animation data cache
const animCache = new Map<string, object | null>();

// Inline minimal Lottie animations (self-contained, no external deps)
// These are tiny procedural animations that work offline
function createStarAnim(): object {
  return {"v":"5.7.4","fr":30,"ip":0,"op":60,"w":100,"h":100,"layers":[{"ty":4,"nm":"star","ip":0,"op":60,"st":0,"ks":{"o":{"a":1,"k":[{"t":0,"s":[100]},{"t":30,"s":[60]},{"t":60,"s":[100]}]},"r":{"a":1,"k":[{"t":0,"s":[0]},{"t":60,"s":[360]}]},"p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"t":0,"s":[100,100]},{"t":15,"s":[120,120]},{"t":30,"s":[100,100]}]}},"shapes":[{"ty":"sr","p":{"a":0,"k":[0,0]},"or":{"a":0,"k":40},"ir":{"a":0,"k":20},"r":{"a":0,"k":0},"pt":{"a":0,"k":5},"sy":1,"d":1,"nm":"star"},{"ty":"fl","c":{"a":0,"k":[1,0.85,0.2,1]},"o":{"a":0,"k":100}}]}]};
}

function createFireAnim(): object {
  return {"v":"5.7.4","fr":30,"ip":0,"op":60,"w":100,"h":100,"layers":[{"ty":4,"nm":"fire","ip":0,"op":60,"st":0,"ks":{"p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"t":0,"s":[100,100]},{"t":15,"s":[95,110]},{"t":30,"s":[105,95]},{"t":45,"s":[95,110]},{"t":60,"s":[100,100]}]}},"shapes":[{"ty":"el","p":{"a":0,"k":[0,5]},"s":{"a":0,"k":[50,65]},"nm":"flame"},{"ty":"fl","c":{"a":1,"k":[{"t":0,"s":[1,0.6,0.1,1]},{"t":30,"s":[1,0.3,0,1]},{"t":60,"s":[1,0.6,0.1,1]}]},"o":{"a":0,"k":100}}]}]};
}

function createHeartAnim(): object {
  return {"v":"5.7.4","fr":30,"ip":0,"op":60,"w":100,"h":100,"layers":[{"ty":4,"nm":"heart","ip":0,"op":60,"st":0,"ks":{"p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"t":0,"s":[100,100]},{"t":15,"s":[115,115]},{"t":30,"s":[100,100]},{"t":45,"s":[110,110]},{"t":60,"s":[100,100]}]}},"shapes":[{"ty":"el","p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[55,55]},"nm":"h"},{"ty":"fl","c":{"a":0,"k":[1,0.3,0.4,1]},"o":{"a":0,"k":100}}]}]};
}

function createCheckAnim(): object {
  return {"v":"5.7.4","fr":30,"ip":0,"op":30,"w":100,"h":100,"layers":[{"ty":4,"nm":"check","ip":0,"op":30,"st":0,"ks":{"p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"t":0,"s":[0,0]},{"t":15,"s":[120,120]},{"t":25,"s":[100,100]}]}},"shapes":[{"ty":"el","p":{"a":0,"k":[0,0]},"s":{"a":0,"k":[60,60]},"nm":"bg"},{"ty":"fl","c":{"a":0,"k":[0.3,0.8,0.3,1]},"o":{"a":0,"k":100}}]}]};
}

function createSparkleAnim(): object {
  return {"v":"5.7.4","fr":30,"ip":0,"op":60,"w":100,"h":100,"layers":[{"ty":4,"nm":"sparkle","ip":0,"op":60,"st":0,"ks":{"o":{"a":1,"k":[{"t":0,"s":[100]},{"t":20,"s":[40]},{"t":40,"s":[100]},{"t":60,"s":[40]}]},"r":{"a":1,"k":[{"t":0,"s":[0]},{"t":60,"s":[180]}]},"p":{"a":0,"k":[50,50]},"s":{"a":1,"k":[{"t":0,"s":[100,100]},{"t":30,"s":[80,80]},{"t":60,"s":[100,100]}]}},"shapes":[{"ty":"sr","p":{"a":0,"k":[0,0]},"or":{"a":0,"k":35},"ir":{"a":0,"k":12},"r":{"a":0,"k":0},"pt":{"a":0,"k":4},"sy":1,"d":1,"nm":"sp"},{"ty":"fl","c":{"a":0,"k":[1,0.85,0.2,1]},"o":{"a":0,"k":100}}]}]};
}

// Built-in animation registry
const BUILT_IN: Partial<Record<LottieIconName, () => object>> = {
  star: createStarAnim,
  fire: createFireAnim,
  heart: createHeartAnim,
  check: createCheckAnim,
  sparkle: createSparkleAnim,
};

function getAnimData(name: LottieIconName): object | null {
  if (animCache.has(name)) return animCache.get(name) || null;
  const factory = BUILT_IN[name];
  if (factory) {
    const data = factory();
    animCache.set(name, data);
    return data;
  }
  return null;
}

interface LottieIconProps {
  name: LottieIconName;
  size?: number;
  loop?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieIcon: React.FC<LottieIconProps> = memo(({
  name,
  size = 32,
  loop = true,
  className,
  style,
}) => {
  const [failed, setFailed] = useState(false);
  const animData = getAnimData(name);

  // If no built-in animation or load failed, show emoji
  if (!animData || failed) {
    return (
      <span
        className={`lottie-icon lottie-icon--emoji ${className || ''}`}
        style={{ fontSize: size * 0.75, lineHeight: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}
        role="img"
        aria-label={name}
      >
        {EMOJI[name]}
      </span>
    );
  }

  return (
    <span
      className={`lottie-icon ${className || ''}`}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, ...style }}
    >
      <Lottie
        animationData={animData}
        loop={loop}
        style={{ width: size, height: size }}
        onError={() => setFailed(true)}
      />
    </span>
  );
});

LottieIcon.displayName = 'LottieIcon';

export { LottieIcon, EMOJI };
export type { LottieIconProps };
