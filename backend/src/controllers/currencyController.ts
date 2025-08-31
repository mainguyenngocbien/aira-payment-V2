import { Request, Response } from 'express';
import currencyService from '../services/currencyService';
import { ApiResponse, CurrencyRate } from '../types';

export class CurrencyController {
  /**
   * GET /api/v1/currency/rate/:fromCurrency/:toCurrency
   * Get exchange rate between two currencies
   */
  async getRate(req: Request, res: Response): Promise<void> {
    try {
      const { fromCurrency, toCurrency } = req.params;
      
      if (!fromCurrency || !toCurrency) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETERS',
            message: 'Both fromCurrency and toCurrency parameters are required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const rate = await currencyService.getRate(fromCurrency, toCurrency);
      
      const response: ApiResponse<CurrencyRate> = {
        success: true,
        data: rate,
        message: `Exchange rate from ${fromCurrency.toUpperCase()} to ${toCurrency.toUpperCase()} retrieved successfully`,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting exchange rate:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve exchange rate',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * GET /api/v1/currency/rates/:baseCurrency
   * Get all exchange rates for a base currency
   */
  async getRatesForCurrency(req: Request, res: Response): Promise<void> {
    try {
      const { baseCurrency } = req.params;
      
      if (!baseCurrency) {
        res.status(400).json({
          success: false,
          error: {
            code: 'MISSING_PARAMETER',
            message: 'baseCurrency parameter is required'
          },
          timestamp: new Date().toISOString()
        });
        return;
      }

      const rates = await currencyService.getRatesForCurrency(baseCurrency);
      
      const response: ApiResponse<CurrencyRate[]> = {
        success: true,
        data: rates,
        message: `All exchange rates for ${baseCurrency.toUpperCase()} retrieved successfully`,
        timestamp: new Date().toISOString()
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting exchange rates:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve exchange rates',
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default new CurrencyController();
