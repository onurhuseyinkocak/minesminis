import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Smooth entrance
    setTimeout(() => setShow(true), 100);

    // Exit after 3 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 400);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash ${show ? 'show' : ''} ${fadeOut ? 'hide' : ''}`}>
      {/* Soft Background */}
      <div className="splash-bg"></div>

      {/* Main Content */}
      <main className="splash-center">
        {/* Logo */}
        <div className="logo-box">
          <img
            src="/images/mine-logo.jpg"
            alt="Mine's Minis"
            className="logo-img"
          />
        </div>

        {/* Brand */}
        <h1 className="brand">
          Mine's <span>Minis</span>
        </h1>

        {/* Tagline */}
        <p className="tagline">Learn English, Have Fun! ✨</p>

        {/* Simple loader */}
        <div className="loader">
          <div className="loader-bar"></div>
        </div>
      </main>

      {/* Credits */}
      <footer className="credits">
        <p>
          <span className="role">Developed by</span>
          <strong>Onur Hüseyin Koçak</strong>
        </p>
        <span className="dot">•</span>
        <p>
          <span className="role">Designed by</span>
          <strong>Mine Koçak</strong>
        </p>
      </footer>
    </div>
  );
};

export default SplashScreen;
