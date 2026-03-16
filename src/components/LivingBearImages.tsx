import React, { useEffect, useState, useRef, useCallback } from 'react';
import { mascotRoaming } from '../services/mascotRoaming';
import { useAuth } from '../contexts/AuthContext';
import UnifiedMascot, { MascotState } from './UnifiedMascot';

type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following' | 'goingHome';
type ViewDirection = 'front' | 'left' | 'right';

interface SpeechBubble {
    message: string;
    duration: number;
}

interface LivingBearImagesProps {
    onMascotClick?: () => void;
    onHomeClick?: () => void;
}

const BOUNDS = { xMin: 8, xMax: 92, yMin: 25, yMax: 88 };
const DRAG_RESUME_ROAMING_MS = 30_000;

const LivingBearImages: React.FC<LivingBearImagesProps> = ({ onMascotClick, onHomeClick }) => {
    const { userProfile } = useAuth();
    const [position, setPosition] = useState({ x: 85, y: 75 });
    const [animationState, setAnimationState] = useState<AnimationState>('idle');
    const [, setViewDirection] = useState<ViewDirection>('front');
    const [speechBubble, setSpeechBubble] = useState<SpeechBubble | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isDragonHome, setIsDragonHome] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const wasDraggingRef = useRef(false);
    const dragStartRef = useRef<{ clientX: number; clientY: number; posX: number; posY: number; time: number } | null>(null);
    const resumeRoamingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const mascotId = (userProfile?.settings as Record<string, string> | undefined)?.mascotId;

    useEffect(() => {
        mascotRoaming.setMascotId(mascotId || 'mimi_dragon');
    }, [mascotId]);

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
            setPosition(prev => {
                if (dragStartRef.current) return prev;
                return { ...newPos };
            });
            setAnimationState(newState as AnimationState);
            setViewDirection(newView);
            setSpeechBubble(newBubble);

            const stateStr = String(newState);
            if (stateStr === 'sleeping') {
                setIsDragonHome(true);
            } else if (stateStr !== 'sleeping') {
                setIsDragonHome(false);
            }
        });

        mascotRoaming.startRoaming();
        // Living AI Mascot activated

        return () => {
            unsubscribe();
            mascotRoaming.stopRoaming();
            if (resumeRoamingTimeoutRef.current) {
                clearTimeout(resumeRoamingTimeoutRef.current);
                resumeRoamingTimeoutRef.current = null;
            }
        };
    }, []);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
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
        if (onHomeClick) {
            onHomeClick();
        }
        if (isDragonHome) {
            setIsDragonHome(false);
            setAnimationState('celebrating');
            mascotRoaming.triggerCelebration();
        }
    };

    const mapState = (state: AnimationState): MascotState => {
        switch (state) {
            case 'following':
            case 'walking':
            case 'goingHome':
                return 'walking';
            case 'singing':
                return 'laughing';
            case 'surprised':
                return 'surprised';
            case 'jumping':
                return 'jumping';
            case 'celebrating':
                return 'celebrating';
            case 'dancing':
                return 'dancing';
            case 'sleeping':
                return 'sleeping';
            case 'waving':
                return 'waving';
            case 'laughing':
                return 'laughing';
            case 'thinking':
                return 'thinking';
            case 'love':
                return 'love';
            default:
                return 'idle';
        }
    };

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (e.button !== 0 && e.button !== undefined) return;
        e.preventDefault();
        if (resumeRoamingTimeoutRef.current) {
            clearTimeout(resumeRoamingTimeoutRef.current);
            resumeRoamingTimeoutRef.current = null;
        }
        dragStartRef.current = {
            clientX: e.clientX,
            clientY: e.clientY,
            posX: position.x,
            posY: position.y,
            time: Date.now()
        };
        setIsDragging(true);
        mascotRoaming.stopRoaming();
        mascotRoaming.startManualMove();
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }, [position.x, position.y]);

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        const start = dragStartRef.current;
        if (!start) return;
        e.preventDefault();
        const dx = ((e.clientX - start.clientX) / window.innerWidth) * 100;
        const dy = ((e.clientY - start.clientY) / window.innerHeight) * 100;
        const x = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, start.posX + dx));
        const y = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, start.posY + dy));
        setPosition({ x, y });
        mascotRoaming.setManualPosition(x, y);
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        const start = dragStartRef.current;
        (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
        if (start) {
            const dx = Math.abs(e.clientX - start.clientX);
            const dy = Math.abs(e.clientY - start.clientY);
            const duration = Date.now() - start.time;
            const movedEnough = dx > 15 || dy > 15;
            const longPressWithMove = duration > 300 && (dx > 5 || dy > 5);
            wasDraggingRef.current = movedEnough || longPressWithMove;
            setTimeout(() => { wasDraggingRef.current = false; }, 450);
            dragStartRef.current = null;
            setIsDragging(false);
            mascotRoaming.stopManualMove();
            if (resumeRoamingTimeoutRef.current) {
                clearTimeout(resumeRoamingTimeoutRef.current);
            }
            resumeRoamingTimeoutRef.current = setTimeout(() => {
                resumeRoamingTimeoutRef.current = null;
                mascotRoaming.startRoaming();
            }, DRAG_RESUME_ROAMING_MS);
        }
    }, []);

    useEffect(() => {
        if (!isDragging) return;
        const onMove = (e: PointerEvent) => {
            const start = dragStartRef.current;
            if (!start) return;
            const dx = ((e.clientX - start.clientX) / window.innerWidth) * 100;
            const dy = ((e.clientY - start.clientY) / window.innerHeight) * 100;
            const x = Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, start.posX + dx));
            const y = Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, start.posY + dy));
            setPosition({ x, y });
            mascotRoaming.setManualPosition(x, y);
        };
        const onUp = () => {
            if (!dragStartRef.current) return;
            dragStartRef.current = null;
            setIsDragging(false);
            mascotRoaming.stopManualMove();
            if (resumeRoamingTimeoutRef.current) clearTimeout(resumeRoamingTimeoutRef.current);
            resumeRoamingTimeoutRef.current = setTimeout(() => {
                resumeRoamingTimeoutRef.current = null;
                mascotRoaming.startRoaming();
            }, DRAG_RESUME_ROAMING_MS);
        };
        window.addEventListener('pointermove', onMove, { capture: true });
        window.addEventListener('pointerup', onUp, { capture: true });
        window.addEventListener('pointercancel', onUp, { capture: true });
        return () => {
            window.removeEventListener('pointermove', onMove, { capture: true });
            window.removeEventListener('pointerup', onUp, { capture: true });
            window.removeEventListener('pointercancel', onUp, { capture: true });
        };
    }, [isDragging]);

    return (
        <div className="living-bear-container" ref={containerRef}>
            {!isDragonHome && (
                <div
                    className={`mascot-wrapper mascot-touch-scroll-passthrough ${isHovered ? 'hovered' : ''} ${isDragging ? 'mascot-dragging' : ''}`}
                    style={{
                        position: 'fixed',
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                        WebkitBackfaceVisibility: 'hidden' as const,
                        backfaceVisibility: 'hidden' as const,
                        willChange: isDragging ? 'transform' : undefined,
                        transition: isDragging
                            ? 'none'
                            : animationState === 'following'
                                ? 'left 0.35s cubic-bezier(0.25, 0.1, 0.25, 1), top 0.35s cubic-bezier(0.25, 0.1, 0.25, 1)'
                                : (animationState === 'walking' || animationState === 'goingHome')
                                    ? 'left 4s cubic-bezier(0.25, 0.1, 0.25, 1), top 4s cubic-bezier(0.25, 0.1, 0.25, 1)'
                                    : 'left 0.25s ease-out, top 0.25s ease-out',
                        zIndex: isDragging ? 10001 : 9999,
                        touchAction: 'none'
                    }}
                >
                    <div
                        className="mascot-click-target"
                        style={{ pointerEvents: 'auto', cursor: isDragging ? 'grabbing' : 'grab' }}
                        onPointerDown={handlePointerDown}
                        onPointerMove={handlePointerMove}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={handlePointerUp}
                        onPointerLeave={handlePointerUp}
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            if (wasDraggingRef.current) return;
                            handleMascotClick();
                        }}
                        onMouseEnter={handleMascotHover}
                        onMouseLeave={handleMascotLeave}
                    >
                        {speechBubble && (
                            <div className="mascot-speech-bubble" aria-hidden>
                                {speechBubble.message}
                            </div>
                        )}
                        <UnifiedMascot
                            id={((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'}
                            state={mapState(animationState)}
                            isHovered={isHovered}
                        />
                    </div>
                </div>
            )}

            {/* Mascot's Cozy Home - Only for logged in users with profiles */}
            {userProfile && (
                <div
                    className={`dragon-home mascot-home-${(((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon').replace(/_/g, '-')} ${isDragonHome ? 'dragon-inside' : ''}`}
                    onClick={handleHomeClick}
                    title={isDragonHome ? "Click to wake up your companion! 🐲" : "Your companion's cozy home 🏠"}
                >
                    <div className="cave-entrance">
                        <div className="cave-arch"></div>
                        <div className="cave-shadow"></div>
                    </div>
                    <div className="cave-grass"></div>

                    {isDragonHome && (
                        <div className="sleeping-dragon">
                            <UnifiedMascot
                                id={((userProfile?.settings as Record<string, string>)?.mascotId) || 'mimi_dragon'}
                                state="sleeping"
                            />
                            <div className="sleep-zzz">💤</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LivingBearImages;
