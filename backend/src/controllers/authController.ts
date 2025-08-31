import { Request, Response } from 'express';
import authService from '../services/authService';
import { ApiResponse } from '../types';

export class AuthController {
  /**
   * POST /api/v1/auth/signin/google
   * Proxy Google sign-in to Firebase
   */
  static async signInWithGoogle(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID_TOKEN',
            message: 'ID token is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authService.signInWithGoogle(idToken);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Google sign-in successful',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Google sign-in error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'GOOGLE_SIGNIN_FAILED',
          message: 'Google sign-in failed'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /api/v1/auth/signin/apple
   * Proxy Apple sign-in to Firebase
   */
  static async signInWithApple(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID_TOKEN',
            message: 'ID token is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authService.signInWithApple(idToken);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Apple sign-in successful',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Apple sign-in error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'APPLE_SIGNIN_FAILED',
          message: 'Apple sign-in failed'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /api/v1/auth/signin/email
   * Proxy email sign-in to Firebase
   */
  static async signInWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authService.signInWithEmail(email, password);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Email sign-in successful',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Email sign-in error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'EMAIL_SIGNIN_FAILED',
          message: 'Email sign-in failed'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /api/v1/auth/signup/email
   * Proxy email sign-up to Firebase
   */
  static async signUpWithEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, displayName } = req.body;

      if (!email || !password) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_CREDENTIALS',
            message: 'Email and password are required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authService.signUpWithEmail(email, password, displayName);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Email sign-up successful',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Email sign-up error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'EMAIL_SIGNUP_FAILED',
          message: 'Email sign-up failed'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * POST /api/v1/auth/verify-email
   * Proxy email verification to Firebase
   */
  static async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_ID_TOKEN',
            message: 'ID token is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const result = await authService.verifyEmail(idToken);
      
      const response: ApiResponse<typeof result> = {
        success: true,
        data: result,
        message: 'Email verification successful',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'EMAIL_VERIFICATION_FAILED',
          message: 'Email verification failed'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}
