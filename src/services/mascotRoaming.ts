// AI-Powered Mascot Roaming System
// Mascot can freely move around the screen and make its own decisions!

interface Position {
    x: number; // Percentage (0-100)
    y: number; // Percentage (0-100)
}

type AnimationState = 'idle' | 'walking' | 'running' | 'dancing' | 'celebrating' | 'waving' | 'sleeping';

class MascotRoamingService {
    private position: Position = { x: 85, y: 80 }; // Start bottom-right
    private state: AnimationState = 'idle';
    private isRoaming: boolean = false;
    private roamingInterval: NodeJS.Timeout | null = null;
    private listeners: ((pos: Position, state: AnimationState) => void)[] = [];

    // AI Decision Factors
    private energy: number = 100; // 0-100
    private mood: number = 90; // 0-100
    private lastActionTime: number = Date.now();

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

        // AI decides how long to wait (Increased to 6-12 seconds for calmness)
        const delay = 6000 + Math.random() * 6000;

        this.roamingInterval = setTimeout(() => {
            this.makeAIDecision();
            this.scheduleNextAction();
        }, delay);
    }

    private makeAIDecision(): void {
        // Update energy and mood over time
        this.updateAIFactors();

        const decision = Math.random();

        // AI Decision Tree (Calmer Behavior)
        if (this.energy < 30) {
            // Low energy - sleep!
            this.setState('sleeping');
            setTimeout(() => {
                this.energy = 100; // Restore energy
                this.setState('idle');
            }, 10000); // Sleep longer
        } else if (this.mood > 80 && this.energy > 70) {
            // Happy - maybe celebrate or dance (Low chance)
            if (decision < 0.15) {
                this.setState('celebrating');
                setTimeout(() => this.setState('idle'), 3000);
            } else if (decision < 0.3) {
                this.setState('dancing');
                setTimeout(() => this.setState('idle'), 4000);
            } else {
                // Mostly just chill
                this.setState('idle');
            }
        } else if (decision < 0.4) {
            // Move around (40% chance, down from 50%)
            this.moveToRandomPosition();
        } else if (decision < 0.5) {
            // Wave hello (10% chance)
            this.setState('waving');
            setTimeout(() => this.setState('idle'), 3000);
        } else {
            // Just idle (50% chance - very calm)
            this.setState('idle');
        }
    }

    private updateAIFactors(): void {
        // Energy decreases over time
        this.energy = Math.max(0, this.energy - Math.random() * 5);

        // Mood fluctuates
        this.mood += (Math.random() - 0.5) * 10;
        this.mood = Math.max(0, Math.min(100, this.mood));
    }

    private moveToRandomPosition(): void {
        const targetPosition = this.getRandomSafePosition();
        const distance = Math.sqrt(
            Math.pow(targetPosition.x - this.position.x, 2) +
            Math.pow(targetPosition.y - this.position.y, 2)
        );

        // Decide speed based on distance
        const speed = distance > 40 ? 'running' : 'walking';
        this.state = speed;
        this.position = targetPosition;
        this.notifyListeners();

        // Calculate duration based on distance
        const duration = speed === 'running' ? distance * 30 : distance * 50;

        setTimeout(() => {
            this.state = 'idle';
            this.notifyListeners();
        }, duration);
    }

    private getRandomSafePosition(): Position {
        // Safe zones avoid top navbar and footer
        const safeZones: Position[] = [
            // Bottom area
            { x: 10, y: 85 }, { x: 25, y: 80 }, { x: 50, y: 85 },
            { x: 75, y: 80 }, { x: 90, y: 85 },
            // Middle-right area
            { x: 85, y: 60 }, { x: 90, y: 50 }, { x: 85, y: 40 },
            // Middle-left area
            { x: 10, y: 60 }, { x: 15, y: 50 }, { x: 10, y: 40 },
            // Center area
            { x: 50, y: 60 }, { x: 50, y: 50 },
        ];

        // Filter out current position
        const available = safeZones.filter(
            pos => Math.abs(pos.x - this.position.x) > 15 || Math.abs(pos.y - this.position.y) > 10
        );

        return available.length > 0
            ? available[Math.floor(Math.random() * available.length)]
            : safeZones[Math.floor(Math.random() * safeZones.length)];
    }

    setState(state: AnimationState): void {
        this.state = state;
        this.lastActionTime = Date.now();

        // Update energy based on action
        if (state === 'running') this.energy -= 5;
        else if (state === 'dancing') this.energy -= 3;
        else if (state === 'walking') this.energy -= 2;
        else if (state === 'sleeping') this.energy = 100;

        this.notifyListeners();
    }

    getCurrentState(): { position: Position; state: AnimationState } {
        return { position: this.position, state: this.state };
    }

    onChange(callback: (pos: Position, state: AnimationState) => void): () => void {
        this.listeners.push(callback);
        // Return unsubscribe function
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(): void {
        this.listeners.forEach(cb => cb(this.position, this.state));
    }

    // Manual control methods (for user interaction)
    jumpToPosition(x: number, y: number): void {
        this.position = { x, y };
        this.notifyListeners();
    }

    triggerCelebration(): void {
        this.setState('celebrating');
        this.mood = Math.min(100, this.mood + 20);
        setTimeout(() => this.setState('idle'), 3000);
    }
}

export const mascotRoaming = new MascotRoamingService();
