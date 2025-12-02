import React, { useState, useEffect } from 'react';
import './DragonMascot.css';

interface DragonMascotProps {
  state: 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love';
  onClick?: () => void;
  isHovered?: boolean;
}

const DragonMascot: React.FC<DragonMascotProps> = ({ 
  state, 
  onClick,
  isHovered = false
}) => {
  const [showEmoji, setShowEmoji] = useState<string | null>(null);

  useEffect(() => {
    if (state === 'love') {
      setShowEmoji('❤️');
    } else if (state === 'celebrating') {
      setShowEmoji('🎉');
    } else if (state === 'thinking') {
      setShowEmoji('💭');
    } else if (state === 'sleeping') {
      setShowEmoji('💤');
    } else {
      setShowEmoji(null);
    }
  }, [state]);

  return (
    <div 
      className={`dragon-mascot-container state-${state} ${isHovered ? 'is-hovered' : ''}`}
      onClick={onClick}
    >
      <div className="dragon-animation-wrapper">
        <svg 
          viewBox="0 0 200 220" 
          className="dragon-svg"
        >
          <defs>
            <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7ED957"/>
              <stop offset="50%" stopColor="#5BC236"/>
              <stop offset="100%" stopColor="#4AAE2B"/>
            </linearGradient>
            <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C5F5A8"/>
              <stop offset="100%" stopColor="#A8E88A"/>
            </linearGradient>
            <linearGradient id="hornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FFB347"/>
              <stop offset="100%" stopColor="#FFD93D"/>
            </linearGradient>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#98E87A"/>
              <stop offset="100%" stopColor="#7ED957"/>
            </linearGradient>
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15"/>
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Tail */}
          <g className="dragon-tail">
            <path 
              d="M 145 145 Q 175 140 185 155 Q 195 175 175 185 Q 160 190 165 175 Q 170 165 155 160"
              fill="url(#bodyGrad)"
              stroke="#4AAE2B"
              strokeWidth="1"
            />
            <circle cx="185" cy="165" r="7" fill="url(#hornGrad)" className="tail-spike-1"/>
            <circle cx="175" cy="182" r="5" fill="url(#hornGrad)" className="tail-spike-2"/>
            <circle cx="162" cy="185" r="4" fill="url(#hornGrad)" className="tail-spike-3"/>
          </g>

          {/* Left Wing */}
          <g className="dragon-wing dragon-wing-left">
            <path 
              d="M 50 90 Q 20 60 25 85 Q 15 75 22 95 Q 10 90 25 105 Q 35 115 55 110"
              fill="url(#wingGrad)"
              stroke="#5BC236"
              strokeWidth="1.5"
              opacity="0.9"
            />
          </g>

          {/* Right Wing */}
          <g className="dragon-wing dragon-wing-right">
            <path 
              d="M 150 90 Q 180 60 175 85 Q 185 75 178 95 Q 190 90 175 105 Q 165 115 145 110"
              fill="url(#wingGrad)"
              stroke="#5BC236"
              strokeWidth="1.5"
              opacity="0.9"
            />
          </g>

          {/* Left Leg */}
          <g className="dragon-leg dragon-leg-left">
            <ellipse cx="72" cy="175" rx="16" ry="22" fill="url(#bodyGrad)"/>
            <ellipse cx="72" cy="192" rx="14" ry="8" fill="#4AAE2B"/>
          </g>

          {/* Right Leg */}
          <g className="dragon-leg dragon-leg-right">
            <ellipse cx="128" cy="175" rx="16" ry="22" fill="url(#bodyGrad)"/>
            <ellipse cx="128" cy="192" rx="14" ry="8" fill="#4AAE2B"/>
          </g>

          {/* Body */}
          <g className="dragon-body" filter="url(#softShadow)">
            <ellipse cx="100" cy="130" rx="50" ry="55" fill="url(#bodyGrad)"/>
            <ellipse cx="100" cy="140" rx="38" ry="42" fill="url(#bellyGrad)"/>
          </g>

          {/* Left Arm */}
          <g className="dragon-arm dragon-arm-left">
            <ellipse cx="52" cy="120" rx="14" ry="22" fill="url(#bodyGrad)" transform="rotate(25 52 120)"/>
            <ellipse cx="45" cy="138" rx="10" ry="8" fill="#4AAE2B"/>
          </g>

          {/* Right Arm */}
          <g className="dragon-arm dragon-arm-right">
            <ellipse cx="148" cy="120" rx="14" ry="22" fill="url(#bodyGrad)" transform="rotate(-25 148 120)"/>
            <ellipse cx="155" cy="138" rx="10" ry="8" fill="#4AAE2B"/>
          </g>

          {/* Head */}
          <g className="dragon-head">
            {/* Head Base */}
            <ellipse cx="100" cy="60" rx="42" ry="38" fill="url(#bodyGrad)" filter="url(#softShadow)"/>
            
            {/* Snout */}
            <ellipse cx="100" cy="78" rx="18" ry="12" fill="#6BCB55"/>
            
            {/* Left Horn */}
            <g className="dragon-horn dragon-horn-left">
              <ellipse cx="68" cy="28" rx="8" ry="20" fill="url(#hornGrad)" transform="rotate(-15 68 28)"/>
            </g>
            
            {/* Right Horn */}
            <g className="dragon-horn dragon-horn-right">
              <ellipse cx="132" cy="28" rx="8" ry="20" fill="url(#hornGrad)" transform="rotate(15 132 28)"/>
            </g>

            {/* Left Ear/Fin */}
            <path d="M 58 45 Q 45 35 50 50 Q 48 55 58 55" fill="#7ED957" className="dragon-ear-left"/>
            
            {/* Right Ear/Fin */}
            <path d="M 142 45 Q 155 35 150 50 Q 152 55 142 55" fill="#7ED957" className="dragon-ear-right"/>

            {/* Eyes Container */}
            <g className="dragon-eyes">
              {/* Left Eye */}
              <g className="dragon-eye dragon-eye-left">
                <ellipse cx="78" cy="52" rx="16" ry="18" fill="white" stroke="#E8E8E8" strokeWidth="1"/>
                <ellipse cx="80" cy="54" rx="10" ry="12" fill="#2D1B14" className="dragon-pupil"/>
                <circle cx="84" cy="48" r="4" fill="white" className="dragon-sparkle dragon-sparkle-1"/>
                <circle cx="76" cy="58" r="2" fill="white" className="dragon-sparkle dragon-sparkle-2"/>
                <ellipse cx="78" cy="52" rx="16" ry="18" fill="transparent" stroke="transparent" className="dragon-eyelid"/>
              </g>
              
              {/* Right Eye */}
              <g className="dragon-eye dragon-eye-right">
                <ellipse cx="122" cy="52" rx="16" ry="18" fill="white" stroke="#E8E8E8" strokeWidth="1"/>
                <ellipse cx="124" cy="54" rx="10" ry="12" fill="#2D1B14" className="dragon-pupil"/>
                <circle cx="128" cy="48" r="4" fill="white" className="dragon-sparkle dragon-sparkle-1"/>
                <circle cx="120" cy="58" r="2" fill="white" className="dragon-sparkle dragon-sparkle-2"/>
                <ellipse cx="122" cy="52" rx="16" ry="18" fill="transparent" stroke="transparent" className="dragon-eyelid"/>
              </g>
            </g>

            {/* Cheeks */}
            <ellipse cx="55" cy="68" rx="12" ry="8" fill="#FFB6C1" opacity="0.6" className="dragon-cheek dragon-cheek-left"/>
            <ellipse cx="145" cy="68" rx="12" ry="8" fill="#FFB6C1" opacity="0.6" className="dragon-cheek dragon-cheek-right"/>

            {/* Nostrils */}
            <circle cx="93" cy="78" r="3" fill="#4AAE2B" className="dragon-nostril"/>
            <circle cx="107" cy="78" r="3" fill="#4AAE2B" className="dragon-nostril"/>

            {/* Mouth/Smile */}
            <path 
              d="M 88 88 Q 100 100 112 88" 
              stroke="#4AAE2B" 
              strokeWidth="3" 
              fill="none"
              strokeLinecap="round"
              className="dragon-mouth"
            />

            {/* Tongue (for certain states) */}
            <path 
              d="M 100 92 Q 100 102 95 105 Q 100 103 105 105 Q 100 102 100 92" 
              fill="#FF7B9C"
              className="dragon-tongue"
              opacity="0"
            />
          </g>

          {/* Sparkle Effects */}
          <g className="dragon-sparkles">
            <circle cx="40" cy="40" r="3" fill="#FFD93D" className="ambient-sparkle sparkle-1"/>
            <circle cx="160" cy="35" r="2" fill="#FFD93D" className="ambient-sparkle sparkle-2"/>
            <circle cx="25" cy="100" r="2.5" fill="#FF6B9D" className="ambient-sparkle sparkle-3"/>
            <circle cx="175" cy="95" r="2" fill="#74B9FF" className="ambient-sparkle sparkle-4"/>
          </g>
        </svg>
      </div>
      
      {showEmoji && (
        <div className="dragon-emoji-bubble">
          <span className="emoji-float">{showEmoji}</span>
        </div>
      )}
      
      <div className="dragon-shadow"></div>
    </div>
  );
};

export default DragonMascot;
