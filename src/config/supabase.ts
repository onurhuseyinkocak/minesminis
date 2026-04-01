import { createClient } from '@supabase/supabase-js';
import { errorLogger } from '../services/errorLogger';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  errorLogger.log({ severity: 'critical', message: 'Supabase credentials missing! Check your .env file.', component: 'supabase' });
  if (import.meta.env.DEV) {
    console.warn('[MinesMinis] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY — Supabase calls will fail silently.');
  }
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
          role?: 'teacher' | 'student' | 'parent';
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
          uploaded_by: string | null;
          visibility: string;
          tags: string[];
          downloads: number;
          completions: number;
          rating: number;
          thumbnail_url: string;
          source: string;
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
          added_by: string | null;
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
          grade: string;
          is_popular: boolean;
          added_by: string | null;
          curated_by: string | null;
          tags: string[];
          likes: number;
          views: number;
          created_at: string;
        };
      };
      user_activities: {
        Row: {
          id: string;
          user_id: string;
          activity_type: string;
          activity_name: string;
          xp_earned: number;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          activity_type: string;
          activity_name: string;
          xp_earned?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          activity_type?: string;
          activity_name?: string;
          xp_earned?: number;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string;
          avatar_emoji: string | null;
          is_premium: boolean;
          premium_until: string | null;
          role: string;
          created_at: string;
          updated_at: string;
          onboarding_completed: boolean;
          grade: string | null;
          xp: number;
          level: number;
          streak_days: number;
          badges: string[];
          last_login: string | null;
          words_learned: number;
          games_played: number;
          videos_watched: number;
          worksheets_completed: number;
          last_daily_claim: string | null;
        };
        Insert: {
          id: string;
          email: string;
          display_name: string;
          avatar_emoji?: string | null;
          is_premium?: boolean;
          premium_until?: string | null;
          role?: string;
          onboarding_completed?: boolean;
          grade?: string | null;
          xp?: number;
          level?: number;
          streak_days?: number;
          badges?: string[];
          words_learned?: number;
          games_played?: number;
          videos_watched?: number;
          worksheets_completed?: number;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string;
          avatar_emoji?: string | null;
          is_premium?: boolean;
          premium_until?: string | null;
          role?: string;
          updated_at?: string;
          onboarding_completed?: boolean;
          grade?: string | null;
          xp?: number;
          level?: number;
          streak_days?: number;
          badges?: string[];
          words_learned?: number;
          games_played?: number;
          videos_watched?: number;
          worksheets_completed?: number;
          last_daily_claim?: string | null;
        };
      };
      user_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          start_date: string;
          end_date: string;
          status: string;
          payment_method: string;
          payment_id: string | null;
          amount_paid: number | null;
          currency: string;
          auto_renew: boolean;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          start_date: string;
          end_date: string;
          status?: string;
          payment_method?: string;
          payment_id?: string | null;
          amount_paid?: number | null;
          currency?: string;
          auto_renew?: boolean;
        };
        Update: {
          status?: string;
          auto_renew?: boolean;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          updated_at?: string;
        };
      };
      premium_plans: {
        Row: {
          id: string;
          name: string;
          price: number;
          currency: string;
          duration_months: number;
          features: string[];
          is_popular: boolean;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          challenge_id: string | null;
          worksheet_id: string | null;
          game_id: string | null;
          video_id: string | null;
          status: string;
          score: number | null;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          challenge_id?: string | null;
          worksheet_id?: string | null;
          game_id?: string | null;
          video_id?: string | null;
          status?: string;
          score?: number | null;
          completed_at?: string | null;
        };
        Update: {
          status?: string;
          score?: number | null;
          completed_at?: string | null;
        };
      };
      daily_streaks: {
        Row: {
          id: string;
          user_id: string;
          streak_date: string;
          activities_completed: number;
          points_earned: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          streak_date: string;
          activities_completed?: number;
          points_earned?: number;
        };
        Update: {
          activities_completed?: number;
          points_earned?: number;
        };
      };
      game_scores: {
        Row: {
          id: string;
          user_id: string;
          game_id: string;
          score: number;
          time_taken: number | null;
          accuracy: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_id: string;
          score: number;
          time_taken?: number | null;
          accuracy?: number | null;
        };
        Update: {
          score?: number;
          time_taken?: number | null;
          accuracy?: number | null;
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
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      friends: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted';
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          item_type: string;
          item_id: string;
          item_name: string | null;
          item_image: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          item_type?: string;
          item_id: string;
          item_name?: string | null;
          item_image?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          item_type?: string;
          item_id?: string;
          item_name?: string | null;
          item_image?: string | null;
          created_at?: string;
        };
      };
      pets: {
        Row: {
          id: string;
          name: string;
          type: string;
          emoji: string;
          level: number;
          experience: number;
          happiness: number;
          hunger: number;
          energy: number;
          last_fed: string;
          last_played: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name?: string;
          type?: string;
          emoji?: string;
          level?: number;
          experience?: number;
          happiness?: number;
          hunger?: number;
          energy?: number;
          last_fed?: string;
          last_played?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          emoji?: string;
          level?: number;
          experience?: number;
          happiness?: number;
          hunger?: number;
          energy?: number;
          last_fed?: string;
          last_played?: string;
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          icon_url: string | null;
          created_at: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          created_at?: string;
        };
      };
      story_progress: {
        Row: {
          id: string;
          user_id: string;
          character_name: string;
          mascot_id: string;
          current_world: string;
          current_node_id: string;
          traits: Record<string, unknown>;
          inventory: unknown[];
          visited_node_ids: unknown[];
          total_xp: number;
          choice_history: unknown[];
          session_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          character_name?: string;
          mascot_id?: string;
          current_world?: string;
          current_node_id?: string;
          traits?: Record<string, unknown>;
          inventory?: unknown[];
          visited_node_ids?: unknown[];
          total_xp?: number;
          choice_history?: unknown[];
          session_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          character_name?: string;
          mascot_id?: string;
          current_world?: string;
          current_node_id?: string;
          traits?: Record<string, unknown>;
          inventory?: unknown[];
          visited_node_ids?: unknown[];
          total_xp?: number;
          choice_history?: unknown[];
          session_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      words: {
        Row: {
          id: string;
          word: string;
          level: string;
          category: string;
          emoji: string;
          turkish: string;
          example: string | null;
          grade: number | null;
          image_url: string | null;
          word_audio_url: string | null;
          example_audio_url: string | null;
          created_at: string;
        };
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string | null;
          excerpt: string | null;
          meta_title: string | null;
          meta_description: string | null;
          published_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: string | null;
          excerpt?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: string | null;
          excerpt?: string | null;
          meta_title?: string | null;
          meta_description?: string | null;
          published_at?: string | null;
          created_at?: string;
        };
      };
      reports: {
        Row: {
          id: string;
          user_id: string | null;
          page_url: string;
          page_path: string;
          content: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          page_url?: string;
          page_path?: string;
          content: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          page_url?: string;
          page_path?: string;
          content?: string;
          status?: string;
          created_at?: string;
        };
      };
      curriculum_worlds: {
        Row: {
          id: string;
          order: number;
          name: string;
          name_en: string;
          emoji: string;
          color: string;
          description: string;
          age_range: string;
          lesson_count: number;
          created_at: string;
        };
      };
      curriculum_lessons: {
        Row: {
          id: string;
          world_id: string;
          order: number;
          title: string;
          title_tr: string;
          objective: string;
          vocabulary_words: unknown[];
          activities: unknown[];
          duration: number;
          status: string;
          created_at: string;
        };
      };
      stories: {
        Row: {
          id: string;
          title: string;
          title_tr: string | null;
          summary: string | null;
          summary_tr: string | null;
          moral: string | null;
          moral_tr: string | null;
          cover_scene: string | null;
          target_age: number[];
          vocabulary: unknown[];
          scenes: unknown[];
          status: string;
          created_at: string;
          updated_at: string;
        };
      };
      story_scenes: {
        Row: {
          id: string;
          story_id: string;
          scene_order: number;
          text: string;
          text_tr: string;
          location: string;
          characters: string[];
          mood: string;
          camera_angle: string;
          sound_effect: string | null;
          animation_cue: string | null;
          vocabulary: unknown[];
          choices: unknown[];
          created_at: string;
        };
      };
      tts_cache: {
        Row: {
          id: number;
          text_hash: string;
          text: string;
          audio_url: string;
          created_at: string;
        };
      };
      learn_audio: {
        Row: {
          id: string;
          key: string;
          audio_base64: string;
          created_at: string;
        };
      };
    };
  };
}
