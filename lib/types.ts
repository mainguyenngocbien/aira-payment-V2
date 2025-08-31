// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
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

// Wallet related types
export interface WalletBalance {
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface CurrencyRate {
  rate: number;
  fromCurrency: string;
  toCurrency: string;
  lastUpdated: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

// Auth types
export interface AuthResult {
  user: UserProfile;
  token: string;
  emailVerified: boolean;
}

// Request types
export interface AuthenticatedRequest {
  user?: User;
}

// Service types
export interface UserService {
  getProfile(): Promise<UserProfile>;
  getAccountStatus(): Promise<AccountStatus>;
}

export interface WalletService {
  getBalance(currency: string): Promise<WalletBalance>;
}

export interface CurrencyService {
  getRate(fromCurrency: string, toCurrency: string): Promise<CurrencyRate>;
}
