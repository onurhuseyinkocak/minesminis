// ============================================================
// MinesMinis — Progress Context
// React layer over ProgressService
// ============================================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { progressService } from '../services/progressService';
import type { ActivityResult } from '../types/progress';

interface ProgressContextValue {
  // State
  currentUnitId: string;
  activeChildId: string | null;
  // Reads
  getUnitProgress: (unitId: string) => number;
  isUnitCompleted: (unitId: string) => boolean;
  isUnitUnlocked: (unitId: string) => boolean;
  getCurrentActivityIndex: (unitId: string) => number;
  // Writes
  saveActivityComplete: (unitId: string, actIdx: number, total: number, result?: ActivityResult) => void;
  completeUnit: (unitId: string) => void;
  setCurrentUnit: (unitId: string) => void;
  setUser: (userId: string, childId?: string | null) => void;
  // Admin
  resetAllProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [currentUnitId, setCurrentUnitId] = useState<string>(() =>
    progressService.getCurrentUnitId()
  );
  const [activeChildId, setActiveChildId] = useState<string | null>(() =>
    localStorage.getItem('mimi_active_child')
  );

  const setUser = useCallback((userId: string, childId: string | null = null) => {
    progressService.setUser(userId, childId);
    setActiveChildId(childId);
    setCurrentUnitId(progressService.getCurrentUnitId());
  }, []);

  const setCurrentUnit = useCallback((unitId: string) => {
    progressService.setCurrentUnit(unitId);
    setCurrentUnitId(unitId);
  }, []);

  const saveActivityComplete = useCallback((
    unitId: string, actIdx: number, total: number, result?: ActivityResult
  ) => {
    progressService.saveActivityComplete(unitId, actIdx, total, result);
    // If unit just completed, update currentUnitId
    if (actIdx + 1 >= total) {
      setCurrentUnitId(progressService.getCurrentUnitId());
    }
  }, []);

  const completeUnit = useCallback((unitId: string) => {
    progressService.completeUnit(unitId);
    setCurrentUnitId(progressService.getCurrentUnitId());
  }, []);

  // Sync currentUnitId when storage changes (multi-tab)
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key?.includes('current_unit')) {
        setCurrentUnitId(progressService.getCurrentUnitId());
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const value: ProgressContextValue = {
    currentUnitId,
    activeChildId,
    getUnitProgress: (id) => progressService.getUnitProgress(id),
    isUnitCompleted: (id) => progressService.isUnitCompleted(id),
    isUnitUnlocked: (id) => progressService.isUnitUnlocked(id),
    getCurrentActivityIndex: (id) => progressService.getCurrentActivityIndex(id),
    saveActivityComplete,
    completeUnit,
    setCurrentUnit,
    setUser,
    resetAllProgress: () => {
      progressService.resetAllProgress();
      setCurrentUnitId('s1-u1');
    },
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider');
  return ctx;
}

export default ProgressContext;
