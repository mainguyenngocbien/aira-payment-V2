import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../lib/logger';

import authService from '@/lib/authService';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_ID_TOKEN',
          message: 'ID token is required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const result = await authService.verifyEmail(idToken);
    
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: 'Email verification successful',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error('Email verification error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EMAIL_VERIFICATION_FAILED',
        message: 'Email verification failed'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
