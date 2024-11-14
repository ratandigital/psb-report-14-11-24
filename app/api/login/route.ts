// app/api/login/route.ts

import { NextResponse, NextRequest } from 'next/server';
import prismadb from '@/lib/prismadb';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { branchCode, password } = await request.json();

    if (!branchCode || !password) {
      return NextResponse.json(
        { message: 'Branch code and password are required' },
        { status: 400 }
      );
    }

    // Convert branchCode to an integer
    const branchCodeInt = parseInt(branchCode, 10);
    if (isNaN(branchCodeInt)) {
      return NextResponse.json(
        { message: 'Invalid branch code format' },
        { status: 400 }
      );
    }

    const user = await prismadb.userCreate.findFirst({
      where: { branchCode: branchCodeInt },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ message: 'Invalid branch code or password' }, { status: 401 });
    }

    if (user.status !== 'approved' && user.status !== 'admin') {
      return NextResponse.json({ message: 'Your account is not approved' }, { status: 403 });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, status: user.status },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({ message: 'Login successful' });
    response.headers.append(
      'Set-Cookie',
      `session=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict`
    );

    return response;
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
