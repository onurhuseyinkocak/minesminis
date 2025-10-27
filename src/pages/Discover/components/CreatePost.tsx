import React, { useState, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { postsService } from '../../../services/postsService';
import { uploadService } from '../../../services/uploadService';
import { Image, Video, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreatePostProps {
  onPostCreated?: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, userProfile } = useAuth();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = uploadService.validateFile(file);
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file');
      return;
    }

    setUploadedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !userProfile) {
      toast.error('Please sign in to create a post');
      return;
    }

    if (!content.trim() && !uploadedFile) {
      toast.error('Please add content or media to your post');
      return;
    }

    setIsSubmitting(true);
    try {
      let mediaUrl: string | undefined;
      let mediaType: string | undefined;

      if (uploadedFile) {
        setUploadProgress(50);
        mediaUrl = await uploadService.uploadFile(uploadedFile, 'posts');
        mediaType = uploadService.getMediaType(uploadedFile) || undefined;
        setUploadProgress(100);
      }

      await postsService.createPost({
        authorId: user.id,
        content: content.trim(),
        mediaUrl,
        mediaType,
      });

      setContent('');
      setUploadedFile(null);
      setPreviewUrl(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      toast.success('Post published successfully!');
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
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
            {previewUrl && uploadedFile && (
              <div className="media-preview">
                {uploadService.getMediaType(uploadedFile) === 'video' ? (
                  <video src={previewUrl} controls className="preview-video" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                )}
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="remove-media-btn"
                  aria-label="Remove media"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="upload-progress">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            <div className="post-actions-bar">
              <div className="media-buttons">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  id="media-upload"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="media-btn"
                  disabled={isSubmitting || !!uploadedFile}
                  title="Add photo or video"
                >
                  <Image size={20} />
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="media-btn"
                  disabled={isSubmitting || !!uploadedFile}
                  title="Add video"
                >
                  <Video size={20} />
                </button>
              </div>
              <div className="right-actions">
                <span className="char-count">{content.length}/500</span>
                <button
                  type="submit"
                  disabled={isSubmitting || (!content.trim() && !uploadedFile)}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
