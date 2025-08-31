import { UserProfile, AccountStatus } from '../types';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string | undefined;
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

export class FirebaseService {
  private firebaseConfig: FirebaseConfig;

  constructor() {
    // Load Firebase config from environment variables
    this.firebaseConfig = {
      apiKey: process.env['FIREBASE_API_KEY'] || '',
      authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || '',
      projectId: process.env['FIREBASE_PROJECT_ID'] || '',
      storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || '',
      messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || '',
      appId: process.env['FIREBASE_APP_ID'] || '',
      measurementId: process.env['FIREBASE_MEASUREMENT_ID']
    };
  }

  /**
   * Get Firebase configuration (sanitized for frontend)
   */
  async getFirebaseConfig(): Promise<Partial<FirebaseConfig>> {
    // Return minimal config for security
    return {
      authDomain: this.firebaseConfig.authDomain || '',
      projectId: this.firebaseConfig.projectId || ''
    };
  }

  /**
   * Get Firebase auth information
   */
  async getFirebaseAuthInfo(_userAgent: string, _domain: string, _port: string): Promise<FirebaseAuthInfo> {
    return {
      authAvailable: true,
      currentDomain: 'localhost', // Sanitized
      currentPort: '3000', // Sanitized
      userAgent: 'Mozilla/5.0 (Sanitized)', // Sanitized
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate session information
   */
  async generateSessionInfo(userId: string, email: string, emailVerified: boolean): Promise<SessionInfo> {
    const sessionId = this.generateSessionId();
    const authUrl = this.generateAuthUrl(sessionId);

    return {
      sessionId,
      authUrl,
      user: email,
      userId,
      emailVerified,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get user profile from Firebase (mock implementation)
   */
  async getUserProfile(userId: string): Promise<UserProfile> {
    // In real implementation, this would fetch from Firebase Admin SDK
    return {
      id: userId,
      name: 'Web3 Thanh Nha',
      email: 'thanh.nha@aira.com'
    };
  }

  /**
   * Get account status from Firebase (mock implementation)
   */
  async getAccountStatus(_userId: string): Promise<AccountStatus> {
    // In real implementation, this would check Firebase Auth
    return {
      active: true,
      lastActive: new Date().toISOString()
    };
  }

  /**
   * Validate Firebase configuration
   */
  async validateFirebaseConfig(): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = [];
    const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

    for (const field of requiredFields) {
      if (!this.firebaseConfig[field as keyof FirebaseConfig]) {
        errors.push(`Missing ${field}`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Generate session ID in Aira Payment format
   */
  private generateSessionId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generate auth URL in Aira Payment format
   */
  private generateAuthUrl(sessionId: string): string {
    return `auth.olym3.xyz/auth/cx/_:nav&m:login&psid:${sessionId}`;
  }
}

export default new FirebaseService();
