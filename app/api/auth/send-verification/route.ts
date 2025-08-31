import { NextRequest, NextResponse } from 'next/server';
import logger from '@/lib/logger';
import { ApiResponse } from '@/lib/types';
import { generateVerificationCode } from '@/lib/verificationUtils';
import { sendVerificationEmail } from '@/lib/emailService';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'MISSING_EMAIL',
          message: 'Email is required'
        },
        timestamp: new Date().toISOString()
      }, { status: 400 });
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
      
      const response: ApiResponse<{ email: string }> = {
        success: true,
        data: { email },
        message: 'Verification code sent successfully',
        timestamp: new Date().toISOString()
      };

      return NextResponse.json(response, { status: 200 });
    } else {
      return NextResponse.json({
        success: false,
        error: {
          code: 'EMAIL_SEND_FAILED',
          message: 'Failed to send verification code'
        },
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    logger.error('Send verification error:', error);
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
