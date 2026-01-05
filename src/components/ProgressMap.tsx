/**
 * PROGRESS MAP COMPONENT
 * Visual learning journey for children
 */

import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import './ProgressMap.css';

interface MapNode {
    id: string;
    type: 'game' | 'word' | 'video' | 'worksheet' | 'checkpoint';
    level: number;
    label: string;
    icon: string;
}

const MAP_NODES: MapNode[] = [
    { id: '1', type: 'checkpoint', level: 1, label: 'Welcome!', icon: '👋' },
    { id: '2', type: 'word', level: 1, label: 'First Words', icon: '🍎' },
    { id: '3', type: 'game', level: 2, label: 'Fun Match', icon: '🧩' },
    { id: '4', type: 'video', level: 2, label: 'Story Time', icon: '📖' },
    { id: '5', type: 'checkpoint', level: 3, label: 'Rising Star', icon: '⭐' },
    { id: '6', type: 'worksheet', level: 4, label: 'Writing Fun', icon: '✏️' },
    { id: '7', type: 'game', level: 5, label: 'Super Quiz', icon: '🏆' },
    { id: '8', type: 'word', level: 6, label: 'Nature Words', icon: '🌳' },
    { id: '9', type: 'checkpoint', level: 10, label: 'Halfway! ', icon: '🌟' },
];

const ProgressMap: React.FC = () => {
    const { stats } = useGamification();
    const currentLevel = stats.level;

    return (
        <div className="progress-map-container">
            <div className="map-header">
                <h3>🗺️ My Learning Map</h3>
                <p>Level up to unlock new adventures!</p>
            </div>

            <div className="map-path-container">
                <svg className="map-svg-line" viewBox="0 0 100 500" preserveAspectRatio="none">
                    <path
                        d="M 50 0 Q 80 125 50 250 Q 20 375 50 500"
                        className="map-line-bg"
                    />
                    <path
                        d="M 50 0 Q 80 125 50 250 Q 20 375 50 500"
                        className="map-line-fill"
                        style={{ strokeDasharray: 1000, strokeDashoffset: 1000 - (currentLevel * 100) }}
                    />
                </svg>

                <div className="map-nodes">
                    {MAP_NODES.map((node, index) => {
                        const isUnlocked = currentLevel >= node.level;
                        const isCurrent = currentLevel === node.level || (currentLevel > node.level && (index === MAP_NODES.length - 1 || currentLevel < MAP_NODES[index + 1].level));

                        // Calculate zig-zag position
                        const xOffset = index % 2 === 0 ? '20%' : '80%';
                        const yOffset = `${(index / (MAP_NODES.length - 1)) * 90 + 5}%`;

                        return (
                            <div
                                key={node.id}
                                className={`map-node ${isUnlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}`}
                                style={{
                                    left: xOffset,
                                    top: yOffset
                                }}
                            >
                                <div className="node-icon-wrapper">
                                    <span className="node-icon">{isUnlocked ? node.icon : '🔒'}</span>
                                    {isCurrent && <div className="current-marker">You here!</div>}
                                </div>
                                <div className="node-content">
                                    <span className="node-label">{node.label}</span>
                                    <span className="node-level">Req. Level {node.level}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressMap;
