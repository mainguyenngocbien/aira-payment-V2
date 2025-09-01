'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import logger from '@/lib/logger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ClientErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ClientErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-50">
          <div className="max-w-md w-full">
            <div className="card bg-white shadow-lg border-0">
              <div className="card-body p-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Something went wrong
                </h2>
                <p className="text-gray-600 mb-4">
                  We encountered an error while loading the application.
                </p>
                {this.state.error && (
                  <details className="text-left mb-4">
                    <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                      Error Details
                    </summary>
                    <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.reload();
                    }
                  }}
                  className="btn btn-primary"
                >
                  Reload Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ClientErrorBoundary;
