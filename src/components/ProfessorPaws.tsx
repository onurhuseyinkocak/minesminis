import React, { useState, useEffect, useRef } from 'react';
import './ProfessorPaws.css';

interface ProfessorPawsProps {
  bearState: 'idle' | 'walking' | 'running' | 'dancing' | 'sleeping' | 'celebrating' | 'waving';
  facingDirection: 'left' | 'right';
  onClick?: () => void;
}

const ProfessorPaws: React.FC<ProfessorPawsProps> = ({ bearState, facingDirection, onClick }) => {
  const [chatMessage, setChatMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [blink, setBlink] = useState(false);
  const [hearts, setHearts] = useState<{ id: number, x: number, y: number }[]>([]);

  // Auto Blink Logic
  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200); // Slower blink
      setTimeout(blinkLoop, 3000 + Math.random() * 4000);
    };
    const timeout = setTimeout(blinkLoop, 3000);
    return () => clearTimeout(timeout);
  }, []);

  // Random Hearts Logic
  useEffect(() => {
    const heartLoop = () => {
      if (Math.random() > 0.8 && bearState !== 'sleeping') {
        const id = Date.now();
        setHearts(prev => [...prev, { id, x: Math.random() * 30 - 15, y: 0 }]);
        setTimeout(() => {
          setHearts(prev => prev.filter(h => h.id !== id));
        }, 2500);
      }
      setTimeout(heartLoop, 4000);
    };
    const timeout = setTimeout(heartLoop, 4000);
    return () => clearTimeout(timeout);
  }, [bearState]);

  // Chat Bubble Logic
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const showMessage = (msg: string, duration: number = 3000) => {
      setChatMessage(msg);
      setIsVisible(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setChatMessage(null), 500);
      }, duration);
    };

    if (bearState === 'sleeping') showMessage("Zzz... ☁️", 5000);
    else if (bearState === 'celebrating') showMessage("Yaşasın! 🎈", 3000);
    else if (bearState === 'waving') showMessage("Merhaba! 👋", 3000);

    return () => clearTimeout(timeout);
  }, [bearState]);

  return (
    <div
      className={`professor-paws-container state-${bearState}`}
      onClick={onClick}
      style={{
        transform: `scaleX(${facingDirection === 'right' ? 1 : -1})`,
        cursor: 'pointer'
      }}
    >
      {/* Chat Bubble */}
      {chatMessage && (
        <div
          className={`chat-bubble ${isVisible ? 'visible' : ''}`}
          style={{ transform: `scaleX(${facingDirection === 'right' ? 1 : -1})` }}
        >
          {chatMessage}
        </div>
      )}

      {/* Floating Hearts */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="floating-heart"
          style={{ left: `calc(50% + ${heart.x}px)`, top: '10px' }}
        >
          💖
        </div>
      ))}

      {/* --- NEW CHUBBY SVG --- */}
      <svg className="character-svg" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Soft Pastel Gradients */}
          <radialGradient id="bodyGradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#B2F0F5" /> {/* Very Light Turquoise */}
            <stop offset="100%" stopColor="#6EDCD9" /> {/* Soft Turquoise */}
          </radialGradient>
          <radialGradient id="bellyGradient" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#E6FFFF" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- LIMBS (Integrated look) --- */}

        {/* Back Arm */}
        <g className="limb arm-back">
          <ellipse cx="65" cy="135" rx="12" ry="25" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

        {/* Back Leg */}
        <g className="limb leg-back">
          <ellipse cx="80" cy="185" rx="14" ry="20" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

        {/* --- MAIN BODY (Chubby Pear Shape) --- */}
        <path
          d="M 70 120 
                       Q 60 190 100 195 
                       Q 140 190 130 120 
                       Q 125 90 100 90 
                       Q 75 90 70 120"
          fill="url(#bodyGradient)"
          filter="url(#softShadow)"
        />

        {/* Belly Patch (Soft & Round) */}
        <ellipse cx="100" cy="150" rx="28" ry="35" fill="url(#bellyGradient)" opacity="0.8" />

        {/* Front Leg */}
        <g className="limb leg-front">
          <ellipse cx="120" cy="185" rx="14" ry="20" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

        {/* --- HEAD (Round & Cute) --- */}
        <g className="head-group">
          {/* Ears (Small & Attached) */}
          <circle cx="72" cy="65" r="9" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          <circle cx="72" cy="65" r="5" fill="#FFC0CB" opacity="0.6" />

          <circle cx="128" cy="65" r="9" fill="url(#bodyGradient)" filter="url(#softShadow)" />
          <circle cx="128" cy="65" r="5" fill="#FFC0CB" opacity="0.6" />

          {/* Face Shape */}
          <ellipse cx="100" cy="85" rx="45" ry="40" fill="url(#bodyGradient)" filter="url(#softShadow)" />

          {/* Cheeks */}
          <circle cx="75" cy="95" r="8" fill="#FFB6C1" opacity="0.4" />
          <circle cx="125" cy="95" r="8" fill="#FFB6C1" opacity="0.4" />

          {/* Eyes (Friendly & Wide) */}
          <g className="eyes">
            {/* Left Eye */}
            <g transform={blink ? "scale(1, 0.1) translate(0, 750)" : ""}>
              <circle cx="82" cy="82" r="5" fill="#333" />
              <circle cx="84" cy="80" r="2" fill="white" />
            </g>
            {/* Right Eye */}
            <g transform={blink ? "scale(1, 0.1) translate(0, 750)" : ""}>
              <circle cx="118" cy="82" r="5" fill="#333" />
              <circle cx="120" cy="80" r="2" fill="white" />
            </g>
          </g>

          {/* Nose & Mouth (Tiny) */}
          <ellipse cx="100" cy="92" rx="4" ry="3" fill="#FF69B4" />
          <path d="M95,100 Q100,105 105,100" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Front Arm */}
        <g className="limb arm-front">
          <ellipse cx="135" cy="135" rx="12" ry="25" fill="url(#bodyGradient)" filter="url(#softShadow)" />
        </g>

      </svg>

      <div className="character-shadow"></div>
    </div>
  );
};

export default ProfessorPaws;
