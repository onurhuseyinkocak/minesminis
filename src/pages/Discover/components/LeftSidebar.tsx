import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/userService';

const LeftSidebar: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'following' | 'explore' | 'reels'>('profile');
  const [following, setFollowing] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [currentReelIndex, setCurrentReelIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const sampleReels = [
    { id: 1, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', title: '🎨 Sanat Etkinliği', user: 'Öğretmen Ayşe' },
    { id: 2, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', title: '📚 İngilizce Ders', user: 'Teacher John' },
    { id: 3, videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: '🎵 Şarkı Öğrenelim', user: 'Müzik Öğretmeni' },
  ];

  useEffect(() => {
    if (activeTab === 'following' && userProfile) {
      loadFollowing();
    } else if (activeTab === 'explore') {
      loadLeaderboard();
    }
  }, [activeTab, userProfile]);

  const loadFollowing = async () => {
    if (!userProfile) return;
    setLoading(true);
    try {
      const followingData = await userService.getFollowing(userProfile.id);
      setFollowing(followingData);
    } catch (error) {
      console.error('Error loading following:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async () => {
    setLoading(true);
    try {
      const leaderboardData = await userService.getLeaderboard(10);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReelSwipe = (direction: 'up' | 'down') => {
    if (direction === 'down' && currentReelIndex < sampleReels.length - 1) {
      setCurrentReelIndex(prev => prev + 1);
    } else if (direction === 'up' && currentReelIndex > 0) {
      setCurrentReelIndex(prev => prev - 1);
    }
  };

  const renderProfileTab = () => {
    if (!userProfile) return null;

    return (
      <div className="sidebar-content">
        <div className="profile-card">
          <div className="profile-header-bg"></div>
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              {userProfile.avatar_url ? (
                <img src={userProfile.avatar_url} alt={userProfile.display_name} />
              ) : (
                userProfile.display_name.charAt(0).toUpperCase()
              )}
            </div>
          </div>
          <div className="profile-details">
            <h3 className="profile-name">{userProfile.display_name}</h3>
            <p className="profile-role">{userProfile.role === 'teacher' ? '👨‍🏫 Teacher' : '👨‍🎓 Student'}</p>
            {userProfile.bio && <p className="profile-bio">{userProfile.bio}</p>}
            {userProfile.grade && (
              <div className="profile-grade">
                <span className="grade-badge">Grade {userProfile.grade}</span>
              </div>
            )}
          </div>
          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-value">{userProfile.points || 0}</div>
              <div className="stat-label">Points</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.level || 1}</div>
              <div className="stat-label">Level</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">{userProfile.streak_days || 0}</div>
              <div className="stat-label">Streak</div>
            </div>
          </div>
          {userProfile.subjects && userProfile.subjects.length > 0 && (
            <div className="profile-subjects">
              <h4>Subjects</h4>
              <div className="subjects-list">
                {userProfile.subjects.map((subject, idx) => (
                  <span key={idx} className="subject-tag">{subject}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderFollowingTab = () => {
    if (loading) {
      return (
        <div className="sidebar-content">
          <div className="loading-state">Loading...</div>
        </div>
      );
    }

    if (following.length === 0) {
      return (
        <div className="sidebar-content">
          <div className="empty-sidebar-state">
            <span style={{ fontSize: '3rem' }}>👥</span>
            <p>You're not following anyone yet</p>
          </div>
        </div>
      );
    }

    return (
      <div className="sidebar-content">
        <div className="following-list">
          {following.map((follow) => {
            const followedUser = follow.users;
            if (!followedUser) return null;
            return (
              <div key={follow.following_id} className="user-item">
                <div className="user-item-avatar">
                  {followedUser.avatar_url ? (
                    <img src={followedUser.avatar_url} alt={followedUser.display_name} />
                  ) : (
                    followedUser.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-item-info">
                  <div className="user-item-name">{followedUser.display_name}</div>
                  <div className="user-item-role">{followedUser.role}</div>
                </div>
                {followedUser.is_online && <div className="online-indicator"></div>}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderExploreTab = () => {
    if (loading) {
      return (
        <div className="sidebar-content">
          <div className="loading-state">Loading...</div>
        </div>
      );
    }

    return (
      <div className="sidebar-content">
        <div className="explore-section">
          <div className="section-header">
            <span style={{ fontSize: '1.5rem' }}>📈</span>
            <h4>Top Learners</h4>
          </div>
          <div className="leaderboard-list">
            {leaderboard.map((user, idx) => (
              <div key={user.id} className="leaderboard-item">
                <div className="leaderboard-rank">#{idx + 1}</div>
                <div className="user-item-avatar small">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name} />
                  ) : (
                    user.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="user-item-info">
                  <div className="user-item-name">{user.display_name}</div>
                  <div className="user-item-points">{user.points} pts</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderReelsTab = () => {
    const currentReel = sampleReels[currentReelIndex];

    return (
      <div className="sidebar-content reels-container">
        <div className="reels-header">
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <h4>Reels</h4>
        </div>
        <div className="reels-player">
          <video
            key={currentReel.id}
            src={currentReel.videoUrl}
            className="reel-video"
            autoPlay
            loop
            muted
            playsInline
          />
          <div className="reel-overlay">
            <div className="reel-info">
              <h5>{currentReel.title}</h5>
              <p>👤 {currentReel.user}</p>
            </div>
            <div className="reel-actions">
              <button className="reel-action-btn">❤️</button>
              <button className="reel-action-btn">💬</button>
              <button className="reel-action-btn">↗️</button>
            </div>
          </div>
          <div className="reel-navigation">
            <button
              onClick={() => handleReelSwipe('up')}
              disabled={currentReelIndex === 0}
              className="reel-nav-btn reel-nav-up"
              title="Previous"
            >
              ⬆️
            </button>
            <div className="reel-indicator">
              {currentReelIndex + 1} / {sampleReels.length}
            </div>
            <button
              onClick={() => handleReelSwipe('down')}
              disabled={currentReelIndex === sampleReels.length - 1}
              className="reel-nav-btn reel-nav-down"
              title="Next"
            >
              ⬇️
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="discover-left-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span style={{ fontSize: '1.25rem' }}>👤</span>
          <span>Profile</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <span style={{ fontSize: '1.25rem' }}>👥</span>
          <span>Following</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'reels' ? 'active' : ''}`}
          onClick={() => setActiveTab('reels')}
        >
          <span style={{ fontSize: '1.25rem' }}>🎬</span>
          <span>Reels</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <span style={{ fontSize: '1.25rem' }}>🔍</span>
          <span>Explore</span>
        </button>
      </div>
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'following' && renderFollowingTab()}
      {activeTab === 'reels' && renderReelsTab()}
      {activeTab === 'explore' && renderExploreTab()}
    </div>
  );
};

export default LeftSidebar;
