import logger from './logger';
// API Service for calling backend endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiaira.olym3.xyz:7003/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface FirebaseConfig {
  authDomain: string;
  projectId: string;
  measurementId?: string;
}

export interface FirebaseAuthInfo {
  authAvailable: boolean;
  currentDomain: string;
  currentPort: string;
  userAgent: string;
  timestamp: string;
}

export interface SessionInfo {
  sessionId: string;
  authUrl: string;
  user: string;
  userId: string;
  emailVerified: boolean;
  timestamp: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface AccountStatus {
  active: boolean;
  lastActive: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    logger.log(`Making API request to: ${url}`);
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // Add security header
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, defaultOptions);
      
      logger.log(`API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        logger.error(`API request failed with status ${response.status}:`, errorText);
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      logger.log('API response data:', data);
      return data;
    } catch (error) {
      logger.error('API request failed:', error);
      logger.error('API request failed');
      throw error;
    }
  }

  // Firebase Configuration
  async getFirebaseConfig(): Promise<FirebaseConfig> {
    const response = await this.request<FirebaseConfig>('/firebase/config');
    return response.data;
  }

  async getFirebaseAuthInfo(): Promise<FirebaseAuthInfo> {
    const response = await this.request<FirebaseAuthInfo>('/firebase/auth-info');
    return response.data;
  }

  async validateFirebaseConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const response = await this.request<{ valid: boolean; errors: string[] }>('/firebase/validate-config');
    return response.data;
  }

  // Session Management
  async generateSessionInfo(userId: string, email: string, emailVerified: boolean): Promise<SessionInfo> {
    const response = await this.request<SessionInfo>('/firebase/session', {
      method: 'POST',
      body: JSON.stringify({ userId, email, emailVerified }),
    });
    return response.data;
  }

  // Wallet Manager
  async getOrCreateWallet(email: string): Promise<{ 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId: string 
  }> {
    const response = await this.request<{ 
      evmWallet: string; 
      celestiaWallet: string; 
      solanaWallet: string; 
      aptosWallet: string; 
      suiWallet: string; 
      mnemonic: string; 
      airaId: string 
    }>('/wallet-manager/wallet', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return response.data;
  }

  async getWalletByEmail(email: string): Promise<{ 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId: string 
  }> {
    const response = await this.request<{ 
      evmWallet: string; 
      celestiaWallet: string; 
      solanaWallet: string; 
      aptosWallet: string; 
      suiWallet: string; 
      mnemonic: string; 
      airaId: string 
    }>(`/wallet-manager/wallet/${email}`, {
      method: 'GET',
    });
    return response.data;
  }

  async getAllWallets(): Promise<Array<{ 
    email: string; 
    evmWallet: string; 
    celestiaWallet: string; 
    solanaWallet: string; 
    aptosWallet: string; 
    suiWallet: string; 
    mnemonic: string; 
    airaId?: string 
  }>> {
    const response = await this.request<Array<{ 
      email: string; 
      evmWallet: string; 
      celestiaWallet: string; 
      solanaWallet: string; 
      aptosWallet: string; 
      suiWallet: string; 
      mnemonic: string; 
      airaId?: string 
    }>>('/wallet-manager/wallets', {
      method: 'GET',
    });
    return response.data;
  }

  async deleteWallet(email: string): Promise<void> {
    await this.request<void>(`/wallet-manager/wallet/${email}`, {
      method: 'DELETE',
    });
  }

  // Balance Queries
  async getUSDTBalance(address: string, network?: string): Promise<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }> {
    const url = network ? `/balance/usdt/${address}?network=${network}` : `/balance/usdt/${address}`;
    const response = await this.request<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }>(url, {
      method: 'GET',
    });
    return response.data;
  }

  async getETHBalance(address: string, network?: string): Promise<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }> {
    const url = network ? `/balance/eth/${address}?network=${network}` : `/balance/eth/${address}`;
    const response = await this.request<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }>(url, {
      method: 'GET',
    });
    return response.data;
  }

  async getAllBalances(address: string, network?: string): Promise<{ eth: { address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }; usdt: { address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string } }> {
    const url = network ? `/balance/all/${address}?network=${network}` : `/balance/all/${address}`;
    const response = await this.request<{ eth: { address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }; usdt: { address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string } }>(url, {
      method: 'GET',
    });
    return response.data;
  }

  async getMultipleUSDTBalances(addresses: string[], network?: string): Promise<Array<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }>> {
    const url = network ? `/balance/usdt/multiple?network=${network}` : '/balance/usdt/multiple';
    const response = await this.request<Array<{ address: string; balance: string; balanceInEth: string; symbol: string; decimals: number; network: string; lastUpdated: string }>>(url, {
      method: 'POST',
      body: JSON.stringify({ addresses }),
    });
    return response.data;
  }

  async hasUSDTBalance(address: string, network?: string): Promise<{ address: string; hasBalance: boolean }> {
    const url = network ? `/balance/usdt/${address}/has-balance?network=${network}` : `/balance/usdt/${address}/has-balance`;
    const response = await this.request<{ address: string; hasBalance: boolean }>(url, {
      method: 'GET',
    });
    return response.data;
  }

  async getNetworkInfo(network?: string): Promise<{ network: string; rpc: string; chainId: number }> {
    const url = network ? `/balance/network-info?network=${network}` : '/balance/network-info';
    const response = await this.request<{ network: string; rpc: string; chainId: number }>(url, {
      method: 'GET',
    });
    return response.data;
  }

  // Authentication (Proxy to Firebase)
  async signInWithGoogle(idToken: string): Promise<{ user: UserProfile; token: string; emailVerified: boolean }> {
    const response = await this.request<{ user: UserProfile; token: string; emailVerified: boolean }>('/auth/signin/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    return response.data;
  }

  async signInWithApple(idToken: string): Promise<{ user: UserProfile; token: string; emailVerified: boolean }> {
    const response = await this.request<{ user: UserProfile; token: string; emailVerified: boolean }>('/auth/signin/apple', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    return response.data;
  }

  async signInWithEmail(email: string, password: string): Promise<{ user: UserProfile; token: string; emailVerified: boolean }> {
    const response = await this.request<{ user: UserProfile; token: string; emailVerified: boolean }>('/auth/signin/email', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return response.data;
  }

  async signUpWithEmail(email: string, password: string, displayName?: string): Promise<{ user: UserProfile; token: string; emailVerified: boolean }> {
    const response = await this.request<{ user: UserProfile; token: string; emailVerified: boolean }>('/auth/signup/email', {
      method: 'POST',
      body: JSON.stringify({ email, password, displayName }),
    });
    return response.data;
  }

  async verifyEmail(idToken: string): Promise<{ success: boolean }> {
    const response = await this.request<{ success: boolean }>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
    return response.data;
  }

  // User Management
  async getUserProfile(userId: string): Promise<UserProfile> {
    const response = await this.request<UserProfile>(`/firebase/user/${userId}`);
    return response.data;
  }

  async getAccountStatus(userId: string): Promise<AccountStatus> {
    const response = await this.request<AccountStatus>(`/firebase/user/${userId}/status`);
    return response.data;
  }

  // Legacy endpoints (for backward compatibility)
  async getUserMe(): Promise<UserProfile> {
    const response = await this.request<UserProfile>('/user/me');
    return response.data;
  }

  async getAccountActive(): Promise<AccountStatus> {
    const response = await this.request<AccountStatus>('/user/account/active');
    return response.data;
  }

  // Wallet endpoints
  async getWalletBalance(currency: string): Promise<{ balance: number; currency: string; lastUpdated: string }> {
    const response = await this.request<{ balance: number; currency: string; lastUpdated: string }>(`/wallet/balance/${currency}`);
    return response.data;
  }

  async getAllWalletBalances(): Promise<Array<{ balance: number; currency: string; lastUpdated: string }>> {
    const response = await this.request<Array<{ balance: number; currency: string; lastUpdated: string }>>('/wallet/balance');
    return response.data;
  }

  // Currency endpoints
  async getCurrencyRate(fromCurrency: string, toCurrency: string): Promise<{ rate: number; fromCurrency: string; toCurrency: string; lastUpdated: string }> {
    const response = await this.request<{ rate: number; fromCurrency: string; toCurrency: string; lastUpdated: string }>(`/currency/rate/${fromCurrency}/${toCurrency}`);
    return response.data;
  }

  async getCurrencyRates(baseCurrency: string): Promise<Array<{ rate: number; fromCurrency: string; toCurrency: string; lastUpdated: string }>> {
    const response = await this.request<Array<{ rate: number; fromCurrency: string; toCurrency: string; lastUpdated: string }>>(`/currency/rates/${baseCurrency}`);
    return response.data;
  }

  // Health check
  async getHealth(): Promise<{ success: boolean; message: string; timestamp: string; version: string; environment: string }> {
    const response = await fetch(`${this.baseUrl.replace('/api/v1', '')}/health`);
    return response.json();
  }
}

export const apiService = new ApiService();
export default apiService;
