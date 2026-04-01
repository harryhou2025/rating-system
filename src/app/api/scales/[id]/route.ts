import { NextResponse } from 'next/server';
import getDB from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    
    // 从数据库中获取量表数据
    const scale = await db.get(
      `SELECT * FROM scales WHERE id = ?`,
      [id]
    );

    if (!scale) {
      return NextResponse.json(
        { error: '量表不存在' },
        { status: 404 }
      );
    }

    // 获取该量表的题目
    const scaleQuestions = await db.all(
      `SELECT * FROM questions WHERE scale_id = ? ORDER BY "order" ASC`,
      [id]
    );

    // 转换数据格式
    const formattedScale = {
      id: scale.id,
      title: scale.title,
      description: scale.description,
      category: scale.category,
      targetAudience: scale.target_audience,
      estimatedTime: scale.estimated_time,
      instructions: scale.instructions,
      resultInterpretation: scale.result_interpretation,
      isActive: scale.is_active === 1,
      questions: scaleQuestions.map(q => ({
        id: q.id,
        scaleId: q.scale_id,
        content: q.content,
        type: q.type,
        options: JSON.parse(q.options),
        order: q.order,
        scoringType: q.scoring_type,
        dimension: q.dimension,
      }))
    };

    const response = NextResponse.json(formattedScale);
    // 不设置缓存，确保后台修改后前端能实时显示更新
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching scale:', error);
    return NextResponse.json(
      { error: '获取量表失败' },
      { status: 500 }
    );
  }
}
