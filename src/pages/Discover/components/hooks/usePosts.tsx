import { useState, useEffect } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import { postsService, Post } from '../../../../services/postsService';
import toast from 'react-hot-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, [user]);

  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const postsData = await postsService.getDiscoverPosts(50, user?.id);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts!');
      return;
    }

    try {
      const post = posts.find((p) => p.id === postId);
      if (post?.is_liked) {
        await postsService.unlikePost(postId, user.id);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, is_liked: false, likes_count: p.likes_count - 1 }
              : p
          )
        );
      } else {
        await postsService.likePost(postId, user.id);
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, is_liked: true, likes_count: p.likes_count + 1 }
              : p
          )
        );
      }
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.author?.display_name || 'Someone'} shared`,
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Share cancelled.');
      }
    } else {
      navigator.clipboard.writeText(post.content);
      toast.success('Post copied to clipboard!');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;

    try {
      await postsService.deletePost(postId, user.id);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success('Post deleted');
    } catch (error: any) {
      console.error('Error deleting post:', error);
      toast.error(error.message || 'Failed to delete post');
    }
  };

  return {
    posts,
    isLoadingPosts,
    activeTab,
    setActiveTab,
    handleLike,
    handleShare,
    handleDeletePost,
    loadPosts,
  };
};
