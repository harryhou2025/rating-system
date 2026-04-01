import { NextResponse } from 'next/server';
import getDB from '@/lib/db';
import { withAdminAuth } from '@/lib/middleware';

export async function GET() {
  try {
    const db = await getDB();
    
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const assessmentCount = await db.get('SELECT COUNT(*) as count FROM assessments');
    const completedCount = await db.get("SELECT COUNT(*) as count FROM assessments WHERE status = 'completed'");
    const abandonedCount = await db.get("SELECT COUNT(*) as count FROM assessments WHERE status = 'abandoned'");

    // 量表统计
    const scaleStats = await db.all(`
      SELECT 
        s.id as scale_id,
        s.title as scale_title,
        COUNT(a.id) as total_participants,
        SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) as completed_count,
        SUM(CASE WHEN a.status = 'abandoned' THEN 1 ELSE 0 END) as abandoned_count,
        ROUND(CASE WHEN COUNT(a.id) > 0 THEN (SUM(CASE WHEN a.status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(a.id)) ELSE 0 END, 2) as completion_rate
      FROM scales s
      LEFT JOIN assessments a ON s.id = a.scale_id
      WHERE s.is_active = 1
      GROUP BY s.id, s.title
      ORDER BY total_participants DESC
    `);

    // 每日趋势
    const dailyTrends = await db.all(`
      SELECT 
        date(started_at) as date,
        COUNT(*) as assessments,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completions
      FROM assessments
      WHERE started_at >= date('now', '-30 days')
      GROUP BY date(started_at)
      ORDER BY date DESC
      LIMIT 30
    `);

    return NextResponse.json({
      totalUsers: parseInt(userCount.count),
      totalAssessments: parseInt(assessmentCount.count),
      completedAssessments: parseInt(completedCount.count),
      abandonedAssessments: parseInt(abandonedCount.count),
      scaleStats: scaleStats,
      dailyTrends: dailyTrends.reverse(),
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: '获取统计数据失败' },
      { status: 500 }
    );
  }
}
