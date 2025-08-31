'use client';

import { auth, googleProvider, appleProvider } from '@/lib/firebase';
import logger from '../lib/logger';

import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { useState } from 'react';
import { Chrome, Apple } from 'lucide-react';
import ErrorMessage from './ErrorMessage';

interface AuthButtonProps {
  provider: 'google' | 'apple';
  variant?: 'popup' | 'redirect';
}

export default function AuthButton({ provider, variant = 'popup' }: AuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async () => {
    logger.log('Starting authentication for:', provider);

    if (!auth) {
      const errorMsg = 'Authentication service not available. Please refresh the page.';
      logger.error(errorMsg);
      setError(errorMsg);
      return;
    }

    const selectedProvider = provider === 'google' ? googleProvider : appleProvider;
    
    if (!selectedProvider) {
      const errorMsg = `${provider} provider not available. Please check Firebase configuration.`;
      logger.error(errorMsg);
      setError(errorMsg);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      if (variant === 'popup') {
        logger.log('Attempting popup sign-in...');
        const result = await signInWithPopup(auth, selectedProvider);
        logger.log('Sign-in successful');
      } else {
        logger.log('Attempting redirect sign-in...');
        await signInWithRedirect(auth, selectedProvider);
      }
    } catch (error: any) {
      logger.error('Authentication error details:', {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      
      // Handle specific error cases
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error.code) {
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase configuration not found. Please check project settings.';
          break;
        case 'auth/popup-closed-by-user':
          errorMessage = 'Sign-in was cancelled.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Pop-up was blocked. Please allow pop-ups for this site.';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'This domain is not authorized for sign-in. Please check Firebase Console settings.';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = `${provider} sign-in is not enabled. Please enable it in Firebase Console.`;
          break;
        case 'auth/invalid-api-key':
          errorMessage = 'Invalid API key. Please check Firebase configuration.';
          break;
        case 'auth/web-storage-unsupported':
          errorMessage = 'Web storage is not supported. Please enable cookies.';
          break;
        default:
          errorMessage = `Authentication failed: ${error.message || error.code}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
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
      return 'btn btn-outline w-full hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-800';
    } else {
      return 'btn btn-outline w-full hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 bg-white text-gray-800';
    }
  };

  return (
    <div className="w-full">
      {error && (
        <ErrorMessage 
          message={error} 
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
