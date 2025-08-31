import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../lib/logger';

import { generateVerificationCode } from '@/lib/verificationUtils';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Generate verification code
    const code = generateVerificationCode();

    // Email configuration from environment variables
    const emailConfig = {
      service: 'sendgrid' as const, // or 'nodemailer', 'mailgun', 'aws-ses'
      apiKey: process.env.SENDGRID_API_KEY,
      fromEmail: process.env.EMAIL_FROM_ADDRESS || 'noreply@aira-payment.com',
      fromName: process.env.EMAIL_FROM_NAME || 'AIRA Payment'
    };

    // Send verification email
    const success = await sendVerificationEmail(
      {
        to: email,
        code: code,
        userName: email.split('@')[0] // Extract name from email
      },
      emailConfig
    );

    if (success) {
      // In a real app, you would store the code in database with expiration
      logger.log(`Verification code ${code} sent to ${email}`);
      
      return NextResponse.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send verification code' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Send verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
