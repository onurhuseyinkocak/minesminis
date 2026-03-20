/**
 * STORY SCENE - Visual parallax scene renderer
 * Renders CSS/SVG backgrounds for 25 background types across 5 worlds
 */

import React, { useEffect, useState } from 'react';
import type { BackgroundId } from '../../data/storyWorlds';

interface StorySceneProps {
  background: BackgroundId;
  children?: React.ReactNode;
}

// SVG scene layers per background
const SCENE_CONFIG: Record<BackgroundId, {
  sky: string;
  ground: string;
  elements: string[];
  particles?: 'fireflies' | 'bubbles' | 'snow' | 'stars' | 'sand';
}> = {
  // FOREST
  'forest-clearing': {
    sky: '#87CEEB',
    ground: '#4A8B3F',
    elements: ['sun', 'clouds', 'trees', 'mushrooms', 'flowers'],
    particles: 'fireflies',
  },
  'forest-deep': {
    sky: '#3D6B35',
    ground: '#2D5A27',
    elements: ['tall-trees', 'vines', 'ferns', 'mushrooms'],
    particles: 'fireflies',
  },
  'forest-lake': {
    sky: '#87CEEB',
    ground: '#2D8B5E',
    elements: ['sun', 'clouds', 'lake', 'reeds', 'lily-pads'],
  },
  'forest-cave': {
    sky: '#1A1A2E',
    ground: '#4A3728',
    elements: ['stalactites', 'crystals', 'mushrooms'],
    particles: 'fireflies',
  },
  'forest-treehouse': {
    sky: '#87CEEB',
    ground: '#4A8B3F',
    elements: ['sun', 'big-tree', 'treehouse', 'bridge', 'flowers'],
  },
  // OCEAN
  'ocean-shore': {
    sky: '#87CEEB',
    ground: '#F4D35E',
    elements: ['sun', 'clouds', 'waves', 'shells', 'palm'],
  },
  'ocean-coral': {
    sky: '#1A5276',
    ground: '#0E3D5A',
    elements: ['coral', 'fish', 'seaweed', 'bubbles-bg'],
    particles: 'bubbles',
  },
  'ocean-deep': {
    sky: '#0A1929',
    ground: '#0E2A3E',
    elements: ['deep-fish', 'jellyfish', 'angler'],
    particles: 'bubbles',
  },
  'ocean-ship': {
    sky: '#87CEEB',
    ground: '#2E86C1',
    elements: ['sun', 'clouds', 'ship', 'waves', 'seagulls'],
  },
  'ocean-palace': {
    sky: '#1A5276',
    ground: '#0E3D5A',
    elements: ['palace', 'columns', 'fish', 'pearls'],
    particles: 'bubbles',
  },
  // MOUNTAIN
  'mountain-base': {
    sky: '#87CEEB',
    ground: '#6B8E4E',
    elements: ['mountains', 'clouds', 'pine-trees', 'path'],
  },
  'mountain-clouds': {
    sky: '#B0D4F1',
    ground: '#8B7D6B',
    elements: ['peaks', 'clouds', 'birds', 'rainbow'],
  },
  'mountain-peak': {
    sky: '#2C3E50',
    ground: '#8E44AD',
    elements: ['peak', 'stars-bg', 'snow-cap', 'flag'],
    particles: 'snow',
  },
  'mountain-cave': {
    sky: '#1A1A2E',
    ground: '#3D3D5C',
    elements: ['ice-crystals', 'stalactites', 'glow-stones'],
    particles: 'snow',
  },
  'mountain-bridge': {
    sky: '#B0D4F1',
    ground: '#8B7D6B',
    elements: ['bridge', 'clouds', 'mountains', 'eagle'],
  },
  // SPACE
  'space-station': {
    sky: '#0B0E2D',
    ground: '#1A1A4E',
    elements: ['stars-bg', 'station', 'earth', 'satellites'],
    particles: 'stars',
  },
  'space-asteroid': {
    sky: '#0B0E2D',
    ground: '#2D1B69',
    elements: ['stars-bg', 'asteroids', 'crystals'],
    particles: 'stars',
  },
  'space-nebula': {
    sky: '#1A0A3E',
    ground: '#2D1B69',
    elements: ['nebula', 'stars-bg', 'cosmic-dust'],
    particles: 'stars',
  },
  'space-moon': {
    sky: '#0B0E2D',
    ground: '#C0C0C0',
    elements: ['stars-bg', 'earth', 'craters', 'footprints'],
    particles: 'stars',
  },
  'space-comet': {
    sky: '#0B0E2D',
    ground: '#1A1A4E',
    elements: ['stars-bg', 'comet', 'trail', 'planets'],
    particles: 'stars',
  },
  // DESERT
  'desert-oasis': {
    sky: '#F39C12',
    ground: '#D4AC0D',
    elements: ['sun', 'palms', 'water', 'flowers'],
  },
  'desert-dunes': {
    sky: '#F39C12',
    ground: '#C4960C',
    elements: ['sun', 'dunes', 'cactus', 'lizard'],
    particles: 'sand',
  },
  'desert-temple': {
    sky: '#D4AC0D',
    ground: '#8B6914',
    elements: ['temple', 'columns', 'torches', 'hieroglyphs'],
  },
  'desert-market': {
    sky: '#87CEEB',
    ground: '#D4AC0D',
    elements: ['sun', 'tents', 'flags', 'camels'],
  },
  'desert-night': {
    sky: '#0B1A3E',
    ground: '#3D2E1A',
    elements: ['moon', 'stars-bg', 'dunes', 'cactus'],
    particles: 'stars',
  },
};

