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
        "Seni gördüğüme sevindim! 😊",
        "Roar! I'm a friendly dragon! 🐉"
    ],
    walking: [
        "La la la~ 🎵",
        "Where shall I go? 🗺️",
        "Adventure time! ⭐",
        "Exploring! 🔍",
        "Flying around! 🌈"
    ],
    dancing: [
        "Dance with me! 💃",
        "Harika müzik! 🎶",
        "Party time! 🎊",
        "Dragon dance! 🐉💃"
    ],
    celebrating: [
        "Yaay! 🎉",
        "We did it! 🏆",
        "Harika! 🌟",
        "Amazing! ✨",
        "Dragon power! 🐉🎉"
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
        "Uykum var... 💤",
        "Dragon nap time... 🐉💤"
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
        "Hop hop! 🐉",
        "Wheee! 🎈",
        "Jump jump! 🦎"
    ],
    following: [
        "Seni takip ediyorum! 👀",
        "Wait for me! 🏃",
        "I'm coming! 🐉",
        "Following you! 💫"
    ],
    random: [
        "Did you know? English is fun! 🇬🇧",
        "A is for Apple! 🍎",
        "D is for Dragon! 🐉",
        "Let's learn together! 📖",
        "Practice makes perfect! ⭐",
        "You're doing great! 👏",
        "Keep it up! 💪",
        "İngilizce öğrenelim! 🌍",
        "Çok yeteneklisin! 🏅",
        "I believe in you! 💖",
        "Learning is an adventure! 🚀",
        "Words are magic! ✨",
        "Dragons love learning! 🐉📚"
    ],
    capabilities: [
        "Bana tıkla ve sohbet edelim! 💬",
        "Click on me to chat! 🗨️",
        "Benimle kelime oyunları oynayabilirsin! 🎮",
        "Bana İngilizce sorular sorabilirsin! 📚",
        "I can help you learn new words! 🌟",
        "Let's play matching games! 🃏",
        "Hafıza oyunu oynayalım mı? 🧠",
        "I can teach you colors and animals! 🎨🐱",
        "Hayvanları İngilizce öğrenelim! 🦁",
        "Numbers are fun with me! 🔢",
        "Renkleri beraber öğrenelim! 🌈",
        "Ask me anything in English! ❓",
        "Evime tıkla, sohbet edelim! 🏠💬",
        "Click my cave to start chatting! 🐲",
        "I can sing ABC with you! 🎵",
        "Let's count together! 1, 2, 3! 🔢",
        "Bana meyveler sor! Apple, banana... 🍎🍌",
        "I know lots of English words! 📖",
        "Oyun oynamak ister misin? 🎲",
        "Flash cards ile öğrenelim! 🃏"
    ]
};

const SPEECH_BUBBLES_NOVA: Partial<Record<string, string[]>> = {
    dancing: ["Cosmic dance! 🦊💫", "Star twirl! 🌟", "Nova groove! ✨", "Galaxy moves! 🎶"],
    celebrating: ["Yay! 🦊🎉", "Stellar! ⭐", "Amazing! ✨", "Cosmic power! 🌠"],
    idle: ["Ready to explore? 🦊", "Stars are calling! 🌟", "What's next? ✨"],
    random: ["Words are like stars! 🌟", "Quick as light! ⚡", "Let's zoom! 🦊"]
};

const SPEECH_BUBBLES_BUBBLES: Partial<Record<string, string[]>> = {
    dancing: ["Bubble dance! 🐙💃", "Ocean groove~ 🎵", "Splash! 🌊"],
    celebrating: ["Woohoo! 🐙🎉", "Wave of joy! 🌊", "Fantastic! ✨"],
    idle: ["Listen closely~ 🐙", "Hear the waves? 🌊", "La la la~ 🎵"],
    random: ["Sounds are magic! 🎵", "Say it with me~ 🐙", "Listen and learn! 👂"]
};

const SPEECH_BUBBLES_SPARKY: Partial<Record<string, string[]>> = {
    dancing: ["Zap dance! 👾⚡", "Electric moves! 🎵", "Sparky groove! ⚡"],
    celebrating: ["Solved it! 👾🎉", "Brain power! 🧠", "Lightning fast! ⚡"],
    idle: ["Puzzle time? 🧩", "Think think~ 🧠", "Systems ready! 👾"],
    random: ["Grammar is cool! 📐", "Solve with me! 🧩", "Quick thinker! ⚡"]
};

