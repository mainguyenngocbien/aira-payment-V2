import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { ApiResponse } from '@/lib/types';
import { verifyEmailCode, createUserAccount } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_CREDENTIALS',
          message: 'Email and code are required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Verify the code
    const isValid = await verifyEmailCode(email, code);

    if (!isValid) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'INVALID_CODE',
          message: 'Invalid verification code'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }

    // Create user account
    const accountCreated = await createUserAccount(email, {
      email: email,
      verified: true,
      name: email.split('@')[0]
    });

    if (accountCreated) {
      const userData = {
        email: email,
        verified: true,
        name: email.split('@')[0]
      };

      const response: ApiResponse<typeof userData> = {
        success: true,
        data: userData,
        message: 'Account created successfully',
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'ACCOUNT_CREATION_FAILED',
          message: 'Failed to create account'
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Verify code error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
