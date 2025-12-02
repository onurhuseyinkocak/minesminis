type AnimationState = 'idle' | 'walking' | 'dancing' | 'celebrating' | 'waving' | 'sleeping' | 'laughing' | 'singing' | 'thinking' | 'surprised' | 'love' | 'jumping' | 'following';

type ViewDirection = 'front' | 'left' | 'right';

interface Position {
    x: number;
    y: number;
}

interface SpeechBubble {
    message: string;
    duration: number;
}

const SPEECH_BUBBLES: Record<string, string[]> = {
    idle: [
        "Hmm, ne yapsam? 🤔",
        "Bugün güzel bir gün! ☀️",
        "Öğrenmeye hazır mısın? 📚",
        "Hello there! 👋",
        "I love learning! 💖",
        "Beraber oynayalım mı? 🎮",
        "Merhaba arkadaşım! 🌟",
        "What a beautiful day! 🌈",
        "Let's have fun! 🎉",
        "Seni gördüğüme sevindim! 😊"
    ],
    walking: [
        "La la la~ 🎵",
        "Yürüyorum! 🚶",
        "Where shall I go? 🗺️",
        "Adventure time! ⭐",
        "Exploring! 🔍"
    ],
    dancing: [
        "Dance with me! 💃",
        "Harika müzik! 🎶",
        "Shake it! 🕺",
        "Party time! 🎊"
    ],
    celebrating: [
        "Yaay! 🎉",
        "We did it! 🏆",
        "Harika! 🌟",
        "Amazing! ✨"
    ],
    waving: [
        "Hi there! 👋",
        "Merhaba! 🙋",
        "Hello friend! 💕",
        "Hey! Over here! 🌟"
    ],
    sleeping: [
        "Zzz... 💤",
        "So sleepy... 😴",
        "Uykum var... 💤"
    ],
    laughing: [
        "Hahaha! 😂",
        "So funny! 🤣",
        "Çok komik! 😆"
    ],
    singing: [
        "La la la~ 🎵",
        "Sing along! 🎤",
        "Music is life! 🎶"
    ],
    thinking: [
        "Hmm... 🤔",
        "Let me think... 💭",
        "Düşünüyorum... 🧠",
        "I wonder... 🌟"
    ],
    surprised: [
        "Ohhh! 😲",
        "Wow! 😮",
        "Vay canına! 🤯"
    ],
    love: [
        "Seni seviyorum! 💕",
        "I love you! ❤️",
        "You're the best! 💖",
        "So much love! 💗"
    ],
    jumping: [
        "Hop hop! 🐰",
        "Wheee! 🎈",
        "Jump jump! 🦘"
    ],
    following: [
        "Seni takip ediyorum! 👀",
        "Wait for me! 🏃",
        "I'm coming! 🐻",
        "Following you! 💫"
    ],
    random: [
        "Did you know? English is fun! 🇬🇧",
        "A is for Apple! 🍎",
        "B is for Bear! 🐻",
        "Let's learn together! 📖",
        "Practice makes perfect! ⭐",
        "You're doing great! 👏",
        "Keep it up! 💪",
        "İngilizce öğrenelim! 🌍",
        "Çok yeteneklisin! 🏅",
        "I believe in you! 💖",
        "Learning is an adventure! 🚀",
        "Words are magic! ✨"
    ]
};

class MascotRoamingService {
    private position: Position = { x: 85, y: 75 };
    private state: AnimationState = 'idle';
    private viewDirection: ViewDirection = 'front';
    private isRoaming: boolean = false;
    private roamingInterval: NodeJS.Timeout | null = null;
    private bubbleInterval: NodeJS.Timeout | null = null;
    private mouseFollowInterval: NodeJS.Timeout | null = null;
    private listeners: ((pos: Position, state: AnimationState, view: ViewDirection, bubble: SpeechBubble | null) => void)[] = [];

