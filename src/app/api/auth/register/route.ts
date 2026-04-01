import { NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth';
import getDB from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    const db = await getDB();
    
    const existingUser = await db.get(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    const hashedPassword = hashPassword(password);
    const userId = uuidv4();

    const result = await db.run(
      'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
      [userId, email, hashedPassword, name]
    );

    const user = await db.get(
      'SELECT id, email, name, role FROM users WHERE email = ?',
      [email]
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: '注册失败，请稍后重试' },
      { status: 500 }
    );
  }
}
