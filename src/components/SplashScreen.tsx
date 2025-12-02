import React, { useEffect, useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 800);
    }, 3500);

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
            src="/images/minesminis-logo.png" 
            alt="MinesMinis" 
            className="splash-logo"
          />
        </div>
        
        <div className="splash-loading">
          <Player
            autoplay
            loop
            src="https://lottie.host/4db68bbd-31f6-4cd8-84eb-189571e6c9a2/6fzrouDtrT.json"
            style={{ height: '80px', width: '80px' }}
          />
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
