import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Post as PostType } from '../../../services/postsService';
import CreatePost from './CreatePost';
import PostComponent from './Post';
import { User } from 'firebase/auth';

interface TimelineProps {
  posts: PostType[];
  isLoadingPosts: boolean;
  activeTab: 'for-you' | 'following';
  setActiveTab: (tab: 'for-you' | 'following') => void;
  onSubmitPost: (content: string) => Promise<boolean>;
  onLike: (postId: string) => void;
  onRetweet: (postId: string) => void;
  onShare: (post: PostType) => void;
  onDeletePost: (postId: string) => void;
  currentUser: User | null;
  retweetingPosts: Set<string>;
}

const Timeline: React.FC<TimelineProps> = ({
  posts,
  isLoadingPosts,
  activeTab,
  setActiveTab,
  onSubmitPost,
  onLike,
  onRetweet,
  onShare,
  onDeletePost,
  currentUser,
  retweetingPosts
}) => {
  return (
    <div className="timeline">
      <div className="timeline-header">
        <div className="tab-container">
          <button
            onClick={() => setActiveTab('for-you')}
            className={`tab ${activeTab === 'for-you' ? 'tab-active' : ''}`}
          >
            Sana Özel
            {activeTab === 'for-you' && <div className="tab-indicator" />}
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`}
          >
            Takip Edilenler
            {activeTab === 'following' && <div className="tab-indicator" />}
          </button>
        </div>
      </div>

      <CreatePost onSubmit={onSubmitPost} />

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
              <h3>Henüz paylaşım yok</h3>
              <p>İlk paylaşımı yaparak başlayın!</p>
            </motion.div>
          ) : (
            posts.map((post, index) => (
              <PostComponent
                key={post.id}
                post={post}
                onLike={onLike}
                onRetweet={onRetweet}
                onShare={onShare}
                onDeletePost={onDeletePost}
                index={index}
                currentUser={currentUser}
                isRetweeting={retweetingPosts.has(post.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Timeline;