import { Router } from 'express';
import walletController from '../controllers/walletController';

const router = Router();

/**
 * @route   GET /api/v1/wallet/balance/:currency
 * @desc    Get wallet balance for specific currency
 * @access  Public (for now, can be made private later)
 */
router.get('/balance/:currency', walletController.getBalance);

/**
 * @route   GET /api/v1/wallet/balance
 * @desc    Get all wallet balances
 * @access  Public (for now, can be made private later)
 */
router.get('/balance', walletController.getAllBalances);

export default router;
