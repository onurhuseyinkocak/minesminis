import React, { useState, useEffect } from 'react';
import './ProfessorPaws.css';

type ViewDirection = 'front' | 'left' | 'right';

interface ProfessorPawsProps {
  bearState: 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping';
  viewDirection?: ViewDirection;
  isHovered?: boolean;
  onClick?: () => void;
}

const ProfessorPaws: React.FC<ProfessorPawsProps> = ({ 
  bearState, 
  viewDirection = 'front',
  isHovered = false,
  onClick 
}) => {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    const blinkLoop = () => {
      if (bearState !== 'sleeping') {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }
      setTimeout(blinkLoop, 3000 + Math.random() * 2000);
    };
    const timeout = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(timeout);
  }, [bearState]);

  useEffect(() => {
    if (bearState === 'singing' || bearState === 'laughing') {
      const mouthLoop = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 250);
      return () => clearInterval(mouthLoop);
    } else {
      setMouthOpen(false);
    }
  }, [bearState]);

  const getEyeStyle = () => {
    if (bearState === 'sleeping') return 'sleeping';
    if (bearState === 'laughing') return 'happy';
    if (bearState === 'love') return 'love';
    if (bearState === 'surprised') return 'surprised';
    return 'normal';
  };

  const getMouthStyle = () => {
    if (bearState === 'sleeping') return 'sleep';
    if (bearState === 'laughing' || bearState === 'celebrating') return mouthOpen ? 'laugh-open' : 'laugh';
    if (bearState === 'singing') return mouthOpen ? 'sing-open' : 'sing';
    if (bearState === 'surprised') return 'surprised';
    if (bearState === 'love') return 'kiss';
    return 'smile';
  };

  const getScaleX = () => {
    if (viewDirection === 'left') return -1;
    return 1;
  };

  return (
    <div
      className={`professor-paws-container state-${bearState} view-${viewDirection} ${isHovered ? 'is-hovered' : ''}`}
      onClick={onClick}
      style={{
        transform: `scaleX(${getScaleX()})`,
        cursor: 'pointer'
      }}
    >
      <svg className="character-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGradientMimi" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#F5E6D3" />
            <stop offset="50%" stopColor="#E8D4C4" />
            <stop offset="100%" stopColor="#D4B8A0" />
          </radialGradient>
          <radialGradient id="bellyGradientMimi" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFF8F0" />
            <stop offset="100%" stopColor="#F5EDE5" />
          </radialGradient>
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB5C5" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFB5C5" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="noseGradient" cx="40%" cy="30%" r="60%">
            <stop offset="0%" stopColor="#4A5568" />
            <stop offset="100%" stopColor="#2D3748" />
          </radialGradient>
          <radialGradient id="earInnerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD4E0" />
            <stop offset="100%" stopColor="#FFB5C5" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#000" floodOpacity="0.1"/>
          </filter>
        </defs>

        <g className="limb leg-back">
          <ellipse cx="75" cy="200" rx="18" ry="28" fill="url(#bodyGradientMimi)" />
          <ellipse cx="75" cy="222" rx="14" ry="10" fill="#C4A484" />
          <ellipse cx="75" cy="222" rx="10" ry="7" fill="#D4B8A0" />
        </g>

        <g className="limb arm-back">
          <ellipse cx="60" cy="145" rx="16" ry="30" fill="url(#bodyGradientMimi)" />
          <ellipse cx="58" cy="170" rx="12" ry="12" fill="#C4A484" />
          <ellipse cx="58" cy="170" rx="8" ry="8" fill="#D4B8A0" />
        </g>

        <g className="body-group">
          <ellipse cx="100" cy="160" rx="52" ry="58" fill="url(#bodyGradientMimi)" filter="url(#softShadow)" />
          <ellipse cx="100" cy="165" rx="38" ry="42" fill="url(#bellyGradientMimi)" />
        </g>

        <g className="limb leg-front">
          <ellipse cx="125" cy="200" rx="18" ry="28" fill="url(#bodyGradientMimi)" />
          <ellipse cx="125" cy="222" rx="14" ry="10" fill="#C4A484" />
          <ellipse cx="125" cy="222" rx="10" ry="7" fill="#D4B8A0" />
        </g>

        <g className="head-group">
          <g className="ear-left">
            <ellipse cx="55" cy="48" rx="22" ry="22" fill="url(#bodyGradientMimi)" />
            <ellipse cx="55" cy="48" rx="14" ry="14" fill="url(#earInnerGradient)" />
          </g>

          <g className="ear-right">
            <ellipse cx="145" cy="48" rx="22" ry="22" fill="url(#bodyGradientMimi)" />
            <ellipse cx="145" cy="48" rx="14" ry="14" fill="url(#earInnerGradient)" />
          </g>

          <ellipse cx="100" cy="82" rx="55" ry="50" fill="url(#bodyGradientMimi)" filter="url(#softShadow)" />

          <ellipse cx="100" cy="100" rx="22" ry="16" fill="#FFF8F0" opacity="0.9" />

          <circle cx="68" cy="95" r="16" fill="url(#cheekGlow)" />
          <circle cx="132" cy="95" r="16" fill="url(#cheekGlow)" />

          <g className={`eyes eyes-${getEyeStyle()}`}>
            <g className="eye-left" style={{ transform: blink ? 'scaleY(0.1)' : 'scaleY(1)', transformOrigin: '75px 78px', transition: 'transform 0.1s' }}>
              {getEyeStyle() === 'love' ? (
                <text x="75" y="85" fontSize="20" textAnchor="middle">❤️</text>
              ) : getEyeStyle() === 'sleeping' ? (
                <path d="M65,78 Q75,84 85,78" fill="none" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
              ) : getEyeStyle() === 'happy' ? (
                <path d="M65,80 Q75,72 85,80" fill="none" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse cx="75" cy="78" rx={getEyeStyle() === 'surprised' ? 10 : 8} ry={getEyeStyle() === 'surprised' ? 12 : 10} fill="#2D3748" />
                  <circle cx="78" cy="74" r="3" fill="white" />
                  <circle cx="73" cy="80" r="1.5" fill="white" opacity="0.6" />
                </>
              )}
            </g>
            <g className="eye-right" style={{ transform: blink ? 'scaleY(0.1)' : 'scaleY(1)', transformOrigin: '125px 78px', transition: 'transform 0.1s' }}>
              {getEyeStyle() === 'love' ? (
                <text x="125" y="85" fontSize="20" textAnchor="middle">❤️</text>
              ) : getEyeStyle() === 'sleeping' ? (
                <path d="M115,78 Q125,84 135,78" fill="none" stroke="#4A5568" strokeWidth="3" strokeLinecap="round" />
              ) : getEyeStyle() === 'happy' ? (
                <path d="M115,80 Q125,72 135,80" fill="none" stroke="#2D3748" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse cx="125" cy="78" rx={getEyeStyle() === 'surprised' ? 10 : 8} ry={getEyeStyle() === 'surprised' ? 12 : 10} fill="#2D3748" />
                  <circle cx="128" cy="74" r="3" fill="white" />
                  <circle cx="123" cy="80" r="1.5" fill="white" opacity="0.6" />
                </>
              )}
            </g>
          </g>

          <ellipse cx="100" cy="98" rx="10" ry="7" fill="url(#noseGradient)" className="nose" />
          <ellipse cx="98" cy="96" rx="3" ry="2" fill="#718096" opacity="0.4" />

          <g className={`mouth mouth-${getMouthStyle()}`}>
            {getMouthStyle() === 'smile' && (
              <path d="M88,110 Q100,122 112,110" fill="none" stroke="#4A5568" strokeWidth="2.5" strokeLinecap="round" />
            )}
            {getMouthStyle() === 'laugh' && (
              <path d="M85,108 Q100,124 115,108" fill="#FFB5C5" stroke="#4A5568" strokeWidth="2" />
            )}
            {getMouthStyle() === 'laugh-open' && (
              <>
                <ellipse cx="100" cy="115" rx="14" ry="10" fill="#E53E3E" opacity="0.8" />
                <ellipse cx="100" cy="120" rx="8" ry="4" fill="#FFB5C5" />
              </>
            )}
            {getMouthStyle() === 'sing' && (
              <ellipse cx="100" cy="112" rx="7" ry="5" fill="#E53E3E" opacity="0.7" stroke="#4A5568" strokeWidth="1.5" />
            )}
            {getMouthStyle() === 'sing-open' && (
              <ellipse cx="100" cy="112" rx="9" ry="8" fill="#E53E3E" opacity="0.8" stroke="#4A5568" strokeWidth="1.5" />
            )}
            {getMouthStyle() === 'surprised' && (
              <ellipse cx="100" cy="112" rx="7" ry="9" fill="#E53E3E" opacity="0.7" stroke="#4A5568" strokeWidth="1.5" />
            )}
            {getMouthStyle() === 'kiss' && (
              <ellipse cx="100" cy="110" rx="4" ry="5" fill="#FF6B9D" />
            )}
            {getMouthStyle() === 'sleep' && (
              <path d="M95,108 Q100,104 105,108" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>

          {bearState === 'sleeping' && (
            <g className="zzz-bubbles">
              <text x="150" y="50" fontSize="16" fill="#6B7FA3" opacity="0.9" fontWeight="bold">
                Z
                <animate attributeName="y" values="50;25" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.9;0" dur="2s" repeatCount="indefinite" />
              </text>
              <text x="162" y="38" fontSize="12" fill="#6B7FA3" opacity="0.7" fontWeight="bold">
                z
                <animate attributeName="y" values="38;10" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              </text>
            </g>
          )}
        </g>

        <g className="limb arm-front">
          <ellipse cx="140" cy="145" rx="16" ry="30" fill="url(#bodyGradientMimi)" />
          <ellipse cx="142" cy="170" rx="12" ry="12" fill="#C4A484" />
          <ellipse cx="142" cy="170" rx="8" ry="8" fill="#D4B8A0" />
        </g>
      </svg>

      <div className="character-shadow"></div>
    </div>
  );
};

export default ProfessorPaws;
