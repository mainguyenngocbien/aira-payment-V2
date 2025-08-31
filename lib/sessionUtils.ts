// Utility functions for Session ID generation and Auth URL formatting

/**
 * Generate an Aira Payment style Session ID
 * Format: 20-character alphanumeric string (lowercase)
 * Example: "meymeleqfevhjd4vv7i"
 */
export const generateSessionId = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Generate 20 characters
  for (let i = 0; i < 20; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Generate Auth URL in Aira Payment format
 * Format: auth.olym3.xyz/auth/cx/_:nav&m:login&psid:{sessionId}
 */
export const generateAuthUrl = (sessionId: string): string => {
  return `auth.olym3.xyz/auth/cx/_:nav&m:login&psid:${sessionId}`;
};

/**
 * Validate Session ID format
 * Must be 20 characters, alphanumeric, lowercase
 */
export const validateSessionId = (sessionId: string): boolean => {
  const regex = /^[a-z0-9]{20}$/;
  return regex.test(sessionId);
};

/**
 * Format Session ID for display
 * Adds spacing for better readability
 */
export const formatSessionId = (sessionId: string): string => {
  // Add spaces every 4 characters for readability
  return sessionId.replace(/(.{4})/g, '$1 ').trim();
};

import apiService from './apiService';
import logger from './logger';


/**
 * Get current session info
 */
export const getSessionInfo = () => {
  const sessionId = generateSessionId();
  const authUrl = generateAuthUrl(sessionId);
  
  return {
    sessionId,
    authUrl,
    formattedSessionId: formatSessionId(sessionId),
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate session info using API service
 */
export const generateSessionInfo = async (userId: string, email: string, emailVerified: boolean) => {
  try {
    return await apiService.generateSessionInfo(userId, email, emailVerified);
  } catch (error) {
    logger.error('Failed to generate session info via API:', error);
    // Fallback to local generation
    const sessionId = generateSessionId();
    const authUrl = generateAuthUrl(sessionId);
    return {
      sessionId,
      authUrl,
      user: email,
      userId,
      emailVerified,
      timestamp: new Date().toISOString()
    };
  }
};
