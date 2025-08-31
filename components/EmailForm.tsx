'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logger from '../lib/logger';

import { Mail, ArrowLeft, Lock, Eye, EyeOff } from 'lucide-react';
import SuccessMessage from './SuccessMessage';
import { createUserWithEmail, sendVerificationEmail } from '@/lib/firebase';
import Logo from './Logo';

interface EmailFormProps {
  onEmailSubmit?: (email: string) => void;
  onBackToLogin?: () => void;
}

export default function EmailForm({ onEmailSubmit, onBackToLogin }: EmailFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create user with Firebase Auth
      const user = await createUserWithEmail(email, password, displayName || undefined);
      
      logger.log('User created successfully:', user.email);
      
      // Show success message briefly, then redirect to verification page
      setShowSuccess(true);
      
      // Redirect to verification page after a short delay
      setTimeout(() => {
        logger.log('Redirecting to verification page after signup...');
        router.push('/verify-email');
      }, 2000); // 2 seconds delay
      
    } catch (error: any) {
      logger.error('User creation error:', error);
      
      // Handle specific Firebase Auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('An account with this email already exists. Please sign in instead.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/weak-password':
          setError('Password is too weak. Please choose a stronger password.');
          break;
        case 'auth/operation-not-allowed':
          setError('Email/password accounts are not enabled. Please contact support.');
          break;
        default:
          setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      await sendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      logger.error('Resend verification error:', error);
      alert('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowSuccess(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    onBackToLogin?.();
  };

  const handleContinueToDashboard = () => {
    // Reset form and go back to login
    setShowSuccess(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setError('');
    onBackToLogin?.();
  };

  if (showSuccess) {
    return (
      <SuccessMessage 
        email={email} 
        onContinue={handleContinueToDashboard}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* No header needed - title already shown in LoginCard */}

      {/* Back button */}
      <button
        onClick={handleBackToLogin}
        className="btn btn-ghost btn-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to login
      </button>

      {/* Registration Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {/* Display Name */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Full Name (Optional)</span>
          </label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="input input-bordered w-full focus:input-primary"
          />
        </div>

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
              placeholder="Create a password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full focus:input-primary pl-10 pr-10"
              required
              minLength={6}
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

        {/* Confirm Password Input */}
        <div className="form-control">
          <label className="label">
            <span className="label-text font-medium">Confirm Password</span>
          </label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input input-bordered w-full focus:input-primary pl-10 pr-10"
              required
              minLength={6}
            />
            <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
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
        
        {/* Submit Button */}
        <button 
          type="submit"
          disabled={isLoading || !email || !password || !confirmPassword}
          className="btn btn-primary w-full disabled:opacity-50"
        >
          {isLoading ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Terms and Privacy */}
      <div className="text-center text-xs text-gray-500">
        By creating an account, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
      </div>
    </div>
  );
}
