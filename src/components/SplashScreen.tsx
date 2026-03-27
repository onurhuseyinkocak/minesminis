import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const PawPrint: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className={className} fill="currentColor">
    <ellipse cx="50" cy="66" rx="23" ry="19" />
    <ellipse cx="27" cy="43" rx="9" ry="12" transform="rotate(-20 27 43)" />
    <ellipse cx="43" cy="33" rx="9" ry="12" />
    <ellipse cx="59" cy="33" rx="9" ry="12" />
    <ellipse cx="75" cy="43" rx="9" ry="12" transform="rotate(20 75 43)" />
  </svg>
);

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [show, setShow]       = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [catData, setCatData] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch('/lottie/cat-loader.json')
      .then(r => r.json())
      .then(setCatData)
      .catch(() => {});

    const showTimer    = setTimeout(() => setShow(true), 50);
    let completeTimer: ReturnType<typeof setTimeout> | undefined;
    const timer        = setTimeout(() => {
      setFadeOut(true);
      completeTimer = setTimeout(onComplete, 500);
    }, 2800);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(timer);
      if (completeTimer) clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash ${show ? 'show' : ''} ${fadeOut ? 'hide' : ''}`}>
      <div className="splash-bg" />

      {/* Floating paw prints */}
      <PawPrint size={44} className="splash-paw splash-paw--1" />
      <PawPrint size={26} className="splash-paw splash-paw--2" />
      <PawPrint size={36} className="splash-paw splash-paw--3" />
      <PawPrint size={20} className="splash-paw splash-paw--4" />
      <PawPrint size={30} className="splash-paw splash-paw--5" />
      <PawPrint size={18} className="splash-paw splash-paw--6" />

      <main className="splash-center">
        <div className="logo-box">
          <div className="logo-cat-ear logo-cat-ear--l" />
          <div className="logo-cat-ear logo-cat-ear--r" />
          <img
            src="/images/mine-logo.jpg"
            alt="MinesMinis"
            className="logo-img"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <h1 className="brand">
          Mines<span>Minis</span>
        </h1>
        <p className="tagline">Learn English, Have Fun!</p>

        <div className="splash-cat-loader">
          {catData
            ? <Lottie animationData={catData} loop autoplay style={{ width: 130, height: 130 }} />
            : <div className="loader"><div className="loader-bar" /></div>
          }
        </div>
      </main>

      <footer className="credits">
        <p>
          <span className="role">Developed by</span>
          <strong>Onur Kocak</strong>
        </p>
        <PawPrint size={10} className="credits-paw" />
        <p>
          <span className="role">Designed by</span>
          <strong>Mine Kocak</strong>
        </p>
      </footer>
    </div>
  );
};

export default SplashScreen;
