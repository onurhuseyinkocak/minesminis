import React, { createContext, useState, useEffect, useContext } from 'react';
import { User, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth } from '../config/firebase';
import { userService, UserProfile } from '../services/userService';
import ProfileSetupModal from '../components/ProfileSetupModal';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  showProfileSetup: boolean;
  setShowProfileSetup: (show: boolean) => void;
  refreshUserProfile: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await userService.getUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      console.log('Google login başlatılıyor...');
      console.log('Auth domain:', auth.app.options.authDomain);
      const result = await signInWithRedirect(auth, provider);
      console.log('Redirect başlatıldı:', result);
    } catch (error) {
      console.error('Google ile giriş yapılırken hata oluştu:', error);
      alert('Hata: ' + (error as Error).message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log('Google ile giriş başarılı');
        }
      } catch (error) {
        console.error('Redirect sonucu alınırken hata:', error);
      }
    };

    checkRedirectResult();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await userService.getUserProfile(user.uid);
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
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    showProfileSetup,
    setShowProfileSetup,
    refreshUserProfile,
    loginWithGoogle,
    logout,
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