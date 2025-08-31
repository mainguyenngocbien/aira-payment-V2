'use client';

import { useState } from 'react';
import logger from '../lib/logger';

import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function AuthTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const runAuthTest = async () => {
    setIsTesting(true);
    setTestResult('Starting test...\n');

    try {
      // Test 1: Check if auth is available
      if (!auth) {
        setTestResult(prev => prev + '❌ Auth not available\n');
        return;
      }
      setTestResult(prev => prev + '✅ Auth available\n');

      // Test 2: Check if provider is configured
      if (!googleProvider) {
        setTestResult(prev => prev + '❌ Google provider not configured\n');
        return;
      }
      setTestResult(prev => prev + '✅ Google provider configured\n');

      // Test 3: Check current domain
      const domain = window.location.hostname;
      setTestResult(prev => prev + `📍 Current domain: ${domain}\n`);

      // Test 4: Check if we're in a secure context
      if (window.location.protocol !== 'https:' && domain !== 'localhost' && domain !== '127.0.0.1') {
        setTestResult(prev => prev + '⚠️ Not in secure context (HTTPS required for production)\n');
      } else {
        setTestResult(prev => prev + '✅ Secure context OK\n');
      }

      // Test 5: Try to sign in
      setTestResult(prev => prev + '🔄 Attempting sign-in...\n');
      
      const result = await signInWithPopup(auth, googleProvider);
      setTestResult(prev => prev + `✅ Sign-in successful! User: ${result.user.email}\n`);
      
    } catch (error: any) {
      logger.error('Test error:', error);
      setTestResult(prev => prev + `❌ Error: ${error.code} - ${error.message}\n`);
      
      // Provide specific guidance based on error
      switch (error.code) {
        case 'auth/unauthorized-domain':
          setTestResult(prev => prev + '💡 Solution: Add domain to Firebase Console > Authentication > Settings > Authorized domains\n');
          break;
        case 'auth/operation-not-allowed':
          setTestResult(prev => prev + '💡 Solution: Enable Google sign-in in Firebase Console > Authentication > Sign-in method\n');
          break;
        case 'auth/popup-blocked':
          setTestResult(prev => prev + '💡 Solution: Allow popups for this site\n');
          break;
        default:
          setTestResult(prev => prev + '💡 Check browser console for more details\n');
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="card w-full max-w-md bg-white shadow-2xl border border-gray-100">
      <div className="card-body p-8">
        <h3 className="text-lg font-bold mb-4">Firebase Auth Test</h3>
        
        <button
          onClick={runAuthTest}
          disabled={isTesting}
          className="btn btn-primary w-full mb-4"
        >
          {isTesting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            'Run Authentication Test'
          )}
        </button>

        {testResult && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            <pre className="text-xs whitespace-pre-wrap text-gray-700">
              {testResult}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
