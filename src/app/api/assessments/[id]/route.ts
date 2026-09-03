import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// 匿名测评的结果页依赖 UUID 作为访问凭据（分享链接），GET 保持按 UUID 访问
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

// 删除测评：仅管理员或测评本人可删；匿名测评（user_id 为空）仅管理员可删
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const decoded = token ? verifyToken(token) : null;

    if (!decoded) {
      return NextResponse.json({ error: '未授权访问' }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDB();

    const assessment = await db.get('SELECT user_id FROM assessments WHERE id = ?', [id]);
    if (!assessment) {
      return NextResponse.json({ error: '测评不存在' }, { status: 404 });
    }

    if (decoded.role !== 'admin' && assessment.user_id !== decoded.userId) {
      return NextResponse.json({ error: '无权删除该测评' }, { status: 403 });
    }

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
