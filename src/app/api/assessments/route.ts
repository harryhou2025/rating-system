import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { calculateScore } from '@/lib/scoring';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { userId, scaleId, answers, ipAddress } = await request.json();
    
    const db = await getDB();
    
    // 计算得分
    const result = calculateScore(scaleId, answers);
    
    const assessmentId = uuidv4();
    
    await db.run(
      `INSERT INTO assessments (id, user_id, scale_id, answers, result, ip_address, status, completed_at)
       VALUES (?, ?, ?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)`,
      [
        assessmentId,
        userId || null,
        scaleId,
        JSON.stringify(answers),
        JSON.stringify(result),
        ipAddress
      ]
    );

    const assessment = await db.get(
      'SELECT * FROM assessments WHERE id = ?',
      [assessmentId]
    );

    if (assessment.answers) {
      assessment.answers = JSON.parse(assessment.answers);
    }
    if (assessment.result) {
      assessment.result = JSON.parse(assessment.result);
    }
    
    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: '创建测评失败' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDB();
    
    const assessments = await db.all(
      `SELECT a.*, s.title as scale_title, u.name as user_name
       FROM assessments a
       LEFT JOIN scales s ON a.scale_id = s.id
       LEFT JOIN users u ON a.user_id = u.id
       ORDER BY a.started_at DESC
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
      { error: '获取测评列表失败' },
      { status: 500 }
    );
  }
}
