/**
 * MimiMascot — Premium inline SVG mascot for Mimi the baby dragon.
 * Replaces all emoji dragon references with a beautiful, animated SVG.
 *
 * Design: Cute, friendly baby dragon inspired by Toothless (HTTYD).
 * - Rounded green body, large expressive eyes, tiny wings & horns
 * - CSS keyframe animations per mood (no JS animation overhead)
 */
import React from 'react';

export interface MimiMascotProps {
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'sleeping' | 'waving';
  animate?: boolean;
  className?: string;
}

const ANIMATION_STYLES = `
@keyframes mimi-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
@keyframes mimi-think {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-5deg); }
  75% { transform: rotate(5deg); }
}
@keyframes mimi-excited {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.05); }
}
@keyframes mimi-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}
@keyframes mimi-wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-15deg); }
  75% { transform: rotate(15deg); }
}
`;

let stylesInjected = false;

function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-mimi-mascot', '');
  style.textContent = ANIMATION_STYLES;
  document.head.appendChild(style);
  stylesInjected = true;
}

const MOOD_ANIMATION: Record<string, string> = {
  happy: 'mimi-bounce 2s ease-in-out infinite',
  thinking: 'mimi-think 3s ease-in-out infinite',
  excited: 'mimi-excited 1s ease-in-out infinite',
  sleeping: 'mimi-breathe 4s ease-in-out infinite',
  waving: 'mimi-bounce 2s ease-in-out infinite',
};

