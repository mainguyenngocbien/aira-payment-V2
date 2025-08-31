import { useState, useEffect } from 'react';
import logger from '../lib/logger';


export type Network = 'base-mainnet' | 'base-sepolia' | 'olym3-testnet' | 'bnb-chain' | 'polygon';

export const NETWORKS = {
  'base-mainnet': { name: 'Base Mainnet', symbol: 'ETH' },
  'base-sepolia': { name: 'Base Sepolia Testnet', symbol: 'ETH' },
  'olym3-testnet': { name: 'Olym3 Testnet', symbol: 'OLYM' },
  'bnb-chain': { name: 'BNB Chain', symbol: 'BNB' },
  'polygon': { name: 'Polygon', symbol: 'MATIC' }
};

const NETWORK_STORAGE_KEY = 'aira-selected-network';

export function useNetwork() {
  const [selectedNetwork, setSelectedNetwork] = useState<Network>('base-mainnet');
  const [isLoading, setIsLoading] = useState(true);

  // Load network from localStorage on mount
  useEffect(() => {
    const savedNetwork = localStorage.getItem(NETWORK_STORAGE_KEY);
    if (savedNetwork && Object.keys(NETWORKS).includes(savedNetwork)) {
      setSelectedNetwork(savedNetwork as Network);
    }
    setIsLoading(false);
  }, []);

  // Save network to localStorage when it changes
  const updateNetwork = (network: Network) => {
    logger.log(`🌐 Network changed from ${selectedNetwork} to ${network}`);
    setSelectedNetwork(network);
    localStorage.setItem(NETWORK_STORAGE_KEY, network);
  };

  return {
    selectedNetwork,
    setSelectedNetwork: updateNetwork,
    isLoading,
    NETWORKS
  };
}
