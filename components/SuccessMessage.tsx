'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle, Mail, Shield, ExternalLink } from 'lucide-react';
import Logo from './Logo';

interface SuccessMessageProps {
  email: string;
  onContinue?: () => void;
  onResendVerification?: () => void;
}

export default function SuccessMessage({ email, onContinue, onResendVerification }: SuccessMessageProps) {
  const router = useRouter();
  
  return (
    <div className="text-center space-y-6">
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Logo size="md" />
      </div>

      {/* Success Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
      </div>

      {/* Success Message */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Account created successfully!
        </h2>
        <p className="text-gray-600">
          Welcome to AIRA Payment! Your account has been created and a verification email has been sent.
        </p>
      </div>

      {/* Email Verification Notice */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Mail className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">
            Verification email sent to <strong>{email}</strong>
          </span>
        </div>
        <p className="text-xs text-blue-700 mb-2">
          Please check your inbox and click the verification link to activate your account.
        </p>
        <div className="flex items-center justify-center space-x-1 text-xs text-blue-600">
          <ExternalLink className="w-3 h-3" />
          <span>Click the link in your email to verify</span>
        </div>
      </div>

      {/* Resend Verification Button */}
      {onResendVerification && (
        <button
          onClick={onResendVerification}
          className="btn btn-outline btn-sm"
        >
          <Mail className="w-4 h-4 mr-2" />
          Resend verification email
        </button>
      )}

      {/* Continue Button */}
      {onContinue && (
        <button
          onClick={() => {
            // Redirect to verification page immediately
            router.push('/verify-email');
          }}
          className="btn btn-primary w-full"
        >
          Continue to Verification
        </button>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-50 rounded-lg p-3">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <Shield className="w-4 h-4 text-yellow-600" />
          <span className="text-xs font-medium text-yellow-800">Security Notice</span>
        </div>
        <p className="text-xs text-yellow-700">
          Your account is secure with Firebase Authentication. Please verify your email to access all features.
        </p>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Check your spam folder if you don&apos;t see the email</p>
        <p>• Click the verification link in your email to activate your account</p>
        <p>• You can sign in once your email is verified</p>
        <p>• Your account is protected by Firebase security</p>
      </div>
    </div>
  );
}
