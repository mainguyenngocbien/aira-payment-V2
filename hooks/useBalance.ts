import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNetwork } from './useNetwork';
import apiService from '@/lib/apiService';
import logger from '@/lib/logger';

export interface BalanceInfo {
  address: string;
  balance: string;
  balanceInEth: string;
  symbol: string;
  decimals: number;
  network: string;
  lastUpdated: string;
}

export function useBalance() {
  const { user } = useAuth();
  const { selectedNetwork } = useNetwork();
  const [balance, setBalance] = useState<BalanceInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Get wallet address for the user
  useEffect(() => {
    const getWalletAddress = async () => {
      if (!user?.email) {
        logger.log('No user email available, skipping wallet address fetch');
        return;
      }

      logger.log(`Getting wallet address for user: ${user.email}`);
      try {
        const walletInfo = await apiService.getOrCreateWallet(user.email);
        logger.log('EVM wallet address fetched successfully:', walletInfo.evmWallet);
        setWalletAddress(walletInfo.evmWallet);
      } catch (err) {
        logger.error('Failed to get wallet address:', err);
        setError('Failed to load wallet address');
      }
    };

    getWalletAddress();
  }, [user?.email]);

  // Fetch balance when network or wallet address changes
  useEffect(() => {
    const fetchBalance = async () => {
      if (!walletAddress) {
        logger.log('No wallet address available, skipping balance fetch');
        return;
      }

      logger.log(`🔄 Fetching balance for wallet: ${walletAddress} on network: ${selectedNetwork}`);
      setLoading(true);
      setError(null);

      try {
        const balanceInfo = await apiService.getUSDTBalance(walletAddress, selectedNetwork);
        logger.log('✅ Balance fetched successfully:', balanceInfo);
        setBalance(balanceInfo);
      } catch (err) {
        logger.error('❌ Failed to fetch balance:', err);
        setError('Failed to load balance');
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [walletAddress, selectedNetwork]);

  // Refresh balance manually
  const refreshBalance = async () => {
    if (!walletAddress) return;

    setLoading(true);
    setError(null);

    try {
      const balanceInfo = await apiService.getUSDTBalance(walletAddress, selectedNetwork);
      setBalance(balanceInfo);
    } catch (err) {
      logger.error('Failed to refresh balance:', err);
      setError('Failed to refresh balance');
    } finally {
      setLoading(false);
    }
  };

  return {
    balance,
    loading,
    error,
    walletAddress,
    refreshBalance
  };
}
