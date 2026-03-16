import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setShow(true), 50);

    const timer = setTimeout(() => {
      setFadeOut(true);
      completeTimer = setTimeout(onComplete, 400);
    }, 1800);

    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash ${show ? 'show' : ''} ${fadeOut ? 'hide' : ''}`}>
      <div className="splash-bg" />
      <main className="splash-center">
        <div className="logo-box">
          <img src="/images/mine-logo.jpg" alt="Mine's Minis" className="logo-img" />
        </div>
        <h1 className="brand">
          Mine's <span>Minis</span>
        </h1>
        <p className="tagline">Learn English, Have Fun!</p>
        <div className="loader">
          <div className="loader-bar" />
        </div>
      </main>
      <footer className="credits">
        <p>
          <span className="role">Developed by</span>
          <strong>Onur Kocak</strong>
        </p>
        <span className="dot">&bull;</span>
        <p>
          <span className="role">Designed by</span>
          <strong>Mine Kocak</strong>
        </p>
      </footer>
    </div>
  );
};

export default SplashScreen;
