'use client';

import LoginCard from '@/components/LoginCard';
import LoadingScreen from '@/components/LoadingScreen';
import logger from '@/lib/logger';

import { useAuthPopup } from '@/hooks/useAuthPopup';
import { useEffect, useState } from 'react';

export default function Home() {
  const { handleRedirectResult } = useAuthPopup();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Handle redirect result on page load
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        const result = await handleRedirectResult();
        if (result.user) {
          // Redirect to dashboard or handle successful authentication
          logger.log('User authenticated:', result.user);
        }
      } catch (err: any) {
        logger.error('Error initializing app:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [handleRedirectResult]);

  if (isLoading) {
    return <LoadingScreen message="Initializing AIRA Payment..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="max-w-md w-full">
          <div className="card bg-white shadow-lg border-0">
            <div className="card-body p-6 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-readable-primary mb-2">
                Initialization Error
              </h2>
              <p className="text-readable-secondary mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
}
