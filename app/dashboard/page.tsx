'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNetwork, type Network } from '@/hooks/useNetwork';
import { useBalance } from '@/hooks/useBalance';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import logger from '@/lib/logger';
import DepositModal from '@/components/DepositModal';
import apiService from '@/lib/apiService';

// Mock transaction data
const mockTransactions = [
  {
    id: 1,
    date: '2025-08-30',
    type: 'Deposit',
    amount: '100 USDT',
    status: 'Completed'
  },
  {
    id: 2,
    date: '2025-08-29',
    type: 'Withdraw',
    amount: '50 USDT',
    status: 'Pending'
  },
  {
    id: 3,
    date: '2025-08-28',
    type: 'Deposit',
    amount: '200 USDT',
    status: 'Completed'
  }
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { selectedNetwork, setSelectedNetwork, NETWORKS } = useNetwork();
  const { balance, loading: balanceLoading, error: balanceError, refreshBalance, walletAddress } = useBalance();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [allBalances, setAllBalances] = useState<{[key: string]: {balance: string, loading: boolean, error: string | null}}>({});
  const [scanningAll, setScanningAll] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Redirect to login if not authenticated or email not verified
  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    } else if (!loading && user && !user.emailVerified) {
      logger.log('User not verified, redirecting to verification page...');
      router.push('/verify-email');
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good morning!';
    if (hour < 17) return 'Good afternoon!';
    return 'Good evening!';
  };

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  // Scan all chains for USDT balance
  const scanAllChains = useCallback(async () => {
    if (!walletAddress) return;
    
    setScanningAll(true);
    const newBalances: {[key: string]: {balance: string, loading: boolean, error: string | null}} = {};
    
    // Initialize all networks with loading state
    Object.keys(NETWORKS).forEach(network => {
      newBalances[network] = { balance: '0', loading: true, error: null };
    });
    setAllBalances(newBalances);
    
    // Fetch balance for each network
    const promises = Object.keys(NETWORKS).map(async (network) => {
      try {
        logger.log(`🔍 Scanning ${network} for wallet: ${walletAddress}`);
        const balanceInfo = await apiService.getUSDTBalance(walletAddress, network);
        logger.log(`✅ ${network} balance: ${balanceInfo.balanceInEth} USDT`);
        
        setAllBalances(prev => ({
          ...prev,
          [network]: { 
            balance: balanceInfo.balanceInEth, 
            loading: false, 
            error: null 
          }
        }));
      } catch (err) {
        logger.error(`❌ Failed to fetch ${network} balance:`, err);
        setAllBalances(prev => ({
          ...prev,
          [network]: { 
            balance: '0', 
            loading: false, 
            error: 'Failed to fetch' 
          }
        }));
      }
    });
    
    await Promise.all(promises);
    setScanningAll(false);
  }, [walletAddress, NETWORKS]);

  // Auto-scan when wallet address changes or network changes
  useEffect(() => {
    if (walletAddress) {
      scanAllChains();
    }
  }, [walletAddress, selectedNetwork, scanAllChains]);

  // Get explorer link for each network
  const getExplorerLink = (network: string, address: string) => {
    const contractAddresses = {
      'base-mainnet': '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb',
      'base-sepolia': '0x0a215d8ba66387dca84b284d18c3b4ec3de6e54a',
      'olym3-testnet': '0x0a215d8ba66387dca84b284d18c3b4ec3de6e54a',
      'bnb-chain': '0x55d398326f99059fF775485246999027B3197955',
      'polygon': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'
    };
    
    const baseUrls = {
      'base-mainnet': 'https://basescan.org/token',
      'base-sepolia': 'https://sepolia.basescan.org/token',
      'olym3-testnet': 'https://sepolia.basescan.org/token',
      'bnb-chain': 'https://bscscan.com/token',
      'polygon': 'https://polygonscan.com/token'
    };
    
    const contractAddress = contractAddresses[network as keyof typeof contractAddresses];
    const baseUrl = baseUrls[network as keyof typeof baseUrls];
    
    return `${baseUrl}/${contractAddress}?a=${address}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Enhanced Header with Mobile-Optimized Layout */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg max-w-md mx-auto">
        <div className="p-4">
          {/* Top Row - User Info & Actions */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="avatar">
                <div className="w-12 h-12 rounded-full ring-2 ring-white ring-opacity-30">
                  <img 
                    src="https://i.pravatar.cc/100?img=1" 
                    alt="User avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-blue-100 font-medium">{getGreeting()}</p>
                <h1 className="text-lg font-bold text-white">
                  {getUserDisplayName()}
                </h1>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button className="btn btn-circle btn-sm bg-white bg-opacity-20 hover:bg-opacity-30 border-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 4v6h-2V4h2zM4 4v6h2V4H4z" />
                </svg>
              </button>
              <button className="btn btn-circle btn-sm bg-white bg-opacity-20 hover:bg-opacity-30 border-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4 19h6v-2H4v2zM20 4v6h-2V4h2zM4 4v6h2V4H4z" />
                </svg>
              </button>
              <button 
                onClick={handleSignOut}
                className="btn btn-circle btn-sm bg-white bg-opacity-20 hover:bg-opacity-30 border-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Bottom Row - Quick Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-xs text-blue-100">Balance</p>
                <p className="text-sm font-semibold">
                  {balanceLoading ? (
                    <div className="loading loading-spinner loading-xs"></div>
                  ) : balanceError ? (
                    'Error'
                  ) : balance ? (
                    `${parseFloat(balance.balanceInEth).toFixed(2)} USDT`
                  ) : (
                    '0 USDT'
                  )}
                </p>
                {balance && (
                  <p className="text-xs text-blue-100 opacity-70">
                    {balance.network}
                  </p>
                )}
              </div>
              <div className="text-center">
                <p className="text-xs text-blue-100">Today</p>
                <p className="text-sm font-semibold">+0</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="badge badge-success badge-sm">Active</div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Chain Selection */}
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <p className="text-xs text-blue-100">Network</p>
              <select 
                value={selectedNetwork}
                onChange={(e) => {
                  logger.log(`🎯 Network selector changed to: ${e.target.value}`);
                  setSelectedNetwork(e.target.value as Network);
                }}
                className="select select-bordered select-xs bg-white bg-opacity-20 text-white border-white border-opacity-30 text-xs"
              >
                {Object.entries(NETWORKS).map(([key, network]) => (
                  <option key={key} value={key} className="text-readable-primary">
                    {network.name} ({network.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Enhanced Wallet Card */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            {/* Card Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="badge badge-primary bg-blue-600 border-0">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                  </svg>
                  Default Wallet
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <button className="btn btn-ghost btn-sm text-readable-secondary hover:bg-base-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {/* Balance Display */}
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 relative">
                <button 
                  onClick={refreshBalance}
                  disabled={balanceLoading}
                  className="absolute top-2 right-2 btn btn-ghost btn-sm btn-circle"
                >
                  <svg className={`w-4 h-4 ${balanceLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <p className="text-sm text-readable-secondary mb-1">Available Balance</p>
                <h2 className="text-3xl font-bold text-readable-primary mb-2">
                  {balanceLoading || scanningAll ? (
                    <div className="loading loading-spinner loading-md"></div>
                  ) : balanceError ? (
                    'Error'
                  ) : (
                    `${(() => {
                      const totalBalance = Object.values(allBalances).reduce((total, balanceData) => {
                        return total + parseFloat(balanceData?.balance || '0');
                      }, 0);
                      return totalBalance.toFixed(2);
                    })()} USDT`
                  )}
                </h2>
                <div className="flex items-center justify-center space-x-2 text-readable-muted">
                  <span className="text-sm">
                    {balanceLoading || scanningAll ? 'Loading...' : balanceError ? 'Error' : (() => {
                      const totalBalance = Object.values(allBalances).reduce((total, balanceData) => {
                        return total + parseFloat(balanceData?.balance || '0');
                      }, 0);
                      return `≈ ${(totalBalance * 25000).toFixed(0)} VND`;
                    })()}
                  </span>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-center mt-2">
                  <p className="text-xs text-readable-muted">
                    Total Across All Networks | Last Updated: {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsDepositModalOpen(true)}
                className="btn btn-primary bg-blue-600 hover:bg-blue-700 border-0 text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Deposit
              </button>
              <button className="btn btn-outline border-blue-600 text-blue-600 hover:bg-blue-50">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6H6m6 0h6" />
                </svg>
                Withdraw
              </button>
            </div>
            
            {/* Multi-Chain Balance Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-readable-secondary font-medium">Multi-Chain USDT Balance:</p>
                <button 
                  onClick={scanAllChains}
                  disabled={scanningAll}
                  className="btn btn-ghost btn-xs text-blue-600 hover:bg-blue-50"
                >
                  <svg className={`w-3 h-3 ${scanningAll ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {scanningAll ? 'Scanning...' : 'Refresh All'}
                </button>
              </div>
              
              <div className="space-y-2">
                {Object.entries(NETWORKS).map(([networkKey, networkInfo]) => {
                  const balanceData = allBalances[networkKey];
                  const isLoading = balanceData?.loading || false;
                  const balance = balanceData?.balance || '0';
                  const error = balanceData?.error;
                  
                  return (
                    <div key={networkKey} className="flex items-center justify-between">
                      <span className="text-xs text-readable-secondary">
                        {networkInfo.name}:
                      </span>
                      <div className="flex items-center space-x-2">
                        {isLoading ? (
                          <div className="loading loading-spinner loading-xs"></div>
                        ) : error ? (
                          <span className="text-xs text-red-500">Error</span>
                        ) : (
                          <a
                            href={getExplorerLink(networkKey, walletAddress || '')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {parseFloat(balance).toFixed(2)} USDT
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {walletAddress && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <p className="text-xs text-readable-muted">
                    Wallet: {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Transaction History */}
        <div className="card bg-white shadow-lg border-0">
          <div className="card-body p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-readable-primary">
                Recent Transactions
              </h3>
              <button className="btn btn-ghost btn-sm text-blue-600 hover:bg-blue-50">
                View All
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="space-y-4">
              {mockTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-base-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'Deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {transaction.type === 'Deposit' ? (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        ) : (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6H6m6 0h6" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-readable-primary">{transaction.type}</p>
                      <p className="text-sm text-readable-muted">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.type === 'Deposit' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {transaction.type === 'Deposit' ? '+' : '-'}{transaction.amount}
                    </p>
                    <div className={`badge badge-sm ${
                      transaction.status === 'Completed' 
                        ? 'badge-success bg-green-100 text-green-600 border-0' 
                        : 'badge-warning bg-yellow-100 text-yellow-600 border-0'
                    }`}>
                      {transaction.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Bottom Navigation */}
      <div className="btm-nav bg-white border-t border-gray-200 shadow-lg max-w-md mx-auto">
        <button className="active text-blue-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span className="btm-nav-label text-xs font-medium">Home</span>
        </button>
        
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full w-16 h-16 -mt-8 shadow-xl border-4 border-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 11-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 012 0v1.586l2.293-2.293a1 1 0 111.414 1.414L6.414 15H8a1 1 0 010 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 010-2h1.586l-2.293-2.293a1 1 0 111.414-1.414L15 13.586V12a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        <button className="text-readable-secondary">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          <span className="btm-nav-label text-xs font-medium">Account</span>
        </button>
      </div>

      {/* Deposit Modal */}
      <DepositModal 
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        userName={getUserDisplayName()}
        userAvatar="https://i.pravatar.cc/100?img=1"
      />
    </div>
  );
}
