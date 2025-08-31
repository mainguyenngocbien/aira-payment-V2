import { Router } from 'express';
import { BalanceController } from '../controllers/balanceController';

const router = Router();

// Get USDT balance for a specific address
router.get('/usdt/:address', BalanceController.getUSDTBalance);

// Get ETH balance for a specific address
router.get('/eth/:address', BalanceController.getETHBalance);

// Get all balances (ETH + USDT) for a specific address
router.get('/all/:address', BalanceController.getAllBalances);

// Get USDT balances for multiple addresses
router.post('/usdt/multiple', BalanceController.getMultipleUSDTBalances);

// Check if address has USDT balance
router.get('/usdt/:address/has-balance', BalanceController.hasUSDTBalance);

// Get network information
router.get('/network-info', BalanceController.getNetworkInfo);

export default router;
