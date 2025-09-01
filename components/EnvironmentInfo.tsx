'use client';

import React from 'react';
import { Server, Monitor, Globe } from 'lucide-react';
import environmentDetector from '@/lib/environment';

interface EnvironmentInfoProps {
  showDetails?: boolean;
  className?: string;
}

const EnvironmentInfo: React.FC<EnvironmentInfoProps> = ({ 
  showDetails = false, 
  className = '' 
}) => {
  const config = environmentDetector.getConfig();

  const getEnvironmentIcon = () => {
    switch (config.environment) {
      case 'local':
        return <Monitor className="w-4 h-4 text-blue-500" />;
      case 'gcp':
        return <Server className="w-4 h-4 text-green-500" />;
      case 'production':
        return <Globe className="w-4 h-4 text-purple-500" />;
      default:
        return <Server className="w-4 h-4 text-gray-500" />;
    }
  };

  const getEnvironmentColor = () => {
    switch (config.environment) {
      case 'local':
        return 'text-blue-600';
      case 'gcp':
        return 'text-green-600';
      case 'production':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const getEnvironmentLabel = () => {
    switch (config.environment) {
      case 'local':
        return 'Local Development';
      case 'gcp':
        return 'GCP Production';
      case 'production':
        return 'Production';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      {getEnvironmentIcon()}
      <span className={getEnvironmentColor()}>{getEnvironmentLabel()}</span>
      
      {showDetails && (
        <div className="hidden md:block text-gray-500">
          | API: {config.apiBaseUrl.replace('https://', '').replace('http://', '')}
        </div>
      )}
    </div>
  );
};

export default EnvironmentInfo;
