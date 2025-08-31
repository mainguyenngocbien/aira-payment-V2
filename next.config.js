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
  
  // Ensure proper output format
  output: 'standalone',
}

module.exports = nextConfig
