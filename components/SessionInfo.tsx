'use client';

import { useState } from 'react';
import logger from '../lib/logger';

import { Copy, Check } from 'lucide-react';
import { generateAuthUrl } from '@/lib/sessionUtils';

interface SessionInfoProps {
  sessionId: string;
  className?: string;
}

export default function SessionInfo({ sessionId, className = '' }: SessionInfoProps) {
  const [copied, setCopied] = useState<'session' | 'url' | null>(null);

  const authUrl = generateAuthUrl(sessionId);

  const copyToClipboard = async (text: string, type: 'session' | 'url') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      logger.error('Failed to copy:', err);
    }
  };

  return (
    <div className={`bg-blue-50 rounded-lg p-4 ${className}`}>
      {/* Session ID */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-blue-700">Session ID:</span>
          <button
            onClick={() => copyToClipboard(sessionId, 'session')}
            className="btn btn-xs btn-ghost"
            title="Copy Session ID"
          >
            {copied === 'session' ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        <code className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-800 font-mono block w-full break-all">
          {sessionId}
        </code>
      </div>

      {/* Auth URL */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-blue-600">Auth URL:</span>
          <button
            onClick={() => copyToClipboard(authUrl, 'url')}
            className="btn btn-xs btn-ghost"
            title="Copy Auth URL"
          >
            {copied === 'url' ? (
              <Check className="w-3 h-3 text-green-600" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
        <code className="text-xs bg-blue-200 px-2 py-1 rounded text-blue-800 font-mono block w-full break-all">
          {authUrl}
        </code>
      </div>

      {/* Copy feedback */}
      {copied && (
        <div className="text-xs text-green-600 mt-2 text-center">
          ✓ {copied === 'session' ? 'Session ID' : 'Auth URL'} copied to clipboard!
        </div>
      )}
    </div>
  );
}
