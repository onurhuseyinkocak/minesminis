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
  Timestamp
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
}

export const postsService = {
  async createPost(postData: {
    authorId: string;
    authorName: string;
    authorPhoto?: string;
    content: string;
    imageQuery?: string;
  }) {
    try {
      // Görsel URL'sini oluştur
      let imageUrl = '';
      if (postData.imageQuery) {
        imageUrl = `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(postData.imageQuery)},education`;
      }

      const post = {
        ...postData,
        imageUrl,
        timestamp: Timestamp.now(),
        likes: [],
        reports: 0,
        isApproved: true,
        engagementScore: Math.random()
      };

      const docRef = await addDoc(collection(db, 'posts'), post);
      console.log('Post created with ID:', docRef.id);
      return { id: docRef.id, ...post };
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  async getDiscoverPosts(limitCount: number = 20) {
    try {
      const q = query(
        collection(db, 'posts'),
        where('isApproved', '==', true),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      const posts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() 
      })) as Post[];
      
      console.log('Retrieved posts:', posts.length);
      return posts;
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  async likePost(postId: string, userId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        likes: arrayUnion(userId),
        engagementScore: Math.random()
      });
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  async reportPost(postId: string) {
    try {
      const postRef = doc(db, 'posts', postId);
      const postDoc = await getDocs(query(collection(db, 'posts'), where('__name__', '==', postId)));
      
      if (!postDoc.empty) {
        const currentReports = postDoc.docs[0].data().reports || 0;
        await updateDoc(postRef, {
          reports: currentReports + 1,
          isApproved: currentReports + 1 < 3
        });

        if (currentReports + 1 >= 3) {
          await this.notifyAdmin(postId);
        }
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      throw error;
    }
  },

  async notifyAdmin(postId: string) {
    console.log(`🚨 ADMIN ALERT: Post ${postId} needs moderation!`);
  }
};