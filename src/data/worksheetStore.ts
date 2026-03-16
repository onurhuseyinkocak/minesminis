// Worksheets Store - Shared state between Admin and Public pages
// This store persists worksheet data in localStorage and syncs between components

import { Worksheet, worksheetsData as initialWorksheets } from './worksheetsData';

const STORAGE_KEY = 'minesminis_worksheets';

// Initialize from localStorage or use initial data
function loadWorksheets(): Worksheet[] {
    if (typeof window === 'undefined') return initialWorksheets;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            const storedIds = new Set(parsed.map((w: Worksheet) => w.id));
            const newInitialWorksheets = initialWorksheets.filter(w => !storedIds.has(w.id));
            return [...parsed, ...newInitialWorksheets];
        }
    } catch (error) {
        console.error('Error loading worksheets from localStorage:', error);
    }

    return initialWorksheets;
}

// Save worksheets to localStorage
function saveWorksheets(worksheets: Worksheet[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(worksheets));
        window.dispatchEvent(new CustomEvent('worksheetsUpdated', { detail: worksheets }));
    } catch (error) {
        console.error('Error saving worksheets to localStorage:', error);
    }
}

let worksheetsCache: Worksheet[] = [];

if (typeof window !== 'undefined') {
    worksheetsCache = loadWorksheets();
}

export const worksheetStore = {
    getWorksheets(): Worksheet[] {
        if (worksheetsCache.length === 0) {
            worksheetsCache = loadWorksheets();
        }
        return worksheetsCache;
    },

    addWorksheet(worksheet: Worksheet): void {
        worksheetsCache = [...worksheetsCache, worksheet];
        saveWorksheets(worksheetsCache);
    },

    updateWorksheet(id: string, updatedWorksheet: Partial<Worksheet>): void {
        worksheetsCache = worksheetsCache.map(w =>
            w.id === id ? { ...w, ...updatedWorksheet } : w
        );
        saveWorksheets(worksheetsCache);
    },

    deleteWorksheet(id: string): void {
        worksheetsCache = worksheetsCache.filter(w => w.id !== id);
        saveWorksheets(worksheetsCache);
    },

    reset(): void {
        worksheetsCache = [...initialWorksheets];
        saveWorksheets(worksheetsCache);
    },

    subscribe(callback: (worksheets: Worksheet[]) => void): () => void {
        const handler = (event: CustomEvent<Worksheet[]>) => {
            callback(event.detail);
        };

        window.addEventListener('worksheetsUpdated', handler as EventListener);

        return () => {
            window.removeEventListener('worksheetsUpdated', handler as EventListener);
        };
    }
};

export default worksheetStore;
