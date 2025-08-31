import { Request, Response } from 'express';
import walletManagerService from '../services/walletManagerService';
import { ApiResponse } from '../types';

export class WalletManagerController {
  static async getOrCreateWallet(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      
      if (!email) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Email is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const walletInfo = walletManagerService.getOrCreateWallet(email);
      
      const response: ApiResponse<{ 
        evmWallet: string; 
        celestiaWallet: string; 
        solanaWallet: string; 
        aptosWallet: string; 
        suiWallet: string; 
        mnemonic: string; 
        airaId: string 
      }> = {
        success: true,
        data: walletInfo,
        message: 'Wallets retrieved/created successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Failed to get or create wallet',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getWalletByEmail(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      
      if (!email) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Email is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const walletInfo = walletManagerService.getWalletByEmail(email);
      
      if (!walletInfo) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Wallet not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<{ 
        evmWallet: string; 
        celestiaWallet: string; 
        solanaWallet: string; 
        aptosWallet: string; 
        suiWallet: string; 
        mnemonic: string; 
        airaId: string 
      }> = {
        success: true,
        data: walletInfo,
        message: 'Wallets retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Failed to get wallet',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async getAllWallets(_req: Request, res: Response): Promise<void> {
    try {
      const wallets = walletManagerService.getAllWallets();
      
      const response: ApiResponse<Array<{ 
        email: string; 
        evmWallet: string; 
        celestiaWallet: string; 
        solanaWallet: string; 
        aptosWallet: string; 
        suiWallet: string; 
        mnemonic: string; 
        airaId?: string 
      }>> = {
        success: true,
        data: wallets,
        message: 'All wallets retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Failed to get all wallets',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  static async deleteWallet(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.params;
      
      if (!email) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Email is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const deleted = walletManagerService.deleteWallet(email);
      
      if (!deleted) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Wallet not found',
          timestamp: new Date().toISOString()
        };
        res.status(404).json(response);
        return;
      }

      const response: ApiResponse<null> = {
        success: true,
        data: null,
        message: 'Wallet deleted successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: 'Failed to delete wallet',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}