function getBubblesForMascot(mascotId: string, state: string): string[] {
    const defaultBubbles = SPEECH_BUBBLES[state] || SPEECH_BUBBLES.random;
    const charMap: Record<string, Partial<Record<string, string[]>>> = {
        nova_fox: SPEECH_BUBBLES_NOVA,
        bubbles_octo: SPEECH_BUBBLES_BUBBLES,
        sparky_alien: SPEECH_BUBBLES_SPARKY,
    };
    const charBubbles = charMap[mascotId]?.[state];
    if (charBubbles && charBubbles.length > 0) return charBubbles;
    return defaultBubbles;
}

const BOUNDS = { xMin: 8, xMax: 92, yMin: 25, yMax: 88 };

function clampPosition(pos: Position): Position {
    return {
        x: Math.max(BOUNDS.xMin, Math.min(BOUNDS.xMax, pos.x)),
        y: Math.max(BOUNDS.yMin, Math.min(BOUNDS.yMax, pos.y))
    };
}

class MascotRoamingService {
    private position: Position = { x: 85, y: 75 };
    private mascotId: string = 'mimi_cat';
    private state: AnimationState = 'idle';
    private viewDirection: ViewDirection = 'front';
    private isRoaming: boolean = false;
    private roamingInterval: ReturnType<typeof setTimeout> | null = null;
    private bubbleInterval: ReturnType<typeof setTimeout> | null = null;
    private mouseFollowInterval: ReturnType<typeof setTimeout> | null = null;
    private isManualMoving: boolean = false;
    private listeners: ((pos: Position, state: AnimationState, view: ViewDirection, bubble: SpeechBubble | null) => void)[] = [];
    private timers: ReturnType<typeof setTimeout>[] = [];

    private energy: number = 100;
    private mood: number = 90;
    private happiness: number = 80;
    private lastInteractionTime: number = Date.now();

    private lastBubbleTime: number = 0;
    private bubbleCooldown: number = 8000;
    private currentBubble: SpeechBubble | null = null;

    private isFollowingMouse: boolean = false;
    private mousePosition: Position = { x: 50, y: 50 };
    private followTimeout: ReturnType<typeof setTimeout> | null = null;

    /** Track a setTimeout so it can be cleaned up later. */
    private track(id: ReturnType<typeof setTimeout>): ReturnType<typeof setTimeout> {
        this.timers.push(id);
        return id;
    }

    /** Clear all tracked timers. */
    cleanup(): void {
        this.timers.forEach(id => clearTimeout(id));
        this.timers = [];
    }

    startRoaming(): void {
        if (this.isRoaming) return;
        this.isRoaming = true;
        // AI Mascot roaming started
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
        this.cleanup();
    }

    private scheduleNextAction(): void {
        if (!this.isRoaming) return;
        const delay = 14000 + Math.random() * 12000;
        this.roamingInterval = setTimeout(() => {
            if (!this.isFollowingMouse && !this.isManualMoving) {
                this.makeAIDecision();
            }
            this.scheduleNextAction();
        }, delay);
    }

    private scheduleRandomBubble(): void {
        if (!this.isRoaming) return;

        const delay = 12000 + Math.random() * 18000;

        this.bubbleInterval = setTimeout(() => {
            if (this.isRoaming && !this.isFollowingMouse && !this.isManualMoving) {
                this.showRandomBubble();
            }
            this.scheduleRandomBubble();
        }, delay);
    }

    private scheduleMouseFollow(): void {
        if (!this.isRoaming) return;
        const delay = 120000 + Math.random() * 60000;
        this.mouseFollowInterval = setTimeout(() => {
            if (this.isRoaming && Math.random() < 0) {
                this.startFollowingMouse();
            }
            this.scheduleMouseFollow();
        }, delay);
    }

    setMascotId(id: string): void {
        this.mascotId = id || 'mimi_cat';
    }

    private showRandomBubble(): void {
        const now = Date.now();
        if (now - this.lastBubbleTime < this.bubbleCooldown) return;

        const useCapabilities = Math.random() < 0.4;
        const pool = useCapabilities ? SPEECH_BUBBLES['capabilities'] : getBubblesForMascot(this.mascotId, 'random');
        const message = pool[Math.floor(Math.random() * pool.length)];

        this.showBubble(message, 4500);
    }

    private showBubble(message: string, duration: number = 3500): void {
        const now = Date.now();
        if (now - this.lastBubbleTime < this.bubbleCooldown) return;

        this.lastBubbleTime = now;
        this.currentBubble = { message, duration };
        this.notifyListeners();

        this.track(setTimeout(() => {
            this.currentBubble = null;
            this.notifyListeners();
        }, duration));
    }

