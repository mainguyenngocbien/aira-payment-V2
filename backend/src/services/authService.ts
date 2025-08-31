import { UserProfile } from '../types';

export interface AuthResult {
  user: UserProfile;
  token: string;
  emailVerified: boolean;
}

export class AuthService {
  constructor() {
    // Firebase API key is loaded from environment but not used in mock implementation
    // This is for future use with Firebase Admin SDK
  }

  /**
   * Sign in with Google (proxy to Firebase)
   */
  async signInWithGoogle(_idToken: string): Promise<AuthResult> {
    // In production, this would use Firebase Admin SDK
    // For now, return mock data
    return {
      user: {
        id: 'google-user-123',
        name: 'Google User',
        email: 'google@example.com'
      },
      token: 'mock-jwt-token',
      emailVerified: true
    };
  }

  /**
   * Sign in with Apple (proxy to Firebase)
   */
  async signInWithApple(_idToken: string): Promise<AuthResult> {
    // In production, this would use Firebase Admin SDK
    // For now, return mock data
    return {
      user: {
        id: 'apple-user-123',
        name: 'Apple User',
        email: 'apple@example.com'
      },
      token: 'mock-jwt-token',
      emailVerified: true
    };
  }

  /**
   * Sign in with email/password (proxy to Firebase)
   */
  async signInWithEmail(email: string, _password: string): Promise<AuthResult> {
    // In production, this would use Firebase Admin SDK
    // For now, return mock data
    return {
      user: {
        id: 'email-user-123',
        name: email.split('@')[0] || 'User',
        email: email
      },
      token: 'mock-jwt-token',
      emailVerified: true
    };
  }

  /**
   * Sign up with email/password (proxy to Firebase)
   */
  async signUpWithEmail(email: string, _password: string, displayName?: string): Promise<AuthResult> {
    // In production, this would use Firebase Admin SDK
    // For now, return mock data
    return {
      user: {
        id: 'new-user-123',
        name: displayName || email.split('@')[0] || 'User',
        email: email
      },
      token: 'mock-jwt-token',
      emailVerified: false
    };
  }

  /**
   * Verify email (proxy to Firebase)
   */
  async verifyEmail(_idToken: string): Promise<{ success: boolean }> {
    // In production, this would use Firebase Admin SDK
    // For now, return mock success
    return { success: true };
  }

  // Private method for future Firebase Admin SDK integration
  // Currently disabled for security
}

export default new AuthService();
