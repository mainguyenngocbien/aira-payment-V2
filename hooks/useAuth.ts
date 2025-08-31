'use client';

import { useState, useEffect, useCallback } from 'react';
import logger from '../lib/logger';

import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User, reload } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (auth?.currentUser) {
      try {
        await reload(auth.currentUser);
        logger.log('User data refreshed successfully');
      } catch (error) {
        logger.error('Error refreshing user:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, refreshUser };
}
