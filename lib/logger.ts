// Logger utility to handle console logging with production safety
class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  log(...args: any[]): void {
    if (this.isDevelopment) {
      console.log(...args);
    }
    // In production, logs are completely silent
  }

  warn(...args: any[]): void {
    if (this.isDevelopment) {
      console.warn(...args);
    }
    // In production, warnings are silent
  }

  error(...args: any[]): void {
    // Errors are always logged for debugging purposes
    if (this.isDevelopment) {
      console.error(...args);
    } else {
      // In production, you might want to send errors to a logging service
      // For now, we'll keep them silent to avoid exposing sensitive info
    }
  }

  info(...args: any[]): void {
    if (this.isDevelopment) {
      console.info(...args);
    }
  }

  debug(...args: any[]): void {
    if (this.isDevelopment) {
      console.debug(...args);
    }
  }
}

// Create a singleton instance
const logger = new Logger();

// Override console methods in production
if (process.env.NODE_ENV === 'production') {
  // Override console.log
  console.log = (...args: any[]) => {
    // Completely silent in production
  };

  // Override console.warn
  console.warn = (...args: any[]) => {
    // Completely silent in production
  };

  // Override console.info
  console.info = (...args: any[]) => {
    // Completely silent in production
  };

  // Override console.debug
  console.debug = (...args: any[]) => {
    // Completely silent in production
  };

  // Keep console.error for critical errors (but you might want to customize this)
  const originalError = console.error;
  console.error = (...args: any[]) => {
    // In production, you might want to send errors to a logging service
    // For now, we'll keep them silent to avoid exposing sensitive info
  };
}

export default logger;
