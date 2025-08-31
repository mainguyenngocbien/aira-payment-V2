'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logger from '../lib/logger';

import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { signInWithEmail } from '@/lib/firebase';
import Logo from './Logo';

interface EmailLoginFormProps {
  onLoginSuccess?: (userData: any) => void;
  onForgotPassword?: () => void;
}

export default function EmailLoginForm({ onLoginSuccess, onForgotPassword }: EmailLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Sign in with Firebase Auth
      const user = await signInWithEmail(email, password);
      
      logger.log('Login successful');
      
      const userData = {
        id: user.uid,
        email: user.email,
        name: user.displayName || user.email?.split('@')[0],
        verified: user.emailVerified,
        createdAt: user.metadata.creationTime
      };
      
      // Call success callback
      onLoginSuccess?.(userData);
      
      // Check if email is verified before redirecting
      if (user.emailVerified) {
        logger.log('Email verified! Redirecting to dashboard...');
        router.push('/dashboard');
      } else {
        logger.log('Email not verified! Redirecting to verification page...');
        router.push('/verify-email');
      }
      
    } catch (error: any) {
      logger.error('Login error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/user-disabled':
          setError('This account has been disabled. Please contact support.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your connection.');
          break;
        default:
          setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* No header needed - title already shown in LoginCard */}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Email</span>
        </label>
        <div className="relative">
          <input 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full focus:input-primary pl-10"
            required
          />
          <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Password Input */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-medium">Password</span>
        </label>
        <div className="relative">
          <input 
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full focus:input-primary pl-10 pr-10"
            required
          />
          <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Forgot Password Link */}
      <div className="text-right">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </button>
      </div>

      {/* Submit Button */}
      <button 
        type="submit"
        disabled={isLoading || !email || !password}
        className="btn btn-primary w-full disabled:opacity-50"
      >
        {isLoading ? (
          <span className="loading loading-spinner loading-sm"></span>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
    </div>
  );
}
