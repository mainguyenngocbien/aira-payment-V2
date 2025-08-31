'use client';

import { useEffect, useState } from 'react';
import logger from '../lib/logger';

import { auth } from '@/lib/firebase';
import { getRedirectResult } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner';

export default function AuthRedirectHandler() {
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const handleRedirectResult = async () => {
      if (!auth) {
        return;
      }

      try {
        setIsProcessing(true);
        const result = await getRedirectResult(auth);
        if (result) {
          logger.log('Redirect authentication successful');
        }
      } catch (error) {
        logger.error('Redirect authentication error:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    handleRedirectResult();
  }, []);

  if (isProcessing) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <LoadingSpinner size="lg" text="Processing authentication..." />
      </div>
    );
  }

  return null;
}
