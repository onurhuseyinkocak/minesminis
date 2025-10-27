import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Post as PostType } from '../../../services/postsService';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import toast from 'react-hot-toast';

interface PostProps {
  post: PostType;
  onLike: (postId: string) => void;
  onShare: (post: PostType) => void;
  onDeletePost: (postId: string) => void;
  index: number;
}

const Post: React.FC<PostProps> = ({ post, onLike, onShare, onDeletePost, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuth();

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }
    onLike(post.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare(post);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || user.id !== post.author_id) {
      toast.error('You cannot delete this post');
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDeletePost(post.id);
    setShowDeleteModal(false);
  };

  const getTimeAgo = () => {
    try {
      return formatDistanceToNow(new Date(post.created_at), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const formatContent = (content: string) => {
    if (content.length <= 280 || isExpanded) {
      return content;
    }
    return content.substring(0, 280) + '...';
  };

  const shouldShowReadMore = post.content.length > 280;

  const isLiked = post.is_liked || false;
  const isOwnPost = user?.id === post.author_id;

  return (
    <motion.div
      className="post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="post-header">
        <div className="post-avatar">
          {post.author?.avatar_url ? (
            <img src={post.author.avatar_url} alt={post.author.display_name} />
          ) : (
            <div className="avatar-placeholder">
              {post.author?.display_name?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="post-info">
          <div className="post-author-name">
            {post.author?.display_name || 'Anonymous'}
            <span className="role-badge">{post.author?.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}</span>
          </div>
          <div className="post-time">{getTimeAgo()}</div>
        </div>
        {isOwnPost && (
          <button className="post-delete-btn" onClick={handleDelete} title="Delete post">
            🗑️
          </button>
        )}
      </div>

      <div className="post-content">
        <p>{formatContent(post.content)}</p>
        {shouldShowReadMore && (
          <button className="read-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {post.media_url && (
        <div className="post-media">
          <img src={post.media_url} alt="Post media" />
        </div>
      )}

      {post.hashtags && post.hashtags.length > 0 && (
        <div className="post-hashtags">
          {post.hashtags.map((tag, i) => (
            <span key={i} className="hashtag">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="post-footer">
        <button
          className={`post-action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="action-count">{post.likes_count > 0 ? post.likes_count : ''}</span>
        </button>

        <button className="post-action-btn" title="Comment">
          <span className="action-icon">💬</span>
          <span className="action-count">{post.comments_count > 0 ? post.comments_count : ''}</span>
        </button>

        <button className="post-action-btn" onClick={handleShare} title="Share">
          <span className="action-icon">🔗</span>
          <span className="action-count">{post.shares_count > 0 ? post.shares_count : ''}</span>
        </button>
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          itemName="post"
        />
      )}
    </motion.div>
  );
};

export default Post;
