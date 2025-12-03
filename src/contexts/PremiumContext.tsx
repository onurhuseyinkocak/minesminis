import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface PremiumStatus {
  isPremium: boolean;
  subscription: any | null;
  customerId: string | null;
  loading: boolean;
}

interface PremiumContextType extends PremiumStatus {
  checkPremiumStatus: () => Promise<void>;
  createCheckout: (priceId: string) => Promise<string | null>;
  openCustomerPortal: () => Promise<string | null>;
}

const PremiumContext = createContext<PremiumContextType | null>(null);

export function usePremium() {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}

// Get backend URL based on environment
function getBackendUrl(): string {
  if (import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL;
  }
  
  // In Replit, the backend runs on the same domain but port 3001
  // The frontend proxy handles this automatically
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If running in Replit (contains replit in hostname)
    if (hostname.includes('replit') || hostname.includes('.dev') || hostname.includes('.app')) {
      // Use origin-based URL with port modification
      const protocol = window.location.protocol;
      const port = '3001';
      
      // Check if hostname already has port prefix like "5000-..."
      const parts = hostname.split('.');
      if (parts.length > 0) {
        const firstPart = parts[0];
        const portMatch = firstPart.match(/^(\d+)-(.+)$/);
        if (portMatch) {
          // Replace the port prefix
          parts[0] = `${port}-${portMatch[2]}`;
          return `${protocol}//${parts.join('.')}`;
        }
      }
    }
  }
  
  return 'http://localhost:3001';
}

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    subscription: null,
    customerId: null,
    loading: true,
  });

  const backendUrl = getBackendUrl();

  const checkPremiumStatus = useCallback(async () => {
    if (!user?.email) {
      setStatus({
        isPremium: false,
        subscription: null,
        customerId: null,
        loading: false,
      });
      return;
    }

    try {
      const response = await fetch(`${backendUrl}/api/stripe/check-premium`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        setStatus({
          isPremium: data.isPremium,
          subscription: data.subscription,
          customerId: data.customerId,
          loading: false,
        });
      } else {
        setStatus(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      setStatus(prev => ({ ...prev, loading: false }));
    }
  }, [user?.email, backendUrl]);

  const createCheckout = async (priceId: string): Promise<string | null> => {
    if (!user?.email) {
      console.error('User not logged in');
      return null;
    }

    try {
      const response = await fetch(`${backendUrl}/api/stripe/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: user.email,
          priceId 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        console.error('Checkout error:', error);
        return null;
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      return null;
    }
  };

  const openCustomerPortal = async (): Promise<string | null> => {
    if (!user?.email) {
      console.error('User not logged in');
      return null;
    }

    try {
      const response = await fetch(`${backendUrl}/api/stripe/customer-portal`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        console.error('Portal error:', error);
        return null;
      }
    } catch (error) {
      console.error('Error opening portal:', error);
      return null;
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, [checkPremiumStatus]);

  return (
    <PremiumContext.Provider value={{
      ...status,
      checkPremiumStatus,
      createCheckout,
      openCustomerPortal,
    }}>
      {children}
    </PremiumContext.Provider>
  );
}
