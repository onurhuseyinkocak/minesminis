// Context Detection Service - Knows what page user is on
// Provides relevant vocabulary and teaching opportunities

export type AppContext = 'games' | 'words' | 'videos' | 'worksheets' | 'home' | 'other';

interface ContextVocabulary {
    [key: string]: {
        words: string[];
        phrases: string[];
        teachingPrompts: string[];
    };
}

const CONTEXT_VOCABULARY: ContextVocabulary = {
    games: {
        words: ['play', 'win', 'lose', 'score', 'level', 'fun', 'click', 'tap', 'game', 'try'],
        phrases: ['Let\'s play!', 'Good game!', 'Try again!', 'You won!', 'Level up!'],
        teachingPrompts: [
            'You\'re on the Games page! 🎮 Do you know what "play" means?',
            'When you click a game, you can say "I want to PLAY!" Can you try?',
            'If you WIN a game, you can say "I won!" 🏆 Let\'s practice!'
        ]
    },
    words: {
        words: ['learn', 'study', 'practice', 'remember', 'spell', 'word', 'letter', 'alphabet'],
        phrases: ['Let\'s learn!', 'Good job!', 'Try to spell...', 'Can you remember?'],
        teachingPrompts: [
            'You\'re learning WORDS! 📚 That\'s so cool!',
            'Let\'s practice spelling! Pick a word you like! ✨',
            'Every new word makes you smarter! 🧠 Which word should we learn?'
        ]
    },
    videos: {
        words: ['watch', 'see', 'listen', 'hear', 'show', 'video', 'look', 'sound'],
        phrases: ['Let\'s watch!', 'Did you see?', 'Can you hear?', 'Look at this!'],
        teachingPrompts: [
            'You\'re watching videos! 📺 What do you SEE?',
            'Videos help us LISTEN and LEARN! 👂 Can you hear the English?',
            'After watching, can you tell me what you SAW? 👀'
        ]
    },
    worksheets: {
        words: ['write', 'draw', 'color', 'complete', 'finish', 'worksheet', 'practice'],
        phrases: ['Let\'s write!', 'Good work!', 'Keep going!', 'Almost done!'],
        teachingPrompts: [
            'Worksheets are FUN! ✏️ What are you working on?',
            'Writing helps you LEARN! 📝 Can you write your name in English?',
            'Great job PRACTICING! You\'re getting so good! ⭐'
        ]
    }
};

class ContextDetectionService {
    private currentContext: AppContext = 'home';

    // Detect context from pathname
    detectContext(pathname: string): AppContext {
        if (pathname.includes('/games')) return 'games';
        if (pathname.includes('/words')) return 'words';
        if (pathname.includes('/videos')) return 'videos';
        if (pathname.includes('/worksheets')) return 'worksheets';
        if (pathname === '/' || pathname.includes('/home')) return 'home';
        return 'other';
    }

    // Set current context
    setContext(context: AppContext): void {
        this.currentContext = context;
    }

    // Get current context
    getContext(): AppContext {
        return this.currentContext;
    }

    // Get vocabulary for current context
    getContextVocabulary(): string[] {
        const vocab = CONTEXT_VOCABULARY[this.currentContext];
        return vocab ? vocab.words : [];
    }

    // Get teaching prompts for current context
    getTeachingPrompts(): string[] {
        const vocab = CONTEXT_VOCABULARY[this.currentContext];
        return vocab ? vocab.teachingPrompts : [];
    }

    // Get random teaching prompt for engagement
    getRandomPrompt(): string | null {
        const prompts = this.getTeachingPrompts();
        if (prompts.length === 0) return null;
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    // Generate context-aware system message addition
    getContextSystemAddition(): string {
        const context = this.currentContext;
        if (context === 'home' || context === 'other') return '';

        const vocab = this.getContextVocabulary().slice(0, 5).join(', ');
        return `\n\n🎯 CURRENT CONTEXT: The child is on the ${context.toUpperCase()} page. Focus on teaching these words: ${vocab}. Make it relevant to what they're doing right now!`;
    }
}

// Export singleton instance
export const contextDetector = new ContextDetectionService();
