// Proactive Engagement System - The "Boredom Killer"
// Triggers fun interactions when user is inactive

export interface EngagementHook {
    message: string;
    type: 'ispy' | 'funfact' | 'challenge' | 'game';
}

class ProactiveEngagementService {
    private lastActivity: number = Date.now();
    private engagementTimeout: NodeJS.Timeout | null = null;
    private readonly INACTIVITY_THRESHOLD = 10000; // 10 seconds
    private callbacks: ((hook: EngagementHook) => void)[] = [];

    // Start monitoring user activity
    startMonitoring(): void {
        // Track mouse movement
        this.trackUserActivity();

        // Check for inactivity every second
        this.checkInactivity();
    }

    // Stop monitoring
    stopMonitoring(): void {
        if (this.engagementTimeout) {
            clearTimeout(this.engagementTimeout);
        }
    }

    // Track user activity events
    private trackUserActivity(): void {
        const updateActivity = () => {
            this.lastActivity = Date.now();
        };

        // Listen to various user interactions
        document.addEventListener('mousemove', updateActivity);
        document.addEventListener('click', updateActivity);
        document.addEventListener('keypress', updateActivity);
        document.addEventListener('scroll', updateActivity);
    }

    // Check if user is inactive
    private checkInactivity(): void {
        const check = () => {
            const timeSinceActivity = Date.now() - this.lastActivity;

            if (timeSinceActivity >= this.INACTIVITY_THRESHOLD) {
                this.triggerEngagementHook();
                // Reset activity to avoid spamming
                this.lastActivity = Date.now();
            }

            // Check again in 1 second
            this.engagementTimeout = setTimeout(check, 1000);
        };

        check();
    }

    // Trigger a random engagement hook
    private triggerEngagementHook(): void {
        const hook = this.getRandomHook();
        this.callbacks.forEach(cb => cb(hook));
    }

    // Get random engagement message
    private getRandomHook(): EngagementHook {
        const hooks: EngagementHook[] = [
            // I Spy games
            { message: "Hey! I spy with my little eye... something BLUE! 🔵 Can you click it?", type: 'ispy' },
            { message: "Psst! I see something RED! ❤️ Can you find it on the screen?", type: 'ispy' },
            { message: "I spy something you can CLICK! 🖱️ Find it!", type: 'ispy' },

            // Fun facts
            { message: "Fun fact! 🤓 'Butterfly' 🦋 has no butter! Silly English, right?", type: 'funfact' },
            { message: "Did you know? The word 'school' comes from the Greek word for 'free time'! 📚", type: 'funfact' },
            { message: "Random fact! 'Hello' 👋 is one of the newest words in English! Cool!", type: 'funfact' },

            // Challenges
            { message: "Quick! Can you name 3 colors in English? 🎨 I bet you can!", type: 'challenge' },
            { message: "Challenge time! What's 'Merhaba' in English? 🌍 (Hint: H___o!)", type: 'challenge' },
            { message: "Let's test! Can you count to 5 in English? 🔢 Ready, go!", type: 'challenge' },

            // Game prompts
            { message: "I'm bored! Want to play a word game with me? 🎮", type: 'game' },
            { message: "Let's have fun! Ask me to tell you a joke! 😂", type: 'game' },
            { message: "Story time! Say 'tell me a story' and I'll start one! 📖", type: 'game' }
        ];

        return hooks[Math.floor(Math.random() * hooks.length)];
    }

    // Register callback for engagement triggers
    onEngagement(callback: (hook: EngagementHook) => void): void {
        this.callbacks.push(callback);
    }

    // Manual trigger (for testing)
    triggerManual(): void {
        this.triggerEngagementHook();
    }
}

// Export singleton
export const proactiveEngagement = new ProactiveEngagementService();
