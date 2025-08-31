'use client';

import { useState, useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export default function ErrorMessage({ 
  message, 
  onClose, 
  autoHide = true, 
  duration = 5000 
}: ErrorMessageProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="alert alert-error shadow-lg mb-4">
      <AlertCircle className="w-5 h-5" />
      <span>{message}</span>
      {onClose && (
        <button 
          onClick={handleClose}
          className="btn btn-sm btn-ghost btn-circle"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
