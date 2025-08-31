'use client';

import { useEffect, useState } from 'react';
import logger from '../lib/logger';
import apiService from '@/lib/apiService';

export default function FirebaseDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Completely disabled for security
  return null;
}
