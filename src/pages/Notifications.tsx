import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react';
import InstagramSidebar from '../components/InstagramSidebar';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'story_view';
  is_read: boolean;
  created_at: string;
  actor: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  post?: {
    id: string;
    media_url: string | null;
  };
}

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadNotifications();
      const subscription = supabase
        .channel('notifications')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        }, () => {
          loadNotifications();
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        actor:actor_id(id, display_name, avatar_url),
        post:post_id(id, media_url)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data as any);
    }
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
    );
  };

  const markAllAsRead = async () => {
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id);

    loadNotifications();
  };

  const getNotificationText = (notif: Notification) => {
    switch (notif.type) {
      case 'like':
        return 'liked your post.';
      case 'comment':
        return 'commented on your post.';
      case 'follow':
        return 'started following you.';
      case 'mention':
        return 'mentioned you in a comment.';
      case 'story_view':
        return 'viewed your story.';
      default:
        return '';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} fill="#FF3040" color="#FF3040" />;
      case 'comment':
        return <MessageCircle size={20} />;
      case 'follow':
        return <UserPlus size={20} />;
      case 'mention':
        return <AtSign size={20} />;
      default:
        return <Heart size={20} />;
    }
  };

  const handleNotificationClick = (notif: Notification) => {
    markAsRead(notif.id);
    if (notif.post?.id) {
      navigate(`/post/${notif.post.id}`);
    } else if (notif.type === 'follow') {
      navigate(`/profile/${notif.actor.id}`);
    }
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.is_read)
    : notifications;

  if (!user) {
    return <div>Please login</div>;
  }

  return (
    <>
      <InstagramSidebar />
      <div className="notifications-container">
        <div className="notifications-header">
          <h2>Notifications</h2>
          <div className="notifications-actions">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>
            {notifications.some(n => !n.is_read) && (
              <button className="mark-all-btn" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notif => (
              <div
                key={notif.id}
                className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="notif-avatar-wrapper">
                  <div className="notif-avatar">
                    {notif.actor?.avatar_url ? (
                      <img src={notif.actor.avatar_url} alt="" />
                    ) : (
                      notif.actor?.display_name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="notif-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                </div>

                <div className="notif-content">
                  <div className="notif-text">
                    <strong>{notif.actor?.display_name}</strong>{' '}
                    {getNotificationText(notif)}
                  </div>
                  <div className="notif-time">
                    {new Date(notif.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>

                {notif.post?.media_url && (
                  <div className="notif-thumbnail">
                    <img src={notif.post.media_url} alt="" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="empty-notifications">
              <Heart size={64} strokeWidth={1} />
              <h3>No notifications yet</h3>
              <p>When someone likes or comments on your posts, you'll see it here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
