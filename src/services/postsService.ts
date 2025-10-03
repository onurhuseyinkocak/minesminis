// src/services/postsService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  orderBy,
  query,
  limit,
  where,
  Timestamp,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto?: string;
  content: string;
  imageUrl?: string;
  timestamp: Date;
  likes: string[];
  reports: number;
  isApproved: boolean;
  engagementScore: number;
  hashtags?: string[];
  // Yeni alanlar
  retweets: string[];
  isRetweet: boolean;
  originalPostId?: string;
  originalAuthorName?: string;
}

export const postsService = {
  async createPost(postData: {
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    content: string;
    imageQuery?: string;
    isRetweet?: boolean;
    originalPostId?: string;
    originalAuthorName?: string;
  }) {
    try {
      console.log('🔄 Creating post with data:', postData);
      
      // Hashtag'leri içerikten çıkar
      const hashtags = this.extractHashtags(postData.content);
      
      let imageUrl = '';
      if (postData.imageQuery) {
        imageUrl = `https://source.unsplash.com/featured/600x400/?${encodeURIComponent(postData.imageQuery)},education`;
      }

      const post = {
        authorId: postData.authorId,
        authorName: postData.authorName,
        authorPhoto: postData.authorPhoto || '',
        content: postData.content,
        imageUrl: imageUrl,
        timestamp: Timestamp.now(),
        likes: [],
        retweets: [], // Yeni: retweets array
        reports: 0,
        isApproved: true,
        engagementScore: Math.random(),
        hashtags: hashtags,
        isRetweet: postData.isRetweet || false, // Yeni: isRetweet
        originalPostId: postData.originalPostId || '', // Yeni: originalPostId
        originalAuthorName: postData.originalAuthorName || '' // Yeni: originalAuthorName
      };

      console.log('💾 Post to be saved:', post);
      
      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log('✅ Post created with ID:', docRef.id);
      
      return { 
        id: docRef.id, 
        ...post,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('❌ Error creating post:', error);
      throw error;
    }
  },

  // Hashtag'leri içerikten çıkaran fonksiyon
  extractHashtags(content: string): string[] {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    if (!matches) return [];
    
    return matches.map(tag => tag.substring(1).toLowerCase()); // # işaretini kaldır ve küçük harfe çevir
  },

  async getDiscoverPosts(limitCount: number = 50) {
    try {
      console.log('🔄 Getting posts from Firestore...');
      
      let q;
      try {
        q = query(
          collection(db, 'posts'),
          where('isApproved', '==', true),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      } catch (error) {
        console.log('❌ Complex query failed, trying simple query...');
        q = query(
          collection(db, 'posts'),
          orderBy('timestamp', 'desc'),
          limit(limitCount)
        );
      }
      
      const snapshot = await getDocs(q);
      console.log('📊 Firestore response - docs count:', snapshot.docs.length);
      
      const posts = snapshot.docs.map(doc => {
        const data = doc.data();
        
        let postTimestamp: Date;
        const timestamp = data.timestamp;
        
        if (timestamp && typeof timestamp.toDate === 'function') {
          postTimestamp = timestamp.toDate();
        } else if (timestamp instanceof Date) {
          postTimestamp = timestamp;
        } else if (timestamp) {
          postTimestamp = new Date(timestamp);
        } else {
          postTimestamp = new Date();
        }
        
        const post = {
          id: doc.id,
          authorId: data.authorId || '',
          authorName: data.authorName || 'Anonim Öğretmen',
          authorPhoto: data.authorPhoto || '',
          content: data.content || '',
          imageUrl: data.imageUrl || '',
          timestamp: postTimestamp,
          likes: data.likes || [],
          retweets: data.retweets || [], // Yeni: retweets
          reports: data.reports || 0,
          isApproved: data.isApproved !== undefined ? data.isApproved : true,
          engagementScore: data.engagementScore || Math.random(),
          hashtags: data.hashtags || [],
          isRetweet: data.isRetweet || false, // Yeni: isRetweet
          originalPostId: data.originalPostId || '', // Yeni: originalPostId
          originalAuthorName: data.originalAuthorName || '' // Yeni: originalAuthorName
        };
        
        console.log('📄 Processed post:', post);
        return post;
      });
      
      console.log('✅ Final posts array:', posts);
      return posts;
    } catch (error) {
      console.error('❌ Error getting posts:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      return [];
    }
  },

  // Like işlemi
  async likePost(postId: string, userId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        engagementScore: Math.random()
      });
      console.log('✅ Post liked:', postId);
    } catch (error) {
      console.error('❌ Error liking post:', error);
      throw error;
    }
  },

  // Unlike işlemi
  async unlikePost(postId: string, userId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayRemove(userId)
      });
      console.log('✅ Post unliked:', postId);
    } catch (error) {
      console.error('❌ Error unliking post:', error);
      throw error;
    }
  },

  // Retweet işlemi için fonksiyon
  async retweetPost(originalPostId: string, userId: string, userEmail: string) {
    try {
      // Önce orijinal postu al
      const originalPostDoc = await getDocs(query(collection(db, 'posts'), where('__name__', '==', originalPostId)));
      if (originalPostDoc.empty) {
        throw new Error('Original post not found');
      }
      const originalPost = originalPostDoc.docs[0].data();

      // Retweet postu oluştur
      const retweetPostData = {
        authorId: userId,
        authorName: userEmail,
        content: originalPost.content,
        imageUrl: originalPost.imageUrl,
        isRetweet: true,
        originalPostId: originalPostId,
        originalAuthorName: originalPost.authorName
      };

      const retweetPost = await this.createPost(retweetPostData);

      // Orijinal postun retweets array'ine kullanıcıyı ekle
      const originalPostRef = doc(db, 'posts', originalPostId);
      await updateDoc(originalPostRef, {
        retweets: arrayUnion(userId)
      });

      console.log('✅ Post retweeted:', originalPostId);
      return retweetPost;
    } catch (error) {
      console.error('❌ Error retweeting post:', error);
      throw error;
    }
  },

  // Retweet'i kaldırma
  async unretweetPost(originalPostId: string, userId: string) {
    try {
      // Orijinal postun retweets array'inden kullanıcıyı çıkar
      const originalPostRef = doc(db, 'posts', originalPostId);
      await updateDoc(originalPostRef, {
        retweets: arrayRemove(userId)
      });

      // Kullanıcının retweet'ini bul ve sil
      const retweetsQuery = query(
        collection(db, 'posts'),
        where('originalPostId', '==', originalPostId),
        where('authorId', '==', userId),
        where('isRetweet', '==', true)
      );
      const retweetsSnapshot = await getDocs(retweetsQuery);
      retweetsSnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });

      console.log('✅ Post unretweeted:', originalPostId);
    } catch (error) {
      console.error('❌ Error unretweeting post:', error);
      throw error;
    }
  },

  // Raporlama işlemi
  async reportPost(postId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postQuery = query(collection(db, 'posts'), where('__name__', '==', postId));
      const postSnapshot = await getDocs(postQuery);
      
      if (!postSnapshot.empty) {
        const postData = postSnapshot.docs[0].data();
        const currentReports = postData.reports || 0;
        
        await updateDoc(postRef, {
          reports: currentReports + 1,
          isApproved: currentReports + 1 < 3
        });

        console.log('✅ Post reported:', postId, 'Reports:', currentReports + 1);

        if (currentReports + 1 >= 3) {
          await this.notifyAdmin(postId);
        }
      }
    } catch (error) {
      console.error('❌ Error reporting post:', error);
      throw error;
    }
  },

  async notifyAdmin(postId: string) {
    console.log(`🚨 ADMIN ALERT: Post ${postId} needs moderation!`);
  },

  async deletePost(postId: string, userId: string) {
    try {
      const postQuery = query(collection(db, 'posts'), where('__name__', '==', postId));
      const postSnapshot = await getDocs(postQuery);
      
      if (!postSnapshot.empty) {
        const postData = postSnapshot.docs[0].data();
        if (postData.authorId !== userId) {
          throw new Error('Sadece kendi paylaşımlarınızı silebilirsiniz');
        }
        
        await deleteDoc(doc(db, 'posts', postId));
        console.log('✅ Post deleted:', postId);
      }
    } catch (error) {
      console.error('❌ Error deleting post:', error);
      throw error;
    }
  }
};