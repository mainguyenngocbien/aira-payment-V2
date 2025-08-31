import { Router } from 'express';
import currencyController from '../controllers/currencyController';

const router = Router();

/**
 * @route   GET /api/v1/currency/rate/:fromCurrency/:toCurrency
 * @desc    Get exchange rate between two currencies
 * @access  Public (for now, can be made private later)
 */
router.get('/rate/:fromCurrency/:toCurrency', currencyController.getRate);

/**
 * @route   GET /api/v1/currency/rates/:baseCurrency
 * @desc    Get all exchange rates for a base currency
 * @access  Public (for now, can be made private later)
 */
router.get('/rates/:baseCurrency', currencyController.getRatesForCurrency);

export default router;
