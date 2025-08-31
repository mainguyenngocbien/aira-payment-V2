import Web3 from 'web3';

// USDT Contract ABI (ERC20 standard)
const USDT_ABI = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "decimals",
    "outputs": [{"name": "", "type": "uint8"}],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "symbol",
    "outputs": [{"name": "", "type": "string"}],
    "type": "function"
  }
];

// Network Configurations
const NETWORK_CONFIGS = {
  'base-mainnet': {
    rpc: 'https://mainnet.base.org',
    usdtContract: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', // USDT on Base Mainnet
    name: 'Base Mainnet'
  },
  'base-sepolia': {
    rpc: 'https://sepolia.base.org',
    usdtContract: '0x0a215d8ba66387dca84b284d18c3b4ec3de6e54a', // USDT on Base Sepolia
    name: 'Base Sepolia Testnet'
  },
  'olym3-testnet': {
    rpc: 'https://sepolia.base.org', // Using Base Sepolia as fallback since Olym3 RPC is not available
    usdtContract: '0x0a215d8ba66387dca84b284d18c3b4ec3de6e54a', // Using Base Sepolia USDT contract
    name: 'Olym3 Testnet'
  },
  'bnb-chain': {
    rpc: 'https://bsc-dataseed1.binance.org',
    usdtContract: '0x55d398326f99059fF775485246999027B3197955', // USDT on BNB Chain
    name: 'BNB Chain'
  },
  'polygon': {
    rpc: 'https://polygon-rpc.com',
    usdtContract: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // USDT on Polygon
    name: 'Polygon'
  }
};

export interface BalanceInfo {
  address: string;
  balance: string;
  balanceInEth: string;
  symbol: string;
  decimals: number;
  network: string;
  lastUpdated: string;
}

export class BalanceService {
  private web3Instances: { [key: string]: Web3 } = {};
  private usdtContracts: { [key: string]: any } = {};

  constructor() {
    // Initialize Web3 instances and contracts for all networks
    Object.entries(NETWORK_CONFIGS).forEach(([network, config]) => {
      this.web3Instances[network] = new Web3(config.rpc);
      this.usdtContracts[network] = new this.web3Instances[network].eth.Contract(USDT_ABI, config.usdtContract);
      
      // Note: Web3.js v4 doesn't support timeout in setConfig
      // Timeout will be handled by the fetch request itself
    });
  }

  /**
   * Get USDT balance for a specific address on a specific network
   */
  async getUSDTBalance(address: string, network: string = 'base-sepolia'): Promise<BalanceInfo> {
    try {
      // Validate network
      if (!NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS]) {
        throw new Error(`Unsupported network: ${network}`);
      }

      const web3 = this.web3Instances[network];
      const usdtContract = this.usdtContracts[network];
      const networkConfig = NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS];

      if (!web3 || !usdtContract) {
        throw new Error(`Web3 instance not initialized for network: ${network}`);
      }

      // Validate address format
      if (!web3.utils.isAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Get USDT balance
      const balance = await usdtContract.methods.balanceOf(address).call();
      
      // Get token decimals
      const decimals = await usdtContract.methods.decimals().call();
      
      // Get token symbol
      const symbol = await usdtContract.methods.symbol().call();

      // Convert balance to human readable format
      // USDT has 6 decimals, so we need to divide by 10^6
      const tokenDecimals = parseInt(decimals);
      const balanceInEth = (parseInt(balance) / Math.pow(10, tokenDecimals)).toString();

      return {
        address: address.toLowerCase(),
        balance: balance.toString(),
        balanceInEth: balanceInEth,
        symbol: symbol,
        decimals: parseInt(decimals),
        network: networkConfig.name,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting USDT balance:', error);
      
      // Return a default balance response instead of throwing
      return {
        address: address.toLowerCase(),
        balance: '0',
        balanceInEth: '0',
        symbol: 'USDT',
        decimals: 6,
        network: NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS].name,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  /**
   * Get USDT balances for multiple addresses on a specific network
   */
  async getMultipleUSDTBalances(addresses: string[], network: string = 'base-sepolia'): Promise<BalanceInfo[]> {
    try {
      const balancePromises = addresses.map(address => this.getUSDTBalance(address, network));
      const balances = await Promise.all(balancePromises);
      return balances;
    } catch (error) {
      console.error('Error getting multiple USDT balances:', error);
      throw new Error(`Failed to get multiple USDT balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get ETH balance for a specific address on a specific network
   */
  async getETHBalance(address: string, network: string = 'base-sepolia'): Promise<BalanceInfo> {
    try {
      // Validate network
      if (!NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS]) {
        throw new Error(`Unsupported network: ${network}`);
      }

      const web3 = this.web3Instances[network];
      const networkConfig = NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS];

      if (!web3) {
        throw new Error(`Web3 instance not initialized for network: ${network}`);
      }

      // Validate address format
      if (!web3.utils.isAddress(address)) {
        throw new Error('Invalid Ethereum address format');
      }

      // Get ETH balance
      const balance = await web3.eth.getBalance(address);
      const balanceInEth = web3.utils.fromWei(balance, 'ether');

      return {
        address: address.toLowerCase(),
        balance: balance.toString(),
        balanceInEth: balanceInEth,
        symbol: 'ETH',
        decimals: 18,
        network: networkConfig.name,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error getting ETH balance:', error);
      throw new Error(`Failed to get ETH balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get both ETH and USDT balances for an address on a specific network
   */
  async getAllBalances(address: string, network: string = 'base-sepolia'): Promise<{ eth: BalanceInfo; usdt: BalanceInfo }> {
    try {
      const [ethBalance, usdtBalance] = await Promise.all([
        this.getETHBalance(address, network),
        this.getUSDTBalance(address, network)
      ]);

      return {
        eth: ethBalance,
        usdt: usdtBalance
      };
    } catch (error) {
      console.error('Error getting all balances:', error);
      throw new Error(`Failed to get all balances: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check if address has any USDT balance on a specific network
   */
  async hasUSDTBalance(address: string, network: string = 'base-sepolia'): Promise<boolean> {
    try {
      const balance = await this.getUSDTBalance(address, network);
      return parseFloat(balance.balanceInEth) > 0;
    } catch (error) {
      console.error('Error checking USDT balance:', error);
      return false;
    }
  }

  /**
   * Get network information for a specific network
   */
  async getNetworkInfo(network: string = 'base-sepolia'): Promise<{ network: string; rpc: string; chainId: number }> {
    try {
      // Validate network
      if (!NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS]) {
        throw new Error(`Unsupported network: ${network}`);
      }

      const web3 = this.web3Instances[network];
      const networkConfig = NETWORK_CONFIGS[network as keyof typeof NETWORK_CONFIGS];
      
      if (!web3) {
        throw new Error(`Web3 instance not initialized for network: ${network}`);
      }
      
      const chainId = await web3.eth.getChainId();
      
      return {
        network: networkConfig.name,
        rpc: networkConfig.rpc,
        chainId: Number(chainId)
      };
    } catch (error) {
      console.error('Error getting network info:', error);
      throw new Error(`Failed to get network info: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new BalanceService();
