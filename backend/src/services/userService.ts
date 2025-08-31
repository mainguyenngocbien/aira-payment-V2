import { UserProfile, AccountStatus } from '../types';

export class UserService {
  /**
   * Get user profile
   */
  async getProfile(): Promise<UserProfile> {
    // Mock data - in real app, this would fetch from database
    return {
      id: 'user_123456789',
      name: 'Web3 Thanh Nha',
      email: 'thanh.nha@aira.com'
    };
  }

  /**
   * Get account status
   */
  async getAccountStatus(): Promise<AccountStatus> {
    // Mock data - in real app, this would check from database
    return {
      active: true,
      lastActive: new Date().toISOString()
    };
  }
}

export default new UserService();
