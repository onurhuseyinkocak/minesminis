import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post as PostType } from '../../../services/postsService';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import DeleteConfirmationModal from '../../../components/DeleteConfirmationModal';
import { commentsService, Comment } from '../../../services/commentsService';
import toast from 'react-hot-toast';
import './Comments.css';

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
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    loadComments();
  }, []);

  useEffect(() => {
    if (showCommentsModal) {
      loadComments();
    }
  }, [showCommentsModal]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const data = await commentsService.getCommentsByPostId(post.id);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (newComment.length > 500) {
      toast.error('Comment is too long (max 500 characters)');
      return;
    }

    setSubmittingComment(true);
    try {
      const comment = await commentsService.createComment(post.id, newComment);
      setComments([...comments, comment]);
      setNewComment('');
      toast.success('Comment added!');
      post.comments_count = (post.comments_count || 0) + 1;
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await commentsService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      post.comments_count = Math.max((post.comments_count || 0) - 1, 0);
      toast.success('Comment deleted!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

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

    if (!user) {
      toast.error('Please sign in to share posts');
      return;
    }
    onShare(post);
  };

  const handleCommentClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please sign in to comment');
      return;
    }
    setShowCommentsModal(true);
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
              🗑️
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
            <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
            <span>{post.likes_count > 0 ? post.likes_count : ''}</span>
          </button>

          <button className="action-btn comment-btn" onClick={handleCommentClick}>
            <span className="action-icon">💬</span>
            <span>{post.comments_count > 0 ? post.comments_count : ''}</span>
          </button>

          <button className="action-btn share-btn" onClick={handleShare}>
            <span className="action-icon">↗️</span>
            <span>{post.shares_count > 0 ? post.shares_count : ''}</span>
          </button>
        </div>

        {comments.length > 0 && (
          <div className="post-comments-preview">
            {(showAllComments ? comments : comments.slice(0, 2)).map((comment) => (
              <div key={comment.id} className="comment-preview-item">
                <div className="comment-preview-avatar">
                  {comment.users?.avatar_url ? (
                    <img src={comment.users.avatar_url} alt={comment.users.display_name} />
                  ) : (
                    comment.users?.display_name?.charAt(0).toUpperCase() || '?'
                  )}
                </div>
                <div className="comment-preview-content">
                  <span className="comment-preview-author">
                    {comment.users?.display_name || 'Anonymous'}
                  </span>
                  <span className="comment-preview-text">{comment.content}</span>
                </div>
              </div>
            ))}
            {comments.length > 2 && !showAllComments && (
              <button
                className="show-more-comments-btn"
                onClick={() => setShowAllComments(true)}
              >
                View {comments.length - 2} more comment{comments.length - 2 > 1 ? 's' : ''}
              </button>
            )}
            {showAllComments && comments.length > 2 && (
              <button
                className="show-more-comments-btn"
                onClick={() => setShowAllComments(false)}
              >
                Show less
              </button>
            )}
          </div>
        )}
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
      />

      <AnimatePresence>
        {showCommentsModal && (
          <motion.div
            className="comments-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCommentsModal(false)}
          >
            <motion.div
              className="comments-modal"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="comments-modal-header">
                <h3>💬 Comments ({comments.length})</h3>
                <button
                  className="comments-modal-close"
                  onClick={() => setShowCommentsModal(false)}
                >
                  ✖️
                </button>
              </div>

              <div className="comments-list">
                {loadingComments ? (
                  <div className="comments-loading">
                    <div className="spinner-large"></div>
                    <p>Loading comments...</p>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="comments-empty">
                    <div className="empty-icon">💭</div>
                    <p>No comments yet</p>
                    <p className="hint">Be the first to comment!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-avatar">
                        {comment.users?.avatar_url ? (
                          <img src={comment.users.avatar_url} alt={comment.users.display_name} />
                        ) : (
                          comment.users?.display_name?.charAt(0).toUpperCase() || '?'
                        )}
                      </div>
                      <div className="comment-content-wrapper">
                        <div className="comment-header">
                          <span className="comment-author">
                            {comment.users?.display_name || 'Anonymous'}
                          </span>
                          <span className="comment-date">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="comment-text">{comment.content}</p>
                        {user?.id === comment.author_id && (
                          <button
                            className="comment-delete-btn"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="comments-input-section">
                <div className="comment-input-wrapper">
                  <div className="comment-input-avatar">
                    {userProfile?.avatar_url ? (
                      <img src={userProfile.avatar_url} alt={userProfile.display_name} />
                    ) : (
                      userProfile?.display_name?.charAt(0).toUpperCase() || '👤'
                    )}
                  </div>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="comment-textarea"
                    rows={2}
                    maxLength={500}
                    disabled={submittingComment}
                  />
                </div>
                <div className="comment-input-footer">
                  <span className="comment-char-count">
                    {newComment.length}/500
                  </span>
                  <button
                    className="comment-submit-btn"
                    onClick={handleAddComment}
                    disabled={submittingComment || !newComment.trim()}
                  >
                    {submittingComment ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Post;
