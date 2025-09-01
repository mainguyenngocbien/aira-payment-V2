'use client';

import { useState, useEffect } from 'react';
import logger from '../../../lib/logger';

import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { ArrowLeft, Copy, Share, Download, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import apiService from '@/lib/apiService';

export default function SystemReceivePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [airaId, setAiraId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  
  // Get Aira ID from backend
  const userName = user?.displayName || user?.email?.split('@')[0] || 'Web3';

  // Get Aira ID from backend
  useEffect(() => {
    const getAiraId = async () => {
      if (!user?.email) {
        setLoading(false);
        return;
      }

      try {
        const walletInfo = await apiService.getOrCreateWallet(user.email);
        setAiraId(walletInfo.airaId);
        setLoading(false);
      } catch (err) {
        logger.error('Failed to get Aira ID:', err);
        setLoading(false);
      }
    };

    getAiraId();
  }, [user?.email]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Toast notification could be added here
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

  // Show loading while checking authentication or loading Aira ID
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-[#044aad]">
            {authLoading ? 'Checking authentication...' : 'Loading Aira ID...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.back()}
              className="btn btn-ghost btn-sm btn-circle"
            > 
              <ArrowLeft className="w-5 h-5" />
            </button> 
            <h1 className="text-lg font-bold text-[#044aad]">Aira ID Deposit</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* User Info */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
              <div className="avatar">
                <div className="w-16 h-16 rounded-full">
                  <div className="bg-primary flex items-center justify-center text-primary-content font-semibold text-xl">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
                              <div>
                  <h2 className="text-xl font-bold text-[#044aad]">{userName}&apos;s ID</h2>
                  <p className="text-sm text-[#044aad]">Aira ID: {airaId}</p>
                </div>
            </div>
          </div>
        </div>


        {/* QR Code */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold text-[#044aad]">Scan QR Code</h3>
              <div className="flex justify-center p-6 bg-white rounded-lg border-2 border-gray-200" id="qr-code">
                <QRCode value={airaId} size={200} />
              </div>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-[#044aad]">Aira ID Address</h3>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <code className="flex-1 text-sm font-mono break-all">{airaId}</code>
                <button 
                  onClick={() => copyToClipboard(airaId)}
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
          <span>Only send USDT to this Aira ID</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <button className="btn btn-outline btn-primary">
            Set the money
          </button>
          <button onClick={handleShare} className="btn btn-outline">
            <Share className="w-4 h-4 mr-2" />
            Share
          </button>
          <button onClick={handleDownload} className="btn btn-outline">
            <Download className="w-4 h-4 mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
}
