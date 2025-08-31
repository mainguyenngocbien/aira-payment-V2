import { Request, Response } from 'express';
import balanceService from '../services/balanceService';
import { ApiResponse } from '../types';

export class BalanceController {
  /**
   * Get USDT balance for a specific address on a specific network
   */
  static async getUSDTBalance(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const { network = 'base-sepolia' } = req.query;
      
      if (!address) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Address is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const balanceInfo = await balanceService.getUSDTBalance(address, network as string);
      
      const response: ApiResponse<typeof balanceInfo> = {
        success: true,
        data: balanceInfo,
        message: 'USDT balance retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get USDT balance',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get ETH balance for a specific address on a specific network
   */
  static async getETHBalance(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const { network = 'base-sepolia' } = req.query;
      
      if (!address) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Address is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const balanceInfo = await balanceService.getETHBalance(address, network as string);
      
      const response: ApiResponse<typeof balanceInfo> = {
        success: true,
        data: balanceInfo,
        message: 'ETH balance retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get ETH balance',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get all balances (ETH + USDT) for a specific address on a specific network
   */
  static async getAllBalances(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const { network = 'base-sepolia' } = req.query;
      
      if (!address) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Address is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const balances = await balanceService.getAllBalances(address, network as string);
      
      const response: ApiResponse<typeof balances> = {
        success: true,
        data: balances,
        message: 'All balances retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get all balances',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get USDT balances for multiple addresses on a specific network
   */
  static async getMultipleUSDTBalances(req: Request, res: Response): Promise<void> {
    try {
      const { addresses } = req.body;
      const { network = 'base-sepolia' } = req.query;
      
      if (!addresses || !Array.isArray(addresses) || addresses.length === 0) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Addresses array is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const balances = await balanceService.getMultipleUSDTBalances(addresses, network as string);
      
      const response: ApiResponse<typeof balances> = {
        success: true,
        data: balances,
        message: 'Multiple USDT balances retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get multiple USDT balances',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Check if address has USDT balance on a specific network
   */
  static async hasUSDTBalance(req: Request, res: Response): Promise<void> {
    try {
      const { address } = req.params;
      const { network = 'base-sepolia' } = req.query;
      
      if (!address) {
        const response: ApiResponse<null> = {
          success: false,
          data: null,
          message: 'Address is required',
          timestamp: new Date().toISOString()
        };
        res.status(400).json(response);
        return;
      }

      const hasBalance = await balanceService.hasUSDTBalance(address, network as string);
      
      const response: ApiResponse<{ address: string; hasBalance: boolean }> = {
        success: true,
        data: { address, hasBalance },
        message: 'USDT balance check completed',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to check USDT balance',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }

  /**
   * Get network information for a specific network
   */
  static async getNetworkInfo(req: Request, res: Response): Promise<void> {
    try {
      const { network = 'base-sepolia' } = req.query;
      const networkInfo = await balanceService.getNetworkInfo(network as string);
      
      const response: ApiResponse<typeof networkInfo> = {
        success: true,
        data: networkInfo,
        message: 'Network information retrieved successfully',
        timestamp: new Date().toISOString()
      };
      
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to get network info',
        timestamp: new Date().toISOString()
      };
      res.status(500).json(response);
    }
  }
}
