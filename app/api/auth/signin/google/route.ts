import { NextRequest, NextResponse } from 'next/server';
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

    const result = await authService.signInWithGoogle(idToken);
    
    const response: ApiResponse<typeof result> = {
      success: true,
      data: result,
      message: 'Google sign-in successful',
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Google sign-in error:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'GOOGLE_SIGNIN_FAILED',
        message: 'Google sign-in failed'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
