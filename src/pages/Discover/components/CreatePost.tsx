import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { postsService } from '../../../services/postsService';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, userProfile } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) {
      toast.error('Please sign in to create a post');
      return;
    }

    if (!content.trim()) {
      toast.error('Post content cannot be empty');
      return;
    }

    setIsSubmitting(true);
    try {
      await postsService.createPost({
        authorId: user.uid,
        content: content.trim(),
      });

      setContent('');
      toast.success('Post published successfully!');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="create-post-login-prompt">
        <div className="login-icon">🔒</div>
        <p>Please sign in to create posts</p>
      </div>
    );
  }

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-avatar">
          {userProfile.avatar_url ? (
            <img src={userProfile.avatar_url} alt={userProfile.display_name} />
          ) : (
            userProfile.display_name.charAt(0).toUpperCase()
          )}
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-input-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`What's on your mind, ${userProfile.display_name}?`}
              className="post-input"
              rows={3}
              maxLength={500}
            />
            <div className="post-actions-bar">
              <span className="char-count">{content.length}/500</span>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Publishing...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
