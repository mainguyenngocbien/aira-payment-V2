import logger from '../lib/logger';
// Utility functions for email verification

/**
 * Generate a 6-digit verification code
 */
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Mask email for display (e.g., "user@example.com" -> "u•••@e••••••.com")
 */
export const maskEmail = (email: string): string => {
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.charAt(0) + '•'.repeat(localPart.length - 1);
  const maskedDomain = domain.charAt(0) + '•'.repeat(domain.length - 1);
  return `${maskedLocal}@${maskedDomain}`;
};

/**
 * Validate verification code format
 */
export const validateVerificationCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};

/**
 * Format verification code with spaces (e.g., "123456" -> "123 456")
 */
export const formatVerificationCode = (code: string): string => {
  return code.replace(/(\d{3})(\d{3})/, '$1 $2');
};

/**
 * Simulate sending verification email
 */
export const sendVerificationEmail = async (email: string, code: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  logger.log(`Verification code ${code} sent to ${email}`);
  
  // In a real app, this would send an actual email
  // For demo purposes, we'll just return true
  return true;
};

/**
 * Simulate verifying code
 */
export const verifyCode = async (email: string, code: string): Promise<boolean> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  logger.log(`Verifying code ${code} for ${email}`);
  
  // In a real app, this would verify against the backend
  // For demo purposes, we'll accept any 6-digit code
  return validateVerificationCode(code);
};
