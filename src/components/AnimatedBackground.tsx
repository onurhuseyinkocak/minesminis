import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="animated-bg-container">
            <div className="shape shape-1">☁️</div>
            <div className="shape shape-2">⭐</div>
            <div className="shape shape-3">🔵</div>
            <div className="shape shape-4">☁️</div>
            <div className="shape shape-5">🔺</div>
            <div className="shape shape-6">⭐</div>

            <style>{`
        .animated-bg-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: -1;
          overflow: hidden;
          pointer-events: none;
          background: linear-gradient(180deg, #E0F2FE 0%, #BAE6FD 100%);
        }

        .shape {
          position: absolute;
          font-size: 3rem;
          opacity: 0.6;
          animation: floatAround 20s infinite linear;
        }

        .shape-1 { top: 10%; left: 10%; animation-duration: 25s; font-size: 4rem; }
        .shape-2 { top: 20%; right: 20%; animation-duration: 18s; animation-delay: -5s; }
        .shape-3 { bottom: 15%; left: 30%; animation-duration: 30s; font-size: 2rem; }
        .shape-4 { top: 40%; right: 10%; animation-duration: 22s; font-size: 5rem; }
        .shape-5 { bottom: 30%; right: 40%; animation-duration: 28s; }
        .shape-6 { top: 60%; left: 5%; animation-duration: 20s; animation-delay: -10s; }

        @keyframes floatAround {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(50px, 50px) rotate(90deg); }
          50% { transform: translate(0, 100px) rotate(180deg); }
          75% { transform: translate(-50px, 50px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default AnimatedBackground;
