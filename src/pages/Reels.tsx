import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Volume2, VolumeX } from 'lucide-react';
import InstagramSidebar from '../components/InstagramSidebar';
import './Reels.css';

interface Reel {
  id: string;
  author_id: string;
  content: string;
  media_url: string;
  music_name?: string;
  music_artist?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  users: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
  is_liked?: boolean;
  is_saved?: boolean;
}

const Reels: React.FC = () => {
  const { user } = useAuth();
  const [reels, setReels] = useState<Reel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [muted, setMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    loadReels();
  }, []);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video) {
        if (index === currentIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const loadReels = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_author_id_fkey(id, display_name, avatar_url)
      `)
      .eq('is_reel', true)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setReels(data as any);
    }
  };

  const handleLike = async (reelId: string, isLiked: boolean) => {
    if (!user) return;

    if (isLiked) {
      await supabase.from('post_likes').delete().eq('post_id', reelId).eq('user_id', user.id);
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, is_liked: false, likes_count: r.likes_count - 1 } : r));
    } else {
      await supabase.from('post_likes').insert({ post_id: reelId, user_id: user.id });
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, is_liked: true, likes_count: r.likes_count + 1 } : r));
    }
  };

  const handleSave = async (reelId: string, isSaved: boolean) => {
    if (!user) return;

    if (isSaved) {
      await supabase.from('saved_posts').delete().eq('post_id', reelId).eq('user_id', user.id);
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, is_saved: false } : r));
    } else {
      await supabase.from('saved_posts').insert({ post_id: reelId, user_id: user.id });
      setReels(prev => prev.map(r => r.id === reelId ? { ...r, is_saved: true } : r));
    }
  };

  const handleScroll = (e: React.WheelEvent) => {
    if (e.deltaY > 0 && currentIndex < reels.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (e.deltaY < 0 && currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (!user) {
    return (
      <div className="reels-container">
        <p>Please login to view Reels</p>
      </div>
    );
  }

  if (reels.length === 0) {
    return (
      <>
        <InstagramSidebar />
        <div className="reels-container">
          <div className="reels-empty">
            <h2>No Reels Yet</h2>
            <p>Start creating reels to see them here!</p>
          </div>
        </div>
      </>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <>
      <InstagramSidebar />
      <div className="reels-container" onWheel={handleScroll}>
        <div className="reels-viewer">
          <div className="reel-video-container">
            <video
              ref={el => videoRefs.current[currentIndex] = el}
              src={currentReel.media_url}
              loop
              muted={muted}
              playsInline
              className="reel-video"
            />

            <button
              className="mute-btn"
              onClick={() => setMuted(!muted)}
            >
              {muted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>

            <div className="reel-info">
              <div className="reel-author">
                <div className="author-avatar">
                  {currentReel.users.avatar_url ? (
                    <img src={currentReel.users.avatar_url} alt="" />
                  ) : (
                    currentReel.users.display_name.charAt(0).toUpperCase()
                  )}
                </div>
                <span className="author-name">{currentReel.users.display_name}</span>
                <button className="follow-btn-small">Follow</button>
              </div>

              <p className="reel-caption">{currentReel.content}</p>

              {(currentReel.music_name || currentReel.music_artist) && (
                <div className="reel-music">
                  🎵 {currentReel.music_name || 'Original Audio'}
                  {currentReel.music_artist && ` • ${currentReel.music_artist}`}
                </div>
              )}
            </div>

            <div className="reel-actions">
              <button
                className="action-btn-reel"
                onClick={() => handleLike(currentReel.id, currentReel.is_liked || false)}
              >
                <Heart
                  size={28}
                  fill={currentReel.is_liked ? '#FF3040' : 'none'}
                  color={currentReel.is_liked ? '#FF3040' : 'white'}
                />
                <span>{currentReel.likes_count}</span>
              </button>

              <button className="action-btn-reel">
                <MessageCircle size={28} />
                <span>{currentReel.comments_count}</span>
              </button>

              <button className="action-btn-reel">
                <Send size={28} />
                <span>{currentReel.shares_count}</span>
              </button>

              <button
                className="action-btn-reel"
                onClick={() => handleSave(currentReel.id, currentReel.is_saved || false)}
              >
                <Bookmark
                  size={28}
                  fill={currentReel.is_saved ? 'white' : 'none'}
                />
              </button>

              <button className="action-btn-reel">
                <MoreHorizontal size={28} />
              </button>

              <div className="reel-music-icon">
                <img src={currentReel.users.avatar_url || ''} alt="" />
              </div>
            </div>
          </div>

          {currentIndex > 0 && (
            <button
              className="nav-arrow nav-up"
              onClick={() => setCurrentIndex(prev => prev - 1)}
            >
              ↑
            </button>
          )}

          {currentIndex < reels.length - 1 && (
            <button
              className="nav-arrow nav-down"
              onClick={() => setCurrentIndex(prev => prev + 1)}
            >
              ↓
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Reels;
