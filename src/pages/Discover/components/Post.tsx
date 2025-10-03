import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post as PostType } from '../../../services/postsService';
import { User } from 'firebase/auth';
import toast from 'react-hot-toast';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onShare: (post: PostType) => void;
  onDeletePost: (postId: string) => void;
  index: number;
  currentUser: User | null;
  isRetweeting: boolean;
}

const Post: React.FC<PostProps> = ({ 
  post, 
  onLike, 
  onRetweet, 
  onShare, 
  onDeletePost, 
  index,
  currentUser,
  isRetweeting
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Beğenmek için giriş yapmalısınız');
      return;
    }
    onLike(post.id);
  };

  const handleRetweet = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser) {
      toast.error('Retweet yapmak için giriş yapmalısınız');
      return;
    }
    onRetweet(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!currentUser || currentUser.uid !== post.authorId) {
      toast.error('Bu postu silme yetkiniz yok');
      return;
    }
    
    if (window.confirm('Bu postu silmek istediğinizden emin misiniz?')) {
      onDeletePost(post.id);
      toast.success('Post silindi');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'şimdi';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} dk`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} s`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} g`;
      
      return date.toLocaleDateString('tr-TR');
    } catch (error) {
      return '';
    }
  };

  const shouldShowMore = post.content.length > 200;
  const displayContent = shouldShowMore && !isExpanded 
    ? post.content.slice(0, 200) + '...' 
    : post.content;

  const isLiked = currentUser && post.likes.includes(currentUser.uid);
  const isRetweeted = currentUser && post.retweets?.includes(currentUser.uid);
  const retweetCount = post.retweets?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="post"
    >
      {post.isRetweet && post.originalAuthorName && (
        <div className="retweet-indicator">
          <span>🔁 {post.authorName} tarafından retweetlendi</span>
        </div>
      )}
      
      <div className="post-header">
        <div className="post-author">
          <div className="author-avatar">
            {post.authorName?.charAt(0).toUpperCase()}
          </div>
          <div className="author-info">
            <span className="author-name">{post.authorName}</span>
            <span className="post-date">{formatDate(post.timestamp)}</span>
          </div>
        </div>
        
        {currentUser && currentUser.uid === post.authorId && (
          <button 
            className="delete-post-btn"
            onClick={handleDelete}
            title="Postu sil"
          >
            🗑️
          </button>
        )}
      </div>

      <div className="post-content">
        <p>{displayContent}</p>
        {shouldShowMore && (
          <button 
            className="show-more-btn"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Daha az göster' : 'Devamını oku'}
          </button>
        )}
      </div>

      {post.imageUrl && (
        <div className="post-image">
          <img src={post.imageUrl} alt="Post" />
        </div>
      )}

      <div className="post-actions">
        <button 
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          ❤️ {post.likes.length}
        </button>
        
        <button 
          className={`action-btn retweet-btn ${isRetweeted ? 'retweeted' : ''} ${isRetweeting ? 'retweeting' : ''}`}
          onClick={handleRetweet}
          disabled={isRetweeting}
        >
          {isRetweeting ? '⏳' : '🔁'} {retweetCount}
        </button>
        
        <button 
          className="action-btn share-btn"
          onClick={handleShare}
        >
          📤
        </button>
      </div>

      <div className="post-stats">
        <span>{post.likes.length} beğenme</span>
        <span>{retweetCount} retweet</span>
        <span>{post.engagementScore || 0} etkileşim</span>
      </div>
    </motion.div>
  );
};

export default Post;