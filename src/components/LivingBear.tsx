import React, { useEffect, useState, useRef } from 'react';
import { mascotRoaming } from '../services/mascotRoaming';
import { bearLifeCycle } from '../services/bearLifeCycle';
import { useAuth } from '../contexts/AuthContext';
import UnifiedMascot, { MascotState } from './UnifiedMascot';

interface LivingBearProps {
    onBearClick?: () => void;
    speechText?: string;
}

const LivingBear: React.FC<LivingBearProps> = ({ onBearClick, speechText }) => {
    const { userProfile } = useAuth();
    const [position, setPosition] = useState({ x: 20, y: 80 });
    const [bearState, setBearState] = useState<MascotState>('idle');
    const [isBearHome, setIsBearHome] = useState(false);
    const bearRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Start roaming and life cycle
        mascotRoaming.startRoaming();
        bearLifeCycle.startLifeCycle();

        // Listen to position changes
        mascotRoaming.onChange((pos: { x: number; y: number }, state: string) => {
            setPosition(pos);

            // Map roaming states to bear animation states
            if (state === 'walking') {
                setBearState('walking');
                setIsBearHome(false);
            } else if (state === 'celebrating') {
                setBearState('celebrating');
            } else {
                setBearState(state as MascotState);
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
                        className={`living-bear ${speechText ? 'talking' : ''}`}
                        onClick={handleBearClick}
                    >
                        <UnifiedMascot
                            type={((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'}
                            state={bearState}
                            size={120}
                        />

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
                        className="living-bear-inside"
                        style={{
                            position: 'absolute',
                            bottom: '0px',
                            left: '20px',
                        }}
                    >
                        <UnifiedMascot
                            type={((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'}
                            state="sleeping"
                            size={80}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default LivingBear;
