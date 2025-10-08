import React, { useRef, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import './Reel.css';

// Reel interface'ini tanımla
interface ReelType {
  id: string;
  videoUrl: string;
  caption: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  likes: string[];
  comments: any[];
  timestamp: any;
  views: string[];
  shares: number;
  music?: string;
}

// ReelProps interface'ini tanımla
interface ReelProps {
  reel: ReelType;
  isActive: boolean;
  onLike: () => void;
  onShare: () => void;
  onView: () => void;
  onProfileClick: () => void;
  onFollow: () => void;
  currentUser: User | null;
}

// Premium ikonlar
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill={filled ? "#ff0050" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59096 2.9987 4.19169 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7563 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39465C21.7563 5.72719 21.351 5.12076 20.84 4.61Z"/>
  </svg>
);

const CommentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z"/>
  </svg>
);

const ShareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12"/>
    <path d="M16 6L12 2L8 6"/>
    <path d="M12 2V15"/>
  </svg>
);

const Reel: React.FC<ReelProps> = ({
  reel,
  isActive,
  onLike,
  onShare,
  onView,
  onProfileClick,
  onFollow,
  currentUser
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setIsLiked(reel.likes.includes(currentUser.uid));
    }
  }, [reel.likes, currentUser]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
        onView();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive, onView]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike();
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
  };

  return (
    <div 
      className={`reel premium-reel ${isActive ? 'active' : ''}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="reel-video-container">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          loop
          muted={isMuted}
          onClick={togglePlay}
          className="reel-video"
          playsInline
        />
        
        {/* Premium Video Controls */}
        {(showControls || !isPlaying) && (
          <div className="premium-video-controls">
            <button className="premium-control-btn mute-btn" onClick={toggleMute}>
              {isMuted ? '🔇' : '🔊'}
            </button>
            {!isPlaying && (
              <button className="premium-control-btn play-btn" onClick={togglePlay}>
                ▶
              </button>
            )}
          </div>
        )}

        {/* Premium Progress Bar */}
        <div className="premium-video-progress">
          <div className="premium-progress-bar">
            <div className="premium-progress-fill" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      {/* Premium Right Sidebar - Actions */}
      <div className="premium-reel-sidebar">
        <div className="premium-action-group">
          <button 
            className={`premium-action-btn like-btn ${isLiked ? 'liked' : ''}`} 
            onClick={handleLike}
          >
            <HeartIcon filled={isLiked} />
            <span className="premium-count">{formatCount(reel.likes.length)}</span>
          </button>
          
          <button className="premium-action-btn comment-btn">
            <CommentIcon />
            <span className="premium-count">{formatCount(reel.comments.length)}</span>
          </button>
          
          <button className="premium-action-btn share-btn" onClick={onShare}>
            <ShareIcon />
            <span className="premium-count">{formatCount(reel.shares)}</span>
          </button>
        </div>

        <div className="premium-user-avatar" onClick={onProfileClick}>
          <img 
            src={reel.authorPhoto || '/default-avatar.png'} 
            alt={reel.authorName}
          />
        </div>
      </div>

      {/* Premium Bottom Content */}
      <div className="premium-reel-content">
        <div className="premium-author-info">
          <div className="author-avatar" onClick={onProfileClick}>
            <img 
              src={reel.authorPhoto || '/default-avatar.png'} 
              alt={reel.authorName}
            />
          </div>
          <span className="premium-author-name" onClick={onProfileClick}>
            @{reel.authorName}
          </span>
          {currentUser && currentUser.uid !== reel.authorId && (
            <button className="premium-follow-btn" onClick={onFollow}>
              Takip Et
            </button>
          )}
        </div>

        <div className="premium-reel-caption">
          {reel.caption}
        </div>

        <div className="premium-music-info">
          <span className="music-icon">🎵</span>
          <span className="premium-music-name">{reel.music || 'Original Sound'}</span>
        </div>
      </div>
    </div>
  );
};

export default Reel;