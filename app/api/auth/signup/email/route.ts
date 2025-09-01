import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../../lib/logger';

import authService from '@/lib/authService';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email and password are required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    const result = await authService.signUpWithEmail(email, password, displayName);
    
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: 'Email sign-up successful',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error('Email sign-up error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EMAIL_SIGNUP_FAILED',
        message: 'Email sign-up failed'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
