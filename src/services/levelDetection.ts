// Level Detection Service for Adaptive Teaching
// Analyzes user messages to determine English proficiency level

export type EnglishLevel = 'beginner' | 'intermediate' | 'advanced';

interface LevelMetrics {
    avgWordCount: number;
    uniqueWords: number;
    grammarComplexity: number;
    vocabularyRichness: number;
}

class LevelDetectionService {
    private messageHistory: string[] = [];
    private readonly STORAGE_KEY = 'mimi_user_level';
    private readonly MESSAGES_FOR_DETECTION = 3;

    // Store user's detected level
    saveLevel(level: EnglishLevel): void {
        localStorage.setItem(this.STORAGE_KEY, level);
    }

    // Retrieve stored level
    getStoredLevel(): EnglishLevel | null {
        return localStorage.getItem(this.STORAGE_KEY) as EnglishLevel | null;
    }

    // Add message to analysis queue
    addMessage(message: string): void {
        this.messageHistory.push(message);

        // Auto-detect after enough messages
        if (this.messageHistory.length === this.MESSAGES_FOR_DETECTION) {
            const level = this.detectLevel();
            this.saveLevel(level);
        }
    }

    // Analyze messages to determine level
    private detectLevel(): EnglishLevel {
        const metrics = this.calculateMetrics();

        // Beginner: Short sentences, simple words
        if (metrics.avgWordCount < 5 && metrics.grammarComplexity < 2) {
            return 'beginner';
        }

        // Advanced: Complex sentences, rich vocabulary
        if (metrics.avgWordCount > 12 && metrics.vocabularyRichness > 0.7) {
            return 'advanced';
        }

        // Default to intermediate
        return 'intermediate';
    }

    private calculateMetrics(): LevelMetrics {
        const allWords = this.messageHistory.join(' ').toLowerCase().split(/\s+/);
        const uniqueWords = new Set(allWords);

        return {
            avgWordCount: allWords.length / this.messageHistory.length,
            uniqueWords: uniqueWords.size,
            grammarComplexity: this.assessGrammar(),
            vocabularyRichness: uniqueWords.size / allWords.length
        };
    }

    private assessGrammar(): number {
        // Simple heuristic: check for past tense, questions, compound sentences
        const text = this.messageHistory.join(' ').toLowerCase();
        let complexity = 0;

        // Check for past tense (-ed endings)
        if (/\b\w+ed\b/.test(text)) complexity++;

        // Check for questions
        if (/\?/.test(text)) complexity++;

        // Check for conjunctions (compound sentences)
        if (/(and|but|or|because)\s/.test(text)) complexity++;

        return complexity;
    }

    // Get current level with fallback
    getCurrentLevel(): EnglishLevel {
        return this.getStoredLevel() || 'intermediate'; // Default to intermediate
    }

    // Reset detection (useful for new user or manual override)
    reset(): void {
        this.messageHistory = [];
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

// Export singleton instance
export const levelDetector = new LevelDetectionService();
