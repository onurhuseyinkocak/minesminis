import React, { useState, useEffect } from 'react';
import './ProfessorPaws.css';

type ViewDirection = 'front' | 'left' | 'right';

interface ProfessorPawsProps {
  bearState: 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping';
  facingDirection: 'left' | 'right';
  viewDirection?: ViewDirection;
  isHovered?: boolean;
  onClick?: () => void;
}

const ProfessorPaws: React.FC<ProfessorPawsProps> = ({ 
  bearState, 
  facingDirection, 
  viewDirection = 'front',
  isHovered = false,
  onClick 
}) => {
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(false);
  const [hearts, setHearts] = useState<{ id: string, x: number, y: number }[]>([]);
  const [musicNotes, setMusicNotes] = useState<{ id: string, x: number }[]>([]);
  const [eyeSparkle, setEyeSparkle] = useState(false);
  const [earWiggle, setEarWiggle] = useState(false);

  useEffect(() => {
    const blinkLoop = () => {
      if (bearState !== 'sleeping') {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
      }
      setTimeout(blinkLoop, 2500 + Math.random() * 3000);
    };
    const timeout = setTimeout(blinkLoop, 2000);
    return () => clearTimeout(timeout);
  }, [bearState]);

  useEffect(() => {
    if (bearState === 'singing' || bearState === 'laughing') {
      const mouthLoop = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 200);
      return () => clearInterval(mouthLoop);
    } else {
      setMouthOpen(false);
    }
  }, [bearState]);

  useEffect(() => {
    const sparkleLoop = () => {
      setEyeSparkle(true);
      setTimeout(() => setEyeSparkle(false), 500);
      setTimeout(sparkleLoop, 5000 + Math.random() * 5000);
    };
    const timeout = setTimeout(sparkleLoop, 3000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let heartCounter = 0;
    const heartLoop = () => {
      if ((bearState === 'love' || bearState === 'celebrating' || Math.random() > 0.85) && bearState !== 'sleeping') {
        const id = `heart-${Date.now()}-${heartCounter++}-${Math.random().toString(36).substr(2, 5)}`;
        setHearts(prev => [...prev, { id, x: Math.random() * 40 - 20, y: 0 }]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== id));
        }, 2000);
      }
      setTimeout(heartLoop, bearState === 'love' ? 500 : 3000);
    };
    const timeout = setTimeout(heartLoop, 2000);
    return () => clearTimeout(timeout);
  }, [bearState]);

  useEffect(() => {
    let noteCounter = 0;
    if (bearState === 'singing') {
      const noteLoop = setInterval(() => {
        const id = `note-${Date.now()}-${noteCounter++}-${Math.random().toString(36).substr(2, 5)}`;
        setMusicNotes(prev => [...prev, { id, x: Math.random() * 30 - 15 }]);
        setTimeout(() => {
          setMusicNotes(prev => prev.filter(n => n.id !== id));
        }, 2000);
      }, 400);
      return () => clearInterval(noteLoop);
    }
  }, [bearState]);

  useEffect(() => {
    if (isHovered) {
      setEarWiggle(true);
      const timeout = setTimeout(() => setEarWiggle(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [isHovered]);

  const getEyeStyle = () => {
    if (bearState === 'sleeping') return 'sleeping';
    if (bearState === 'laughing') return 'happy';
    if (bearState === 'love') return 'love';
    if (bearState === 'surprised') return 'surprised';
    if (bearState === 'thinking') return 'thinking';
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

  const getViewTransform = () => {
    if (viewDirection === 'left') {
      return 'perspective(400px) rotateY(-25deg)';
    } else if (viewDirection === 'right') {
      return 'perspective(400px) rotateY(25deg)';
    }
    return 'perspective(400px) rotateY(0deg)';
  };

  const getBodySkew = () => {
    if (viewDirection === 'left') return -3;
    if (viewDirection === 'right') return 3;
    return 0;
  };

  return (
    <div
      className={`professor-paws-container state-${bearState} view-${viewDirection} ${isHovered ? 'is-hovered' : ''} ${earWiggle ? 'ear-wiggle' : ''}`}
      onClick={onClick}
      style={{
        transform: getViewTransform(),
        cursor: 'pointer',
        transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{ left: `calc(50% + ${heart.x}px)`, top: '10px' }}
        >
          💖
        </div>
      ))}

      {musicNotes.map(note => (
        <div
          key={note.id}
          className="floating-note"
          style={{ left: `calc(50% + ${note.x}px)`, top: '-10px' }}
        >
          {['🎵', '🎶', '♪'][Math.floor(Math.random() * 3)]}
        </div>
      ))}

      <svg className="character-svg" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="bodyGradientMimi" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FFE4C4" />
            <stop offset="50%" stopColor="#DEB887" />
            <stop offset="100%" stopColor="#D2691E" />
          </radialGradient>
          <radialGradient id="bellyGradientMimi" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFF8DC" />
            <stop offset="100%" stopColor="#FAEBD7" />
          </radialGradient>
          <radialGradient id="cheekGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFB6C1" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFB6C1" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="eyeShine" cx="30%" cy="30%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.15" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="sparkle">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="limb arm-back" style={{ transform: `skewX(${getBodySkew()}deg)` }}>
          <ellipse cx={viewDirection === 'left' ? 60 : viewDirection === 'right' ? 50 : 55} cy="150" rx="14" ry="28" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
          <ellipse cx={viewDirection === 'left' ? 57 : viewDirection === 'right' ? 47 : 52} cy="172" rx="10" ry="10" fill="#D2691E" />
        </g>

        <g className="limb leg-back" style={{ transform: `skewX(${getBodySkew()}deg)` }}>
          <ellipse cx={viewDirection === 'left' ? 75 : viewDirection === 'right' ? 65 : 70} cy="205" rx="16" ry="22" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
          <ellipse cx={viewDirection === 'left' ? 73 : viewDirection === 'right' ? 63 : 68} cy="222" rx="12" ry="8" fill="#A0522D" />
        </g>

        <g style={{ transform: `skewX(${getBodySkew()}deg)` }}>
          <ellipse cx="100" cy="165" rx="48" ry="55" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
          <ellipse cx="100" cy="170" rx="32" ry="38" fill="url(#bellyGradientMimi)" opacity="0.9" />
        </g>

        <g className="limb leg-front" style={{ transform: `skewX(${getBodySkew()}deg)` }}>
          <ellipse cx={viewDirection === 'left' ? 135 : viewDirection === 'right' ? 125 : 130} cy="205" rx="16" ry="22" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
          <ellipse cx={viewDirection === 'left' ? 137 : viewDirection === 'right' ? 127 : 132} cy="222" rx="12" ry="8" fill="#A0522D" />
        </g>

        <g className="head-group">
          <g className={`ear-left ${earWiggle ? 'wiggling' : ''}`}>
            <ellipse cx={viewDirection === 'left' ? 65 : viewDirection === 'right' ? 55 : 60} cy="50" rx="18" ry="18" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
            <ellipse cx={viewDirection === 'left' ? 65 : viewDirection === 'right' ? 55 : 60} cy="50" rx="10" ry="10" fill="#FFB6C1" opacity="0.6" />
          </g>

          <g className={`ear-right ${earWiggle ? 'wiggling' : ''}`}>
            <ellipse cx={viewDirection === 'left' ? 145 : viewDirection === 'right' ? 135 : 140} cy="50" rx="18" ry="18" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
            <ellipse cx={viewDirection === 'left' ? 145 : viewDirection === 'right' ? 135 : 140} cy="50" rx="10" ry="10" fill="#FFB6C1" opacity="0.6" />
          </g>

          <ellipse cx="100" cy="85" rx="52" ry="48" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />

          <ellipse cx="100" cy="105" rx="22" ry="18" fill="#FAEBD7" opacity="0.8" />

          <circle cx={viewDirection === 'left' ? 72 : viewDirection === 'right' ? 64 : 68} cy="100" r="14" fill="url(#cheekGlow)" />
          <circle cx={viewDirection === 'left' ? 136 : viewDirection === 'right' ? 128 : 132} cy="100" r="14" fill="url(#cheekGlow)" />

          <g className={`eyes eyes-${getEyeStyle()}`}>
            <g className="eye-left" transform={blink ? "translate(0, 85) scale(1, 0.1)" : ""}>
              {getEyeStyle() === 'love' ? (
                <text x={viewDirection === 'left' ? 80 : viewDirection === 'right' ? 70 : 75} y="90" fontSize="18" textAnchor="middle">❤️</text>
              ) : getEyeStyle() === 'sleeping' ? (
                <path d={`M${viewDirection === 'left' ? 72 : viewDirection === 'right' ? 62 : 67},82 Q${viewDirection === 'left' ? 80 : viewDirection === 'right' ? 70 : 75},88 ${viewDirection === 'left' ? 88 : viewDirection === 'right' ? 78 : 83},82`} fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse cx={viewDirection === 'left' ? 80 : viewDirection === 'right' ? 70 : 75} cy="82" rx={getEyeStyle() === 'surprised' ? 12 : 10} ry={getEyeStyle() === 'surprised' ? 14 : 12} fill="#333" />
                  <ellipse cx={viewDirection === 'left' ? 80 : viewDirection === 'right' ? 70 : 75} cy="82" rx="8" ry="10" fill="url(#eyeShine)" />
                  <circle cx={viewDirection === 'left' ? 83 : viewDirection === 'right' ? 73 : 78} cy="78" r="4" fill="white" />
                  <circle cx={viewDirection === 'left' ? 77 : viewDirection === 'right' ? 67 : 72} cy="84" r="2" fill="white" opacity="0.6" />
                  {eyeSparkle && (
                    <g filter="url(#sparkle)">
                      <text x={viewDirection === 'left' ? 87 : viewDirection === 'right' ? 77 : 82} y="76" fontSize="8">✨</text>
                    </g>
                  )}
                </>
              )}
            </g>
            <g className="eye-right" transform={blink ? "translate(0, 85) scale(1, 0.1)" : ""}>
              {getEyeStyle() === 'love' ? (
                <text x={viewDirection === 'left' ? 130 : viewDirection === 'right' ? 120 : 125} y="90" fontSize="18" textAnchor="middle">❤️</text>
              ) : getEyeStyle() === 'sleeping' ? (
                <path d={`M${viewDirection === 'left' ? 122 : viewDirection === 'right' ? 112 : 117},82 Q${viewDirection === 'left' ? 130 : viewDirection === 'right' ? 120 : 125},88 ${viewDirection === 'left' ? 138 : viewDirection === 'right' ? 128 : 133},82`} fill="none" stroke="#333" strokeWidth="3" strokeLinecap="round" />
              ) : (
                <>
                  <ellipse cx={viewDirection === 'left' ? 130 : viewDirection === 'right' ? 120 : 125} cy="82" rx={getEyeStyle() === 'surprised' ? 12 : 10} ry={getEyeStyle() === 'surprised' ? 14 : 12} fill="#333" />
                  <ellipse cx={viewDirection === 'left' ? 130 : viewDirection === 'right' ? 120 : 125} cy="82" rx="8" ry="10" fill="url(#eyeShine)" />
                  <circle cx={viewDirection === 'left' ? 133 : viewDirection === 'right' ? 123 : 128} cy="78" r="4" fill="white" />
                  <circle cx={viewDirection === 'left' ? 127 : viewDirection === 'right' ? 117 : 122} cy="84" r="2" fill="white" opacity="0.6" />
                  {eyeSparkle && (
                    <g filter="url(#sparkle)">
                      <text x={viewDirection === 'left' ? 137 : viewDirection === 'right' ? 127 : 132} y="76" fontSize="8">✨</text>
                    </g>
                  )}
                </>
              )}
            </g>
          </g>

          <g className={`eyebrows brow-${bearState}`}>
            {bearState === 'thinking' && (
              <>
                <path d="M65,68 Q75,62 85,68" fill="none" stroke="#8B4513" strokeWidth="2" />
                <path d="M115,62 Q125,58 135,64" fill="none" stroke="#8B4513" strokeWidth="2" />
              </>
            )}
            {bearState === 'surprised' && (
              <>
                <path d="M65,62 Q75,56 85,62" fill="none" stroke="#8B4513" strokeWidth="2" />
                <path d="M115,62 Q125,56 135,62" fill="none" stroke="#8B4513" strokeWidth="2" />
              </>
            )}
          </g>

          <ellipse cx="100" cy="100" rx="8" ry="6" fill="#5D3A1A" className="nose" />
          <ellipse cx="100" cy="100" rx="3" ry="2" fill="#8B5A2B" opacity="0.5" />

          <g className={`mouth mouth-${getMouthStyle()}`}>
            {getMouthStyle() === 'smile' && (
              <path d="M88,112 Q100,125 112,112" fill="none" stroke="#5D3A1A" strokeWidth="3" strokeLinecap="round" />
            )}
            {getMouthStyle() === 'laugh' && (
              <path d="M85,110 Q100,130 115,110" fill="#FFB6C1" stroke="#5D3A1A" strokeWidth="2" />
            )}
            {getMouthStyle() === 'laugh-open' && (
              <>
                <ellipse cx="100" cy="118" rx="15" ry="12" fill="#FF6B6B" />
                <ellipse cx="100" cy="124" rx="8" ry="5" fill="#FFB6C1" />
              </>
            )}
            {getMouthStyle() === 'sing' && (
              <ellipse cx="100" cy="115" rx="8" ry="6" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" />
            )}
            {getMouthStyle() === 'sing-open' && (
              <ellipse cx="100" cy="115" rx="10" ry="10" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" />
            )}
            {getMouthStyle() === 'surprised' && (
              <ellipse cx="100" cy="115" rx="8" ry="10" fill="#FF6B6B" stroke="#5D3A1A" strokeWidth="2" />
            )}
            {getMouthStyle() === 'kiss' && (
              <ellipse cx="100" cy="112" rx="5" ry="6" fill="#FF69B4" />
            )}
            {getMouthStyle() === 'sleep' && (
              <path d="M95,110 Q100,105 105,110" fill="none" stroke="#5D3A1A" strokeWidth="2" strokeLinecap="round" />
            )}
          </g>

          {bearState === 'thinking' && (
            <g className="thinking-dots">
              <circle cx="150" cy="60" r="4" fill="#DEB887" opacity="0.6">
                <animate attributeName="opacity" values="0.6;1;0.6" dur="1s" repeatCount="indefinite" />
              </circle>
              <circle cx="160" cy="45" r="6" fill="#DEB887" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" begin="0.3s" repeatCount="indefinite" />
              </circle>
              <circle cx="175" cy="30" r="8" fill="#DEB887" opacity="0.4">
                <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" begin="0.6s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {bearState === 'sleeping' && (
            <g className="zzz-bubbles">
              <text x="145" y="50" fontSize="14" fill="#6B8E23" opacity="0.8">
                Z
                <animate attributeName="y" values="50;30" dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
              </text>
              <text x="155" y="40" fontSize="12" fill="#6B8E23" opacity="0.6">
                z
                <animate attributeName="y" values="40;15" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              </text>
              <text x="165" y="30" fontSize="10" fill="#6B8E23" opacity="0.4">
                z
                <animate attributeName="y" values="30;5" dur="3s" begin="1s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0" dur="3s" begin="1s" repeatCount="indefinite" />
              </text>
            </g>
          )}
        </g>

        <g className="limb arm-front" style={{ transform: `skewX(${getBodySkew()}deg)` }}>
          <ellipse cx={viewDirection === 'left' ? 150 : viewDirection === 'right' ? 140 : 145} cy="150" rx="14" ry="28" fill="url(#bodyGradientMimi)" filter="url(#softGlow)" />
          <ellipse cx={viewDirection === 'left' ? 153 : viewDirection === 'right' ? 143 : 148} cy="172" rx="10" ry="10" fill="#D2691E" />
        </g>

        {bearState === 'waving' && (
          <g className="waving-sparkles">
            <text x="160" y="130" fontSize="12">✨</text>
            <text x="170" y="140" fontSize="10">⭐</text>
          </g>
        )}
      </svg>

      <div className="character-shadow"></div>
    </div>
  );
};

export default ProfessorPaws;
