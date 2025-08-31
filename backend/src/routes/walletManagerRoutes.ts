import { Router } from 'express';
import { WalletManagerController } from '../controllers/walletManagerController';

const router = Router();

// Get or create wallet for an email
router.post('/wallet', WalletManagerController.getOrCreateWallet);

// Get wallet by email
router.get('/wallet/:email', WalletManagerController.getWalletByEmail);

// Get all wallets
router.get('/wallets', WalletManagerController.getAllWallets);

// Delete wallet by email
router.delete('/wallet/:email', WalletManagerController.deleteWallet);

export default router;
