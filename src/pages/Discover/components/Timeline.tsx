import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import Post from './Post';
import usePosts from './hooks/usePosts';

const Timeline: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const { posts, loading, handleLike, handleShare, handleDelete } = usePosts(user?.id);

  if (loading) {
    return (
      <div className="timeline">
        <div className="timeline-header">
          <div className="tab-container">
            <button className={`tab ${activeTab === 'for-you' ? 'tab-active' : ''}`}>
              For You
              {activeTab === 'for-you' && <div className="tab-indicator" />}
            </button>
            <button className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`}>
              Following
              {activeTab === 'following' && <div className="tab-indicator" />}
            </button>
          </div>
        </div>
        <div className="posts-container">
          {[1, 2, 3].map((i) => (
            <div key={i} className="post-skeleton">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton-line short"></div>
                <div className="skeleton-line long"></div>
                <div className="skeleton-line medium"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="timeline">
        <div className="timeline-header">
          <div className="tab-container">
            <button
              className={`tab ${activeTab === 'for-you' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('for-you')}
            >
              For You
              {activeTab === 'for-you' && <div className="tab-indicator" />}
            </button>
            <button
              className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              Following
              {activeTab === 'following' && <div className="tab-indicator" />}
            </button>
          </div>
        </div>
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="tab-container">
          <button
            className={`tab ${activeTab === 'for-you' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('for-you')}
          >
            For You
            {activeTab === 'for-you' && <div className="tab-indicator" />}
          </button>
          <button
            className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('following')}
          >
            Following
            {activeTab === 'following' && <div className="tab-indicator" />}
          </button>
        </div>
      </div>
      <div className="posts-container">
        {posts.map((post, index) => (
          <Post
            key={post.id}
            post={post}
            onLike={handleLike}
            onShare={handleShare}
            onDeletePost={handleDelete}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Timeline;
