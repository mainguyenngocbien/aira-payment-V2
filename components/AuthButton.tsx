'use client';

import { useAuthPopup } from '@/hooks/useAuthPopup';
import { useState, useEffect } from 'react';
import { Chrome, Apple } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

interface AuthButtonProps {
  provider: 'google' | 'apple';
  variant?: 'popup' | 'redirect';
}

export default function AuthButton({ provider, variant = 'popup' }: AuthButtonProps) {
  const { signInWithGoogle, signInWithApple, handleRedirectResult, isLoading, error: authError } = useAuthPopup();
  const [error, setError] = useState<string | null>(null);

  // Handle redirect result on component mount
  useEffect(() => {
    if (variant === 'redirect') {
      handleRedirectResult().then((result) => {
        if (result.error) {
          setError(result.error);
        }
      });
    }
  }, [handleRedirectResult, variant]);

  const handleAuth = async () => {
    try {
      let result;
      
      if (provider === 'google') {
        result = await signInWithGoogle();
      } else {
        result = await signInWithApple();
      }
      
      if (result.error) {
        setError(result.error);
      }
    } catch (error: any) {
      setError(error.message || 'Authentication failed');
    }
  };

  const getButtonContent = () => {
    const icon = provider === 'google' ? <Chrome className="w-5 h-5" /> : <Apple className="w-5 h-5" />;
    const text = provider === 'google' ? 'Continue with Google' : 'Continue with Apple';
    
    return (
      <>
        {icon}
        <span className="ml-3">{text}</span>
      </>
    );
  };

  const getButtonStyle = () => {
    if (provider === 'google') {
      return 'btn btn-outline w-full hover:bg-primary-50 border-2 border-gray-200 hover:border-primary-300 bg-white text-neutral-800 font-medium transition-all duration-200';
    } else {
      return 'btn btn-outline w-full hover:bg-secondary-50 border-2 border-gray-200 hover:border-secondary-300 bg-white text-neutral-800 font-medium transition-all duration-200';
    }
  };

  return (
    <div className="w-full">
      {(error || authError) && (
        <ErrorMessage 
          message={error || authError || ''} 
          onClose={() => setError(null)}
          autoHide={true}
          duration={8000}
        />
      )}
      
      <button
        onClick={handleAuth}
        disabled={isLoading}
        className={`${getButtonStyle()} transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]`}
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          getButtonContent()
        )}
      </button>
    </div>
  );
}
