import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Trash2 } from 'lucide-react';
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
    <>
      <motion.div
        className="post"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.05 }}
      >
        <div className="post-header">
          <div className="post-author">
            <div className="author-avatar">
              {post.author?.avatar_url ? (
                <img src={post.author.avatar_url} alt={post.author.display_name} />
              ) : (
                post.author?.display_name?.charAt(0).toUpperCase() || '?'
              )}
            </div>
            <div className="author-info">
              <div className="author-name">
                {post.author?.display_name || 'Anonymous'}
                <span style={{ marginLeft: '4px', fontSize: '0.75rem' }}>
                  {post.author?.role === 'teacher' ? '👨‍🏫' : '👨‍🎓'}
                </span>
              </div>
              <div className="post-date">{getTimeAgo()}</div>
            </div>
          </div>
          {isOwnPost && (
            <button className="delete-post-btn" onClick={handleDelete} title="Delete post">
              <Trash2 size={18} />
            </button>
          )}
        </div>

        <div className="post-content">
          <p>{formatContent(post.content)}</p>
          {shouldShowReadMore && (
            <button className="show-more-btn" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? 'Show less' : 'Read more'}
            </button>
          )}
        </div>

        {post.media_url && (
          <div className="post-image">
            {post.media_type === 'video' ? (
              <video src={post.media_url} controls className="post-video" />
            ) : (
              <img src={post.media_url} alt="Post media" />
            )}
          </div>
        )}

        <div className="post-actions">
          <button
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? '#EC4899' : 'none'} />
            <span>{post.likes_count > 0 ? post.likes_count : ''}</span>
          </button>

          <button className="action-btn comment-btn">
            <MessageCircle size={18} />
            <span>{post.comments_count > 0 ? post.comments_count : ''}</span>
          </button>

          <button className="action-btn share-btn" onClick={handleShare}>
            <Share2 size={18} />
            <span>{post.shares_count > 0 ? post.shares_count : ''}</span>
          </button>
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />
    </>
  );
};

export default Post;
