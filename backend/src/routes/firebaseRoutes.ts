import { Router } from 'express';
import firebaseController from '../controllers/firebaseController';

const router = Router();

/**
 * @route   GET /api/v1/firebase/config
 * @desc    Get sanitized Firebase configuration
 * @access  Public
 */
router.get('/config', firebaseController.getFirebaseConfig);

/**
 * @route   GET /api/v1/firebase/auth-info
 * @desc    Get Firebase auth information
 * @access  Public
 */
router.get('/auth-info', firebaseController.getFirebaseAuthInfo);

/**
 * @route   POST /api/v1/firebase/session
 * @desc    Generate session information
 * @access  Public
 */
router.post('/session', firebaseController.generateSessionInfo);

/**
 * @route   GET /api/v1/firebase/validate-config
 * @desc    Validate Firebase configuration
 * @access  Public
 */
router.get('/validate-config', firebaseController.validateFirebaseConfig);

/**
 * @route   GET /api/v1/firebase/user/:userId
 * @desc    Get user profile from Firebase
 * @access  Public (for now, can be made private later)
 */
router.get('/user/:userId', firebaseController.getUserProfile);

/**
 * @route   GET /api/v1/firebase/user/:userId/status
 * @desc    Get account status from Firebase
 * @access  Public (for now, can be made private later)
 */
router.get('/user/:userId/status', firebaseController.getAccountStatus);

export default router;
