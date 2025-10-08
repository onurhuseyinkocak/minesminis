import { doc, getDoc, setDoc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
  followers: string[];
  following: string[];
  postsCount: number;
  reelsCount: number;
  role?: 'teacher' | 'student' | 'admin';
  subjects?: string[];
  gradeLevel?: string;
}

export const userService = {
  async createOrUpdateUserProfile(
    user: any, 
    profileData: { 
      firstName: string; 
      lastName: string; 
      displayName?: string;
      username?: string;
      bio?: string;
      role?: 'teacher' | 'student' | 'admin';
      subjects?: string[];
      gradeLevel?: string;
    }
  ) {
    try {
      console.log('🔄 Kullanıcı profili oluşturuluyor/güncelleniyor...', user.uid);
      
      const userRef = doc(db, 'users', user.uid);
      
      const userProfile = {
        uid: user.uid,
        email: user.email,
        displayName: profileData.displayName || `${profileData.firstName} ${profileData.lastName}`,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        username: profileData.username || user.email?.split('@')[0] || 'user',
        bio: profileData.bio || '',
        photoURL: user.photoURL || '',
        followers: [],
        following: [],
        postsCount: 0,
        reelsCount: 0,
        role: profileData.role || 'student',
        subjects: profileData.subjects || [],
        gradeLevel: profileData.gradeLevel || '',
        updatedAt: new Date(),
      };

      const userSnapshot = await getDoc(userRef);
      if (!userSnapshot.exists()) {
        console.log('✅ Yeni kullanıcı profili oluşturuluyor...');
        await setDoc(userRef, {
          ...userProfile,
          createdAt: new Date(),
        });
        console.log('✅ Kullanıcı profili başarıyla oluşturuldu');
      } else {
        console.log('✅ Mevcut kullanıcı profili güncelleniyor...');
        const existingData = userSnapshot.data();
        await updateDoc(userRef, {
          ...userProfile,
          followers: existingData.followers || [],
          following: existingData.following || [],
          postsCount: existingData.postsCount || 0,
          reelsCount: existingData.reelsCount || 0,
          createdAt: existingData.createdAt || new Date()
        });
        console.log('✅ Kullanıcı profili başarıyla güncellendi');
      }
    } catch (error) {
      console.error('❌ Kullanıcı profili oluşturma/güncelleme hatası:', error);
      throw error;
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      console.log('🔄 Kullanıcı profili getiriliyor...', uid);
      
      const userRef = doc(db, 'users', uid);
      const userSnapshot = await getDoc(userRef);
      
      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        const profile = {
          uid: data.uid,
          email: data.email,
          displayName: data.displayName,
          firstName: data.firstName,
          lastName: data.lastName,
          username: data.username,
          bio: data.bio,
          photoURL: data.photoURL,
          followers: data.followers || [],
          following: data.following || [],
          postsCount: data.postsCount || 0,
          reelsCount: data.reelsCount || 0,
          role: data.role || 'student',
          subjects: data.subjects || [],
          gradeLevel: data.gradeLevel || '',
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        };
        
        console.log('✅ Kullanıcı profili başarıyla getirildi:', profile.displayName);
        return profile;
      }
      
      console.log('❌ Kullanıcı profili bulunamadı:', uid);
      return null;
    } catch (error) {
      console.error('❌ Kullanıcı profili getirme hatası:', error);
      throw error;
    }
  },

  async incrementReelsCount(uid: string) {
    try {
      console.log('🔄 Reels sayısı artırılıyor...', uid);
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        reelsCount: increment(1),
        updatedAt: new Date()
      });
      
      console.log('✅ Reels sayısı başarıyla artırıldı');
    } catch (error) {
      console.error('❌ Reels sayısı artırma hatası:', error);
      throw error;
    }
  },

  async decrementReelsCount(uid: string) {
    try {
      console.log('🔄 Reels sayısı azaltılıyor...', uid);
      
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentCount = userSnap.data().reelsCount || 0;
        if (currentCount > 0) {
          await updateDoc(userRef, {
            reelsCount: increment(-1),
            updatedAt: new Date()
          });
          console.log('✅ Reels sayısı başarıyla azaltıldı');
        } else {
          console.log('ℹ️ Reels sayısı zaten 0, azaltma yapılmadı');
        }
      } else {
        console.log('❌ Kullanıcı bulunamadı');
      }
    } catch (error) {
      console.error('❌ Reels sayısı azaltma hatası:', error);
      throw error;
    }
  },

  async incrementPostCount(uid: string) {
    try {
      console.log('🔄 Post sayısı artırılıyor...', uid);
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        postsCount: increment(1),
        updatedAt: new Date()
      });
      
      console.log('✅ Post sayısı başarıyla artırıldı');
    } catch (error) {
      console.error('❌ Post sayısı artırma hatası:', error);
      throw error;
    }
  },

  async decrementPostCount(uid: string) {
    try {
      console.log('🔄 Post sayısı azaltılıyor...', uid);
      
      const userRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const currentCount = userSnap.data().postsCount || 0;
        if (currentCount > 0) {
          await updateDoc(userRef, {
            postsCount: increment(-1),
            updatedAt: new Date()
          });
          console.log('✅ Post sayısı başarıyla azaltıldı');
        } else {
          console.log('ℹ️ Post sayısı zaten 0, azaltma yapılmadı');
        }
      } else {
        console.log('❌ Kullanıcı bulunamadı');
      }
    } catch (error) {
      console.error('❌ Post sayısı azaltma hatası:', error);
      throw error;
    }
  },

  async followUser(currentUserId: string, targetUserId: string) {
    try {
      console.log('🔄 Takip işlemi yapılıyor...', { currentUserId, targetUserId });
      
      const currentUserRef = doc(db, 'users', currentUserId);
      const targetUserRef = doc(db, 'users', targetUserId);

      await updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId),
        updatedAt: new Date()
      });

      await updateDoc(targetUserRef, {
        followers: arrayUnion(currentUserId),
        updatedAt: new Date()
      });
      
      console.log('✅ Takip işlemi başarıyla tamamlandı');
    } catch (error) {
      console.error('❌ Takip işlemi hatası:', error);
      throw error;
    }
  },

  async unfollowUser(currentUserId: string, targetUserId: string) {
    try {
      console.log('🔄 Takibi bırakma işlemi yapılıyor...', { currentUserId, targetUserId });
      
      const currentUserRef = doc(db, 'users', currentUserId);
      const targetUserRef = doc(db, 'users', targetUserId);

      await updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId),
        updatedAt: new Date()
      });

      await updateDoc(targetUserRef, {
        followers: arrayRemove(currentUserId),
        updatedAt: new Date()
      });
      
      console.log('✅ Takibi bırakma işlemi başarıyla tamamlandı');
    } catch (error) {
      console.error('❌ Takibi bırakma hatası:', error);
      throw error;
    }
  },

  async checkUsernameAvailability(username: string): Promise<boolean> {
    try {
      console.log('🔄 Kullanıcı adı kontrol ediliyor...', username);
      
      // Bu fonksiyon için Firestore'da query gerekebilir
      // Şimdilik her zaman müsait gösteriyoruz
      return true;
    } catch (error) {
      console.error('❌ Kullanıcı adı kontrol hatası:', error);
      return false;
    }
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>) {
    try {
      console.log('🔄 Profil güncelleniyor...', uid, updates);
      
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      console.log('✅ Profil başarıyla güncellendi');
    } catch (error) {
      console.error('❌ Profil güncelleme hatası:', error);
      throw error;
    }
  },

  async searchUsers(query: string): Promise<UserProfile[]> {
    try {
      console.log('🔄 Kullanıcılar aranıyor...', query);
      
      // Bu fonksiyon için Firestore'da kompleks query gerekebilir
      // Şimdilik boş array döndürüyoruz
      return [];
    } catch (error) {
      console.error('❌ Kullanıcı arama hatası:', error);
      return [];
    }
  },

  async getUserStats(uid: string) {
    try {
      console.log('🔄 Kullanıcı istatistikleri getiriliyor...', uid);
      
      const profile = await this.getUserProfile(uid);
      if (!profile) {
        throw new Error('Kullanıcı bulunamadı');
      }

      return {
        postsCount: profile.postsCount,
        reelsCount: profile.reelsCount,
        followersCount: profile.followers.length,
        followingCount: profile.following.length
      };
    } catch (error) {
      console.error('❌ Kullanıcı istatistikleri getirme hatası:', error);
      throw error;
    }
  }
};