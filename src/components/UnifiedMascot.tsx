import React, { useState, useEffect, useRef } from 'react';
import { GLINTS } from '../config/GlintsConfig';

export type MascotState = 'idle' | 'walking' | 'dancing' | 'sleeping' | 'celebrating' | 'waving' | 'laughing' | 'thinking' | 'love' | 'jumping' | 'surprised' | 'singing' | 'following';

interface UnifiedMascotProps {
    /** Glint id for config (mimi_dragon, nova_fox, bubbles_octo, sparky_alien). When set, overrides type for config lookup. */
    id?: string;
    type?: string;
    state: MascotState;
    onClick?: () => void;
    isHovered?: boolean;
    size?: number;
    hidden?: boolean;
}

const VALID_MASCOT_IDS = ['mimi_dragon', 'nova_fox', 'bubbles_octo', 'sparky_alien'];

const UnifiedMascot: React.FC<UnifiedMascotProps> = ({
    id: idProp,
    type = 'mimi_dragon',
    state,
    onClick,
    isHovered = false,
    size = 140,
    hidden = false
}) => {
    const safeId = (idProp && VALID_MASCOT_IDS.includes(idProp)) ? idProp : (VALID_MASCOT_IDS.includes(type) ? type : 'mimi_dragon');
    const config = GLINTS[safeId] || GLINTS.mimi_dragon;
    const [isSmiling, setIsSmiling] = useState(false);
    const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
    const [isRandomLooking, setIsRandomLooking] = useState(false);
    const [randomLookOffset, setRandomLookOffset] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const randomLookTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const randomLookIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const lastMouseMoveRef = useRef<number>(Date.now());

    useEffect(() => {
        if (state === 'idle' || state === 'walking') {
            const smileInterval = setInterval(() => {
                setIsSmiling(true);
                setTimeout(() => setIsSmiling(false), 2000);
            }, 8000 + Math.random() * 5000);
            return () => clearInterval(smileInterval);
        }
    }, [state]);

    useEffect(() => {
        if (state === 'sleeping' || state === 'thinking') {
            setRandomLookOffset({ x: 0, y: 0 });
            setIsRandomLooking(false);
            return;
        }

        randomLookIntervalRef.current = setInterval(() => {
            const timeSinceLastMove = Date.now() - lastMouseMoveRef.current;
            if (timeSinceLastMove < 2000) return;

            if (Math.random() < 0.08) {
                setIsRandomLooking(true);
                const directions = [{ x: -8, y: 0 }, { x: 8, y: 0 }, { x: -6, y: -4 }, { x: 6, y: -4 }, { x: 0, y: -6 }];
                const randomDir = directions[Math.floor(Math.random() * directions.length)];
                setRandomLookOffset(randomDir);

                randomLookTimeoutRef.current = setTimeout(() => {
                    setIsRandomLooking(false);
                    setRandomLookOffset({ x: 0, y: 0 });
                }, 500 + Math.random() * 400);
            }
        }, 8000 + Math.random() * 4000);

        return () => {
            if (randomLookIntervalRef.current) clearInterval(randomLookIntervalRef.current);
            if (randomLookTimeoutRef.current) clearTimeout(randomLookTimeoutRef.current);
        };
    }, [state]);

    useEffect(() => {
        const shouldTrack = state !== 'sleeping' && state !== 'thinking';
        const updateEyes = (clientX: number, clientY: number) => {
            if (!containerRef.current || !shouldTrack) return;
            lastMouseMoveRef.current = Date.now();
            if (isRandomLooking) { setIsRandomLooking(false); setRandomLookOffset({ x: 0, y: 0 }); }
            const rect = containerRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height * 0.3;
            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 280;
            const normalizedDist = Math.min(distance / maxDistance, 1);
            const maxOffset = 11;
            const angle = Math.atan2(dy, dx);
            const offsetX = Math.cos(angle) * maxOffset * normalizedDist;
            const offsetY = Math.sin(angle) * maxOffset * normalizedDist;

            setEyeOffset({
                x: Math.max(-maxOffset, Math.min(maxOffset, offsetX)),
                y: Math.max(-maxOffset, Math.min(maxOffset, offsetY))
            });
        };
        const handleMouseMove = (e: MouseEvent) => updateEyes(e.clientX, e.clientY);
        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) updateEyes(e.touches[0].clientX, e.touches[0].clientY);
        };
        if (shouldTrack) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: true });
        } else {
            setEyeOffset({ x: 0, y: 0 });
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [state, isRandomLooking]);

    const getEmoji = () => {
        switch (state) {
            case 'love': return '\u2764\uFE0F';
            case 'celebrating': return '\uD83C\uDF89';
            case 'thinking': return '\uD83D\uDCAD';
            case 'sleeping': return '\uD83D\uDCA4';
            case 'surprised': return '\u2757';
            case 'laughing': return '\uD83D\uDE02';
            default: return null;
        }
    };

    const emoji = getEmoji();
    const showBigSmile = state === 'laughing' || state === 'celebrating' || state === 'dancing' || isSmiling;
    const currentEyeOffset = isRandomLooking ? randomLookOffset : eyeOffset;
    const eyeStyle = state !== 'sleeping' && state !== 'thinking' ? {
        transform: `translate(${currentEyeOffset.x}px, ${currentEyeOffset.y}px)`,
        transition: isRandomLooking ? 'transform 0.3s cubic-bezier(0.34, 1.2, 0.64, 1)' : 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    } : {};

    const renderCharacter = () => {
        switch (config.type) {
            case 'mimi_dragon': return renderDragon();
            case 'nova_fox': return renderFox();
            case 'bubbles_octo': return renderOctopus();
            case 'sparky_alien': return renderAlien();
            default: return renderDragon();
        }
    };

    const renderMouth = (x: number, y: number, w = 24) => (
        <path
            d={showBigSmile ? `M ${x - w / 2} ${y} Q ${x} ${y + 15} ${x + w / 2} ${y}` : `M ${x - w / 2} ${y + 2} Q ${x} ${y + 8} ${x + w / 2} ${y + 2}`}
            stroke="#333"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
        />
    );

    /* ===================== MIMI DRAGON ===================== */
    const renderDragon = () => (
        <>
            <defs>
                <radialGradient id="dragonBodyGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#96E87A" />
                    <stop offset="40%" stopColor="#7ED957" />
                    <stop offset="100%" stopColor="#4AAE2B" />
                </radialGradient>
                <radialGradient id="dragonBellyGrad" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#D4FABC" />
                    <stop offset="50%" stopColor="#C5F5A8" />
                    <stop offset="100%" stopColor="#A8E88A" />
                </radialGradient>
                <linearGradient id="dragonHornGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#FFB347" />
                    <stop offset="50%" stopColor="#FFD93D" />
                    <stop offset="100%" stopColor="#FFF176" />
                </linearGradient>
                <linearGradient id="dragonWingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A8E88A" />
                    <stop offset="50%" stopColor="#7ED957" />
                    <stop offset="100%" stopColor="#5BC236" />
                </linearGradient>
                <linearGradient id="dragonWingMembrane" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#C5F5A8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#96E87A" stopOpacity="0.5" />
                </linearGradient>
                <radialGradient id="dragonFireGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF176" />
                    <stop offset="40%" stopColor="#FFD93D" />
                    <stop offset="70%" stopColor="#FF9800" />
                    <stop offset="100%" stopColor="#FF5722" stopOpacity="0.6" />
                </radialGradient>
                <filter id="dragonGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Tail */}
            <g className="m-tail">
                <path d="M 142 148 Q 165 135 180 142 Q 195 150 192 168 Q 188 182 175 185 Q 165 186 168 175 Q 172 162 158 158" fill="url(#dragonBodyGrad)" stroke="#4AAE2B" strokeWidth="1.5" />
                {/* Tail spikes */}
                <path d="M 160 140 L 164 132 L 168 141" fill="#FFD93D" />
                <path d="M 172 138 L 178 128 L 180 140" fill="#FFD93D" />
                {/* Flame tip */}
                <g filter="url(#dragonGlow)">
                    <path d="M 188 170 Q 195 158 200 168 Q 205 155 198 175 Q 192 182 188 170" fill="url(#dragonFireGrad)" className="m-ambient-sparkle m-sparkle-1" />
                    <path d="M 185 178 Q 190 170 195 178 Q 192 185 185 178" fill="#FFD93D" opacity="0.8" className="m-ambient-sparkle m-sparkle-2" />
                </g>
            </g>

            {/* Wings */}
            <g className="m-wing m-wing-left">
                <path d="M 55 95 L 22 52 L 35 78 L 12 58 L 28 85 L 8 75 L 30 100 Q 38 112 55 108" fill="url(#dragonWingGrad)" stroke="#5BC236" strokeWidth="1.5" />
                <path d="M 55 95 L 35 78 L 28 85 L 30 100 Q 38 112 55 108" fill="url(#dragonWingMembrane)" />
                {/* Wing veins */}
                <line x1="42" y1="98" x2="28" y2="72" stroke="#5BC236" strokeWidth="0.8" opacity="0.5" />
                <line x1="40" y1="102" x2="20" y2="78" stroke="#5BC236" strokeWidth="0.8" opacity="0.5" />
            </g>
            <g className="m-wing m-wing-right">
                <path d="M 145 95 L 178 52 L 165 78 L 188 58 L 172 85 L 192 75 L 170 100 Q 162 112 145 108" fill="url(#dragonWingGrad)" stroke="#5BC236" strokeWidth="1.5" />
                <path d="M 145 95 L 165 78 L 172 85 L 170 100 Q 162 112 145 108" fill="url(#dragonWingMembrane)" />
                <line x1="158" y1="98" x2="172" y2="72" stroke="#5BC236" strokeWidth="0.8" opacity="0.5" />
                <line x1="160" y1="102" x2="180" y2="78" stroke="#5BC236" strokeWidth="0.8" opacity="0.5" />
            </g>

            {/* Legs */}
            <g className="m-leg m-leg-left">
                <ellipse cx="72" cy="172" rx="17" ry="24" fill="url(#dragonBodyGrad)" />
                <ellipse cx="72" cy="192" rx="15" ry="9" fill="#4AAE2B" className="m-foot" />
                {/* Toes */}
                <circle cx="62" cy="196" r="4" fill="#4AAE2B" />
                <circle cx="72" cy="198" r="4" fill="#4AAE2B" />
                <circle cx="82" cy="196" r="4" fill="#4AAE2B" />
            </g>
            <g className="m-leg m-leg-right">
                <ellipse cx="128" cy="172" rx="17" ry="24" fill="url(#dragonBodyGrad)" />
                <ellipse cx="128" cy="192" rx="15" ry="9" fill="#4AAE2B" className="m-foot" />
                <circle cx="118" cy="196" r="4" fill="#4AAE2B" />
                <circle cx="128" cy="198" r="4" fill="#4AAE2B" />
                <circle cx="138" cy="196" r="4" fill="#4AAE2B" />
            </g>

            {/* Body */}
            <g className="m-body" filter="url(#softShadow)">
                <ellipse cx="100" cy="132" rx="52" ry="56" fill="url(#dragonBodyGrad)" />
                {/* Belly with scales pattern */}
                <ellipse cx="100" cy="140" rx="38" ry="42" fill="url(#dragonBellyGrad)" />
                {/* Belly scale lines */}
                <path d="M 72 125 Q 100 130 128 125" stroke="#A8E88A" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 68 138 Q 100 143 132 138" stroke="#A8E88A" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 72 151 Q 100 156 128 151" stroke="#A8E88A" strokeWidth="1" fill="none" opacity="0.5" />
                <path d="M 78 163 Q 100 167 122 163" stroke="#A8E88A" strokeWidth="1" fill="none" opacity="0.5" />
            </g>

            {/* Arms */}
            <g className="m-arm m-arm-left">
                <ellipse cx="52" cy="118" rx="14" ry="22" fill="url(#dragonBodyGrad)" transform="rotate(25 52 118)" />
                <ellipse cx="44" cy="136" rx="10" ry="8" fill="#4AAE2B" className="m-hand" />
                <circle cx="38" cy="138" r="3" fill="#4AAE2B" />
                <circle cx="44" cy="142" r="3" fill="#4AAE2B" />
                <circle cx="50" cy="140" r="3" fill="#4AAE2B" />
            </g>
            <g className="m-arm m-arm-right">
                <ellipse cx="148" cy="118" rx="14" ry="22" fill="url(#dragonBodyGrad)" transform="rotate(-25 148 118)" />
                <ellipse cx="156" cy="136" rx="10" ry="8" fill="#4AAE2B" className="m-hand" />
                <circle cx="150" cy="140" r="3" fill="#4AAE2B" />
                <circle cx="156" cy="142" r="3" fill="#4AAE2B" />
                <circle cx="162" cy="138" r="3" fill="#4AAE2B" />
            </g>

            {/* Head */}
            <g className="m-head">
                <ellipse cx="100" cy="58" rx="44" ry="40" fill="url(#dragonBodyGrad)" filter="url(#softShadow)" />

                {/* Back spines */}
                <path d="M 92 20 L 95 8 L 100 18" fill="#FFD93D" />
                <path d="M 100 18 L 105 5 L 108 18" fill="#FFD93D" />

                {/* Horns */}
                <g className="m-horn-left">
                    <ellipse cx="66" cy="26" rx="9" ry="22" fill="url(#dragonHornGrad)" transform="rotate(-18 66 26)" />
                    <ellipse cx="64" cy="12" rx="4" ry="8" fill="#FFF176" transform="rotate(-18 64 12)" opacity="0.6" />
                </g>
                <g className="m-horn-right">
                    <ellipse cx="134" cy="26" rx="9" ry="22" fill="url(#dragonHornGrad)" transform="rotate(18 134 26)" />
                    <ellipse cx="136" cy="12" rx="4" ry="8" fill="#FFF176" transform="rotate(18 136 12)" opacity="0.6" />
                </g>

                {/* Snout bump */}
                <ellipse cx="100" cy="76" rx="20" ry="14" fill="#6BCB55" />

                {/* Eyes */}
                <g className="m-eyes">
                    <g className="m-eye">
                        <ellipse cx="78" cy="52" rx="16" ry="18" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <ellipse cx="80" cy="54" rx="10" ry="12" fill="#2D1B14" />
                            {/* Iris detail */}
                            <ellipse cx="80" cy="54" rx="7" ry="9" fill="#3E2723" />
                            <circle cx="84" cy="48" r="4" fill="white" />
                            <circle cx="76" cy="58" r="2" fill="white" opacity="0.7" />
                        </g>
                    </g>
                    <g className="m-eye">
                        <ellipse cx="122" cy="52" rx="16" ry="18" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <ellipse cx="124" cy="54" rx="10" ry="12" fill="#2D1B14" />
                            <ellipse cx="124" cy="54" rx="7" ry="9" fill="#3E2723" />
                            <circle cx="128" cy="48" r="4" fill="white" />
                            <circle cx="120" cy="58" r="2" fill="white" opacity="0.7" />
                        </g>
                    </g>
                </g>

                {/* Cheeks */}
                <ellipse cx="55" cy="66" rx="12" ry="8" fill="#FFB6C1" opacity="0.5" className="m-cheek m-cheek-left" />
                <ellipse cx="145" cy="66" rx="12" ry="8" fill="#FFB6C1" opacity="0.5" className="m-cheek m-cheek-right" />

                {/* Nostrils */}
                <ellipse cx="92" cy="76" rx="3.5" ry="3" fill="#4AAE2B" className="m-nostril" />
                <ellipse cx="108" cy="76" rx="3.5" ry="3" fill="#4AAE2B" className="m-nostril" />

                {/* Mouth */}
                {renderMouth(100, 86, 28)}
                {(state === 'laughing' || state === 'celebrating') && (
                    <path d="M 100 90 Q 100 100 94 104 Q 100 102 106 104 Q 100 100 100 90" fill="#FF7B9C" className="m-tongue" />
                )}
            </g>

            {/* Fire sparkles */}
            <g className="m-dragon-sparkles">
                <g filter="url(#dragonGlow)">
                    <circle cx="38" cy="38" r="3.5" fill="#FFD93D" className="m-ambient-sparkle m-sparkle-1" />
                    <circle cx="162" cy="32" r="2.5" fill="#FF9800" className="m-ambient-sparkle m-sparkle-2" />
                    <circle cx="22" cy="105" r="3" fill="#FF5722" className="m-ambient-sparkle m-sparkle-3" opacity="0.7" />
                    <circle cx="178" cy="98" r="2" fill="#FFD93D" className="m-ambient-sparkle m-sparkle-4" />
                    {/* Extra fire particles */}
                    <path d="M 30 70 L 32 64 L 34 70 L 32 68 Z" fill="#FFD93D" className="m-ambient-sparkle m-sparkle-1" opacity="0.6" />
                    <path d="M 170 60 L 172 54 L 174 60 L 172 58 Z" fill="#FF9800" className="m-ambient-sparkle m-sparkle-3" opacity="0.6" />
                </g>
            </g>
        </>
    );

    /* ===================== NOVA FOX ===================== */
    const renderFox = () => (
        <>
            <defs>
                <radialGradient id="foxBodyGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#FFB74D" />
                    <stop offset="40%" stopColor="#FF9F1C" />
                    <stop offset="100%" stopColor="#E68900" />
                </radialGradient>
                <radialGradient id="foxBellyGrad" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#FFFDE7" />
                    <stop offset="50%" stopColor="#FFF4E6" />
                    <stop offset="100%" stopColor="#FFE0B2" />
                </radialGradient>
                <linearGradient id="foxEarInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#7B1FA2" />
                    <stop offset="50%" stopColor="#E040FB" />
                    <stop offset="100%" stopColor="#CE93D8" />
                </linearGradient>
                <radialGradient id="foxTailGrad" cx="30%" cy="40%" r="70%">
                    <stop offset="0%" stopColor="#FFB74D" />
                    <stop offset="60%" stopColor="#FF9F1C" />
                    <stop offset="100%" stopColor="#E68900" />
                </radialGradient>
                <radialGradient id="foxTailTipGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF4E6" />
                    <stop offset="100%" stopColor="#FFE0B2" />
                </radialGradient>
                <radialGradient id="cosmicStarGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFF176" />
                    <stop offset="40%" stopColor="#E040FB" />
                    <stop offset="100%" stopColor="#7B1FA2" stopOpacity="0" />
                </radialGradient>
                <filter id="cosmicGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="foxShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Tail - big fluffy cosmic tail */}
            <g className="m-tail">
                <path d="M 140 140 Q 170 120 188 135 Q 200 150 195 170 Q 188 192 170 195 Q 155 196 160 180 Q 165 165 148 155" fill="url(#foxTailGrad)" stroke="#E68900" strokeWidth="1" />
                {/* Tail tip white */}
                <path d="M 195 165 Q 192 185 175 192 Q 162 194 165 182 Q 168 172 185 170" fill="url(#foxTailTipGrad)" />
                {/* Star particles on tail */}
                <g filter="url(#cosmicGlow)">
                    <path d="M 178 148 L 180 143 L 182 148 L 177 146 L 183 146 Z" fill="#FFF176" className="m-ambient-sparkle m-sparkle-1" />
                    <path d="M 190 162 L 191 159 L 192 162 L 189 161 L 193 161 Z" fill="#E040FB" className="m-ambient-sparkle m-sparkle-2" />
                    <circle cx="185" cy="180" r="2" fill="#E040FB" className="m-ambient-sparkle m-sparkle-3" opacity="0.7" />
                </g>
            </g>

            {/* Legs */}
            <g className="m-leg m-leg-left">
                <ellipse cx="72" cy="178" rx="15" ry="20" fill="url(#foxBodyGrad)" />
                <ellipse cx="72" cy="194" rx="13" ry="8" fill="#E68900" className="m-foot" />
            </g>
            <g className="m-leg m-leg-right">
                <ellipse cx="128" cy="178" rx="15" ry="20" fill="url(#foxBodyGrad)" />
                <ellipse cx="128" cy="194" rx="13" ry="8" fill="#E68900" className="m-foot" />
            </g>

            {/* Body */}
            <g className="m-body" filter="url(#foxShadow)">
                <ellipse cx="100" cy="135" rx="50" ry="55" fill="url(#foxBodyGrad)" />
                {/* Chest fur white patch */}
                <ellipse cx="100" cy="142" rx="35" ry="40" fill="url(#foxBellyGrad)" />
                {/* Fur texture lines */}
                <path d="M 72 120 Q 68 125 72 130" stroke="#E68900" strokeWidth="0.8" fill="none" opacity="0.4" />
                <path d="M 128 120 Q 132 125 128 130" stroke="#E68900" strokeWidth="0.8" fill="none" opacity="0.4" />
                {/* Star pattern on body */}
                <path d="M 85 125 L 86 122 L 87 125 L 84 124 L 88 124 Z" fill="#E040FB" opacity="0.4" />
                <path d="M 118 130 L 119 128 L 120 130 L 117 129 L 121 129 Z" fill="#E040FB" opacity="0.3" />
            </g>

            {/* Arms */}
            <g className="m-arm m-arm-left">
                <ellipse cx="52" cy="120" rx="13" ry="20" fill="url(#foxBodyGrad)" transform="rotate(20 52 120)" />
                <ellipse cx="46" cy="136" rx="9" ry="7" fill="#E68900" className="m-hand" />
            </g>
            <g className="m-arm m-arm-right">
                <ellipse cx="148" cy="120" rx="13" ry="20" fill="url(#foxBodyGrad)" transform="rotate(-20 148 120)" />
                <ellipse cx="154" cy="136" rx="9" ry="7" fill="#E68900" className="m-hand" />
            </g>

            {/* Head */}
            <g className="m-head">
                {/* Ears - big triangular with galaxy inside */}
                <g className="m-ear-left">
                    <path d="M 60 42 L 50 5 L 82 38 Z" fill="url(#foxBodyGrad)" stroke="#E68900" strokeWidth="1" />
                    <path d="M 62 40 L 54 12 L 78 38 Z" fill="url(#foxEarInnerGrad)" opacity="0.7" />
                    {/* Galaxy dots inside ear */}
                    <circle cx="62" cy="28" r="1.5" fill="#FFF176" opacity="0.8" />
                    <circle cx="66" cy="32" r="1" fill="white" opacity="0.6" />
                    <circle cx="60" cy="35" r="0.8" fill="#E040FB" opacity="0.5" />
                </g>
                <g className="m-ear-right">
                    <path d="M 140 42 L 150 5 L 118 38 Z" fill="url(#foxBodyGrad)" stroke="#E68900" strokeWidth="1" />
                    <path d="M 138 40 L 146 12 L 122 38 Z" fill="url(#foxEarInnerGrad)" opacity="0.7" />
                    <circle cx="138" cy="28" r="1.5" fill="#FFF176" opacity="0.8" />
                    <circle cx="134" cy="32" r="1" fill="white" opacity="0.6" />
                    <circle cx="140" cy="35" r="0.8" fill="#E040FB" opacity="0.5" />
                </g>

                {/* Head shape */}
                <ellipse cx="100" cy="65" rx="45" ry="40" fill="url(#foxBodyGrad)" filter="url(#foxShadow)" />

                {/* Face white patch (V shape) */}
                <path d="M 68 55 Q 80 50 100 80 Q 120 50 132 55 L 125 65 Q 110 55 100 88 Q 90 55 75 65 Z" fill="url(#foxBellyGrad)" opacity="0.9" />

                {/* Star marking on forehead */}
                <g filter="url(#cosmicGlow)">
                    <path d="M 100 38 L 102 32 L 104 38 L 98 35 L 106 35 Z" fill="#E040FB" opacity="0.6" />
                </g>

                {/* Eyes */}
                <g className="m-eyes">
                    <g className="m-eye">
                        <ellipse cx="80" cy="60" rx="14" ry="16" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="82" cy="62" r="9" fill="#2D1B14" />
                            <circle cx="82" cy="62" r="6" fill="#4E342E" />
                            {/* Cosmic iris detail */}
                            <circle cx="80" cy="64" r="2" fill="#E040FB" opacity="0.3" />
                            <circle cx="86" cy="56" r="3.5" fill="white" />
                            <circle cx="78" cy="66" r="1.5" fill="white" opacity="0.7" />
                        </g>
                    </g>
                    <g className="m-eye">
                        <ellipse cx="120" cy="60" rx="14" ry="16" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="122" cy="62" r="9" fill="#2D1B14" />
                            <circle cx="122" cy="62" r="6" fill="#4E342E" />
                            <circle cx="120" cy="64" r="2" fill="#E040FB" opacity="0.3" />
                            <circle cx="126" cy="56" r="3.5" fill="white" />
                            <circle cx="118" cy="66" r="1.5" fill="white" opacity="0.7" />
                        </g>
                    </g>
                </g>

                {/* Cheeks */}
                <ellipse cx="58" cy="72" rx="10" ry="7" fill="#FF8A65" opacity="0.5" className="m-cheek m-cheek-left" />
                <ellipse cx="142" cy="72" rx="10" ry="7" fill="#FF8A65" opacity="0.5" className="m-cheek m-cheek-right" />

                {/* Nose */}
                <ellipse cx="100" cy="78" rx="5" ry="4" fill="#333" />
                <ellipse cx="100" cy="77" rx="2" ry="1.5" fill="white" opacity="0.3" />

                {/* Whiskers */}
                <line x1="60" y1="76" x2="40" y2="72" stroke="#E68900" strokeWidth="1" opacity="0.5" />
                <line x1="60" y1="80" x2="38" y2="82" stroke="#E68900" strokeWidth="1" opacity="0.5" />
                <line x1="140" y1="76" x2="160" y2="72" stroke="#E68900" strokeWidth="1" opacity="0.5" />
                <line x1="140" y1="80" x2="162" y2="82" stroke="#E68900" strokeWidth="1" opacity="0.5" />

                {/* Mouth */}
                {renderMouth(100, 86, 24)}
                {(state === 'laughing' || state === 'celebrating') && (
                    <path d="M 100 90 Q 100 98 95 101 Q 100 99 105 101 Q 100 98 100 90" fill="#FF7B9C" className="m-tongue" />
                )}
            </g>

            {/* Cosmic ambient particles */}
            <g className="m-dragon-sparkles">
                <g filter="url(#cosmicGlow)">
                    <path d="M 35 42 L 37 36 L 39 42 L 33 39 L 41 39 Z" fill="#E040FB" className="m-ambient-sparkle m-sparkle-1" />
                    <path d="M 168 28 L 169 24 L 170 28 L 167 27 L 171 27 Z" fill="#FFF176" className="m-ambient-sparkle m-sparkle-2" />
                    <circle cx="22" cy="95" r="2.5" fill="#E040FB" className="m-ambient-sparkle m-sparkle-3" opacity="0.6" />
                    <path d="M 15 70 L 17 65 L 19 70 L 14 68 L 20 68 Z" fill="#FFF176" className="m-ambient-sparkle m-sparkle-4" opacity="0.5" />
                    <circle cx="175" cy="55" r="1.5" fill="#E040FB" className="m-ambient-sparkle m-sparkle-1" opacity="0.5" />
                    <path d="M 185 105 L 186 102 L 187 105 L 184 104 L 188 104 Z" fill="#FFF176" className="m-ambient-sparkle m-sparkle-3" opacity="0.4" />
                </g>
            </g>
        </>
    );

    /* ===================== BUBBLES OCTOPUS ===================== */
    const renderOctopus = () => (
        <>
            <defs>
                <radialGradient id="octoBodyGrad" cx="40%" cy="30%" r="65%">
                    <stop offset="0%" stopColor="#4DD0E1" />
                    <stop offset="40%" stopColor="#00BCD4" />
                    <stop offset="100%" stopColor="#00838F" />
                </radialGradient>
                <radialGradient id="octoHeadGrad" cx="40%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#4DD0E1" />
                    <stop offset="50%" stopColor="#26C6DA" />
                    <stop offset="100%" stopColor="#00ACC1" />
                </radialGradient>
                <radialGradient id="octoSpotGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#B388FF" />
                    <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0.6" />
                </radialGradient>
                <linearGradient id="octoTentGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#00BCD4" />
                    <stop offset="100%" stopColor="#00838F" />
                </linearGradient>
                <linearGradient id="octoSuckerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#E0F7FA" />
                    <stop offset="100%" stopColor="#B2EBF2" />
                </linearGradient>
                <radialGradient id="bubbleGrad" cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="white" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#E0F7FA" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#80DEEA" stopOpacity="0.2" />
                </radialGradient>
                <filter id="octoGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="octoShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Tentacles - 8 curly tentacles */}
            <g className="m-leg m-leg-left">
                {/* Back tentacles */}
                <path d="M 55 140 Q 30 160 25 180 Q 22 195 32 200 Q 38 202 36 192 Q 35 182 42 170" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="30" cy="185" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="28" cy="193" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 65 148 Q 45 170 38 188 Q 35 200 42 205 Q 48 207 46 197 Q 44 185 55 172" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="42" cy="192" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="40" cy="200" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 75 152 Q 60 175 55 195 Q 53 208 60 210 Q 66 212 64 202 Q 62 190 70 178" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="58" cy="198" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="56" cy="206" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 85 155 Q 78 178 75 198 Q 74 210 80 212 Q 86 213 84 203 Q 82 192 86 180" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="77" cy="200" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="76" cy="208" r="2" fill="url(#octoSuckerGrad)" />
            </g>

            <g className="m-leg m-leg-right">
                <path d="M 115 155 Q 122 178 125 198 Q 126 210 120 212 Q 114 213 116 203 Q 118 192 114 180" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="123" cy="200" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="124" cy="208" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 125 152 Q 140 175 145 195 Q 147 208 140 210 Q 134 212 136 202 Q 138 190 130 178" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="142" cy="198" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="144" cy="206" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 135 148 Q 155 170 162 188 Q 165 200 158 205 Q 152 207 154 197 Q 156 185 145 172" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="158" cy="192" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="160" cy="200" r="2" fill="url(#octoSuckerGrad)" />

                <path d="M 145 140 Q 170 160 175 180 Q 178 195 168 200 Q 162 202 164 192 Q 165 182 158 170" fill="url(#octoTentGrad)" stroke="#00838F" strokeWidth="1" />
                <circle cx="170" cy="185" r="2.5" fill="url(#octoSuckerGrad)" />
                <circle cx="172" cy="193" r="2" fill="url(#octoSuckerGrad)" />
            </g>

            {/* Body / Head - big round dome */}
            <g className="m-body" filter="url(#octoShadow)">
                <ellipse cx="100" cy="100" rx="55" ry="58" fill="url(#octoHeadGrad)" />
                {/* Head dome highlight */}
                <ellipse cx="90" cy="72" rx="30" ry="22" fill="#4DD0E1" opacity="0.4" />
            </g>

            <g className="m-head">
                {/* Purple spots */}
                <circle cx="65" cy="80" r="6" fill="url(#octoSpotGrad)" opacity="0.5" />
                <circle cx="140" cy="75" r="5" fill="url(#octoSpotGrad)" opacity="0.4" />
                <circle cx="72" cy="60" r="4" fill="url(#octoSpotGrad)" opacity="0.3" />
                <circle cx="132" cy="58" r="4.5" fill="url(#octoSpotGrad)" opacity="0.35" />
                <circle cx="55" cy="100" r="3.5" fill="url(#octoSpotGrad)" opacity="0.25" />
                <circle cx="148" cy="95" r="3" fill="url(#octoSpotGrad)" opacity="0.3" />

                {/* Eyes - big and round */}
                <g className="m-eyes">
                    <g className="m-eye">
                        <ellipse cx="78" cy="90" rx="17" ry="19" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="80" cy="92" r="11" fill="#2D1B14" />
                            <circle cx="80" cy="92" r="7" fill="#1A237E" />
                            {/* Deep ocean iris */}
                            <circle cx="78" cy="94" r="3" fill="#7C4DFF" opacity="0.4" />
                            <circle cx="84" cy="86" r="4" fill="white" />
                            <circle cx="76" cy="96" r="2" fill="white" opacity="0.6" />
                        </g>
                    </g>
                    <g className="m-eye">
                        <ellipse cx="122" cy="90" rx="17" ry="19" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="124" cy="92" r="11" fill="#2D1B14" />
                            <circle cx="124" cy="92" r="7" fill="#1A237E" />
                            <circle cx="122" cy="94" r="3" fill="#7C4DFF" opacity="0.4" />
                            <circle cx="128" cy="86" r="4" fill="white" />
                            <circle cx="120" cy="96" r="2" fill="white" opacity="0.6" />
                        </g>
                    </g>
                </g>

                {/* Cheeks */}
                <ellipse cx="58" cy="105" rx="10" ry="7" fill="#F48FB1" opacity="0.45" className="m-cheek m-cheek-left" />
                <ellipse cx="142" cy="105" rx="10" ry="7" fill="#F48FB1" opacity="0.45" className="m-cheek m-cheek-right" />

                {/* Mouth */}
                {renderMouth(100, 115, 24)}
                {(state === 'laughing' || state === 'celebrating') && (
                    <path d="M 100 118 Q 100 126 95 129 Q 100 127 105 129 Q 100 126 100 118" fill="#FF7B9C" className="m-tongue" />
                )}
            </g>

            {/* Floating bubbles */}
            <g className="m-dragon-sparkles">
                <g filter="url(#octoGlow)">
                    <circle cx="32" cy="48" r="6" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-1" />
                    <circle cx="28" cy="52" r="1.5" fill="white" opacity="0.6" />

                    <circle cx="170" cy="38" r="4.5" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-2" />
                    <circle cx="168" cy="40" r="1" fill="white" opacity="0.6" />

                    <circle cx="18" cy="82" r="3.5" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-3" />

                    <circle cx="182" cy="70" r="5" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-4" />
                    <circle cx="180" cy="72" r="1.2" fill="white" opacity="0.5" />

                    <circle cx="45" cy="25" r="2.5" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-1" opacity="0.6" />
                    <circle cx="160" cy="55" r="2" fill="url(#bubbleGrad)" stroke="#80DEEA" strokeWidth="0.5" className="m-ambient-sparkle m-sparkle-3" opacity="0.5" />
                </g>
            </g>
        </>
    );

    /* ===================== SPARKY ALIEN ===================== */
    const renderAlien = () => (
        <>
            <defs>
                <radialGradient id="alienBodyGrad" cx="40%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#F06292" />
                    <stop offset="40%" stopColor="#E040FB" />
                    <stop offset="100%" stopColor="#AB47BC" />
                </radialGradient>
                <radialGradient id="alienBellyGrad" cx="50%" cy="30%" r="60%">
                    <stop offset="0%" stopColor="#FCE4EC" />
                    <stop offset="50%" stopColor="#F3E5F5" />
                    <stop offset="100%" stopColor="#E1BEE7" />
                </radialGradient>
                <radialGradient id="alienAntennaGlowGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFF8D" />
                    <stop offset="40%" stopColor="#FFEB3B" />
                    <stop offset="100%" stopColor="#FFC107" stopOpacity="0.3" />
                </radialGradient>
                <linearGradient id="alienAntennaGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#E040FB" />
                    <stop offset="100%" stopColor="#CE93D8" />
                </linearGradient>
                <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFEB3B" />
                    <stop offset="100%" stopColor="#FFC107" />
                </linearGradient>
                <filter id="alienGlow" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="antennaGlow" x="-60%" y="-60%" width="220%" height="220%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="alienShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.15" />
                </filter>
            </defs>

            {/* Stubby legs */}
            <g className="m-leg m-leg-left">
                <ellipse cx="75" cy="185" rx="16" ry="18" fill="url(#alienBodyGrad)" />
                <ellipse cx="75" cy="198" rx="14" ry="7" fill="#AB47BC" className="m-foot" />
            </g>
            <g className="m-leg m-leg-right">
                <ellipse cx="125" cy="185" rx="16" ry="18" fill="url(#alienBodyGrad)" />
                <ellipse cx="125" cy="198" rx="14" ry="7" fill="#AB47BC" className="m-foot" />
            </g>

            {/* Body - round and chubby */}
            <g className="m-body" filter="url(#alienShadow)">
                <ellipse cx="100" cy="140" rx="48" ry="52" fill="url(#alienBodyGrad)" />
                {/* Belly */}
                <ellipse cx="100" cy="148" rx="32" ry="35" fill="url(#alienBellyGrad)" />
                {/* Lightning bolt pattern on body */}
                <path d="M 78 125 L 82 118 L 80 124 L 85 116 L 82 125" stroke="#FFEB3B" strokeWidth="1.5" fill="none" opacity="0.4" />
                <path d="M 118 120 L 122 112 L 120 118 L 125 110 L 122 120" stroke="#FFEB3B" strokeWidth="1.5" fill="none" opacity="0.35" />
            </g>

            {/* Arms - stubby */}
            <g className="m-arm m-arm-left">
                <ellipse cx="54" cy="130" rx="12" ry="18" fill="url(#alienBodyGrad)" transform="rotate(20 54 130)" />
                <ellipse cx="48" cy="144" rx="8" ry="6" fill="#AB47BC" className="m-hand" />
            </g>
            <g className="m-arm m-arm-right">
                <ellipse cx="146" cy="130" rx="12" ry="18" fill="url(#alienBodyGrad)" transform="rotate(-20 146 130)" />
                <ellipse cx="152" cy="144" rx="8" ry="6" fill="#AB47BC" className="m-hand" />
            </g>

            {/* Head - big round */}
            <g className="m-head">
                <ellipse cx="100" cy="62" rx="48" ry="44" fill="url(#alienBodyGrad)" filter="url(#alienShadow)" />

                {/* Head highlight */}
                <ellipse cx="88" cy="42" rx="22" ry="14" fill="#F06292" opacity="0.4" />

                {/* Antenna */}
                <g className="m-horn-left">
                    <path d="M 100 20 Q 98 10 100 2" stroke="url(#alienAntennaGrad)" strokeWidth="3" fill="none" strokeLinecap="round" />
                    <g filter="url(#antennaGlow)">
                        <circle cx="100" cy="0" r="7" fill="url(#alienAntennaGlowGrad)" className="m-ambient-sparkle m-sparkle-1" />
                        <circle cx="100" cy="0" r="4" fill="#FFFF8D" />
                    </g>
                </g>

                {/* Small side antennae bumps */}
                <circle cx="58" cy="32" r="5" fill="#CE93D8" />
                <circle cx="58" cy="32" r="3" fill="#F06292" />
                <circle cx="142" cy="32" r="5" fill="#CE93D8" />
                <circle cx="142" cy="32" r="3" fill="#F06292" />

                {/* Eyes - two big ones */}
                <g className="m-eyes">
                    <g className="m-eye">
                        <ellipse cx="78" cy="58" rx="18" ry="20" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="80" cy="60" r="12" fill="#2D1B14" />
                            <circle cx="80" cy="60" r="8" fill="#1B0033" />
                            {/* Electric iris sparkle */}
                            <circle cx="78" cy="62" r="2.5" fill="#FFEB3B" opacity="0.4" />
                            <circle cx="84" cy="54" r="4.5" fill="white" />
                            <circle cx="76" cy="64" r="2" fill="white" opacity="0.6" />
                        </g>
                    </g>
                    <g className="m-eye">
                        <ellipse cx="122" cy="58" rx="18" ry="20" fill="white" stroke="#E0E0E0" strokeWidth="1" />
                        <g style={eyeStyle}>
                            <circle cx="124" cy="60" r="12" fill="#2D1B14" />
                            <circle cx="124" cy="60" r="8" fill="#1B0033" />
                            <circle cx="122" cy="62" r="2.5" fill="#FFEB3B" opacity="0.4" />
                            <circle cx="128" cy="54" r="4.5" fill="white" />
                            <circle cx="120" cy="64" r="2" fill="white" opacity="0.6" />
                        </g>
                    </g>
                </g>

                {/* Cheeks */}
                <ellipse cx="56" cy="72" rx="9" ry="6" fill="#FF80AB" opacity="0.5" className="m-cheek m-cheek-left" />
                <ellipse cx="144" cy="72" rx="9" ry="6" fill="#FF80AB" opacity="0.5" className="m-cheek m-cheek-right" />

                {/* Mouth */}
                {renderMouth(100, 82, 22)}
                {(state === 'laughing' || state === 'celebrating') && (
                    <path d="M 100 86 Q 100 94 95 97 Q 100 95 105 97 Q 100 94 100 86" fill="#FF7B9C" className="m-tongue" />
                )}
            </g>

            {/* Electric / lightning ambient particles */}
            <g className="m-dragon-sparkles">
                <g filter="url(#alienGlow)">
                    {/* Lightning bolts */}
                    <path d="M 30 45 L 35 38 L 33 44 L 38 36" stroke="#FFEB3B" strokeWidth="2" fill="none" strokeLinecap="round" className="m-ambient-sparkle m-sparkle-1" />
                    <path d="M 170 40 L 175 32 L 173 38 L 178 30" stroke="#FFEB3B" strokeWidth="2" fill="none" strokeLinecap="round" className="m-ambient-sparkle m-sparkle-2" />
                    <path d="M 20 90 L 24 84 L 22 89 L 26 82" stroke="#FFEB3B" strokeWidth="1.5" fill="none" strokeLinecap="round" className="m-ambient-sparkle m-sparkle-3" opacity="0.6" />
                    <path d="M 180 85 L 184 78 L 182 84 L 186 76" stroke="#FFC107" strokeWidth="1.5" fill="none" strokeLinecap="round" className="m-ambient-sparkle m-sparkle-4" opacity="0.5" />

                    {/* Electric sparkle dots */}
                    <circle cx="42" cy="30" r="2.5" fill="#FFEB3B" className="m-ambient-sparkle m-sparkle-2" opacity="0.7" />
                    <circle cx="158" cy="25" r="2" fill="#FFC107" className="m-ambient-sparkle m-sparkle-4" opacity="0.6" />
                    <path d="M 38 108 L 40 104 L 42 108 L 37 106 L 43 106 Z" fill="#FFEB3B" className="m-ambient-sparkle m-sparkle-1" opacity="0.5" />
                    <path d="M 165 100 L 166 97 L 167 100 L 164 99 L 168 99 Z" fill="#FFC107" className="m-ambient-sparkle m-sparkle-3" opacity="0.45" />
                </g>
            </g>
        </>
    );

    if (hidden) return null;

    const displayType = config.type || type;
    return (
        <div ref={containerRef} className={`mascot-container type-${displayType} pattern-${config.behaviorPattern} state-${state} ${isHovered ? 'hovered' : ''}`} onClick={onClick} style={{ width: size, height: size }}>
            <div className="mascot-wrapper"><svg viewBox="0 0 200 220" className="mascot-svg">{renderCharacter()}</svg></div>
            {emoji && <div className="mascot-emoji-bubble"><span className="emoji-float">{emoji}</span></div>}
            <div className="mascot-shadow"></div>
        </div>
    );
};

export default UnifiedMascot;
