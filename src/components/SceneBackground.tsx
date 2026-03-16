import React from 'react';

export type SceneBgType = 'valley-morning' | 'valley-meadow' | 'forest-path' | 'river-side' | 'mountain-view' | 'sunset-valley';

interface SceneBackgroundProps {
  type: SceneBgType;
  className?: string;
}

/** Sahneye göre değişen arka plan görselleri - SVG illustration */
const SceneBackground: React.FC<SceneBackgroundProps> = ({ type, className = '' }) => {
  const baseClass = `scene-bg-illus scene-bg-${type} ${className}`.trim();

  const renderValleyMorning = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sun-glow" cx="50%" cy="30%" r="50%">
          <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FFE082" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sky-vm" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#87CEEB" />
          <stop offset="100%" stopColor="#B8E6B8" />
        </linearGradient>
        <linearGradient id="grass-vm" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#7CB342" />
          <stop offset="100%" stopColor="#98D98E" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-vm)" />
      <ellipse cx="200" cy="50" rx="60" ry="60" fill="url(#sun-glow)" />
      <circle cx="200" cy="50" r="25" fill="#FFF59D" />
      <ellipse cx="100" cy="200" rx="80" ry="100" fill="url(#grass-vm)" opacity="0.7" />
      <ellipse cx="300" cy="220" rx="90" ry="90" fill="url(#grass-vm)" opacity="0.6" />
      <path d="M0 200 Q50 180 100 200 Q150 220 200 200 Q250 180 300 200 Q350 210 400 200 L400 280 L0 280 Z" fill="#8BC34A" opacity="0.8" />
      <ellipse cx="150" cy="260" rx="40" ry="20" fill="#6B8E23" opacity="0.4" />
    </svg>
  );

  const renderValleyMeadow = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-meadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#81D4FA" />
          <stop offset="100%" stopColor="#A5D6A7" />
        </linearGradient>
        <linearGradient id="flower1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FF8A80" />
          <stop offset="100%" stopColor="#FFCDD2" />
        </linearGradient>
        <linearGradient id="flower2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFF9C4" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-meadow)" />
      <path d="M0 200 Q100 150 200 200 Q300 250 400 200 L400 280 L0 280 Z" fill="#81C784" opacity="0.9" />
      <circle cx="80" cy="230" r="12" fill="url(#flower1)" />
      <circle cx="200" cy="210" r="10" fill="url(#flower2)" />
      <circle cx="320" cy="240" r="8" fill="url(#flower1)" />
      <circle cx="120" cy="250" r="6" fill="url(#flower2)" />
      <ellipse cx="250" cy="220" rx="50" ry="40" fill="#66BB6A" opacity="0.5" />
    </svg>
  );

  const renderForestPath = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-forest" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#64B5F6" />
          <stop offset="50%" stopColor="#AED581" />
          <stop offset="100%" stopColor="#8BC34A" />
        </linearGradient>
        <linearGradient id="tree1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#2E7D32" />
          <stop offset="100%" stopColor="#4CAF50" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-forest)" />
      <ellipse cx="50" cy="200" rx="60" ry="120" fill="url(#tree1)" opacity="0.8" />
      <ellipse cx="120" cy="180" rx="50" ry="100" fill="url(#tree1)" opacity="0.7" />
      <ellipse cx="350" cy="220" rx="55" ry="110" fill="url(#tree1)" opacity="0.75" />
      <ellipse cx="280" cy="190" rx="45" ry="90" fill="url(#tree1)" opacity="0.65" />
      <path d="M120 220 L280 220 Q200 200 120 220" fill="#558B2F" opacity="0.8" stroke="#33691E" strokeWidth="2" />
    </svg>
  );

  const renderRiverSide = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-river" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4FC3F7" />
          <stop offset="50%" stopColor="#80DEEA" />
          <stop offset="100%" stopColor="#80CBC4" />
        </linearGradient>
        <linearGradient id="water" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4DB6AC" />
          <stop offset="100%" stopColor="#00897B" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-river)" />
      <path d="M0 120 Q80 100 150 130 Q220 100 280 120 Q340 140 400 110 L400 280 L0 280 Z" fill="url(#water)" opacity="0.8" />
      <path d="M0 130 Q100 115 200 135 Q300 110 400 125" fill="none" stroke="#B2DFDB" strokeWidth="2" opacity="0.6" />
      <ellipse cx="100" cy="240" rx="50" ry="30" fill="#81C784" opacity="0.8" />
      <ellipse cx="320" cy="250" rx="60" ry="25" fill="#66BB6A" opacity="0.7" />
    </svg>
  );

  const renderMountainView = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sky-mountain" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#90CAF9" />
          <stop offset="70%" stopColor="#B3E5FC" />
          <stop offset="100%" stopColor="#B2DFDB" />
        </linearGradient>
        <linearGradient id="mountain1" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#455A64" />
          <stop offset="100%" stopColor="#78909C" />
        </linearGradient>
        <linearGradient id="mountain2" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#607D8B" />
          <stop offset="100%" stopColor="#90A4AE" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-mountain)" />
      <path d="M0 280 L0 180 L80 120 L150 160 L200 100 L280 140 L350 100 L400 140 L400 280 Z" fill="url(#mountain2)" opacity="0.7" />
      <path d="M0 280 L50 200 L120 150 L200 200 L280 130 L400 180 L400 280 Z" fill="url(#mountain1)" opacity="0.6" />
      <ellipse cx="200" cy="220" rx="120" ry="60" fill="#80CBC4" opacity="0.4" />
    </svg>
  );

  const renderSunsetValley = () => (
    <svg className="scene-illus" viewBox="0 0 400 280" preserveAspectRatio="xMidYMid slice">
      <defs>
        <radialGradient id="sunset-glow" cx="50%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#FFB74D" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#FF8A65" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5D4037" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="sky-sunset" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFB74D" />
          <stop offset="40%" stopColor="#E57373" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
        <linearGradient id="hill-sunset" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="100%" stopColor="#5D4037" />
        </linearGradient>
      </defs>
      <rect width="400" height="280" fill="url(#sky-sunset)" />
      <ellipse cx="200" cy="60" rx="80" ry="50" fill="url(#sunset-glow)" />
      <circle cx="200" cy="55" r="20" fill="#FFCC80" />
      <path d="M0 180 Q100 150 200 180 Q300 200 400 170 L400 280 L0 280 Z" fill="url(#hill-sunset)" opacity="0.8" />
      <path d="M0 220 Q150 190 300 220 L400 200 L400 280 L0 280 Z" fill="#3E2723" opacity="0.6" />
    </svg>
  );

  const render = () => {
    switch (type) {
      case 'valley-morning': return renderValleyMorning();
      case 'valley-meadow': return renderValleyMeadow();
      case 'forest-path': return renderForestPath();
      case 'river-side': return renderRiverSide();
      case 'mountain-view': return renderMountainView();
      case 'sunset-valley': return renderSunsetValley();
      default: return renderValleyMorning();
    }
  };

  return (
    <div className={baseClass} aria-hidden>
      {render()}
    </div>
  );
};

export default SceneBackground;
