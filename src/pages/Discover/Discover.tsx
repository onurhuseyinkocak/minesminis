import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { postsService } from '../../services/postsService';
import { Heart, MessageCircle, Bookmark, Play } from 'lucide-react';
import './Discover.css';

interface Post {
  id: string;
  author_id: string;
  content: string;
  media_url: string | null;
  media_type: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  users?: {
    display_name: string;
    avatar_url: string | null;
  };
}

const Discover: React.FC = () => {
  const { user, userProfile } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const data = await postsService.getAllPosts();
      setPosts(data.filter((p: Post) => p.media_url));
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="instagram-explore">
        <div className="explore-empty">
          <h2>Sign in to explore</h2>
          <p>Discover amazing content from the community</p>
        </div>
      </div>
    );
  }

  return (
    <div className="instagram-explore">
      <div className="explore-container">
        <div className="explore-grid">
          {loading ? (
            Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="explore-item skeleton">
                <div className="skeleton-shimmer"></div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                key={post.id}
                className={`explore-item ${index % 10 === 0 ? 'explore-item-large' : ''}`}
                onClick={() => setSelectedPost(post)}
              >
                {post.media_type === 'video' ? (
                  <>
                    <video
                      src={post.media_url!}
                      className="explore-media"
                      muted
                      playsInline
                    />
                    <div className="video-indicator">
                      <Play size={20} fill="white" />
                    </div>
                  </>
                ) : (
                  <img
                    src={post.media_url!}
                    alt={post.content}
                    className="explore-media"
                  />
                )}
                <div className="explore-overlay">
                  <div className="explore-stats">
                    <span className="stat-item">
                      <Heart size={20} fill="white" />
                      {post.likes_count}
                    </span>
                    <span className="stat-item">
                      <MessageCircle size={20} fill="white" />
                      {post.comments_count}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="explore-empty-grid">
              <p>No posts yet</p>
            </div>
          )}
        </div>
      </div>

      {selectedPost && (
        <div className="post-modal" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedPost(null)}>
              ✕
            </button>
            <div className="modal-layout">
              <div className="modal-media">
                {selectedPost.media_type === 'video' ? (
                  <video
                    src={selectedPost.media_url!}
                    controls
                    autoPlay
                    className="modal-video"
                  />
                ) : (
                  <img
                    src={selectedPost.media_url!}
                    alt={selectedPost.content}
                    className="modal-image"
                  />
                )}
              </div>
              <div className="modal-sidebar">
                <div className="modal-header">
                  <div className="modal-user">
                    <div className="modal-avatar">
                      {selectedPost.users?.avatar_url ? (
                        <img src={selectedPost.users.avatar_url} alt="" />
                      ) : (
                        selectedPost.users?.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="modal-username">
                      {selectedPost.users?.display_name}
                    </span>
                  </div>
                </div>
                <div className="modal-caption">
                  <div className="caption-user">
                    <div className="caption-avatar">
                      {selectedPost.users?.avatar_url ? (
                        <img src={selectedPost.users.avatar_url} alt="" />
                      ) : (
                        selectedPost.users?.display_name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <span className="caption-username">
                      {selectedPost.users?.display_name}
                    </span>
                  </div>
                  <p className="caption-text">{selectedPost.content}</p>
                </div>
                <div className="modal-actions">
                  <div className="action-buttons">
                    <button className="action-btn">
                      <Heart size={24} />
                    </button>
                    <button className="action-btn">
                      <MessageCircle size={24} />
                    </button>
                  </div>
                  <button className="action-btn">
                    <Bookmark size={24} />
                  </button>
                </div>
                <div className="modal-likes">
                  <strong>{selectedPost.likes_count} likes</strong>
                </div>
                <div className="modal-time">
                  {new Date(selectedPost.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;
