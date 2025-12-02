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
          viewBox="0 0 200 200" 
          className="dragon-svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Dragon Body */}
          <ellipse 
            cx="100" 
            cy="120" 
            rx="45" 
            ry="50" 
            fill="url(#bodyGradient)"
            className="dragon-body"
          />
          
          {/* Belly */}
          <ellipse 
            cx="100" 
            cy="130" 
            rx="32" 
            ry="38" 
            fill="url(#bellyGradient)"
            className="dragon-belly"
          />
          
          {/* Head */}
          <ellipse 
            cx="100" 
            cy="60" 
            rx="35" 
            ry="32" 
            fill="url(#headGradient)"
            className="dragon-head"
          />
          
          {/* Left Horn */}
          <ellipse 
            cx="72" 
            cy="32" 
            rx="8" 
            ry="18" 
            fill="#FFD93D"
            transform="rotate(-20 72 32)"
            className="dragon-horn"
          />
          
          {/* Right Horn */}
          <ellipse 
            cx="128" 
            cy="32" 
            rx="8" 
            ry="18" 
            fill="#FFD93D"
            transform="rotate(20 128 32)"
            className="dragon-horn"
          />
          
          {/* Left Eye White */}
          <ellipse cx="82" cy="55" rx="14" ry="16" fill="white" className="dragon-eye-white"/>
          
          {/* Right Eye White */}
          <ellipse cx="118" cy="55" rx="14" ry="16" fill="white" className="dragon-eye-white"/>
          
          {/* Left Pupil */}
          <ellipse cx="85" cy="57" rx="7" ry="9" fill="#1a1a2e" className="dragon-pupil"/>
          
          {/* Right Pupil */}
          <ellipse cx="121" cy="57" rx="7" ry="9" fill="#1a1a2e" className="dragon-pupil"/>
          
          {/* Left Eye Sparkle */}
          <circle cx="88" cy="52" r="3" fill="white" className="dragon-sparkle"/>
          
          {/* Right Eye Sparkle */}
          <circle cx="124" cy="52" r="3" fill="white" className="dragon-sparkle"/>
          
          {/* Left Cheek */}
          <ellipse cx="62" cy="68" rx="10" ry="7" fill="#FF99B3" opacity="0.7" className="dragon-cheek"/>
          
          {/* Right Cheek */}
          <ellipse cx="138" cy="68" rx="10" ry="7" fill="#FF99B3" opacity="0.7" className="dragon-cheek"/>
          
          {/* Snout */}
          <ellipse cx="100" cy="75" rx="12" ry="8" fill="#5CB85C"/>
          
          {/* Nostrils */}
          <circle cx="95" cy="74" r="2" fill="#2E7D32"/>
          <circle cx="105" cy="74" r="2" fill="#2E7D32"/>
          
          {/* Smile */}
          <path 
            d="M 90 82 Q 100 92 110 82" 
            stroke="#2E7D32" 
            strokeWidth="2.5" 
            fill="none"
            strokeLinecap="round"
            className="dragon-smile"
          />
          
          {/* Left Arm */}
          <ellipse 
            cx="55" 
            cy="115" 
            rx="12" 
            ry="20" 
            fill="url(#bodyGradient)"
            transform="rotate(25 55 115)"
            className="dragon-arm"
          />
          
          {/* Right Arm */}
          <ellipse 
            cx="145" 
            cy="115" 
            rx="12" 
            ry="20" 
            fill="url(#bodyGradient)"
            transform="rotate(-25 145 115)"
            className="dragon-arm"
          />
          
          {/* Left Leg */}
          <ellipse cx="75" cy="165" rx="14" ry="18" fill="url(#bodyGradient)" className="dragon-leg"/>
          
          {/* Right Leg */}
          <ellipse cx="125" cy="165" rx="14" ry="18" fill="url(#bodyGradient)" className="dragon-leg"/>
          
          {/* Tail */}
          <path 
            d="M 145 140 Q 170 130 175 150 Q 180 170 160 175 Q 150 178 155 165"
            fill="url(#bodyGradient)"
            className="dragon-tail"
          />
          
          {/* Tail spikes */}
          <circle cx="175" cy="155" r="5" fill="#FFD93D"/>
          <circle cx="165" cy="172" r="4" fill="#FFD93D"/>
          
          {/* Wing Left */}
          <path 
            d="M 55 95 Q 30 70 35 100 Q 30 110 50 115"
            fill="url(#wingGradient)"
            opacity="0.8"
            className="dragon-wing"
          />
          
          {/* Wing Right */}
          <path 
            d="M 145 95 Q 170 70 165 100 Q 170 110 150 115"
            fill="url(#wingGradient)"
            opacity="0.8"
            className="dragon-wing"
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6BCB77"/>
              <stop offset="100%" stopColor="#4CAF50"/>
            </linearGradient>
            <linearGradient id="bellyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#A8E6CF"/>
              <stop offset="100%" stopColor="#88D4AB"/>
            </linearGradient>
            <linearGradient id="headGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6BCB77"/>
              <stop offset="100%" stopColor="#5CB85C"/>
            </linearGradient>
            <linearGradient id="wingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#81C784"/>
              <stop offset="100%" stopColor="#66BB6A"/>
            </linearGradient>
          </defs>
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
