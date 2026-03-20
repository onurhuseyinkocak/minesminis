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

        {/* Tall Trees */}
        {config.elements.includes('tall-trees') && (
          <g className="story-scene__tall-trees">
            <rect x="80" y="280" width="18" height="200" rx="5" fill="#5C3D1E" />
            <ellipse cx="89" cy="250" rx="55" ry="80" fill="#1A6B2F" />
            <rect x="300" y="250" width="22" height="230" rx="5" fill="#5C3D1E" />
            <ellipse cx="311" cy="215" rx="65" ry="90" fill="#228B3B" />
            <rect x="950" y="260" width="20" height="220" rx="5" fill="#5C3D1E" />
            <ellipse cx="960" cy="228" rx="58" ry="82" fill="#1A6B2F" />
            <rect x="1100" y="270" width="16" height="210" rx="5" fill="#5C3D1E" />
            <ellipse cx="1108" cy="240" rx="48" ry="72" fill="#228B3B" />
          </g>
        )}

        {/* Vines */}
        {config.elements.includes('vines') && (
          <g className="story-scene__vines">
            <path d="M50,0 Q60,60 45,120 Q55,180 40,240 Q50,300 45,370" fill="none" stroke="#3DA84F" strokeWidth="3" strokeLinecap="round" />
            <path d="M60,0 Q70,50 55,100 Q65,150 50,200" fill="none" stroke="#2D8B3F" strokeWidth="2" strokeLinecap="round" />
            <path d="M550,0 Q565,70 548,140 Q560,210 545,280 Q558,340 542,400" fill="none" stroke="#3DA84F" strokeWidth="3" strokeLinecap="round" />
            <path d="M560,0 Q572,55 558,110 Q568,165 554,220" fill="none" stroke="#2D8B3F" strokeWidth="2" strokeLinecap="round" />
            <path d="M1150,0 Q1162,65 1148,130 Q1158,195 1144,260 Q1155,320 1140,390" fill="none" stroke="#3DA84F" strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="50" cy="130" rx="8" ry="5" fill="#2D8B3F" transform="rotate(-20,50,130)" />
            <ellipse cx="548" cy="150" rx="8" ry="5" fill="#2D8B3F" transform="rotate(15,548,150)" />
            <ellipse cx="1148" cy="140" rx="8" ry="5" fill="#2D8B3F" transform="rotate(-10,1148,140)" />
          </g>
        )}

        {/* Ferns */}
        {config.elements.includes('ferns') && (
          <g className="story-scene__ferns">
            <g transform="translate(200, 490)">
              {[-40,-25,-10,0,10,25,40].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-18" rx="5" ry="18"
                  fill="#2D8B3F" transform={`rotate(${angle})`} opacity="0.9" />
              ))}
            </g>
            <g transform="translate(600, 495)">
              {[-40,-25,-10,0,10,25,40].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-16" rx="5" ry="16"
                  fill="#3DA84F" transform={`rotate(${angle})`} opacity="0.9" />
              ))}
            </g>
            <g transform="translate(1000, 490)">
              {[-40,-25,-10,0,10,25,40].map((angle, i) => (
                <ellipse key={i} cx="0" cy="-18" rx="5" ry="18"
                  fill="#2D8B3F" transform={`rotate(${angle})`} opacity="0.9" />
              ))}
            </g>
          </g>
        )}

        {/* Big Tree */}
        {config.elements.includes('big-tree') && (
          <g className="story-scene__big-tree">
            <rect x="570" y="300" width="40" height="200" rx="8" fill="#6B3E1E" />
            <rect x="570" y="370" width="-60" height="14" rx="6" fill="#6B3E1E" />
            <rect x="610" y="350" width="65" height="14" rx="6" fill="#6B3E1E" />
            <ellipse cx="590" cy="240" rx="110" ry="130" fill="#1A6B2F" />
            <ellipse cx="570" cy="210" rx="80" ry="100" fill="#228B3B" />
            <ellipse cx="620" cy="225" rx="90" ry="110" fill="#1A6B2F" />
          </g>
        )}

        {/* Treehouse */}
        {config.elements.includes('treehouse') && (
          <g className="story-scene__treehouse">
            <rect x="530" y="230" width="100" height="70" rx="6" fill="#8B5E3C" />
            <polygon points="520,230 590,185 660,230" fill="#A0522D" />
            <rect x="565" y="260" width="22" height="40" rx="3" fill="#6B3E1E" />
            <rect x="540" y="245" width="18" height="16" rx="2" fill="#87CEEB" opacity="0.7" />
            <rect x="600" y="245" width="18" height="16" rx="2" fill="#87CEEB" opacity="0.7" />
            <rect x="586" y="297" width="4" height="60" fill="#8B5E3C" />
          </g>
        )}

        {/* Bridge */}
        {config.elements.includes('bridge') && (
          <g className="story-scene__bridge">
            <path d="M380,310 Q430,330 490,310" fill="none" stroke="#8B5E3C" strokeWidth="6" strokeLinecap="round" />
            <line x1="390" y1="300" x2="393" y2="315" stroke="#8B5E3C" strokeWidth="3" />
            <line x1="408" y1="294" x2="411" y2="313" stroke="#8B5E3C" strokeWidth="3" />
            <line x1="426" y1="291" x2="429" y2="311" stroke="#8B5E3C" strokeWidth="3" />
            <line x1="444" y1="291" x2="447" y2="311" stroke="#8B5E3C" strokeWidth="3" />
            <line x1="462" y1="294" x2="465" y2="313" stroke="#8B5E3C" strokeWidth="3" />
            <line x1="480" y1="300" x2="483" y2="315" stroke="#8B5E3C" strokeWidth="3" />
            <path d="M386,298 Q430,282 482,298" fill="none" stroke="#A0522D" strokeWidth="3" strokeDasharray="4,3" />
          </g>
        )}

        {/* Reeds */}
        {config.elements.includes('reeds') && (
          <g className="story-scene__reeds">
            {[120,140,155,170,190,400,420,440,750,770,790].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="500" x2={x + (i % 2 === 0 ? -3 : 3)} y2="430" stroke="#5B7A3F" strokeWidth="3" strokeLinecap="round" />
                <ellipse cx={x + (i % 2 === 0 ? -3 : 3)} cy="426" rx="4" ry="10" fill="#7A5C2E" />
              </g>
            ))}
          </g>
        )}

        {/* Lily Pads */}
        {config.elements.includes('lily-pads') && (
          <g className="story-scene__lily-pads">
            <ellipse cx="200" cy="490" rx="28" ry="12" fill="#2D8B3F" opacity="0.85" />
            <path d="M200,490 L200,478" fill="none" stroke="#2D8B3F" strokeWidth="1.5" />
            <circle cx="200" cy="476" r="4" fill="#FF6B9D" />
            <ellipse cx="420" cy="488" rx="22" ry="9" fill="#3DA84F" opacity="0.85" />
            <ellipse cx="650" cy="493" rx="26" ry="11" fill="#2D8B3F" opacity="0.85" />
            <path d="M650,493 L650,482" fill="none" stroke="#2D8B3F" strokeWidth="1.5" />
            <circle cx="650" cy="480" r="4" fill="#FFD93D" />
            <ellipse cx="880" cy="489" rx="20" ry="8" fill="#3DA84F" opacity="0.85" />
          </g>
        )}

        {/* Stalactites */}
        {config.elements.includes('stalactites') && (
          <g className="story-scene__stalactites">
            <polygon points="80,0 100,0 90,70" fill="#5A4A6A" opacity="0.9" />
            <polygon points="140,0 165,0 152,55" fill="#4A3A5A" opacity="0.85" />
            <polygon points="210,0 230,0 220,80" fill="#5A4A6A" opacity="0.9" />
            <polygon points="290,0 308,0 299,60" fill="#4A3A5A" opacity="0.8" />
            <polygon points="380,0 398,0 389,75" fill="#5A4A6A" opacity="0.85" />
            <polygon points="600,0 622,0 611,65" fill="#4A3A5A" opacity="0.9" />
            <polygon points="680,0 698,0 689,80" fill="#5A4A6A" opacity="0.85" />
            <polygon points="800,0 820,0 810,70" fill="#4A3A5A" opacity="0.9" />
            <polygon points="920,0 942,0 931,58" fill="#5A4A6A" opacity="0.8" />
            <polygon points="1050,0 1068,0 1059,72" fill="#4A3A5A" opacity="0.85" />
            <polygon points="1140,0 1162,0 1151,64" fill="#5A4A6A" opacity="0.9" />
          </g>
        )}

        {/* Crystals */}
        {config.elements.includes('crystals') && (
          <g className="story-scene__crystals">
            <polygon points="160,480 170,440 180,480" fill="#A78BFA" opacity="0.85" />
            <polygon points="162,480 178,480 170,500" fill="#7C5CCC" opacity="0.7" />
            <polygon points="280,470 293,425 306,470" fill="#60EFFF" opacity="0.8" />
            <polygon points="282,470 304,470 293,492" fill="#38B2C8" opacity="0.7" />
            <polygon points="500,475 511,438 522,475" fill="#FF9FE0" opacity="0.8" />
            <polygon points="502,475 520,475 511,494" fill="#CC70B2" opacity="0.7" />
            <polygon points="750,472 763,430 776,472" fill="#A78BFA" opacity="0.85" />
            <polygon points="752,472 774,472 763,494" fill="#7C5CCC" opacity="0.7" />
            <polygon points="950,478 961,442 972,478" fill="#60EFFF" opacity="0.8" />
            <polygon points="952,478 970,478 961,498" fill="#38B2C8" opacity="0.7" />
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