const MimiMascot: React.FC<MimiMascotProps> = ({
  size = 120,
  mood = 'happy',
  animate = true,
  className = '',
}) => {
  React.useEffect(() => {
    if (animate) injectStyles();
  }, [animate]);

  const animation = animate ? MOOD_ANIMATION[mood] : 'none';
  const isSleeping = mood === 'sleeping';
  const isWaving = mood === 'waving';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      style={{ animation, display: 'inline-block', verticalAlign: 'middle' }}
      role="img"
      aria-label="Mimi the dragon"
    >
      {/* ---- TAIL ---- */}
      <path
        d="M60 155 Q30 165 25 150 Q20 135 35 132 Q28 128 32 120 Q38 115 42 122"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Tail heart tip */}
      <path
        d="M25 150 Q22 144 18 147 Q14 150 18 155 Q22 160 25 155 Q28 160 32 155 Q36 150 32 147 Q28 144 25 150Z"
        fill="var(--warning)"
        stroke="#C68A11"
        strokeWidth="1"
      />

      {/* ---- LEFT WING ---- */}
      <path
        d="M55 75 Q30 50 40 30 Q45 38 50 35 Q48 25 58 20 Q58 30 65 28 Q62 18 72 15 Q70 28 78 30 Q82 55 75 70"
        fill="#2E7D32"
        fillOpacity="0.7"
        stroke="#1B5E20"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ---- RIGHT WING ---- */}
      <path
        d="M145 75 Q170 50 160 30 Q155 38 150 35 Q152 25 142 20 Q142 30 135 28 Q138 18 128 15 Q130 28 122 30 Q118 55 125 70"
        fill="#2E7D32"
        fillOpacity="0.7"
        stroke="#1B5E20"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ---- BODY (pear-shaped) ---- */}
      <ellipse cx="100" cy="135" rx="42" ry="45" fill="#4CAF50" />
      <ellipse cx="100" cy="110" rx="35" ry="30" fill="#4CAF50" />

      {/* ---- BELLY ---- */}
      <ellipse cx="100" cy="138" rx="26" ry="30" fill="#81C784" />

      {/* ---- FEET ---- */}
      <ellipse cx="75" cy="176" rx="14" ry="7" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      <ellipse cx="125" cy="176" rx="14" ry="7" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
      {/* Toe details */}
      <circle cx="66" cy="175" r="3" fill="#2E7D32" opacity="0.4" />
      <circle cx="72" cy="173" r="3" fill="#2E7D32" opacity="0.4" />
      <circle cx="78" cy="173" r="3" fill="#2E7D32" opacity="0.4" />
      <circle cx="119" cy="173" r="3" fill="#2E7D32" opacity="0.4" />
      <circle cx="125" cy="173" r="3" fill="#2E7D32" opacity="0.4" />
      <circle cx="131" cy="175" r="3" fill="#2E7D32" opacity="0.4" />

      {/* ---- HEAD ---- */}
      <circle cx="100" cy="72" r="38" fill="#4CAF50" />

      {/* ---- HORNS ---- */}
      <ellipse cx="78" cy="40" rx="5" ry="10" fill="#FFD54F" stroke="#F9A825" strokeWidth="1" transform="rotate(-10 78 40)" />
      <ellipse cx="122" cy="40" rx="5" ry="10" fill="#FFD54F" stroke="#F9A825" strokeWidth="1" transform="rotate(10 122 40)" />

      {/* ---- SNOUT / MUZZLE ---- */}
      <ellipse cx="100" cy="82" rx="18" ry="12" fill="#81C784" />

      {/* ---- NOSTRILS ---- */}
      <ellipse cx="94" cy="79" rx="2.5" ry="2" fill="#2E7D32" opacity="0.5" />
      <ellipse cx="106" cy="79" rx="2.5" ry="2" fill="#2E7D32" opacity="0.5" />

      {/* ---- EYES ---- */}
      {isSleeping ? (
        <>
          {/* Sleeping crescent eyes */}
          <path d="M78 67 Q83 62 88 67" fill="none" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M112 67 Q117 62 122 67" fill="none" stroke="#1B5E20" strokeWidth="2.5" strokeLinecap="round" />
          {/* ZZZ */}
          <text x="140" y="45" fill="#7c3aed" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="14" opacity="0.7">z</text>
          <text x="150" y="33" fill="#7c3aed" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="11" opacity="0.5">z</text>
          <text x="157" y="24" fill="#7c3aed" fontFamily="Nunito, sans-serif" fontWeight="800" fontSize="9" opacity="0.35">z</text>
        </>
      ) : (
        <>
          {/* Eye whites */}
          <ellipse cx="83" cy="65" rx="12" ry="13" fill="#F0F4FF" stroke="#2E7D32" strokeWidth="1.5" />
          <ellipse cx="117" cy="65" rx="12" ry="13" fill="#F0F4FF" stroke="#2E7D32" strokeWidth="1.5" />

          {/* Irises — golden amber */}
          <circle cx="85" cy="66" r="7" fill="var(--warning)" />
          <circle cx="115" cy="66" r="7" fill="var(--warning)" />

          {/* Pupils */}
          <circle cx="86" cy="66" r="3.5" fill="#1a1a1a" />
          <circle cx="116" cy="66" r="3.5" fill="#1a1a1a" />

          {/* Highlights */}
          <circle cx="89" cy="63" r="2" fill="#F0F4FF" opacity="0.9" />
          <circle cx="119" cy="63" r="2" fill="#F0F4FF" opacity="0.9" />
          <circle cx="84" cy="69" r="1" fill="#F0F4FF" opacity="0.5" />
          <circle cx="114" cy="69" r="1" fill="#F0F4FF" opacity="0.5" />
        </>
      )}

      {/* ---- CHEEK BLUSH ---- */}
      <circle cx="68" cy="78" r="7" fill="#F48FB1" opacity="0.25" />
      <circle cx="132" cy="78" r="7" fill="#F48FB1" opacity="0.25" />

      {/* ---- MOUTH ---- */}
      {isSleeping ? (
        /* Tiny closed mouth */
        <ellipse cx="100" cy="88" rx="4" ry="1.5" fill="#2E7D32" opacity="0.4" />
      ) : mood === 'excited' ? (
        /* Open happy mouth */
        <path d="M90 86 Q100 96 110 86" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1.5" />
      ) : (
        /* Gentle smile */
        <path d="M91 87 Q100 93 109 87" fill="none" stroke="#1B5E20" strokeWidth="2" strokeLinecap="round" />
      )}

      {/* ---- ARMS ---- */}
      {isWaving ? (
        <>
          {/* Left arm normal */}
          <path
            d="M62 115 Q50 120 48 130 Q47 135 52 134"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right arm waving — animated via CSS on the group */}
          <g style={{ transformOrigin: '138px 115px', animation: animate ? 'mimi-wave 0.8s ease-in-out infinite' : 'none' }}>
            <path
              d="M138 115 Q152 100 155 88 Q156 83 151 86"
              fill="#4CAF50"
              stroke="#2E7D32"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Little hand/paw */}
            <circle cx="153" cy="86" r="4" fill="#4CAF50" stroke="#2E7D32" strokeWidth="1.5" />
          </g>
        </>
      ) : (
        <>
          {/* Left arm */}
          <path
            d="M62 115 Q50 120 48 130 Q47 135 52 134"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right arm */}
          <path
            d="M138 115 Q150 120 152 130 Q153 135 148 134"
            fill="#4CAF50"
            stroke="#2E7D32"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}

      {/* ---- SPINES along the back of the head ---- */}
      <circle cx="100" cy="35" r="3.5" fill="#2E7D32" />
      <circle cx="92" cy="37" r="2.5" fill="#2E7D32" opacity="0.7" />
      <circle cx="108" cy="37" r="2.5" fill="#2E7D32" opacity="0.7" />
    </svg>
  );
};

export default MimiMascot;
