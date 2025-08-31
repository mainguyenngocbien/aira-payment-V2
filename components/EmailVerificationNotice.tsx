'use client';

import { Mail, ExternalLink, AlertCircle } from 'lucide-react';
import Logo from './Logo';

interface EmailVerificationNoticeProps {
  email: string;
  onResendVerification?: () => void;
  onDismiss?: () => void;
}

export default function EmailVerificationNotice({ 
  email, 
  onResendVerification, 
  onDismiss 
}: EmailVerificationNoticeProps) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-yellow-800 mb-1">
            Email verification required
          </h3>
          <p className="text-sm text-yellow-700 mb-3">
            Your email address <strong>{email}</strong> has not been verified yet. 
            Please check your inbox and click the verification link to activate your account.
          </p>
          
          <div className="flex items-center space-x-2 text-xs text-yellow-600 mb-3">
            <ExternalLink className="w-3 h-3" />
            <span>Click the verification link in your email</span>
          </div>
          
          <div className="flex space-x-2">
            {onResendVerification && (
              <button
                onClick={onResendVerification}
                className="btn btn-sm btn-outline btn-warning"
              >
                <Mail className="w-3 h-3 mr-1" />
                Resend verification
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="btn btn-sm btn-ghost text-yellow-700"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
