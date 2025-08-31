import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: 'Sanitized', // Hide real user agent
      ip: 'Sanitized', // Hide real IP
      timestamp: new Date().toISOString()
    };

    // Log in different colors based on status code
    if (res.statusCode >= 500) {
      console.error('🚨 Error Request:', logData);
    } else if (res.statusCode >= 400) {
      console.warn('⚠️  Warning Request:', logData);
    } else {
      console.log('✅ Success Request:', logData);
    }
  });

  next();
};
