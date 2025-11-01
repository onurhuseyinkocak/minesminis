import { supabase } from '../config/supabase';

export interface Comment {
  id: string;
  post_id: string;
  parent_id: string | null;
  author_id: string;
  content: string;
  likes_count: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  users?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
    role?: string;
  };
  replies?: Comment[];
}

export const commentsService = {
  async getCommentsByPostId(postId: string, userId?: string): Promise<Comment[]> {
    let query = supabase
      .from('comments')
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true });

    const { data: comments, error } = await query;

    if (error) throw error;

    if (!comments) return [];

    // Get likes for all comments if user is authenticated
    if (userId && comments.length > 0) {
      const commentIds = comments.map(c => c.id);
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', commentIds);

      const likedIds = new Set(likes?.map(l => l.comment_id) || []);

      comments.forEach(comment => {
        comment.is_liked = likedIds.has(comment.id);
      });
    }

    // Get replies for each comment
    for (const comment of comments) {
      const replies = await this.getRepliesByCommentId(comment.id, userId);
      comment.replies = replies;
    }

    return comments;
  },

  async getRepliesByCommentId(parentId: string, userId?: string): Promise<Comment[]> {
    const { data: replies, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .eq('parent_id', parentId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    if (!replies) return [];

    // Get likes for replies if user is authenticated
    if (userId && replies.length > 0) {
      const replyIds = replies.map(r => r.id);
      const { data: likes } = await supabase
        .from('comment_likes')
        .select('comment_id')
        .eq('user_id', userId)
        .in('comment_id', replyIds);

      const likedIds = new Set(likes?.map(l => l.comment_id) || []);

      replies.forEach(reply => {
        reply.is_liked = likedIds.has(reply.id);
      });
    }

    return replies;
  },

  async createComment(postId: string, content: string, parentId?: string): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        parent_id: parentId || null,
        author_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .single();

    if (error) throw error;

    // Update parent comment replies_count if it's a reply
    if (parentId) {
      await supabase.rpc('increment_comment_replies', { comment_id: parentId });
    }

    // Update post comments_count
    await supabase.rpc('increment_post_comments', { post_id: postId });

    return data;
  },

  async deleteComment(commentId: string): Promise<void> {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
  },

  async updateComment(commentId: string, content: string): Promise<Comment> {
    const { data, error } = await supabase
      .from('comments')
      .update({
        content: content.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', commentId)
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url,
          role
        )
      `)
      .single();

    if (error) throw error;
    return data;
  },

  async likeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .insert({ comment_id: commentId, user_id: userId });

    if (error) throw error;

    // Update likes count
    await supabase.rpc('increment_comment_likes', { comment_id: commentId });
  },

  async unlikeComment(commentId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (error) throw error;

    // Decrease likes count
    await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
  }
};
