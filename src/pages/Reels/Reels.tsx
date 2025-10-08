import React, { useState, useEffect, useRef, useCallback } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, increment, getDoc, limit } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Reel from './components/Reel';
import UploadReel from './components/UploadReel';
import ProfileModal from './components/ProfileModal';
import './Reels.css';

// Premium ikonlar
const CameraIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23 7V17C23 17.5304 22.7893 18.0391 22.4142 18.4142C22.0391 18.7893 21.5304 19 21 19H3C2.46957 19 1.96086 18.7893 1.58579 18.4142C1.21071 18.0391 1 17.5304 1 17V7C1 6.46957 1.21071 5.96086 1.58579 5.58579C1.96086 5.21071 2.46957 5 3 5H7L9 3H15L17 5H21C21.5304 5 22.0391 5.21071 22.4142 5.58579C22.7893 5.96086 23 6.46957 23 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

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

const Reels: React.FC = () => {
  const [reels, setReels] = useState<ReelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribeAuth();
  }, []);

  // Reels data listener - Premium: Sadece son 50 reel'i getir
  useEffect(() => {
    const reelsQuery = query(
      collection(db, 'reels'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribeReels = onSnapshot(reelsQuery, (snapshot) => {
      const reelsData: ReelType[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        reelsData.push({
          id: doc.id,
          videoUrl: data.videoUrl || '',
          caption: data.caption || '',
          authorId: data.authorId || '',
          authorName: data.authorName || '',
          authorPhoto: data.authorPhoto || '',
          likes: data.likes || [],
          comments: data.comments || [],
          timestamp: data.timestamp,
          views: data.views || [],
          shares: data.shares || 0,
          music: data.music || 'Original Sound'
        });
      });
      setReels(reelsData);
      setLoading(false);
    }, (error) => {
      console.error('Reels yükleme hatası:', error);
      setLoading(false);
    });

    return () => unsubscribeReels();
  }, []);

  const handleLike = async (reelId: string) => {
    if (!currentUser) return;

    const reelRef = doc(db, 'reels', reelId);
    const reel = reels.find(r => r.id === reelId);
    
    if (reel) {
      if (reel.likes.includes(currentUser.uid)) {
        await updateDoc(reelRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(reelRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    }
  };

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;

    const currentUserRef = doc(db, 'users', currentUser.uid);
    const targetUserRef = doc(db, 'users', userId);

    try {
      const currentUserDoc = await getDoc(currentUserRef);
      const currentUserData = currentUserDoc.data();
      const isFollowing = currentUserData?.following?.includes(userId);

      if (isFollowing) {
        await updateDoc(currentUserRef, {
          following: arrayRemove(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(currentUserRef, {
          following: arrayUnion(userId)
        });
        await updateDoc(targetUserRef, {
          followers: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const handleShare = async (reelId: string) => {
    try {
      const reelRef = doc(db, 'reels', reelId);
      await updateDoc(reelRef, {
        shares: increment(1)
      });

      const reel = reels.find(r => r.id === reelId);
      if (reel) {
        await navigator.clipboard.writeText(`${window.location.origin}/reel/${reelId}`);
        // Premium toast mesajı gösterilebilir
        alert('🎬 Reel linki panoya kopyalandı!');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handleView = async (reelId: string) => {
    if (!currentUser) return;

    const reelRef = doc(db, 'reels', reelId);
    const reel = reels.find(r => r.id === reelId);
    
    if (reel && !reel.views.includes(currentUser.uid)) {
      await updateDoc(reelRef, {
        views: arrayUnion(currentUser.uid)
      });
    }
  };

  const openProfile = async (userId: string) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setSelectedUser({
          uid: userData.uid,
          displayName: userData.displayName,
          email: userData.email,
          photoURL: userData.photoURL,
          followers: userData.followers || [],
          following: userData.following || [],
          postsCount: userData.postsCount || 0,
          username: userData.username,
          bio: userData.bio
        });
        setShowProfileModal(true);
      }
    } catch (error) {
      console.error('Profile open error:', error);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        if (file.size > 50 * 1024 * 1024) {
          alert('Video boyutu 50MB\'dan küçük olmalıdır.');
          return;
        }
        // UploadReel modal'ını aç
        window.dispatchEvent(new CustomEvent('openUploadModal', { detail: file }));
      } else {
        alert('Lütfen bir video dosyası seçin.');
      }
    }
  };

  // Touch events for swipe
const handleTouchStart = useCallback((e: React.TouchEvent) => {
  e.preventDefault(); // Kullanılmamış parametreyi kullan
  setIsSwiping(false);
}, []);


const handleTouchMove = useCallback((e: React.TouchEvent) => {
  e.preventDefault(); // Kullanılmamış parametreyi kullan
  setIsSwiping(true);
}, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isSwiping) return;
    
    const touch = e.changedTouches[0];
    const container = containerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const touchY = touch.clientY - containerRect.top;
    const containerHeight = containerRect.height;

    if (touchY < containerHeight / 3) {
      // Yukarı swipe - önceki reel
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    } else if (touchY > (containerHeight * 2) / 3) {
      // Aşağı swipe - sonraki reel
      setCurrentIndex(prev => Math.min(prev + 1, reels.length - 1));
    }
    
    setIsSwiping(false);
  }, [isSwiping, reels.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setCurrentIndex(prev => Math.min(prev + 1, reels.length - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length]);

  if (loading) {
    return (
      <div className="reels-loading">
        <div className="premium-spinner"></div>
        <p>Reels yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="reels-premium-container">
      {/* Sidebar - Instagram web gibi */}
      <div className="reels-sidebar">
        <div className="sidebar-header">
          <h2>Reels</h2>
        </div>
        
        <div className="upload-section">
          <button 
            className="premium-upload-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">
              <PlusIcon />
            </div>
            <span>Yeni Reel</span>
          </button>
        </div>

        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-number">{reels.length}</span>
            <span className="stat-label">Toplam Reel</span>
          </div>
          {currentUser && (
            <div className="stat-item">
              <span className="stat-number">
                {reels.filter(r => r.authorId === currentUser.uid).length}
              </span>
              <span className="stat-label">Reel'lerim</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content - Instagram web gibi kenar boşlukları */}
      <div 
        className="reels-main-content"
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {reels.length === 0 ? (
          <div className="empty-reels-state">
            <div className="empty-content">
              <div className="camera-illustration">
                <CameraIcon />
              </div>
              <h2>Keşfetmeye Hazır Mısın?</h2>
              <p>İlk videoyu sen paylaş ve topluluğa katıl!</p>
              <button 
                className="premium-cta-button"
                onClick={() => fileInputRef.current?.click()}
              >
                <PlusIcon />
                İlk Reel'ini Paylaş
              </button>
            </div>
          </div>
        ) : (
          <div className="reels-list-container">
            <div className="reels-list">
              {reels.map((reel, index) => (
                <Reel
                  key={reel.id}
                  reel={reel}
                  isActive={index === currentIndex}
                  onLike={() => handleLike(reel.id)}
                  onShare={() => handleShare(reel.id)}
                  onView={() => handleView(reel.id)}
                  onProfileClick={() => openProfile(reel.authorId)}
                  onFollow={() => handleFollow(reel.authorId)}
                  currentUser={currentUser}
                />
              ))}
            </div>
          </div>
        )}

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {/* UploadReel component */}
      {currentUser && <UploadReel currentUser={currentUser} />}

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={selectedUser}
        currentUserId={currentUser?.uid}
        onFollow={handleFollow}
      />
    </div>
  );
};

export default Reels;