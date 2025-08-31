import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

// Firebase Auth Proxy Routes
router.post('/signin/google', AuthController.signInWithGoogle);
router.post('/signin/apple', AuthController.signInWithApple);
router.post('/signin/email', AuthController.signInWithEmail);
router.post('/signup/email', AuthController.signUpWithEmail);
router.post('/verify-email', AuthController.verifyEmail);

export default router;
