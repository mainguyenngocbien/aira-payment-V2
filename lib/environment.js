// Environment detection and configuration for Node.js
class EnvironmentDetector {
  constructor() {
    this.config = this.detectEnvironment();
  }

  detectEnvironment() {
    // Server-side detection
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

  getConfig() {
    return this.config;
  }

  isLocal() {
    return this.config.isLocal;
  }

  isGCP() {
    return this.config.isGCP;
  }

  isProduction() {
    return this.config.isProduction;
  }

  getApiBaseUrl() {
    return this.config.apiBaseUrl;
  }

  getFrontendUrl() {
    return this.config.frontendUrl;
  }

  getEnvironment() {
    return this.config.environment;
  }

  getEnvironmentInfo() {
    return `Environment: ${this.config.environment} | API: ${this.config.apiBaseUrl} | Frontend: ${this.config.frontendUrl}`;
  }
}

// Create singleton instance
const environmentDetector = new EnvironmentDetector();

module.exports = environmentDetector;
