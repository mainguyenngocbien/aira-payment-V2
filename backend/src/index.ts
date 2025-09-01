import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Import routes
import userRoutes from './routes/userRoutes';
import walletRoutes from './routes/walletRoutes';
import currencyRoutes from './routes/currencyRoutes';
import firebaseRoutes from './routes/firebaseRoutes';
import authRoutes from './routes/authRoutes';
import walletManagerRoutes from './routes/walletManagerRoutes';
import balanceRoutes from './routes/balanceRoutes';

// Import middlewares
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 7003;

// Security middleware with custom configuration
app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.firebase.com", "https://identitytoolkit.googleapis.com"],
      frameSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:7001', // Frontend development
    'http://127.0.0.1:7001',
    'https://airapayment.olym3.xyz', // Production frontend URL
    process.env['FRONTEND_URL'] // Additional frontend URL from env
  ].filter(Boolean) as string[],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env['NODE_ENV'] === 'development') {
  app.use(morgan('dev'));
}
app.use(requestLogger);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'AIRA Payment Backend API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env['NODE_ENV'] || 'development'
  });
});

// API routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/wallet', walletRoutes);
app.use('/api/v1/currency', currencyRoutes);
app.use('/api/v1/firebase', firebaseRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/wallet-manager', walletManagerRoutes);
app.use('/api/v1/balance', balanceRoutes);

// API documentation endpoint
app.get('/api/v1/docs', (_req, res) => {
  res.json({
    success: true,
    message: 'AIRA Payment API Documentation',
    version: '1.0.0',
    endpoints: {
      health: {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint'
      },
      user: {
        profile: {
          method: 'GET',
          path: '/api/v1/user/me',
          description: 'Get current user profile'
        },
        accountStatus: {
          method: 'GET',
          path: '/api/v1/user/account/active',
          description: 'Get account status'
        }
      },
      wallet: {
        balance: {
          method: 'GET',
          path: '/api/v1/wallet/balance/:currency',
          description: 'Get wallet balance for specific currency'
        },
        allBalances: {
          method: 'GET',
          path: '/api/v1/wallet/balance',
          description: 'Get all wallet balances'
        }
      },
      currency: {
        rate: {
          method: 'GET',
          path: '/api/v1/currency/rate/:fromCurrency/:toCurrency',
          description: 'Get exchange rate between two currencies'
        },
        rates: {
          method: 'GET',
          path: '/api/v1/currency/rates/:baseCurrency',
          description: 'Get all exchange rates for a base currency'
        }
      },
      firebase: {
        config: {
          method: 'GET',
          path: '/api/v1/firebase/config',
          description: 'Get sanitized Firebase configuration'
        },
        authInfo: {
          method: 'GET',
          path: '/api/v1/firebase/auth-info',
          description: 'Get Firebase auth information'
        },
        session: {
          method: 'POST',
          path: '/api/v1/firebase/session',
          description: 'Generate session information'
        },
        validateConfig: {
          method: 'GET',
          path: '/api/v1/firebase/validate-config',
          description: 'Validate Firebase configuration'
        },
        userProfile: {
          method: 'GET',
          path: '/api/v1/firebase/user/:userId',
          description: 'Get user profile from Firebase'
        },
        userStatus: {
          method: 'GET',
          path: '/api/v1/firebase/user/:userId/status',
          description: 'Get account status from Firebase'
        }
      },
      auth: {
        googleSignIn: {
          method: 'POST',
          path: '/api/v1/auth/signin/google',
          description: 'Sign in with Google (proxy to Firebase)'
        },
        appleSignIn: {
          method: 'POST',
          path: '/api/v1/auth/signin/apple',
          description: 'Sign in with Apple (proxy to Firebase)'
        },
        emailSignIn: {
          method: 'POST',
          path: '/api/v1/auth/signin/email',
          description: 'Sign in with email/password (proxy to Firebase)'
        },
        emailSignUp: {
          method: 'POST',
          path: '/api/v1/auth/signup/email',
          description: 'Sign up with email/password (proxy to Firebase)'
        },
        verifyEmail: {
          method: 'POST',
          path: '/api/v1/auth/verify-email',
          description: 'Verify email (proxy to Firebase)'
        }
      }
    },
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log('🚀 AIRA Payment Backend API Server');
  console.log('=====================================');
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env['NODE_ENV'] || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/v1/docs`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);
  console.log('=====================================');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  process.exit(0);
});

export default app;
