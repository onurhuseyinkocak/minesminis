import { supabase } from '../config/supabase';
import { fallbackVideos } from './fallbackData';
import { getCachedData, setCachedData } from '../utils/offlineManager';
import { errorLogger } from '../services/errorLogger';

export type Video = {
    id: string;
    youtube_id: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    category: string;
    grade: string;
    isPopular?: boolean;
};

// Store instance
let videosCache: Video[] = [];

export const videoStore = {
    // Get all videos — tries Supabase first, falls back to localStorage cache, then fallback data
    async fetchVideos(): Promise<Video[]> {
        // Try localStorage cache first for instant load
        const cached = getCachedData<Video[]>('videos');

        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            if (!data || data.length === 0) {
                videosCache = fallbackVideos as Video[];
            } else {
                videosCache = data.map((v: Record<string, unknown>) => ({
                    id: String(v.id),
                    youtube_id: String(v.youtube_id ?? ''),
                    title: String(v.title ?? ''),
                    description: typeof v.description === 'string' ? v.description : '',
                    thumbnail: (typeof v.thumbnail === 'string' && v.thumbnail.startsWith('http')) ? v.thumbnail : `https://img.youtube.com/vi/${String(v.youtube_id ?? '')}/mqdefault.jpg`,
                    duration: typeof v.duration === 'string' ? v.duration : '0:00',
                    category: String(v.category ?? ''),
                    grade: String(v.grade ?? '2nd Grade'),
                    isPopular: Boolean(v.is_popular)
                })) as Video[];
            }

            // Persist to localStorage (TTL: 6 hours)
            setCachedData('videos', videosCache, 6 * 60 * 60 * 1000);

            window.dispatchEvent(new CustomEvent('videosUpdated', { detail: videosCache }));
            return videosCache;
        } catch (error) {
            errorLogger.log({ severity: 'high', message: 'Error fetching videos from Supabase', component: 'videoStore', metadata: { error: String(error) } });

            // Use localStorage cache if available
            if (cached && cached.length > 0) {
                videosCache = cached;
            } else {
                videosCache = fallbackVideos as Video[];
            }

            window.dispatchEvent(new CustomEvent('videosUpdated', { detail: videosCache }));
            return videosCache;
        }
    },

    getVideos(): Video[] {
        return videosCache;
    },

    // Add a new video (only columns that exist in DB: youtube_id, title, description, thumbnail, duration, category, grade, is_popular, added_by)
    async addVideo(video: Omit<Video, 'id'>): Promise<void> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const row: Record<string, unknown> = {
                youtube_id: video.youtube_id,
                title: video.title,
                description: video.description ?? '',
                thumbnail: video.thumbnail,
                duration: video.duration ?? '0:00',
                category: video.category,
                grade: (video as { grade?: string }).grade ?? null,
                is_popular: (video as { isPopular?: boolean }).isPopular ?? false,
            };
            if (user?.id) row.added_by = user.id;
            const { error } = await supabase.from('videos').insert([row]);
            if (error) throw error;
            await this.fetchVideos();
        } catch (error) {
            errorLogger.log({ severity: 'high', message: 'Error adding video', component: 'videoStore', metadata: { error: String(error) } });
            throw error;
        }
    },

    // Update an existing video (map to DB columns)
    async updateVideo(id: string, updatedVideo: Partial<Video>): Promise<void> {
        try {
            const row: Record<string, unknown> = {};
            if (updatedVideo.youtube_id !== undefined) row.youtube_id = updatedVideo.youtube_id;
            if (updatedVideo.title !== undefined) row.title = updatedVideo.title;
            if (updatedVideo.description !== undefined) row.description = updatedVideo.description;
            if (updatedVideo.thumbnail !== undefined) row.thumbnail = updatedVideo.thumbnail;
            if (updatedVideo.duration !== undefined) row.duration = updatedVideo.duration;
            if (updatedVideo.category !== undefined) row.category = updatedVideo.category;
            if ((updatedVideo as { grade?: string }).grade !== undefined) row.grade = (updatedVideo as { grade?: string }).grade;
            if ((updatedVideo as { isPopular?: boolean }).isPopular !== undefined) row.is_popular = (updatedVideo as { isPopular?: boolean }).isPopular;
            const { error } = await supabase.from('videos').update(row).eq('id', id);
            if (error) throw error;
            await this.fetchVideos();
        } catch (error) {
            errorLogger.log({ severity: 'high', message: 'Error updating video', component: 'videoStore', metadata: { error: String(error) } });
            throw error;
        }
    },

    // Delete a video
    async deleteVideo(id: string): Promise<void> {
        try {
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await this.fetchVideos();
        } catch (error) {
            errorLogger.log({ severity: 'high', message: 'Error deleting video', component: 'videoStore', metadata: { error: String(error) } });
            throw error;
        }
    },

    // Subscribe to changes
    subscribe(callback: (videos: Video[]) => void): () => void {
        const handler = (event: Event) => {
            const customEvent = event as CustomEvent<Video[]>;
            callback(customEvent.detail);
        };

        window.addEventListener('videosUpdated', handler as EventListener);

        return () => {
            window.removeEventListener('videosUpdated', handler as EventListener);
        };
    }
};

export default videoStore;
