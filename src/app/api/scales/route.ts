import { NextResponse } from 'next/server';
import getDB from '@/lib/db';

export async function GET() {
  try {
    // 从数据库中获取量表数据
    const db = await getDB();
    
    const scales = await db.all(
      `SELECT * FROM scales
       WHERE is_active = 1
       ORDER BY created_at DESC`
    );
    
    // 转换数据格式以匹配前端期望的结构
    const formattedScales = scales.map(scale => ({
      id: scale.id,
      title: scale.title,
      description: scale.description,
      category: scale.category,
      targetAudience: scale.target_audience,
      estimatedTime: scale.estimated_time,
      instructions: scale.instructions,
      resultInterpretation: scale.result_interpretation,
      isActive: scale.is_active === 1,
    }));
    
    const response = NextResponse.json(formattedScales);
    // 不设置缓存，确保后台修改后前端能实时显示更新
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return response;
  } catch (error) {
    console.error('Error fetching scales:', error);
    return NextResponse.json(
      { error: '获取量表列表失败' },
      { status: 500 }
    );
  }
}
