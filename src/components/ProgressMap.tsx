import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { Lock, Flag, Sparkles, Target } from 'lucide-react';
import { getTotalXPForLevel } from '../contexts/GamificationContext';

interface MapNode {
    id: string;
    type: 'game' | 'word' | 'video' | 'worksheet' | 'checkpoint';
    level: number;
    label: string;
    icon: string;
    description: string;
}

const NODE_TEMPLATES = {
    word: [
        { label: 'Word Orchard', icon: '🍎', description: 'Learn your first words' },
        { label: 'Nature Park', icon: '🌳', description: 'Learn about trees' },
        { label: 'Veggie Valley', icon: '🥦', description: 'Healthy words await' },
        { label: 'Animal Alley', icon: '🦊', description: 'Meet new friends' },
        { label: 'Body Bay', icon: '🦶', description: 'Learn body parts' },
        { label: 'Color Canyon', icon: '🎨', description: 'A world of colors' },
    ],
    game: [
        { label: 'Puzzle Peak', icon: '🧩', description: 'Match the colors' },
        { label: 'Action Arcade', icon: '🎮', description: 'Level up your skills' },
        { label: 'Retro Ridge', icon: '🕹️', description: 'Old school fun' },
        { label: 'Memory Mountain', icon: '🧠', description: 'Test your brain' },
        { label: 'Reflex River', icon: '⚡', description: 'Be fast as light!' },
    ],
    video: [
        { label: 'Cinema Cove', icon: '📖', description: 'Watch a magic story' },
        { label: 'Story Star', icon: '🎬', description: 'Heroes and legends' },
        { label: 'TV Tower', icon: '📺', description: 'Learning is fun' },
        { label: 'Song Spring', icon: '🎵', description: 'Sing along with us' },
    ],
    worksheet: [
        { label: 'Writer Village', icon: '✏️', description: 'Trace the letters' },
        { label: 'Paper Port', icon: '📝', description: 'Print and practice' },
        { label: 'Color Castle', icon: '🖍️', description: 'Bring art to life' },
        { label: 'Math Meadow', icon: '🔢', description: 'Numbers are friends' },
    ],
    checkpoint: [
        { label: 'Island Start', icon: '🏝️', description: 'Begin your journey!' },
        { label: 'Star Station', icon: '⭐', description: 'A big milestone!' },
        { label: 'Hero Heavens', icon: '🌟', description: 'You are a legend!' },
        { label: 'Cloud Castle', icon: '☁️', description: 'Sky high success!' },
        { label: 'Cosmic Center', icon: '🌌', description: 'Out of this world!' },
    ]
};

const generateNodes = (currentLevel: number): MapNode[] => {
    const nodes: MapNode[] = [];
    const maxVisibleLevel = Math.max(currentLevel + 5, 10);

    for (let i = 1; i <= maxVisibleLevel; i++) {
        let type: MapNode['type'] = 'word';
        if (i === 1) type = 'checkpoint';
        else if (i % 5 === 0) type = 'checkpoint';
        else {
            const types: MapNode['type'][] = ['word', 'game', 'video', 'worksheet'];
            type = types[(i % 4)];
        }

        const templates = NODE_TEMPLATES[type as keyof typeof NODE_TEMPLATES];
        const templateIndex = Math.floor(i / 3) % templates.length;
        const template = i === 1 ? templates[0] : templates[templateIndex];

        nodes.push({
            id: `lvl-${i}`,
            type,
            level: i,
            label: template.label,
            icon: template.icon,
            description: template.description
        });
    }
    return nodes;
};

