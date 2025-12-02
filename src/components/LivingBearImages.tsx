import React, { useState, useEffect } from 'react';
import ProfessorPaws from './ProfessorPaws';
import { mascotRoaming } from '../services/mascotRoaming';
import './LivingBearImages.css';

interface LivingBearImagesProps {
    onMascotClick?: () => void;
}

const LivingBearImages: React.FC<LivingBearImagesProps> = ({ onMascotClick }) => {
    const [position, setPosition] = useState({ x: 85, y: 80 });
    const [bearState, setBearState] = useState<'idle' | 'walking' | 'running' | 'dancing' | 'celebrating' | 'waving' | 'sleeping'>('idle');
    const [facingDirection, setFacingDirection] = useState<'left' | 'right'>('left');

    useEffect(() => {
        // Listen to AI decisions
        const unsubscribe = mascotRoaming.onChange((newPosition, newState) => {
            // Determine facing direction based on movement
            if (newPosition.x > position.x) {
                setFacingDirection('right');
            } else if (newPosition.x < position.x) {
                setFacingDirection('left');
            }

            setPosition(newPosition);
            setBearState(newState);
        });

        // Start AI roaming
        mascotRoaming.startRoaming();

        console.log('🎨 Living AI Mascot is now active on your website!');

        return () => {
            unsubscribe();
            mascotRoaming.stopRoaming();
        };
    }, [position.x]);

    const handleMascotClick = () => {
        console.log('🎉 Mascot clicked! Opening chat...');

        // Trigger celebration animation
        mascotRoaming.triggerCelebration();

        // Call parent callback to open chat
        if (onMascotClick) {
            onMascotClick();
        }
    };

    return (
        <div
            className="living-bear-wrapper"
            style={{
                position: 'fixed',
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                transition: 'left 2s ease-in-out, top 2s ease-in-out',
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
    );
};

export default LivingBearImages;
