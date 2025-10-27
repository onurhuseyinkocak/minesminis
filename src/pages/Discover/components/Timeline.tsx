import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PostComponent from './Post';
import { usePosts } from './hooks/usePosts';

const Timeline: React.FC = () => {
  const { posts, isLoadingPosts, activeTab, setActiveTab, handleLike, handleShare, handleDeletePost } =
    usePosts();

  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`tab ${activeTab === 'for-you' ? 'tab-active' : ''}`}
          >
            For You
            {activeTab === 'for-you' && <div className="tab-indicator" />}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`}
          >
            Following
            {activeTab === 'following' && <div className="tab-indicator" />}
          </button>
        </div>
      </div>

      <div className="posts-container">
        <AnimatePresence>
          {isLoadingPosts ? (
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="post-skeleton">
                <div className="skeleton-avatar" />
                <div className="skeleton-content">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line medium" />
                  <div className="skeleton-line long" />
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="empty-state"
            >
              <div className="empty-icon">📝</div>
              <h3>No posts yet</h3>
              <p>Be the first to share something!</p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <PostComponent
                key={post.id}
                post={post}
                onLike={handleLike}
                onShare={handleShare}
                onDeletePost={handleDeletePost}
                index={index}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timeline;
