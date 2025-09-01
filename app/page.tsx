'use client';

import LoginCard from '@/components/LoginCard';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import { useEffect } from 'react';

export default function Home() {
  const { handleRedirectResult } = useAuthPopup();

  // Handle redirect result on page load
  useEffect(() => {
    handleRedirectResult().then((result) => {
      if (result.user) {
        // Redirect to dashboard or handle successful authentication
        console.log('User authenticated:', result.user);
      }
    });
  }, [handleRedirectResult]);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-md">
        <LoginCard />
      </div>
    </main>
  );
}
