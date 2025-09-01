'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, RefreshCw, ArrowLeft, Shield, Clock } from 'lucide-react';
import { sendVerificationEmail } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import logger from '../lib/logger';

export default function EmailVerificationPending() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState('');

  const handleResendVerification = async () => {
    if (!user) return;
    
    setIsResending(true);
    setResendError('');
    setResendSuccess(false);

    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      logger.log('Verification email resent successfully');
    } catch (error: any) {
      logger.error('Failed to resend verification email:', error);
      setResendError('Failed to send verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;
    
    try {
      // Refresh user data to check if email is now verified
      await refreshUser();
      
      // Check if email is now verified
      if (user.emailVerified) {
        logger.log('Email verified! Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        logger.log('Email still not verified');
        // You could show a message here if needed
      }
    } catch (error) {
      logger.error('Error checking verification status:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      // Import signOut dynamically to avoid SSR issues
      const { signOut } = await import('firebase/auth');
      const { auth } = await import('@/lib/firebase');
      await signOut(auth);
      router.push('/');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-readable-primary mb-2">
            Verify Your Email
          </h1>
          <p className="text-readable-secondary">
            We&apos;ve sent a verification link to your email address
          </p>
        </div>

        {/* Email Info Card */}
        <div className="card bg-white shadow-lg border border-gray-100 mb-6">
          <div className="card-body p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-base-200 rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-readable-secondary" />
              </div>
              <div>
                <p className="font-medium text-readable-primary">{user.email}</p>
                <p className="text-sm text-readable-muted">Check your inbox</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-4 h-4 text-yellow-500" />
              <span className="badge badge-warning badge-sm">Pending Verification</span>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Next Steps:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Check your email inbox</li>
                    <li>• Click the verification link</li>
                    <li>• Return here to access your dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCheckVerification}
                className="btn btn-primary w-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                I&apos;ve Verified My Email
              </button>

              <button
                onClick={handleResendVerification}
                disabled={isResending}
                className="btn btn-outline btn-sm w-full"
              >
                {isResending ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                {isResending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </div>

            {/* Success/Error Messages */}
            {resendSuccess && (
              <div className="alert alert-success mt-4">
                <span>Verification email sent! Please check your inbox.</span>
              </div>
            )}

            {resendError && (
              <div className="alert alert-error mt-4">
                <span>{resendError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out Option */}
        <div className="text-center">
          <button
            onClick={handleSignOut}
            className="btn btn-ghost btn-sm text-readable-muted hover:text-readable-secondary"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Sign Out
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-medium text-readable-primary mb-2">Need Help?</h3>
            <div className="text-xs text-readable-secondary space-y-1">
              <p>• Check your spam folder</p>
              <p>• Make sure you entered the correct email</p>
              <p>• Contact support if you need assistance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
