import { Request, Response } from 'express';
import firebaseService from '../services/firebaseService';
import { ApiResponse } from '../types';

export class FirebaseController {
  /**
   * GET /api/v1/firebase/config
   * Get sanitized Firebase configuration
   */
  async getFirebaseConfig(_req: Request, res: Response): Promise<void> {
    try {
      const config = await firebaseService.getFirebaseConfig();
      
      const response: ApiResponse<typeof config> = {
        success: true,
        data: config,
        message: 'Firebase configuration retrieved successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting Firebase config:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve Firebase configuration',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/firebase/auth-info
   * Get Firebase auth information
   */
  async getFirebaseAuthInfo(_req: Request, res: Response): Promise<void> {
    try {
      // Use sanitized values for security
      const authInfo = await firebaseService.getFirebaseAuthInfo('Sanitized', 'localhost', '3000');
      
      const response: ApiResponse<typeof authInfo> = {
        success: true,
        data: authInfo,
        message: 'Firebase auth information retrieved successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting Firebase auth info:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve Firebase auth information',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /api/v1/firebase/session
   * Generate session information
   */
  async generateSessionInfo(req: Request, res: Response): Promise<void> {
    try {
      const { userId, email, emailVerified } = req.body;

      if (!userId || !email) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'userId and email are required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const sessionInfo = await firebaseService.generateSessionInfo(userId, email, emailVerified);
      
      const response: ApiResponse<typeof sessionInfo> = {
        success: true,
        data: sessionInfo,
        message: 'Session information generated successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error generating session info:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to generate session information',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/firebase/validate-config
   * Validate Firebase configuration
   */
  async validateFirebaseConfig(_req: Request, res: Response): Promise<void> {
    try {
      const validation = await firebaseService.validateFirebaseConfig();
      
      const response: ApiResponse<typeof validation> = {
        success: true,
        data: validation,
        message: validation.valid ? 'Firebase configuration is valid' : 'Firebase configuration has errors',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error validating Firebase config:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to validate Firebase configuration',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/firebase/user/:userId
   * Get user profile from Firebase
   */
  async getUserProfile(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'userId parameter is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const userProfile = await firebaseService.getUserProfile(userId);
      
      const response: ApiResponse<typeof userProfile> = {
        success: true,
        data: userProfile,
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
   * GET /api/v1/firebase/user/:userId/status
   * Get account status from Firebase
   */
  async getAccountStatus(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      if (!userId) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'userId parameter is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const accountStatus = await firebaseService.getAccountStatus(userId);
      
      const response: ApiResponse<typeof accountStatus> = {
        success: true,
        data: accountStatus,
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

export default new FirebaseController();
