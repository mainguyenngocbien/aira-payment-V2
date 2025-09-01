// Environment detection and configuration
export interface EnvironmentConfig {
  isLocal: boolean;
  isGCP: boolean;
  isProduction: boolean;
  apiBaseUrl: string;
  frontendUrl: string;
  environment: 'local' | 'gcp' | 'production';
}

class EnvironmentDetector {
  private config: EnvironmentConfig;

  constructor() {
    this.config = this.detectEnvironment();
  }

  private detectEnvironment(): EnvironmentConfig {
    // Check if we're in browser
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = window.location.port;

      // Local development
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('192.168.')) {
        return {
          isLocal: true,
          isGCP: false,
          isProduction: false,
          apiBaseUrl: 'http://localhost:7003/api/v1',
          frontendUrl: `${protocol}//${hostname}:${port || '7001'}`,
          environment: 'local'
        };
      }

      // GCP environment
      if (hostname === 'airapayment.olym3.xyz') {
        return {
          isLocal: false,
          isGCP: true,
          isProduction: true,
          apiBaseUrl: 'https://apiaira.olym3.xyz/api/v1',
          frontendUrl: 'https://airapayment.olym3.xyz',
          environment: 'gcp'
        };
      }

      // Production environment (Vercel, etc.)
      if (hostname.includes('vercel.app') || hostname.includes('netlify.app')) {
        return {
          isLocal: false,
          isGCP: false,
          isProduction: true,
          apiBaseUrl: 'https://apiaira.olym3.xyz/api/v1',
          frontendUrl: `${protocol}//${hostname}`,
          environment: 'production'
        };
      }
    }

    // Server-side detection
    if (typeof process !== 'undefined') {
      const nodeEnv = process.env.NODE_ENV;
      const isLocalDev = process.env.NODE_ENV === 'development' || 
                        process.env.NEXT_PUBLIC_ENVIRONMENT === 'local';

      if (isLocalDev) {
        return {
          isLocal: true,
          isGCP: false,
          isProduction: false,
          apiBaseUrl: 'http://localhost:7003/api/v1',
          frontendUrl: 'http://localhost:7001',
          environment: 'local'
        };
      }
    }

    // Default to GCP/production
    return {
      isLocal: false,
      isGCP: true,
      isProduction: true,
      apiBaseUrl: 'https://apiaira.olym3.xyz/api/v1',
      frontendUrl: 'https://airapayment.olym3.xyz',
      environment: 'gcp'
    };
  }

  getConfig(): EnvironmentConfig {
    return this.config;
  }

  isLocal(): boolean {
    return this.config.isLocal;
  }

  isGCP(): boolean {
    return this.config.isGCP;
  }

  isProduction(): boolean {
    return this.config.isProduction;
  }

  getApiBaseUrl(): string {
    return this.config.apiBaseUrl;
  }

  getFrontendUrl(): string {
    return this.config.frontendUrl;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  // Helper method to get environment info for debugging
  getEnvironmentInfo(): string {
    return `Environment: ${this.config.environment} | API: ${this.config.apiBaseUrl} | Frontend: ${this.config.frontendUrl}`;
  }
}

// Create singleton instance
const environmentDetector = new EnvironmentDetector();

export default environmentDetector;
