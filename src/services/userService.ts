import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  async createOrUpdateUserProfile(user: any, profileData: { firstName: string; lastName: string; displayName?: string }) {
    const userRef = doc(db, 'users', user.uid);
    
    const userProfile = {
      uid: user.uid,
      email: user.email,
      displayName: profileData.displayName || `${profileData.firstName} ${profileData.lastName}`,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      photoURL: user.photoURL || '',
      updatedAt: new Date(),
    };

    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        ...userProfile,
        createdAt: new Date(),
      });
    } else {
      await updateDoc(userRef, userProfile);
    }
  },

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    if (userSnapshot.exists()) {
      const data = userSnapshot.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        firstName: data.firstName,
        lastName: data.lastName,
        photoURL: data.photoURL,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      };
    }
    return null;
  },
};