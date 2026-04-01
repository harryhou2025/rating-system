import { NextResponse } from 'next/server';
import { comparePassword, generateToken } from '@/lib/auth';
import getDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: '请填写邮箱和密码' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const user = await db.get(
      'SELECT id, email, password, name, role FROM users WHERE email = ?',
      [email]
    );

    console.log('Found user:', user);

    if (!user) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    console.log('User ID:', user.id);

    if (!comparePassword(password, user.password)) {
      return NextResponse.json(
        { error: '邮箱或密码错误' },
        { status: 401 }
      );
    }

    console.log('Generating token with user ID:', user.id);
    const token = generateToken(user.id, user.role);
    console.log('Generated token:', token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: '登录失败，请稍后重试' },
      { status: 500 }
    );
  }
}
