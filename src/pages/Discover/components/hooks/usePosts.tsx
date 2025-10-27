import { useState, useEffect } from 'react';
import { postsService, Post } from '../../../../services/postsService';
import toast from 'react-hot-toast';

const usePosts = (userId?: string) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postsService.getDiscoverPosts(50, userId);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!userId) {
      toast.error('Please sign in to like posts');
      return;
    }

    try {
      const post = posts.find((p) => p.id === postId);
      if (!post) return;

      if (post.is_liked) {
        await postsService.unlikePost(postId, userId);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, is_liked: false, likes_count: p.likes_count - 1 }
              : p
          )
        );
      } else {
        await postsService.likePost(postId, userId);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, is_liked: true, likes_count: p.likes_count + 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this post',
          text: post.content.substring(0, 100),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!userId) {
      toast.error('Please sign in to delete posts');
      return;
    }

    try {
      await postsService.deletePost(postId, userId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  return {
    posts,
    loading,
    handleLike,
    handleShare,
    handleDelete,
    refreshPosts: loadPosts,
  };
};

export default usePosts;
