import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'teacher' | 'student';
          display_name: string;
          avatar_url: string | null;
          bio: string;
          grade: string | null;
          subjects: string[];
          points: number;
          badges: string[];
          streak_days: number;
          last_login: string;
          is_online: boolean;
          settings: Record<string, any>;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'teacher' | 'student';
          display_name: string;
          avatar_url?: string | null;
          bio?: string;
          grade?: string | null;
          subjects?: string[];
          points?: number;
          badges?: string[];
          streak_days?: number;
          last_login?: string;
          is_online?: boolean;
          settings?: Record<string, any>;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'teacher' | 'student';
          display_name?: string;
          avatar_url?: string | null;
          bio?: string;
          grade?: string | null;
          subjects?: string[];
          points?: number;
          badges?: string[];
          streak_days?: number;
          last_login?: string;
          is_online?: boolean;
          settings?: Record<string, any>;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          author_id: string;
          content: string;
          media_url: string | null;
          media_type: string | null;
          post_type: string;
          visibility: 'everyone' | 'students' | 'teachers' | 'followers' | 'private';
          hashtags: string[];
          mentions: string[];
          likes_count: number;
          comments_count: number;
          shares_count: number;
          is_pinned: boolean;
          scheduled_for: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id: string;
          content: string;
          media_url?: string | null;
          media_type?: string | null;
          post_type?: string;
          visibility?: 'everyone' | 'students' | 'teachers' | 'followers' | 'private';
          hashtags?: string[];
          mentions?: string[];
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          is_pinned?: boolean;
          scheduled_for?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          author_id?: string;
          content?: string;
          media_url?: string | null;
          media_type?: string | null;
          post_type?: string;
          visibility?: 'everyone' | 'students' | 'teachers' | 'followers' | 'private';
          hashtags?: string[];
          mentions?: string[];
          likes_count?: number;
          comments_count?: number;
          shares_count?: number;
          is_pinned?: boolean;
          scheduled_for?: string | null;
          created_at?: string;
        };
      };
      worksheets: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_url: string;
          file_name: string;
          file_type: string;
          subject: string;
          grade: string;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          uploaded_by: string;
          visibility: string;
          tags: string[];
          downloads: number;
          completions: number;
          rating: number;
          created_at: string;
        };
      };
      games: {
        Row: {
          id: string;
          title: string;
          url: string;
          category: string;
          difficulty: 'easy' | 'medium' | 'hard' | null;
          thumbnail_url: string | null;
          description: string | null;
          added_by: string;
          target_audience: string | null;
          plays: number;
          rating: number;
          created_at: string;
        };
      };
      videos: {
        Row: {
          id: string;
          youtube_id: string;
          title: string;
          description: string | null;
          thumbnail: string | null;
          duration: string | null;
          category: string;
          channel_name: string | null;
          added_by: string;
          curated_by: string | null;
          tags: string[];
          likes: number;
          views: number;
          created_at: string;
        };
      };
    };
  };
}
