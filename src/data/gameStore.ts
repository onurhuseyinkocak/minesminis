// Games Store - Shared state between Admin and Public pages
// This store persists game data in localStorage and syncs between components

import { Game, getAllGames } from './gamesData';

const STORAGE_KEY = 'minesminis_games';

// Initialize from localStorage or use initial data
function loadGames(): Game[] {
    if (typeof window === 'undefined') return getAllGames();

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const initialGames = getAllGames();
            const storedIds = new Set(parsed.map((g: Game) => g.id));
            const newInitialGames = initialGames.filter(g => !storedIds.has(g.id));
            return [...parsed, ...newInitialGames];
        }
    } catch (error) {
        console.error('Error loading games from localStorage:', error);
    }

    return getAllGames();
}

// Save games to localStorage
function saveGames(games: Game[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
        window.dispatchEvent(new CustomEvent('gamesUpdated', { detail: games }));
    } catch (error) {
        console.error('Error saving games to localStorage:', error);
    }
}

let gamesCache: Game[] = [];

if (typeof window !== 'undefined') {
    gamesCache = loadGames();
}

export const gameStore = {
    getGames(): Game[] {
        if (gamesCache.length === 0) {
            gamesCache = loadGames();
        }
        return gamesCache;
    },

    addGame(game: Game): void {
        gamesCache = [...gamesCache, game];
        saveGames(gamesCache);
    },

    updateGame(id: number, updatedGame: Partial<Game>): void {
        gamesCache = gamesCache.map(g =>
            g.id === id ? { ...g, ...updatedGame } : g
        );
        saveGames(gamesCache);
    },

    deleteGame(id: number): void {
        gamesCache = gamesCache.filter(g => g.id !== id);
        saveGames(gamesCache);
    },

    reset(): void {
        gamesCache = [...getAllGames()];
        saveGames(gamesCache);
    },

    subscribe(callback: (games: Game[]) => void): () => void {
        const handler = (event: CustomEvent<Game[]>) => {
            callback(event.detail);
        };

        window.addEventListener('gamesUpdated', handler as EventListener);

        return () => {
            window.removeEventListener('gamesUpdated', handler as EventListener);
        };
    }
};

export default gameStore;
