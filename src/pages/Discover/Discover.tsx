import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Timeline from './components/Timeline';
import { Post } from '../../services/postsService';
import './Discover.css';

const Discover: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const [retweetingPosts, setRetweetingPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    const postsQuery = query(
      collection(db, 'posts'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribePosts = onSnapshot(postsQuery, 
      (snapshot) => {
        const postsData: Post[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          const post: Post = {
            id: doc.id,
            authorId: data.authorId || data.userId || '',
            authorName: data.authorName || data.userEmail || '',
            content: data.content || '',
            timestamp: data.timestamp || data.createdAt || serverTimestamp(),
            likes: data.likes || [],
            reports: data.reports || [],
            isApproved: data.isApproved !== undefined ? data.isApproved : true,
            engagementScore: data.engagementScore || 0,
            imageUrl: data.imageUrl || '',
            retweets: data.retweets || [],
            isRetweet: data.isRetweet || false,
            originalPostId: data.originalPostId || ''
          };
          postsData.push(post);
        });
        setPosts(postsData);
        setLoading(false);
      },
      (error) => {
        console.error("Posts yüklenirken hata:", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribePosts();
    };
  }, []);

  const onSubmitPost = async (content: string): Promise<boolean> => {
    try {
      if (!currentUser) {
        console.error('Kullanıcı giriş yapmamış');
        return false;
      }

      await addDoc(collection(db, 'posts'), {
        content,
        authorId: currentUser.uid,
        authorName: currentUser.email,
        timestamp: serverTimestamp(),
        likes: [],
        reports: [],
        imageUrl: '',
        isApproved: true,
        engagementScore: 0,
        retweets: [],
        isRetweet: false,
        originalPostId: ''
      });

      console.log('Post başarıyla gönderildi');
      return true;
    } catch (error) {
      console.error('Post gönderilemedi:', error);
      return false;
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    const postRef = doc(db, 'posts', postId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      const isLiked = post.likes.includes(currentUser.uid);
      
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid),
          engagementScore: (post.engagementScore || 0) - 1
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid),
          engagementScore: (post.engagementScore || 0) + 1
        });
      }
    }
  };

  const handleRetweet = async (postId: string) => {
    if (!currentUser) return;
    
    // Retweet işlemi başladığını belirt
    setRetweetingPosts(prev => new Set(prev).add(postId));

    try {
      const originalPost = posts.find(p => p.id === postId);
      if (originalPost) {
        // Kullanıcının bu postu daha önce retweet edip etmediğini kontrol et
        const hasRetweeted = originalPost.retweets?.includes(currentUser.uid);

        if (hasRetweeted) {
          // Retweet'i kaldır
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            retweets: arrayRemove(currentUser.uid),
            engagementScore: (originalPost.engagementScore || 0) - 1
          });
        } else {
          // Yeni retweet postu oluştur
          await addDoc(collection(db, 'posts'), {
            content: originalPost.content,
            authorId: currentUser.uid,
            authorName: currentUser.email,
            timestamp: serverTimestamp(),
            likes: [],
            reports: [],
            imageUrl: originalPost.imageUrl || '',
            isApproved: true,
            engagementScore: 0,
            retweets: [],
            isRetweet: true,
            originalPostId: postId,
            originalAuthorName: originalPost.authorName
          });

          // Orijinal postun retweet sayısını güncelle
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            retweets: arrayUnion(currentUser.uid),
            engagementScore: (originalPost.engagementScore || 0) + 2
          });
        }
      }
    } catch (error) {
      console.error('Retweet yapılamadı:', error);
    } finally {
      // Retweet işlemi bittiğini belirt
      setRetweetingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleShare = async (post: Post) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${post.authorName} paylaştı`,
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(post.content);
        // Toast bildirimi burada gösterilecek
        if (typeof window !== 'undefined' && (window as any).toast) {
          (window as any).toast.success('Paylaşım linki kopyalandı!');
        } else {
          alert('Paylaşım linki kopyalandı!');
        }
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      if (window.confirm('Bu postu silmek istediğinizden emin misiniz?')) {
        await deleteDoc(doc(db, 'posts', postId));
        console.log('Post silindi');
        // Toast bildirimi burada gösterilecek
        if (typeof window !== 'undefined' && (window as any).toast) {
          (window as any).toast.success('Post başarıyla silindi!');
        }
      }
    } catch (error) {
      console.error('Post silinemedi:', error);
    }
  };

  if (loading) {
    return (
      <div className="discover-loading">
        <div className="loading-spinner"></div>
        <p>Gönderiler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="discover-wrapper">
      <div className="discover-container">
        <div className="discover-header">
          <h1>Keşfet</h1>
          <p>Topluluğun paylaşımlarını keşfedin ve siz de paylaşın</p>
        </div>
        
        <Timeline 
          posts={posts}
          isLoadingPosts={loading}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onSubmitPost={onSubmitPost}
          onLike={handleLike}
          onRetweet={handleRetweet}
          onShare={handleShare}
          onDeletePost={handleDeletePost}
          currentUser={currentUser}
          retweetingPosts={retweetingPosts}
        />
      </div>
    </div>
  );
};

export default Discover;