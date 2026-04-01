import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { withAdminAuth } from '@/lib/middleware';

async function handler(request: Request) {
  try {
    const db = await getDB();
    
    const users = await db.all(
      `SELECT id, email, name, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: '获取用户列表失败' },
      { status: 500 }
    );
  }
}

// 使用管理员权限中间件
export const GET = withAdminAuth(handler);