/* eslint-disable react-refresh/only-export-components -- context file: exports Provider + useAuth */
import React, { createContext, useState, useEffect, useContext, useMemo, useCallback } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { isAdminEmail } from '../config/adminEmails';
import { userService, UserProfile } from '../services/userService';
import { setLearningPathUser } from '../services/learningPathService';
import { setSpacedRepetitionUser } from '../data/spacedRepetition';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  isAdmin: boolean;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  profileLoading: boolean;
  showProfileSetup: boolean;
  setShowProfileSetup: (show: boolean) => void;
  hasSkippedSetup: boolean;
  setHasSkippedSetup: (skipped: boolean) => void;
  refreshUserProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithGoogleRedirect: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasSkippedSetup, setHasSkippedSetup] = useState(false);

  const refreshUserProfile = useCallback(async () => {
    if (!user) return;
    setProfileLoading(true);
    try {
      const profile = await userService.getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  }, []);

  const signInWithGoogleRedirect = useCallback(async () => {
    await signInWithRedirect(auth, googleProvider);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Force clear state to ensure UI updates even if network fails
      setUser(null);
      setUserProfile(null);
      setShowProfileSetup(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(() => {
      if (!cancelled) setLoading(false);
    }, 5000);

    getRedirectResult(auth).catch(() => {});

    const unsubscribe = onAuthStateChanged(auth,
      (firebaseUser) => {
        if (cancelled) return;
        clearTimeout(timeout);
        setUser(firebaseUser);
        setLoading(false);
      },
      (error) => {
        if (cancelled) return;
        clearTimeout(timeout);
        console.error('Auth state change error:', error);
        setLoading(false);
      }
    );

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        // Scope localStorage keys per user for learning data
        setLearningPathUser(user.uid);
        setSpacedRepetitionUser(user.uid);
        setProfileLoading(true);
        try {
          const profile = await userService.getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            const isSetupCompleted = profile.settings?.setup_completed === true;
            setShowProfileSetup(!isSetupCompleted);
          } else if (!hasSkippedSetup) {
            setShowProfileSetup(true);
          }
        } catch (err) {
          console.error('Failed to load user profile:', err);
          if (!hasSkippedSetup) setShowProfileSetup(true);
        } finally {
          setProfileLoading(false);
        }
      } else {
        setUserProfile(null);
        setShowProfileSetup(false);
        setHasSkippedSetup(false); // Reset for next login
      }
    };

    loadUserProfile();
  }, [user, hasSkippedSetup]);

  const isAdmin = !!user && isAdminEmail(user.email ?? undefined);

  const value = useMemo(() => ({
    user,
    userProfile,
    isAdmin,
    setUserProfile,
    loading,
    profileLoading,
    showProfileSetup,
    setShowProfileSetup,
    hasSkippedSetup,
    setHasSkippedSetup,
    refreshUserProfile,
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGoogleRedirect,
    signOut,
  }), [user, userProfile, isAdmin, loading, profileLoading, showProfileSetup, hasSkippedSetup, refreshUserProfile, signUp, signIn, signInWithGoogle, signInWithGoogleRedirect, signOut]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
