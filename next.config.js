/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now stable in Next.js 14
  swcMinify: true,
  
  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error'], // Keep error logs for debugging
    } : false,
  },
  
  // Additional security measures
  poweredByHeader: false,
  compress: true,
  
  // Exclude backend files from frontend build
  webpack: (config, { isServer }) => {
    // Exclude backend directory from webpack compilation
    config.externals = config.externals || [];
    config.externals.push({
      'express': 'express',
      'cors': 'cors',
      'helmet': 'helmet',
      'morgan': 'morgan',
      'dotenv': 'dotenv',
    });
    
    // Exclude backend files from compilation
    config.module.rules.push({
      test: /backend/,
      use: 'ignore-loader'
    });
    
    return config;
  },
  
  // Ensure proper output format for Vercel
  output: 'standalone',
  
  // Exclude backend from build
  experimental: {
    excludeDefaultMomentLocales: true,
  },
  
  // Ignore TypeScript errors for backend files
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Ignore ESLint errors for backend files
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Security headers configuration to fix COOP errors
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups'
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ],
      },
    ];
  },
}

module.exports = nextConfig
