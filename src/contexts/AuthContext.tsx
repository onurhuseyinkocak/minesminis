import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { userService, UserProfile } from '../services/userService';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  loading: boolean;
  showProfileSetup: boolean;
  setShowProfileSetup: (show: boolean) => void;
  hasSkippedSetup: boolean;
  setHasSkippedSetup: (skipped: boolean) => void;
  refreshUserProfile: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [hasSkippedSetup, setHasSkippedSetup] = useState(false);

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await userService.getUserProfile(user.id);
      setUserProfile(profile);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Force clear state to ensure UI updates even if network fails
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setShowProfileSetup(false);
    }
  };

  useEffect(() => {
    // Set a timeout to ensure the app loads even if Supabase is unreachable
    const timeout = setTimeout(() => {
      console.warn('Auth initialization timeout - loading app without auth');
      setLoading(false);
    }, 5000);

    supabase.auth.getSession().then(({ data: { session } }) => {
      clearTimeout(timeout);
      setSession(session);
      setUser(session?.user ?? null);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error('Auth session init error:', err);
      // Even if auth fails, we should let the app load (as guest)
    }).finally(() => {
      clearTimeout(timeout);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        const profile = await userService.getUserProfile(user.id);
        if (profile) {
          setUserProfile(profile);
          setShowProfileSetup(false);
        } else if (!hasSkippedSetup) {
          setShowProfileSetup(true);
        }
      } else {
        setUserProfile(null);
        setShowProfileSetup(false);
        setHasSkippedSetup(false); // Reset for next login
      }
    };

    loadUserProfile();
  }, [user]);

  const value = {
    user,
    session,
    userProfile,
    setUserProfile,
    loading,
    showProfileSetup,
    setShowProfileSetup,
    hasSkippedSetup, // Export this so we can check it in App.tsx
    setHasSkippedSetup, // Export this too
    refreshUserProfile,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
