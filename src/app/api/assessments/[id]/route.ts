import { NextResponse } from 'next/server';
import getDB from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    
    const assessment = await db.get(
      'SELECT * FROM assessments WHERE id = ?',
      [id]
    );

    if (!assessment) {
      return NextResponse.json(
        { error: '测评不存在' },
        { status: 404 }
      );
    }

    // 解析answers和result字段
    if (assessment.answers) {
      assessment.answers = JSON.parse(assessment.answers);
    }
    if (assessment.result) {
      assessment.result = JSON.parse(assessment.result);
    }

    return NextResponse.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: '获取测评失败' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    
    await db.run('DELETE FROM assessments WHERE id = ?', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { error: '删除测评失败' },
      { status: 500 }
    );
  }
}
