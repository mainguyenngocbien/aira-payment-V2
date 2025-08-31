// import firebase from 'firebase/compat/app';
// import 'firebase/compat/auth';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import logger from '../lib/logger';

import { getAuth, GoogleAuthProvider, OAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, updateProfile } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
  measurementId: requiredEnvVars.measurementId!
};

// Alternative config (if needed)
const alternativeConfig = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_ALT_STORAGE_BUCKET || requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!
};

// Validate configuration
const validateConfig = (config: any) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field]);

  if (missingFields.length > 0) {
    logger.error('Missing Firebase config fields:', missingFields);
    return false;
  }

  // Check if config values are not empty
  const emptyFields = requiredFields.filter(field => {
    const value = config[field];
    return !value || value === '' || value === 'undefined';
  });

  if (emptyFields.length > 0) {
    logger.error('Empty Firebase config fields:', emptyFields);
    return false;
  }

  logger.log('✅ Firebase config validation passed');
  return true;
};

// Initialize Firebase
let app: any = null;
let authInstance: any = null;
let analytics: any = null;

if (typeof window !== 'undefined') {
  try {
    // Try primary config first
    if (!validateConfig(firebaseConfig)) {
      throw new Error('Primary config validation failed');
    }

    logger.log('🔧 Initializing Firebase with primary config');

    // Check if Firebase is already initialized
    if ((window as any).firebase) {
      logger.log('⚠️ Firebase already exists in window object');
    }

    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);

    // Initialize Analytics only in browser
    try {
      analytics = getAnalytics(app);
      logger.log('✅ Analytics initialized');
    } catch (analyticsError) {
      logger.warn('⚠️ Analytics initialization failed:', analyticsError);
    }

    logger.log('✅ Firebase initialized successfully');

  } catch (primaryError) {
    logger.error('❌ Primary config failed:', primaryError);

    // Try alternative config
    try {
      logger.log('🔄 Trying alternative config...');

      if (!validateConfig(alternativeConfig)) {
        throw new Error('Alternative config validation failed');
      }

      app = initializeApp(alternativeConfig);
      authInstance = getAuth(app);

      logger.log('✅ Firebase initialized with alternative config');

    } catch (alternativeError) {
      logger.error('❌ Alternative config also failed:', alternativeError);

      // Provide specific error guidance
      if (alternativeError instanceof Error) {
        if (alternativeError.message.includes('configuration-not-found')) {
          logger.error('💡 Solution: Check if the Firebase project exists and config is correct');
          logger.error('💡 Go to: https://console.firebase.google.com/');
          logger.error('💡 Check project ID: aira-p');
          logger.error('💡 Verify web app configuration in Project Settings');
        } else if (alternativeError.message.includes('invalid-api-key')) {
          logger.error('💡 Solution: Check if the API key is correct');
        } else if (alternativeError.message.includes('app/no-app')) {
          logger.error('💡 Solution: Firebase app already initialized');
        }
      }
    }
  }
}

// Initialize providers only if auth is available
let googleProvider: GoogleAuthProvider | null = null;
let appleProvider: OAuthProvider | null = null;

if (authInstance) {
  try {
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account'
    });

    appleProvider = new OAuthProvider('apple.com');
    appleProvider.addScope('email');
    appleProvider.addScope('name');

    logger.log('✅ Auth providers initialized');
  } catch (error) {
    logger.error('❌ Provider initialization error:', error);
  }
} else {
  logger.warn('⚠️ Auth instance not available, providers not initialized');
}

// Firebase Auth functions for email/password
export const createUserWithEmail = async (email: string, password: string, displayName?: string) => {
  if (!authInstance) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }

    // Send email verification
    await sendEmailVerification(user);

    logger.log('✅ User created successfully:', user.email);
    return user;
  } catch (error: any) {
    logger.error('❌ User creation failed:', error);
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  if (!authInstance) {
    throw new Error('Firebase Auth not initialized');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;

    logger.log('✅ User signed in successfully:', user.email);
    return user;
  } catch (error: any) {
    logger.error('❌ Sign in failed:', error);
    throw error;
  }
};

export const sendVerificationEmail = async () => {
  if (!authInstance || !authInstance.currentUser) {
    throw new Error('No user logged in');
  }

  try {
    await sendEmailVerification(authInstance.currentUser);
    logger.log('✅ Verification email sent');
  } catch (error: any) {
    logger.error('❌ Failed to send verification email:', error);
    throw error;
  }
};

export { authInstance as auth, googleProvider, appleProvider };
export default app;
