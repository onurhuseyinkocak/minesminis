// Words Store - Shared state between Admin and Public pages
// This store persists word data in localStorage and syncs between components

import { KidsWord, kidsWords as initialWords, TOTAL_WORDS_COUNT } from './wordsData';

const STORAGE_KEY = 'minesminis_words';

// Initialize from localStorage or use initial data
function loadWords(): KidsWord[] {
    if (typeof window === 'undefined') return initialWords;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const storedWords = new Set(parsed.map((w: KidsWord) => w.word));
            const newInitialWords = initialWords.filter(w => !storedWords.has(w.word));
            return [...parsed, ...newInitialWords];
        }
    } catch (error) {
        console.error('Error loading words from localStorage:', error);
    }

    return initialWords;
}

// Save words to localStorage
function saveWords(words: KidsWord[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
        window.dispatchEvent(new CustomEvent('wordsUpdated', { detail: words }));
    } catch (error) {
        console.error('Error saving words to localStorage:', error);
    }
}

let wordsCache: KidsWord[] = [];

if (typeof window !== 'undefined') {
    wordsCache = loadWords();
}

export const wordStore = {
    getWords(): KidsWord[] {
        if (wordsCache.length === 0) {
            wordsCache = loadWords();
        }
        return wordsCache;
    },

    getTotalCount(): number {
        return Math.max(wordsCache.length, TOTAL_WORDS_COUNT);
    },

    addWord(word: KidsWord): void {
        wordsCache = [...wordsCache, word];
        saveWords(wordsCache);
    },

    updateWord(originalWord: string, updatedWord: Partial<KidsWord>): void {
        wordsCache = wordsCache.map(w =>
            w.word === originalWord ? { ...w, ...updatedWord } : w
        );
        saveWords(wordsCache);
    },

    deleteWord(word: string): void {
        wordsCache = wordsCache.filter(w => w.word !== word);
        saveWords(wordsCache);
    },

    reset(): void {
        wordsCache = [...initialWords];
        saveWords(wordsCache);
    },

    subscribe(callback: (words: KidsWord[]) => void): () => void {
        const handler = (event: CustomEvent<KidsWord[]>) => {
            callback(event.detail);
        };

        window.addEventListener('wordsUpdated', handler as EventListener);

        return () => {
            window.removeEventListener('wordsUpdated', handler as EventListener);
        };
    }
};

export default wordStore;
