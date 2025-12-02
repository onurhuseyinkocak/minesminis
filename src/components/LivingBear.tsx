import React, { useEffect, useState, useRef } from 'react';
import { mascotRoaming } from '../services/mascotRoaming';
import { bearLifeCycle, BearState } from '../services/bearLifeCycle';
import './LivingBear.css';

interface LivingBearProps {
    onBearClick?: () => void;
    speechText?: string;
}

const LivingBear: React.FC<LivingBearProps> = ({ onBearClick, speechText }) => {
    const [position, setPosition] = useState({ x: 20, y: 80 });
    const [bearState, setBearState] = useState<BearState>('idle');
    const [isBearHome, setIsBearHome] = useState(false);
    const bearRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Start roaming and life cycle
        mascotRoaming.startRoaming();
        bearLifeCycle.startLifeCycle();

        // Listen to position changes
        mascotRoaming.onChange((pos, state) => {
            setPosition(pos);

            // Map roaming states to bear animation states
            if (state === 'walking') {
                setBearState('walking');
                setIsBearHome(false);
            } else if (state === 'celebrating') {
                setBearState('celebrating');
            } else {
                setBearState('idle');
            }
        });

        // Listen to life cycle changes
        bearLifeCycle.onChange((lifecycle) => {
            if (lifecycle.state === 'sleeping') {
                setBearState('sleeping');
                setIsBearHome(true);
                // Move bear to home position
                setPosition({ x: 85, y: 80 });
            } else if (lifecycle.state === 'goingHome') {
                setBearState('walking');
                // Walk to home
                setPosition({ x: 85, y: 80 });
            } else if (lifecycle.state === 'teaching') {
                setBearState('idle');
            }
        });

        return () => {
            mascotRoaming.stopRoaming();
            bearLifeCycle.stopLifeCycle();
        };
    }, []);

    const handleBearClick = () => {
        const lifecycle = bearLifeCycle.getState();

        if (lifecycle.state === 'sleeping') {
            // Wake up the bear
            bearLifeCycle.wakeUp();
            setBearState('celebrating');
            setIsBearHome(false);

            // Show wake-up message briefly
            setTimeout(() => {
                if (onBearClick) onBearClick();
            }, 500);
        } else {
            // Open chat
            mascotRoaming.jumpToChat();
            if (onBearClick) onBearClick();
        }
    };

    const handleHomeClick = () => {
        const lifecycle = bearLifeCycle.getState();

        if (lifecycle.state === 'sleeping') {
            // Wake up by clicking house
            bearLifeCycle.wakeUp();
            setBearState('celebrating');
            setIsBearHome(false);
        }
    };

    const getAnimationClass = () => {
        switch (bearState) {
            case 'walking':
                return 'walking';
            case 'sleeping':
                return 'sleeping';
            case 'celebrating':
                return 'celebrating';
            default:
                return 'idle';
        }
    };

    return (
        <>
            {/* The Living Bear */}
            {!isBearHome && (
                <div
                    className="living-bear-container"
                    style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                    }}
                >
                    <div
                        ref={bearRef}
                        className={`living-bear ${getAnimationClass()} ${speechText ? 'talking' : ''}`}
                        onClick={handleBearClick}
                    >
                        {/* Head */}
                        <div className="bear-head">
                            <div className="bear-ear left"></div>
                            <div className="bear-ear right"></div>
                            <div className="bear-face"></div>
                            <div className="bear-eye left"></div>
                            <div className="bear-eye right"></div>
                            <div className="bear-nose"></div>
                            <div className="bear-smile"></div>
                        </div>

                        {/* Body */}
                        <div className="bear-body">
                            <div className="bear-arm left"></div>
                            <div className="bear-arm right"></div>
                            <div className="bear-leg left"></div>
                            <div className="bear-leg right"></div>
                        </div>

                        {/* Zzz for sleeping */}
                        {bearState === 'sleeping' && <div className="bear-zzz">Zzz</div>}

                        {/* Speech Bubble */}
                        {speechText && (
                            <div className="bear-speech-bubble">
                                {speechText}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* The Cozy Home (bottom-right) */}
            <div
                className={`bear-home ${isBearHome ? 'bear-inside' : ''}`}
                onClick={handleHomeClick}
                title={isBearHome ? "Click to wake up Mimi! 💤" : "Mimi's cozy home 🏠"}
            >
                <div className="home-roof"></div>
                <div className="home-body">
                    <div className="home-door"></div>
                    <div className="home-window"></div>
                </div>

                {/* Show sleeping bear in doorway when home */}
                {isBearHome && (
                    <div
                        className="living-bear sleeping"
                        style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '30px',
                            transform: 'scale(0.6)',
                        }}
                    >
                        <div className="bear-head">
                            <div className="bear-ear left"></div>
                            <div className="bear-ear right"></div>
                            <div className="bear-face"></div>
                            <div className="bear-eye left"></div>
                            <div className="bear-eye right"></div>
                            <div className="bear-nose"></div>
                        </div>
                        <div className="bear-body">
                            <div className="bear-leg left"></div>
                            <div className="bear-leg right"></div>
                        </div>
                        <div className="bear-zzz">Zzz</div>
                    </div>
                )}
            </div>
        </>
    );
};

export default LivingBear;
