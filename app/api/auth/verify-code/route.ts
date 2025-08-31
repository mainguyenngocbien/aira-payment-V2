import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../lib/logger';

import { verifyEmailCode, createUserAccount } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Verify the code
    const isValid = await verifyEmailCode(email, code);

    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Create user account
    const accountCreated = await createUserAccount(email, {
      email: email,
      verified: true,
      name: email.split('@')[0]
    });

    if (accountCreated) {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
        user: {
          email: email,
          verified: true,
          name: email.split('@')[0]
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to create account' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Verify code error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
