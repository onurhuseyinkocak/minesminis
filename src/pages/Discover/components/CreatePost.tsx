import React, { useState } from 'react';
import { auth } from '../../../config/firebase';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onSubmit: (content: string) => Promise<boolean>;
}

const CreatePost: React.FC<CreatePostProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const currentUser = auth.currentUser;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error('Paylaşım yapmak için giriş yapmalısınız');
      return;
    }

    if (!content.trim()) {
      toast.error('Paylaşım içeriği boş olamaz');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onSubmit(content.trim());
      if (success) {
        setContent('');
        toast.success('Paylaşımınız yayınlandı!');
      } else {
        toast.error('Paylaşımınız yayınlanamadı. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Paylaşım gönderilirken hata:', error);
      toast.error('Paylaşımınız yayınlanamadı. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit(e as any);
    }
  };

  if (!currentUser) {
    return (
      <div className="create-post-login-prompt">
        <div className="login-icon">🔒</div>
        <p>Paylaşım yapmak için giriş yapmalısınız</p>
      </div>
    );
  }

  return (
    <div className="create-post">
      <div className="create-post-header">
        <div className="user-avatar">
          {currentUser.email?.charAt(0).toUpperCase()}
        </div>
        <form onSubmit={handleSubmit} className="post-form">
          <div className="post-input-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`${currentUser.email?.split('@')[0]}, bugün neler paylaşmak istiyorsun?`}
              className="post-input"
              rows={3}
              maxLength={500}
            />
            <div className="post-actions-bar">
              <span className="char-count">
                {content.length}/500
              </span>
              <button 
                type="submit" 
                disabled={isSubmitting || !content.trim()}
                className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              >
                {isSubmitting ? (
                  <>
                    <div className="spinner"></div>
                    Paylaşılıyor...
                  </>
                ) : (
                  'Paylaş'
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