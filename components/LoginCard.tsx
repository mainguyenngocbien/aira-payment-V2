'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import logger from '../lib/logger';

import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';
import { generateSessionInfo } from '@/lib/sessionUtils';
import { sendVerificationEmail } from '@/lib/firebase';
import AuthButton from './AuthButton';
import EmailForm from './EmailForm';
import EmailLoginForm from './EmailLoginForm';
import LoadingSpinner from './LoadingSpinner';
import Logo from './Logo';
import UserProfile from './UserProfile';
import { Shield, Smartphone, Zap, Mail } from 'lucide-react';

export default function LoginCard() {
  const router = useRouter();
  const { user, loading, refreshUser } = useAuth();
  const [sessionId, setSessionId] = useState<string>('');
  const [isSignupMode, setIsSignupMode] = useState(false);
  const [isEmailLoginMode, setIsEmailLoginMode] = useState(false);

    useEffect(() => {
    if (user) {
      // Generate session info using API service
      generateSessionInfo(user.uid, user.email || '', user.emailVerified)
        .then((sessionInfo) => {
          setSessionId(sessionInfo.sessionId);
          
          // Log session info for debugging
          logger.log('Session info generated successfully');
          
          // Check if email is verified before redirecting
          if (user.emailVerified) {
            logger.log('Email verified! Redirecting to dashboard...');
            router.push('/dashboard');
          } else {
            logger.log('Email not verified! Redirecting to verification page...');
            router.push('/verify-email');
          }
        })
        .catch((error) => {
          logger.error('Failed to generate session info:', error);
          // Fallback to dashboard redirect
          if (user.emailVerified) {
            router.push('/dashboard');
          } else {
            router.push('/verify-email');
          }
        });
    }
  }, [user, router]);

  const handleSignOut = async () => {
    if (!auth) {
      logger.error('Auth not initialized');
      return;
    }

    try {
      await signOut(auth);
      setSessionId('');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  const handleEmailSubmit = (email: string) => {
    logger.log('Email submitted for signup:', email);
    // EmailForm will handle the Firebase Auth flow internally
  };

  const handleBackToLogin = () => {
    setIsSignupMode(false);
    setIsEmailLoginMode(false);
  };

  const handleEmailLoginSuccess = (userData: any) => {
          logger.log('Email login successful');
    
    // Show success message based on email verification status
    if (userData.verified) {
      alert('Login successful! Welcome back, ' + userData.name);
    } else {
      alert('Login successful! However, your email is not verified yet. Please check your inbox and click the verification link to access all features.');
    }
  };

  const handleForgotPassword = () => {
    alert('Password reset functionality will be implemented here');
  };

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      logger.error('Resend verification error:', error);
      alert('Failed to send verification email. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="card w-full max-w-md bg-white shadow-2xl border border-gray-100">
        <div className="card-body p-8">
          <LoadingSpinner size="lg" text="Initializing..." />
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-md bg-white shadow-strong border border-gray-100">
      <div className="card-body p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="md" />
          </div>
          <h1 className="text-2xl font-bold text-[#044aad] mb-2">
            {isSignupMode ? 'Create your account' : 'Visit AIRA Payment'}
          </h1>
          <p className="text-[#044aad] text-lg">
            {isSignupMode ? 'Join us today!' : 'Hey friend! Welcome back'}
          </p>
        </div>

        {!isSignupMode && !isEmailLoginMode ? (
          <>
            {/* Auth Buttons */}
            <div className="space-y-4 mb-6">
              <AuthButton provider="google" />
              <AuthButton provider="apple" />
            </div>

            {/* Divider */}
            <div className="flex items-center mb-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-secondary-400">Or</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Email Login Button */}
            <button
              onClick={() => setIsEmailLoginMode(true)}
              className="btn btn-outline btn-primary w-full mb-4 hover:bg-primary-50 transition-all duration-200"
            >
              <Mail className="w-4 h-4 mr-2" />
              Continue with Email
            </button>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#044aad]">
                No account?{' '}
                <button
                  onClick={() => setIsSignupMode(true)}
                  className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200"
                >
                  Create one
                </button>
              </p>
            </div>
          </>
        ) : isEmailLoginMode ? (
          <>
            {/* Email Login Form */}
            <EmailLoginForm 
              onLoginSuccess={handleEmailLoginSuccess}
              onForgotPassword={handleForgotPassword}
            />

            {/* Back to OAuth */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#044aad]">
                Or{' '}
                <button
                  onClick={() => setIsEmailLoginMode(false)}
                  className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200"
                >
                  continue with Google/Apple
                </button>
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Signup Form */}
            <EmailForm 
              onEmailSubmit={handleEmailSubmit}
              onBackToLogin={handleBackToLogin}
            />

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-[#044aad]">
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignupMode(false)}
                  className="text-primary-600 hover:text-primary-700 hover:underline font-medium transition-colors duration-200"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
