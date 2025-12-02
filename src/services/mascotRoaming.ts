type AnimationState = 'idle' | 'walking' | 'running' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping';

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

        const delay = 4000 + Math.random() * 5000;

        this.roamingInterval = setTimeout(() => {
            this.makeAIDecision();
            this.scheduleNextAction();
        }, delay);
    }

    private makeAIDecision(): void {
        this.updateAIFactors();

        const decision = Math.random();
        const timeSinceInteraction = Date.now() - this.lastInteractionTime;

        if (this.energy < 20) {
            this.doAction('sleeping', 8000);
            this.energy = 100;
            return;
        }

        if (timeSinceInteraction > 60000 && Math.random() < 0.3) {
            this.doAction('waving', 3000);
            return;
        }

        if (this.happiness > 90 && this.mood > 85) {
            const happyActions: AnimationState[] = ['celebrating', 'dancing', 'jumping', 'laughing', 'love'];
            const action = happyActions[Math.floor(Math.random() * happyActions.length)];
            this.doAction(action, 3500);
            return;
        }

        if (decision < 0.15) {
            this.doAction('dancing', 4000);
        } else if (decision < 0.25) {
            this.doAction('singing', 5000);
        } else if (decision < 0.32) {
            this.doAction('laughing', 2500);
        } else if (decision < 0.38) {
            this.doAction('thinking', 3500);
        } else if (decision < 0.43) {
            this.doAction('waving', 2500);
        } else if (decision < 0.48) {
            this.doAction('jumping', 2000);
        } else if (decision < 0.65) {
            this.moveToRandomPosition();
        } else if (decision < 0.70) {
            this.doAction('celebrating', 3000);
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
        this.energy = Math.max(0, this.energy - Math.random() * 3);
        this.mood += (Math.random() - 0.4) * 8;
        this.mood = Math.max(30, Math.min(100, this.mood));
        this.happiness += (Math.random() - 0.45) * 6;
        this.happiness = Math.max(40, Math.min(100, this.happiness));
    }

    private moveToRandomPosition(): void {
        const targetPosition = this.getRandomSafePosition();
        const distance = Math.sqrt(
            Math.pow(targetPosition.x - this.position.x, 2) +
            Math.pow(targetPosition.y - this.position.y, 2)
        );

        const speed: AnimationState = distance > 35 ? 'running' : 'walking';
        this.state = speed;
        this.position = targetPosition;
        this.notifyListeners();

        const duration = speed === 'running' ? distance * 40 : distance * 60;

        setTimeout(() => {
            if (this.state === speed) {
                this.setState('idle');
            }
        }, duration);
    }

    private getRandomSafePosition(): Position {
        const safeZones: Position[] = [
            { x: 15, y: 75 }, { x: 30, y: 80 }, { x: 50, y: 75 },
            { x: 70, y: 80 }, { x: 85, y: 75 },
            { x: 85, y: 55 }, { x: 88, y: 45 }, { x: 85, y: 35 },
            { x: 12, y: 55 }, { x: 15, y: 45 }, { x: 12, y: 35 },
            { x: 50, y: 55 }, { x: 45, y: 45 }, { x: 55, y: 40 },
            { x: 30, y: 50 }, { x: 70, y: 50 },
        ];

        const available = safeZones.filter(
            pos => Math.abs(pos.x - this.position.x) > 12 || Math.abs(pos.y - this.position.y) > 8
        );

        return available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : safeZones[Math.floor(Math.random() * safeZones.length)];
    }

    setState(state: AnimationState): void {
        this.state = state;

        switch (state) {
            case 'running': this.energy -= 4; break;
            case 'dancing': this.energy -= 3; this.happiness += 5; break;
            case 'jumping': this.energy -= 3; this.happiness += 3; break;
            case 'walking': this.energy -= 1; break;
            case 'sleeping': this.energy = 100; break;
            case 'celebrating': this.happiness += 8; this.mood += 5; break;
            case 'laughing': this.happiness += 6; this.mood += 4; break;
            case 'singing': this.happiness += 4; this.mood += 3; break;
            case 'love': this.happiness += 10; this.mood += 8; break;
        }

        this.notifyListeners();
    }

    getCurrentState(): { position: Position; state: AnimationState } {
        return { position: this.position, state: this.state };
    }

    onChange(callback: (pos: Position, state: AnimationState) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(cb => cb(this.position, this.state));
    }

    jumpToPosition(x: number, y: number): void {
        this.position = { x, y };
        this.notifyListeners();
    }

    jumpToChat(): void {
        this.position = { x: 85, y: 75 };
        this.setState('celebrating');
        setTimeout(() => this.setState('idle'), 2000);
    }

    triggerCelebration(): void {
        this.lastInteractionTime = Date.now();
        this.happiness = Math.min(100, this.happiness + 15);
        this.mood = Math.min(100, this.mood + 10);
        
        const celebrationActions: AnimationState[] = ['celebrating', 'love', 'jumping', 'dancing'];
        const action = celebrationActions[Math.floor(Math.random() * celebrationActions.length)];
        this.setState(action);
        setTimeout(() => this.setState('idle'), 3000);
    }

    triggerSurprise(): void {
        this.setState('surprised');
        setTimeout(() => this.setState('idle'), 2000);
    }

    triggerLaugh(): void {
        this.happiness += 5;
        this.setState('laughing');
        setTimeout(() => this.setState('idle'), 3000);
    }

    triggerSing(): void {
        this.setState('singing');
        setTimeout(() => this.setState('idle'), 5000);
    }

    triggerThink(): void {
        this.setState('thinking');
        setTimeout(() => this.setState('idle'), 4000);
    }

    goHome(): void {
        this.position = { x: 88, y: 85 };
        this.setState('walking');
        setTimeout(() => {
            this.setState('sleeping');
        }, 2000);
    }
}

export const mascotRoaming = new MascotRoamingService();
