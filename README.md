# AIRA Payment - Full Stack Application

A complete payment application with Next.js frontend and Express.js backend API.

## 🚀 Features

### Frontend (Next.js + TypeScript)
- **Modern UI** with Tailwind CSS and DaisyUI
- **Authentication** with Firebase (Email/Password, Google, Apple)
- **Email Verification** flow with pending status page
- **Dashboard UI** with wallet management
- **Mobile-First** responsive design
- **Security** with console log removal in production

### Backend (Express.js + TypeScript)
- **RESTful API** with TypeScript
- **User Management** endpoints
- **Wallet Management** with balance tracking
- **Currency Exchange** rates
- **Security** with Helmet and CORS
- **Comprehensive Logging**

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## 🛠️ Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Clone the repository
git clone <repository-url>
cd payment

# Run the automated setup script
npm run setup
```

This will:
- Install all dependencies (frontend + backend)
- Build the backend
- Create necessary environment files
- Start both servers automatically

### Option 2: Manual Setup

#### 1. Frontend Setup
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase configuration

# Start development server
npm run dev
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Set up environment variables
cp env.example .env

# Build the backend
npm run build

# Start development server
npm run dev
```

## 🔧 Available Scripts

### Frontend Scripts
- `npm run dev` - Start frontend development server
- `npm run build` - Build frontend for production
- `npm run start` - Start frontend production server
- `npm run lint` - Run ESLint

### Backend Scripts
- `npm run dev:backend` - Start backend development server
- `npm run build:backend` - Build backend for production
- `npm run start:backend` - Start backend production server

### Full Stack Scripts
- `npm run dev:full` - Start both frontend and backend in development
- `npm run build:full` - Build both frontend and backend
- `npm run start:full` - Start both frontend and backend in production
- `npm run setup` - Automated setup and run script

## 🌐 Application URLs

### Development
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3003
- **Backend Health Check**: http://localhost:3003/health
- **API Documentation**: http://localhost:3003/api/v1/docs

### Production
- Configure environment variables for production URLs

## 🔌 API Endpoints

### Health Check
- `GET /health` - Server health check

### User API
- `GET /api/v1/user/me` - Get current user profile
- `GET /api/v1/user/account/active` - Get account status

### Wallet API
- `GET /api/v1/wallet/balance/:currency` - Get wallet balance for specific currency
- `GET /api/v1/wallet/balance` - Get all wallet balances

### Currency API
- `GET /api/v1/currency/rate/:fromCurrency/:toCurrency` - Get exchange rate
- `GET /api/v1/currency/rates/:baseCurrency` - Get all rates for base currency

## 📁 Project Structure

```
payment/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── verify-email/      # Email verification page
│   └── ...
├── components/            # React components
│   ├── LoginCard.tsx
│   ├── EmailLoginForm.tsx
│   ├── EmailVerificationPending.tsx
│   └── ...
├── lib/                   # Utilities and configurations
│   ├── firebase.ts
│   ├── logger.ts
│   └── ...
├── hooks/                 # Custom React hooks
├── scripts/               # Build and utility scripts
├── backend/               # Express.js backend
│   ├── src/
│   │   ├── index.ts       # Entry point
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic
│   │   ├── middlewares/   # Express middlewares
│   │   └── types/         # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── package.json           # Frontend package.json
└── README.md
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Email Configuration
SENDGRID_API_KEY=your-sendgrid-key
EMAIL_FROM_ADDRESS=your-email@domain.com
EMAIL_FROM_NAME=Your Name
```

### Backend (.env)
```env
# Server Configuration
PORT=3003
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## 🔒 Security Features

### Frontend
- Console log removal in production
- Environment variable validation
- Firebase security rules
- Email verification requirement

### Backend
- Helmet security headers
- CORS configuration
- Input validation
- Error handling without sensitive data exposure

## 📊 Development Workflow

1. **Start Development**: `npm run dev:full`
2. **Frontend Development**: http://localhost:3000
3. **Backend Development**: http://localhost:3003
4. **API Testing**: Use the documentation at http://localhost:3003/api/v1/docs

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the .next folder
```

### Backend (Heroku/DigitalOcean)
```bash
cd backend
npm run build
npm start
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include request validation
4. Add appropriate logging
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000 and 3003 are available
2. **Environment variables**: Ensure all required env vars are set
3. **Firebase configuration**: Verify Firebase project settings
4. **CORS issues**: Check backend CORS configuration

### Getting Help

- Check the API documentation: http://localhost:3003/api/v1/docs
- Review the backend logs for errors
- Check browser console for frontend errors
