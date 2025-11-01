import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useParams } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { Settings, Grid, Bookmark, Heart, MessageCircle, X } from 'lucide-react';
import InstagramSidebar from '../components/InstagramSidebar';
import './Profile.css';

interface UserProfile {
  id: string;
  display_name: string;
  bio: string;
  avatar_url: string | null;
  website: string;
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface Post {
  id: string;
  media_url: string;
  likes_count: number;
  comments_count: number;
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ display_name: '', bio: '', website: '' });
  const [uploading, setUploading] = useState(false);

  const targetUserId = userId || user?.id;
  const isOwnProfile = !userId || userId === user?.id;

  useEffect(() => {
    if (targetUserId) {
      loadProfile();
      loadPosts();
      if (!isOwnProfile) checkFollowStatus();
    }
  }, [targetUserId]);

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, display_name, bio, avatar_url, website, followers_count, following_count, posts_count')
      .eq('id', targetUserId)
      .single();

    if (!error && data) {
      setProfile(data);
      setEditData({
        display_name: data.display_name,
        bio: data.bio || '',
        website: data.website || ''
      });
    }
  };

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, media_url, likes_count, comments_count')
      .eq('author_id', targetUserId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !targetUserId) return;
    const { data } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', user.id)
      .eq('following_id', targetUserId)
      .single();

    setIsFollowing(!!data);
  };

  const handleFollow = async () => {
    if (!user || !targetUserId) return;

    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId);
      setIsFollowing(false);
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: user.id, following_id: targetUserId });
      setIsFollowing(true);
    }
    loadProfile();
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      await supabase
        .from('users')
        .update({ avatar_url: base64 })
        .eq('id', user.id);
      loadProfile();
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    await supabase
      .from('users')
      .update({
        display_name: editData.display_name,
        bio: editData.bio,
        website: editData.website
      })
      .eq('id', user.id);

    setShowEditModal(false);
    loadProfile();
  };

  if (!profile) {
    return (
      <>
        <InstagramSidebar />
        <div className="profile-container">
          <div className="profile-loading">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <InstagramSidebar />
      <div className="profile-container">
        <div className="profile-content">
          <header className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-wrapper">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt={profile.display_name} />
                ) : (
                  <div className="avatar-placeholder">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {isOwnProfile && (
                <label className="avatar-upload-btn">
                  {uploading ? 'Uploading...' : 'Change Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    hidden
                    disabled={uploading}
                  />
                </label>
              )}
            </div>

            <div className="profile-info-section">
              <div className="profile-top">
                <h1 className="profile-username">{profile.display_name}</h1>
                {isOwnProfile ? (
                  <>
                    <button
                      className="profile-edit-btn"
                      onClick={() => setShowEditModal(true)}
                    >
                      Edit profile
                    </button>
                    <button className="profile-settings-btn">
                      <Settings size={24} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`profile-follow-btn ${isFollowing ? 'following' : ''}`}
                      onClick={handleFollow}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="profile-message-btn">Message</button>
                  </>
                )}
              </div>

              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.followers_count}</span>
                  <span className="stat-label">followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.following_count}</span>
                  <span className="stat-label">following</span>
                </div>
              </div>

              <div className="profile-bio">
                <p>{profile.bio}</p>
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="profile-website">
                    {profile.website}
                  </a>
                )}
              </div>
            </div>
          </header>

          <div className="profile-tabs">
            <button className="tab active">
              <Grid size={12} />
              POSTS
            </button>
            <button className="tab">
              <Bookmark size={12} />
              SAVED
            </button>
          </div>

          <div className="profile-posts-grid">
            {posts.map(post => (
              <div key={post.id} className="grid-post">
                <img src={post.media_url} alt="" />
                <div className="grid-post-overlay">
                  <div className="overlay-stat">
                    <Heart size={20} fill="white" />
                    <span>{post.likes_count}</span>
                  </div>
                  <div className="overlay-stat">
                    <MessageCircle size={20} fill="white" />
                    <span>{post.comments_count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="no-posts">
              <div className="no-posts-icon">📷</div>
              <h2>No Posts Yet</h2>
              {isOwnProfile && <p>Start sharing your moments!</p>}
            </div>
          )}
        </div>
      </div>

      {showEditModal && (
        <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2>Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="edit-modal-body">
              <div className="edit-field">
                <label>Name</label>
                <input
                  type="text"
                  value={editData.display_name}
                  onChange={(e) => setEditData({ ...editData, display_name: e.target.value })}
                />
              </div>
              <div className="edit-field">
                <label>Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="edit-field">
                <label>Website</label>
                <input
                  type="text"
                  value={editData.website}
                  onChange={(e) => setEditData({ ...editData, website: e.target.value })}
                  placeholder="https://example.com"
                />
              </div>
            </div>
            <div className="edit-modal-footer">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveProfile}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
