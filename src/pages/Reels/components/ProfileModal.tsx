import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import './ProfileModal.css';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  followers: string[];
  following: string[];
  postsCount: number;
  username?: string;
  bio?: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  currentUserId: string | undefined;
  onFollow: (userId: string) => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  currentUserId,
  onFollow
}) => {
  const [userReels, setUserReels] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && currentUserId) {
      setIsFollowing(user.followers?.includes(currentUserId) || false);
    }
  }, [user, currentUserId]);

  useEffect(() => {
    if (user && isOpen) {
      setLoading(true);
      const reelsQuery = query(
        collection(db, 'reels'),
        where('authorId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(reelsQuery, (snapshot) => {
        const reels = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserReels(reels);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const followersCount = user.followers?.length || 0;
  const followingCount = user.following?.length || 0;
  const postsCount = user.postsCount || userReels.length;

  const handleFollowClick = () => {
    onFollow(user.uid);
    setIsFollowing(!isFollowing);
  };

  const handleReelClick = async (reelId: string) => {
    // Reel detay sayfasına yönlendirme veya modal açma
    console.log('Reel clicked:', reelId);
  };

  return (
    <div className="profile-modal-overlay" onClick={onClose}>
      <div className="profile-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <div className="profile-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName} />
            ) : (
              <div className="avatar-placeholder">
                {user.displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
          
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{postsCount}</span>
              <span className="stat-label">Gönderi</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followersCount}</span>
              <span className="stat-label">Takipçi</span>
            </div>
            <div className="stat">
              <span className="stat-number">{followingCount}</span>
              <span className="stat-label">Takip</span>
            </div>
          </div>
        </div>

        <div className="profile-info">
          <h2>{user.displayName}</h2>
          {user.username && <p className="username">@{user.username}</p>}
          {user.bio && <p className="bio">{user.bio}</p>}
          {user.email && <p className="email">{user.email}</p>}
        </div>

        {currentUserId && currentUserId !== user.uid && (
          <button 
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollowClick}
          >
            {isFollowing ? 'Takip Ediliyor' : 'Takip Et'}
          </button>
        )}

        <div className="user-reels-section">
          <h3>Reels</h3>
          {loading ? (
            <div className="reels-loading">
              <div className="loading-spinner"></div>
            </div>
          ) : userReels.length > 0 ? (
            <div className="reels-grid">
              {userReels.map(reel => (
                <div 
                  key={reel.id} 
                  className="reel-thumbnail"
                  onClick={() => handleReelClick(reel.id)}
                >
                  <video src={reel.videoUrl} muted />
                  <div className="reel-overlay">
                    <div className="reel-stats">
                      <span className="likes">❤️ {reel.likes?.length || 0}</span>
                      <span className="comments">💬 {reel.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reels">
              <p>Henüz reel paylaşılmamış.</p>
            </div>
          )}
        </div>

        <button className="close-btn" onClick={onClose}>
          Kapat
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;