    private energy: number = 100;
    private mood: number = 90;
    private happiness: number = 80;
    private lastInteractionTime: number = Date.now();
    
    private lastBubbleTime: number = 0;
    private bubbleCooldown: number = 8000;
    private currentBubble: SpeechBubble | null = null;
    
    private isFollowingMouse: boolean = false;
    private mousePosition: Position = { x: 50, y: 50 };
    private followTimeout: NodeJS.Timeout | null = null;

    startRoaming(): void {
        if (this.isRoaming) return;
        this.isRoaming = true;
        console.log('🤖 AI Mascot is now ALIVE and making its own decisions!');
        this.scheduleNextAction();
        this.scheduleRandomBubble();
        this.scheduleMouseFollow();
    }

    stopRoaming(): void {
        this.isRoaming = false;
        if (this.roamingInterval) {
            clearTimeout(this.roamingInterval);
            this.roamingInterval = null;
        }
        if (this.bubbleInterval) {
            clearTimeout(this.bubbleInterval);
            this.bubbleInterval = null;
        }
        if (this.mouseFollowInterval) {
            clearTimeout(this.mouseFollowInterval);
            this.mouseFollowInterval = null;
        }
        if (this.followTimeout) {
            clearTimeout(this.followTimeout);
            this.followTimeout = null;
        }
        this.isFollowingMouse = false;
        this.currentBubble = null;
    }

    private scheduleNextAction(): void {
        if (!this.isRoaming) return;

        const delay = 6000 + Math.random() * 8000;

        this.roamingInterval = setTimeout(() => {
            if (!this.isFollowingMouse) {
                this.makeAIDecision();
            }
            this.scheduleNextAction();
        }, delay);
    }
    
    private scheduleRandomBubble(): void {
        if (!this.isRoaming) return;
        
        const delay = 12000 + Math.random() * 18000;
        
        this.bubbleInterval = setTimeout(() => {
            if (this.isRoaming && !this.isFollowingMouse) {
                this.showRandomBubble();
            }
            this.scheduleRandomBubble();
        }, delay);
    }
    
    private scheduleMouseFollow(): void {
        if (!this.isRoaming) return;
        
        const delay = 45000 + Math.random() * 60000;
        
        this.mouseFollowInterval = setTimeout(() => {
            if (this.isRoaming && Math.random() < 0.4) {
                this.startFollowingMouse();
            }
            this.scheduleMouseFollow();
        }, delay);
    }
    
    private showRandomBubble(): void {
        const now = Date.now();
        if (now - this.lastBubbleTime < this.bubbleCooldown) return;
        
        const pool = SPEECH_BUBBLES['random'];
        const message = pool[Math.floor(Math.random() * pool.length)];
        
        this.showBubble(message, 4000);
    }
    
    private showBubble(message: string, duration: number = 3500): void {
        const now = Date.now();
        if (now - this.lastBubbleTime < this.bubbleCooldown) return;
        
        this.lastBubbleTime = now;
        this.currentBubble = { message, duration };
        this.notifyListeners();
        
        setTimeout(() => {
            this.currentBubble = null;
            this.notifyListeners();
        }, duration);
    }
    
    private showStateBubble(): void {
        const stateMessages = SPEECH_BUBBLES[this.state];
        if (!stateMessages || stateMessages.length === 0) return;
        
        if (Math.random() < 0.6) {
            const message = stateMessages[Math.floor(Math.random() * stateMessages.length)];
            this.showBubble(message, 3500);
        }
    }
    
    updateMousePosition(x: number, y: number): void {
        this.mousePosition = { x, y };
        
        if (this.isFollowingMouse) {
            this.followMouse();
        }
    }
    
    private startFollowingMouse(): void {
        if (this.isFollowingMouse) return;
        
        this.isFollowingMouse = true;
        this.state = 'following';
        this.showBubble(SPEECH_BUBBLES.following[Math.floor(Math.random() * SPEECH_BUBBLES.following.length)], 2500);
        this.notifyListeners();
        
        this.followTimeout = setTimeout(() => {
            this.stopFollowingMouse();
        }, 8000 + Math.random() * 7000);
    }
    
