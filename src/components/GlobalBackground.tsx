import React from 'react';
import './GlobalBackground.css';

const GlobalBackground: React.FC = () => {
    return (
        <div className="global-background">
            <div className="bg-gradient"></div>
            <div className="bg-elements">
                {/* Floating Clouds */}
                <div className="floating-element cloud-1">☁️</div>
                <div className="floating-element cloud-2">☁️</div>
                <div className="floating-element cloud-3">☁️</div>

                {/* Floating Stars */}
                <div className="floating-element star-3">🌟</div>

                {/* Playful Shapes */}
                <div className="floating-shape shape-1"></div>
                <div className="floating-shape shape-2"></div>
                <div className="floating-shape shape-3"></div>

                {/* Bubbles/Circles */}
                <div className="bubble bubble-1"></div>
                <div className="bubble bubble-2"></div>
                <div className="bubble bubble-3"></div>
            </div>
            <div className="bg-overlay"></div>
        </div>
    );
};

export default GlobalBackground;
