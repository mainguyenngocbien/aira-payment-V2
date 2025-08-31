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
    
    return config;
  },
  
  // Ensure proper output format for Vercel
  output: 'standalone',
  
  // Exclude backend from build
  experimental: {
    excludeDefaultMomentLocales: true,
  },
}

module.exports = nextConfig
