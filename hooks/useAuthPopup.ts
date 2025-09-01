import { useState, useCallback } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, appleProvider } from '../lib/firebase';
import logger from '../lib/logger';

interface AuthPopupResult {
  user: any;
  error: string | null;
}

export const useAuthPopup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle popup authentication with COOP fallback
  const signInWithPopupSafe = useCallback(async (provider: any): Promise<AuthPopupResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Try popup first
      const result = await signInWithPopup(auth, provider);
      logger.log('✅ Popup authentication successful');
      return { user: result.user, error: null };
    } catch (popupError: any) {
      logger.warn('⚠️ Popup failed, trying redirect:', popupError.message);
      
      // If popup fails due to COOP, fallback to redirect
      if (popupError.code === 'auth/popup-blocked' || 
          popupError.message.includes('Cross-Origin-Opener-Policy') ||
          popupError.message.includes('COOP')) {
        
        try {
          await signInWithRedirect(auth, provider);
          logger.log('✅ Redirect authentication initiated');
          return { user: null, error: null };
        } catch (redirectError: any) {
          logger.error('❌ Redirect authentication failed:', redirectError);
          return { user: null, error: redirectError.message };
        }
      }
      
      return { user: null, error: popupError.message };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Handle redirect result
  const handleRedirectResult = useCallback(async (): Promise<AuthPopupResult> => {
    try {
      const result = await getRedirectResult(auth);
      if (result) {
        logger.log('✅ Redirect authentication successful');
        return { user: result.user, error: null };
      }
      return { user: null, error: null };
    } catch (error: any) {
      logger.error('❌ Redirect result error:', error);
      return { user: null, error: error.message };
    }
  }, []);

  // Google Sign In
  const signInWithGoogle = useCallback(async (): Promise<AuthPopupResult> => {
    if (!googleProvider) {
      return { user: null, error: 'Google provider not initialized' };
    }
    return await signInWithPopupSafe(googleProvider);
  }, [signInWithPopupSafe]);

  // Apple Sign In
  const signInWithApple = useCallback(async (): Promise<AuthPopupResult> => {
    if (!appleProvider) {
      return { user: null, error: 'Apple provider not initialized' };
    }
    return await signInWithPopupSafe(appleProvider);
  }, [signInWithPopupSafe]);

  return {
    signInWithGoogle,
    signInWithApple,
    handleRedirectResult,
    isLoading,
    error
  };
};
