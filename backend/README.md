# AIRA Payment Backend API

A Node.js + TypeScript backend API for the AIRA Payment application.

## 🚀 Features

- **Express.js** with TypeScript
- **RESTful API** design
- **CORS** enabled for frontend integration
- **Security** with Helmet middleware
- **Logging** with Morgan and custom request logger
- **Error handling** with centralized error middleware
- **Type safety** with TypeScript interfaces

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   Then edit `.env` file with your configuration.

3. **Development mode:**
   ```bash
   npm run dev
   ```

4. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## 📁 Project Structure

```
src/
├── index.ts              # Entry point
├── types/                # TypeScript interfaces
│   └── index.ts
├── routes/               # API routes
│   ├── userRoutes.ts
│   ├── walletRoutes.ts
│   └── currencyRoutes.ts
├── controllers/          # Route controllers
│   ├── userController.ts
│   ├── walletController.ts
│   └── currencyController.ts
├── services/             # Business logic
│   ├── userService.ts
│   ├── walletService.ts
│   └── currencyService.ts
└── middlewares/          # Express middlewares
    ├── errorHandler.ts
    └── logger.ts
```

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

### Documentation
- `GET /api/v1/docs` - API documentation

## 🎯 Example API Responses

### User Profile
```json
{
  "success": true,
  "data": {
    "id": "user_123456789",
    "name": "Web3 Thanh Nha",
    "email": "thanh.nha@aira.com"
  },
  "message": "User profile retrieved successfully",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Wallet Balance
```json
{
  "success": true,
  "data": {
    "balance": 123.45,
    "currency": "USDT",
    "lastUpdated": "2025-01-01T00:00:00.000Z"
  },
  "message": "Wallet balance for USDT retrieved successfully",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### Exchange Rate
```json
{
  "success": true,
  "data": {
    "rate": 24500,
    "fromCurrency": "USDT",
    "toCurrency": "VND",
    "lastUpdated": "2025-01-01T00:00:00.000Z"
  },
  "message": "Exchange rate from USDT to VND retrieved successfully",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

## 🔧 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run clean` - Clean build directory

## 🌍 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3003` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 🔒 Security

- **Helmet** for security headers
- **CORS** configured for frontend integration
- **Request validation** and sanitization
- **Error handling** without exposing sensitive information

## 📊 Logging

The API includes comprehensive logging:
- **Request logging** with response times
- **Error logging** with stack traces
- **Development logging** with Morgan
- **Custom request logger** with colored output

## 🚀 Deployment

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

3. **Environment setup:**
   - Set `NODE_ENV=production`
   - Configure `FRONTEND_URL` for production
   - Set up proper CORS origins

## 🔗 Frontend Integration

The backend is configured to work with the AIRA Payment frontend running on `http://localhost:3000`. CORS is enabled to allow cross-origin requests.

## 📝 Development

### Adding New Endpoints

1. Create a new service in `src/services/`
2. Create a new controller in `src/controllers/`
3. Create a new route in `src/routes/`
4. Add the route to `src/index.ts`

### Error Handling

All errors are handled centrally through the error middleware. Controllers should throw errors or use the error response format.

## 🤝 Contributing

1. Follow TypeScript best practices
2. Add proper error handling
3. Include request validation
4. Add appropriate logging
5. Update documentation

## 📄 License

MIT License - see LICENSE file for details.
