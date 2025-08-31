import { Request, Response } from 'express';
import walletService from '../services/walletService';
import { ApiResponse, WalletBalance } from '../types';

export class WalletController {
  /**
   * GET /api/v1/wallet/balance/:currency
   * Get wallet balance for specific currency
   */
  async getBalance(req: Request, res: Response): Promise<void> {
    try {
      const { currency } = req.params;
      
      if (!currency) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'Currency parameter is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const balance = await walletService.getBalance(currency);
      
      const response: ApiResponse<WalletBalance> = {
        success: true,
        data: balance,
        message: `Wallet balance for ${currency.toUpperCase()} retrieved successfully`,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting wallet balance:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve wallet balance',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/wallet/balance
   * Get all wallet balances
   */
  async getAllBalances(_req: Request, res: Response): Promise<void> {
    try {
      const balances = await walletService.getAllBalances();
      
      const response: ApiResponse<WalletBalance[]> = {
        success: true,
        data: balances,
        message: 'All wallet balances retrieved successfully',
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting all wallet balances:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve wallet balances',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new WalletController();
