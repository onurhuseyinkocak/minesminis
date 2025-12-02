import React, { useState, useEffect, useRef } from 'react';
import ProfessorPaws from './ProfessorPaws';
import { mascotRoaming } from '../services/mascotRoaming';
import './LivingBearImages.css';
import cottageSvg from '../assets/bear/cottage.svg';

type AnimationState = 'idle' | 'walking' | 'running' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping';

interface LivingBearImagesProps {
    onMascotClick?: () => void;
}

const LivingBearImages: React.FC<LivingBearImagesProps> = ({ onMascotClick }) => {
    const [position, setPosition] = useState({ x: 85, y: 75 });
    const [bearState, setBearState] = useState<AnimationState>('idle');
    const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('left');
    const [isAtHome, setIsAtHome] = useState(false);
    const [cottageGlow, setCottageGlow] = useState(false);
    const previousPositionRef = useRef({ x: 85, y: 75 });

    useEffect(() => {
        const unsubscribe = mascotRoaming.onChange((newPosition, newState) => {
            const prevX = previousPositionRef.current.x;
            
            if (newPosition.x > prevX) {
                setFacingDirection('right');
            } else if (newPosition.x < prevX) {
                setFacingDirection('left');
            }

            previousPositionRef.current = newPosition;
            setPosition(newPosition);
            setBearState(newState);

            setIsAtHome(newPosition.x > 80 && newPosition.y > 80 && newState === 'sleeping');
        });

        mascotRoaming.startRoaming();

        console.log('🎨 Living AI Mascot is now active on your website!');

        return () => {
            unsubscribe();
            mascotRoaming.stopRoaming();
        };
    }, []);

    useEffect(() => {
        const glowInterval = setInterval(() => {
            setCottageGlow(prev => !prev);
        }, 2000);
        return () => clearInterval(glowInterval);
    }, []);

    const handleMascotClick = () => {
        console.log('🎉 Mascot clicked! Opening chat...');
        mascotRoaming.triggerCelebration();
        if (onMascotClick) {
            onMascotClick();
        }
    };

    const handleCottageClick = () => {
        console.log('🏠 Cottage clicked! Opening chat...');
        if (isAtHome) {
            mascotRoaming.triggerSurprise();
        } else {
            mascotRoaming.triggerCelebration();
        }
        if (onMascotClick) {
            onMascotClick();
        }
    };

    return (
        <>
            <div
                className="living-bear-wrapper"
                style={{
                    position: 'fixed',
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: 'translate(-50%, -50%)',
                    transition: 'left 2.5s cubic-bezier(0.34, 1.56, 0.64, 1), top 2.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    zIndex: 9999,
                    pointerEvents: 'none'
                }}
            >
                <div style={{ pointerEvents: 'all' }}>
                    <ProfessorPaws
                        bearState={bearState}
                        facingDirection={facingDirection}
                        onClick={handleMascotClick}
                    />
                </div>
            </div>

            <div
                className={`mimi-cottage ${cottageGlow ? 'glow' : ''} ${isAtHome ? 'bear-home' : ''}`}
                onClick={handleCottageClick}
                title="Mimi'nin Evi - Tıkla ve Sohbet Et! 🏠"
            >
                <img src={cottageSvg} alt="Mimi's Cottage" className="cottage-image" />
                <div className="cottage-label">
                    <span className="cottage-name">Mimi's Home</span>
                    <span className="cottage-hint">Tıkla!</span>
                </div>
                {isAtHome && (
                    <div className="sleeping-indicator">
                        <span className="zzz">Z</span>
                        <span className="zzz delay-1">z</span>
                        <span className="zzz delay-2">z</span>
                    </div>
                )}
            </div>
        </>
    );
};

export default LivingBearImages;
