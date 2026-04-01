import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { withAdminAuth } from '@/lib/middleware';

async function handler(request: Request) {
  try {
    const db = await getDB();
    
    const assessments = await db.all(
      `SELECT a.*, s.title as scale_title, s.category as scale_category, u.name as user_name
       FROM assessments a
       LEFT JOIN scales s ON a.scale_id = s.id
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.completed_at DESC
       LIMIT 100`
    );

    const parsedAssessments = assessments.map(a => ({
      ...a,
      answers: a.answers ? JSON.parse(a.answers) : null,
      result: a.result ? JSON.parse(a.result) : null,
    }));
    
    return NextResponse.json(parsedAssessments);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return NextResponse.json(
      { error: '获取测评记录失败' },
      { status: 500 }
    );
  }
}

// 使用管理员权限中间件
export const GET = withAdminAuth(handler);