    private stopFollowingMouse(): void {
        if (!this.isFollowingMouse) return;
        
        this.isFollowingMouse = false;
        if (this.followTimeout) {
            clearTimeout(this.followTimeout);
            this.followTimeout = null;
        }
        this.setState('idle');
    }
    
    private followMouse(): void {
        if (!this.isFollowingMouse) return;
        
        const targetX = Math.max(10, Math.min(90, this.mousePosition.x));
        const targetY = Math.max(25, Math.min(85, this.mousePosition.y));
        
        const dx = targetX - this.position.x;
        const dy = targetY - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            this.viewDirection = 'front';
            this.notifyListeners();
            return;
        }
        
        const speed = 0.15;
        const newX = this.position.x + dx * speed;
        const newY = this.position.y + dy * speed;
        
        this.previousPosition = { ...this.position };
        this.position = { x: newX, y: newY };
        
        if (dx > 2) {
            this.viewDirection = 'left';
        } else if (dx < -2) {
            this.viewDirection = 'right';
        } else {
            this.viewDirection = 'front';
        }
        
        this.notifyListeners();
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
        this.showStateBubble();
        
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

        const dx = targetPosition.x - this.position.x;
        
        if (dx > 2) {
            this.viewDirection = 'left';
        } else if (dx < -2) {
            this.viewDirection = 'right';
        }

        this.state = 'walking';
        this.previousPosition = { ...this.position };
        this.position = { ...targetPosition };
        this.notifyListeners();

        const duration = distance * 180;

        setTimeout(() => {
            if (this.state === 'walking') {
                this.viewDirection = 'front';
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
        
        if (state === 'idle') {
            this.viewDirection = 'front';
        }

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
    
    getViewDirection(): ViewDirection {
        return this.viewDirection;
    }

    getCurrentState(): { position: Position; state: AnimationState; viewDirection: ViewDirection; bubble: SpeechBubble | null } {
        return { 
            position: { ...this.position }, 
            state: this.state,
            viewDirection: this.viewDirection,
            bubble: this.currentBubble
        };
    }

    onChange(callback: (pos: Position, state: AnimationState, view: ViewDirection, bubble: SpeechBubble | null) => void): () => void {
        this.listeners.push(callback);
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    private notifyListeners(): void {
        const positionCopy = { ...this.position };
        this.listeners.forEach(cb => cb(positionCopy, this.state, this.viewDirection, this.currentBubble));
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
        this.showStateBubble();
        setTimeout(() => this.setState('idle'), 4000);
    }

    triggerSurprise(): void {
        this.setState('surprised');
        this.showStateBubble();
        setTimeout(() => this.setState('idle'), 2500);
    }

    triggerLaugh(): void {
        this.happiness += 4;
        this.setState('laughing');
        this.showStateBubble();
        setTimeout(() => this.setState('idle'), 4000);
    }

    triggerSing(): void {
        this.setState('singing');
        this.showStateBubble();
        setTimeout(() => this.setState('idle'), 6000);
    }

    triggerThink(): void {
        this.setState('thinking');
        this.showStateBubble();
        setTimeout(() => this.setState('idle'), 5000);
    }

    goHome(): void {
        this.position = { x: 88, y: 85 };
        this.setState('walking');
        setTimeout(() => {
            this.setState('sleeping');
        }, 3000);
    }
    
    onHover(): void {
        this.lastInteractionTime = Date.now();
        if (this.state === 'idle' && Math.random() < 0.5) {
            this.showBubble(SPEECH_BUBBLES.idle[Math.floor(Math.random() * SPEECH_BUBBLES.idle.length)], 2500);
        }
    }
}

export const mascotRoaming = new MascotRoamingService();
