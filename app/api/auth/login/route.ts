import { NextRequest, NextResponse } from 'next/server';
import logger from '../../../../lib/logger';


// Mock user database (in real app, this would be a real database)
const mockUsers = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123', // In real app, this would be hashed
    name: 'Test User',
    verified: true,
    createdAt: new Date().toISOString()
  }
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user in database (mock)
    const user = mockUsers.find(u => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (in real app, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if email is verified
    if (!user.verified) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 401 }
      );
    }

    // In a real app, you would:
    // 1. Generate JWT token
    // 2. Set session cookie
    // 3. Log login activity

    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      verified: user.verified,
      createdAt: user.createdAt
    };

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token: 'mock-jwt-token' // In real app, this would be a real JWT
    });

  } catch (error) {
    logger.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
