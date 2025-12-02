import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProfessorPaws from './ProfessorPaws';
import { mascotRoaming } from '../services/mascotRoaming';
import './LivingBearImages.css';
import cottageSvg from '../assets/bear/cottage.svg';

type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following';
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
    const [viewDirection, setViewDirection] = useState<ViewDirection>('front');
    const [speechBubble, setSpeechBubble] = useState<SpeechBubble | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initialState = mascotRoaming.getCurrentState();
        setPosition({ ...initialState.position });
        setAnimationState(initialState.state);
        setViewDirection(initialState.viewDirection);
        setSpeechBubble(initialState.bubble);

        const unsubscribe = mascotRoaming.onChange((newPos, newState, newView, newBubble) => {
            setPosition({ ...newPos });
            setAnimationState(newState);
            setViewDirection(newView);
            setSpeechBubble(newBubble);
        });

        mascotRoaming.startRoaming();
        console.log('🎨 Living AI Mascot is now active on your website!');

        return () => {
            unsubscribe();
            mascotRoaming.stopRoaming();
        };
    }, []);

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

    const getFacingDirection = (): 'left' | 'right' => {
        return viewDirection === 'right' ? 'left' : 'right';
    };

    return (
        <div className="living-bear-container" ref={containerRef}>
            <div
                className={`mascot-wrapper ${isHovered ? 'hovered' : ''}`}
                style={{
                    position: 'fixed',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: animationState === 'following' 
                        ? 'left 0.3s ease-out, top 0.3s ease-out'
                        : 'left 6s cubic-bezier(0.25, 0.1, 0.25, 1), top 6s cubic-bezier(0.25, 0.1, 0.25, 1)',
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
                    <ProfessorPaws
                        bearState={animationState === 'following' ? 'walking' : animationState}
                        facingDirection={getFacingDirection()}
                        viewDirection={viewDirection}
                        isHovered={isHovered}
                    />
                </div>
            </div>

            <div
                className="cottage-container"
                style={{
                    position: 'fixed',
                    right: '20px',
                    bottom: '20px',
                    zIndex: 9998,
                    cursor: 'pointer',
                    transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                onClick={() => mascotRoaming.goHome()}
                title="Mimi'nin Evi"
            >
                <img
                    src={cottageSvg}
                    alt="Mimi's Home"
                    style={{
                        width: '80px',
                        height: '80px',
                        filter: 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.2))',
                        transition: 'filter 0.3s ease'
                    }}
                />
            </div>
        </div>
    );
};

export default LivingBearImages;
