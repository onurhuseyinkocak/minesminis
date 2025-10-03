import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, arrayUnion, arrayRemove, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import Timeline from './components/Timeline';
import { Post } from '../../services/postsService';
import { useAuth } from '../../contexts/AuthContext';
import { userService } from '../../services/userService';
import './Discover.css';

const Discover: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following'>('for-you');
  const [retweetingPosts, setRetweetingPosts] = useState<Set<string>>(new Set());
  const { userProfile } = useAuth();

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
            reports: data.reports || 0,
            isApproved: data.isApproved !== undefined ? data.isApproved : true,
            engagementScore: data.engagementScore || 0,
            imageUrl: data.imageUrl || '',
            retweets: data.retweets || [],
            isRetweet: data.isRetweet || false,
            originalPostId: data.originalPostId || '',
            originalAuthorName: data.originalAuthorName || ''
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

      // Kullanıcı profilini getir
      const profile = await userService.getUserProfile(currentUser.uid);
      const authorName = profile?.displayName || currentUser.displayName || currentUser.email || 'Anonim';

      await addDoc(collection(db, 'posts'), {
        content,
        authorId: currentUser.uid,
        authorName: authorName,
        timestamp: serverTimestamp(),
        likes: [],
        reports: 0,
        imageUrl: '',
        isApproved: true,
        engagementScore: 0,
        retweets: [],
        isRetweet: false,
        originalPostId: '',
        originalAuthorName: ''
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

        // Kullanıcı profilini getir
        const profile = await userService.getUserProfile(currentUser.uid);
        const authorName = profile?.displayName || currentUser.displayName || currentUser.email || 'Anonim';

        if (hasRetweeted) {
          // Retweet'i kaldır
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            retweets: arrayRemove(currentUser.uid),
            engagementScore: (originalPost.engagementScore || 0) - 1
          });
          
          // Retweet postunu bul ve sil
          const retweetsQuery = query(
            collection(db, 'posts'),
            where('originalPostId', '==', postId),
            where('authorId', '==', currentUser.uid),
            where('isRetweet', '==', true)
          );
          const retweetsSnapshot = await getDocs(retweetsQuery);
          retweetsSnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
          });
        } else {
          // Yeni retweet postu oluştur
          await addDoc(collection(db, 'posts'), {
            content: originalPost.content,
            authorId: currentUser.uid,
            authorName: authorName,
            timestamp: serverTimestamp(),
            likes: [],
            reports: 0,
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
          title: 'Paylaş',
          text: post.content,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(post.content);
        alert('Paylaşım linki kopyalandı!');
      }
    } catch (error) {
      console.error('Paylaşım hatası:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      console.log('Post silindi');
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