const StoryScene: React.FC<StorySceneProps> = ({ background, children }) => {
  const config = SCENE_CONFIG[background];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
    return () => setMounted(false);
  }, [background]);

  return (
    <div className={`story-scene ${mounted ? 'story-scene--visible' : ''}`}>
      {/* Sky layer */}
      <div className="story-scene__sky" style={{ background: config.sky }} />

      {/* Gradient overlay */}
      <div className="story-scene__gradient" style={{
        background: `linear-gradient(180deg, ${config.sky}00 0%, ${config.sky}40 40%, ${config.ground} 100%)`
      }} />

      {/* SVG Scene Elements */}
      <svg className="story-scene__svg" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFD93D" stopOpacity="1" />
            <stop offset="100%" stopColor="#FFD93D" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="moon-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F5F5DC" stopOpacity="1" />
            <stop offset="100%" stopColor="#F5F5DC" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sun */}
        {config.elements.includes('sun') && (
          <g className="story-scene__sun">
            <circle cx="200" cy="100" r="80" fill="url(#sun-glow)" opacity="0.6" />
            <circle cx="200" cy="100" r="35" fill="#FFD93D" />
          </g>
        )}

        {/* Moon */}
        {config.elements.includes('moon') && (
          <g className="story-scene__moon">
            <circle cx="900" cy="80" r="60" fill="url(#moon-glow)" opacity="0.4" />
            <circle cx="900" cy="80" r="30" fill="#F5F5DC" />
            <circle cx="890" cy="70" r="28" fill={config.sky} />
          </g>
        )}

        {/* Clouds */}
        {config.elements.includes('clouds') && (
          <g className="story-scene__clouds">
            <ellipse cx="300" cy="120" rx="80" ry="25" fill="white" opacity="0.7" />
            <ellipse cx="340" cy="115" rx="60" ry="20" fill="white" opacity="0.8" />
            <ellipse cx="800" cy="80" rx="90" ry="28" fill="white" opacity="0.6" />
            <ellipse cx="840" cy="75" rx="65" ry="22" fill="white" opacity="0.7" />
            <ellipse cx="550" cy="150" rx="70" ry="22" fill="white" opacity="0.5" />
          </g>
        )}

        {/* Mountains */}
        {config.elements.includes('mountains') && (
          <g className="story-scene__mountains">
            <polygon points="0,500 200,200 400,500" fill="#6B5B8D" opacity="0.6" />
            <polygon points="300,500 550,150 800,500" fill="#8E7BA8" opacity="0.5" />
            <polygon points="700,500 950,220 1200,500" fill="#6B5B8D" opacity="0.6" />
          </g>
        )}

        {/* Trees */}
        {config.elements.includes('trees') && (
          <g className="story-scene__trees">
            <rect x="100" y="380" width="20" height="80" rx="4" fill="#8B5E3C" />
            <ellipse cx="110" cy="360" rx="45" ry="55" fill="#2D8B3F" />
            <rect x="350" y="360" width="24" height="100" rx="4" fill="#8B5E3C" />
            <ellipse cx="362" cy="330" rx="55" ry="65" fill="#3DA84F" />
            <rect x="900" y="370" width="18" height="90" rx="4" fill="#8B5E3C" />
            <ellipse cx="909" cy="345" rx="40" ry="50" fill="#2D8B3F" />
          </g>
        )}

        {/* Mushrooms */}
        {config.elements.includes('mushrooms') && (
          <g className="story-scene__mushrooms">
            <rect x="500" y="470" width="8" height="20" rx="3" fill="#F5E6CC" />
            <ellipse cx="504" cy="468" rx="16" ry="10" fill="#FF6B6B" />
            <circle cx="498" cy="464" r="2" fill="white" />
            <circle cx="508" cy="466" r="1.5" fill="white" />
            <rect x="680" y="475" width="6" height="15" rx="2" fill="#F5E6CC" />
            <ellipse cx="683" cy="473" rx="12" ry="8" fill="#A78BFA" />
          </g>
        )}

        {/* Flowers */}
        {config.elements.includes('flowers') && (
          <g className="story-scene__flowers">
            <circle cx="150" cy="490" r="6" fill="#FF6B9D" />
            <circle cx="150" cy="490" r="2" fill="#FFD93D" />
            <circle cx="450" cy="485" r="5" fill="#FFD93D" />
            <circle cx="450" cy="485" r="2" fill="#FF6B6B" />
            <circle cx="750" cy="492" r="7" fill="#A78BFA" />
            <circle cx="750" cy="492" r="2.5" fill="white" />
          </g>
        )}

        {/* Waves */}
        {config.elements.includes('waves') && (
          <g className="story-scene__waves">
            <path d="M0,450 Q150,420 300,450 Q450,480 600,450 Q750,420 900,450 Q1050,480 1200,450 L1200,600 L0,600 Z" fill="#2E86C1" opacity="0.6" />
            <path d="M0,470 Q150,440 300,470 Q450,500 600,470 Q750,440 900,470 Q1050,500 1200,470 L1200,600 L0,600 Z" fill="#1A5276" opacity="0.7" />
          </g>
        )}

        {/* Coral */}
        {config.elements.includes('coral') && (
          <g className="story-scene__coral">
            <path d="M100,580 Q110,520 130,540 Q140,500 150,530 Q160,510 170,560 Q180,530 190,580" fill="none" stroke="#FF6B9D" strokeWidth="4" />
            <path d="M400,570 Q410,510 430,540 Q440,490 450,520 Q460,500 470,560" fill="none" stroke="#FF9F43" strokeWidth="4" />
            <path d="M800,575 Q810,530 825,550 Q835,510 845,540 Q855,520 865,575" fill="none" stroke="#A78BFA" strokeWidth="4" />
          </g>
        )}

        {/* Fish */}
        {config.elements.includes('fish') && (
          <g className="story-scene__fish">
            <ellipse cx="300" cy="350" rx="15" ry="8" fill="#FFD93D" />
            <polygon points="285,350 275,342 275,358" fill="#FFD93D" />
            <circle cx="310" cy="348" r="2" fill="#1A1A2E" />
            <ellipse cx="700" cy="400" rx="12" ry="6" fill="#FF6B9D" />
            <polygon points="688,400 680,394 680,406" fill="#FF6B9D" />
          </g>
        )}

        {/* Stars background */}
        {config.elements.includes('stars-bg') && (
          <g className="story-scene__stars-bg">
            {Array.from({ length: 40 }, (_, i) => (
              <circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 400}
                r={Math.random() * 2 + 0.5}
                fill="white"
                opacity={Math.random() * 0.5 + 0.3}
              />
            ))}
          </g>
        )}

        {/* Nebula */}
        {config.elements.includes('nebula') && (
          <g className="story-scene__nebula">
            <ellipse cx="600" cy="250" rx="300" ry="150" fill="#A78BFA" opacity="0.15" />
            <ellipse cx="500" cy="200" rx="200" ry="100" fill="#FF6B9D" opacity="0.1" />
            <ellipse cx="700" cy="300" rx="250" ry="120" fill="#0D9488" opacity="0.12" />
          </g>
        )}

        {/* Dunes */}
        {config.elements.includes('dunes') && (
          <g className="story-scene__dunes">
            <path d="M0,500 Q200,420 400,480 Q600,400 800,460 Q1000,400 1200,480 L1200,600 L0,600 Z" fill="#D4AC0D" />
            <path d="M0,520 Q300,460 600,510 Q900,450 1200,500 L1200,600 L0,600 Z" fill="#C4960C" />
          </g>
        )}

        {/* Cactus */}
        {config.elements.includes('cactus') && (
          <g className="story-scene__cactus">
            <rect x="700" y="420" width="16" height="70" rx="8" fill="#2D8B3F" />
            <rect x="680" y="440" width="20" height="12" rx="6" fill="#2D8B3F" transform="rotate(-20, 690, 446)" />
            <rect x="716" y="435" width="22" height="12" rx="6" fill="#2D8B3F" transform="rotate(25, 727, 441)" />
          </g>
        )}

        {/* Palms */}
        {config.elements.includes('palms') && (
          <g className="story-scene__palms">
            <path d="M150,500 Q155,420 160,380" stroke="#8B5E3C" strokeWidth="8" fill="none" strokeLinecap="round" />
            <ellipse cx="160" cy="370" rx="40" ry="12" fill="#2D8B3F" transform="rotate(-15, 160, 370)" />
            <ellipse cx="170" cy="375" rx="35" ry="10" fill="#3DA84F" transform="rotate(20, 170, 375)" />
            <ellipse cx="150" cy="372" rx="38" ry="11" fill="#2D8B3F" transform="rotate(-40, 150, 372)" />
          </g>
        )}

        {/* Ground plane */}
        <rect x="0" y="500" width="1200" height="100" fill={config.ground} opacity="0.9" />
      </svg>

      {/* Particle effects */}
      {config.particles && (
        <div className={`story-scene__particles story-scene__particles--${config.particles}`}>
          {Array.from({ length: config.particles === 'stars' ? 30 : 15 }, (_, i) => (
            <span
              key={i}
              className="story-scene__particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 80}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Content overlay */}
      <div className="story-scene__content">
        {children}
      </div>
    </div>
  );
};

export default StoryScene;
