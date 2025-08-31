'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import QRCode from 'react-qr-code';
import { X, Copy, Share, Download, ArrowLeft, User, Wallet } from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userAvatar?: string;
}

type DepositStep = 'method' | 'aira-users' | 'on-chain';
type Network = 'base-mainnet' | 'base-sepolia' | 'olym3-testnet' | 'bnb-chain' | 'polygon';

const NETWORKS = {
  'base-mainnet': { name: 'Base Mainnet', symbol: 'ETH' },
  'base-sepolia': { name: 'Base Sepolia Testnet', symbol: 'ETH' },
  'olym3-testnet': { name: 'Olym3 Testnet', symbol: 'OLYM' },
  'bnb-chain': { name: 'BNB Chain', symbol: 'BNB' },
  'polygon': { name: 'Polygon', symbol: 'MATIC' }
};

export default function DepositModal({ isOpen, onClose, userName = 'Web3', userAvatar }: DepositModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<DepositStep>('method');
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('base-mainnet');

  // Mock addresses
  const airaWalletAddress = '33xfv36386yj8k9m2l5p7q1r3s4t5u6v7w8x9y0z';
  const onChainAddresses = {
    'base-mainnet': '0x930f1c8e5b6a7d9e2f1g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0acd9',
    'base-sepolia': '0x1234567890abcdef1234567890abcdef12345678',
    'olym3-testnet': '0xabcdef1234567890abcdef1234567890abcdef12',
    'bnb-chain': '0x9876543210fedcba9876543210fedcba98765432',
    'polygon': '0x1111111111111111111111111111111111111111'
  };

  const handleClose = () => {
    setCurrentStep('method');
    onClose();
  };

  const handleBack = () => {
    setCurrentStep('method');
  };

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

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-md relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            {currentStep !== 'method' && (
              <button onClick={handleBack} className="btn btn-ghost btn-sm btn-circle">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className="text-lg font-bold">
              {currentStep === 'method' && 'Select Deposit Method'}
              {currentStep === 'aira-users' && 'Aira Users Deposit'}
              {currentStep === 'on-chain' && 'On-Chain EVM Deposit'}
            </h3>
          </div>
          <button onClick={handleClose} className="btn btn-ghost btn-sm btn-circle">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Method Selection */}
        {currentStep === 'method' && (
          <div className="space-y-4">
            {/* Aira ID Option */}
            <div 
              onClick={() => router.push('/receive/system')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-5 h-5 text-primary-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">Aira ID</h4>
                    <p className="text-sm text-base-content/70">Aira internal receive, sent via Email/ID</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain EVM Option */}
            <div 
              onClick={() => router.push('/receive/on-chain')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-secondary-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">On-Chain EVM Wallet</h4>
                    <p className="text-sm text-base-content/70">Deposit crypto from Aira Wallet to other wallets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain Celestia Option */}
            <div 
              onClick={() => router.push('/receive/celestia')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-accent-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">On-Chain Celestia Wallet</h4>
                    <p className="text-sm text-base-content/70">Deposit crypto from Aira Wallet to other wallets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain Solana Option */}
            <div 
              onClick={() => router.push('/receive/solana')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-info flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-info-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">On-Chain Solana Wallet</h4>
                    <p className="text-sm text-base-content/70">Deposit crypto from Aira Wallet to other wallets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain Aptos Option */}
            <div 
              onClick={() => router.push('/receive/aptos')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-success-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">On-Chain Aptos Wallet</h4>
                    <p className="text-sm text-base-content/70">Deposit crypto from Aira Wallet to other wallets</p>
                  </div>
                </div>
              </div>
            </div>

            {/* On-Chain SUI Option */}
            <div 
              onClick={() => router.push('/receive/sui')}
              className="card bg-base-100 border-2 border-base-300 hover:border-primary cursor-pointer transition-colors"
            >
              <div className="card-body p-4">
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="w-10 h-10 rounded-full bg-warning flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-warning-content" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base">On-Chain SUI Wallet</h4>
                    <p className="text-sm text-base-content/70">Deposit crypto from Aira Wallet to other wallets</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Aira Users QR */}
        {currentStep === 'aira-users' && (
          <div className="space-y-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 p-4 bg-base-200 rounded-lg">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} />
                  ) : (
                    <div className="bg-primary flex items-center justify-center text-primary-content font-semibold">
                      {userName.charAt(0)}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold">{userName}&apos;s wallet</h4>
                <p className="text-sm text-base-content/70">Aira Internal Wallet</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg" id="qr-code">
              <QRCode value={airaWalletAddress} size={200} />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-sm text-base-content/70">Wallet Address:</p>
              <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                <code className="flex-1 text-sm font-mono truncate">{airaWalletAddress}</code>
                <button 
                  onClick={() => copyToClipboard(airaWalletAddress)}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="alert alert-warning">
              <span className="text-sm">Only send USDT to this account</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button className="btn btn-outline btn-sm">
                Set the money
              </button>
              <button onClick={handleShare} className="btn btn-outline btn-sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </button>
              <button onClick={handleDownload} className="btn btn-outline btn-sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        )}

        {/* Step 3: On-Chain Wallet QR */}
        {currentStep === 'on-chain' && (
          <div className="space-y-6">
            {/* Network Selection */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Select Network</span>
              </label>
              <select 
                value={selectedNetwork}
                onChange={(e) => setSelectedNetwork(e.target.value as Network)}
                className="select select-bordered w-full"
              >
                {Object.entries(NETWORKS).map(([key, network]) => (
                  <option key={key} value={key}>
                    {network.name} ({network.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* QR Code */}
            <div className="flex justify-center p-6 bg-white rounded-lg" id="qr-code">
              <QRCode value={onChainAddresses[selectedNetwork]} size={200} />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <p className="text-sm text-base-content/70">EVM Wallet Address ({NETWORKS[selectedNetwork].symbol}):</p>
              <div className="flex items-center space-x-2 p-3 bg-base-200 rounded-lg">
                <code className="flex-1 text-sm font-mono truncate">{onChainAddresses[selectedNetwork]}</code>
                <button 
                  onClick={() => copyToClipboard(onChainAddresses[selectedNetwork])}
                  className="btn btn-ghost btn-sm btn-circle"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Warning */}
            <div className="alert alert-warning">
              <span className="text-sm">Only send USDT to this address</span>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleShare} className="btn btn-outline btn-sm">
                <Share className="w-4 h-4 mr-1" />
                Share
              </button>
              <button onClick={handleDownload} className="btn btn-outline btn-sm">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}
