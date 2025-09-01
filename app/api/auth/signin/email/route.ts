import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../../lib/logger';

import authService from '@/lib/authService';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

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

    const result = await authService.signInWithEmail(email, password);
    
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: 'Email sign-in successful',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    logger.error('Email sign-in error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'EMAIL_SIGNIN_FAILED',
        message: 'Email sign-in failed'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
