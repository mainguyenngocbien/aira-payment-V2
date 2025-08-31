'use client';

import { useState, useEffect } from 'react';
import logger from '../../../lib/logger';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Copy, Share, Download, Wallet } from 'lucide-react';
import QRCode from 'react-qr-code';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/lib/apiService';

export default function CelestiaDepositPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [copied, setCopied] = useState(false);
  const [celestiaAddress, setCelestiaAddress] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Get or create wallet for the user
  useEffect(() => {
    const getWallet = async () => {
      // Wait for auth to finish loading
      if (authLoading) {
        return;
      }

      // Check if user is authenticated
      if (!user?.email) {
        setError('User not authenticated. Please login first.');
        setLoading(false);
        return;
      }

      try {
        const walletInfo = await apiService.getOrCreateWallet(user.email);
        setCelestiaAddress(walletInfo.celestiaWallet);
        setLoading(false);
      } catch (err) {
        logger.error('Failed to get wallet:', err);
        setError('Failed to load wallet');
        setLoading(false);
      }
    };

    getWallet();
  }, [user?.email, authLoading]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      logger.error('Failed to copy:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'AIRA Payment Deposit',
        text: 'Deposit to my AIRA wallet',
        url: window.location.href
      });
    }
  };

  const handleDownload = () => {
    const canvas = document.querySelector('#qr-code canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL();
      const a = document.createElement('a');
      a.href = url;
      a.download = 'aira-deposit-qr.png';
      a.click();
    }
  };

  // Redirect to login if not authenticated
  if (!authLoading && !user) {
    router.push('/');
    return null;
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">
            {authLoading ? 'Checking authentication...' : 'Loading wallet...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="alert alert-error max-w-md">
            <span>{error}</span>
          </div>
          <div className="mt-4 space-x-2">
            <button onClick={() => router.push('/')} className="btn btn-primary">
              Go to Login
            </button>
            <button onClick={() => router.back()} className="btn btn-outline">
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => router.back()}
                className="btn btn-ghost btn-sm btn-circle"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-bold text-gray-900">On-Chain Celestia Deposit</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">

       

        {/* QR Code */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Scan QR Code</h3>
              <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200" id="qr-code">
                <QRCode value={celestiaAddress} size={200} />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Celestia Wallet Address
              </h3>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono break-all">{celestiaAddress}</code>
                <button 
                  onClick={() => copyToClipboard(celestiaAddress)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="alert alert-warning shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span>Only send Celestia tokens to this address</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={handleShare} className="btn btn-outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </button>
          <button onClick={handleDownload} className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>

        {/* Network Info */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-4">
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-accent-content" />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Celestia</h4>
                <p className="text-sm text-gray-600">On-Chain Celestia Wallet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
