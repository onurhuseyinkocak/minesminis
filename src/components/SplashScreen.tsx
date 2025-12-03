import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 400);
    }, 1500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-background">
        <div className="splash-gradient-orb orb-1"></div>
        <div className="splash-gradient-orb orb-2"></div>
        <div className="splash-gradient-orb orb-3"></div>
      </div>
      
      <div className="splash-content">
        <div className="splash-logo-container">
          <img 
            src="/images/minesminis-logo.svg" 
            alt="MinesMinis" 
            className="splash-logo"
          />
        </div>
        
        <div className="splash-loading">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        
        <div className="splash-tagline">
          <span className="tagline-text">Learn English, Have Fun!</span>
          <div className="tagline-stars">✨ 🌟 ✨</div>
        </div>
      </div>
      
      <div className="splash-footer">
        <div className="developer-credit">
          <span className="credit-label">Developed by</span>
          <span className="credit-name">Onur Hüseyin Koçak</span>
        </div>
        <div className="version-info">Version 1.0.0</div>
      </div>
    </div>
  );
};

export default SplashScreen;
