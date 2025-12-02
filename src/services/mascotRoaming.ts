type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping';

interface Position {
    x: number;
    y: number;
}

class MascotRoamingService {
    private position: Position = { x: 85, y: 75 };
    private state: AnimationState = 'idle';
    private isRoaming: boolean = false;
    private roamingInterval: NodeJS.Timeout | null = null;
    private listeners: ((pos: Position, state: AnimationState) => void)[] = [];

    private energy: number = 100;
    private mood: number = 90;
    private happiness: number = 80;
    private lastInteractionTime: number = Date.now();

    startRoaming(): void {
        if (this.isRoaming) return;
        this.isRoaming = true;
        console.log('🤖 AI Mascot is now ALIVE and making its own decisions!');
        this.scheduleNextAction();
    }

    stopRoaming(): void {
        this.isRoaming = false;
        if (this.roamingInterval) {
            clearTimeout(this.roamingInterval);
            this.roamingInterval = null;
        }
    }

    private scheduleNextAction(): void {
        if (!this.isRoaming) return;

        const delay = 6000 + Math.random() * 8000;

        this.roamingInterval = setTimeout(() => {
            this.makeAIDecision();
            this.scheduleNextAction();
        }, delay);
    }

    private makeAIDecision(): void {
        this.updateAIFactors();

        const decision = Math.random();
        const timeSinceInteraction = Date.now() - this.lastInteractionTime;

        if (this.energy < 15) {
            this.doAction('sleeping', 12000);
            this.energy = 100;
            return;
        }

        if (timeSinceInteraction > 45000 && Math.random() < 0.25) {
            this.doAction('waving', 4000);
            return;
        }

        if (this.happiness > 92 && this.mood > 88) {
            const happyActions: AnimationState[] = ['celebrating', 'dancing', 'love'];
            const action = happyActions[Math.floor(Math.random() * happyActions.length)];
            this.doAction(action, 5000);
            return;
        }

        if (decision < 0.08) {
            this.doAction('dancing', 6000);
        } else if (decision < 0.14) {
            this.doAction('singing', 7000);
        } else if (decision < 0.18) {
            this.doAction('laughing', 3500);
        } else if (decision < 0.22) {
            this.doAction('thinking', 5000);
        } else if (decision < 0.26) {
            this.doAction('waving', 3500);
        } else if (decision < 0.28) {
            this.doAction('jumping', 2500);
        } else if (decision < 0.55) {
            this.moveToRandomPosition();
        } else if (decision < 0.60) {
            this.doAction('celebrating', 4000);
        } else {
            this.doAction('idle', 0);
        }
    }

    private doAction(action: AnimationState, duration: number): void {
        this.setState(action);
        if (duration > 0) {
            setTimeout(() => {
                if (this.state === action) {
                    this.setState('idle');
                }
            }, duration);
        }
    }

    private updateAIFactors(): void {
        this.energy = Math.max(0, this.energy - Math.random() * 2);
        this.mood += (Math.random() - 0.45) * 5;
        this.mood = Math.max(40, Math.min(100, this.mood));
        this.happiness += (Math.random() - 0.48) * 4;
        this.happiness = Math.max(50, Math.min(100, this.happiness));
    }

    private moveToRandomPosition(): void {
        const targetPosition = this.getRandomSafePosition();
        const distance = Math.sqrt(
            Math.pow(targetPosition.x - this.position.x, 2) +
            Math.pow(targetPosition.y - this.position.y, 2)
        );

        this.state = 'walking';
        this.position = { ...targetPosition };
        this.notifyListeners();

        const duration = distance * 180;

        setTimeout(() => {
            if (this.state === 'walking') {
                this.setState('idle');
            }
        }, duration);
    }

    private getRandomSafePosition(): Position {
        const safeZones: Position[] = [
            { x: 12, y: 78 }, { x: 25, y: 82 }, { x: 40, y: 78 },
            { x: 55, y: 80 }, { x: 70, y: 78 }, { x: 85, y: 75 },
            { x: 88, y: 60 }, { x: 85, y: 45 }, { x: 82, y: 35 },
            { x: 10, y: 60 }, { x: 12, y: 45 }, { x: 10, y: 35 },
            { x: 50, y: 58 }, { x: 42, y: 48 }, { x: 58, y: 42 },
            { x: 28, y: 55 }, { x: 72, y: 55 },
        ];

        const available = safeZones.filter(
            pos => Math.abs(pos.x - this.position.x) > 10 || Math.abs(pos.y - this.position.y) > 6
        );

        return available.length > 0
            ? { ...available[Math.floor(Math.random() * available.length)] }
            : { ...safeZones[Math.floor(Math.random() * safeZones.length)] };
    }

    setState(state: AnimationState): void {
        this.state = state;

        switch (state) {
            case 'walking': this.energy -= 0.5; break;
            case 'dancing': this.energy -= 2; this.happiness += 4; break;
            case 'jumping': this.energy -= 2; this.happiness += 2; break;
            case 'sleeping': this.energy = 100; break;
            case 'celebrating': this.happiness += 6; this.mood += 4; break;
            case 'laughing': this.happiness += 5; this.mood += 3; break;
            case 'singing': this.happiness += 3; this.mood += 2; break;
            case 'love': this.happiness += 8; this.mood += 6; break;
        }

        this.notifyListeners();
    }

    getCurrentState(): { position: Position; state: AnimationState } {
        return { position: { ...this.position }, state: this.state };
    }

    onChange(callback: (pos: Position, state: AnimationState) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(): void {
        const positionCopy = { ...this.position };
        this.listeners.forEach(cb => cb(positionCopy, this.state));
    }

    jumpToPosition(x: number, y: number): void {
        this.position = { x, y };
        this.notifyListeners();
    }

    jumpToChat(): void {
        this.position = { x: 85, y: 75 };
        this.setState('celebrating');
        setTimeout(() => this.setState('idle'), 3000);
    }

    triggerCelebration(): void {
        this.lastInteractionTime = Date.now();
        this.happiness = Math.min(100, this.happiness + 12);
        this.mood = Math.min(100, this.mood + 8);
        
        const celebrationActions: AnimationState[] = ['celebrating', 'love', 'dancing'];
        const action = celebrationActions[Math.floor(Math.random() * celebrationActions.length)];
        this.setState(action);
        setTimeout(() => this.setState('idle'), 4000);
    }

    triggerSurprise(): void {
        this.setState('surprised');
        setTimeout(() => this.setState('idle'), 2500);
    }

    triggerLaugh(): void {
        this.happiness += 4;
        this.setState('laughing');
        setTimeout(() => this.setState('idle'), 4000);
    }

    triggerSing(): void {
        this.setState('singing');
        setTimeout(() => this.setState('idle'), 6000);
    }

    triggerThink(): void {
        this.setState('thinking');
        setTimeout(() => this.setState('idle'), 5000);
    }

    goHome(): void {
        this.position = { x: 88, y: 85 };
        this.setState('walking');
        setTimeout(() => {
            this.setState('sleeping');
        }, 3000);
    }
}

export const mascotRoaming = new MascotRoamingService();
