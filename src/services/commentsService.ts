import { supabase } from '../config/supabase';

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  users?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export const commentsService = {
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createComment(postId: string, content: string): Promise<Comment> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: user.id,
        content: content.trim()
      })
      .select(`
        *,
        users:author_id (
          id,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
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
          avatar_url
        )
      `)
      .single();

    if (error) throw error;
    return data;
  }
};
