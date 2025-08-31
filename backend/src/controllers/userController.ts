import { Request, Response } from 'express';
import userService from '../services/userService';
import { ApiResponse, UserProfile, AccountStatus } from '../types';

export class UserController {
  /**
   * GET /api/v1/user/me
   * Get current user profile
   */
  async getProfile(_req: Request, res: Response): Promise<void> {
    try {
      const profile = await userService.getProfile();
      
      const response: ApiResponse<UserProfile> = {
        success: true,
        data: profile,
        message: 'User profile retrieved successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting user profile:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve user profile',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/user/account/active
   * Get account status
   */
  async getAccountStatus(_req: Request, res: Response): Promise<void> {
    try {
      const status = await userService.getAccountStatus();
      
      const response: ApiResponse<AccountStatus> = {
        success: true,
        data: status,
        message: 'Account status retrieved successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting account status:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve account status',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new UserController();
