import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../config/supabase';
import { userService, UserProfile } from '../services/userService';
import ProfileSetupModal from '../components/ProfileSetupModal';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  showProfileSetup: boolean;
  setShowProfileSetup: (show: boolean) => void;
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
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
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
        } else {
          setShowProfileSetup(true);
        }
      } else {
        setUserProfile(null);
        setShowProfileSetup(false);
      }
    };

    loadUserProfile();
  }, [user]);

  const value = {
    user,
    session,
    userProfile,
    loading,
    showProfileSetup,
    setShowProfileSetup,
    refreshUserProfile,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {user && (
        <ProfileSetupModal
          user={user}
          isOpen={showProfileSetup}
          onClose={() => setShowProfileSetup(false)}
          onProfileUpdated={refreshUserProfile}
        />
      )}
    </AuthContext.Provider>
  );
};

export default AuthContext;
