import React, { useEffect, useState } from 'react';

const FloatingParticles: React.FC = () => {
    const [particles, setParticles] = useState<Array<{ id: number; emoji: string; left: string; delay: number }>>([]);

    useEffect(() => {
        const emojis = ['☁️', '⭐', '✨', '🌸'];
        const newParticles = Array.from({ length: 4 }, (_, i) => ({
            id: i,
            emoji: emojis[i],
            left: `${(i * 25) + 10}%`,
            delay: i * 5
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="premium-particles">
            {particles.map(particle => (
                <div
                    key={particle.id}
                    className="particle"
                    style={{
                        left: particle.left,
                        animationDelay: `${particle.delay}s`
                    }}
                >
                    {particle.emoji}
                </div>
            ))}
        </div>
    );
};

export default FloatingParticles;
