// src/pages/Discover/components/hooks/usePosts.ts
import { useState, useEffect } from 'react';
import { useAuth } from '../../../../../contexts/AuthContext';
import { postsService, Post } from '../../../../../services/postsService';
import toast from 'react-hot-toast';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { user } = useAuth();

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setIsLoadingPosts(true);
      const postsData = await postsService.getDiscoverPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Posts yüklenirken hata:', error);
      toast.error('Paylaşımlar yüklenirken bir hata oluştu');
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const handleSubmitPost = async (content: string) => {
    if (!user) {
      toast.error('Paylaşım yapmak için giriş yapın!');
      return;
    }

    try {
      const newPost = await postsService.createPost({
        authorId: user.uid,
        authorName: user.displayName || 'Anonim Öğretmen',
        authorPhoto: user.photoURL || undefined,
        content: content,
        imageQuery: undefined
      });
      
      setPosts(prev => [newPost, ...prev]);
      toast.success('Paylaşımınız yayınlandı! 🎉');
      return true;
    } catch (error: any) {
      console.error('Paylaşım hatası:', error);
      toast.error(error.message || 'Paylaşım sırasında bir hata oluştu');
      return false;
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Beğenmek için giriş yapın!');
      return;
    }
    
    try {
      const post = posts.find(p => p.id === postId);
      if (post?.likes.includes(user.uid)) {
        await postsService.unlikePost(postId, user.uid);
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes: p.likes.filter(id => id !== user.uid) }
            : p
        ));
      } else {
        await postsService.likePost(postId, user.uid);
        setPosts(prev => prev.map(p => 
          p.id === postId 
            ? { ...p, likes: [...p.likes, user.uid] }
            : p
        ));
      }
    } catch (error) {
      console.error('Beğenirken hata:', error);
      toast.error('Beğenirken bir hata oluştu');
    }
  };

  const handleRetweet = async (postId: string) => {
    if (!user) {
      toast.error('Paylaşmak için giriş yapın!');
      return;
    }
    
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        await postsService.createPost({
          authorId: user.uid,
          authorName: user.displayName || 'Anonim Öğretmen',
          authorPhoto: user.photoURL || undefined,
          content: `🔁 ${post.content}`,
          imageQuery: undefined
        });
        
        toast.success('Paylaşıldı! 🔁');
        await loadPosts();
      }
    } catch (error) {
      console.error('Paylaşırken hata:', error);
      toast.error('Paylaşırken bir hata oluştu');
    }
  };

  const handleShare = async (post: Post) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${post.authorName} paylaştı`,
          text: post.content,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Paylaşım iptal edildi.');
      }
    } else {
      navigator.clipboard.writeText(post.content);
      toast.success('Paylaşım kopyalandı! 📋');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user) return;
    
    try {
      await postsService.deletePost(postId, user.uid);
      setPosts(prev => prev.filter(p => p.id !== postId));
      toast.success('Paylaşım silindi');
    } catch (error: any) {
      console.error('Silme hatası:', error);
      toast.error(error.message || 'Silme sırasında bir hata oluştu');
    }
  };

  return {
    posts,
    isLoadingPosts,
    activeTab,
    setActiveTab,
    handleSubmitPost,
    handleLike,
    handleRetweet,
    handleShare,
    handleDeletePost,
    loadPosts
  };
};