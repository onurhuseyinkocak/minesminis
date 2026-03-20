import { createClient } from '@supabase/supabase-js';
import { errorLogger } from '../services/errorLogger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  errorLogger.log({ severity: 'critical', message: 'Supabase credentials missing! Check your .env file.', component: 'supabase' });
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '', {
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
          role: 'teacher' | 'student' | 'parent';
          display_name: string;
          avatar_url: string | null;
          bio: string;
          grade: string | null;
          subjects: string[];
          points: number;
          badges: string[];
          streak_days: number;
          level: number;
          xp: number;
          weekly_xp: number;
          last_login: string;
          is_online: boolean;
          settings: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'teacher' | 'student' | 'parent';
          display_name: string;
          avatar_url?: string | null;
          bio?: string;
          grade?: string | null;
          subjects?: string[];
          points?: number;
          badges?: string[];
          streak_days?: number;
          level?: number;
          xp?: number;
          weekly_xp?: number;
          last_login?: string;
          is_online?: boolean;
          settings?: Record<string, unknown>;
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
          level?: number;
          xp?: number;
          weekly_xp?: number;
          last_login?: string;
          is_online?: boolean;
          settings?: Record<string, unknown>;
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
      activity_logs: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          duration: number;
          accuracy: number | null;
          xp_earned: number;
          sound_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          duration?: number;
          accuracy?: number | null;
          xp_earned?: number;
          sound_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          duration?: number;
          accuracy?: number | null;
          xp_earned?: number;
          sound_id?: string | null;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      phonics_mastery: {
        Row: {
          id: string;
          user_id: string;
          sound_id: string;
          mastery: number;
          attempts: number;
          correct_attempts: number;
          last_practiced: string;
          next_review: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sound_id: string;
          mastery?: number;
          attempts?: number;
          correct_attempts?: number;
          last_practiced?: string;
          next_review?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sound_id?: string;
          mastery?: number;
          attempts?: number;
          correct_attempts?: number;
          last_practiced?: string;
          next_review?: string | null;
          created_at?: string;
        };
      };
      classrooms: {
        Row: {
          id: string;
          teacher_id: string;
          name: string;
          grade_level: string | null;
          join_code: string;
          phonics_group_assigned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          teacher_id: string;
          name: string;
          grade_level?: string | null;
          join_code: string;
          phonics_group_assigned?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          teacher_id?: string;
          name?: string;
          grade_level?: string | null;
          join_code?: string;
          phonics_group_assigned?: number;
          created_at?: string;
        };
      };
      classroom_students: {
        Row: {
          id: string;
          classroom_id: string;
          student_id: string;
          joined_at: string;
        };
        Insert: {
          id?: string;
          classroom_id: string;
          student_id: string;
          joined_at?: string;
        };
        Update: {
          id?: string;
          classroom_id?: string;
          student_id?: string;
          joined_at?: string;
        };
      };
      parent_children: {
        Row: {
          id: string;
          parent_id: string;
          child_id: string;
          relationship: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          parent_id: string;
          child_id: string;
          relationship?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          parent_id?: string;
          child_id?: string;
          relationship?: string;
          created_at?: string;
        };
      };
      garden_plants: {
        Row: {
          id: string;
          user_id: string;
          sound_id: string;
          stage: string;
          mastery: number;
          water_drops: number;
          last_watered: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sound_id: string;
          stage?: string;
          mastery?: number;
          water_drops?: number;
          last_watered?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          sound_id?: string;
          stage?: string;
          mastery?: number;
          water_drops?: number;
          last_watered?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
