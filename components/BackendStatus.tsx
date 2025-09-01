'use client';

import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import logger from '@/lib/logger';

interface BackendStatusProps {
  className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkBackendStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch('https://apiaira.olym3.xyz:7003/api/v1/health', {
        signal: controller.signal,
        method: 'GET',
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        setStatus('online');
        logger.log('✅ Backend server is online');
      } else {
        setStatus('offline');
        logger.warn('⚠️ Backend server responded with error');
      }
    } catch (error) {
      setStatus('offline');
      logger.warn('⚠️ Backend server is offline:', error);
    } finally {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkBackendStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'online':
        return <Wifi className="w-4 h-4 text-success" />;
      case 'offline':
        return <WifiOff className="w-4 h-4 text-error" />;
      case 'checking':
        return <AlertCircle className="w-4 h-4 text-warning animate-pulse" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'online':
        return 'Backend Online';
      case 'offline':
        return 'Backend Offline';
      case 'checking':
        return 'Checking...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'text-success';
      case 'offline':
        return 'text-error';
      case 'checking':
        return 'text-warning';
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-xs ${className}`}>
      {getStatusIcon()}
      <span className={getStatusColor()}>{getStatusText()}</span>
      {lastCheck && (
        <span className="text-gray-500">
          ({lastCheck.toLocaleTimeString()})
        </span>
      )}
    </div>
  );
};

export default BackendStatus;
