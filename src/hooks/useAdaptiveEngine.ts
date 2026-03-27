import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { setActiveUser, startSession } from '../services/adaptiveEngine';

export function useAdaptiveEngine(autoStart = false) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.uid) return;
    setActiveUser(user.uid);
    if (autoStart) startSession();
  }, [user?.uid, autoStart]);
}
