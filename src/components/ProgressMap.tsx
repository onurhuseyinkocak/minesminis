/**
 * PROGRESS MAP COMPONENT
 * Visual learning journey showing curriculum worlds as connected nodes
 */

import React from 'react';
import { useGamification } from '../contexts/GamificationContext';
import { WORLDS } from '../data/curriculum';
import { Lock, CheckCircle } from 'lucide-react';

const ProgressMap: React.FC = () => {
  const { stats } = useGamification();

  // Calculate progress per world based on XP thresholds
  // Each world unlocks sequentially; progress is simulated from total XP
  const getWorldProgress = (worldIndex: number): number => {
    const xpPerWorld = 300; // approximate XP to complete one world
    const xpForThisWorld = stats.xp - worldIndex * xpPerWorld;
    if (xpForThisWorld <= 0) return 0;
    if (xpForThisWorld >= xpPerWorld) return 100;
    return Math.floor((xpForThisWorld / xpPerWorld) * 100);
  };

  const isWorldUnlocked = (worldIndex: number): boolean => {
    if (worldIndex === 0) return true;
    return getWorldProgress(worldIndex - 1) >= 100;
  };

  // Show first 10 worlds from curriculum
  const worlds = WORLDS.slice(0, 10);

  return (
    <div className="progress-map">
      <div className="map-path">
        {worlds.map((world, index) => {
          const progress = getWorldProgress(index);
          const unlocked = isWorldUnlocked(index);
          const completed = progress >= 100;

          return (
            <React.Fragment key={world.id}>
              {index > 0 && (
                <div
                  className={`map-connector ${completed ? 'completed' : unlocked ? 'active' : 'locked'}`}
                />
              )}
              <div
                className={`map-node ${completed ? 'completed' : unlocked ? 'active' : 'locked'}`}
                title={`${world.name} - ${progress}%`}
              >
                <div className="node-circle">
                  <div
                    className="node-progress-ring"
                    style={{
                      background: unlocked
                        ? `conic-gradient(#1A6B5A ${progress * 3.6}deg, rgba(26, 107, 90, 0.15) 0deg)`
                        : 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <div className="node-inner">
                      {completed ? (
                        <CheckCircle size={20} />
                      ) : !unlocked ? (
                        <Lock size={16} />
                      ) : (
                        <span className="node-icon">{world.icon}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="node-label">
                  <span className="node-name">{world.name}</span>
                  {unlocked && (
                    <span className="node-percent">{progress}%</span>
                  )}
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <style>{`
        .progress-map {
          padding: 8px 0;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        .map-path {
          display: flex;
          align-items: center;
          gap: 0;
          min-width: max-content;
          padding: 16px 8px;
        }

        .map-connector {
          width: 32px;
          height: 3px;
          border-radius: 2px;
          flex-shrink: 0;
          transition: background 0.3s;
        }

        .map-connector.completed {
          background: #1A6B5A;
        }

        .map-connector.active {
          background: linear-gradient(90deg, #1A6B5A, rgba(26, 107, 90, 0.3));
        }

        .map-connector.locked {
          background: var(--glass-border, rgba(0,0,0,0.1));
        }

        .map-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          cursor: default;
          transition: transform 0.2s;
        }

        .map-node.active:hover {
          transform: scale(1.08);
        }

        .node-circle {
          position: relative;
        }

        .node-progress-ring {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }

        .map-node.completed .node-progress-ring {
          background: #1A6B5A !important;
          box-shadow: 0 4px 12px rgba(26, 107, 90, 0.35);
        }

        .node-inner {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-main, #1C2236);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }

        .map-node.completed .node-inner {
          background: #1A6B5A;
          color: white;
        }

        .map-node.locked .node-inner {
          color: var(--text-muted, #999);
          opacity: 0.5;
        }

        .map-node.active .node-inner {
          box-shadow: 0 0 0 2px rgba(232, 163, 23, 0.3);
        }

        .node-icon {
          font-size: 1.4rem;
          line-height: 1;
        }

        .node-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          max-width: 72px;
        }

        .node-name {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-main, #333);
          text-align: center;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 72px;
        }

        .map-node.locked .node-name {
          color: var(--text-muted, #999);
          opacity: 0.6;
        }

        .node-percent {
          font-size: 0.65rem;
          font-weight: 800;
          color: #E8A317;
        }

        .map-node.completed .node-percent {
          color: #1A6B5A;
        }
      `}</style>
    </div>
  );
};

export default ProgressMap;
