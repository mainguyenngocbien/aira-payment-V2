import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router();

/**
 * @route   GET /api/v1/user/me
 * @desc    Get current user profile
 * @access  Public (for now, can be made private later)
 */
router.get('/me', userController.getProfile);

/**
 * @route   GET /api/v1/user/account/active
 * @desc    Get account status
 * @access  Public (for now, can be made private later)
 */
router.get('/account/active', userController.getAccountStatus);

export default router;
