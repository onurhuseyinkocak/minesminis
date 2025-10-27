import { supabase } from '../config/supabase';

export interface Post {
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
  author?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    role: 'teacher' | 'student';
  };
  is_liked?: boolean;
}

export const postsService = {
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    if (!matches) return [];
    return matches.map((tag) => tag.substring(1).toLowerCase());
  },

  async createPost(postData: {
    authorId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: string;
    visibility?: 'everyone' | 'students' | 'teachers' | 'followers' | 'private';
    hashtags?: string[];
  }) {
    try {
      const hashtags = postData.hashtags || this.extractHashtags(postData.content);

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: postData.authorId,
          content: postData.content,
          media_url: postData.mediaUrl || null,
          media_type: postData.mediaType || null,
          visibility: postData.visibility || 'everyone',
          hashtags,
          post_type: 'text',
        })
        .select(
          `
          *,
          author:users!posts_author_id_fkey(id, display_name, avatar_url, role)
        `
        )
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async getDiscoverPosts(limitCount: number = 50, userId?: string) {
    try {
      let query = supabase
        .from('posts')
        .select(
          `
          *,
          author:users!posts_author_id_fkey(id, display_name, avatar_url, role)
        `
        )
        .order('created_at', { ascending: false })
        .limit(limitCount);

      const { data, error } = await query;

      if (error) throw error;

      if (!userId) return data || [];

      const postsWithLikes = await Promise.all(
        (data || []).map(async (post) => {
          const { data: likeData } = await supabase
            .from('post_likes')
            .select('id')
            .eq('post_id', post.id)
            .eq('user_id', userId)
            .maybeSingle();

          return {
            ...post,
            is_liked: !!likeData,
          };
        })
      );

      return postsWithLikes;
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  async likePost(postId: string, userId: string) {
    try {
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId });

      if (likeError) throw likeError;

      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post) {
        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count + 1 })
          .eq('id', postId);
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  async unlikePost(postId: string, userId: string) {
    try {
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (unlikeError) throw unlikeError;

      const { data: post } = await supabase
        .from('posts')
        .select('likes_count')
        .eq('id', postId)
        .single();

      if (post && post.likes_count > 0) {
        await supabase
          .from('posts')
          .update({ likes_count: post.likes_count - 1 })
          .eq('id', postId);
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  },

  async deletePost(postId: string, userId: string) {
    try {
      const { data: post } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', postId)
        .single();

      if (post?.author_id !== userId) {
        throw new Error('You can only delete your own posts');
      }

      const { error } = await supabase.from('posts').delete().eq('id', postId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  async reportPost(postId: string, userId: string, reason: string, description?: string) {
    try {
      const { error } = await supabase.from('reports').insert({
        reporter_id: userId,
        content_type: 'post',
        content_id: postId,
        reason,
        description: description || '',
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  async getUserPosts(userId: string, limitCount: number = 20) {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(
          `
          *,
          author:users!posts_author_id_fkey(id, display_name, avatar_url, role)
        `
        )
        .eq('author_id', userId)
        .order('created_at', { ascending: false })
        .limit(limitCount);

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error getting user posts:', error);
      return [];
    }
  },
};
