import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    // 从请求头中获取token（日志中不得输出 token 或用户数据）
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: '未登录' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return NextResponse.json(
        { error: '登录已过期' },
        { status: 401 }
      );
    }

    const db = await getDB();

    // 获取当前用户的测评记录
    const assessments = await db.all(
      `SELECT a.*, s.title as scale_title, s.category as scale_category
       FROM assessments a
       LEFT JOIN scales s ON a.scale_id = s.id
       WHERE a.user_id = ?
       ORDER BY a.completed_at DESC`,
      [decoded.userId]
    );

    const parsedAssessments = assessments.map(a => ({
      ...a,
      answers: a.answers ? JSON.parse(a.answers) : null,
      result: a.result ? JSON.parse(a.result) : null,
    }));

    return NextResponse.json(parsedAssessments);
  } catch (error) {
    console.error('Error fetching user assessments:', error);
    return NextResponse.json(
      { error: '获取测评记录失败' },
      { status: 500 }
    );
  }
}
