'use client';

import { useState, useEffect } from 'react';
import logger from '../lib/logger';

import { User } from 'firebase/auth';
import { Mail, User as UserIcon, Calendar, Shield, RefreshCw } from 'lucide-react';
import SessionInfo from './SessionInfo';
import EmailVerificationNotice from './EmailVerificationNotice';

interface UserProfileProps {
  user: User;
  sessionId: string;
  onSignOut: () => void;
  onResendVerification?: () => void;
  onRefreshUser?: () => void;
}

export default function UserProfile({ user, sessionId, onSignOut, onResendVerification, onRefreshUser }: UserProfileProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastEmailVerified, setLastEmailVerified] = useState(user.emailVerified);

  // Auto refresh when email verification status changes
  useEffect(() => {
    if (user.emailVerified && !lastEmailVerified) {
      // Email was just verified, show success message
      logger.log('Email verification detected!');
      alert('🎉 Email verified successfully! Welcome to AIRA Payment!');
      setTimeout(() => {
        if (onRefreshUser) {
          onRefreshUser();
        } else {
          window.location.reload();
        }
      }, 1000); // Refresh after 1 second to show updated status
    }
    setLastEmailVerified(user.emailVerified);
  }, [user.emailVerified, lastEmailVerified, onRefreshUser]);

  const handleRefreshUser = async () => {
    setIsRefreshing(true);
    try {
      if (onRefreshUser) {
        await onRefreshUser();
      } else {
        // Fallback to page reload
        window.location.reload();
      }
    } catch (error) {
      logger.error('Error refreshing user:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="card w-full max-w-md bg-white shadow-2xl border border-gray-100">
      <div className="card-body p-8">
        <div className="text-center mb-6">
          {/* User Avatar */}
          <div className="avatar placeholder mb-4">
            <div className="bg-primary text-primary-content rounded-full w-16 h-16">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <span className="text-xl font-semibold">
                  {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </span>
              )}
            </div>
          </div>

          {/* User Info */}
          <h2 className="text-2xl font-bold text-[#044aad] mb-2">
            Welcome back!
          </h2>
          <p className="text-[#044aad] mb-4">
            {user.displayName || user.email}
          </p>

          {/* Email Verification Notice */}
          {!user.emailVerified && user.email && (
            <EmailVerificationNotice 
              email={user.email}
              onResendVerification={onResendVerification}
            />
          )}

          {/* Refresh Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handleRefreshUser}
              disabled={isRefreshing}
              className="btn btn-sm btn-outline btn-primary"
              title="Refresh user data"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
            </button>
          </div>

          {/* User Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            {user.displayName && (
              <div className="flex items-center text-sm">
                <UserIcon className="w-4 h-4 text-[#044aad] mr-2" />
                <span className="text-[#044aad]">{user.displayName}</span>
              </div>
            )}
            
            {user.email && (
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 text-[#044aad] mr-2" />
                <span className="text-[#044aad]">{user.email}</span>
              </div>
            )}

            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-[#044aad] mr-2" />
              <span className="text-[#044aad]">
                Joined {formatDate(new Date(user.metadata.creationTime || Date.now()))}
              </span>
            </div>

            <div className="flex items-center text-sm">
              <Shield className="w-4 h-4 text-[#044aad] mr-2" />
              <span className="text-[#044aad]">
                {user.emailVerified ? 'Email Verified' : 'Email Not Verified'}
              </span>
            </div>
          </div>

          {/* Session Information */}
          <SessionInfo sessionId={sessionId} className="mb-6" />

          {/* Sign Out Button */}
          <button
            onClick={onSignOut}
            className="btn btn-outline btn-error w-full"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
