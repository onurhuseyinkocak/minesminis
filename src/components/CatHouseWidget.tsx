import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'lottie-react';
import './CatHouseWidget.css';

type CatPhase = 'outside' | 'entering' | 'sleeping' | 'waking' | 'waving';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LottieData = Record<string, any> | null;

function useLottie(path: string): LottieData {
    const [data, setData] = useState<LottieData>(null);
    useEffect(() => {
        let cancelled = false;
        fetch(path)
            .then(r => r.json())
            .then((d: LottieData) => { if (!cancelled) setData(d); })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [path]);
    return data;
}

const CatHouseWidget: React.FC = () => {
    const [phase, setPhase]   = useState<CatPhase>('outside');
    const [visible, setVisible] = useState(true);

    const idleData  = useLottie('/mascot/cat_idle.json');
    const sleepData = useLottie('/mascot/cat_sleeping.json');
    const waveData  = useLottie('/mascot/cat_wave.json');
    const walkData  = useLottie('/mascot/cat_walk.json');

    /* Phase cycle:
       on mount: cat is outside (idle) for 12s
       → entering (walk) 1.8s
       → sleeping (idle/sleep) for 18s
       → waking (idle) 1s
       → waving (wave) 3s
       → back to outside */
    const runCycle = useCallback(() => {
        setPhase('outside');

        const t1 = setTimeout(() => setPhase('entering'), 12000);
        const t2 = setTimeout(() => setPhase('sleeping'), 13800);
        const t3 = setTimeout(() => setPhase('waking'),  31800);
        const t4 = setTimeout(() => setPhase('waving'),  32800);
        const t5 = setTimeout(() => runCycle(), 35800);

        return () => { [t1,t2,t3,t4,t5].forEach(clearTimeout); };
    }, []);

    useEffect(() => {
        const cleanup = runCycle();
        return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!visible) return null;

    const catData: LottieData = (() => {
        switch (phase) {
            case 'entering':                return walkData;
            case 'sleeping': case 'waking': return sleepData;
            case 'waving':                  return waveData;
            default:                        return idleData; // outside
        }
    })();

    const isSleeping = phase === 'sleeping';
    const isEntering = phase === 'entering';

    return (
        <div
            className={`cat-house-widget cat-house-widget--${phase}`}
            onClick={() => {
                // Clicking wakes the cat early
                if (phase === 'sleeping') {
                    setPhase('waving');
                }
            }}
            role="img"
            aria-label="Mimi the cat"
        >
            {/* House SVG */}
            <div className="cat-house__house">
                <svg viewBox="0 0 120 110" className="cat-house__svg" aria-hidden="true">
                    {/* House body */}
                    <rect x="15" y="50" width="90" height="60" rx="4" fill="#FFF4EE" stroke="#FF6B35" strokeWidth="2.5" />
                    {/* Roof */}
                    <polygon points="10,52 60,10 110,52" fill="#FF6B35" />
                    {/* Roof highlight */}
                    <polygon points="60,12 108,50 60,50" fill="rgba(255,255,255,0.12)" />
                    {/* Door */}
                    <rect x="43" y="72" width="34" height="38" rx="17" fill="#FFD4BC" stroke="#FF6B35" strokeWidth="1.5" />
                    {/* Door knob */}
                    <circle cx="72" cy="92" r="3" fill="#FF6B35" />
                    {/* Window left */}
                    <rect x="20" y="60" width="22" height="18" rx="3" fill="#E0F2FE" stroke="#FF6B35" strokeWidth="1.2" />
                    <line x1="31" y1="60" x2="31" y2="78" stroke="#FF6B35" strokeWidth="1" />
                    <line x1="20" y1="69" x2="42" y2="69" stroke="#FF6B35" strokeWidth="1" />
                    {/* Window right */}
                    <rect x="78" y="60" width="22" height="18" rx="3" fill="#E0F2FE" stroke="#FF6B35" strokeWidth="1.2" />
                    <line x1="89" y1="60" x2="89" y2="78" stroke="#FF6B35" strokeWidth="1" />
                    <line x1="78" y1="69" x2="100" y2="69" stroke="#FF6B35" strokeWidth="1" />
                    {/* Cat ear chimneys */}
                    <polygon points="25,20 32,10 39,20" fill="#FF6B35" />
                    <polygon points="81,20 88,10 95,20" fill="#FF6B35" />
                    {/* Smoke dots */}
                    <circle cx="32" cy="7" r="2.5" fill="rgba(255,107,53,0.3)" className="cat-house__smoke cat-house__smoke--1" />
                    <circle cx="34" cy="3" r="2"   fill="rgba(255,107,53,0.2)" className="cat-house__smoke cat-house__smoke--2" />
                    <circle cx="88" cy="7" r="2.5" fill="rgba(255,107,53,0.3)" className="cat-house__smoke cat-house__smoke--3" />
                    <circle cx="90" cy="3" r="2"   fill="rgba(255,107,53,0.2)" className="cat-house__smoke cat-house__smoke--4" />
                    {/* Ground */}
                    <rect x="0" y="108" width="120" height="4" rx="2" fill="rgba(255,107,53,0.2)" />
                </svg>
            </div>

            {/* Cat Lottie */}
            {catData && (
                <div className={`cat-house__cat ${isSleeping ? 'cat-house__cat--sleeping' : ''} ${isEntering ? 'cat-house__cat--entering' : ''}`}>
                    <Lottie
                        animationData={catData as object}
                        loop
                        autoplay
                        style={{ width: 80, height: 80 }}
                    />
                    {/* Zzz bubbles when sleeping */}
                    {isSleeping && (
                        <div className="cat-house__zzz" aria-hidden="true">
                            <span className="cat-house__z cat-house__z--1">z</span>
                            <span className="cat-house__z cat-house__z--2">z</span>
                            <span className="cat-house__z cat-house__z--3">Z</span>
                        </div>
                    )}
                </div>
            )}

            {/* Close button */}
            <button
                type="button"
                className="cat-house__close"
                onClick={e => { e.stopPropagation(); setVisible(false); }}
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
};

export default CatHouseWidget;
