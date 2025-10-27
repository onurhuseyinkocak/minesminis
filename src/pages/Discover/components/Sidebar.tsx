import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { userService } from '../../../services/userService';
import { User, Users, Compass, TrendingUp } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'following' | 'explore'>('profile');
  const [following, setFollowing] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
            <p className="profile-role">{userProfile.role === 'teacher' ? 'Teacher' : 'Student'}</p>
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
            <Users size={48} />
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
            <TrendingUp size={20} />
            <h4>Top Learners</h4>
          </div>
          <div className="leaderboard-list">
            {leaderboard.map((user, idx) => (
              <div key={user.id} className="leaderboard-item">
                <div className="leaderboard-rank">{idx + 1}</div>
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

  return (
    <div className="discover-sidebar">
      <div className="sidebar-tabs">
        <button
          className={`sidebar-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <User size={20} />
          <span>Profile</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          <Users size={20} />
          <span>Following</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === 'explore' ? 'active' : ''}`}
          onClick={() => setActiveTab('explore')}
        >
          <Compass size={20} />
          <span>Explore</span>
        </button>
      </div>
      {activeTab === 'profile' && renderProfileTab()}
      {activeTab === 'following' && renderFollowingTab()}
      {activeTab === 'explore' && renderExploreTab()}
    </div>
  );
};

export default Sidebar;