    private showStateBubble(): void {
        const stateMessages = getBubblesForMascot(this.mascotId, this.state);
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
        const followMsgs = getBubblesForMascot(this.mascotId, 'following');
        this.showBubble(followMsgs[Math.floor(Math.random() * followMsgs.length)], 2500);
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

        const speed = 0.12;
        const newPos = clampPosition({
            x: this.position.x + dx * speed,
            y: this.position.y + dy * speed
        });
        this.position = newPos;

        if (dx > 2) {
            this.viewDirection = 'right';
        } else if (dx < -2) {
            this.viewDirection = 'left';
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
        } else if (decision < 0.42) {
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
            this.track(setTimeout(() => {
                if (this.state === action) {
                    this.setState('idle');
                }
            }, duration));
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
        if (this.isManualMoving) return;
        const targetPosition = this.getRandomSafePosition();
        const distance = Math.sqrt(
            Math.pow(targetPosition.x - this.position.x, 2) +
            Math.pow(targetPosition.y - this.position.y, 2)
        );

        const dx = targetPosition.x - this.position.x;

        if (dx > 2) {
            this.viewDirection = 'right';
        } else if (dx < -2) {
            this.viewDirection = 'left';
        }

        this.state = 'walking';
        this.position = { ...targetPosition };
        this.notifyListeners();

        const duration = Math.min(5000, Math.max(2200, distance * 55));
        this.track(setTimeout(() => {
            if (this.state === 'walking') {
                this.viewDirection = 'front';
                this.setState('idle');
            }
        }, duration));
    }

    private getRandomSafePosition(): Position {
        const safeZones: Position[] = [
            { x: 12, y: 78 }, { x: 25, y: 82 }, { x: 40, y: 78 },
            { x: 55, y: 80 }, { x: 70, y: 78 }, { x: 85, y: 75 },
            { x: 85, y: 65 }, { x: 85, y: 55 }, { x: 82, y: 50 },
            { x: 12, y: 65 }, { x: 12, y: 55 }, { x: 12, y: 50 },
            { x: 50, y: 68 }, { x: 42, y: 58 }, { x: 58, y: 52 },
            { x: 28, y: 65 }, { x: 72, y: 65 },
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
        this.track(setTimeout(() => this.setState('idle'), 3000));
    }

    startManualMove(): void {
        this.isManualMoving = true;
        this.state = 'following';
        this.notifyListeners();
    }

    setManualPosition(x: number, y: number): void {
        if (!this.isManualMoving) return;
        this.position = clampPosition({ x, y });
        this.notifyListeners();
    }

    stopManualMove(): void {
        this.isManualMoving = false;
        this.state = 'idle';
        this.notifyListeners();
    }

    triggerCelebration(): void {
        this.lastInteractionTime = Date.now();
        this.happiness = Math.min(100, this.happiness + 12);
        this.mood = Math.min(100, this.mood + 8);

        const celebrationActions: AnimationState[] = ['celebrating', 'love', 'dancing'];
        const action = celebrationActions[Math.floor(Math.random() * celebrationActions.length)];
        this.setState(action);
        this.showStateBubble();
        this.track(setTimeout(() => this.setState('idle'), 4000));
    }

    triggerSurprise(): void {
        this.setState('surprised');
        this.showStateBubble();
        this.track(setTimeout(() => this.setState('idle'), 2500));
    }

    triggerLaugh(): void {
        this.happiness += 4;
        this.setState('laughing');
        this.showStateBubble();
        this.track(setTimeout(() => this.setState('idle'), 4000));
    }

    triggerSing(): void {
        this.setState('singing');
        this.showStateBubble();
        this.track(setTimeout(() => this.setState('idle'), 6000));
    }

    triggerThink(): void {
        this.setState('thinking');
        this.showStateBubble();
        this.track(setTimeout(() => this.setState('idle'), 5000));
    }

    goHome(): void {
        this.position = { x: 88, y: 85 };
        this.setState('walking');
        this.track(setTimeout(() => {
            this.setState('sleeping');
        }, 3000));
    }

    onHover(): void {
        this.lastInteractionTime = Date.now();
        if (this.state === 'idle' && Math.random() < 0.5) {
            const idleMsgs = getBubblesForMascot(this.mascotId, 'idle');
            this.showBubble(idleMsgs[Math.floor(Math.random() * idleMsgs.length)], 2500);
        }
    }
}

export const mascotRoaming = new MascotRoamingService();
