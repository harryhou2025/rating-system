import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 从请求头中获取token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing or invalid authorization header');
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('Received token:', token);
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    
    if (!decoded) {
      console.log('Token verification failed');
      return NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      );
    }

    console.log('User ID from token:', decoded.userId);

    const db = await getDB();
    
    // 先检查用户是否存在
    const user = await db.get('SELECT id, email FROM users WHERE id = ?', [decoded.userId]);
    console.log('Found user:', user);
    
    // 获取当前用户的测评记录
    const assessments = await db.all(
      `SELECT a.*, s.title as scale_title, s.category as scale_category
       FROM assessments a
       LEFT JOIN scales s ON a.scale_id = s.id
       WHERE a.user_id = ?
       ORDER BY a.completed_at DESC`,
      [decoded.userId]
    );

    console.log('Found assessments:', assessments.length);
    console.log('Assessments:', assessments);

    const parsedAssessments = assessments.map(a => ({
      ...a,
      answers: a.answers ? JSON.parse(a.answers) : null,
      result: a.result ? JSON.parse(a.result) : null,
    }));
    
    console.log('Returning assessments:', parsedAssessments.length);
    return NextResponse.json(parsedAssessments);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    return NextResponse.json(
      { error: '获取测评记录失败' },
      { status: 500 }
    );
  }
}
