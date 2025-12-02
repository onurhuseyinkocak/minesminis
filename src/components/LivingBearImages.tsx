import React, { useEffect, useState, useRef, useCallback } from 'react';
import DragonMascot from './DragonMascot';
import { mascotRoaming } from '../services/mascotRoaming';
import './LivingBearImages.css';

type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following' | 'goingHome';
type ViewDirection = 'front' | 'left' | 'right';

interface SpeechBubble {
    message: string;
    duration: number;
}

interface LivingBearImagesProps {
    onMascotClick?: () => void;
}

const LivingBearImages: React.FC<LivingBearImagesProps> = ({ onMascotClick }) => {
    const [position, setPosition] = useState({ x: 85, y: 75 });
    const [animationState, setAnimationState] = useState<AnimationState>('idle');
    const [, setViewDirection] = useState<ViewDirection>('front');
    const [speechBubble, setSpeechBubble] = useState<SpeechBubble | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragonHome, setIsDragonHome] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialState = mascotRoaming.getCurrentState();
        setPosition({ ...initialState.position });
        setAnimationState(initialState.state);
        setViewDirection(initialState.viewDirection);
        setSpeechBubble(initialState.bubble);
        
        if (initialState.state === 'sleeping') {
            setIsDragonHome(true);
        }

        const unsubscribe = mascotRoaming.onChange((newPos, newState, newView, newBubble) => {
            setPosition({ ...newPos });
            setAnimationState(newState as AnimationState);
            setViewDirection(newView);
            setSpeechBubble(newBubble);
            
            const stateStr = String(newState);
            if (stateStr === 'sleeping') {
                setIsDragonHome(true);
            } else if (isDragonHome && stateStr !== 'sleeping') {
                setIsDragonHome(false);
            }
        });

        mascotRoaming.startRoaming();
        console.log('🎨 Living AI Mascot is now active on your website!');

        return () => {
            unsubscribe();
            mascotRoaming.stopRoaming();
        };
    }, [isDragonHome]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        mascotRoaming.updateMousePosition(x, y);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);

    const handleMascotClick = () => {
        mascotRoaming.triggerCelebration();
        if (onMascotClick) {
            onMascotClick();
        }
    };

    const handleMascotHover = () => {
        setIsHovered(true);
        mascotRoaming.onHover();
    };

    const handleMascotLeave = () => {
        setIsHovered(false);
    };

    const handleHomeClick = () => {
        if (isDragonHome) {
            setIsDragonHome(false);
            setAnimationState('celebrating');
            mascotRoaming.triggerCelebration();
        }
    };

    const mapState = (state: AnimationState): 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love' => {
        if (state === 'following') return 'walking';
        if (state === 'singing' || state === 'surprised' || state === 'jumping') return 'celebrating';
        if (['idle', 'walking', 'dancing', 'sleeping', 'celebrating', 'waving', 'laughing', 'thinking', 'love'].includes(state)) {
            return state as 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love';
        }
        return 'idle';
    };

    return (
        <div className="living-bear-container" ref={containerRef}>
            {!isDragonHome && (
                <div
                    className={`mascot-wrapper ${isHovered ? 'hovered' : ''}`}
                    style={{
                        position: 'fixed',
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: animationState === 'following' 
                            ? 'left 0.3s ease-out, top 0.3s ease-out'
                            : 'left 4s cubic-bezier(0.25, 0.1, 0.25, 1), top 4s cubic-bezier(0.25, 0.1, 0.25, 1)',
                        zIndex: 9999,
                        pointerEvents: 'none'
                    }}
                >
                    {speechBubble && (
                        <div className="mascot-speech-bubble">
                            {speechBubble.message}
                        </div>
                    )}
                    
                    <div
                        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                        onClick={handleMascotClick}
                        onMouseEnter={handleMascotHover}
                        onMouseLeave={handleMascotLeave}
                    >
                        <DragonMascot
                            state={mapState(animationState)}
                            isHovered={isHovered}
                        />
                    </div>
                </div>
            )}

            {/* Dragon's Cozy Home (bottom-right) */}
            <div
                className={`dragon-home ${isDragonHome ? 'dragon-inside' : ''}`}
                onClick={handleHomeClick}
                title={isDragonHome ? "Click to wake up the dragon! 🐲" : "Dragon's cozy cave 🏠"}
            >
                <div className="cave-entrance">
                    <div className="cave-arch"></div>
                    <div className="cave-shadow"></div>
                </div>
                <div className="cave-grass"></div>
                
                {isDragonHome && (
                    <div className="sleeping-dragon">
                        <DragonMascot state="sleeping" />
                        <div className="sleep-zzz">💤</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LivingBearImages;