const ProgressMap: React.FC = () => {
    const { stats } = useGamification();
    const currentLevel = stats.level;
    const MAP_NODES = generateNodes(currentLevel);
    const containerHeight = MAP_NODES.length * 200 + 400;

    return (
        <div className="adventure-map-arşa">
            <div className="map-view-window">
                <div className="vertical-path-container" style={{ minHeight: `${containerHeight}px` }}>
                    {/* SVG Progress Path */}
                    <svg className="path-svg-vertical" viewBox={`0 0 200 ${containerHeight}`} preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--accent-indigo)" />
                                <stop offset="100%" stopColor="var(--accent-pink)" />
                            </linearGradient>
                            <filter id="pathGlow">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        <path
                            d={`M 100 0 L 100 ${containerHeight}`}
                            className="path-base-line"
                        />
                        <path
                            d={`M 100 0 L 100 ${containerHeight}`}
                            className="path-progress-line"
                            style={{
                                strokeDasharray: `${containerHeight}`,
                                strokeDashoffset: containerHeight - (Math.min(currentLevel, MAP_NODES.length) / MAP_NODES.length) * containerHeight
                            }}
                        />
                    </svg>

                    <div className="nodes-stack">
                        {MAP_NODES.map((node, index) => {
                            const isUnlocked = currentLevel >= node.level;
                            const isCurrent = isUnlocked && (index === MAP_NODES.length - 1 || currentLevel < MAP_NODES[index + 1].level);
                            const isLocked = !isUnlocked;
                            const side = index % 2 === 0 ? 'left' : 'right';

                            return (
                                <div
                                    key={node.id}
                                    className={`adventure-node ${side} ${isUnlocked ? 'unlocked' : ''} ${isCurrent ? 'current' : ''} ${isLocked ? 'locked' : ''}`}
                                >
                                    <div className="node-platform-box">
                                        <div className="node-platform">
                                            <div className="platform-top">
                                                <span className="node-emoji-main">{node.icon}</span>
                                                {isLocked && <div className="lock-overlay"><Lock size={16} /></div>}
                                                {isCurrent && <div className="current-pulse"></div>}
                                            </div>
                                            <div className="platform-base"></div>
                                        </div>

                                        <div className="node-info-bubble">
                                            <div className="info-header">
                                                <div className="level-badge">LVL {node.level}</div>
                                                <h4>{node.label}</h4>
                                            </div>
                                            <p>{node.description}</p>

                                            <div className="xp-requirement">
                                                <Sparkles size={12} />
                                                <span>{getTotalXPForLevel(node.level).toLocaleString()} XP Total Needed</span>
                                            </div>

                                            {!isUnlocked && (
                                                <div className="unlock-badge-mini">
                                                    Locked until Lvl {node.level}
                                                </div>
                                            )}

                                            {isCurrent && (
                                                <div className="current-status-tag">
                                                    <Target size={12} />
                                                    <span>YOU ARE HERE</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Connection Line to Path */}
                                    <div className="path-connector"></div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="map-footer">
                        <Flag size={32} className="finish-flag" />
                        <span>The Sky is the Limit!</span>
                    </div>
                </div>
            </div>

            <style>{`
                .adventure-map-arşa {
                    width: 100%;
                    height: 650px;
                    background: var(--bg-cream);
                    border-radius: 30px;
                    border: 2px solid var(--glass-border);
                    overflow: hidden;
                    position: relative;
                    box-shadow: inset 0 2px 20px rgba(0,0,0,0.05);
                }

                .map-view-window {
                    width: 100%;
                    height: 100%;
                    overflow-y: auto;
                    padding: 60px 20px;
                    scrollbar-width: none;
                }

                .map-view-window::-webkit-scrollbar { display: none; }

                .vertical-path-container {
                    max-width: 600px;
                    margin: 0 auto;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .path-svg-vertical {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 40px;
                    height: 100%;
                    z-index: 1;
                }

                .path-base-line {
                    stroke: var(--bg-soft);
                    stroke-width: 12;
                    stroke-linecap: round;
                    fill: none;
                }

                .path-progress-line {
                    stroke: url(#pathGradient);
                    stroke-width: 16;
                    stroke-linecap: round;
                    fill: none;
                    filter: url(#pathGlow);
                    transition: stroke-dashoffset 2s ease-out;
                }

                .nodes-stack {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 120px;
                    z-index: 2;
                }

                .adventure-node {
                    width: 100%;
                    display: flex;
                    align-items: center;
                    position: relative;
                }

                .adventure-node.left { justify-content: flex-start; padding-left: 10%; }
                .adventure-node.right { justify-content: flex-end; padding-right: 10%; }

                .node-platform-box {
                    display: flex;
                    align-items: center;
                    gap: 30px;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .adventure-node.right .node-platform-box { flex-direction: row-reverse; }

                .node-platform {
                    width: 80px;
                    height: 80px;
                    position: relative;
                    cursor: pointer;
                    perspective: 1000px;
                }

                .platform-top {
                    width: 80px;
                    height: 80px;
                    background: var(--bg-card);
                    border-radius: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2.5rem;
                    border: 4px solid var(--glass-border);
                    box-shadow: 0 10px 0 rgba(0,0,0,0.1);
                    position: relative;
                    z-index: 2;
                    transition: all 0.3s ease;
                }

                .adventure-node.unlocked .platform-top {
                    background: white;
                    border-color: var(--accent-indigo);
                    box-shadow: 0 10px 0 var(--accent-indigo), 0 20px 40px rgba(99, 102, 241, 0.2);
                }

                .adventure-node.current .platform-top {
                    animation: floatNode 3s infinite ease-in-out;
                    border-color: var(--warning);
                    box-shadow: 0 10px 0 var(--primary-dark), 0 20px 40px rgba(245, 158, 11, 0.3);
                }

                .platform-base {
                    position: absolute;
                    bottom: -15px;
                    left: 10%;
                    width: 80%;
                    height: 30px;
                    background: rgba(0,0,0,0.05);
                    filter: blur(8px);
                    border-radius: 50%;
                    z-index: 1;
                }

                .current-pulse {
                    position: absolute;
                    top: -10px;
                    left: -10px;
                    right: -10px;
                    bottom: -10px;
                    border: 4px solid var(--warning);
                    border-radius: 30px;
                    animation: pulseRing 2s infinite;
                    pointer-events: none;
                }

                .node-info-bubble {
                    background: var(--bg-card);
                    border: 2px solid var(--glass-border);
                    padding: 20px;
                    border-radius: 24px;
                    width: 240px;
                    box-shadow: var(--shadow-xl);
                    opacity: 0.9;
                    transition: all 0.3s;
                    z-index: 10;
                    position: relative;
                }

                [data-theme="dark"] .node-info-bubble {
                    background: var(--ink);
                    border-color: rgba(255, 255, 255, 0.1);
                }

                .adventure-node:hover .node-info-bubble {
                    opacity: 1;
                    transform: scale(1.05);
                }

                .info-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }

                .info-header h4 { font-size: 1rem; font-weight: 800; margin: 0; }

                .level-badge {
                    background: var(--bg-soft);
                    color: var(--primary);
                    font-size: 0.65rem;
                    font-weight: 900;
                    padding: 2px 8px;
                    border-radius: 8px;
                }

                .node-info-bubble p {
                    font-size: 0.8rem;
                    color: var(--text-muted);
                    margin: 0 0 10px 0;
                    line-height: 1.4;
                }

                .current-status-tag {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--primary-dark);
                    font-size: 0.7rem;
                    font-weight: 800;
                }

                .xp-requirement {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--accent-indigo);
                    font-size: 0.75rem;
                    font-weight: 800;
                    margin-bottom: 8px;
                    padding: 6px 12px;
                    background: var(--bg-soft);
                    border-radius: 12px;
                    width: 100%;
                    border: 1px dashed rgba(99, 102, 241, 0.3);
                }

                [data-theme="dark"] .xp-requirement {
                    background: rgba(99, 102, 241, 0.1);
                    color: var(--accent-indigo);
                }

                .unlock-badge-mini {
                    font-size: 0.7rem;
                    font-weight: 700;
                    color: var(--error);
                    background: rgba(239, 68, 68, 0.1);
                    padding: 4px 10px;
                    border-radius: 8px;
                    width: fit-content;
                    margin-top: 4px;
                }

                .unlock-requirement {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: var(--text-muted);
                    font-size: 0.7rem;
                    font-weight: 600;
                }

                .lock-overlay {
                    position: absolute;
                    inset: 0;
                    background: rgba(0,0,0,0.4);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    backdrop-filter: blur(2px);
                }

                .path-connector {
                    position: absolute;
                    top: 50%;
                    width: calc(40% - 40px);
                    height: 4px;
                    background: var(--bg-soft);
                    z-index: 1;
                }

                .adventure-node.left .path-connector { left: calc(10% + 80px); }
                .adventure-node.right .path-connector { right: calc(10% + 80px); }

                .adventure-node.unlocked .path-connector { background: var(--accent-indigo); opacity: 0.3; }

                .map-footer {
                    margin-top: 100px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 15px;
                    padding-bottom: 100px;
                    position: relative;
                    z-index: 10;
                }

                .finish-flag { color: var(--accent-indigo); animation: swing 3s infinite ease-in-out; }

                @keyframes floatNode {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }

                @keyframes pulseRing {
                    0% { transform: scale(0.9); opacity: 1; }
                    100% { transform: scale(1.2); opacity: 0; }
                }

                @keyframes swing {
                    0%, 100% { transform: rotate(-5deg); }
                    50% { transform: rotate(15deg); }
                }

                /* Dark Mode Fine-tuning */
                [data-theme="dark"] .adventure-map-arşa { background: var(--ink); }
                [data-theme="dark"] .platform-top { background: var(--charcoal); }
                [data-theme="dark"] .adventure-node.unlocked .platform-top { background: var(--charcoal); }
            `}</style>
        </div>
    );
};

export default ProgressMap;
