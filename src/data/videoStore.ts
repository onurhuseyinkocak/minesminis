// Video Store - Shared state between Admin and Public pages
// This store persists video data in localStorage and syncs between components

import { Video } from './videosData';
import { videos as initialVideos } from './videosData';

const STORAGE_KEY = 'minesminis_videos';

// Initialize from localStorage or use initial data
function loadVideos(): Video[] {
    if (typeof window === 'undefined') return initialVideos;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Merge with initial videos (in case new videos were added to code)
            const storedIds = new Set(parsed.map((v: Video) => v.id));
            const newInitialVideos = initialVideos.filter(v => !storedIds.has(v.id));
            return [...parsed, ...newInitialVideos];
        }
    } catch (error) {
        console.error('Error loading videos from localStorage:', error);
    }

    return initialVideos;
}

// Save videos to localStorage
function saveVideos(videos: Video[]): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
        // Dispatch custom event for other components to react
        window.dispatchEvent(new CustomEvent('videosUpdated', { detail: videos }));
    } catch (error) {
        console.error('Error saving videos to localStorage:', error);
    }
}

// Store instance
let videosCache: Video[] = [];

// Initialize cache
if (typeof window !== 'undefined') {
    videosCache = loadVideos();
}

export const videoStore = {
    // Get all videos
    getVideos(): Video[] {
        if (videosCache.length === 0) {
            videosCache = loadVideos();
        }
        return videosCache;
    },

    // Add a new video
    addVideo(video: Video): void {
        videosCache = [...videosCache, video];
        saveVideos(videosCache);
    },

    // Update an existing video
    updateVideo(id: string, updatedVideo: Partial<Video>): void {
        videosCache = videosCache.map(v =>
            v.id === id ? { ...v, ...updatedVideo } : v
        );
        saveVideos(videosCache);
    },

    // Delete a video
    deleteVideo(id: string): void {
        videosCache = videosCache.filter(v => v.id !== id);
        saveVideos(videosCache);
    },

    // Reset to initial data (for debugging/testing)
    reset(): void {
        videosCache = [...initialVideos];
        saveVideos(videosCache);
    },

    // Subscribe to changes
    subscribe(callback: (videos: Video[]) => void): () => void {
        const handler = (event: CustomEvent<Video[]>) => {
            callback(event.detail);
        };

        window.addEventListener('videosUpdated', handler as EventListener);

        return () => {
            window.removeEventListener('videosUpdated', handler as EventListener);
        };
    }
};

export default videoStore;
